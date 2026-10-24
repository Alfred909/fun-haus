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
    {id:'statuePRGE',title:'Beyond the Building',creator:'Convention research',description:'Explore the full convention research website: maps, photographs, evidence, and the PRGE documentary.',x:6}
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
    const url=id==='statuePRGE'?new URL('research/index.html',location.href).href:app.playUrl;
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
  summaries.hall={title:'Display Hall / playable exhibits',tag:'03 / choose a statue',body:'<p>Each statue opens an interactive exhibit. Aim at it and click, or walk close and press E.</p><p>The Regulars is on the left, Mars Scout in the middle, and Beyond the Building convention research on the right.</p><button onclick="showMuseumGames()">Open Games menu</button>'};

function exhibitMesh(id,geometry,material,x,y,z){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y+.7,z-12);mesh.userData.subject=id;scene.add(mesh);return mesh}
function replacePlaceholder(id){for(const mesh of [...scene.children])if(mesh.userData.subject===id&&mesh.position.y===1.4){scene.remove(mesh);mesh.geometry.dispose();mesh.material.dispose()}}
function installTent(){
 const id='statueMars';replacePlaceholder(id);
 exhibitMesh(id,new THREE.SphereGeometry(.8,16,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x10b981,roughness:.3,metalness:.2}),0,0,0);
 const ring=exhibitMesh(id,new THREE.TorusGeometry(.78,.02,8,24),new THREE.MeshBasicMaterial({color:0x34d399}),0,.1,0);ring.rotation.x=Math.PI/2;
}
function installConventionHall(){
 const id='statuePRGE';replacePlaceholder(id);
 const wall=new THREE.MeshStandardMaterial({color:'#e9e2cf',roughness:.85}),roof=new THREE.MeshStandardMaterial({color:'#677d80',roughness:.7,side:THREE.DoubleSide});
 const box=(w,h,d,x,y,z,mat)=>exhibitMesh(id,new THREE.BoxGeometry(w,h,d),mat,x+6,y,z);
 box(1.6,.08,1.25,0,.04,0,wall);box(1.6,.48,.06,0,.32,-.6,wall);
 for(const side of [-1,1])box(.06,.48,1.25,side*.77,.32,0,wall);
 box(1.7,.08,1.35,0,1.18,0,roof);
 for(const x of [-.45,0,.45])for(const z of [-.3,.22]){box(.22,.24,.21,x,.2,z,new THREE.MeshStandardMaterial({color:x===0?'#b77450':'#397999'}));box(.18,.04,.04,x,.33,z+.07,new THREE.MeshBasicMaterial({color:'#e6ed9b'}))}
 for(const x of [-.25,.25])box(.025,.012,1.1,x,.09,0,new THREE.MeshBasicMaterial({color:'#b77450'}));
}
async function installYaki(){
 const response=await fetch('models/yaki.bin');if(!response.ok)throw Error('Yaki model unavailable');
 const data=new Float32Array(await response.arrayBuffer());if(!data.length||data.length%8)throw Error('Invalid Yaki model');
 const buffer=new THREE.InterleavedBuffer(data,8),geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.InterleavedBufferAttribute(buffer,3,0));geo.setAttribute('normal',new THREE.InterleavedBufferAttribute(buffer,3,3));geo.setAttribute('uv',new THREE.InterleavedBufferAttribute(buffer,2,6));geo.computeBoundingBox();geo.computeBoundingSphere();
 const tex=await new THREE.TextureLoader().loadAsync('models/yaki-texture.jpg');tex.colorSpace=THREE.SRGBColorSpace;
 replacePlaceholder('statueRegulars');exhibitMesh('statueRegulars',geo,new THREE.MeshStandardMaterial({map:tex,roughness:.8}),-6,0,0);
}
if(ready){installTent();installConventionHall();installYaki().catch(error=>{console.warn(error.message);summaries.statueRegulars.body+='<p class="note">Character sculpture could not load. The game is still available.</p>'})}

})();