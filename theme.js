/* لاوین — theme.js: اعمال تم فعال روی سایت (باید بعد از style.css داخل <head> لود شود) */
(()=>{
const FONTS={'Vazirmatn':'400;600;700;800;900','Noto Sans Arabic':'400;600;700;800;900','IBM Plex Sans Arabic':'400;600;700','Noto Naskh Arabic':'400;600;700','Cairo':'400;600;700;800;900','Lalezar':''};
const DEFAULT={id:'default',name:'صورتی پاستیلی (پیش‌فرض)',c:{c1:'#ff9ec7',c1d:'#e77aab',c2:'#ffd3e5',c3:'#fff5fa',c4:'#b9527e',ink:'#3d2b35',bg:'#fffafc'},font:'Vazirmatn',head:'Vazirmatn',radius:24};
const rgb=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)).join(',');
const sig=t=>JSON.stringify([t.c,t.font,t.head,t.radius]);
function apply(t){
  let s=document.getElementById('lavin-theme'),l=document.getElementById('lavin-fonts');
  if(sig(t)===sig(DEFAULT)){if(s)s.remove();if(l)l.remove();return}
  const c=t.c;
  if(!s){s=document.createElement('style');s.id='lavin-theme';document.head.append(s)}
  s.textContent=`:root{--c1:${c.c1};--c1-d:${c.c1d};--c2:${c.c2};--c3:${c.c3};--c4:${c.c4};--ink:${c.ink};--bg:${c.bg};--glow:rgba(${rgb(c.c1)},.42);--line:rgba(${rgb(c.c1)},.28);--muted:color-mix(in srgb,${c.ink} 55%,#fff);--shadow-s:0 8px 24px -14px rgba(${rgb(c.c4)},.45);--shadow:0 22px 48px -24px rgba(${rgb(c.c4)},.55);--radius:${t.radius}px}body{font-family:'${t.font}',system-ui,sans-serif}h1,h2,h3,h4,.brand-text b{font-family:'${t.head}',system-ui,sans-serif}`;
  const fs=[...new Set([t.font,t.head])].filter(f=>f!=='Vazirmatn'&&FONTS[f]!==undefined);
  if(fs.length){if(!l){l=document.createElement('link');l.id='lavin-fonts';l.rel='stylesheet';document.head.append(l)}
    l.href='https://fonts.googleapis.com/css2?'+fs.map(f=>'family='+f.replace(/ /g,'+')+(FONTS[f]?':wght@'+FONTS[f]:'')).join('&')+'&display=swap'}else if(l)l.remove();
  const m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',c.c1);
}
function active(){try{const s=JSON.parse(localStorage.getItem('lavin_themes'))||{};return [DEFAULT,...(s.list||[])].find(t=>t.id===s.active)||DEFAULT}catch(e){return DEFAULT}}
window.LavinTheme={FONTS,DEFAULT,apply,active};
if(!document.currentScript.hasAttribute('data-manual')){
  apply(active());
  addEventListener('message',e=>{if(e.source===parent&&e.data&&e.data.lavinTheme)apply(e.data.lavinTheme)}); // پیش‌نمایش زنده از پنل
}
})();
