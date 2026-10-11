// ===== COMBAT: sát thương, giết, XP, cắn, chiêu thức =====
// Lưu ý: online.js ghi đè (wrap) hurt / kill / bite -> giữ chúng là `function` toàn cục
function hurt(t,d,src){if(!t.alive||t.inv>0)return;d=Math.max(1,d);t.hp-=d;t.hit=.14;t.combat=4;if(src&&src!==t)t.lastHit=src;if(t===P)soundFx('hit',-1,'',t);
if(CFG.dmg&&(src===P||t===P))texts.push({x:t.x+rr(-12,12),y:t.y-17*t.sz,l:.8,s:Math.round(d),c:src===P?'#ffe066':'#ff5a5a'});
for(let i=0;i<3;i++)parts.push({x:t.x,y:t.y,vx:rr(-120,120),vy:rr(-120,120),l:.5,m:.5,c:'#8dff5a',r:rr(2,4)*t.sz});
if(t===P&&CFG.shake)shk=Math.min(16,shk+d*.15);if(t.hp<=0)kill(t,src)}
function knock(o,from,pw){const a=Math.atan2(o.y-from.y,o.x-from.x);o.kx+=Math.cos(a)*pw/o.sz;o.ky+=Math.sin(a)*pw/o.sz}
function sameTeam(a,b){return !!(a&&b&&a.team&&a.team===b.team)}
function kill(t,src){t.alive=false;t.hp=0;soundFx('death',-1,'',t);if(t!==P&&src===P)soundFx('kill',-1,'',t);const n=12+t.lvl,tv=20+t.tot*.4;for(let i=0;i<n;i++){const a=R()*TAU,d=rr(0,30)*t.sz;foods.push({x:t.x+Math.cos(a)*d,y:t.y+Math.sin(a)*d,v:tv/n,c:SP[t.sp].ac,ph:R()*6,big:1})}
if(foods.length>1100)foods.splice(0,foods.length-1100);
for(let i=0;i<34;i++)parts.push({x:t.x,y:t.y,vx:rr(-380,380)*t.sz**.5,vy:rr(-380,380)*t.sz**.5,l:rr(.4,1),m:1,c:i%2?SP[t.sp].ac:'#8dff5a',r:rr(3,7)*t.sz});
fxs.push({x:t.x,y:t.y,r:0,mr:130*t.sz,l:.5,m:.5,c:SP[t.sp].ac,w:6});
if(src&&src.alive&&src!==t){gainXP(src,30+t.lvl*22+t.tot*.25);src.kills++;feed(`${src.name} ⚔ ${t.name}`);if(src===P)toast(`HẠ GỤC ${t.name.toUpperCase()}!`)}else feed(`${t.name} đã chết`);
if(t===P){if(CFG.shake)shk=20;if(window.TEAM_MATCH){setTimeout(()=>{if(!window.TEAM_MATCH)return;t.alive=true;t.hp=t.mh;t.inv=2.5;if(window.COCOON_MATCH){t.x=t.team===1?420:4580;t.y=2500}else{t.x=rr(1500,3500);t.y=rr(1500,3500)}t.vx=t.vy=t.kx=t.ky=0;t.pois=t.stun=t.slow=t.drain=0;t.lastHit=null;t.cd={b:0,q:0,e:0,r:0};cam.x=t.x;cam.y=t.y;toast('HỒI SINH · TIẾP TỤC CHIẾN ĐẤU')},1500)}else setTimeout(()=>{playing=false;$('mt').innerHTML=`<b style="color:#ff3b4a;font-size:22px">BẠN ĐÃ BỊ TIÊU DIỆT</b><br>Bởi ${t.lastHit?t.lastHit.name:'độc'} · Cấp ${t.lvl} · Hạ gục ${t.kills} nhện`;$('go').textContent='CHƠI LẠI';$('menu').classList.remove('hide');$('hud').classList.add('off')},1500)}}
const need=l=>40+l*28+l*l*3;
function gainXP(s,v){s.xp+=v;s.tot+=v;while(s.lvl<30&&s.xp>=need(s.lvl)){s.xp-=need(s.lvl);const om=s.mh;s.lvl++;stats(s);s.hp=Math.min(s.mh,s.hp+(s.mh-om)+s.mh*.3);fxs.push({x:s.x,y:s.y,r:0,mr:200*s.sz,l:.8,m:.8,c:'#ffe066',w:5});if(s===P){soundFx('level',-1,'',s);toast(`⬆ LÊN CẤP ${s.lvl}!`)}}}
function bite(s){if(s.cd.b>0||s.stun>0||s.dash>0)return;s.cd.b=CDM.b;s.bite=.2;if(s===P)soundFx('bite',-1,'',s);s.kx+=Math.cos(s.a)*260;s.ky+=Math.sin(s.a)*260;const reach=17*s.sz*2.3;
for(const o of spiders){if(o===s||!o.alive||sameTeam(s,o))continue;const dx=o.x-s.x,dy=o.y-s.y;if(Math.hypot(dx,dy)<reach+o.sz*17&&Math.abs(ad(s.a,Math.atan2(dy,dx)))<1.05){hurt(o,s.dmg,s);knock(o,s,230);s.hp=Math.min(s.mh,s.hp+s.dmg*.12);for(let i=0;i<5;i++)parts.push({x:o.x,y:o.y,vx:rr(-200,200),vy:rr(-200,200),l:.3,m:.3,c:'#fff',r:2})}}}
function shoot(s,a,t,spd,d,l,rad){projs.push({x:s.x+Math.cos(a)*17*s.sz,y:s.y+Math.sin(a)*17*s.sz,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,l,t,d,own:s,r:rad*Math.pow(s.sz,.7)})}
function slam(s,rad,d,stun){fxs.push({x:s.x,y:s.y,r:0,mr:rad,l:.45,m:.45,c:SP[s.sp].ac,w:10});if(s===P&&CFG.shake)shk=Math.max(shk,10);for(const o of spiders)if(o!==s&&o.alive&&!sameTeam(s,o)&&Math.hypot(o.x-s.x,o.y-s.y)<rad+o.sz*17){hurt(o,d,s);o.stun=Math.max(o.stun,stun);knock(o,s,600)}
for(let i=0;i<24;i++){const a=R()*TAU;parts.push({x:s.x,y:s.y,vx:Math.cos(a)*rad*2,vy:Math.sin(a)*rad*2,l:.5,m:.5,c:'#b9a07a',r:rr(2,5)})}}
const PC={v:'#8dff5a',h:'#ffb060',i:'#bff4ff',f:'#ff8a2a',p:'#ffe680',w:'#fff'};
function boom(x,y,rad,d,s){fxs.push({x,y,r:0,mr:rad,l:.4,m:.4,c:'#ff8a2a',w:9});for(const o of spiders)if(o!==s&&o.alive&&!sameTeam(s,o)&&Math.hypot(o.x-x,o.y-y)<rad+o.sz*17){hurt(o,d,s);knock(o,{x,y},420);o.pois=2;o.psrc=s;o.pdmg=d*.15}for(let i=0;i<20;i++){const a=R()*TAU;parts.push({x,y,vx:Math.cos(a)*rad*2,vy:Math.sin(a)*rad*2,l:.5,m:.5,c:i%2?'#ffd23a':'#ff5a1a',r:rr(2,6)})}}
function cast(s,k){if(!s.alive||s.stun>0||s.cd[k]>0||(s.dash>0&&k!='e'))return;const ca=Math.cos(s.a),sa=Math.sin(s.a),sz=s.sz;
if(k=='q'){s.cd.q=CDM.q;const D=340*Math.pow(sz,.9);s.dash=.2;s.dvx=ca*D/.2;s.dvy=sa*D/.2;s.dh=[];silks.push({x1:s.x,y1:s.y,x2:s.x+ca*D,y2:s.y+sa*D,l:1.4,m:1.4});soundFx('q',-1,'',s);return}
if(k=='e'){s.cd.e=CDM.e;if(s.sp==0)for(let j=-1;j<=1;j++)shoot(s,s.a+j*.2,'v',700,s.dmg*.9,.8,7);else if(s.sp==1)slam(s,200*sz,s.dmg*2.2,.9);else if(s.sp==2){s.spin=1.1;s.stk=0}else if(s.sp==3)shoot(s,s.a,'w',520,0,.55,9);else if(s.sp==4)for(let j=-2;j<=2;j++)shoot(s,s.a+j*.14,'i',760,s.dmg*.7,.7,6);else if(s.sp==5)shoot(s,s.a,'f',600,s.dmg*1.7,.8,11);else shoot(s,s.a,'p',800,s.dmg*.8,.6,9);soundFx('spell',s.sp,'e',s);return}
if(k=='r'){if(s.sp==0){zones.push({x:s.x,y:s.y,r:170*sz,l:5,m:5,t:'c',own:s,d:s.dmg*.4,tk:0})}
else if(s.sp==1)for(let j=0;j<18;j++)shoot(s,s.a+j/18*TAU,'h',560,s.dmg*.55,.75,5);
else if(s.sp==2){const D=480*Math.pow(sz,.9);s.dash=.28;s.dvx=ca*D/.28;s.dvy=sa*D/.28;s.dh=[];s.pounce=true}
else if(s.sp==4)slam(s,260*sz,s.dmg*1.2,1.2);else if(s.sp==5)zones.push({x:s.x,y:s.y,r:190*sz,l:5,m:5,t:'c',own:s,d:s.dmg*.6,tk:0,col:'255,110,30'});else if(s.sp==6)zones.push({x:s.x,y:s.y,r:250*sz,l:5,m:5,t:'w',own:s,tk:0});else{let b=null,bd=420*Math.pow(sz,.8);for(const o of spiders)if(o!==s&&o.alive&&!sameTeam(s,o)){const d=Math.hypot(o.x-s.x,o.y-s.y);if(d<bd){bd=d;b=o}}if(!b)return;s.drain=1.8;s.dt=b;s.dtk=0}
s.cd.r=CDM.r;soundFx('spell',s.sp,'r',s)}}
