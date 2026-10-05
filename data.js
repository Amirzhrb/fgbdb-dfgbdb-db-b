const S = (inner, vb) => `<svg viewBox="${vb||'0 0 120 120'}" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const ICONS = {
  ring: S(`<circle cx="60" cy="76" r="30"/><path d="M60 16 46 40h28L60 16Z"/><path d="M60 16v24"/><path d="M46 40 60 46l14-6"/>`),
  necklace: S(`<path d="M28 22c0 54 64 54 64 0"/><path d="M60 63v8"/><circle cx="60" cy="80" r="10"/><circle cx="60" cy="80" r="4" fill="currentColor"/><circle cx="30" cy="26" r="3.4" fill="currentColor" stroke="none"/><circle cx="90" cy="26" r="3.4" fill="currentColor" stroke="none"/>`),
  earring: S(`<path d="M44 16v14"/><path d="M36 12h16"/><circle cx="44" cy="52" r="21"/><circle cx="44" cy="52" r="8" fill="currentColor" opacity=".55" stroke="none"/><path d="M80 22v10"/><circle cx="80" cy="54" r="15"/>`),
  bracelet: S(`<ellipse cx="60" cy="64" rx="36" ry="27"/><circle cx="60" cy="37" r="9" fill="currentColor" stroke="none" opacity=".6"/><circle cx="28" cy="56" r="3.6" fill="currentColor" stroke="none"/><circle cx="92" cy="56" r="3.6" fill="currentColor" stroke="none"/><circle cx="40" cy="86" r="3.6" fill="currentColor" stroke="none"/><circle cx="80" cy="86" r="3.6" fill="currentColor" stroke="none"/>`),
  watch: S(`<circle cx="60" cy="60" r="27"/><path d="M60 45v16l11 7"/><path d="M46 36 50 14h20l4 22"/><path d="M46 84 50 106h20l4-22"/>`),
  bow: S(`<circle cx="60" cy="58" r="9"/><path d="M60 58 30 40v38l30-20Z"/><path d="M60 58 90 40v38L60 58Z"/><path d="M52 66 44 92M68 66 76 92"/>`),
  brooch: S(`<circle cx="60" cy="60" r="11"/><circle cx="60" cy="34" r="13"/><circle cx="83" cy="49" r="13"/><circle cx="74" cy="76" r="13"/><circle cx="46" cy="76" r="13"/><circle cx="37" cy="49" r="13"/>`),
  anklet: S(`<ellipse cx="60" cy="62" rx="35" ry="24"/><path d="M60 38 66 30 74 34 70 42Z" fill="currentColor" stroke="none" opacity=".55"/><circle cx="30" cy="54" r="3.4" fill="currentColor" stroke="none"/><circle cx="90" cy="54" r="3.4" fill="currentColor" stroke="none"/>`),
  sparkle: S(`<path d="M60 14 68 48l34 8-34 8-8 34-8-34-34-8 34-8 8-34Z"/>`)
};
const CATEGORIES=[
    { name:'گردنبند',    icon:'necklace' },
    { name:'گوشواره',    icon:'earring'  },
    { name:'انگشتر',     icon:'ring'     },
    { name:'دستبند',     icon:'bracelet' },
    { name:'ساعت',       icon:'watch'    },
    { name:'گیره سر',    icon:'bow'      },
    { name:'سنجاق سینه', icon:'brooch'   },
    { name:'پابند',      icon:'anklet'   }
];
// images: تا ۵ مسیر عکس برای هر محصول، مثلا ['assets/img/products/ava-1.jpg','assets/img/products/ava-2.jpg'] (محصول اول عکس‌های نمونه دارد)
const PRODUCTS=[
    { id:1, name:'انگشتر رزگلد «آوا»',      cat:'انگشتر',    price:480000,  old:620000, stock:14, badge:'٪ تخفیف', icon:'ring',     images:['assets/img/demo/demo-1.svg','assets/img/demo/demo-2.svg','assets/img/demo/demo-3.svg','assets/img/demo/demo-4.svg','assets/img/demo/demo-5.svg'], desc:'آبکاری رزگلد با نگین زیرکونیا، مناسب استفاده روزمره و مجلسی.' },
    { id:2, name:'گردنبند مروارید «ماه»',   cat:'گردنبند',   price:690000,  old:0,      stock:9,  badge:'پرفروش',  icon:'necklace', images:[], desc:'زنجیر استیل با آویز مروارید طبیعی مصنوعی و آبکاری طلایی.' },
    { id:3, name:'گوشواره حلقه‌ای «نگین»',  cat:'گوشواره',   price:350000,  old:0,      stock:22, badge:'',        icon:'earring',  images:[], desc:'حلقه‌های سبک و ضدحساسیت با ظرافت بالا.' },
    { id:4, name:'دستبند زنجیری «پری»',     cat:'دستبند',    price:420000,  old:530000, stock:11, badge:'٪ تخفیف', icon:'bracelet', images:[], desc:'زنجیر قلاب‌دار با آویز قلب کوچک، قابل تنظیم.' },
    { id:5, name:'ساعت مچی «الیزه»',        cat:'ساعت',      price:1250000, old:0,      stock:5,  badge:'ویژه',    icon:'watch',    images:[], desc:'صفحه مینیمال با بند استیل و ضد آب در حد پاشیدن آب.' },
    { id:6, name:'گیره سر پروانه‌ای «روشا»', cat:'گیره سر',   price:180000,  old:240000, stock:30, badge:'جدید',    icon:'bow',      images:[], desc:'گیره مو با طراحی پروانه و سنگ‌های درخشان.' },
    { id:7, name:'سنجاق سینه گل رز',        cat:'سنجاق سینه',price:260000,  old:0,      stock:16, badge:'',        icon:'brooch',   images:[], desc:'سنجاق سینه با گل رز میناکاری شده و حاشیه طلایی.' },
    { id:8, name:'پابند مرواریدی «دریا»',   cat:'پابند',     price:220000,  old:0,      stock:18, badge:'جدید',    icon:'anklet',   images:[], desc:'پابند سبک با مرواریدهای ریز و قفل مطمئن.' },
    { id:9, name:'ست گردنبند و گوشواره «رویا»', cat:'گردنبند', price:890000, old:1150000, stock:7, badge:'٪ تخفیف', icon:'necklace', images:[], desc:'ست کامل با جعبه کادویی مخملی، انتخاب عالی برای هدیه.' },
    { id:10, name:'انگشتر نگین‌دار «ستاره»',  cat:'انگشتر',   price:530000,  old:0,      stock:12, badge:'پرفروش',  icon:'ring',     images:[], desc:'نگین بزرگ چندوجهی با درخشش بالا و رینگ قابل تنظیم.' },
    { id:11, name:'گوشواره آویز «شبنم»',     cat:'گوشواره',   price:410000,  old:0,      stock:15, badge:'',        icon:'earring',  images:[], desc:'آویزهای کشیده با سنگ‌های ریز آبی و صورتی.' },
    { id:12, name:'دستبند چرم و طلا «نارین»',cat:'دستبند',    price:360000,  old:0,      stock:20, badge:'',        icon:'bracelet', images:[], desc:'ترکیب بند چرم پاستیلی با قفل طلایی.' }
];
const BANNERS=[
    { title:'درخشش پاستیلی لاوین', sub:'کالکشن جدید بدلیجات با آبکاری رزگلد و طراحی‌های مینیمال؛ ساخته‌شده برای لحظه‌های خاص.', cta:'مشاهده کالکشن', badge:'کالکشن پاییز ۱۴۰۵', g1:'#ffd3e5', g2:'#fff5fa', icon:'necklace', price:'۲۵۰٬۰۰۰ تومان', img:null },
    { title:'گوشواره‌هایی که می‌درخشند', sub:'سبک، ضدحساسیت و مناسب استفاده روزمره. تا ۴۰٪ تخفیف روی مجموعه‌ی گوشواره‌ها.', cta:'خرید گوشواره', badge:'تخفیف ویژه', g1:'#ffe0ec', g2:'#f6f0ff', icon:'earring', price:'۱۹۰٬۰۰۰ تومان', img:null },
    { title:'هدیه‌ای که یادش می‌ماند', sub:'ست‌های نیم‌ست با جعبه‌ی کادویی مخملی و کارت تبریک دست‌نویس، آماده‌ی هدیه دادن.', cta:'مشاهده ست‌ها', badge:'آماده هدیه', g1:'#ffd8e6', g2:'#fff8f2', icon:'bracelet', price:'۴۹۰٬۰۰۰ تومان', img:null }
];
const TESTIMONIALS=[
    { name:'سارا محمدی', city:'تهران',  text:'کیفیت آبکاری واقعا عالیه! بعد از دو ماه استفاده هنوز رنگش عوض نشده. بسته‌بندی هم فوق‌العاده شیک بود.', stars:5 },
    { name:'نگین رضایی', city:'اصفهان', text:'ست رویا رو برای تولد خواهرم خریدم، جعبه مخملی‌اش انقدر قشنگ بود که لازم نشد کادوپیچ کنم!', stars:5 },
    { name:'مریم کاظمی', city:'شیراز',  text:'پرداخت کارت به کارت خیلی سریع تایید شد و سفارشم دو روزه رسید. حتما بازم خرید می‌کنم.', stars:4 },
    { name:'رها احمدی', city:'مشهد',   text:'گوشواره‌ها سبک هستن و گوشم حساسیت نداد. طراحی پاستیلی‌شون دقیقا همون چیزی بود که می‌خواستم.', stars:5 },
    { name:'آیدا نوری', city:'تبریز',   text:'پشتیبانی خیلی خوب جواب داد و راهنمایی کرد کدوم مدل به استایل من می‌خوره. عالی بود.', stars:5 }
];
