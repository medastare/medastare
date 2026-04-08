// ---- Scroll Reveal ----
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
},{threshold:0.2});

// Hedefler
document.querySelectorAll('.hero img, .hero h1, .hero p, .grid-item, section h2, section p, footer a')
  .forEach(el=>io.observe(el));

// Grid item’lara küçük gecikme
document.querySelectorAll('.grid-item').forEach((c,i)=>{
  c.style.transitionDelay = (0.1 * i) + 's';
});

// ---- Hero Parallax & Tilt ----
const hero = document.querySelector('.hero');
const heroImg = document.querySelector('.hero img');
const heroTitle = document.querySelector('.hero h1');
const heroText = document.querySelector('.hero p');

if(heroImg){
  if(heroImg.complete){
    requestAnimationFrame(()=> heroImg.classList.add('show'));
  } else {
    heroImg.addEventListener('load', ()=> heroImg.classList.add('show'));
  }
}

// Mouse ile tilt
if(hero){
  hero.addEventListener('mousemove',(e)=>{
    const r = hero.getBoundingClientRect();
    const cx = (e.clientX - (r.left + r.width/2)) / (r.width/2);
    const cy = (e.clientY - (r.top + r.height/2)) / (r.height/2);
    const tilt = 6;
    hero.style.setProperty('--ry', `${cx*tilt}deg`);
    hero.style.setProperty('--rx', `${-cy*tilt}deg`);
  });
  hero.addEventListener('mouseleave',()=>{
    hero.style.setProperty('--ry','0deg');
    hero.style.setProperty('--rx','0deg');
  });
}

// ---- Scroll ile parallax / blur ----
let latestScroll = 0, ticking = false;
function updateOnScroll(){
  const y = latestScroll;
  const h = window.innerHeight;

  if(hero){
    const k = Math.min(1, y / (h*0.8));
    heroTitle.style.opacity = String(1 - k*0.4);
    heroTitle.style.transform = `translateY(${k*20}px) scale(${1 - k*0.02})`;
    heroText.style.opacity = String(1 - k*0.4);
    heroText.style.transform = `translateY(${k*15}px)`;
    if(heroImg) heroImg.style.transform = `translateY(${y*0.05}px)`;
  }

  // backToTop
  const toTop = document.getElementById('backToTop');
  if(toTop){
    if(y > 400) toTop.classList.add('show');
    else toTop.classList.remove('show');
  }

  ticking = false;
}
function onScroll(){
  latestScroll = window.scrollY || window.pageYOffset;
  if(!ticking){
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, {passive:true});
updateOnScroll();

// ---- Back to top click ----
const toTop = document.getElementById('backToTop');
if(toTop){
  toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
}
