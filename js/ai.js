// ===== AI: sinh thức ăn/bot và hành vi của bot =====
function spawnFood(){const c=R();foods.push({x:rr(40,WS-40),y:rr(40,WS-40),v:c<.7?3:c<.93?6:12,c:`hsl(${rr(0,360)|0},90%,62%)`,ph:R()*6})}
function spawnBot(init){const b=mk(R()*SP.length|0,true,NAMES[R()*NAMES.length|0]);b.lvl=init?1+(R()*R()*8|0):Math.max(1,Math.round(rr(1,1+(P?P.lvl*.8:3))));stats(b);b.hp=b.mh;
if(P)for(let i=0;i<20&&Math.hypot(b.x-P.x,b.y-P.y)<900;i++){b.x=rr(200,WS-200);b.y=rr(200,WS-200)}b.inv=1.5;initLegs(b);spiders.push(b)}
function nearFood(s,mx){let b=null,bd=mx;for(const f of foods){const d=Math.abs(f.x-s.x)+Math.abs(f.y-s.y);if(d<bd){bd=d;b=f}}return b}
function ai(s,dt){s.ai-=dt;const vis=650+s.sz*100;
if(s.ai<=0){s.ai=rr(.25,.55);let thr=null,prey=null,td=1e9,pd=1e9;for(const o of spiders){if(o===s||!o.alive)continue;const d=Math.hypot(o.x-s.x,o.y-s.y);if(d>vis)continue;const pw=(o.lvl-s.lvl)+(o.hp/o.mh-s.hp/s.mh)*2;if(pw>2.2){if(d<td){td=d;thr=o}}else if((s.aggr>.5||o.lvl<=s.lvl)&&d<pd){pd=d;prey=o}}
s.thr=thr;s.prey=prey;s.food=nearFood(s,1200);if(R()<.3)s.wa+=rr(-1,1)}
const p=SP[s.sp];let ta=s.wa,mv=.6;const hpr=s.hp/s.mh;
if(s.thr&&s.thr.alive&&(hpr<.5||s.thr.lvl>s.lvl+2)){const d=Math.hypot(s.thr.x-s.x,s.thr.y-s.y);ta=Math.atan2(s.y-s.thr.y,s.x-s.thr.x);mv=1;if(d<260&&Math.abs(ad(s.a,ta))<.4)cast(s,'q');if(d<220)cast(s,'r')}
else if(s.prey&&s.prey.alive&&hpr>.35){const o=s.prey,dx=o.x-s.x,dy=o.y-s.y,d=Math.hypot(dx,dy);ta=Math.atan2(dy,dx);const reach=17*s.sz*2.3+o.sz*17,al=Math.abs(ad(s.a,ta));mv=d>reach?1:.3;
if(d<reach*1.1&&al<.8)bite(s);if(al<.35){if(d<p.er*(p.es?s.sz:1)&&d>60)cast(s,'e');if(d<p.rr*(p.rs?s.sz:1)&&d>(p.rm||0))cast(s,'r');if(d>280&&d<600&&R()<.05)cast(s,'q')}}
else if(s.food){ta=Math.atan2(s.food.y-s.y,s.food.x-s.x);mv=1}
if(s.x<250||s.y<250||s.x>WS-250||s.y>WS-250){ta=Math.atan2(WS/2-s.y,WS/2-s.x);mv=1}
s.aim=ta;s.mv=mv}
