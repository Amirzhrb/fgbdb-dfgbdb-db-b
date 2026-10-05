/* پنل مدیریت لاوین — فرانت‌اند (داده‌ها فعلاً در localStorage؛ آماده‌ی اتصال به API) */
(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fa=n=>Number(n||0).toLocaleString('fa-IR'),money=n=>fa(n)+' تومان';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast('حافظه‌ی مرورگر پر است؛ تعداد یا حجم عکس‌ها را کم کنید','bad');return false}};
const n=s=>+String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/\D/g,'')||0;
const ADMIN={user:'admin',pass:'lavin1405'}; // TODO(backend): احراز هویت واقعی (POST /api/admin/login)
const ST=['در انتظار پرداخت','در انتظار تایید فیش','تایید شده','ارسال شده','تحویل شده','لغو شده'],STC=['warn','warn','info','info','ok','bad'];
let db=get('lavin_db',null)||{products:JSON.parse(JSON.stringify(PRODUCTS)),categories:JSON.parse(JSON.stringify(CATEGORIES))};
let orders=get('lavin_orders',[]),cfg=Object.assign({free:500000,ship:45000,card:'6037-9911-1234-5678',sheba:'IR120570028780010917630101',holder:'فروشگاه لاوین'},get('lavin_settings',{}));
const saveDb=()=>put('lavin_db',db),saveOrders=()=>put('lavin_orders',orders),src=u=>/^(data:|https?:|\/)/.test(u)?u:'../'+u;
const P={dash:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',box:'<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',bag:'<path d="M6 2 3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-5H6Z"/><path d="M3 7h18M16 11a4 4 0 0 1-8 0"/>',tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z"/><circle cx="7" cy="7" r="1.5"/>',set:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',plus:'<path d="M12 5v14M5 12h14"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',img:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',cash:'<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h0"/>',gem:'<path d="M12 3.5 8.5 8h7L12 3.5Z"/><path d="M8.5 8 5 12l7 8 7-8-3.5-4H8.5Z"/><path d="M5 12h14"/>'};
const ic=(k,w=20)=>`<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k]}</svg>`;

/* ---------- ابزارها ---------- */
function toast(m,t=''){const e=document.createElement('div');e.className='toast '+t;e.textContent=m;$('#toasts').append(e);setTimeout(()=>e.remove(),3200)}
const close=()=>{$('#modal').innerHTML=''};
function modal(h){const m=$('#modal');m.innerHTML=`<div class="mod" role="dialog" aria-modal="true"><div class="box">${h}</div></div>`;m.firstChild.onmousedown=e=>{if(e.target===m.firstChild)close()}}
const ask=(msg,ok='حذف')=>new Promise(r=>{modal(`<h2>${esc(msg)}</h2><p style="color:var(--mut)">این عمل قابل بازگشت نیست.</p><div class="acts"><button class="btn ghost" id="no">انصراف</button><button class="btn bad" id="yes">${ok}</button></div>`);$('#no').onclick=()=>{close();r(false)};$('#yes').onclick=()=>{close();r(true)}});
const shrink=f=>new Promise(r=>{const i=new Image,u=URL.createObjectURL(f);i.onload=()=>{const k=Math.min(1,900/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);r(c.toDataURL('image/jpeg',.78))};i.onerror=()=>r(null);i.src=u});
const pill=s=>`<span class="pill ${STC[ST.indexOf(s)]||''}">${esc(s)}</span>`;

