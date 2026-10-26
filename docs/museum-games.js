/* Museum game exhibits. Edit apps.json to update game destinations. */
(() => {
  const style=document.createElement('style');
  style.textContent='.museum-menu-button{position:fixed;right:24px;bottom:24px;z-index:8;padding:10px 18px}.museum-game-shell{position:fixed;inset:0;z-index:40;background:#172421;display:grid;grid-template-rows:auto minmax(0,1fr)}.museum-game-shell[hidden]{display:none}.museum-game-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:10px 18px;background:#f0eadb;color:#29362e}.museum-game-bar strong{font-size:18px}.museum-game-bar small{display:block}.museum-game-bar nav{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.museum-game-bar button{padding:8px 12px}.museum-game-shell iframe{width:100%;height:100%;border:0;background:#10251f}.game-options{display:grid;gap:12px;margin-top:20px}.game-options button{text-align:left}.game-options small{display:block;margin-top:5px}.game-menu-note{font-size:13px}@media(max-width:600px){.museum-menu-button{bottom:12px;right:12px}.museum-game-bar{padding:8px}.museum-game-bar small{font-size:11px}}';
  document.head.append(style);
  const menuButton=document.createElement('button');
  menuButton.className='museum-menu-button';menuButton.id='museum-games-menu';menuButton.textContent='Games menu';
  document.body.append(menuButton);const portfolioLink=document.createElement('a');portfolioLink.href='index.html';portfolioLink.textContent='← Portfolio';portfolioLink.style.cssText='position:fixed;left:24px;bottom:24px;z-index:8;background:#f0eadb;color:#29362e;padding:10px 16px';document.body.append(portfolioLink);
  const shell=document.createElement('section');shell.className='museum-game-shell';shell.hidden=true;shell.setAttribute('aria-label','Playable museum exhibit');
  shell.innerHTML='<header class="museum-game-bar"><div><strong id="museum-game-title"></strong><small>Press Esc to release the mouse, then choose Museum menu.</small></div><nav aria-label="Game navigation"><a id="museum-open-tab" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a><button id="museum-return-statue">Return to statue</button><button id="museum-return-menu">Museum menu</button></nav></header><iframe id="museum-game-frame" title="Museum game" sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals" allow="fullscreen"></iframe>';
  document.body.append(shell);
  const frame=document.getElementById('museum-game-frame');
  let games=[],selected=null;
  const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const definitions=[
    {id:'arcadeNightShift',title:'Night Shift',creator:'Keith Borgholthaus · ChatGPT-assisted prototype',description:'Run a ghost-catching business: drive through the city, explore haunted buildings, coordinate your crew and upgrade your equipment.',x:-9},
    {id:'movingPool',title:'Moving Pool Intervention',creator:'Simulation Lab / guest behavior',description:'A moving family pool and circular river with finite tubes. Families collect every tube they want before leaving.',local:'programs/moving_pool_intervention_prototype.html',x:7.7},
    {id:'statueRegulars',title:'The Regulars',creator:'Claude',description:'Explore Gai Fong Street in an action game prototype.',x:-6},
    {id:'statueMars',title:'Mars Scout',creator:'Gemini',description:'Build a Mars outpost and manage shelter, oxygen and supplies.',x:0},
    {id:'statuePRGE',title:'Beyond the Building',creator:'Convention research',description:'Explore the full convention research website: maps, photographs, evidence, and the PRGE documentary.',x:6}
  ];
  function populate(){
    for(const d of definitions){
      const app=games.find(a=>a.title===d.title);
      const available=Boolean(d.local)||d.id==='statuePRGE'||Boolean(app&&validURL(app.playUrl));
      summaries[d.id]={title:d.title,tag:d.local?'Simulation Lab / cocktail table exhibit':'Display hall / interactive exhibit',body:'<p>'+escapeText(d.description)+'</p><p class="note">'+escapeText(d.creator)+'</p><div class="launch-card"><p>Play this exhibit? Your place in the museum will be kept.</p><button data-play-exhibit="'+d.id+'"'+(available?'':' disabled')+'>'+(available?'Play '+escapeText(d.title)+' ▶':'Game link unavailable')+'</button></div><p class="game-menu-note">The game opens with a return bar. Esc releases the mouse; Museum menu returns to the game list.</p>'};
    }
    summaries.games={title:'Choose an exhibit',tag:'Fun Haus / games menu',body:'<p>Visit the moving-pool table in the Simulation Lab, or the game statues in the Display Hall.</p><div class="game-options">'+definitions.map(d=>'<button data-preview-exhibit="'+d.id+'">'+escapeText(d.title)+'<small>'+escapeText(d.description)+'</small></button>').join('')+'</div><p><button id="visit-game-statues">Visit the Display Hall ↗</button></p><p class="note">Desktop keyboard and mouse recommended. Open in new tab is available if your browser limits a game inside the museum.</p>'};
  }
  function validURL(value){try{const u=new URL(value);return u.protocol==='https:'&&u.origin===location.origin}catch{return false}}
  function showMenu(){keys.clear();showDetail('games')}
  menuButton.onclick=showMenu;
  document.addEventListener('keydown',e=>{if(e.code==='Escape'&&!shell.hidden){e.preventDefault();e.stopImmediatePropagation();stopExhibit(false)}},true);
  window.showMuseumGames=showMenu;
  document.addEventListener('click',e=>{
    const preview=e.target.closest('[data-preview-exhibit]');
    const play=e.target.closest('[data-play-exhibit]');
    if(preview)showDetail(preview.dataset.previewExhibit);
    if(play)startExhibit(play.dataset.playExhibit);
    if(e.target.closest('#visit-game-statues')){
      pos.x=0;pos.z=-9.4;yaw=0;pitch=0;keys.clear();
      $('detail').style.display='none';$('welcome').style.display='grid';
      $('enter').textContent='Explore the Display Hall ↗';$('enter').focus();
    }
  });
  function startExhibit(id){
    const d=definitions.find(x=>x.id===id);if(!d)return;
    const app=games.find(a=>a.title===d.title);
    if(!d.local&&id!=='statuePRGE'&&(!app||!validURL(app.playUrl)))return;
    selected=d;programOpen=true;keys.clear();
    $('detail').style.display='none';$('welcome').style.display='none';$('prompt').style.display='none';
    if(document.pointerLockElement)document.exitPointerLock();
    document.getElementById('museum-game-title').textContent=d.title;
    document.getElementById('museum-return-statue').textContent=d.local?'Return to table':id==='arcadeNightShift'?'Return to arcade cabinet':'Return to exhibit';
    const url=d.local?new URL(d.local,location.href).href:id==='statuePRGE'?new URL('research/index.html',location.href).href:app.playUrl;
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
  summaries.hall={title:'Display Hall / playable exhibits',tag:'03 / playable exhibits',body:'<p>Each display opens an interactive exhibit. Aim at it and click, or walk close and press E.</p><p>The Night Shift stand-up arcade cabinet is at the left end of the hall. The Regulars, Mars Scout and Beyond the Building occupy the three plinths.</p><button onclick="showMuseumGames()">Open Games menu</button>'};

function exhibitMesh(id,geometry,material,x,y,z){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y+.7,z-12);mesh.userData.subject=id;scene.add(mesh);return mesh}
function replacePlaceholder(id){for(const mesh of [...scene.children])if(mesh.userData.subject===id&&mesh.position.y===1.4){scene.remove(mesh);mesh.geometry.dispose();mesh.material.dispose()}}
function installNightShiftArcade(){
 const id='arcadeNightShift',cx=-9,cz=-11.7;
 const dark=new THREE.MeshStandardMaterial({color:'#14282c',roughness:.55,metalness:.18});
 const trim=new THREE.MeshStandardMaterial({color:'#72b790',roughness:.4,metalness:.2});
 const black=new THREE.MeshStandardMaterial({color:'#090f15',roughness:.65});
 function mesh(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(cx+x,y,cz+z);m.userData.subject=id;scene.add(m);return m}
 const block=(w,h,d,x,y,z,mat)=>mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z);
 // Upright silhouette: kick panel, projecting control deck, recessed monitor, marquee hood.
 const profile=new THREE.Shape();
 [[-.55,0],[.61,0],[.61,.84],[.78,1.02],[.78,1.20],[.43,1.31],[.13,2.08],[.52,2.12],[.52,2.49],[-.55,2.49]].forEach(([z,y],i)=>i?profile.lineTo(z,y):profile.moveTo(z,y));profile.closePath();
 for(const side of [-1,1]){const g=new THREE.ExtrudeGeometry(profile,{depth:.085,bevelEnabled:false});g.rotateY(-Math.PI/2);mesh(g,trim,side*.72+(side>0?.085:0),0,0)}
 block(1.45,.86,1.08,0,.43,0,dark);block(1.44,1.58,.12,0,1.64,-.49,dark);
 block(1.45,.18,1.30,0,1.13,.08,dark);block(1.45,.35,.98,0,2.30,-.01,dark);
 const bezel=block(1.39,.92,.13,0,1.70,.26,black);bezel.rotation.x=-.22;
 const screenCanvas=document.createElement('canvas');screenCanvas.width=960;screenCanvas.height=640;NightShiftTitle.draw(screenCanvas.getContext('2d'),960,640);
 const screenTexture=new THREE.CanvasTexture(screenCanvas);screenTexture.colorSpace=THREE.SRGBColorSpace;
 const screen=mesh(new THREE.PlaneGeometry(1.23,.82),new THREE.MeshBasicMaterial({map:screenTexture,toneMapped:false}),0,1.70,.335);screen.rotation.x=-.22;
 const marquee=texture((g,w,h)=>{g.fillStyle='#091e24';g.fillRect(0,0,w,h);g.fillStyle='#c1ffce';g.textAlign='center';g.font='bold 88px sans-serif';g.fillText('NIGHT SHIFT',w/2,110);g.font='23px sans-serif';g.fillStyle='#dfd6ac';g.fillText('PARANORMAL RESPONSE / FREE PLAY',w/2,163)},1024,200);
 mesh(new THREE.PlaneGeometry(1.39,.27),new THREE.MeshBasicMaterial({map:marquee,toneMapped:false}),0,2.30,.49);
 block(1.41,.025,.045,0,2.12,.51,new THREE.MeshBasicMaterial({color:'#bdf4c7',toneMapped:false}));
 // Two clearly visible player stations: joystick shafts and colored push buttons.
 for(const [x,color]of [[-.40,'#ffce83'],[.29,'#86d9f4']]){
   mesh(new THREE.CylinderGeometry(.025,.025,.16,10),black,x,1.29,.41);
   mesh(new THREE.SphereGeometry(.065,16,12),new THREE.MeshStandardMaterial({color,roughness:.3}),x,1.39,.41);
   for(const offset of [.12,.25])mesh(new THREE.CylinderGeometry(.045,.045,.035,16),new THREE.MeshStandardMaterial({color,roughness:.3}),x+offset,1.235,.42);
 }
 block(.38,.35,.025,0,.54,.55,black);block(.13,.035,.03,0,.60,.57,trim);
 const badge=texture((g,w,h)=>{g.fillStyle='#132a2f';g.fillRect(0,0,w,h);g.fillStyle='#bdf4c7';g.textAlign='center';g.font='bold 40px sans-serif';g.fillText('FREE PLAY',w/2,65);g.font='22px sans-serif';g.fillText('AIM + CLICK / PRESS E',w/2,112)},512,150);
 mesh(new THREE.PlaneGeometry(.95,.28),new THREE.MeshBasicMaterial({map:badge}),0,.88,.623);
 walls.push({minX:cx-.81,maxX:cx+.81,minZ:cz-.56,maxZ:cz+.79});
 targets.push({id,label:'Night Shift · play arcade cabinet',x:cx,z:cz+.65});
}

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

function installMovingPool(){
 const id='movingPool';
 for(const mesh of [...scene.children])if(mesh.position.x===7.7&&mesh.position.z===0){scene.remove(mesh);mesh.geometry?.dispose();mesh.material?.dispose()}
 const part=(w,h,d,x,y,z,color)=>{const m=box(w,h,d,x,y,z,color);m.userData.subject=id;return m};
 part(2.7,.76,1.7,7.7,.48,0,'#526c66');
 for(const x of [6.65,8.75])for(const z of [-.6,.6])part(.12,.2,.12,x,.1,z,'#324656');
 part(3.05,.12,2.05,7.7,.94,0,'#806348');part(2.83,.04,1.83,7.7,1.02,0,'#263d37');
 const screen=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.625),new THREE.MeshBasicMaterial({color:'#eef7fb'}));
 screen.rotation.x=-Math.PI/2;screen.position.set(7.7,1.047,0);screen.userData.subject=id;scene.add(screen);
 new THREE.TextureLoader().load('programs/moving-pool-opening.png',t=>{t.colorSpace=THREE.SRGBColorSpace;screen.material.map=t;screen.material.needsUpdate=true});
 for(const z of [-1.15,1.15]){part(1.15,.08,.24,7.7,.88,z,'#324656');for(const x of [7.45,7.85]){const b=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.025,16),new THREE.MeshBasicMaterial({color:'#e6ed9b'}));b.position.set(x,.935,z);b.userData.subject=id;scene.add(b)}}
 sign('MOVING POOL / TUBE COLLECTION',7.7,.57,.861,0,2.45,.28);
 sign('SIMULATION 02 / MOVING POOL',7.7,2.3,-7.82,0,3.8);
 targets.push({id,x:7.7,z:1.5,label:'Moving Pool · play the table simulation'});
 summaries.lab.body+='<p><button data-preview-exhibit="movingPool">Moving Pool Intervention · cocktail table ↗</button></p>';
}

