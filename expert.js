'use strict';
(()=>{
const section=document.querySelector('.expert-fusion');if(!section)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver'in window){section.classList.add('animate-ready');const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){section.classList.add('is-visible');observer.disconnect()}},{threshold:.16});observer.observe(section)}else section.classList.add('is-visible');
if(!reduced&&matchMedia('(pointer: fine)').matches){let frame=null;section.addEventListener('pointermove',event=>{if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=section.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;section.style.setProperty('--portrait-x',`${x*12}px`);section.style.setProperty('--portrait-y',`${y*7}px`);section.style.setProperty('--depth-x',`${-x*18}px`);section.style.setProperty('--depth-y',`${-y*12}px`)})});section.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);['--portrait-x','--portrait-y','--depth-x','--depth-y'].forEach(k=>section.style.setProperty(k,'0px'))})}
})();
