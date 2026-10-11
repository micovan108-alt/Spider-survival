// ===== DRAW: vẽ chân, thân nhện, thanh tên/máu =====
function hx2(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function drawLegs(c,s){const p=SP[s.sp],u=U*s.sz,n=NSEG(),WP=segInfo(n)[1];if(!p.q1){p.q1=hx2(p.c1);p.q2=hx2(p.c2);p.q3=hx2(p.ac)}
const G=s.legs.slice().sort((a,b)=>a.lv-b.lv),q1=p.q1,q2=p.q2;c.lineCap='round';c.lineJoin='round';
if(CFG.q){c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=5*u;c.beginPath();for(const g of G){c.moveTo(g.J[0].x+7*u,g.J[0].y+11*u);for(let j=1;j<=n;j++)c.lineTo(g.J[j].x+(7+g.lv*10)*u,g.J[j].y+(11+g.lv*14)*u)}c.stroke()}
for(const g of G){const J=g.J,hd=CFG.q?new Path2D():null;
for(let j=0;j<n;j++){const a=J[j],b=J[j+1];let dx=b.x-a.x,dy=b.y-a.y;const ln=Math.hypot(dx,dy)||1;dx/=ln;dy/=ln;const nx=-dy,ny=dx,w0=WP[j]*.5*u*g.th,w1=WP[j+1]*.5*u*g.th,t=j/n*.75;
c.beginPath();c.moveTo(a.x+nx*w0,a.y+ny*w0);c.lineTo(b.x+nx*w1,b.y+ny*w1);c.lineTo(b.x-nx*w1,b.y-ny*w1);c.lineTo(a.x-nx*w0,a.y-ny*w0);c.closePath();
c.fillStyle=`rgb(${q2[0]+(q1[0]-q2[0])*t|0},${q2[1]+(q1[1]-q2[1])*t|0},${q2[2]+(q1[2]-q2[2])*t|0})`;c.fill();
const o0=w0*.38,o1=w1*.38;c.strokeStyle='rgba(255,235,215,.22)';c.lineWidth=(w0+w1)*.42;c.beginPath();c.moveTo(a.x-.55*o0,a.y-.8*o0);c.lineTo(b.x-.55*o1,b.y-.8*o1);c.stroke();
if(hd)for(const h of HR[j]){const w=w0+(w1-w0)*h.u,px=a.x+(b.x-a.x)*h.u,py=a.y+(b.y-a.y)*h.u,bx=px+nx*h.s*w*.9,by=py+ny*h.s*w*.9,ha=Math.cos(h.ang),hs=Math.sin(h.ang),l=h.len*u;hd.moveTo(bx,by);hd.lineTo(bx+(nx*h.s*ha+dx*hs)*l,by+(ny*h.s*ha+dy*hs)*l)}}
if(hd){c.lineWidth=.8*u;c.strokeStyle='rgba(8,5,5,.9)';c.stroke(hd)}
for(let j=1;j<=n;j++){const q=J[j],r=WP[j]*.5*u*g.th*(j==n?.95:1.02);c.beginPath();c.arc(q.x,q.y,r,0,TAU);c.fillStyle=`rgb(${q2[0]*1.3+12|0},${q2[1]*1.3+10|0},${q2[2]*1.3+10|0})`;c.fill();c.lineWidth=.9*u;c.strokeStyle=`rgba(${p.q3},.6)`;c.stroke();c.beginPath();c.arc(q.x-r*.3,q.y-r*.36,r*.32,0,TAU);c.fillStyle='rgba(255,230,210,.3)';c.fill()}
const e=J[n],pr=J[n-1],an=Math.atan2(e.y-pr.y,e.x-pr.x);c.strokeStyle='#0a0606';c.lineWidth=1.5*u;c.beginPath();c.moveTo(e.x,e.y);c.quadraticCurveTo(e.x+Math.cos(an)*3*u,e.y+Math.sin(an)*3*u,e.x+Math.cos(an+.6*g.sd)*4.5*u,e.y+Math.sin(an+.6*g.sd)*4.5*u);c.stroke()}}

function drawSpider(c,s){const p=SP[s.sp],r=17*s.sz,L=LL*s.sz,ca=Math.cos(s.a),sa=Math.sin(s.a);
c.save();c.globalAlpha=s.inv>0&&((T*12|0)%2)?.45:1;
if(s.team){const alpha=c.globalAlpha,color=s.team===1?'255,94,88':'69,199,255',glow=c.createRadialGradient(s.x,s.y,r*.7,s.x,s.y,r*2.8);glow.addColorStop(0,`rgba(${color},.38)`);glow.addColorStop(.55,`rgba(${color},.14)`);glow.addColorStop(1,`rgba(${color},0)`);c.fillStyle=glow;c.beginPath();c.arc(s.x,s.y,r*2.8,0,TAU);c.fill();c.globalAlpha=alpha*.55;c.strokeStyle=`rgb(${color})`;c.lineWidth=Math.max(1.5,r*.11);c.shadowColor=`rgb(${color})`;c.shadowBlur=r*.8;c.beginPath();c.arc(s.x,s.y,r*2.05,0,TAU);c.stroke();c.shadowBlur=0;c.globalAlpha=alpha}
if(p.au&&CFG.q){const g=c.createRadialGradient(s.x,s.y,r*.5,s.x,s.y,r*3.4);g.addColorStop(0,`rgba(${p.au},.3)`);g.addColorStop(1,`rgba(${p.au},0)`);c.fillStyle=g;c.beginPath();c.arc(s.x,s.y,r*3.4,0,TAU);c.fill()}
c.fillStyle='rgba(0,0,0,.32)';c.beginPath();c.ellipse(s.x+3*s.sz,s.y+6*s.sz,r*2.2,r*1.25,s.a,0,TAU);c.fill();
c.lineCap=c.lineJoin='round';
drawLegs(c,s);
c.translate(s.x,s.y);c.rotate(s.a);
const bp=s.bite>0?Math.sin((1-s.bite/.2)*Math.PI):0;c.translate(bp*r*.35,0);const bob=1+Math.sin(T*5+s.ph)*.03;
let g=c.createRadialGradient(-r*1.4,-r*.35,r*.1,-r*1.2,0,r*1.3);g.addColorStop(0,p.c1);g.addColorStop(1,p.c2);
const body=()=>{c.beginPath();c.ellipse(-r*1.2,0,r*1.3*bob,r*.98*bob,0,0,TAU)};
c.fillStyle=g;body();c.fill();c.strokeStyle='rgba(0,0,0,.55)';c.lineWidth=r*.08;c.stroke();
if(s.sp==0){c.fillStyle=p.ac;c.beginPath();c.moveTo(-r*1.9,-r*.32);c.lineTo(-r*1.9,r*.32);c.lineTo(-r*1.2,0);c.closePath();c.moveTo(-r*.5,-r*.32);c.lineTo(-r*.5,r*.32);c.lineTo(-r*1.2,0);c.closePath();c.fill()}
if(s.sp==2){c.strokeStyle=p.ac;c.lineWidth=r*.11;for(let j=0;j<3;j++){c.beginPath();c.moveTo(-r*(.7+j*.45),-r*.55);c.lineTo(-r*(1+j*.45),0);c.lineTo(-r*(.7+j*.45),r*.55);c.stroke()}}
if(s.sp==3){c.fillStyle=p.ac;for(let j=0;j<4;j++){c.beginPath();c.arc(-r*(.6+j*.45),0,r*(.22-j*.035),0,TAU);c.fill()}}
if(s.sp==4){c.strokeStyle=p.ac;c.lineWidth=r*.07;for(let j=0;j<3;j++){const x=-r*(.6+j*.55),w=r*(.3-j*.04);c.beginPath();c.moveTo(x+w,0);c.lineTo(x,-w*1.3);c.lineTo(x-w,0);c.lineTo(x,w*1.3);c.closePath();c.stroke()}}
if(s.sp==5){c.strokeStyle=p.ac;c.lineWidth=r*.09;c.beginPath();c.moveTo(-r*.3,0);c.lineTo(-r*.8,-r*.25);c.lineTo(-r*1.1,r*.15);c.lineTo(-r*1.6,-r*.2);c.lineTo(-r*2,0);c.moveTo(-r*1.1,r*.15);c.lineTo(-r*1.3,r*.6);c.moveTo(-r*.8,-r*.25);c.lineTo(-r*.7,-r*.7);c.stroke()}
if(s.sp==6){c.fillStyle='rgba(30,15,0,.6)';for(let j=0;j<4;j++){c.beginPath();c.ellipse(-r*(.5+j*.45),0,r*.1,r*(.85-j*.1),0,0,TAU);c.fill()}c.fillStyle=p.ac;for(let j=0;j<3;j++){c.beginPath();c.arc(-r*(.72+j*.45),0,r*.1,0,TAU);c.fill()}}
if(s.sp==1){c.strokeStyle='rgba(255,176,96,.5)';c.lineWidth=Math.max(1,r*.05);c.beginPath();for(const[a,q,ln]of HAIR){const px=-r*1.2+Math.cos(a)*q*r*1.25,py=Math.sin(a)*q*r*.95;c.moveTo(px,py);c.lineTo(px+Math.cos(a)*ln*r,py+Math.sin(a)*ln*r)}c.stroke()}
c.fillStyle='rgba(255,255,255,.1)';c.beginPath();c.ellipse(-r*1.35,-r*.35,r*.6,r*.25,-.2,0,TAU);c.fill();
g=c.createRadialGradient(r*.1,-r*.2,r*.1,r*.25,0,r*.9);g.addColorStop(0,p.c1);g.addColorStop(1,p.c2);c.fillStyle=g;c.beginPath();c.ellipse(r*.2,0,r*.85,r*.72,0,0,TAU);c.fill();c.stroke();
if(s.sp==1){c.strokeStyle='rgba(255,176,96,.5)';c.beginPath();for(const[a,q,ln]of HAIR.slice(0,30)){const px=r*.2+Math.cos(a)*q*r*.8,py=Math.sin(a)*q*r*.65;c.moveTo(px,py);c.lineTo(px+Math.cos(a)*ln*r,py+Math.sin(a)*ln*r)}c.stroke()}
c.fillStyle=p.c2;for(const sd of[-1,1]){c.beginPath();c.ellipse(r*.98,sd*r*.55,r*.24,r*.12,sd*.6,0,TAU);c.fill()}
const f=s.sp==2?1.5:1;for(const[ex,ey,er]of[[.78,.18,.15*f],[.78,-.18,.15*f],[.92,.4,.09],[.92,-.4,.09],[.55,.3,.07],[.55,-.3,.07]]){c.fillStyle=p.eye;c.beginPath();c.arc(r*ex,r*ey,r*er,0,TAU);c.fill();c.fillStyle='#000';c.beginPath();c.arc(r*ex+r*er*.25,r*ey,r*er*.55,0,TAU);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(r*ex+r*er*.05,r*ey-r*er*.3,r*er*.22,0,TAU);c.fill()}
c.lineCap='round';for(const sd of[-1,1]){const sp2=sd*r*(.1+bp*.42);c.strokeStyle='#e9e2cf';c.lineWidth=r*.2;c.beginPath();c.moveTo(r*.95,sd*r*.2);c.quadraticCurveTo(r*1.4,sd*r*(.4+bp*.25),r*1.55,sp2);c.stroke();c.strokeStyle=p.ac;c.lineWidth=r*.07;c.beginPath();c.moveTo(r*1.4,sd*r*(.3+bp*.25));c.lineTo(r*1.58,sp2);c.stroke()}
if(s.hit>0){c.fillStyle=`rgba(255,255,255,${s.hit*3})`;body();c.fill();c.beginPath();c.ellipse(r*.2,0,r*.85,r*.72,0,0,TAU);c.fill()}
c.restore();c.save();
if(s.slow>0){c.strokeStyle='rgba(220,240,255,.7)';c.lineWidth=2;c.setLineDash([6,5]);c.beginPath();c.arc(s.x,s.y,r*1.9,T,TAU+T);c.stroke();c.setLineDash([])}
if(s.pois>0){c.strokeStyle='rgba(120,255,90,.6)';c.lineWidth=3;c.beginPath();c.arc(s.x,s.y,r*1.6,0,TAU);c.stroke()}
if(s.stun>0){c.fillStyle='#ffe066';for(let j=0;j<3;j++){const a=T*6+j*2.09;c.beginPath();c.arc(s.x+Math.cos(a)*r*1.1,s.y-r*1.5+Math.sin(a)*r*.4,r*.17,0,TAU);c.fill()}}
if(s.spin>0){c.globalCompositeOperation='lighter';c.strokeStyle=p.ac;c.lineCap='round';c.lineWidth=r*.28;for(let j=0;j<3;j++){c.beginPath();c.arc(s.x,s.y,r*2.6,s.a+j*2.09,s.a+j*2.09+.9);c.stroke()}}
if(s.drain>0&&s.dt&&s.dt.alive){c.globalCompositeOperation='lighter';c.strokeStyle='rgba(210,130,255,.85)';c.lineWidth=3*s.sz;c.beginPath();c.moveTo(s.x,s.y);for(let j=1;j<9;j++){const t=j/9;c.lineTo(s.x+(s.dt.x-s.x)*t+rr(-8,8)*s.sz,s.y+(s.dt.y-s.y)*t+rr(-8,8)*s.sz)}c.lineTo(s.dt.x,s.dt.y);c.stroke()}
c.restore()}

function drawTag(c,s){const r=17*s.sz,w=r*3.4,x=s.x-w/2,y=s.y-r*2.5,ally=!!(P&&P.team&&s.team===P.team);c.fillStyle='rgba(0,0,0,.6)';c.fillRect(x-1,y-1,w+2,r*.3+2);c.fillStyle=s===P?'#5dff8a':ally?'#79d6ad':s.team===1?'#f18170':s.team===2?'#83c6da':'#ff4d5e';c.fillRect(x,y,w*Math.max(0,s.hp/s.mh),r*.3);
c.font=`700 ${r*.75}px system-ui`;c.textAlign='center';c.fillStyle=s===P?'#ffe066':ally?'#b7f2d6':s.team===1?'#f7a094':s.team===2?'#a5deec':(P&&s.lvl>P.lvl+1?'#ff8080':'#fff');c.strokeStyle='#000';c.lineWidth=3;const t=`${s.team===1?'Đ1 ':s.team===2?'Đ2 ':''}${s.name} · Lv.${s.lvl}`;c.strokeText(t,s.x,y-r*.25);c.fillText(t,s.x,y-r*.25)}
