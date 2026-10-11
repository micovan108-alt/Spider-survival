// ===== GAME: input, bắt đầu ván, cài đặt, vòng lặp chính =====
// ---------- input
C.addEventListener('mousemove',e=>{mouse.sx=e.clientX;mouse.sy=e.clientY});C.addEventListener('mousedown',e=>{if(e.button==0)mouse.down=true;mouse.sx=e.clientX;mouse.sy=e.clientY});addEventListener('mouseup',()=>mouse.down=false);C.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(!playing||!P||!P.alive||e.target.id=='pn')return;const k=e.key.toLowerCase();if('qer'.includes(k)&&k.length==1){cast(P,k);e.preventDefault()}});

// ---------- start
function start(){spiders=[];foods=[];projs=[];zones=[];silks=[];fxs=[];parts=[];texts=[];$('kf').innerHTML='';
P=mk(sel,false,($('pn').value||'Bạn').trim().slice(0,14));P.x=rr(1500,3500);P.y=rr(1500,3500);P.inv=2.5;initLegs(P);spiders.push(P);for(let i=0;i<NB;i++)spawnBot(true);
cam.x=P.x;cam.y=P.y;const p=SP[sel];$('nm').textContent=P.name+' · '+p.n;$('ke').querySelector('span').innerHTML=p.e;$('kr').querySelector('span').innerHTML=p.r;
$('menu').classList.add('hide');$('hud').classList.remove('off');playing=true;syncBackgroundMusic();soundFx('start');toast('SĂN ĐI! 🕷')}
$('go').onclick=start;

// ---------- thẻ chọn nhện (menu cũ; bị ẩn khi dùng sảnh online)
SP.forEach((p,i)=>{const d=document.createElement('div');d.className='card'+(i==sel?' on':'');d.innerHTML=`<canvas width="190" height="120"></canvas><h3>${p.n}</h3><p><b>E · ${p.e}</b><br>${p.ed}</p><p><b>R · ${p.r}</b><br>${p.rd}</p>`;
const s=mk(i,true,'');s.x=0;s.y=0;s.a=-.3;s.sz=1.05;initLegs(s);const c=d.querySelector('canvas').getContext('2d');c.translate(88,62);c.scale(.8,.8);drawSpider(c,s);
d.onclick=()=>{sel=i;document.querySelectorAll('.card').forEach((e,j)=>e.classList.toggle('on',j==i))};$('cards').appendChild(d)});
for(let i=0;i<NB;i++)spawnBot(true);

// ---------- cài đặt
let paused=false,fps=60;
function saveCFG(){try{localStorage.setItem('spcfg',JSON.stringify(CFG))}catch(e){}}
function applyCFG(){NB=CFG.bots;$('s_q').value=CFG.q;$('s_z').value=CFG.zoom;$('s_b').value=CFG.bots;$('s_bv').textContent=CFG.bots;$('s_d').value=CFG.diff;$('s_n').checked=!!CFG.names;$('s_t').checked=!!CFG.dmg;$('s_s').checked=!!CFG.shake;$('s_a').checked=!!CFG.audio;$('s_m').checked=!!CFG.mm;$('s_f').checked=!!CFG.fps;$('mm').style.visibility=CFG.mm?'visible':'hidden';$('fps').style.display=CFG.fps?'block':'none'}
[['s_q','q'],['s_z','zoom'],['s_b','bots'],['s_d','diff']].forEach(([i,k])=>$(i).oninput=()=>{CFG[k]=+$(i).value;applyCFG();saveCFG()});
[['s_n','names'],['s_t','dmg'],['s_s','shake'],['s_a','audio'],['s_m','mm'],['s_f','fps']].forEach(([i,k])=>$(i).onchange=()=>{CFG[k]=$(i).checked?1:0;applyCFG();saveCFG();syncBackgroundMusic()});
function openSt(){$('st').classList.remove('hide');if(playing)paused=true}
function closeSt(){$('st').classList.add('hide');paused=false}
$('gs').onclick=openSt;$('gear').onclick=openSt;$('s_c').onclick=closeSt;$('s_r').onclick=()=>{closeSt();if(playing){playing=false;$('hud').classList.add('off');$('menu').classList.remove('hide')}};
addEventListener('keydown',e=>{if(e.key=='Escape'){$('st').classList.contains('hide')?openSt():closeSt()}});
applyCFG();

// ---------- vòng lặp chính
let last=performance.now();
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;if(mouse.sx!=null){mouse.x=(mouse.sx-W/2)/cam.z+cam.x;mouse.y=(mouse.sy-H/2)/cam.z+cam.y}
if(!paused)update(dt);syncBackgroundMusic();render();if(playing)hud();fps+=(1/Math.max(dt,.001)-fps)*.05;if(CFG.fps)$('fps').textContent=Math.round(fps)+' FPS';requestAnimationFrame(loop)}
requestAnimationFrame(loop);