function installPlayroomPoster(){
 const id='playroomStory',x=-11.72,y=1.9,z=-4.25;
 const art=texture((g,w,h)=>{
   const grad=g.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#177b7f');grad.addColorStop(1,'#173b3b');g.fillStyle=grad;g.fillRect(0,0,w,h);
   g.fillStyle='#f8edda';g.beginPath();g.arc(260,360,220,Math.PI,0);g.lineTo(480,610);g.lineTo(40,610);g.closePath();g.fill();
   g.fillStyle='#c85f49';g.beginPath();g.arc(690,400,260,Math.PI,0);g.lineTo(950,650);g.lineTo(430,650);g.closePath();g.fill();
   g.fillStyle='#e2a43c';g.beginPath();g.arc(720,355,45,0,Math.PI*2);g.fill();
   g.strokeStyle='#fff9ee';g.lineWidth=16;g.beginPath();g.moveTo(55,690);g.bezierCurveTo(330,560,560,780,970,585);g.stroke();
   g.fillStyle='#fff9ee';g.font='900 56px sans-serif';g.fillText('FROM PAINTING',60,110);g.fillText('TO PLAYROOM',60,176);
   g.fillStyle='#f3ca72';g.font='700 25px sans-serif';g.fillText('ONE ROOM · MANY IMAGES · SEVERAL ATTEMPTS',62,225);
   g.fillStyle='#fff9ee';g.font='23px sans-serif';g.fillText('A DESIGN PROCESS EXHIBIT',62,h-56);
 },1024,768);
 const frame=box(.14,2.65,3.5,x,y,z,'#263d37');frame.userData.subject=id;
 const poster=new THREE.Mesh(new THREE.PlaneGeometry(3.25,2.4),new THREE.MeshBasicMaterial({map:art,toneMapped:false}));
 poster.position.set(x+.075,y,z);poster.rotation.y=Math.PI/2;poster.userData.subject=id;scene.add(poster);
 targets.push({id,x:-10.45,z,label:'From Painting to Playroom · process exhibit'});
 summaries[id]={title:'From Painting to Playroom',tag:'Design Office / process exhibit',body:'<img class="project-image" src="projects/playroom/assets/04-photo-concept.webp" alt="Merged indoor playground concept"><p>Three painted playground views became one imagined building. Follow the Marble reconstruction, the CAD attempts, what failed, and what the next version needs.</p><p><a href="projects/playroom/index.html">Open the full case study ↗</a></p>'};
}

if(ready){installMovingPool();installPlayroomPoster();const titleScript=document.createElement('script');titleScript.src='games/night-shift/title-screen.js';titleScript.onload=installNightShiftArcade;titleScript.onerror=()=>console.warn('Night Shift cabinet artwork could not load; use Games menu to play.');document.head.append(titleScript);installTent();installConventionHall();installYaki().catch(error=>{console.warn(error.message);summaries.statueRegulars.body+='<p class="note">Character sculpture could not load. The game is still available.</p>'})}

})();
