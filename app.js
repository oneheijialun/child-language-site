'use strict';
(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const page=document.body.dataset.page, isHome=page==='home';
const arrow='<span aria-hidden="true">↗</span>';
const sections=[['玩中学','play','games.html',['games']],['看听做','watch','courses.html',['courses']],['互动练','practice','index.html#practice',[]],['知字理','characters','articles.html',['articles']],['学阅读','reading','library.html',['library']]];
const logo='<img src="assets/logo.png" alt="动手动脑学语言" width="1689" height="359">';
$('#header').innerHTML=`<div class="wrap header-inner"><a class="brand" href="index.html" aria-label="动手动脑学语言首页">${logo}</a><nav class="site-nav" id="site-nav" aria-label="主导航">${sections.map(([t,id,url,keys])=>`<a href="${isHome?'#'+id:url}"${keys.includes(page)?' aria-current="page"':''}>${t}</a>`).join('')}</nav><div class="header-actions"><a class="header-cta" href="${isHome?'#modules':'index.html#modules'}">开始探索 <span aria-hidden="true">${isHome?'↓':'↗'}</span></a><div class="header-tools"><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="展开导航"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button></div></div></div>`;
$('#footer').innerHTML=`<div class="wrap"><div class="footer-main"><div><a class="brand" href="index.html">${logo}</a><p>一起玩，一起读。</p></div><nav class="footer-links" aria-label="页尾导航">${sections.map(([t,,url])=>`<a href="${url}">${t}</a>`).join('')}</nav></div><p class="footer-bottom">儿童语言与阅读发展项目</p></div>`;
const toggle=$('.menu-toggle');toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'收起导航':'展开导航');$('#site-nav').classList.toggle('open',open);toggle.querySelector('path').setAttribute('d',open?'m5 5 14 14M5 19 19 5':'M3 6h18M3 12h18M3 18h18')});
$$('#site-nav a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','展开导航');$('#site-nav').classList.remove('open');toggle.querySelector('path').setAttribute('d','M3 6h18M3 12h18M3 18h18')}));

const homeLessonVideo=$('#home-lesson-video'),homeCoursePlay=$('#course-preview-play'),homeCourseStatus=$('#home-course-status');
let homeCourseKind='lesson';
$$('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
 if(!homeLessonVideo)return;
 homeCourseKind=button.dataset.preview;const movement=homeCourseKind==='movement';
 $$('[data-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 homeLessonVideo.pause();homeLessonVideo.controls=false;
 if(homeLessonVideo.readyState>0)homeLessonVideo.currentTime=0;
 homeLessonVideo.hidden=movement;$('#course-preview-image').hidden=!movement;
 homeCoursePlay.hidden=false;homeCoursePlay.setAttribute('aria-label',movement?'律动视频，敬请期待':'播放主题微课示例视频');
 if(movement){homeCoursePlay.setAttribute('aria-disabled','true');homeCoursePlay.setAttribute('aria-describedby','home-course-status')}
 else{homeCoursePlay.removeAttribute('aria-disabled');homeCoursePlay.removeAttribute('aria-describedby')}
 homeCourseStatus.hidden=!movement;homeCourseStatus.textContent='敬请期待';
}));
if(homeLessonVideo&&homeCoursePlay){
 homeCoursePlay.addEventListener('click',async()=>{
  if(homeCourseKind!=='lesson')return;
  homeLessonVideo.controls=true;
  try{await homeLessonVideo.play()}catch(error){
   if(homeCourseKind!=='lesson'||error.name==='AbortError')return;
   homeCourseStatus.textContent='暂时无法播放，请重试';homeCourseStatus.hidden=false;
  }
 });
 homeLessonVideo.addEventListener('play',()=>{homeCoursePlay.hidden=true;homeCourseStatus.hidden=true});
}

if($('#combine-character'))$('#combine-character').addEventListener('click',()=>{const demo=$('[data-character-demo]'),combined=demo.classList.toggle('combined');$('#combine-character').textContent=combined?'再分开看':'合起来看'});

const books=window.SITE_DATA.books;
const bookGroup=b=>/自然|天气|探索|季节|比较|空间/.test(b.theme)?'自然探索':'生活故事';
if(page==='library'){
 let filter='全部';const search=$('#book-search');
 function render(){const q=search.value.trim(),list=books.filter(b=>(filter==='全部'||bookGroup(b)===filter)&&b.title.includes(q));$('#book-grid').innerHTML=list.length?list.map(b=>`<a class="book-card" href="library.html?book=${b.id}"><div class="book-cover"><img src="${b.pages[0]}" alt="${esc(b.title)}封面" loading="lazy"></div><h2>${esc(b.title)}</h2><p>${esc(b.theme)} · 试读</p></a>`).join(''):'<p class="empty-state">没有找到这本书，换个书名试试吧。</p>';$('#book-count').textContent=`找到${list.length}本绘本`}
 $('#book-filters').innerHTML=['全部','自然探索','生活故事'].map((t,i)=>`<button type="button" data-book-filter="${t}" aria-pressed="${i===0}">${t}</button>`).join('');$$('[data-book-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.bookFilter;$$('[data-book-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()}));search.addEventListener('input',render);render();
}
if(page==='articles'){
 let filter='全部';const search=$('#article-search');const group=a=>/序言|绪论/.test(a.title)?'序言与绪论':'教学课次';
 function render(){const q=search.value.trim(),list=window.SITE_DATA.articles.filter(a=>(filter==='全部'||group(a)===filter)&&(a.title+' '+(a.summary||'')+' '+(a.category||'')+' '+(a.semester||'')+' '+(a.unit_label||'')).includes(q));$('#article-count').textContent=`共 ${list.length} 篇文章`;$('#article-list').innerHTML=list.length?list.map(a=>`<a class="article-row" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer"><div class="article-cover${a.cover?'':' article-cover-pending'}">${a.cover?`<img src="${esc(a.cover)}" alt="" width="300" height="300" loading="lazy">`:'<span>封面待同步</span>'}</div><div class="article-card-copy"><div class="article-labels"><span class="article-term">${esc(a.semester)}</span><span class="article-unit">${esc(a.unit_label)}</span>${a.category!==a.unit_label?`<span class="article-category">${esc(a.category)}</span>`:''}</div><h2>${esc(a.title)}</h2><p class="article-summary">${esc(a.summary)}</p><div class="article-card-meta"><span>虹阅读实验室</span><span class="article-read">阅读全文 <b aria-hidden="true">↗</b></span></div></div></a>`).join(''):'<p class="empty-state">没有找到相关文章，换个汉字或课次试试。</p>'}
 $('#article-filters').innerHTML=['全部','序言与绪论','教学课次'].map((t,i)=>`<button type="button" data-article-filter="${t}" aria-pressed="${i===0}">${t}</button>`).join('');$$('[data-article-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.articleFilter;$$('[data-article-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()}));search.addEventListener('input',render);render();
}

})();
