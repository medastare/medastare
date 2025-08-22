// ---- GA INIT ----
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
(function waitForGA(){
  if (typeof gtag === 'function') {
    gtag('js', new Date());
    gtag('config', 'G-0X6RGY78FV');
  } else {
    setTimeout(waitForGA, 50);
  }
})();

// ---- Senin sayfa JS’in (inline olanların tamamı buraya alındı) ----
const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }});
},{threshold:.2});
document.querySelectorAll('.header-content, section, .card, .image-break').forEach(el=>io.observe(el));
document.querySelectorAll('.card').forEach((c,i)=>c.style.transitionDelay=(0.08*i)+'s');

const hero=document.getElementById('hero');
const heroImg=document.querySelector('.hero-bg');
const heroContent=document.getElementById('heroContent');
const scrollbar=document.getElementById('scrollbar');
const toTop=document.getElementById('toTop');

if (heroImg) {
  if (heroImg.complete) { requestAnimationFrame(()=> heroImg.classList.add('show')); }
  else { heroImg.addEventListener('load', ()=> heroImg.classList.add('show')); }
}

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints>0;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const heavyFX = !(isTouch || isIOS);

let latestScroll=0,ticking=false;
function updateOnScroll(){
  const h=window.innerHeight;
  const y=latestScroll;

  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const p = Math.max(0, Math.min(1, y / (docH||1)));
  scrollbar.style.width = (p*100)+'%';
  scrollbar.style.height = y>4 ? '3px':'0px';

  hero.classList.toggle('scrolled', y>40);
  if(heroImg) heroImg.style.transform = heavyFX ? `translate3d(0, ${y*0.03}px, 0)` : 'none';

  const ov=Math.max(.45,.55 - (y/h)*0.1);
  hero.style.setProperty('--overlay', ov.toFixed(2));

  const k=Math.min(1, y/(h*0.8));
  heroContent.style.opacity = String(1 - k*0.35);
  heroContent.style.transform = `translateY(${k*24}px) scale(${1 - k*0.02}) rotateX(var(--rx)) rotateY(var(--ry))`;
  heroContent.style.filter = heavyFX ? `blur(${k*2.2}px)` : 'none';

  if (heroImg) heroImg.style.opacity = String(1 - k*0.9);

  document.querySelectorAll('.card').forEach((el)=>{
    const rect = el.getBoundingClientRect();
    const py = Math.max(-2, Math.min(2, (rect.top-window.innerHeight/2)/200));
    el.style.setProperty('--py', py+'px');
    el.classList.add('parallax');
  });

  if(y>400) toTop.classList.add('show'); else toTop.classList.remove('show');
  ticking=false;
}
function onScroll(){ latestScroll=window.scrollY||window.pageYOffset; if(!ticking){ requestAnimationFrame(updateOnScroll); ticking=true; } }
window.addEventListener('scroll', onScroll, {passive:true});
updateOnScroll();

if(heavyFX){
  hero.addEventListener('mousemove',(e)=>{
    const r=hero.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width)*100;
    const y=((e.clientY-r.top)/r.height)*100;
    document.documentElement.style.setProperty('--spot-x', x+'%');
    document.documentElement.style.setProperty('--spot-y', y+'%');

    const cx=(e.clientX-(r.left+r.width/2))/(r.width/2);
    const cy=(e.clientY-(r.top+r.height/2))/(r.height/2);
    const tilt=6;
    hero.style.setProperty('--ry', `${cx*tilt}deg`);
    hero.style.setProperty('--rx', `${-cy*tilt}deg`);
  });
  hero.addEventListener('mouseleave',()=>{
    hero.style.setProperty('--ry','0deg');
    hero.style.setProperty('--rx','0deg');
  });
}

toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
document.querySelectorAll('.contact-links a').forEach(a=>{ a.style.position='relative'; });

if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ scrollbar.style.transition='none'; }

document.querySelectorAll('[data-modal]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const m = document.getElementById(btn.dataset.modal);
    if(!m) return;
    m.setAttribute('aria-hidden','false');
    const firstFocus = m.querySelector('button, a, input, [tabindex]:not([tabindex="-1"])');
    (firstFocus||m).focus();
  });
});
const closeModal = m=> m && m.setAttribute('aria-hidden','true');
document.querySelectorAll('.ms-modal').forEach(m=>{
  m.addEventListener('click', e=>{
    if(e.target.classList.contains('ms-modal')) closeModal(m);
  });
  m.querySelector('.ms-modal__close').addEventListener('click', ()=>closeModal(m));
  m.addEventListener('keydown', e=>{
    if(e.key==='Escape') closeModal(m);
    if(e.key==='Tab'){
      const f = m.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if(!f.length) return;
      const first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ last.focus(); e.preventDefault(); }
      else if(!e.shiftKey && document.activeElement===last){ first.focus(); e.preventDefault(); }
    }
  });
});

const y = document.getElementById('ms-year'); if(y) y.textContent = new Date().getFullYear();

document.querySelectorAll('a,button').forEach(el=>{
  if(/invest|partner|partnership|how it works|vision/i.test((el.textContent||'').toLowerCase())){
    el.addEventListener('click', ()=>{
      gtag('event','cta_click',{section:'invest_with_us',label:(el.textContent||el.href||'').trim()});
    });
  }
});
