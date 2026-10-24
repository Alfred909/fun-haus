/* Illustrative documentary process model. Not an observed schedule or calibrated simulation. */
(()=>{
 const scenes=[
  ['empty',8,'It starts with an empty room.','Before the public event, the hall is a space waiting to be transformed.',null],
  ['arrival',10,'The equipment arrives.','Trucks, transport cases and machines begin to converge on the hall.','prge-2019-setup-07'],
  ['placing',12,'A temporary arcade takes shape.','Machines move from the loading area into rows. People place, connect and test the equipment.','prge-2019-setup-06'],
  ['exhibit',10,'The room becomes more than a room.','Exhibits and familiar living-room settings create different ways to encounter the games.','prge-2019-setup-05'],
  ['prepare',10,'The tournament needs its own setup.','Player stations, specialized controllers and projected displays are prepared together.','prge-2019-setup-08'],
  ['opening',12,'The doors open.','Visitors enter, choose a destination, and begin to move through the temporary space.',null],
  ['play',14,'People come to play.','The arcade and console areas become places to participate, watch and meet.','prge-2019-running-04'],
  ['merchant',12,'People buy games and products in the merchant area.','The model follows visitors between browsing, buying and returning to other activities.','prge-2019-running-02'],
  ['speaker',10,'Time for a speaker.','A group gathers at the presentation area, then disperses back into the show.',null],
  ['tournament',12,'The tournament brings players together.','Steel Battalion becomes a shared competitive activity inside the larger event.','prge-2019-running-05'],
  ['night',12,'The area is closed at night, and everything is turned off and covered.','The model pauses public activity. Equipment stays in place, ready for the next opening.',null],
  ['reopen',10,'The room comes back to life.','The next public session brings visitors back to the machines and activities.','prge-2019-running-03'],
  ['packing',12,'When the show ends, the work continues.','Machines are disconnected and protected. Displays and supplies are packed.','prge-2019-teardown-02'],
  ['leaving',12,'Everything has to move out again.','Equipment returns toward the loading area as the temporary arcade is dismantled.','prge-2019-teardown-03'],
  ['end',8,'And the room becomes an empty room again.','The event ends here. Its machines, skills and connections continue elsewhere.',null]
 ];
 const canvas=document.querySelector('#prge-movie-canvas');if(!canvas)return;
 const ctx=canvas.getContext('2d'),play=document.querySelector('#movie-play'),seek=document.querySelector('#movie-seek');
 const starts=[];let total=0;scenes.forEach(s=>{starts.push(total);total+=s[1]});seek.max=total;
 let t=0,playing=false,speed=1,previous=0,active=-1,photos=[],frame=0;
 const q=s=>document.querySelector(s);const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));const mix=(a,b,p)=>a+(b-a)*p;const smooth=p=>{p=clamp(p);return p*p*(3-2*p)};
 const clock=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
 function indexAt(time){let i=starts.length-1;while(i>0&&time<starts[i])i--;return i;}
 function setTime(time){t=clamp(time,0,total);render();}
 function sceneChanged(i){const s=scenes[i];q('#movie-caption').textContent=s[2];q('#movie-explanation').textContent=s[3];q('#movie-scene-title').textContent=`${String(i+1).padStart(2,'0')} / ${scenes.length} · ${s[0].replaceAll('_',' ')}`;
  const photo=photos.find(p=>p.id===s[4]);q('#movie-photo').hidden=!photo;q('#movie-photo-empty').hidden=!!photo;
  if(photo){q('#movie-photo').src=photo.src;q('#movie-photo').alt=photo.alt;q('#movie-photo-caption').textContent=photo.alt+(s[0]==='merchant'?' This photograph documents the vendor layout; purchasing activity is illustrated by the model.':'');}
  else {q('#movie-photo-empty').textContent=s[0]==='speaker'?'The speaker gathering is illustrated in the model. No speaker photograph was supplied.':s[0]==='night'?'Nighttime shutdown is a modeled scene, not a photograph of a documented shutdown.':s[0]==='empty'||s[0]==='end'?'The empty hall is represented by the model.':'Follow the moving dots in the model.';q('#movie-photo-caption').textContent='Animated reconstruction based on our process discussion.';}
  q('#movie-scenes').querySelectorAll('button').forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-current',j===i?'step':'false')});
 }
 function rect(x,y,w,h,fill,stroke){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=stroke;ctx.strokeRect(x,y,w,h)}}
 function label(text,x,y,color='#b8cbc1',size=10){ctx.fillStyle=color;ctx.font=`${size}px Arial`;ctx.fillText(text,x,y)}
 function circle(x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
 const machines=Array.from({length:24},(_,i)=>({x:160+(i%8)*45,y:125+Math.floor(i/8)*40}));
 const areas={entrance:[83,310],exit:[83,350],arcade:[300,170],console:[450,280],merchant:[260,305],speaker:[570,130],tournament:[590,285]};
 function traveler(points,p,color,r=3){const scaled=clamp(p)* (points.length-1),n=Math.min(points.length-2,Math.floor(scaled)),f=scaled-n;circle(mix(points[n][0],points[n+1][0],f),mix(points[n][1],points[n+1][1],f),r,color)}
 function draw(i,p){const phase=scenes[i][0],night=phase==='night',empty=['empty','end'].includes(phase);ctx.clearRect(0,0,760,440);rect(0,0,760,440,night?'#111d24':'#18332d');
  ctx.strokeStyle=night?'#21313a':'#2b463e';ctx.lineWidth=1;for(let x=20;x<760;x+=25){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,440);ctx.stroke()}for(let y=15;y<440;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(760,y);ctx.stroke()}
  rect(105,70,590,310,night?'#1a252c':'#28473c','#799485');rect(35,75,70,115,'#476657');label('LOAD-IN',44,112,'#e8d9bb');label('/ OUT',47,128,'#e8d9bb');rect(102,290,6,68,'#d1ae78');label('ENTRY',43,319);label('EXIT',48,350);
  const installed=empty?0:phase==='arrival'?Math.floor(p*6):phase==='placing'?6+Math.floor(p*18):phase==='leaving'?Math.ceil((1-p)*24):24;
  if(!empty){
   rect(138,267,250,78,night?'#252a30':'#4a5540');label('MERCHANT AREA',147,285,night?'#5e6871':'#e7ddbf');
   rect(416,240,102,90,night?'#252a30':'#315f55');label('CONSOLE',429,260);label('FREEPLAY',427,274);
   rect(533,94,130,83,night?'#252a30':'#675441');label('SPEAKER',546,114);label('/ PANELS',546,129);
   rect(545,240,118,92,night?'#252a30':'#5b594d');label('TOURNAMENT',554,260);
   label('ARCADE / PINBALL',146,102,night?'#5e6871':'#d7e8d9');
   for(let m=0;m<installed;m++){const v=machines[m];let x=v.x,y=v.y;
    if(phase==='placing'&&m>5){const r=smooth(p*1.7-m/38);x=mix(80,v.x,r);y=mix(150,v.y,r)}
    if(phase==='leaving'){const r=smooth(p*1.8-(m%8)/12);x=mix(v.x,70,r);y=mix(v.y,150,r)}
    rect(x,y,20,25,night?'#3b424b':phase==='packing'?'#92998d':'#be7956','#162b25');
    if(!night&&phase!=='packing')rect(x+4,y+4,12,10,'#9dc9ba');
   }
  }
  if(['arrival','placing','exhibit','prepare'].includes(phase)){
   for(let m=0;m<8;m++){const prog=((p*2+m/8)%1);traveler([[70,155],[125,215],[190+m*50,220],[190+m*50,170]],prog,'#e4bd68',4)}
   if(phase==='arrival'){rect(32,88,55,30,'#c6c1a8');rect(36,94,20,17,'#718d82');label('TRUCK',40,138,'#ecdfbb',9)}
  }
  if(['opening','play','merchant','speaker','tournament','reopen'].includes(phase)){
   const visitorCount=phase==='opening'?Math.floor(p*65):phase==='speaker'?55:70;
   const destination=phase==='merchant'?'merchant':phase==='speaker'?'speaker':phase==='tournament'?'tournament':null;
   for(let n=0;n<visitorCount;n++){
    const target=destination||['arcade','console','merchant','speaker','tournament'][n%5],c=areas[target],jitter=[c[0]+((n*17)%65)-30,c[1]+((n*31)%45)-20];
    const path=[areas.entrance,[125,225],[400,225],jitter,jitter,[400,225],[125,225],areas.exit];
    traveler(path,(p*.8+n*.031)%1,'#a5d3b3',3);
   }
   for(let n=0;n<4;n++)traveler([[135,215],[490,215],[490,350],[135,350],[135,215]],(p*.8+n/4)%1,'#e8bf69',3);
   if(phase==='speaker'){circle(650,142,5,'#e5ac82');for(let n=0;n<22;n++)circle(550+n%6*17,145+Math.floor(n/6)*10,2.5,'#a5d3b3')}
  }
  if(['packing','leaving'].includes(phase))for(let n=0;n<12;n++)traveler([[620,345],[400,225],[125,225],[70,155]],(p*1.4+n/12)%1,'#e8bf69',3.5);
  if(night){rect(105,70,590,310,'rgba(8,14,24,.38)');label('CLOSED · POWER OFF · EQUIPMENT COVERED',224,410,'#a6b2c4',11)}
  else label(empty?'EMPTY HALL':phase==='packing'||phase==='leaving'?'PUBLIC EVENT FINISHED · REMOVAL IN PROGRESS':'SCHEMATIC FLOOR PLAN · POSITIONS ARE ILLUSTRATIVE',135,410,'#b6cabd',10);
 }
 function render(){const i=indexAt(t);if(i!==active){active=i;sceneChanged(i)}const p=clamp((t-starts[i])/scenes[i][1]);draw(i,p);seek.value=t;q('#movie-time').textContent=clock(t)+' / '+clock(total);q('#movie-seek').setAttribute('aria-valuetext',clock(t)+', '+scenes[i][2]);}
 function animate(now){if(playing&&previous){t=Math.min(total,t+(now-previous)/1000*speed);render();if(t>=total){playing=false;play.textContent='Replay ↺';play.setAttribute('aria-pressed','false')}}previous=now;frame=requestAnimationFrame(animate)}
 play.onclick=()=>{if(t>=total)t=0;playing=!playing;play.textContent=playing?'Pause Ⅱ':'Play ▶';play.setAttribute('aria-pressed',playing);previous=0;render()};
 q('#movie-restart').onclick=()=>{playing=false;play.textContent='Play ▶';play.setAttribute('aria-pressed','false');setTime(0)};
 seek.oninput=()=>setTime(Number(seek.value));q('#movie-speed').onchange=e=>speed=Number(e.target.value);
 q('#movie-prev').onclick=()=>setTime(starts[Math.max(0,indexAt(t)-1)]);q('#movie-next').onclick=()=>setTime(starts[Math.min(scenes.length-1,indexAt(t)+1)]);
 q('#movie-fullscreen').onclick=()=>{const el=q('#prge-documentary');if(!document.fullscreenElement)el.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.()};
 document.addEventListener('visibilitychange',()=>previous=0);
 q('#movie-scenes').innerHTML=scenes.map((s,i)=>`<button data-movie-scene="${i}" aria-label="Scene ${i+1}: ${s[2]}"><span>${String(i+1).padStart(2,'0')}</span>${s[2]}</button>`).join('');
 q('#movie-scenes').querySelectorAll('button').forEach((b,i)=>b.onclick=()=>setTime(starts[i]));
 q('#movie-photo-button').onclick=()=>{const p=photos.find(p=>p.id===scenes[active][4]);if(p&&typeof openLightbox==='function')openLightbox([p])};
 fetch('data.json').then(r=>r.json()).then(d=>{photos=d.photos;active=-1;render()}).catch(()=>render());render();frame=requestAnimationFrame(animate);
})();
