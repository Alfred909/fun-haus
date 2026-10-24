/* Museum game exhibits. Edit apps.json to update game destinations. */
(() => {
  const style=document.createElement('style');
  style.textContent='.museum-menu-button{position:fixed;right:24px;bottom:24px;z-index:8;padding:10px 18px}.museum-game-shell{position:fixed;inset:0;z-index:40;background:#172421;display:grid;grid-template-rows:auto minmax(0,1fr)}.museum-game-shell[hidden]{display:none}.museum-game-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:10px 18px;background:#f0eadb;color:#29362e}.museum-game-bar strong{font-size:18px}.museum-game-bar small{display:block}.museum-game-bar nav{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.museum-game-bar button{padding:8px 12px}.museum-game-shell iframe{width:100%;height:100%;border:0;background:#10251f}.game-options{display:grid;gap:12px;margin-top:20px}.game-options button{text-align:left}.game-options small{display:block;margin-top:5px}.game-menu-note{font-size:13px}@media(max-width:600px){.museum-menu-button{bottom:12px;right:12px}.museum-game-bar{padding:8px}.museum-game-bar small{font-size:11px}}';
  document.head.append(style);
  const menuButton=document.createElement('button');
  menuButton.className='museum-menu-button';menuButton.id='museum-games-menu';menuButton.textContent='Games menu';
  document.body.append(menuButton);
  const shell=document.createElement('section');shell.className='museum-game-shell';shell.hidden=true;shell.setAttribute('aria-label','Playable museum exhibit');
  shell.innerHTML='<header class="museum-game-bar"><div><strong id="museum-game-title"></strong><small>Press Esc to release the mouse, then choose Museum menu.</small></div><nav aria-label="Game navigation"><a id="museum-open-tab" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a><button id="museum-return-statue">Return to statue</button><button id="museum-return-menu">Museum menu</button></nav></header><iframe id="museum-game-frame" title="Museum game" sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals" allow="fullscreen"></iframe>';
  document.body.append(shell);
  const frame=document.getElementById('museum-game-frame');
  let games=[],selected=null;
  const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const definitions=[
    {id:'statueRegulars',title:'The Regulars',creator:'Claude',description:'Explore Gai Fong Street in an action game prototype.',x:-6},
    {id:'statueMars',title:'Mars Scout',creator:'Gemini',description:'Build a Mars outpost and manage shelter, oxygen and supplies.',x:0},
    {id:'statuePRGE',title:'PRGE 2019',creator:'Fun Haus research',description:'Explore the life of a temporary arcade through the original interactive documentary.',x:6}
  ];
  function populate(){
    for(const d of definitions){
      const app=games.find(a=>a.title===d.title);
      const available=d.id==='statuePRGE'||Boolean(app&&validURL(app.playUrl));
      summaries[d.id]={title:d.title,tag:'Display hall / interactive exhibit',body:'<p>'+escapeText(d.description)+'</p><p class="note">'+escapeText(d.creator)+'</p><div class="launch-card"><p>Play this exhibit? Your place in the museum will be kept.</p><button data-play-exhibit="'+d.id+'"'+(available?'':' disabled')+'>'+(available?'Play '+escapeText(d.title)+' ▶':'Game link unavailable')+'</button></div><p class="game-menu-note">The game opens with a return bar. Esc releases the mouse; Museum menu returns to the game list.</p>'};
    }
    summaries.games={title:'Choose an exhibit',tag:'Fun Haus / games menu',body:'<p>Choose a game here, or visit its statue in the Display Hall.</p><div class="game-options">'+definitions.map(d=>'<button data-preview-exhibit="'+d.id+'">'+escapeText(d.title)+'<small>'+escapeText(d.description)+'</small></button>').join('')+'</div><p><button id="visit-game-statues">Visit the statues ↗</button></p><p class="note">Desktop keyboard and mouse recommended. Open in new tab is available if your browser limits a game inside the museum.</p>'};
  }
  function validURL(value){try{const u=new URL(value);return u.protocol==='https:'&&u.origin===location.origin}catch{return false}}
  function showMenu(){keys.clear();showDetail('games')}
  menuButton.onclick=showMenu;
  window.showMuseumGames=showMenu;
  document.addEventListener('click',e=>{
    const preview=e.target.closest('[data-preview-exhibit]');
    const play=e.target.closest('[data-play-exhibit]');
    if(preview)showDetail(preview.dataset.previewExhibit);
    if(play)startExhibit(play.dataset.playExhibit);
    if(e.target.closest('#visit-game-statues')){
      pos.x=0;pos.z=-9.4;yaw=0;pitch=0;keys.clear();
      $('detail').style.display='none';$('welcome').style.display='grid';
      $('enter').textContent='Explore the game statues ↗';$('enter').focus();
    }
  });
  function startExhibit(id){
    const d=definitions.find(x=>x.id===id);if(!d)return;
    const app=games.find(a=>a.title===d.title);
    if(id!=='statuePRGE'&&(!app||!validURL(app.playUrl)))return;
    selected=d;programOpen=true;keys.clear();
    $('detail').style.display='none';$('welcome').style.display='none';$('prompt').style.display='none';
    if(document.pointerLockElement)document.exitPointerLock();
    document.getElementById('museum-game-title').textContent=d.title;
    const url=id==='statuePRGE'?new URL('programs/prge.html',location.href).href:app.playUrl;
    document.getElementById('museum-open-tab').href=url;
    frame.title=d.title+' — playable exhibit';
    shell.hidden=false;menuButton.hidden=true;frame.src=url;
    document.getElementById('museum-return-menu').focus();
  }
  function stopExhibit(menu){
    if(shell.hidden)return;
    if(document.pointerLockElement)document.exitPointerLock();
    frame.removeAttribute('src');frame.src='about:blank';
    shell.hidden=true;menuButton.hidden=false;programOpen=false;keys.clear();
    showDetail(menu?'games':selected.id);
  }
  document.getElementById('museum-return-menu').onclick=()=>stopExhibit(true);
  document.getElementById('museum-return-statue').onclick=()=>stopExhibit(false);
  window.addEventListener('message',e=>{
    if(!shell.hidden&&selected?.id==='statuePRGE'&&e.source===frame.contentWindow&&e.data?.type==='funhaus-exit')stopExhibit(false);
  });
  // Same-origin exhibits may hand Escape back to the museum when they do not hold the mouse.
  frame.addEventListener('load',()=>{
    if(shell.hidden)return;
    try{frame.contentDocument.addEventListener('keydown',e=>{
      if(e.code==='KeyM'&&e.altKey){e.preventDefault();stopExhibit(true)}
    })}catch{}
  });
  populate();
  fetch('apps.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{games=data;populate()}).catch(()=>{
    summaries.games.body+='<p role="alert">Game links could not load. Reload the page to try again. The documentary remains available.</p>';
  });
  summaries.hall={title:'Display Hall / playable exhibits',tag:'03 / choose a statue',body:'<p>Each statue opens an interactive exhibit. Aim at it and click, or walk close and press E.</p><p>The Regulars is on the left, Mars Scout in the middle, and PRGE 2019 on the right.</p><button onclick="showMuseumGames()">Open Games menu</button>'};
})();
