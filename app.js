/* لاوین — app.js (مشترک بین index / shop / product) */
(()=>{
"use strict";
const OFFER_END='2026-11-01T00:00:00+03:30'; // تاریخ پایان پیشنهاد ویژه را اینجا تنظیم کنید
let FREE=500000, SHIP=45000;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const fa=n=>Number(n||0).toLocaleString('fa-IR'), fa2=n=>n.toLocaleString('fa-IR',{minimumIntegerDigits:2}), money=n=>fa(n)+' تومان';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const enc=encodeURIComponent;
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const _db=get('lavin_db',null),_st=get('lavin_settings',null),_si=get('lavin_site',{}); // تغییرات پنل مدیریت (فعلاً از localStorage)
if(_db){PRODUCTS.splice(0,PRODUCTS.length,..._db.products);CATEGORIES.splice(0,CATEGORIES.length,..._db.categories)}
if(_st){FREE=_st.free;SHIP=_st.ship}
const find=id=>PRODUCTS.find(p=>p.id==id);
const imgs=p=>(p.images||[]).filter(Boolean).slice(0,5); // حداکثر ۵ عکس برای هر محصول
const pic=(p,src)=>`<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy">`;
const art=p=>imgs(p)[0]?pic(p,imgs(p)[0]):(ICONS[p.icon]||ICONS.ring);
const ic=(d,w=19)=>`<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I={search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',heart:'<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1Z"/>',bag:'<path d="M6 2 3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-5H6Z"/><path d="M3 7h18"/><path d="M16 11a4 4 0 0 1-8 0"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',logo:'<path d="M12 3.5 8.5 8h7L12 3.5Z"/><path d="M8.5 8 5 12l7 8 7-8-3.5-4H8.5Z"/><path d="M5 12h14"/>'};
let cart=get('lavin_cart',[]), wish=get('lavin_wish',[]), onWish=()=>{}, onCart=()=>{};

/* ---------- layout مشترک ---------- */
function layout(){
  const nav=[['shop.html','فروشگاه'],['index.html#categories','دسته‌بندی‌ها'],['index.html#bestsellers','پرفروش‌ها'],['index.html#offer','پیشنهاد ویژه'],['#contact','تماس با ما']].map(([h,t])=>`<a href="${h}">${t}</a>`).join('');
  const tk=((_si.ticker&&_si.ticker.length)?_si.ticker:['ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان 🎁','ضمانت اصالت و کیفیت آبکاری ✨','۷ روز مهلت مرجوعی بدون قید و شرط ↩️','جعبه کادویی مخملی هدیه 🎀']).map(t=>`<span>${esc(t)}</span>`).join('');
  $('#site-top').innerHTML=`<div class="ticker" aria-hidden="true"><div class="ticker-track">${tk+tk}</div></div>
  <header class="site-header" id="siteHeader"><div class="container head-inner">
    <a href="index.html" class="brand" aria-label="لاوین؛ صفحه اصلی"><span class="brand-mark">${ic(I.logo,24)}</span><span class="brand-text"><b>لاوین</b><i>Lavin Jewelry</i></span></a>
    <nav class="main-nav" aria-label="منوی اصلی">${nav}</nav>
    <div class="head-actions">
      <button class="icon-btn" id="searchBtn" aria-label="جستجو">${ic(I.search)}</button>
      <a class="icon-btn" href="shop.html?wish=1" aria-label="علاقه‌مندی‌ها">${ic(I.heart)}<span class="dot" id="wishCount">۰</span></a>
      <button class="icon-btn" id="cartBtn" aria-label="سبد خرید">${ic(I.bag)}<span class="dot" id="cartCount">۰</span></button>
      <button class="icon-btn burger" id="burger" aria-label="منو" aria-expanded="false">${ic(I.menu,20)}</button>
    </div></div>
    <nav class="mobile-nav" id="mobileNav" aria-label="منوی موبایل">${nav}</nav></header>`;
  $('#site-bottom').innerHTML=`<footer id="contact"><div class="container"><div class="foot-grid">
    <div class="foot-col"><div class="brand" style="margin-bottom:16px"><span class="brand-mark">${ic(I.logo,22)}</span><span class="brand-text"><b>لاوین</b><i>Lavin Jewelry</i></span></div><p>لاوین، خانه‌ی بدلیجات پاستیلی و لوکس؛ ساخته‌شده برای دخترهایی که دوست دارند هر روز بدرخشند.</p></div>
    <div class="foot-col"><h4>دسترسی سریع</h4><a href="shop.html">همه محصولات</a><a href="index.html#categories">دسته‌بندی‌ها</a><a href="index.html#bestsellers">پرفروش‌ها</a><a href="index.html#offer">پیشنهاد ویژه</a></div>
    <div class="foot-col"><h4>تماس با لاوین</h4><p>☎ ${esc(_si.phone||'۰۲۱-۹۱۰۰۲۲۳۳')}</p><p>📍 ${esc(_si.address||'تهران، خیابان ولیعصر، پاساژ نگین، طبقه ۲')}</p><p>🕘 ${esc(_si.hours||'پاسخگویی: ۹ صبح تا ۹ شب')}</p></div>
  </div><div class="foot-bottom"><span>© ${new Date().toLocaleDateString('fa-IR',{year:'numeric'})} تمامی حقوق برای فروشگاه <b>لاوین</b> محفوظ است.</span></div></div></footer>
  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="cartDrawer" aria-label="سبد خرید"><div class="drawer-head"><h3>سبد خرید شما 🛍</h3><button class="act" id="closeCart" aria-label="بستن">${ic(I.x,17)}</button></div>
    <div class="drawer-body" id="cartBody"></div>
    <div class="drawer-foot"><div class="total-row"><span>جمع کالاها</span><b id="cSub"></b></div><div class="total-row"><span>هزینه ارسال</span><b id="cShip"></b></div><div class="total-row big"><span>مبلغ قابل پرداخت</span><span id="cTotal"></span></div><a class="btn btn-primary btn-block" href="checkout.html">ادامه و پرداخت</a><a class="btn btn-ghost btn-block" href="cart.html" style="margin-top:10px">مشاهده سبد خرید</a></div></aside>
  <div class="modal" id="searchModal" role="dialog" aria-modal="true" aria-label="جستجو"><div class="modal-card" style="max-width:640px;padding:28px"><button class="modal-close" data-close aria-label="بستن">${ic(I.x,17)}</button>
    <h2 style="margin:0 0 16px;font-size:1.1rem;font-weight:900">جستجو در لاوین</h2>
    <input type="search" id="searchInput" placeholder="نام محصول یا دسته‌بندی…" style="width:100%;padding:14px 18px;border-radius:16px;border:1.5px solid var(--line);background:var(--c3)">
    <div id="searchResults" style="margin-top:18px;max-height:50vh;overflow-y:auto"></div></div></div>
  <div class="toast-wrap" id="toasts" aria-live="polite"></div>`;
}

/* ---------- ابزارها ---------- */
function toast(m,t=''){const e=document.createElement('div');e.className='toast '+t;e.innerHTML=`<span>${t==='ok'?'✅':'✨'}</span><span>${esc(m)}</span>`;$('#toasts').appendChild(e);setTimeout(()=>e.remove(),3000)}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});$$('.reveal:not(.in)').forEach(el=>io.observe(el))}
const norm=s=>String(s).replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).toLowerCase();

/* ---------- سبد و علاقه‌مندی (ماندگار در مرورگر) ---------- */
const totals=()=>{const sub=cart.reduce((s,i)=>s+(find(i.id)?.price||0)*i.qty,0),ship=!sub||sub>=FREE?0:SHIP;return{sub,ship,total:sub+ship}};
function renderCart(){
  $('#cartCount').textContent=fa(cart.reduce((s,i)=>s+i.qty,0));
  $('#cartBody').innerHTML=cart.length?cart.map(i=>{const p=find(i.id);return p?`<div class="cart-item"><a class="ci-img" href="product.html?id=${p.id}">${art(p)}</a><div class="ci-info"><b>${esc(p.name)}</b><span>${money(p.price)}</span><div class="qty"><button data-q="${p.id}" data-d="-1" aria-label="کاهش">−</button><b>${fa(i.qty)}</b><button data-q="${p.id}" data-d="1" aria-label="افزایش">+</button></div><button class="ci-del" data-rm="${p.id}">حذف از سبد</button></div></div>`:''}).join(''):'<div class="cart-empty"><p>سبد خرید شما خالی است.<br>وقت خرید یک قطعه‌ی زیباست ✨</p></div>';
  const t=totals();
  $('#cSub').textContent=money(t.sub);$('#cShip').textContent=t.ship?money(t.ship):'رایگان';$('#cTotal').textContent=money(t.total);
  put('lavin_cart',cart);onCart();
}
function add(id,n=1){
  const p=find(id);if(!p)return;if(!p.stock)return toast('این محصول موجود نیست');
  const it=cart.find(i=>i.id==p.id),q=(it?it.qty:0)+n;
  if(q>p.stock)return toast('حداکثر موجودی این محصول '+fa(p.stock)+' عدد است');
  it?it.qty=q:cart.push({id:p.id,qty:n});renderCart();toast(`«${p.name}» به سبد اضافه شد`,'ok');drawer(true);
}
function renderWish(){
  $('#wishCount').textContent=fa(wish.length);
  $$('[data-wish]').forEach(b=>{const on=wish.includes(+b.dataset.wish);b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
}
const drawer=o=>{$('#cartDrawer').classList.toggle('open',o);$('#overlay').classList.toggle('show',o);document.body.classList.toggle('no-scroll',o)};
const closeSearch=()=>{$('#searchModal').classList.remove('show');document.body.classList.remove('no-scroll')};
function search(q){
  const box=$('#searchResults');q=norm(q.trim());
  if(!q){box.innerHTML='<div class="empty-state">نام محصول یا دسته‌بندی را بنویسید…</div>';return}
  const f=PRODUCTS.filter(p=>norm(p.name+' '+p.cat).includes(q));
  box.innerHTML=f.length?f.map(p=>`<a class="cart-item" href="product.html?id=${p.id}"><span class="ci-img">${art(p)}</span><div class="ci-info"><b>${esc(p.name)}</b><span>${money(p.price)}</span></div></a>`).join(''):'<div class="empty-state">محصولی پیدا نشد 😔</div>';
}

/* ---------- کارت محصول ---------- */
function card(p){
  return `<article class="pcard reveal"><div class="pmedia">${p.badge?`<span class="pbadge">${esc(p.badge)}</span>`:''}<button class="wish" data-wish="${p.id}" aria-label="افزودن به علاقه‌مندی‌ها">♡</button><a href="product.html?id=${p.id}" aria-label="${esc(p.name)}">${art(p)}</a></div>
  <div class="pbody"><span class="pcat">${esc(p.cat)}</span><h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
  <div class="pfoot"><div class="price">${fa(p.price)} <small>تومان</small>${p.old>p.price?`<s>${fa(p.old)}</s>`:''}</div><button class="add" data-add="${p.id}"${p.stock?'':' disabled'}>${p.stock?'افزودن':'ناموجود'}</button></div></div></article>`;
}

/* ---------- صفحه اصلی ---------- */
function home(){
  $('#heroSlides').innerHTML=BANNERS.map((b,i)=>{const c=(CATEGORIES.find(x=>x.icon===b.icon)||{}).name||'';
    return `<div class="slide${i?'':' active'}" style="background:${['linear-gradient(135deg,var(--c2),var(--c3) 55%,var(--c2))','linear-gradient(135deg,var(--c3),color-mix(in srgb,var(--c1) 22%,#fff) 60%,var(--c3))','linear-gradient(135deg,color-mix(in srgb,var(--c1) 18%,#fff),var(--c2) 55%,var(--c3))'][i%3]}"><span class="slide-deco d1"></span><span class="slide-deco d2"></span><div class="container slide-grid"><div class="slide-copy"><span class="eyebrow">${esc(b.badge)}</span>${i?'<h2>':'<h1>'}${esc(b.title)}${i?'</h2>':'</h1>'}<p>${esc(b.sub)}</p><div class="slide-actions"><a href="shop.html${c?'?cat='+enc(c):''}" class="btn btn-primary">${esc(b.cta)}</a>${b.price?`<div class="slide-price"><small>شروع قیمت از</small><b>${esc(b.price)}</b></div>`:''}</div></div><div class="slide-art" aria-hidden="true">${ICONS[b.icon]||ICONS.necklace}</div></div></div>`}).join('');
  $('#heroDots').innerHTML=BANNERS.map((_,i)=>`<button class="${i?'':'on'}" data-s="${i}" aria-label="اسلاید ${i+1}"></button>`).join('');
  let si=0,st;const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const go=i=>{const s=$$('.slide');si=(i+s.length)%s.length;s.forEach((x,k)=>x.classList.toggle('active',k===si));$$('#heroDots button').forEach((x,k)=>x.classList.toggle('on',k===si))};
  const play=()=>{clearInterval(st);if(!calm)st=setInterval(()=>go(si+1),6000)};
  $('#heroPrev').onclick=()=>{go(si-1);play()};$('#heroNext').onclick=()=>{go(si+1);play()};
  $('#heroDots').onclick=e=>{const b=e.target.closest('button');if(b){go(+b.dataset.s);play()}};
  $('#hero').onmouseenter=()=>clearInterval(st);$('#hero').onmouseleave=play;play();

  $('#catGrid').innerHTML=CATEGORIES.map(c=>`<a href="shop.html?cat=${enc(c.name)}" class="cat-card reveal"><span class="cat-icon">${ICONS[c.icon]||ICONS.sparkle}</span><b>${esc(c.name)}</b><span>${fa(PRODUCTS.filter(p=>p.cat===c.name).length)} محصول</span></a>`).join('');
  $('#hScroll').innerHTML=[...PRODUCTS].sort((a,b)=>(b.badge==='پرفروش')-(a.badge==='پرفروش')||a.id-b.id).slice(0,8).map(card).join('');
  $('#newGrid').innerHTML=[...PRODUCTS].sort((a,b)=>b.id-a.id).slice(0,8).map(card).join('');
  const sc=$('#hScroll'),step=()=>Math.min(320,sc.clientWidth*.8);
  $('#hNext').onclick=()=>sc.scrollBy({left:-step(),behavior:'smooth'});$('#hPrev').onclick=()=>sc.scrollBy({left:step(),behavior:'smooth'});

  $('#offerArt').innerHTML=ICONS.sparkle;
  if(_si.offerTitle)$('#offer h2').textContent=_si.offerTitle;if(_si.offerText)$('#offer .offer-copy>p').textContent=_si.offerText;
  const end=new Date(_si.offerEnd||OFFER_END).getTime(),L=['روز','ساعت','دقیقه','ثانیه'];
  const tick=()=>{let d=Math.max(0,end-Date.now());if(!d){$('#offer').style.display='none';clearInterval(ti);return}
    $('#countdown').innerHTML=[864e5,36e5,6e4,1e3].map((u,i)=>{const x=Math.floor(d/u);d-=x*u;return `<div class="cd-box"><b>${fa2(x)}</b><span>${L[i]}</span></div>`}).join('')};
  const ti=setInterval(tick,1000);tick();

  const F=[['ارسال سریع','ارسال به سراسر ایران با پست پیشتاز و تیپاکس.','<path d="M1 3h13v13H1z"/><path d="M14 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="17.5" cy="18.5" r="2"/>'],['ضمانت کیفیت','شش ماه ضمانت رنگ و آبکاری تمام محصولات.','<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>'],['پرداخت مطمئن','درگاه بانکی معتبر و امکان کارت به کارت.','<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/>'],['بسته‌بندی کادویی','جعبه مخملی و کارت تبریک هدیه لاوین.','<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13"/><path d="M3 12h18"/>']];
  $('#featGrid').innerHTML=F.map(([t,d,p])=>`<div class="feat reveal"><span class="feat-ic">${ic(p,25)}</span><b>${t}</b><p>${d}</p></div>`).join('');
  $('#testTrack').innerHTML=TESTIMONIALS.map(t=>`<figure class="test reveal" style="margin:0"><div class="stars" aria-label="${t.stars} از ۵">${'★'.repeat(t.stars)}${'☆'.repeat(5-t.stars)}</div><p>«${esc(t.text)}»</p><figcaption class="who"><span class="av">${esc(t.name[0])}</span><div><b>${esc(t.name)}</b><span>${esc(t.city)}</span></div></figcaption></figure>`).join('');
  $('#newsForm').onsubmit=e=>{e.preventDefault();e.target.reset();toast('عضویت شما ثبت شد. ممنون! 🌸','ok')};
}

/* ---------- صفحه فروشگاه ---------- */
function shop(){
  const u=new URLSearchParams(location.search);let cat=u.get('cat')||'',sort='new',only=u.get('wish')==='1';
  const draw=()=>{
    $('#chips').innerHTML=['',...CATEGORIES.map(c=>c.name)].map(n=>`<button class="chip${n===cat?' on':''}" data-c="${esc(n)}" aria-pressed="${n===cat}">${n?esc(n):'همه'}</button>`).join('');
    const S={new:(a,b)=>b.id-a.id,low:(a,b)=>a.price-b.price,high:(a,b)=>b.price-a.price};
    const L=PRODUCTS.filter(p=>(!cat||p.cat===cat)&&(!only||wish.includes(p.id))).sort(S[sort]),t=only?'علاقه‌مندی‌های من':cat||'همه محصولات';
    $('#shopTitle').textContent=t;document.title=t+' | لاوین';$('#shopCount').textContent=fa(L.length)+' محصول';
    $('#shopGrid').innerHTML=L.length?L.map(card).join(''):'<div class="empty-state" style="grid-column:1/-1">محصولی پیدا نشد.</div>';
    renderWish();reveal();
  };
  $('#chips').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;cat=b.dataset.c;only=false;history.replaceState(null,'','shop.html'+(cat?'?cat='+enc(cat):''));draw()};
  $('#sort').onchange=e=>{sort=e.target.value;draw()};
  onWish=()=>{if(only)draw()};draw();
}

/* ---------- صفحه محصول ---------- */
function product(){
  const p=find(new URLSearchParams(location.search).get('id')),m=$('#pd');
  if(!p){document.title='محصول پیدا نشد | لاوین';m.innerHTML='<div class="empty-state"><h1 style="font-size:1.4rem">محصول پیدا نشد</h1><p><a class="btn btn-primary" href="shop.html">بازگشت به فروشگاه</a></p></div>';return}
  const low=p.stock>0&&p.stock<=5;
  document.title=p.name+' | لاوین';$('meta[name=description]').content=p.desc;
  m.innerHTML=`<nav class="crumbs" aria-label="مسیر صفحه"><a href="index.html">خانه</a><span>/</span><a href="shop.html">فروشگاه</a><span>/</span><a href="shop.html?cat=${enc(p.cat)}">${esc(p.cat)}</a><span>/</span><b>${esc(p.name)}</b></nav>
  <div class="pd"><div class="pd-gallery"><div class="pd-media" id="mainPic">${p.badge?`<span class="pbadge">${esc(p.badge)}</span>`:''}${art(p)}</div>${imgs(p).length>1?`<div class="thumbs" role="group" aria-label="تصاویر محصول">${imgs(p).map((x,i)=>`<button type="button" class="${i?'':'on'}" data-pic="${i}" aria-label="تصویر ${fa(i+1)}">${pic(p,x)}</button>`).join('')}</div>`:''}</div>
  <div class="pd-info"><a class="pcat" href="shop.html?cat=${enc(p.cat)}">${esc(p.cat)}</a><h1>${esc(p.name)}</h1>
  <div class="qv-price">${fa(p.price)} <small style="font-size:.75rem;font-weight:500;color:var(--muted)">تومان</small>${p.old>p.price?`<s>${fa(p.old)}</s><span class="pill" style="background:#fdecef;color:#d95a76">${fa(Math.round((1-p.price/p.old)*100))}٪ تخفیف</span>`:''}</div>
  <p class="pd-desc">${esc(p.desc)}</p>
  <p class="pd-stock${p.stock?(low?' low':''):' out'}">${p.stock?(low?'تنها '+fa(p.stock)+' عدد در انبار باقی مانده':'موجود در انبار'):'ناموجود'}</p>
  <div class="pd-buy"><div class="qtybox"><button id="qm" aria-label="کاهش">−</button><b id="qv">۱</b><button id="qp" aria-label="افزایش">+</button></div><button class="btn btn-primary" id="addBtn"${p.stock?'':' disabled'}>افزودن به سبد خرید</button><button class="wish" data-wish="${p.id}" aria-label="افزودن به علاقه‌مندی‌ها">♡</button></div>
  <details class="acc" open><summary>ارسال</summary><p>ارسال ۱ تا ۳ روز کاری. خرید بالای ۵۰۰ هزار تومان ارسال رایگان است.</p></details>
  <details class="acc"><summary>ضمانت و مرجوعی</summary><p>شش ماه ضمانت رنگ و آبکاری، و امکان مرجوعی تا ۷ روز.</p></details></div></div>
  <section style="padding:50px 0"><div class="sec-head" style="margin-bottom:30px"><h2>محصولات مرتبط</h2></div><div class="prod-grid" id="rel"></div></section>`;
  let q=1;const set=n=>{q=Math.max(1,Math.min(p.stock||1,n));$('#qv').textContent=fa(q)};
  $('#qm').onclick=()=>set(q-1);$('#qp').onclick=()=>set(q+1);$('#addBtn').onclick=()=>add(p.id,q);
  $$('.thumbs button').forEach(b=>b.onclick=()=>{$('#mainPic img').src=imgs(p)[+b.dataset.pic];$$('.thumbs button').forEach(x=>x.classList.toggle('on',x===b))});
  $('#rel').innerHTML=PRODUCTS.filter(x=>x.id!==p.id).sort((a,b)=>(b.cat===p.cat)-(a.cat===p.cat)).slice(0,4).map(card).join('');
  const ld=document.createElement('script');ld.type='application/ld+json';
  ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.name,description:p.desc,category:p.cat,...(imgs(p).length&&{image:imgs(p)}),offers:{'@type':'Offer',priceCurrency:'IRR',price:p.price*10,availability:p.stock?'https://schema.org/InStock':'https://schema.org/OutOfStock'}});
  document.head.append(ld);
}

/* ---------- مراحل خرید ---------- */
const steps=n=>`<ol class="steps">${['سبد خرید','اطلاعات و پرداخت','تکمیل سفارش'].map((t,i)=>`<li class="${i<=n?'on':''}"><b>${fa(i+1)}</b>${t}</li>`).join('')}</ol>`;
const emptyBox=()=>'<div class="empty-state"><p>سبد خرید شما خالی است.</p><a class="btn btn-primary" href="shop.html">رفتن به فروشگاه</a></div>';

/* ---------- صفحه سبد خرید ---------- */
function cartPg(){
  const box=$('#cartPage');
  const draw=()=>{
    const rows=cart.map(i=>({i,p:find(i.id)})).filter(r=>r.p),t=totals();
    if(!rows.length){box.innerHTML=emptyBox();return}
    const left=Math.max(0,FREE-t.sub);
    box.innerHTML=`${steps(0)}<div class="co"><div class="panel">${rows.map(({i,p})=>`<div class="crow"><a class="ci-img" href="product.html?id=${p.id}">${art(p)}</a><div class="ci-info"><a href="product.html?id=${p.id}"><b>${esc(p.name)}</b></a><span class="pcat">${esc(p.cat)}</span><button class="ci-del" data-rm="${p.id}">حذف از سبد</button></div><div class="qty"><button data-q="${p.id}" data-d="-1" aria-label="کاهش">−</button><b>${fa(i.qty)}</b><button data-q="${p.id}" data-d="1" aria-label="افزایش">+</button></div><b class="crow-total">${money(p.price*i.qty)}</b></div>`).join('')}</div>
    <aside class="panel sum"><h3>خلاصه سفارش</h3><div class="fbar" aria-hidden="true"><i style="width:${Math.min(100,t.sub/FREE*100)}%"></i></div>
    <p class="hint">${left?money(left)+' تا ارسال رایگان باقی مانده':'🎉 ارسال سفارش شما رایگان است'}</p>
    <div class="total-row"><span>جمع کالاها</span><b>${money(t.sub)}</b></div><div class="total-row"><span>هزینه ارسال</span><b>${t.ship?money(t.ship):'رایگان'}</b></div>
    <div class="total-row big"><span>مبلغ قابل پرداخت</span><span>${money(t.total)}</span></div>
    <a class="btn btn-primary btn-block" href="checkout.html">ادامه و تسویه‌حساب</a></aside></div>`;
  };
  onCart=draw;draw();
}

/* ---------- صفحه تسویه‌حساب ---------- */
const ONLINE=false; // با اتصال درگاه پرداخت، true شود
const PAY={card:'6037-9911-1234-5678',sheba:'IR120570028780010917630101',holder:'فروشگاه لاوین'};
if(_st)Object.assign(PAY,{card:_st.card,sheba:_st.sheba,holder:_st.holder}); // نمونه؛ با اطلاعات واقعی جایگزین شود
function checkoutPg(){
  const box=$('#coPage'),rows=()=>cart.map(i=>({i,p:find(i.id)})).filter(r=>r.p);
  if(!rows().length){box.innerHTML=emptyBox();return}
  const t=totals(),F=(id,l,x='')=>`<div class="field"><label for="${id}">${l}</label><input type="text" id="${id}" ${x}></div>`;
  const radio=(v,logo,ttl,sub,on,dis)=>`<label class="gateway" style="cursor:pointer;align-items:center;opacity:${dis?.55:1}"><span class="gw-logo">${logo}</span><div class="gw-body" style="min-width:auto"><b>${ttl}</b><small>${sub}</small></div><input type="radio" name="pay" value="${v}" ${on?'checked':''} ${dis?'disabled':''} style="width:20px;height:20px;accent-color:var(--c1)"></label>`;
  box.innerHTML=`${steps(1)}<form class="co" id="coForm" novalidate><div>
    <div class="panel"><h3>اطلاعات تحویل‌گیرنده</h3><div class="form-grid" style="margin-top:14px">
      ${F('fName','نام و نام خانوادگی','autocomplete="name"')}${F('fPhone','شماره موبایل','inputmode="tel" autocomplete="tel" placeholder="09123456789"')}
      ${F('fProv','استان','autocomplete="address-level1"')}${F('fCity','شهر','autocomplete="address-level2"')}
      <div class="field full"><label for="fAddr">آدرس کامل</label><textarea id="fAddr" autocomplete="street-address"></textarea></div>
      ${F('fZip','کد پستی (۱۰ رقم)','inputmode="numeric" maxlength="10"')}${F('fNote','توضیحات سفارش (اختیاری)')}</div></div>
    <div class="panel"><h3 style="margin-bottom:14px">روش پرداخت</h3>
      ${radio('online','💳','پرداخت آنلاین',ONLINE?'پرداخت امن با کارت‌های عضو شتاب':'به‌زودی فعال می‌شود',ONLINE,!ONLINE)}
      ${radio('card','C2C','کارت به کارت','واریز مستقیم و آپلود فیش واریزی',!ONLINE,false)}
      <div id="c2c" class="${ONLINE?'hidden':''}"><div class="panel" style="background:var(--c3);margin:0 0 14px">
        <div class="total-row"><span>شماره کارت</span><b dir="ltr">${PAY.card}</b></div><div class="total-row"><span>شماره شبا</span><b dir="ltr" style="font-size:.78rem">${PAY.sheba}</b></div><div class="total-row"><span>به نام</span><b>${esc(PAY.holder)}</b></div>
        <button type="button" class="btn btn-soft btn-sm" id="copyCard">کپی شماره کارت</button></div>
        <label class="uploader" for="fReceipt" style="display:block"><b>آپلود عکس فیش واریزی</b><span>JPG یا PNG — حداکثر ۵ مگابایت</span></label>
        <input type="file" id="fReceipt" accept="image/*" class="hidden"><div class="preview-row" id="rcPrev"></div></div></div></div>
    <aside class="panel sum"><h3>سفارش شما</h3>
      ${rows().map(({i,p})=>`<div class="total-row"><span>${esc(p.name)} × ${fa(i.qty)}</span><b>${money(p.price*i.qty)}</b></div>`).join('')}
      <hr style="border:0;border-top:1px dashed var(--line);margin:12px 0">
      <div class="total-row"><span>جمع کالاها</span><b>${money(t.sub)}</b></div><div class="total-row"><span>هزینه ارسال</span><b>${t.ship?money(t.ship):'رایگان'}</b></div>
      <div class="total-row big"><span>مبلغ قابل پرداخت</span><span>${money(t.total)}</span></div>
      <p id="coErr" class="hint" role="alert" style="color:#d95a76"></p>
      <button class="btn btn-primary btn-block" type="submit">ثبت سفارش</button>
      <a href="cart.html" style="display:block;text-align:center;margin-top:12px;font-size:.85rem;color:var(--muted)">بازگشت به سبد خرید</a></aside></form>`;
  const v=id=>$('#'+id).value.trim(),pay=()=>$('input[name=pay]:checked').value,en=s=>s.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  let receipt=null;
  $$('input[name=pay]').forEach(r=>r.onchange=()=>$('#c2c').classList.toggle('hidden',pay()!=='card'));
  $('#copyCard').onclick=()=>navigator.clipboard?.writeText(PAY.card.replace(/-/g,'')).then(()=>toast('شماره کارت کپی شد','ok'),()=>toast('کپی ناموفق بود'));
  $('#fReceipt').onchange=e=>{const f=e.target.files[0];receipt=null;$('#rcPrev').innerHTML='';if(!f)return;
    if(!/^image\//.test(f.type)||f.size>5*1048576){e.target.value='';return toast('فقط تصویر تا ۵ مگابایت مجاز است')}
    receipt=f;$('#rcPrev').innerHTML=`<div class="preview-img"><img src="${URL.createObjectURL(f)}" alt="فیش واریزی"></div>`};
  const done=o=>{box.innerHTML=`${steps(2)}<div class="panel" style="text-align:center;max-width:560px;margin:0 auto"><div style="font-size:3rem">🌸</div><h2 style="margin:8px 0">سفارش شما ثبت شد</h2><p class="hint">ممنون از خریدتان! کد پیگیری سفارش:</p><p><b dir="ltr" style="font-size:1.3rem;color:var(--c4)">${o.code}</b></p><p class="hint">وضعیت: ${o.status} · مبلغ: ${money(o.total)}</p><a class="btn btn-primary" href="shop.html">ادامه خرید</a></div>`;scrollTo({top:0})};
  $('#coForm').onsubmit=e=>{
    e.preventDefault();const phone=en(v('fPhone')),zip=en(v('fZip'));
    const err=!v('fName')?'نام و نام خانوادگی را وارد کنید.':!/^09\d{9}$/.test(phone)?'شماره موبایل معتبر نیست (مثال: 09123456789).':!v('fProv')||!v('fCity')?'استان و شهر را وارد کنید.':v('fAddr').length<10?'آدرس کامل را وارد کنید.':!/^\d{10}$/.test(zip)?'کد پستی باید ۱۰ رقم باشد.':pay()==='card'&&!receipt?'تصویر فیش واریزی را بارگذاری کنید.':'';
    $('#coErr').textContent=err;if(err)return;
    const o={code:'LV-'+Date.now().toString(36).toUpperCase(),date:new Date().toISOString(),pay:pay(),status:pay()==='card'?'در انتظار تایید فیش':'در انتظار پرداخت',
      customer:{name:v('fName'),phone,province:v('fProv'),city:v('fCity'),address:v('fAddr'),zip,note:v('fNote')},items:rows().map(({i,p})=>({id:p.id,name:p.name,price:p.price,qty:i.qty})),...totals()};
    // TODO(backend): POST /api/orders (+ آپلود فیش)؛ برای پرداخت آنلاین هم ریدایرکت به درگاه
    put('lavin_orders',[...get('lavin_orders',[]),o]);cart=[];renderCart();done(o);
  };
}

/* ---------- رویدادها ---------- */
function bind(){
  $('#burger').onclick=e=>{const o=$('#mobileNav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
  $('#cartBtn').onclick=()=>drawer(true);$('#closeCart').onclick=$('#overlay').onclick=()=>drawer(false);
  $('#searchBtn').onclick=()=>{$('#searchModal').classList.add('show');document.body.classList.add('no-scroll');search('');setTimeout(()=>$('#searchInput').focus(),150)};
  $('#searchInput').oninput=e=>search(e.target.value);
  addEventListener('scroll',()=>$('#siteHeader').classList.toggle('scrolled',scrollY>20),{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){drawer(false);closeSearch()}});
  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-add]');if(a)return add(a.dataset.add);
    const w=e.target.closest('[data-wish]');
    if(w){const id=+w.dataset.wish;wish=wish.includes(id)?wish.filter(x=>x!==id):[...wish,id];put('lavin_wish',wish);renderWish();onWish();return}
    const q=e.target.closest('[data-q]');
    if(q){const it=cart.find(i=>i.id==q.dataset.q),p=find(q.dataset.q);if(it&&p){it.qty=Math.min(it.qty+ +q.dataset.d,p.stock);if(it.qty<=0)cart=cart.filter(i=>i!==it);renderCart()}return}
    const r=e.target.closest('[data-rm]');if(r){cart=cart.filter(i=>i.id!=r.dataset.rm);renderCart();return}
    if(e.target.id==='searchModal'||e.target.closest('[data-close]'))closeSearch();
  });
}

layout();bind();renderCart();
({home,shop,product,cart:cartPg,checkout:checkoutPg}[document.body.dataset.page]||(()=>{}))();
renderWish();reveal();
})();
