// ══════════════════════════════════════════════════
// CURSOR
// ══════════════════════════════════════════════════
const cr=document.getElementById('cr'),crr=document.getElementById('cr-r');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cr.style.left=mx+'px';cr.style.top=my+'px';});
(function lp(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;crr.style.left=rx+'px';crr.style.top=ry+'px';requestAnimationFrame(lp);})();
document.querySelectorAll('a,button,.card,.gc,.rc,.pc').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cr.style.width='16px';cr.style.height='16px';crr.style.width='50px';crr.style.height='50px';});
  el.addEventListener('mouseleave',()=>{cr.style.width='8px';cr.style.height='8px';crr.style.width='32px';crr.style.height='32px';});
});

// ══════════════════════════════════════════════════
// NAV
// ══════════════════════════════════════════════════
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('sc',scrollY>60),{passive:true});

// ══════════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════════
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting)e.target.classList.add('in');
  });
},{threshold:.12,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.rv,.rv-l,.rv-r,.card,.gc,.rc,.pc,.sbi').forEach(el=>io.observe(el));
['.rc','.pc','.sbi'].forEach(sel=>document.querySelectorAll(sel).forEach((el,i)=>{if(!el.style.transitionDelay)el.style.transitionDelay=(i*.1)+'s';}));

// ── FAQ ──
document.querySelectorAll('.fq').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const fi=btn.parentElement,was=fi.classList.contains('op');
    document.querySelectorAll('.fi.op').forEach(el=>el.classList.remove('op'));
    if(!was)fi.classList.add('op');
  });
});
