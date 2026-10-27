(function(root){
const clamp=x=>Math.max(0,Math.min(1,x));
function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
class Study{
constructor(config){this.c={...config};this.rand=random(+config.seed||1);this.time=0;this.spawn=0;this.guests=[];this.rows=[];this.entered=0;this.exposed=0;this.noticed=0;this.stopped=0;this.finished=0;this.done=false;}
add(){const r=this.rand;this.guests.push({id:++this.entered,p:0,lane:(r()-.5)*22,curiosity:r(),urgency:r(),energy:r(),hunger:r(),social:r(),noticeRoll:r(),stopRoll:r(),dwellRoll:r(),speed:26+r()*13,state:'walking',evaluated:false,remaining:0});}
step(dt){if(this.done)return;this.time+=dt;this.spawn-=dt;if(this.entered<this.c.total&&this.spawn<=0){this.add();this.spawn+=60/this.c.flow;}for(const g of this.guests){if(g.state==='watching'){g.remaining-=dt;if(g.remaining<=0){g.state='leaving';this.finished++;}continue;}g.p+=g.speed*dt;if(g.p>=430&&!g.evaluated){g.evaluated=true;this.exposed++;const crowd=this.guests.filter(x=>x.state==='watching').length;const notice=this.c.actor?clamp(this.c.visibility/100*(.4+.6*g.curiosity)+.08*Math.min(crowd,3)*g.social):0;const stop=clamp(.12+.6*g.curiosity+.18*g.energy-.32*g.urgency-.15*g.hunger+.07*Math.min(crowd,3)*g.social-.045*Math.max(0,crowd-4));g.noticed=g.noticeRoll<notice;g.stops=g.noticed&&g.stopRoll<stop;g.dwell=g.stops?3+Math.round(8+g.dwellRoll*22+g.curiosity*10-g.urgency*7):0;if(g.noticed)this.noticed++;if(g.stops){this.stopped++;g.state='watching';g.remaining=g.dwell;}this.rows.push({guest:g.id,time:+this.time.toFixed(2),noticed:g.noticed,stopped:g.stops,dwell_seconds:g.dwell,curiosity:g.curiosity,urgency:g.urgency,energy:g.energy,hunger:g.hunger,social:g.social,nearby_watchers:crowd,notice_probability:notice,stop_if_noticed_probability:stop,reason:!this.c.actor?'Actor absent':!g.noticed?'Did not notice':g.stops?'Stopped to watch':'Noticed, continued'});}}
this.guests=this.guests.filter(g=>g.p<980);if(this.entered===this.c.total&&!this.guests.length)this.done=true;
}
}
root.Study=Study;if(typeof module!=='undefined')module.exports={Study};
})(typeof window!=='undefined'?window:globalThis);
