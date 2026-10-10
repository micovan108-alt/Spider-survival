// ===== UPDATE: cập nhật nhện + toàn bộ thế giới mỗi frame =====
// Lưu ý: online.js ghi đè (wrap) updSpider / update -> giữ chúng là `function` toàn cục
function updSpider(s,dt){for(const k in s.cd)s.cd[k]=Math.max(0,s.cd[k]-dt);for(const k of['bite','hit','stun','slow','pois','inv','combat'])s[k]=Math.max(0,s[k]-dt);
if(s.pois>0){s.pf-=dt;if(s.pf<=0){s.pf=.5;hurt(s,s.pdmg||3,s.psrc)}}
if(!s.alive)return;if(s.combat<=0)s.hp=Math.min(s.mh,s.hp+s.mh*.012*dt);
if(s.bot)ai(s,dt);else{s.aim=Math.atan2(mouse.y-s.y,mouse.x-s.x);const d=Math.hypot(mouse.x-s.x,mouse.y-s.y);s.mv=Math.min(1,Math.max(0,(d-17*s.sz*.5)/(60*s.sz)));if(mouse.down&&playing)bite(s)}
if(s.spin>0){s.spin-=dt;s.a+=18*dt;s.stk-=dt;if(s.stk<=0){s.stk=.12;for(const o of spiders)if(o!==s&&o.alive&&Math.hypot(o.x-s.x,o.y-s.y)<17*s.sz*2.7+o.sz*17){hurt(o,s.dmg*.7,s);knock(o,s,260)}}}
else if(s.stun<=0)s.a+=Math.max(-(s.bot?7:11)*dt,Math.min((s.bot?7:11)*dt,ad(s.a,s.aim)));
if(s.drain>0){s.drain-=dt;s.dtk-=dt;const t=s.dt;if(!t||!t.alive||Math.hypot(t.x-s.x,t.y-s.y)>600*s.sz)s.drain=0;else if(s.dtk<=0){s.dtk=.2;hurt(t,s.dmg*.3,s);s.hp=Math.min(s.mh,s.hp+s.dmg*.25)}}
const f=(s.slow>0?.45:1)*(s.spin>0?1.2:1)*(s.stun>0?0:1)*(s.drain>0?.4:1),tv=s.spd*f*s.mv;
if(s.dash>0){s.dash-=dt;s.vx=s.dvx;s.vy=s.dvy;for(const o of spiders)if(o!==s&&o.alive&&!s.dh.includes(o)&&Math.hypot(o.x-s.x,o.y-s.y)<(s.sz+o.sz)*17*1.1){s.dh.push(o);hurt(o,s.dmg*.9,s);knock(o,s,350)}
if(s.dash<=0&&s.pounce){s.pounce=false;slam(s,130*s.sz,s.dmg*2,.4)}if(R()<.7)parts.push({x:s.x,y:s.y,vx:rr(-40,40),vy:rr(-40,40),l:.4,m:.4,c:'#fff',r:2*s.sz})}
else{const k=Math.min(1,dt*7);s.vx+=(Math.cos(s.aim)*tv-s.vx)*k;s.vy+=(Math.sin(s.aim)*tv-s.vy)*k}
s.x+=(s.vx+s.kx)*dt;s.y+=(s.vy+s.ky)*dt;const q=Math.pow(.003,dt);s.kx*=q;s.ky*=q;const m=17*s.sz;s.x=Math.max(m,Math.min(WS-m,s.x));s.y=Math.max(m,Math.min(WS-m,s.y));updLegs(s,dt)}

function update(dt){T+=dt;shk*=Math.pow(.02,dt);
for(const s of spiders)updSpider(s,dt);
for(let i=0;i<spiders.length;i++)for(let j=i+1;j<spiders.length;j++){const a=spiders[i],b=spiders[j];if(!a.alive||!b.alive)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,m=(a.sz+b.sz)*17*.8;if(d<m){const p=(m-d)/2,w=a.sz/(a.sz+b.sz);a.x-=dx/d*p*(1-w);a.y-=dy/d*p*(1-w);b.x+=dx/d*p*w;b.y+=dy/d*p*w}}
for(let i=projs.length-1;i>=0;i--){const p=projs[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;let hit=false;
for(const o of spiders)if(o!==p.own&&o.alive&&Math.hypot(o.x-p.x,o.y-p.y)<o.sz*17+p.r){hit=true;if(p.t=='v'){hurt(o,p.d,p.own);o.pois=3;o.psrc=p.own;o.pdmg=p.own.dmg*.25}else if(p.t=='h')hurt(o,p.d,p.own);else if(p.t=='i'){hurt(o,p.d,p.own);o.slow=1.6}else if(p.t=='p'){hurt(o,p.d,p.own);const a=Math.atan2(p.own.y-o.y,p.own.x-o.x);o.kx+=Math.cos(a)*1100/o.sz;o.ky+=Math.sin(a)*1100/o.sz;o.stun=Math.max(o.stun,.35)}break}
if(hit||p.l<=0){if(p.t=='f')boom(p.x,p.y,110*p.own.sz,p.d,p.own);if(p.t=='w')zones.push({x:p.x,y:p.y,r:150*p.own.sz,l:4,m:4,t:'w',own:p.own,tk:0});projs.splice(i,1)}else if(R()<.5)parts.push({x:p.x,y:p.y,vx:0,vy:0,l:.25,m:.25,c:PC[p.t],r:p.r*.6})}
for(let i=zones.length-1;i>=0;i--){const z=zones[i];z.l-=dt;z.tk-=dt;if(z.l<=0){zones.splice(i,1);continue}
if(z.tk<=0){z.tk=.4;for(const o of spiders)if(o!==z.own&&o.alive&&Math.hypot(o.x-z.x,o.y-z.y)<z.r+o.sz*17){if(z.t=='c'){hurt(o,z.d,z.own);o.pois=Math.max(o.pois,1.5);o.psrc=z.own;o.pdmg=z.d*.5}else{o.slow=.6;hurt(o,z.own.dmg*.08,z.own)}}}}
for(let i=silks.length-1;i>=0;i--){silks[i].l-=dt;if(silks[i].l<=0)silks.splice(i,1)}
for(let i=fxs.length-1;i>=0;i--){const f=fxs[i];f.l-=dt;f.r=f.mr*(1-f.l/f.m);if(f.l<=0)fxs.splice(i,1)}
for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;if(p.l<=0)parts.splice(i,1)}
for(let i=texts.length-1;i>=0;i--){texts[i].l-=dt;texts[i].y-=40*dt;if(texts[i].l<=0)texts.splice(i,1)}
while(foods.length<650)spawnFood();
for(const s of spiders){if(!s.alive)continue;const r=17*s.sz,fs=1+(s.sz-1)*.35;for(let i=foods.length-1;i>=0;i--){const f=foods[i],d=Math.hypot(f.x-s.x,f.y-s.y);if(d<r*2.4+40){if(d<r*1.15+(4+Math.sqrt(f.v)*1.4)*fs){gainXP(s,f.v);foods[i]=foods[foods.length-1];foods.pop();if(s===P)parts.push({x:s.x,y:s.y,vx:rr(-60,60),vy:rr(-60,60),l:.3,m:.3,c:'#fff',r:2})}else{const k=Math.min(1,dt*6);f.x+=(s.x-f.x)*k*.5;f.y+=(s.y-f.y)*k*.5}}}}
spiders=spiders.filter(s=>s.alive||s===P);const nb=spiders.filter(s=>s.bot&&s.alive).length;bt-=dt;if(nb<NB&&bt<=0){bt=1.5;spawnBot(false)}}
