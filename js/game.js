// ===== GAME: input, bắt đầu ván, cài đặt, vòng lặp chính =====
// ---------- input
let mobileInput={active:false,x:1,y:0,mv:0,bite:false};
const touchCapable=()=>navigator.maxTouchPoints>0||matchMedia('(pointer:coarse)').matches;
document.body.insertAdjacentHTML('beforeend',`<div id="mobileControls" aria-label="Điều khiển cảm ứng"><div id="movePad" class="move-pad" aria-label="Joystick di chuyển"><span class="move-ring"><i id="moveKnob"></i></span><small>DI CHUYỂN</small></div><div id="actionPad" class="action-pad" aria-label="Điều khiển chiến đấu"><button id="touchQ" class="touch-skill skill-q" data-skill="q" aria-label="Chiêu Q">Q</button><button id="touchE" class="touch-skill skill-e" data-skill="e" aria-label="Chiêu E">E</button><button id="touchR" class="touch-skill skill-r" data-skill="r" aria-label="Chiêu R">R</button><button id="touchBite" class="touch-bite" aria-label="Cắn">🦷<small>CẮN</small></button></div></div>`);
function syncMobileViewport(){const touch=touchCapable();document.body.classList.toggle('touch-device',touch);document.documentElement.classList.toggle('force-landscape',touch&&matchMedia('(orientation:portrait)').matches);rs()}
syncMobileViewport();addEventListener('resize',syncMobileViewport);addEventListener('orientationchange',syncMobileViewport);screen.orientation?.addEventListener?.('change',syncMobileViewport);
async function requestLandscape(){if(!touchCapable())return;syncMobileViewport();try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();if(screen.orientation?.lock)await screen.orientation.lock('landscape')}catch(e){}syncMobileViewport()}
document.addEventListener('pointerdown',e=>{if(e.target.closest('#bm,#bo,.mode-choice'))requestLandscape()},true);
const movePad=$('movePad'),moveKnob=$('moveKnob'),mobileControls=$('mobileControls');let movePointer=null;
function moveStick(e){const box=movePad.getBoundingClientRect(),limit=box.width*.34,dx=e.clientX-(box.left+box.width/2),dy=e.clientY-(box.top+box.height/2),length=Math.hypot(dx,dy),scale=length>limit?limit/length:1,x=dx*scale,y=dy*scale;mobileInput.active=true;mobileInput.x=length?dx/length:1;mobileInput.y=length?dy/length:0;mobileInput.mv=Math.min(1,length/limit);moveKnob.style.transform=`translate(${x}px,${y}px)`}
movePad.addEventListener('pointerdown',e=>{e.preventDefault();movePointer=e.pointerId;movePad.setPointerCapture(e.pointerId);moveStick(e)});movePad.addEventListener('pointermove',e=>{if(e.pointerId===movePointer)moveStick(e)});
function releaseStick(e){if(e.pointerId!==movePointer)return;movePointer=null;mobileInput.active=false;mobileInput.mv=0;moveKnob.style.transform='translate(0,0)'}
movePad.addEventListener('pointerup',releaseStick);movePad.addEventListener('pointercancel',releaseStick);movePad.addEventListener('lostpointercapture',releaseStick);
const biteButton=$('touchBite');biteButton.addEventListener('pointerdown',e=>{e.preventDefault();biteButton.setPointerCapture(e.pointerId);mobileInput.bite=true});
function releaseBite(){mobileInput.bite=false}biteButton.addEventListener('pointerup',releaseBite);biteButton.addEventListener('pointercancel',releaseBite);biteButton.addEventListener('lostpointercapture',releaseBite);
document.querySelectorAll('.touch-skill').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();if(playing&&P&&P.alive)cast(P,b.dataset.skill)}));
function syncMobileControls(){const active=touchCapable()&&playing&&P&&P.alive&&!paused;mobileControls.classList.toggle('active',!!active);document.body.classList.toggle('mobile-game-active',!!active);if(!active){mobileInput.active=false;mobileInput.mv=0;mobileInput.bite=false}}
C.addEventListener('mousemove',e=>{mouse.sx=e.clientX;mouse.sy=e.clientY});C.addEventListener('mousedown',e=>{if(e.button==0)mouse.down=true;mouse.sx=e.clientX;mouse.sy=e.clientY});addEventListener('mouseup',()=>mouse.down=false);C.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(!playing||!P||!P.alive||e.target.id=='pn')return;const k=e.key.toLowerCase();if('qer'.includes(k)&&k.length==1){cast(P,k);e.preventDefault()}});

// ---------- start
function start(){spiders=[];foods=[];projs=[];zones=[];silks=[];fxs=[];parts=[];texts=[];$('kf').innerHTML='';mobileInput={active:false,x:1,y:0,mv:0,bite:false};
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
if(!paused)update(dt);syncMobileControls();syncBackgroundMusic();render();if(playing)hud();fps+=(1/Math.max(dt,.001)-fps)*.05;if(CFG.fps)$('fps').textContent=Math.round(fps)+' FPS';requestAnimationFrame(loop)}
requestAnimationFrame(loop);
