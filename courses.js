'use strict';
(()=>{
if(document.body.dataset.page!=='courses')return;
const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const themes=['动物','植物','食物','环境','家庭','身体','服装','职业'],media=window.COURSE_MEDIA||[];
const params=new URLSearchParams(location.search),initialUnit=Number(params.get('unit'));
let unit=Number.isInteger(initialUnit)&&initialUnit>=1&&initialUnit<=8?initialUnit:1,activeKind=params.get('type')==='movement'?'movement':'lesson';
const duration=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function remember(){const url=new URL(location.href);url.searchParams.set('unit',unit);url.searchParams.set('type',activeKind);url.hash='';history.replaceState(null,'',url)}
function choose(kind,item){
 if(!item)return;
 const image=$(`#${kind}-image`);
 image.src=item.poster;image.alt=item.title+' · 视频截图';
 $(`#${kind}-title`).textContent=item.title;
 all(`#${kind}-playlist button`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===item.id)));

}
function selectType(kind,focus=false,save=true){
 activeKind=kind;
 all('[data-course-type]').forEach(button=>{const active=button.dataset.courseType===kind;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus();$(`#${button.dataset.courseType}-player`).hidden=!active});
 if(save)remember();
}
function render(){
 all('[data-unit]').forEach(button=>{const active=Number(button.dataset.unit)===unit;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1});
 $('#unit-panel').setAttribute('aria-labelledby',`unit-${unit}`);$('#unit-title').innerHTML=`<span class="unit-title-name">${themes[unit-1]}</span><span class="unit-title-number">第${unit}单元</span>`;
 for(const [kind,type]of [['lesson','课程'],['movement','律动']]){
  const list=media.filter(v=>v.unit===unit&&v.kind===type).sort((a,b)=>(a.lesson||99)-(b.lesson||99)||a.title.localeCompare(b.title,'zh-CN'));
  const image=$(`#${kind}-image`);image.removeAttribute('src');
  $(`#${kind}-playlist`).innerHTML=list.length?list.map(v=>`<button type="button" class="course-video-choice" data-id="${esc(v.id)}" aria-pressed="false"><img src="${esc(v.poster)}" alt="" loading="lazy"><span><strong>${esc(v.title)}</strong><small>${v.lesson?'第'+v.lesson+'课 · ':''}${duration(v.duration)}</small></span></button>`).join(''):'<p class="course-empty">本单元视频将陆续补充。</p>';
  $(`#${kind}-title`).textContent='';$(`#${kind}-status`).textContent='';
  all(`#${kind}-playlist button`).forEach((button,i)=>button.addEventListener('click',()=>choose(kind,list[i])));
  if(list.length)choose(kind,list[0]);
 }
 selectType(activeKind,false,false);
}
$('#unit-tabs').innerHTML=themes.map((theme,i)=>`<button type="button" role="tab" id="unit-${i+1}" data-unit="${i+1}" aria-label="第${i+1}单元 ${theme}" aria-controls="unit-panel" aria-selected="false" tabindex="-1"><span class="course-unit-number">第${i+1}单元</span><strong class="course-unit-name">${theme}</strong></button>`).join('');
all('[data-unit]').forEach((button,i)=>{
 button.addEventListener('click',()=>{unit=i+1;render();remember();button.scrollIntoView({block:'nearest',inline:'nearest'})});
 button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const n=event.key==='Home'?0:event.key==='End'?7:(i+(event.key==='ArrowRight'?1:-1)+8)%8;const next=all('[data-unit]')[n];next.click();next.focus()});
});
all('[data-course-type]').forEach((button,i)=>{
 button.addEventListener('click',()=>selectType(button.dataset.courseType));
 button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const n=event.key==='Home'?0:event.key==='End'?1:1-i;selectType(all('[data-course-type]')[n].dataset.courseType,true)});
});
render();if(location.hash)remember();
})();
