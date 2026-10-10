// ===== BACKGROUND: nền cỏ/đất và vật trang trí =====
function mkBG(){const o=document.createElement('canvas');o.width=o.height=512;const c=o.getContext('2d');c.fillStyle='#1b2318';c.fillRect(0,0,512,512);
const wr=(f)=>{for(const dx of[0,-512,512])for(const dy of[0,-512,512])f(dx,dy)};
for(let i=0;i<1800;i++){const x=R()*512,y=R()*512,r=rr(1,5),col=`hsla(${rr(70,130)},${rr(15,38)}%,${rr(7,22)}%,${rr(.15,.55)})`;wr((dx,dy)=>{c.fillStyle=col;c.beginPath();c.arc(x+dx,y+dy,r,0,TAU);c.fill()})}
for(let i=0;i<46;i++){const x=R()*512,y=R()*512,a=R()*TAU,w=rr(8,20),col=`hsla(${rr(20,110)},${rr(25,45)}%,${rr(10,20)}%,.55)`;wr((dx,dy)=>{c.fillStyle=col;c.beginPath();c.ellipse(x+dx,y+dy,w,w*.45,a,0,TAU);c.fill();c.strokeStyle='rgba(0,0,0,.25)';c.beginPath();c.moveTo(x+dx-Math.cos(a)*w,y+dy-Math.sin(a)*w);c.lineTo(x+dx+Math.cos(a)*w,y+dy+Math.sin(a)*w);c.stroke()})}
return X.createPattern(o,'repeat')}
const BG=mkBG(),DEC=Array.from({length:230},()=>({x:rr(60,WS-60),y:rr(60,WS-60),t:R()<.35?0:R()<.7?1:2,s:rr(.7,1.8),a:R()*TAU,h:rr(0,360)}));
