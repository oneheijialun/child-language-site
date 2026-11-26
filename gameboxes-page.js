'use strict';
(()=>{
if(document.body.dataset.page!=='games')return;
const boxes=window.GAMEBOX_CATALOG||[],tabs=document.querySelector('#gamebox-level-tabs'),panel=document.querySelector('#gamebox-level-panel');
if(!tabs||!panel)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dialog=document.querySelector('#gamebox-image-dialog');
const image=dialog.querySelector('img'),caption=dialog.querySelector('figcaption');
const operationVideos={
 '对对碰':'media/matching-level1.mp4',
 '叠叠变':'media/stacking-level1.mp4'
};
const videoDialog=document.querySelector('#gamebox-video-dialog'),video=videoDialog.querySelector('video');
let videoOverflow='';
panel.addEventListener('click',event=>{
 const button=event.target.closest('[data-operation-video]');if(!button)return;
 const name=button.dataset.operationVideo,source=operationVideos[name];if(!source)return;
 videoDialog.querySelector('h2').textContent=name+' · 操作视频';video.src=source;
 videoOverflow=document.body.style.overflow;document.body.style.overflow='hidden';videoDialog.showModal();
});
videoDialog.querySelector('[data-close-gamebox-video]').addEventListener('click',()=>videoDialog.close());
videoDialog.addEventListener('click',event=>{if(event.target!==videoDialog)return;const bounds=videoDialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)videoDialog.close()});
videoDialog.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();document.body.style.overflow=videoOverflow});

function renderItem(item,box,group){
 const strip=box.level===2&&group.name==='掷骰子'&&item.number===9;
 const style=`--item-bg:${esc(item.background||'#f2f6f8')};--dice-ratio:${(item.display_width||item.width)/(item.display_height||item.height)}`;
 const label=`放大查看第${box.level}级${esc(group.name)}：${esc(item.title)}`;
 const picture=`<img src="${esc(item.display_image||item.image)}" alt="" width="${item.display_width||item.width}" height="${item.display_height||item.height}" loading="lazy" decoding="async">`;
 const caption=`<span class="gamebox-item-number">${String(item.number).padStart(2,'0')}</span><strong>${esc(item.title)}</strong>`;
 if(strip)return `<div class="gamebox-item gamebox-strip-item" style="${style}"><div class="gamebox-item-photo"><div class="gamebox-strip-scroll" role="region" aria-label="造句积木②，自动左右展示完整图片">${picture}</div><span class="gamebox-strip-hint" aria-hidden="true">↔ 自动展示</span></div><button type="button" class="gamebox-item-caption" data-item="${item.number}" aria-label="${label}">${caption}</button></div>`;
 return `<button type="button" class="gamebox-item" style="${style}" data-item="${item.number}" aria-label="${label}"><span class="gamebox-item-photo">${picture}<span class="gamebox-zoom" aria-hidden="true">＋</span></span><span class="gamebox-item-caption">${caption}</span></button>`;
}
function selectLevel(n,focus=false,remember=false){
 const box=boxes.find(b=>b.level===n)||boxes[0];
 tabs.querySelectorAll('[data-box-level]').forEach(button=>{const active=Number(button.dataset.boxLevel)===box.level;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus()});
 panel.setAttribute('aria-labelledby',`gamebox-tab-${box.level}`);panel.dataset.level=box.level;
 panel.innerHTML=`<section class="gamebox-box-summary"><div class="gamebox-package"><img src="${esc(box.package)}" alt="第${box.level}级${esc(box.name)}游戏盒${box.level<=2?'全套展示':''}" width="1500" height="1100"></div><div class="gamebox-box-copy"><p class="gamebox-kicker">儿童语言发展游戏盒 · 第${box.level}级</p><h2>${esc(box.name)}</h2><p class="gamebox-count"><strong>${box.count}</strong>项主题内容<span>·</span><strong>${box.groups.length}</strong>种游戏形式</p><div class="gamebox-form-summary" aria-label="本级包含的游戏形式">${box.groups.map(g=>`<span>${esc(g.name)} <b>${g.items.length}</b></span>`).join('')}</div></div></section><div class="gamebox-groups">${box.groups.map(g=>`<section class="gamebox-group" style="--form-color:${g.color}" aria-label="${esc(g.name)}内容"><div class="gamebox-group-copy"><div class="gamebox-group-heading"><div class="gamebox-group-label"><h3>${esc(g.name)}</h3><span>${g.items.length}项</span></div>${box.level===1&&operationVideos[g.name]?`<button type="button" class="gamebox-operation-video" data-operation-video="${esc(g.name)}" aria-label="观看${esc(g.name)}操作视频"><span aria-hidden="true">▶</span>观看操作视频</button>`:''}</div><p>${esc(g.description)}</p></div><div class="gamebox-gallery" data-items="${g.items.length}" data-uniform-dice="${box.level<=2&&g.name==='掷骰子'}" data-wide-dice="${box.level===2&&g.name==='掷骰子'}">${g.items.map(item=>renderItem(item,box,g)).join('')}</div></section>`).join('')}</div>`;
 panel.querySelectorAll('[data-item]').forEach(button=>button.addEventListener('click',()=>{const item=box.groups.flatMap(g=>g.items).find(i=>i.number===Number(button.dataset.item));image.src=item.image;image.alt=item.title;caption.textContent=`第${box.level}级 · ${box.name} / ${String(item.number).padStart(2,'0')} ${item.title}`;dialog.showModal()}));
 panel.querySelectorAll('.gamebox-strip-scroll').forEach(view=>{
  let previous=0,direction=1,pauseUntil=0,position=0;
  const animate=time=>{
   if(!view.isConnected)return;
   const elapsed=previous?Math.min(time-previous,64):0;previous=time;
   const bounds=view.getBoundingClientRect(),visible=bounds.bottom>0&&bounds.top<innerHeight;
   const limit=view.scrollWidth-view.clientWidth;
   if(!document.hidden&&visible&&limit>0&&time>=pauseUntil){
    position=Math.max(0,Math.min(limit,position+direction*elapsed*.026));view.scrollLeft=position;
    if((direction===1&&position>=limit)||(direction===-1&&position<=0)){direction*=-1;pauseUntil=time+1200}
   }
   requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
 });
 if(remember){const url=new URL(location.href);url.searchParams.set('level',box.level);history.replaceState(null,'',url)}
}
tabs.innerHTML=boxes.map(box=>`<button type="button" role="tab" id="gamebox-tab-${box.level}" data-box-level="${box.level}" aria-selected="false" aria-controls="gamebox-level-panel" tabindex="-1"><span class="gamebox-level-number"><b>${box.level}</b><i>级</i></span><strong>${esc(box.name)}</strong><small>${box.count}项主题内容</small></button>`).join('');
tabs.querySelectorAll('[data-box-level]').forEach((button,index)=>{
 button.addEventListener('click',()=>selectLevel(Number(button.dataset.boxLevel),false,true));
 button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?boxes.length-1:(index+(event.key==='ArrowRight'?1:-1)+boxes.length)%boxes.length;selectLevel(boxes[next].level,true,true)});
});
dialog.querySelector('[data-close-gamebox-image]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
selectLevel(Number(new URLSearchParams(location.search).get('level'))||1);
})();
