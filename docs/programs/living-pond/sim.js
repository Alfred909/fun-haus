const TYPES={plant:{color:'#92d96d',radius:4,range:0,speed:0,cost:.018,life:1100},insect:{color:'#ffc56c',radius:3,range:95,speed:18,cost:.12,life:650,prey:'plant',enemy:'frog'},frog:{color:'#64dfcf',radius:7,range:145,speed:24,cost:.1,life:1250,prey:'insect',enemy:'heron'},heron:{color:'#e69eff',radius:10,range:210,speed:20,cost:.075,life:1700,prey:'frog'}};
class Ecology{
 constructor(seed=42){this.seed=seed;this.time=0;this.water=78;this.nutrients=80;this.weather='normal';this.entities=[];this.events=[];this.history=[];this.nextId=1;this.sample=0;for(const [t,n] of [['plant',160],['insect',30],['frog',8],['heron',1]])for(let i=0;i<n;i++)this.add(t);this.log('A new pond begins: plants support insects, insects feed frogs, and herons hunt frogs.');}
 rand(){this.seed=(Math.imul(1664525,this.seed)+1013904223)>>>0;return this.seed/4294967296}
 add(type,x,y){const e={id:this.nextId++,type,x:x??40+this.rand()*920,y:y??45+this.rand()*550,energy:50+this.rand()*35,age:this.rand()*70,angle:this.rand()*Math.PI*2,action:'Explore',reason:'Searching for local resources.',cooldown:25+this.rand()*45,alive:true};this.entities.push(e);return e}
 log(text){this.events.unshift({time:this.time,text});this.events=this.events.slice(0,100)}
 counts(){return Object.fromEntries(Object.keys(TYPES).map(t=>[t,this.entities.filter(e=>e.alive&&e.type===t).length]))}
 kill(e,cause){if(!e.alive)return;e.alive=false;this.nutrients=Math.min(100,this.nutrients+(e.type==='plant'?1:4));if(e.type!=='plant')this.log(`${e.type} #${e.id} ${cause}. Its remains return nutrients to the soil.`)}
 step(dt,controlled=null,target=null){this.time+=dt;const light=.25+.75*Math.max(0,Math.sin((this.time%240)/240*Math.PI*2));this.water=Math.max(0,Math.min(100,this.water+dt*(this.weather==='rain'?.3:this.weather==='drought'?-.14:-.018)));let counts=this.counts();const newborn=[];
 for(const e of this.entities){if(!e.alive)continue;const cfg=TYPES[e.type];e.age+=dt;e.cooldown-=dt;
 if(e.type==='plant'){const gain=.45*light*(this.water/100)*(this.nutrients/100);e.energy+=dt*(gain-cfg.cost-(this.water<20?.055:0));this.nutrients=Math.max(0,this.nutrients-gain*dt*.008);e.action='Grow';e.reason=this.water<20?'Low water is limiting growth.':light<.4?'Low light slows energy production.':'Using light, water and soil nutrients.';}
 else{const nearby=this.entities.filter(o=>o.alive&&o.id!==e.id&&Math.hypot(o.x-e.x,o.y-e.y)<cfg.range);const nearest=type=>nearby.filter(o=>o.type===type).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];const enemy=nearest(cfg.enemy),food=nearest(cfg.prey);let speed=cfg.speed,tx,ty;
 if(e.id===controlled){e.action=target?'Move':'Rest';e.reason=target?'Visitor-controlled movement; nearby food is eaten automatically.':'Visitor resting. Tap the habitat to move.';if(target){tx=target.x;ty=target.y;if(Math.hypot(tx-e.x,ty-e.y)<8)speed=0}else speed=0;}
 else if(enemy){e.action='Flee';e.reason=`Detected ${enemy.type} #${enemy.id} within sensory range.`;tx=e.x+(e.x-enemy.x);ty=e.y+(e.y-enemy.y);speed*=1.5;}
 else if(e.energy<78&&food){e.action='Feed';e.reason=`Energy ${Math.round(e.energy)}%; detected ${food.type} #${food.id}.`;tx=food.x;ty=food.y;}
 else if(e.energy>65){e.action='Rest';e.reason='Energy is sufficient and no predator is detected.';speed=0;}
 else{e.action='Explore';e.reason=`No ${cfg.prey} detected; searching within a ${cfg.range}-unit range.`;e.angle+=(this.rand()-.5)*1.3*dt;}
 if(tx!==undefined)e.angle=Math.atan2(ty-e.y,tx-e.x);e.x+=Math.cos(e.angle)*speed*dt;e.y+=Math.sin(e.angle)*speed*dt;if(e.x<20||e.x>980||e.y<25||e.y>610)e.angle+=Math.PI;e.x=Math.max(20,Math.min(980,e.x));e.y=Math.max(25,Math.min(610,e.y));e.energy-=dt*cfg.cost*(speed===0?.45:speed>cfg.speed?2:1);
 if(food&&food.alive&&e.energy<85&&Math.hypot(food.x-e.x,food.y-e.y)<cfg.radius+TYPES[food.type].radius+5){this.kill(food,`was eaten by ${e.type} #${e.id}`);e.energy=Math.min(100,e.energy+(e.type==='insect'?22:food.type==='frog'?48:30));if(e.type==='frog')this.log(`Frog #${e.id} caught insect #${food.id}, restoring its energy.`);}
 }
 if(e.energy<=0||e.age>cfg.life){this.kill(e,e.energy<=0?'ran out of energy':'reached its modeled lifespan');continue}
 const cap={plant:220,insect:130,frog:35,heron:8}[e.type];if(e.energy> (e.type==='plant'?62:82)&&e.cooldown<=0&&counts[e.type]<cap){e.energy-=e.type==='plant'?10:30;e.cooldown=e.type==='plant'?30:100;newborn.push([e.type,Math.max(20,Math.min(980,e.x+(this.rand()-.5)*70)),Math.max(25,Math.min(610,e.y+(this.rand()-.5)*70))]);counts[e.type]++;if(e.type!=='plant')this.log(`${e.type} #${e.id} reproduced after accumulating enough energy.`)}
 e.energy=Math.max(0,Math.min(100,e.energy));}
 this.entities=this.entities.filter(e=>e.alive);for(const b of newborn){const baby=this.add(...b);baby.energy=42;baby.age=0}if(this.time-this.sample>=4){this.sample=this.time;this.history.push({time:this.time,...this.counts(),water:this.water});this.history=this.history.slice(-360)}}
}
if(typeof module!=='undefined')module.exports={Ecology,TYPES};