/* ---------- سفارش‌ها ---------- */
const ordersTable=(L,mini)=>L.length?`<div class="wrap"><table class="tbl"><thead><tr><th>کد سفارش</th><th>مشتری</th><th>تاریخ</th><th>مبلغ</th><th>پرداخت</th><th>وضعیت</th>${mini?'':'<th></th>'}</tr></thead><tbody>${L.map(o=>`<tr><td dir="ltr"><b>${esc(o.code)}</b></td><td>${esc(o.customer.name)}</td><td>${new Date(o.date).toLocaleDateString('fa-IR')}</td><td>${money(o.total)}</td><td>${o.pay==='card'?'کارت به کارت':'آنلاین'}</td><td>${pill(o.status)}</td>${mini?'':`<td><button class="ico" data-view="${esc(o.code)}" aria-label="جزئیات">${ic('eye')}</button></td>`}</tr>`).join('')}</tbody></table></div>`:'<div class="empty">سفارشی وجود ندارد.</div>';
let oF='همه',oQ='';
const fOrders=()=>orders.filter(o=>(oF==='همه'||o.status===oF)&&(!oQ||(o.code+o.customer.name+o.customer.phone).toLowerCase().includes(oQ))).reverse();
const vOrders=()=>`<div class="bar"><input class="grow" id="oq" placeholder="جستجوی کد سفارش، نام یا موبایل…" value="${esc(oQ)}"></div><div class="chips">${['همه',...ST].map(s=>`<button class="${s===oF?'on':''}" data-of="${s}">${s} (${fa(s==='همه'?orders.length:orders.filter(o=>o.status===s).length)})</button>`).join('')}</div><div class="card" id="ot">${ordersTable(fOrders())}</div>`;
function orderModal(code){
  const o=orders.find(x=>x.code===code);if(!o)return;const c=o.customer;
  modal(`<h2 style="display:flex;justify-content:space-between;gap:10px"><span>سفارش <b dir="ltr">${esc(o.code)}</b></span>${pill(o.status)}</h2>
  <div class="f" style="margin-bottom:16px"><div><small>مشتری</small><br><b>${esc(c.name)}</b><br><span dir="ltr">${esc(c.phone)}</span></div><div><small>آدرس تحویل</small><br>${esc(c.province)}، ${esc(c.city)}، ${esc(c.address)}<br>کد پستی: ${esc(c.zip)}</div></div>
  ${c.note?`<p><small>توضیحات مشتری:</small> ${esc(c.note)}</p>`:''}
  <table class="tbl"><tbody>${o.items.map(i=>`<tr><td>${esc(i.name)}</td><td>${fa(i.qty)} ×</td><td>${money(i.price)}</td></tr>`).join('')}<tr><td colspan="2">هزینه ارسال</td><td>${o.ship?money(o.ship):'رایگان'}</td></tr><tr><td colspan="2"><b>جمع کل</b></td><td><b>${money(o.total)}</b></td></tr></tbody></table>
  <div class="f" style="margin-top:16px"><label class="full">تغییر وضعیت سفارش<select id="stSel">${ST.map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select></label></div>
  <div class="acts"><button class="btn ghost" id="cl">بستن</button><button class="btn" id="stSave">ذخیره وضعیت</button></div>`);
  $('#cl').onclick=close;$('#stSave').onclick=()=>{o.status=$('#stSel').value;if(saveOrders()){close();toast('وضعیت سفارش به‌روز شد');route()}};
}
function seed(){
  const nm=['سارا محمدی','نگار احمدی','مریم رضایی','هانیه کریمی','الهام حسینی','پرنیا صادقی'],ct=['تهران','اصفهان','شیراز','مشهد','تبریز','کرج'];
  orders.push(...[...Array(8)].map((_,i)=>{const its=[...db.products].sort(()=>Math.random()-.5).slice(0,1+i%3).map(p=>({id:p.id,name:p.name,price:p.price,qty:1+i%2})),sub=its.reduce((s,x)=>s+x.price*x.qty,0),ship=sub>=cfg.free?0:cfg.ship,d=new Date(Date.now()-(i%7)*864e5-i*36e5);
    return{code:'LV-'+(d.getTime()+i).toString(36).toUpperCase(),date:d.toISOString(),pay:i%2?'card':'online',status:ST[i%6],customer:{name:nm[i%6],phone:'0912'+String(1000000+i*7919),province:ct[i%6],city:ct[i%6],address:'خیابان نمونه، پلاک '+(10+i),zip:'1234567890',note:''},items:its,sub,ship,total:sub+ship}}));
  saveOrders();route();toast('سفارش‌های نمونه ساخته شد');
}

