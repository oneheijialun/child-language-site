'use strict';
(()=>{
 if(document.body.dataset.page!=='library')return;
 const dialog=document.querySelector('#book-detail-dialog'),grid=document.querySelector('#book-grid');
 const title=dialog.querySelector('#book-detail-title'),theme=dialog.querySelector('.book-detail-theme'),picture=dialog.querySelector('.book-detail-pages'),note=dialog.querySelector('.book-detail-note'),previous=dialog.querySelector('[data-book-prev]'),next=dialog.querySelector('[data-book-next]'),thumbs=dialog.querySelector('.book-detail-thumbnails');
 let book=null,current=0,views=[],savedOverflow='',touch=null,ignoreClickUntil=0;
 function update(){
  const indices=views[current],locked=indices.length===0;
  picture.classList.toggle('is-locked',locked);
  picture.classList.toggle('is-spread',indices.length>1);picture.style.setProperty('--page-ratio',locked?1.4:indices.reduce((sum,index)=>sum+(book.sizes?book.sizes[index][0]/book.sizes[index][1]:1.4),0));
  picture.replaceChildren(...indices.map(index=>{const img=document.createElement('img');img.src=book.pages[index];if(book.sizes)img.style.flexGrow=(book.sizes[index][0]/book.sizes[index][1])/indices.reduce((sum,i)=>sum+book.sizes[i][0]/book.sizes[i][1],0);img.alt=`${book.title} · ${book.labels?.[index]||(index===0?'封面':'试读第'+index+'页')}`;return img}));
  if(locked){const message=document.createElement('p');message.className='book-detail-unavailable';message.textContent='暂未开放';picture.replaceChildren(message)}
  previous.disabled=current===0;next.disabled=current===views.length-1;
  dialog.querySelector('[data-book-left-page]').disabled=previous.disabled;dialog.querySelector('[data-book-right-page]').disabled=next.disabled;
  note.textContent=locked?'后续内容暂未开放，可返回查看前5页。':'仅开放前5页。点击左页返回，点击右页继续阅读。';
  [...thumbs.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
 }
 function turn(delta){if(!book)return;const target=current+delta;if(target>=0&&target<views.length){current=target;update()}}
 function openBook(selected){
  const reading=window.BOOK_READING_PAGES?.[selected.id];book=reading?{...selected,pages:reading.slice(0,5).map(p=>p.image),labels:reading.slice(0,5).map(p=>p.label),sizes:reading.slice(0,5).map(p=>[p.width,p.height])}: {...selected,pages:selected.pages.slice(0,5)};current=0;views=[[0]];for(let i=1;i<book.pages.length;i+=2)views.push(i+1<book.pages.length?[i,i+1]:[i]);views.push([]);title.textContent=book.title;theme.textContent=book.theme;
  thumbs.replaceChildren(...views.map((indices,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',indices.length?`查看${indices.map(index=>book.labels?.[index]||(index===0?'封面':'正文第'+index+'页')).join('、')}`:'后续内容暂未开放');if(!indices.length){const label=document.createElement('span');label.textContent='暂未开放';button.append(label)}indices.forEach(index=>{const image=document.createElement('img');image.src=book.pages[index];image.alt='';image.loading='lazy';button.append(image)});button.addEventListener('click',()=>{current=i;update()});return button}));
  update();savedOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();
 }
 grid.addEventListener('click',event=>{
  const card=event.target.closest('a.book-card');if(!card||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const selected=window.SITE_DATA.books.find(item=>item.id===new URL(card.href).searchParams.get('book'));if(!selected)return;
  event.preventDefault();openBook(selected);
 });
 dialog.querySelector('[data-book-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.style.overflow=savedOverflow;book=null;const url=new URL(location.href);if(url.searchParams.has('book')){url.searchParams.delete('book');history.replaceState(null,'',url)}});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close()});
 previous.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();turn(event.key==='ArrowLeft'?-1:1)}});
 const frame=dialog.querySelector('.book-detail-image');
 dialog.querySelector('[data-book-left-page]').addEventListener('click',()=>{if(performance.now()>ignoreClickUntil)turn(-1)});
 dialog.querySelector('[data-book-right-page]').addEventListener('click',()=>{if(performance.now()>ignoreClickUntil)turn(1)});
 frame.addEventListener('touchstart',event=>{touch=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null},{passive:true});
 frame.addEventListener('touchend',event=>{if(!touch||!event.changedTouches.length)return;const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4){ignoreClickUntil=performance.now()+500;turn(dx<0?1:-1)}touch=null},{passive:true});
 frame.addEventListener('touchcancel',()=>{touch=null},{passive:true});
 const requested=new URLSearchParams(location.search).get('book');
 const selected=window.SITE_DATA.books.find(item=>item.id===requested);if(selected)openBook(selected);
})();
