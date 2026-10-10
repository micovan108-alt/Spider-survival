// ===== HUD: thông báo, kill feed, thanh máu/XP, bảng xếp hạng, minimap =====
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('on'),1400)}
function feed(t){const d=document.createElement('div');d.textContent=t;$('kf').appendChild(d);setTimeout(()=>d.remove(),4500);while($('kf').children.length>5)$('kf').firstChild.remove()}
function hud(){if(!P)return;$('lv').textContent='Lv.'+P.lvl;$('hpb').style.width=Math.max(0,P.hp/P.mh*100)+'%';$('hpt').textContent=`${Math.max(0,P.hp|0)} / ${P.mh|0}`;$('xpb').style.width=(P.lvl>=30?100:P.xp/need(P.lvl)*100)+'%';
for(const k of['b','q','e','r']){const e=$('k'+k);e.querySelector('s').style.height=(P.cd[k]/CDM[k]*100)+'%';e.classList.toggle('rdy',P.cd[k]<=0)}
lbT-=.016;if(lbT<=0){lbT=.4;const a=spiders.filter(s=>s.alive).sort((x,y)=>y.tot-x.tot);let h='<b>🏆 BẢNG XẾP HẠNG</b>';a.slice(0,8).forEach((s,i)=>h+=`<div class="${s===P?'me':''}"><span>${i+1}. ${s.name}</span><span>Lv.${s.lvl}</span></div>`);const pi=a.indexOf(P);if(pi>=8)h+=`<div class="me"><span>${pi+1}. ${P.name}</span><span>Lv.${P.lvl}</span></div>`;$('lb').innerHTML=h}
const m=$('mm').getContext('2d'),k=150/WS;m.clearRect(0,0,150,150);for(const s of spiders){if(!s.alive)continue;m.fillStyle=s===P?'#fff':(s.lvl>P.lvl+1?'#ff4d5e':'#ffb347');m.beginPath();m.arc(s.x*k,s.y*k,Math.min(6,2+s.lvl*.12)*(s===P?1.3:1),0,TAU);m.fill()}
m.strokeStyle='#fff8';m.strokeRect((cam.x-W/2/cam.z)*k,(cam.y-H/2/cam.z)*k,W/cam.z*k,H/cam.z*k)}