/* ---------- داشبورد ---------- */
function vDash(){
  const live=orders.filter(o=>o.status!==ST[5]),sales=live.reduce((s,o)=>s+o.total,0),pend=orders.filter(o=>o.status===ST[0]||o.status===ST[1]).length,low=db.products.filter(p=>p.stock<=5);
  const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-6+i);return d}),sums=days.map(d=>live.filter(o=>new Date(o.date).toDateString()===d.toDateString()).reduce((s,o)=>s+o.total,0)),mx=Math.max(...sums,1);
  const K=[['cash','فروش کل',money(sales)],['bag','تعداد سفارش‌ها',fa(orders.length)],['alert','سفارش‌های در انتظار',fa(pend)],['box','کم‌موجود / ناموجود',fa(low.length)]];
  return `${orders.length?'':`<div class="card" style="margin-bottom:18px;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap"><span>هنوز سفارشی ثبت نشده است. برای دیدن پنل با داده‌ی کامل‌تر می‌توانید چند سفارش نمونه بسازید.</span><button class="btn ghost" id="seed">ساخت سفارش‌های نمونه</button></div>`}
  <div class="grid kpis">${K.map(([i,t,v])=>`<div class="card kpi"><span class="ic">${ic(i,24)}</span><div><small>${t}</small><b>${v}</b></div></div>`).join('')}</div>
  <div class="grid two"><div class="card"><h3 style="margin:0 0 6px">فروش ۷ روز اخیر</h3><div class="chart">${sums.map((v,i)=>`<div title="${money(v)}"><i style="height:${Math.round(v/mx*140)}px"></i><span>${days[i].toLocaleDateString('fa-IR',{weekday:'short'})}</span></div>`).join('')}</div></div>
  <div class="card"><h3 style="margin:0 0 12px">نیازمند تامین موجودی</h3>${low.length?low.slice(0,6).map(p=>`<div style="display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--line)"><span>${esc(p.name)}</span><span class="pill ${p.stock?'warn':'bad'}">${p.stock?fa(p.stock)+' عدد':'ناموجود'}</span></div>`).join(''):'<div class="empty">همه‌ی محصولات موجودی کافی دارند ✓</div>'}</div></div>
  <div class="card" style="margin-top:18px"><h3 style="margin:0 0 12px">آخرین سفارش‌ها</h3>${ordersTable(orders.slice(-5).reverse(),true)}</div>`;
}

