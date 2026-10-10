// ===== SPIDER: tạo nhện, chỉ số, và bộ chân (IK + bước chân) =====
function mk(sp,bot,name){const s={sp,bot,name,x:rr(300,WS-300),y:rr(300,WS-300),a:rr(0,TAU),aim:0,mv:0,vx:0,vy:0,kx:0,ky:0,lvl:1,xp:0,tot:0,hp:0,mh:0,sz:1,cd:{b:0,q:0,e:0,r:0},bite:0,dash:0,dvx:0,dvy:0,dh:[],stun:0,slow:0,pois:0,pf:0,spin:0,stk:0,drain:0,dtk:0,dt:null,pounce:false,kills:0,legs:[],ph:R()*9,alive:true,ai:0,hit:0,inv:0,combat:0,aggr:rr(.3,1),thr:null,prey:null,food:null,wa:R()*TAU};
stats(s);s.hp=s.mh;initLegs(s);return s}
function stats(s){const p=SP[s.sp];s.sz=1+(s.lvl-1)*.17;s.mh=(100+(s.lvl-1)*32)*p.hp;s.dmg=(11+(s.lvl-1)*2.6)*p.dm;s.spd=235*p.sp/Math.pow(s.sz,.25);if(s.bot){s.dmg*=DF[CFG.diff];s.mh*=.9+DF[CFG.diff]*.1}}
const U=.64,NSEG=()=>CFG.q?7:4;
const LDEF=[{ax:17,ang:32,len:1,fx:.5},{ax:10,ang:68,len:1,fx:.9},{ax:2,ang:108,len:1.02,fx:-.9},{ax:-6,ang:145,len:1.1,fx:-.5}];
const WPROF=[10.5,9.4,7.4,5.8,4.4,3,1.5],SPROF=[1,1.35,1.1,1.3,1,.75];
const prof=(a,u)=>{const x=Math.min(1,Math.max(0,u))*(a.length-1),i=Math.min(a.length-2,Math.floor(x));return a[i]+(a[i+1]-a[i])*(x-i)};
const FRC={},WPC={};
function segInfo(n){if(!FRC[n]){const r=[];let sm=0;for(let j=0;j<n;j++){const v=prof(SPROF,(j+.5)/n);r.push(v);sm+=v}const fr=[0];let c=0;for(const v of r){c+=v/sm;fr.push(c)}FRC[n]=fr;WPC[n]=Array.from({length:n+1},(_,j)=>prof(WPROF,j/n))}return[FRC[n],WPC[n]]}
const HR=Array.from({length:7},()=>{const a=[];for(let s=-1;s<=1;s+=2)for(let h=0;h<2;h++)a.push({u:R(),s,len:1.6+R()*2.6,ang:.7+R()*.6});return a});
const nbr=i=>{const sd=i<4?0:1,k=i%4,o=[(1-sd)*4+k];if(k>0)o.push(sd*4+k-1);if(k<3)o.push(sd*4+k+1);return o};
function initLegs(s){s.legs=[];s.it=1.5;s.ths=0;const ca=Math.cos(s.a),sa=Math.sin(s.a),u=U*s.sz;
for(let sd=-1;sd<=1;sd+=2)for(let k=0;k<4;k++){const d=LDEF[k],L=112*d.len,reach=L*.9,a=d.ang*Math.PI/180;
const g={k,sd,idx:(sd<0?0:4)+k,L,ax:d.ax,ay:sd*8,rx:d.ax+reach*Math.cos(a),ry:sd*(8+reach*Math.sin(a)),bx:d.fx,by:sd,fx:0,fy:0,ox:0,oy:0,tx:0,ty:0,rw:{x:0,y:0},aw:{x:0,y:0},st:false,t:0,dur:.15,lift:0,lv:0,nx:0,ny:0,over:0,reach:0,thr:0,ph:R()*TAU,th:rr(.92,1.08),J:Array.from({length:8},()=>({x:0,y:0}))};
g.fx=s.x+(g.rx*ca-g.ry*sa)*u;g.fy=s.y+(g.rx*sa+g.ry*ca)*u;s.legs.push(g)}
updLegs(s,0)}
function joints(s,g,u,ca,sa){const n=NSEG(),fr=segInfo(n)[0],L=g.L*u,R0=g.aw;let dx=g.fx-R0.x,dy=g.fy-R0.y,d=Math.hypot(dx,dy)||.001;
if(d>L*.985){const k=L*.985/d;dx*=k;dy*=k;d=L*.985}
let nx=-dy/d,ny=dx/d;const bx=g.bx*ca-g.by*sa,by=g.bx*sa+g.by*ca;if(nx*bx+ny*by<0){nx=-nx;ny=-ny}
const arch=Math.sqrt(Math.max(0,3*d*(L-d)/8)),Hh=(Math.max(arch*.75,L*.06)*(1+.6*g.lv)+L*.1*g.lv)*(1+.04*Math.sin(T*1.7+g.ph)),N=28,px=[],py=[],cum=[0];
for(let i=0;i<=N;i++){const t=i/N,sh=Math.sin(Math.PI*t)*(1.1-.25*t);px[i]=R0.x+dx*t+nx*Hh*sh;py[i]=R0.y+dy*t+ny*Hh*sh;if(i)cum[i]=cum[i-1]+Math.hypot(px[i]-px[i-1],py[i]-py[i-1])}
const tot=cum[N];let i=0;for(let j=0;j<=n;j++){const sv=fr[j]*tot;while(i<N-1&&cum[i+1]<sv)i++;const f=(sv-cum[i])/(cum[i+1]-cum[i]||1);g.J[j].x=px[i]+(px[i+1]-px[i])*f;g.J[j].y=py[i]+(py[i+1]-py[i])*f}}
function updLegs(s,dt){const u=U*s.sz,ca=Math.cos(s.a),sa=Math.sin(s.a),v=Math.min(Math.hypot(s.vx,s.vy),420),lead=Math.min(v*.15,36*u),G=s.legs;
s.ths+=((s.bite>0?1:0)-s.ths)*Math.min(1,dt*10);
for(const g of G){const rx=g.rx+g.nx,ry=g.ry+g.ny;g.rw.x=s.x+(rx*ca-ry*sa)*u;g.rw.y=s.y+(rx*sa+ry*ca)*u;g.aw.x=s.x+(g.ax*ca-g.ay*sa)*u;g.aw.y=s.y+(g.ax*sa+g.ay*ca)*u;
g.tx=g.rw.x+ca*lead;g.ty=g.rw.y+sa*lead;g.thr=.19*g.L*u;g.over=Math.hypot(g.fx-g.rw.x,g.fy-g.rw.y)/g.thr;g.reach=Math.hypot(g.fx-g.aw.x,g.fy-g.aw.y)/(g.L*u);
if(g.reach>1.3){g.fx=g.rw.x;g.fy=g.rw.y;g.st=false}}
for(const g of G){if(!g.st){g.lift=0;continue}g.t+=dt/g.dur;if(g.t>=1){g.st=false;g.lift=0;g.fx=g.tx;g.fy=g.ty}else{const e=g.t*g.t*(3-2*g.t);g.fx=g.ox+(g.tx-g.ox)*e;g.fy=g.oy+(g.ty-g.oy)*e;g.lift=Math.sin(Math.PI*g.t)}}
const ord=G.filter(g=>!g.st).sort((a,b)=>Math.max(b.over,b.reach/.9)-Math.max(a.over,a.reach/.9));
for(const g of ord){if(!(g.over>1||g.reach>.9))continue;if(!(g.reach>.96)&&nbr(g.idx).some(j=>G[j].st))continue;const cy=(lead+g.thr)/Math.max(v,20);g.st=true;g.t=0;g.ox=g.fx;g.oy=g.fy;g.dur=Math.min(.3,Math.max(.09,cy*.45))}
if(v<6&&dt>0){s.it-=dt;if(s.it<0){s.it=rr(.5,1.8);const g=G[R()*8|0];if(!g.st&&!nbr(g.idx).some(j=>G[j].st)){const big=R()<.55;g.nx=big?rr(-14,14):0;g.ny=big?rr(-14,14):0;g.st=true;g.t=0;g.ox=g.fx;g.oy=g.fy;g.dur=rr(.14,.26)}}}
for(const g of G){g.lv=Math.max(g.lift,(g.k==0?.6:g.k==1?.25:0)*s.ths);joints(s,g,u,ca,sa)}}
