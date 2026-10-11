// ===== AI: sinh thức ăn/bot và hành vi của bot =====
function spawnFood(){const c=R();foods.push({x:rr(40,WS-40),y:rr(40,WS-40),v:c<.7?3:c<.93?6:12,c:`hsl(${rr(0,360)|0},90%,62%)`,ph:R()*6})}
function spawnBot(init){const b=mk(R()*SP.length|0,true,NAMES[R()*NAMES.length|0]);b.lvl=init?1:Math.max(1,Math.round(rr(1,1+(P?P.lvl*.8:3))));stats(b);b.hp=b.mh;
if(P)for(let i=0;i<20&&Math.hypot(b.x-P.x,b.y-P.y)<900;i++){b.x=rr(200,WS-200);b.y=rr(200,WS-200)}b.inv=1.5;initLegs(b);spiders.push(b)}
function targetCrowd(s,t,key){let n=0;for(const o of spiders)if(o!==s&&o.alive&&sameTeam(s,o)&&o[key]===t)n++;return n}
function nearFood(s,mx){let b=null,bd=1e9;for(const f of foods){const d=Math.abs(f.x-s.x)+Math.abs(f.y-s.y);if(d<mx){const score=d*(1+targetCrowd(s,f,'food')*.7);if(score<bd){bd=score;b=f}}}return b}
function ai(s,dt){if(s.food&&s.food.eaten){s.food=null;s.ai=0}s.ai-=dt;const vis=650+s.sz*100;
if(s.ai<=0){s.ai=rr(.25,.55);const keep=o=>o&&o.alive&&!sameTeam(s,o)&&Math.hypot(o.x-s.x,o.y-s.y)<vis*1.3;let thr=keep(s.thr)?s.thr:null,prey=keep(s.prey)?s.prey:null,td=thr?Math.hypot(thr.x-s.x,thr.y-s.y):1e9,pd=prey?Math.hypot(prey.x-s.x,prey.y-s.y)*(1+targetCrowd(s,prey,'prey')*.7):1e9;
for(const o of spiders){if(o===s||!o.alive||sameTeam(s,o)||o===thr||o===prey)continue;const d=Math.hypot(o.x-s.x,o.y-s.y);if(d>vis)continue;const pw=(o.lvl-s.lvl)+(o.hp/o.mh-s.hp/s.mh)*2;if(pw>(thr?2.8:2.2)){if(d<td*.8){td=d;thr=o}}else if((s.aggr>.5||o.lvl<=s.lvl)&&d*(1+targetCrowd(s,o,'prey')*.7)<pd*.8){pd=d*(1+targetCrowd(s,o,'prey')*.7);prey=o}}
const foodValid=s.food&&!s.food.eaten&&Math.abs(s.food.x-s.x)+Math.abs(s.food.y-s.y)<1200;s.thr=thr;s.prey=prey;s.food=foodValid?s.food:nearFood(s,1200);if(R()<.3)s.wa+=rr(-1,1)}
const p=SP[s.sp];let ta=s.wa,mv=.6;const hpr=s.hp/s.mh,escapeAt=s.fleeing?.65:.45;s.fleeing=!!(s.thr&&s.thr.alive&&(hpr<escapeAt||s.thr.lvl>s.lvl+2));
if(s.thr&&s.thr.alive&&s.fleeing){const d=Math.hypot(s.thr.x-s.x,s.thr.y-s.y);ta=Math.atan2(s.y-s.thr.y,s.x-s.thr.x);mv=1;if(d<260&&Math.abs(ad(s.a,ta))<.4)cast(s,'q');if(d<220)cast(s,'r')}
else if(s.prey&&s.prey.alive&&hpr>.35){const o=s.prey,dx=o.x-s.x,dy=o.y-s.y,d=Math.hypot(dx,dy),reach=17*s.sz*2.3+o.sz*17,side=Math.sin(s.ph)<0?-1:1;ta=Math.atan2(dy,dx)+(d<=reach?side*.28:0);const al=Math.abs(ad(s.a,ta));mv=d>reach?1:.55;
if(d<reach*1.1&&al<.8)bite(s);if(al<.35){if(d<p.er*(p.es?s.sz:1)&&d>60)cast(s,'e');if(d<p.rr*(p.rs?s.sz:1)&&d>(p.rm||0))cast(s,'r');if(d>280&&d<600&&R()<.05)cast(s,'q')}}
else if(s.food){ta=Math.atan2(s.food.y-s.y,s.food.x-s.x);mv=1}
if(!s.prey&&!s.food&&!s.fleeing){const margin=500,wx=s.x<margin?(margin-s.x)/margin:s.x>WS-margin?-(margin-(WS-s.x))/margin:0,wy=s.y<margin?(margin-s.y)/margin:s.y>WS-margin?-(margin-(WS-s.y))/margin:0;if(wx||wy){const x=Math.cos(ta)*.55+wx*1.25,y=Math.sin(ta)*.55+wy*1.25;ta=Math.atan2(y,x);mv=Math.max(mv,.75)}}
let ax=0,ay=0;const avoid=58*s.sz;for(const o of spiders){if(o===s||!o.alive||!sameTeam(s,o))continue;const dx=s.x-o.x,dy=s.y-o.y,d=Math.hypot(dx,dy);if(d>0&&d<avoid){const strength=(avoid-d)/avoid;ax+=dx/d*strength;ay+=dy/d*strength}}
if(ax||ay){const x=Math.cos(ta)*.6+ax*1.4,y=Math.sin(ta)*.6+ay*1.4;ta=Math.atan2(y,x);mv=Math.max(mv,.7)}
s.aim=ta;s.mv=mv}