/* ---------- محصولات ---------- */
let pQ='',pC='',pS='';
const stk=p=>p.stock<=0?['bad','ناموجود']:p.stock<=5?['warn','کم‌موجود']:['ok','موجود'];
const thumb=p=>(p.images||[])[0]?`<img src="${esc(src(p.images[0]))}" alt="">`:ic('img',22);
function pRows(){
  const L=db.products.filter(p=>(!pQ||(p.name+p.cat).includes(pQ))&&(!pC||p.cat===pC)&&(!pS||stk(p)[0]===pS));
  return L.length?`<div class="wrap"><table class="tbl"><thead><tr><th>محصول</th><th>دسته</th><th>قیمت</th><th>موجودی</th><th>عکس‌ها</th><th></th></tr></thead><tbody>${L.map(p=>{const[c,t]=stk(p);return `<tr><td><div style="display:flex;gap:12px;align-items:center"><span class="thumb">${thumb(p)}</span><div><b>${esc(p.name)}</b>${p.badge?` <span class="pill info">${esc(p.badge)}</span>`:''}</div></div></td><td>${esc(p.cat)}</td><td>${money(p.price)}${p.old>p.price?`<br><s style="color:var(--mut);font-size:.8rem">${fa(p.old)}</s>`:''}</td><td><span class="pill ${c}">${t} · ${fa(p.stock)}</span></td><td>${fa((p.images||[]).length)} از ۵</td><td style="white-space:nowrap"><button class="ico" data-edit="${p.id}" aria-label="ویرایش">${ic('edit')}</button><button class="ico" data-del="${p.id}" aria-label="حذف">${ic('trash')}</button></td></tr>`}).join('')}</tbody></table></div>`:'<div class="empty">محصولی پیدا نشد.</div>';
}
const vProducts=()=>`<div class="bar"><input class="grow" id="pq" placeholder="جستجوی محصول…" value="${esc(pQ)}"><select id="pc"><option value="">همه دسته‌ها</option>${db.categories.map(c=>`<option ${c.name===pC?'selected':''}>${esc(c.name)}</option>`).join('')}</select><select id="ps"><option value="">همه موجودی‌ها</option><option value="ok">موجود</option><option value="warn">کم‌موجود</option><option value="bad">ناموجود</option></select><button class="btn" id="addP">${ic('plus',18)} محصول جدید</button></div><div class="card" id="pt">${pRows()}</div>`;
function pModal(id){
  const p=id?db.products.find(x=>x.id==id):{name:'',cat:(db.categories[0]||{}).name||'',price:'',old:'',stock:1,badge:'',desc:'',images:[]};
  let im=[...(p.images||[])];
  const slots=()=>[0,1,2,3,4].map(i=>im[i]?`<div class="slot"><img src="${esc(src(im[i]))}" alt=""><button type="button" class="x" data-rm="${i}" aria-label="حذف عکس">×</button>${i?'':'<span class="m">اصلی</span>'}</div>`:`<label class="slot" style="cursor:pointer">${ic('plus',22)}<span>افزودن عکس</span><input type="file" accept="image/*" multiple hidden data-up></label>`).join('');
  modal(`<h2>${id?'ویرایش محصول':'محصول جدید'}</h2><div class="f">
   <label class="full">نام محصول<input id="eN" value="${esc(p.name)}"></label>
   <label>دسته‌بندی<select id="eC">${db.categories.map(c=>`<option ${c.name===p.cat?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label>
   <label>برچسب<select id="eB">${['','جدید','پرفروش','تخفیف'].map(b=>`<option value="${b}" ${b===(p.badge||'')?'selected':''}>${b||'بدون برچسب'}</option>`).join('')}</select></label>
   <label>قیمت (تومان)<input id="eP" inputmode="numeric" value="${p.price}"></label>
   <label>قیمت قبل از تخفیف<input id="eO" inputmode="numeric" value="${p.old||''}"></label>
   <label>موجودی انبار<input id="eS" inputmode="numeric" value="${p.stock}"></label><span></span>
   <label class="full">توضیحات<textarea id="eD">${esc(p.desc)}</textarea></label>
   <div class="full"><b style="font-size:.85rem">تصاویر محصول (حداکثر ۵ عکس؛ عکس اول، تصویر اصلی است)</b><div class="slots" id="slots" style="margin-top:8px">${slots()}</div></div></div>
   <div class="acts"><button class="btn ghost" id="cl">انصراف</button><button class="btn" id="sv">ذخیره</button></div>`);
  const box=$('#slots');
  box.onclick=e=>{const x=e.target.closest('[data-rm]');if(x){im.splice(+x.dataset.rm,1);box.innerHTML=slots()}};
  box.onchange=async e=>{if(!e.target.matches('[data-up]'))return;for(const f of [...e.target.files].slice(0,5-im.length)){const d=await shrink(f);if(d)im.push(d)}box.innerHTML=slots()};
  $('#cl').onclick=close;
  $('#sv').onclick=()=>{
    const d={name:$('#eN').value.trim(),cat:$('#eC').value,badge:$('#eB').value,price:n($('#eP').value),old:n($('#eO').value),stock:n($('#eS').value),desc:$('#eD').value.trim(),images:im};
    if(!d.name)return toast('نام محصول را وارد کنید','bad');if(!d.price)return toast('قیمت معتبر وارد کنید','bad');if(d.old<=d.price)d.old=0;
    if(id)Object.assign(p,d);else db.products.unshift({id:Math.max(0,...db.products.map(x=>x.id))+1,icon:(db.categories.find(c=>c.name===d.cat)||{}).icon||'ring',...d});
    if(saveDb()){close();toast('محصول ذخیره شد');route()}
  };
}

/* ---------- دسته‌بندی‌ها و تنظیمات ---------- */
const vCats=()=>`<div class="grid two" style="grid-template-columns:1.4fr 1fr"><div class="card">${db.categories.length?`<table class="tbl"><thead><tr><th>دسته‌بندی</th><th>تعداد محصول</th><th></th></tr></thead><tbody>${db.categories.map(c=>`<tr><td><b>${esc(c.name)}</b></td><td>${fa(db.products.filter(p=>p.cat===c.name).length)}</td><td><button class="ico" data-delc="${esc(c.name)}" aria-label="حذف">${ic('trash')}</button></td></tr>`).join('')}</tbody></table>`:'<div class="empty">دسته‌ای وجود ندارد.</div>'}</div>
<div class="card f" style="grid-template-columns:1fr;align-content:start"><h3 style="margin:0">دسته‌بندی جدید</h3><label>نام<input id="cN"></label><label>آیکن<select id="cI">${Object.keys(ICONS).map(k=>`<option>${k}</option>`).join('')}</select></label><button class="btn" id="addC">افزودن</button></div></div>`;
const vSet=()=>`<div class="card"><h3 style="margin:0 0 16px">ارسال و پرداخت</h3><div class="f">
 <label>هزینه ارسال (تومان)<input id="sS" inputmode="numeric" value="${cfg.ship}"></label><label>حداقل خرید برای ارسال رایگان<input id="sF" inputmode="numeric" value="${cfg.free}"></label>
 <label>شماره کارت<input id="sC" dir="ltr" value="${esc(cfg.card)}"></label><label>شماره شبا<input id="sH" dir="ltr" value="${esc(cfg.sheba)}"></label>
 <label class="full">به نام<input id="sO" value="${esc(cfg.holder)}"></label></div>
 <div class="acts" style="justify-content:flex-start"><button class="btn" id="svc">ذخیره تنظیمات</button></div></div>
<div class="card" style="margin-top:18px"><h3 style="margin:0 0 6px">داده‌ها</h3><p style="color:var(--mut);margin:0 0 14px">تا زمان اتصال بک‌اند، اطلاعات در مرورگر همین دستگاه ذخیره می‌شود.</p><div class="acts" style="justify-content:flex-start;margin:0"><button class="btn ghost" id="exp">دانلود نسخه پشتیبان (JSON)</button><button class="btn bad" id="rst">بازگردانی محصولات به پیش‌فرض</button></div></div>`;
const saveCfg=()=>{cfg={ship:n($('#sS').value),free:n($('#sF').value),card:$('#sC').value.trim(),sheba:$('#sH').value.trim(),holder:$('#sO').value.trim()};if(put('lavin_settings',cfg))toast('تنظیمات ذخیره شد')};
const exportData=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({db,orders,cfg,themes:TS,site},null,2)],{type:'application/json'}));a.download='lavin-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click()};

/* ---------- تم و ظاهر سایت ---------- */
Object.assign(P,{check:'<path d="m5 12 5 5L20 7"/>',text:'<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1.1.9-2 2-2H18a4 4 0 0 0 4-4c0-5.5-4.5-9.4-10-9.4Z"/>'});
const PRESETS=[{name:'صورتی پاستیلی',c:LavinTheme.DEFAULT.c},{name:'لاوندر',c:{c1:'#a98bf0',c1d:'#7c5ce0',c2:'#ece4ff',c3:'#f7f3ff',c4:'#4b3a86',ink:'#2b2540',bg:'#fbf9ff'}},{name:'نعنایی',c:{c1:'#5cc9a7',c1d:'#2fa383',c2:'#dcf5ec',c3:'#f1fbf7',c4:'#1f6b57',ink:'#1f3a33',bg:'#f8fdfb'}},{name:'هلویی',c:{c1:'#ff9a76',c1d:'#e8714a',c2:'#ffe6dc',c3:'#fff5f0',c4:'#8a3d22',ink:'#3a2820',bg:'#fffaf7'}},{name:'آبی یخی',c:{c1:'#6cb6f5',c1d:'#3f8fd9',c2:'#dcecfd',c3:'#f2f8ff',c4:'#24558a',ink:'#1f2d3d',bg:'#f9fcff'}},{name:'رزگلد',c:{c1:'#e0a899',c1d:'#b97a68',c2:'#f7e6df',c3:'#fcf5f1',c4:'#6e3f33',ink:'#33231f',bg:'#fdf8f5'}}];
const CL={c1:'رنگ اصلی (دکمه‌ها)',c1d:'رنگ اصلی تیره',c2:'رنگ ملایم (کارت‌ها)',c3:'پس‌زمینه‌ی بخش‌ها',c4:'رنگ برند تیره (عناوین)',ink:'رنگ متن',bg:'پس‌زمینه‌ی صفحه'};
const clone=o=>JSON.parse(JSON.stringify(o));
let TS=get('lavin_themes',{active:'default',list:[]}),ed=null,site=get('lavin_site',{});
const allT=()=>[LavinTheme.DEFAULT,...TS.list];
const sw=t=>`<span class="sw">${['c1','c2','c3','c4'].map(k=>`<i style="background:${t.c[k]}"></i>`).join('')}</span>`;
const pv=()=>{const f=$('#pv');if(f&&f.contentWindow)f.contentWindow.postMessage({lavinTheme:ed},'*')};
document.addEventListener('load',e=>{if(e.target&&e.target.id==='pv')pv()},true);
function vTheme(){
  if(!ed)ed=clone(allT().find(t=>t.id===TS.active)||LavinTheme.DEFAULT);
  const opt=cur=>Object.keys(LavinTheme.FONTS).map(f=>`<option ${f===cur?'selected':''}>${f}</option>`).join('');
  return `<div class="grid two" style="grid-template-columns:400px 1fr;align-items:start"><div class="grid">
  <div class="card f" id="thf"><h3 class="full" style="margin:0">ویرایشگر تم</h3>
   <label class="full">نام تم<input id="tN" value="${esc(ed.name)}"></label>
   <div class="full"><b style="font-size:.85rem">پالت آماده</b><div class="chips" style="margin:8px 0 0">${PRESETS.map((p,i)=>`<button data-preset="${i}"><small style="background:${p.c.c1}"></small>${p.name}</button>`).join('')}</div></div>
   ${Object.keys(CL).map(k=>`<label>${CL[k]}<input type="color" data-c="${k}" value="${ed.c[k]}"></label>`).join('')}
   <label>فونت متن<select id="tF">${opt(ed.font)}</select></label><label>فونت عناوین<select id="tH">${opt(ed.head)}</select></label>
   <label class="full">گردی گوشه‌ها: <b id="tRv">${fa(ed.radius)}</b><input type="range" id="tR" min="0" max="36" value="${ed.radius}"></label>
   <div class="full acts" style="justify-content:flex-start;margin:0;flex-wrap:wrap"><button class="btn" data-tsave="act">ذخیره و فعال‌سازی</button><button class="btn ghost" data-tsave="save">ذخیره</button><button class="btn ghost" data-tsave="new">ذخیره به‌عنوان تم جدید</button></div></div>
  <div class="card"><h3 style="margin:0 0 6px">تم‌های ذخیره‌شده</h3>${allT().map(t=>`<div class="tcard">${sw(t)}<div><b>${esc(t.name)}</b>${TS.active===t.id?' <span class="pill ok">فعال روی سایت</span>':''}<br><small style="color:var(--mut)">${esc(t.font)}${t.head!==t.font?' / '+esc(t.head):''}</small></div><button class="ico" data-tact="${t.id}" title="فعال‌سازی" aria-label="فعال‌سازی">${ic('check')}</button><button class="ico" data-tedit="${t.id}" title="ویرایش" aria-label="ویرایش">${ic('edit')}</button>${t.id==='default'?'':`<button class="ico" data-tdel="${t.id}" aria-label="حذف">${ic('trash')}</button>`}</div>`).join('')}</div></div>
  <div class="card"><div class="bar" style="margin-bottom:12px"><h3 style="margin:0">پیش‌نمایش زنده</h3><span class="sp"></span><button class="btn ghost" data-dev="d">دسکتاپ</button><button class="btn ghost" data-dev="m">موبایل</button></div><div class="pvbox" id="pvbox"><iframe id="pv" src="../index.html" title="پیش‌نمایش سایت"></iframe></div></div></div>`;
}
function themeInput(t){
  if(t.dataset.c)ed.c[t.dataset.c]=t.value;else if(t.id==='tN')ed.name=t.value;else if(t.id==='tF')ed.font=t.value;else if(t.id==='tH')ed.head=t.value;else if(t.id==='tR'){ed.radius=+t.value;$('#tRv').textContent=fa(t.value)}
  pv();
}
function saveTheme(mode){
  const t=clone(ed);t.name=(t.name||'').trim()||'تم بدون نام';
  const i=TS.list.findIndex(x=>x.id===t.id);
  if(mode==='new'||i<0){t.id='t'+Date.now().toString(36);TS.list.push(t)}else TS.list[i]=t;
  ed=clone(t);if(mode==='act')TS.active=t.id;
  if(put('lavin_themes',TS)){toast(mode==='act'?'تم ذخیره و روی سایت فعال شد':'تم ذخیره شد');route()}
}
const vContent=()=>`<div class="card"><h3 style="margin:0 0 16px">متن‌ها و اطلاعات سایت</h3><div class="f">
<label class="full">پیام‌های نوار بالای سایت (هر خط یک پیام)<textarea id="kT">${esc((site.ticker||[]).join('\n'))}</textarea></label>
<label>تلفن تماس<input id="kP" value="${esc(site.phone||'')}" placeholder="۰۲۱-۹۱۰۰۲۲۳۳"></label><label>ساعت پاسخگویی<input id="kH" value="${esc(site.hours||'')}" placeholder="۹ صبح تا ۹ شب"></label>
<label class="full">آدرس<input id="kA" value="${esc(site.address||'')}" placeholder="تهران، خیابان ولیعصر، پاساژ نگین، طبقه ۲"></label></div></div>
<div class="card" style="margin-top:18px"><h3 style="margin:0 0 16px">پیشنهاد ویژه صفحه اصلی</h3><div class="f">
<label class="full">عنوان<input id="kOT" value="${esc(site.offerTitle||'')}"></label><label class="full">توضیح<textarea id="kOX">${esc(site.offerText||'')}</textarea></label>
<label>پایان تخفیف (تایمر)<input type="datetime-local" id="kOE" value="${esc(site.offerEnd||'')}"></label></div>
<p style="color:var(--mut);margin:12px 0 0">فیلدهای خالی، متن پیش‌فرض سایت را نگه می‌دارند.</p>
<div class="acts" style="justify-content:flex-start"><button class="btn" id="svs">ذخیره محتوا</button></div></div>`;
function themeClick(b){
  const d=b.dataset;
  if(d.preset!==undefined){Object.assign(ed.c,PRESETS[d.preset].c);$$('[data-c]').forEach(i=>i.value=ed.c[i.dataset.c]);pv();return true}
  if(d.dev){$('#pvbox').style.width=d.dev==='m'?'390px':'100%';return true}
  if(d.tsave){saveTheme(d.tsave);return true}
  if(d.tact){TS.active=d.tact;put('lavin_themes',TS);toast('تم روی سایت فعال شد');route();return true}
  if(d.tedit){ed=clone(allT().find(t=>t.id===d.tedit));route();return true}
  if(d.tdel){ask('این تم حذف شود؟').then(y=>{if(y){TS.list=TS.list.filter(t=>t.id!==d.tdel);if(TS.active===d.tdel)TS.active='default';if(ed&&ed.id===d.tdel)ed=null;put('lavin_themes',TS);route()}});return true}
  if(b.id==='svs'){site={ticker:$('#kT').value.split('\n').map(x=>x.trim()).filter(Boolean),phone:$('#kP').value.trim(),address:$('#kA').value.trim(),hours:$('#kH').value.trim(),offerTitle:$('#kOT').value.trim(),offerText:$('#kOX').value.trim(),offerEnd:$('#kOE').value};if(put('lavin_site',site))toast('محتوای سایت ذخیره شد');return true}
  return false;
}

/* ---------- مسیریابی (بدون رفرش) ---------- */
const V={dashboard:['داشبورد',vDash,'dash'],orders:['سفارش‌ها',vOrders,'bag'],products:['محصولات',vProducts,'box'],categories:['دسته‌بندی‌ها',vCats,'tag'],theme:['تم و ظاهر سایت',vTheme,'palette'],content:['محتوای سایت',vContent,'text'],settings:['تنظیمات',vSet,'set']};
function route(){
  const k=location.hash.replace('#/','');const key=V[k]?k:'dashboard',[t,f]=V[key];
  $('#ttl').textContent=t;document.title=t+' | پنل لاوین';
  $$('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===key));
  $('#view').innerHTML=f();$('#side').classList.remove('open');scrollTo(0,0);
  const pend=orders.filter(o=>o.status===ST[0]||o.status===ST[1]).length;$('#pend').textContent=fa(pend);$('#pend').hidden=!pend;
}
function init(){
  $('#side').innerHTML=`<div class="brand"><i>${ic('gem',22)}</i><span>لاوین<br><small style="font-weight:500;color:#c9bcd2;font-size:.75rem">پنل مدیریت</small></span></div>
  <nav class="nav" aria-label="منوی پنل">${Object.entries(V).map(([k,[t,,i]])=>`<a href="#/${k}" data-r="${k}">${ic(i)}<span>${t}</span>${k==='orders'?'<em id="pend" hidden></em>':''}</a>`).join('')}</nav>
  <div class="side-foot"><a class="btn ghost" href="../index.html" target="_blank" rel="noopener">مشاهده سایت</a><button class="btn ghost" id="out">${ic('out',18)} خروج</button></div>`;
  $('#burger').innerHTML=ic('menu');$('#burger').onclick=()=>$('#side').classList.toggle('open');
  $('#today').textContent=new Date().toLocaleDateString('fa-IR',{weekday:'long',day:'numeric',month:'long'});
  $('#out').onclick=()=>{sessionStorage.removeItem('lavin_admin');location.reload()};
  const v=$('#view');
  v.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(themeClick(b))return;const d=b.dataset;
    if(d.view)orderModal(d.view);
    else if(d.of){oF=d.of;route()}
    else if(d.edit)pModal(d.edit);
    else if(d.del)ask('این محصول حذف شود؟').then(y=>{if(y){db.products=db.products.filter(p=>p.id!=d.del);saveDb();route();toast('محصول حذف شد')}});
    else if(d.delc){if(db.products.some(p=>p.cat===d.delc))return toast('ابتدا محصولات این دسته را به دسته‌ی دیگری منتقل کنید','bad');db.categories=db.categories.filter(c=>c.name!==d.delc);saveDb();route()}
    else if(b.id==='addP')pModal();
    else if(b.id==='addC'){const nm=$('#cN').value.trim();if(!nm||db.categories.some(c=>c.name===nm))return toast('نام دسته‌بندی معتبر و یکتا وارد کنید','bad');db.categories.push({name:nm,icon:$('#cI').value});saveDb();route()}
    else if(b.id==='seed')seed();
    else if(b.id==='svc')saveCfg();
    else if(b.id==='exp')exportData();
    else if(b.id==='rst')ask('محصولات و دسته‌بندی‌ها به حالت پیش‌فرض برگردند؟','بازگردانی').then(y=>{if(y){localStorage.removeItem('lavin_db');location.reload()}});
  };
  v.oninput=e=>{const t=e.target;if(t.closest('#thf')){themeInput(t);return}if(t.id==='oq'){oQ=t.value.trim().toLowerCase();$('#ot').innerHTML=ordersTable(fOrders())}else if(t.id==='pq'){pQ=t.value.trim();$('#pt').innerHTML=pRows()}};
  v.onchange=e=>{const t=e.target;if(t.id==='pc'||t.id==='ps'){t.id==='pc'?pC=t.value:pS=t.value;$('#pt').innerHTML=pRows()}};
  addEventListener('hashchange',route);addEventListener('keydown',e=>{if(e.key==='Escape')close()});route();
}
$('#lg').innerHTML=ic('gem',22);
const enter=()=>{$('#login').hidden=true;$('#app').hidden=false;init()};
if(sessionStorage.getItem('lavin_admin'))enter();
$('#lf').onsubmit=e=>{e.preventDefault();if($('#lu').value===ADMIN.user&&$('#lp').value===ADMIN.pass){sessionStorage.setItem('lavin_admin','1');enter()}else $('#le').textContent='نام کاربری یا رمز عبور اشتباه است.'};
})();
