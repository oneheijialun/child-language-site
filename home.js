'use strict';
(()=>{
if(document.body.dataset.page!=='home')return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const chart=document.querySelector('[data-growth-chart]');
const groups={
oral:[
['口语词汇',[['词汇广度',1,2,'积累更多词语，逐步加深对词义与词语关系的理解。'],['词汇深度',3,4,'从认识词语，走向理解词语的多种含义和使用情境。']]],
['语素意识',[['语素辨别',1,1,'发现词语中的意义单位，辨别相同和不同的语素。'],['语素建构',2,4,'理解语素之间的关系，尝试组合和理解新词。']]],
['语音通达',[['词汇标签',1,1,'把看到的事物与相应名称联系起来。'],['快速通达',2,4,'从熟悉的词语出发，练习更顺畅地提取和表达。']]],
['语音意识',[['音节意识',1,3,'听一听、分一分，感受词语中的音节。'],['音位意识',4,4,'进一步关注语音内部更细致的声音单位。']]],
['概念认知',[['概念归类',1,2,'按共同特点归类，理解事物之间的关系。'],['概念拓展',3,4,'在已有概念上，增加新的联系和理解。']]]],
reading:[
['汉字书写',[['读写萌芽',3,3,'在观察和动手操作中积累读写准备经验。'],['拓展书写',4,4,'联系汉字结构，把观察经验延伸到书写。']]],
['形音转换',[['词物映射',1,2,'将词语与熟悉的事物和图像联系起来。'],['形音联结',3,4,'逐步建立汉字字形与语音之间的联系。']]],
['正字法意识',[['文字意识',1,2,'发现文字与图画的不同，开始留意文字。'],['位置意识',3,3,'观察部件在汉字中的位置。'],['部件意识',4,4,'比较共同部件，发现汉字结构的规律。']]],
['汉字知识',[['形义联结',1,2,'从熟悉的事物与图像，联系文字的形和义。'],['汉字演变',3,3,'观察汉字从图像到字形的演变。'],['汉字家族',4,4,'把有共同部件的字放在一起，比较联系与差异。']]],
['视觉搜索',[['图片搜索',1,1,'先在图片中寻找目标。'],['图文搜索',2,3,'逐步在图画与文字之间寻找、比较和联系。'],['符号搜索',4,4,'在符号中辨认和查找目标，关注细节。']]]]
};
let selected=1,timer,chartVisible=false,hasAnimated=false;
const barColours={reading:['#85c600','#52bd0b','#06ab3b','#009c56','#00876d'],oral:['#ffb900','#ffac00','#ff9e00','#ff8b00','#ff7900']};
const stageNames=['口语发展','口语提升','读写发展','读写提升'];
let boxesPrepared=false;function prepareBoxes(){if(boxesPrepared)return;boxesPrepared=true;[2,3,4].forEach(n=>{const img=new Image();img.src=`assets/package-${n}.webp`})}
function replay(){if(reduced||!chartVisible)return;hasAnimated=true;clearTimeout(timer);chart.classList.remove('is-playing');void chart.offsetWidth;chart.classList.add('is-playing');timer=setTimeout(()=>chart.classList.remove('is-playing'),4200)}
function render(){
chart.querySelector('#growth-panels').innerHTML=['reading','oral'].map((domain,g)=>`<section class="growth-group" data-domain="${domain}" aria-labelledby="growth-title-${domain}"><h3 id="growth-title-${domain}">${domain==='reading'?'阅读发展':'口语提升'}</h3><div class="growth-body"><div class="growth-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="growth-rows">${groups[domain].map(([label,bars],i)=>`<div class="growth-row" style="--row:${g*5+i}"><span class="growth-row-label">${label}</span><div class="growth-track">${bars.map(([name,start,end,description])=>`<div class="growth-cell" style="grid-column:${start}/${end+1};--bar-from:${barColours[domain][start-1]};--bar-to:${barColours[domain][end]};--bar-ink:${domain==='reading'?(start<=2?'#233300':'#ffffff'):(start<=2?'#4a3200':'#ffffff')};--enter-delay:${(9-(g*5+i))*180+(start-1)*150}ms"><span class="growth-shadow" aria-hidden="true"><span class="growth-shadow-shape"></span></span><button type="button" class="growth-bar" data-start="${start}" data-end="${end}" data-growth-note="${description}" aria-label="${name}，第${start}${end===start?'':'至'+end}级">${name}</button></div>`).join('')}</div></div>`).join('')}</div></div></section>`).join('');
chart.querySelectorAll('.growth-bar').forEach(b=>b.addEventListener('click',()=>{chart.querySelector('#growth-explain').textContent=b.dataset.growthNote}));
updateSelection();
}
function updateSelection(){
chart.querySelectorAll('[data-growth-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.growthStage)===selected)));
chart.querySelector('.growth-stages').style.setProperty('--selected',String(selected-1));
chart.querySelectorAll('.growth-bar').forEach(b=>{const active=selected>=Number(b.dataset.start)&&selected<=Number(b.dataset.end);b.classList.toggle('is-active',active)});
updateColumnSpotlight();
renderMobile();
}
function renderMobile(){
const host=document.getElementById('growth-mobile');if(!host)return;
host.innerHTML=['reading','oral'].map(domain=>{
const rows=groups[domain].map(([label,bars])=>{
const active=bars.filter(b=>selected>=b[1]&&selected<=b[2]);
if(!active.length)return '';
const [name,start,end,description]=active[0];
const ink=domain==='reading'?(start<=2?'#233300':'#ffffff'):(start<=2?'#4a3200':'#ffffff');
return `<li><div class="gm-top"><span class="gm-label">${label}</span><span class="gm-bar" style="--gm-from:${barColours[domain][start-1]};--gm-to:${barColours[domain][end]};--gm-ink:${ink}">${name}</span></div><p class="gm-desc">${description}</p></li>`;
}).join('');
return rows?`<section><h4>${domain==='reading'?'阅读发展':'口语提升'}</h4><ul>${rows}</ul></section>`:'';
}).join('');
}
function updateColumnSpotlight(){
chart.querySelectorAll('.growth-group').forEach(group=>{
const column=group.querySelectorAll('.growth-grid i')[selected-1].getBoundingClientRect();
group.querySelectorAll('.growth-bar').forEach(bar=>{const rect=bar.getBoundingClientRect(),left=column.left-rect.left,right=column.right-rect.left;bar.style.setProperty('--column-left',`${left}px`);bar.style.setProperty('--column-right',`${right}px`);const shadow=bar.parentElement.querySelector('.growth-shadow'),shape=shadow.firstElementChild;shape.style.setProperty('--column-left',`${left}px`);shape.style.setProperty('--column-right',`${right}px`);shadow.classList.toggle('is-in-column',right>20&&left<rect.width-20)});
});
}
function selectLevel(n){if(n===selected)return;selected=n;const img=document.querySelector('[data-box-image]');img.src=`assets/package-${selected}.webp`;img.alt=`第${selected}级${stageNames[selected-1]}教具盒`;updateSelection()}
let pointerInColumns=false;
function activateColumn(n){chart.classList.add('has-column-focus');selectLevel(n)}
function clearColumnFocus(){if(!pointerInColumns&&!chart.querySelector('[data-growth-stage]:focus-visible'))chart.classList.remove('has-column-focus')}
function columnAtPointer(event){const axis=chart.querySelector('.growth-grid').getBoundingClientRect(),bottom=chart.querySelector('.growth-stages').getBoundingClientRect().bottom;return event.clientX>=axis.left&&event.clientX<axis.right&&event.clientY>=axis.top&&event.clientY<=bottom?Math.min(4,Math.floor((event.clientX-axis.left)/(axis.width/4))+1):null}
chart.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const n=columnAtPointer(event);pointerInColumns=n!==null;if(n)activateColumn(n);else clearColumnFocus()});
chart.addEventListener('pointerleave',()=>{pointerInColumns=false;clearColumnFocus()});
chart.addEventListener('focusout',()=>requestAnimationFrame(clearColumnFocus));
chart.querySelectorAll('[data-growth-stage]').forEach(b=>{b.addEventListener('focus',()=>{if(b.matches(':focus-visible'))activateColumn(Number(b.dataset.growthStage))});b.addEventListener('click',()=>activateColumn(Number(b.dataset.growthStage)))});
chart.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){const n=columnAtPointer(event);if(n)activateColumn(n)}});
document.addEventListener('pointerdown',event=>{if(!chart.contains(event.target)){pointerInColumns=false;chart.classList.remove('has-column-focus')}});

chart.querySelector('.growth-replay').addEventListener('click',replay);
render();
if('ResizeObserver'in window)new ResizeObserver(updateColumnSpotlight).observe(chart);
if(!reduced&&'IntersectionObserver'in window){const chartObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{chartVisible=e.isIntersecting;if(chartVisible)prepareBoxes();if(chartVisible&&!hasAnimated)replay();if(!chartVisible){clearTimeout(timer);chart.classList.remove('is-playing')}})},{threshold:.25,rootMargin:'0px 0px -40px 0px'});chartObserver.observe(chart)}else chartVisible=true;
window.__homeReveal=true;
const reveals=document.querySelectorAll('[data-reveal]');
if(!reduced&&'IntersectionObserver'in window){const revealObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');revealObserver.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -8% 0px'});reveals.forEach(el=>revealObserver.observe(el))}else reveals.forEach(el=>el.classList.add('is-in'));
})();
