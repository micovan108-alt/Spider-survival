// ===== ONLINE ADD-ON: sảnh, cửa hàng, đăng nhập Google, ghép trận, đồng bộ realtime =====
// Cần: firebase-config.js (const FB) và toàn bộ module game đã nạp xong.
addEventListener('load',()=>{
const PR=[0,400,600,700,900,1100,1300],fresh=()=>({coins:100,owned:[0],kills:0,best:1,day:''}); // PR = giá mở khóa từng loài nhện (theo thứ tự SP)
const gid=localStorage.gid||(localStorage.gid='g'+Math.random().toString(36).slice(2,10));
let acc={uid:gid,name:localStorage.gname||'Bạn',google:false},pf=fresh(),db=null,rid=null,refs=[],RM={},sendT=0,bc=0,cancel=false,pvS=null,BM={},role=null,joinT=0,bseq=0,bsT=0,hbk=0,teamMode=false,teamStart=0,teamRoundKey='',teamScores={red:0,blue:0},teamFinished=false,serverOffset=0,roundWrites=[];
const loadLocal=()=>{try{Object.assign(pf,JSON.parse(localStorage.getItem('pf_'+acc.uid)||'{}'))}catch(e){}};
const inLobby=()=>!$('lb2').classList.contains('h');
function saveP(){try{localStorage.setItem('pf_'+acc.uid,JSON.stringify(pf))}catch(e){}if(acc.google&&db)db.ref('users/'+acc.uid).set(pf).catch(()=>{});refresh()}
function earn(n){pf.coins+=n;saveP();inLobby()?toast('+'+n+' 🪙'):feed('+'+n+' 🪙')}

// ---------- LOBBY DOM
const bar=(l,v,c)=>`<div class="br"><span>${l}</span><i><b style="width:${v}%;background:${c}"></b></i></div>`;
const stb=p=>bar('Máu',p.hp/1.5*100,'#b8c77c')+bar('Sát thương',p.dm/1.25*100,'#dc9060')+bar('Tốc độ',p.sp/1.3*100,'#83b7a0');
document.body.insertAdjacentHTML('beforeend',`<div id="lb2"><div class="lt"><div class="lg">NHỆN SINH TỒN <span>ONLINE ARENA</span></div><span class="chip" id="lo">ĐANG KẾT NỐI</span><span class="chip gold" id="co"></span><span class="chip" id="who"></span><button class="mb" id="gl"></button><button class="mb" id="gs2">CÀI ĐẶT</button></div>
<div class="tabs"><button class="tab on" data-t="tp">ĐẤU TRƯỜNG</button><button class="tab" data-t="ts">BỘ SƯU TẬP</button></div>
<div class="main" id="tp"><div class="glass preview-panel"><div class="eyebrow">LỰA CHỌN NHÂN VẬT</div><div id="pvw"><canvas id="pv" width="420" height="300"></canvas></div><h2 id="pnm" style="margin:12px 0 6px"></h2><div id="pst"></div><div id="sel" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px"></div></div>
<div class="glass match-panel"><div class="eyebrow">TRẬN ĐẤU</div><h2 class="panel-title">Sẵn sàng vào trận</h2><div id="rb"></div><label class="field-label" for="ln">TÊN HIỂN THỊ</label><input id="ln" maxlength="14"><button class="big" id="bm">CHƠI</button><p class="help-text">Chọn chế độ và vào đấu trường</p><button class="big" id="bo">LUYỆN TẬP OFFLINE</button><button class="big" id="dl"></button><div id="stt" class="lobby-metrics"></div></div></div>
<div class="main" id="ts" style="display:none"></div></div>
<div id="mm2" style="display:none;position:fixed;inset:0;z-index:12;background:#000d;align-items:center;justify-content:center;flex-direction:column;gap:18px;color:#fff;font-family:Bahnschrift,Segoe UI,sans-serif"><div class="spn"></div><div id="mmt" style="font:700 20px Bahnschrift,Segoe UI,sans-serif;text-align:center"></div><button class="mb" id="mmc">HỦY</button></div>
<div id="mode2" class="mode-overlay"><section class="mode-dialog"><div class="eyebrow">CHỌN CHẾ ĐỘ</div><h2>Vào trận</h2><button class="mode-choice" data-mode="solo"><b>GHÉP ĐẤU SINH TỬ</b><span>Chơi sinh tồn như bình thường</span></button><button class="mode-choice team-choice" data-mode="team"><b>ĐẤU ĐỘI</b><span>Hai đội · 5 phút · đội hạ nhiều địch hơn thắng</span></button><button class="mb mode-cancel" id="modeCancel">QUAY LẠI</button></section></div>
<div id="teamHud"><span class="team-red">ĐỘI ĐỎ <b id="scoreRed">0</b></span><strong id="teamClock">05:00</strong><span class="team-blue">ĐỘI XANH <b id="scoreBlue">0</b></span></div>`);
document.body.insertAdjacentHTML('beforeend',`<div id="teamResult" class="team-result" aria-hidden="true"><div id="resultConfetti" class="result-confetti-layer" aria-hidden="true"></div><section class="result-shell" role="dialog" aria-modal="true" aria-labelledby="resultTitle"><div class="result-overline">TRẬN ĐẤU KẾT THÚC</div><div id="resultTeam" class="result-team-label"></div><h1 id="resultTitle"></h1><p id="resultSubtitle" class="result-subtitle"></p><div class="result-scoreline"><span class="team-red">ĐỎ <b id="finalRed">0</b></span><span class="score-divider">:</span><span class="team-blue">XANH <b id="finalBlue">0</b></span></div><div class="result-section-title"><span>VINH DANH TOP 3</span><i></i></div><div id="resultPodium" class="result-podium"></div><div class="result-section-title ranking-title"><span>BẢNG XẾP HẠNG</span><i></i><small>HẠ GỤC</small></div><div class="result-ranking-head"><span>HẠNG</span><span>NHỆN CHIẾN BINH</span><span>ĐỘI</span><span>HẠ GỤC</span></div><div id="resultRanking" class="result-ranking"></div><button id="resultLobby" class="result-lobby-button">VỀ SẢNH</button></section></div>`);
SP.forEach((p,i)=>{const d=document.createElement('div');d.className='glass sc';d.innerHTML=`<canvas width="190" height="120"></canvas><h3>${p.n}</h3>${stb(p)}<div class="sk"><b>E · ${p.e}</b><br><small>${p.ed}</small></div><div class="sk"><b>R · ${p.r}</b><br><small>${p.rd}</small></div><button class="big" style="font-size:14px;padding:10px"></button>`;
const s=mk(i,true,'');s.x=s.y=0;s.a=-.3;s.sz=1.05;initLegs(s);const c=d.querySelector('canvas').getContext('2d');c.translate(88,62);c.scale(.8,.8);drawSpider(c,s);
d.querySelector('button').onclick=()=>{if(pf.owned.includes(i))setSel(i);else if(pf.coins<PR[i])toast('Cần '+PR[i]+' xu!');else{pf.coins-=PR[i];pf.owned.push(i);saveP();toast('🔓 Đã mở khóa '+p.n);setSel(i)}};$('ts').appendChild(d)});
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x==b));$('tp').style.display=b.dataset.t=='tp'?'flex':'none';$('ts').style.display=b.dataset.t=='ts'?'flex':'none'});
function setSel(i){sel=i;pvS=mk(i,true,'');pvS.x=pvS.y=0;pvS.sz=1.7;initLegs(pvS);refresh()}
function refresh(){const ok=pf.day!==new Date().toDateString(),p=SP[sel];
$('co').textContent=pf.coins+' XU';$('who').textContent=(acc.google?'GOOGLE':'KHÁCH')+' · '+acc.name;$('gl').textContent=acc.google?'ĐĂNG XUẤT':'ĐĂNG NHẬP GOOGLE';
$('dl').textContent=ok?'NHẬN THƯỞNG NGÀY · +150 XU':'ĐÃ NHẬN THƯỞNG HÔM NAY';$('dl').disabled=!ok;
$('stt').innerHTML=`<span class="chip">KỶ LỤC · LV.${pf.best}</span><span class="chip">HẠ GỤC · ${pf.kills}</span><span class="chip">NHỆN · ${pf.owned.length}/${SP.length}</span>`;
$('pnm').textContent=p.n;$('pst').innerHTML=stb(p)+`<div class="sk"><b>E · ${p.e}</b> — ${p.ed}<br><b>R · ${p.r}</b> — ${p.rd}</div>`;
$('sel').innerHTML=pf.owned.map(i=>`<button class="mb ${i==sel?'on':''}" data-i="${i}">${SP[i].n}</button>`).join('');$('sel').querySelectorAll('button').forEach(b=>b.onclick=()=>setSel(+b.dataset.i));
document.querySelectorAll('.sc').forEach((d,i)=>{const o=pf.owned.includes(i),b=d.querySelector('button');d.classList.toggle('on',i==sel);b.textContent=o?(i==sel?'ĐANG CHỌN':'CHỌN NHỆN'):'MỞ KHÓA · '+PR[i]+' XU';b.classList.toggle('owned',o);b.classList.toggle('selected',o&&i==sel);d.querySelector('canvas').style.filter=o?'':'brightness(.35) grayscale(.6)'})}
(function lp(){if(inLobby()&&$('tp').style.display!=='none'&&pvS){const c=$('pv').getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,420,300);c.save();c.translate(215,150);c.scale(1.1,1.1);pvS.a=-.4+Math.sin(T*.8)*.12;updLegs(pvS,.016);drawSpider(c,pvS);c.restore()}requestAnimationFrame(lp)})();
function lob(v){$('lb2').classList.toggle('h',!v);if(v){$('hud').classList.add('off');refresh();cnt()}}
async function cnt(){if(!db)return $('lo').textContent='OFFLINE';try{const d=(await db.ref('rooms').once('value')).val()||{};let n=0;for(const k in d)n+=Object.keys(d[k].players||{}).length;$('lo').textContent=n+' NGƯỜI ĐANG CHƠI'}catch(e){$('lo').textContent='CHƯA KẾT NỐI'}}
setInterval(()=>inLobby()&&cnt(),10000);
$('dl').onclick=()=>{pf.day=new Date().toDateString();earn(150)};
$('ln').value=acc.name;$('ln').onchange=()=>{if(!acc.google)localStorage.gname=$('ln').value.trim().slice(0,14)};
$('gs2').onclick=()=>openSt();
new MutationObserver(()=>{const m=$('menu');if(!m.classList.contains('hide')){m.classList.add('hide');$('rb').innerHTML=$('mt').innerHTML;$('rb').style.display='block';lob(true)}}).observe($('menu'),{attributes:true,attributeFilter:['class']});
$('menu').classList.add('hide');

// ---------- Firebase + auth
try{firebase.initializeApp(FB);db=firebase.database();
firebase.auth().onAuthStateChanged(async u=>{pf=fresh();if(u){acc={uid:u.uid,name:(u.displayName||'Nhện').slice(0,14),google:true};try{const v=(await db.ref('users/'+u.uid).once('value')).val();if(v)Object.assign(pf,v);else loadLocal()}catch(e){loadLocal()}}
else{acc={uid:gid,name:localStorage.gname||'Bạn',google:false};loadLocal()}$('ln').value=acc.name;if(!pf.owned.includes(sel))setSel(0);refresh();cnt()})}catch(e){console.warn('Firebase lỗi',e)}
$('gl').onclick=()=>{if(!db){toast('Chưa kết nối Firebase');return}if(acc.google)firebase.auth().signOut();else firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(()=>toast('Đăng nhập lỗi'))};

// ---------- play / matchmaking
function play(room){if(!pf.owned.includes(sel)){toast('Hãy mở khóa nhện này trước!');return}
acc.name=($('ln').value||'Bạn').trim().slice(0,14);if(!acc.google)localStorage.gname=acc.name;$('pn').value=acc.name;$('rb').style.display='none';
const info=room&&typeof room==='object'?room:null;NB=room?0:CFG.bots;start();P.team=teamMode&&info?info.team:null;lob(false);if(room)joinNet(info?info.id:room,!!info&&info.fresh)}
$('bo').onclick=()=>{teamMode=false;window.TEAM_MATCH=false;play(null)};
function beginMode(mode){teamMode=mode==='team';window.TEAM_MATCH=teamMode;teamStart=0;teamRoundKey='';teamScores={red:0,blue:0};teamFinished=false;roundWrites=[];$('teamResult').classList.remove('show');$('teamResult').setAttribute('aria-hidden','true');$('mode2').style.display='none';if(teamMode&&!db){teamMode=false;window.TEAM_MATCH=false;toast('Đấu đội cần kết nối mạng');return}startMatch(mode)}
function startMatch(mode){if(!pf.owned.includes(sel)){toast('Hãy mở khóa nhện này trước!');return}
acc.name=($('ln').value||'Bạn').trim().slice(0,14);if(!acc.google)localStorage.gname=acc.name;if(mode==='team')matchTeam();else matchmaking('solo')}
$('bm').onclick=()=>{$('mode2').style.display='flex'};$('modeCancel').onclick=()=>{$('mode2').style.display='none'};
document.querySelectorAll('.mode-choice').forEach(b=>b.onclick=()=>beginMode(b.dataset.mode));
// Giữ chỗ nguyên tử bằng transaction: 2 người ghép cùng lúc không thể vượt quá 15 và luôn vào cùng phòng đông nhất còn chỗ
let claimed=null;
function unclaim(){if(claimed&&db){db.ref('rooms/'+claimed+'/players/'+acc.uid).remove().catch(()=>{});claimed=null}}
async function claimRoom(mode){
for(let t=0;t<4;t++){
let d={};try{d=(await db.ref('rooms').once('value')).val()||{}}catch(e){return 'err'}
const prefix=mode==='team'?'t':'r',limit=mode==='team'?14:15,cand=[];for(let i=1;i<=6;i++){const room=d[prefix+i]||{},n=Object.values(room.players||{}).filter(p=>p&&p.sp!=null).length,started=Number(room.teamMatch&&room.teamMatch.startedAt)||0,active=mode==='team'&&started&&Date.now()+serverOffset-started<300000;if(n<limit&&!active)cand.push([prefix+i,n])}
cand.sort((x,y)=>y[1]-x[1]); // phòng đông nhất trước; hòa thì giữ thứ tự r1,r2...
if(!cand.length)return null;
const id=cand[0][0],seed={sp:sel,name:acc.name,x:2500,y:2500,a:0,vx:0,vy:0,l:1,h:100,m:100,t:0,b:0};if(mode==='team')seed.joinedAt=Math.round(Date.now()+serverOffset);
try{const r=await db.ref('rooms/'+id+'/players').transaction(cur=>{cur=cur||{};if(!cur[acc.uid]&&Object.keys(cur).length>=limit)return;
if(mode==='team'&&!cur[acc.uid]){const red=Object.values(cur).filter(p=>p&&p.team===1).length,blue=Object.values(cur).filter(p=>p&&p.team===2).length;seed.team=red<=blue?1:2}
cur[acc.uid]=Object.assign({},seed);return cur});
if(r.committed){const members=Object.values(r.snapshot.val()||{}).filter(p=>p&&p.sp!=null);claimed=id;db.ref('rooms/'+id+'/players/'+acc.uid).onDisconnect().remove();return{id,n:members.length-1,team:r.snapshot.child(acc.uid).val().team,fresh:members.length===1,queueStartedAt:mode==='team'?Math.min(...members.map(p=>Number(p.joinedAt)||Date.now()+serverOffset)):0}}}catch(e){return 'err'}
}return null}
async function waitTeamQueue(room){const base='rooms/'+room.id,queuedAt=room.queueStartedAt||Math.round(Date.now()+serverOffset);
while(!cancel){const now=Date.now()+serverOffset,players=(await db.ref(base+'/players').once('value')).val()||{},count=Object.values(players).filter(p=>p&&p.sp!=null).length,left=Math.max(0,Math.ceil((queuedAt+30000-now)/1000));$('mmt').textContent=`Đang ghép đội · Còn ${left} giây · ${count}/14 người`;if(left<=0)break;await new Promise(resolve=>setTimeout(resolve,Math.min(1000,left*1000)))}
if(cancel)return false;const startedAt=Math.round(queuedAt+30000);await db.ref(base+'/teamMatch/startedAt').transaction(v=>{const now=Date.now()+serverOffset;return !v||now-v>=300000?startedAt:v});return true}
async function matchmaking(mode){if(!db){toast('Không có kết nối → chơi luyện tập');return play(null)}
if(!pf.owned.includes(sel)){toast('Hãy mở khóa nhện này trước!');return}
acc.name=($('ln').value||'Bạn').trim().slice(0,14);
cancel=false;$('mm2').style.display='flex';$('mmt').textContent=mode==='team'?'Đang tìm trận đấu đội...':'Đang tìm trận...';
const [r]=await Promise.all([claimRoom(mode),new Promise(x=>setTimeout(x,1100))]);
if(cancel){unclaim();return}
if(r==='err'){$('mm2').style.display='none';toast('Lỗi kết nối (kiểm tra Rules)');return}
if(!r){$('mm2').style.display='none';toast('Tất cả phòng đã đầy!');return}
if(mode==='team'){try{if(!await waitTeamQueue(r)){unclaim();return}const players=(await db.ref('rooms/'+r.id+'/players').once('value')).val()||{};r.n=Math.max(0,Object.keys(players).length-1)}catch(e){$('mm2').style.display='none';unclaim();toast('Lỗi kết nối khi ghép đội');return}if(cancel){unclaim();return}}
 $('mmt').innerHTML=`Đã tìm thấy trận<br><small style="opacity:.75">${mode==='team'?'Đội '+(r.team===1?'Đỏ':'Xanh')+' · ':''}Phòng ${r.id.slice(1)} · ${r.n} người chơi khác${mode==='team'?' · '+Math.max(0,13-r.n)+' bot':''}</small>`;
await new Promise(x=>setTimeout(x,900));if(cancel){unclaim();return}
$('mm2').style.display='none';claimed=null;play(Object.assign(r,{mode}))}
function matchTeam(){matchmaking('team')}
$('mmc').onclick=()=>{cancel=true;unclaim();$('mm2').style.display='none'};
function endRun(){if(!P||P.paid)return;P.paid=1;pf.kills+=P.kills;pf.best=Math.max(pf.best,P.lvl);const n=P.tot/40|0;n?earn(n):saveP()}
$('s_r').onclick=()=>{closeSt();if(playing){endRun();leaveNet();playing=false;$('rb').style.display='none';lob(true)}};

// ---------- online sync
const on=(r,e,f)=>{r.on(e,f);refs.push([r,e,f])};
function joinNet(room){const id=room.id||room;rid=id;RM={};BM={};role=null;joinT=performance.now();bsT=0;const R_=db.ref('rooms/'+id),pl=R_.child('players');bindBots(R_);pl.child(acc.uid).onDisconnect().remove();
if(teamMode){R_.child('teamMatch/startedAt').once('value').then(s=>{if(!rid||rid!==id)return;teamStart=Number(s.val())||0;teamRoundKey=String(teamStart);on(R_.child('teamMatch/rounds/'+teamRoundKey+'/scores'),'value',v=>{teamScores=Object.assign({red:0,blue:0},v.val()||{});updateTeamHud()});updateTeamHud()}).catch(()=>toast('Không đồng bộ được trận đấu đội'))}
on(pl,'child_added',addRem);on(pl,'child_changed',addRem);
on(pl,'child_removed',s=>{const o=RM[s.key];if(o){o.alive=false;delete RM[s.key]}});
on(R_.child('dmg/'+acc.uid),'child_added',s=>{const v=s.val();s.ref.remove();if(P&&P.alive&&v)hurt(P,v.d,{name:v.fn,uid:v.id||v.f,team:v.team})});
on(R_.child('kills/'+acc.uid),'child_added',s=>{const v=s.val();s.ref.remove();if(P&&P.alive&&v){gainXP(P,30+v.l*22+v.t*.25);P.kills++;feed(`${P.name} ⚔ ${v.n}`);toast('HẠ GỤC '+String(v.n).toUpperCase()+'!');earn(10+v.l*3)}})}
function leaveNet(){refs.forEach(([r,e,f])=>r.off(e,f));refs=[];if(rid&&db)db.ref('rooms/'+rid+'/players/'+acc.uid).remove().catch(()=>{});Object.values(RM).forEach(o=>o.alive=false);Object.values(BM).forEach(o=>o.alive=false);if(rid&&db){const br=db.ref('rooms/'+rid+'/bots');if(role=='host')br.remove().catch(()=>{});br.onDisconnect().cancel()}RM={};BM={};role=null;rid=null}
function addRem(s){const v=s.val();if(s.key===acc.uid||!v||v.sp==null)return;let o=RM[s.key];
if(!o){o=mk(v.sp,false,v.name);o.remote=true;o.uid=s.key;o.x=v.x;o.y=v.y;o.a=v.a;o.lvl=v.l;stats(o);initLegs(o);o.bc=v.b;RM[s.key]=o;o.seen=performance.now();spiders.push(o)}o.team=v.team;if(o.lk!==v.k||o.away!==!!v.away){o.lk=v.k;o.away=!!v.away;o.seen=performance.now()}o.tg=v}
function remStep(s,dt){const v=s.tg;if(!v)return;const age=Math.min(.12,Math.max(0,(performance.now()-(s.seen||performance.now()))/1000)),tx=v.x+(v.vx||0)*age,ty=v.y+(v.vy||0)*age,k=1-Math.exp(-dt*13);s.x+=(tx-s.x)*k;s.y+=(ty-s.y)*k;s.a+=ad(s.a,v.a)*Math.min(1,dt*14);s.vx=v.vx;s.vy=v.vy;
if(v.l!==s.lvl){s.lvl=v.l;stats(s)}s.hp=v.h;s.mh=v.m;s.tot=v.t;if(v.b!==s.bc){s.bc=v.b;s.bite=.2}updLegs(s,dt)}

// ---------- đồng bộ BOT: 1 người làm chủ phòng (host) chạy bot, người khác chỉ nhận & hiển thị
// host = uid nhỏ nhất trong phòng; host rời đi thì người kế tiếp tự lên làm host
function bindBots(R_){
on(R_.child('bots'),'value',snap=>{if(role=='host')return;const v=snap.val()||{};
for(const k in v){const d=v[k];let o=BM[k];if(!o){o=mk(d.sp,false,d.name);o.remote=true;o.rbot=true;o.bid=k;o.uid='bot:'+k;o.x=d.x;o.y=d.y;o.a=d.a;o.lvl=d.l;stats(o);initLegs(o);o.bc=d.b;BM[k]=o;spiders.push(o)}o.team=d.team;o.tg=d;o.seen=performance.now()}
for(const k in BM)if(!v[k]){const o=BM[k];o.hp=0;delete BM[k];kill(o,null)}});
on(R_.child('botdmg'),'child_added',snap=>{const v=snap.val();snap.ref.remove();if(role!='host'||!v)return;
const b=spiders.find(x=>x.bot&&x.bid===v.b&&x.alive);if(b)hurt(b,v.d,RM[v.f]||{name:v.fn,uid:v.f,team:v.team})})}
function setRole(nr){role=nr;const br=db.ref('rooms/'+rid+'/bots');
if(nr=='host'){br.onDisconnect().remove();for(const k in BM){const o=BM[k],v=o.tg||{};o.alive=false;const b=mk(o.sp,true,o.name);b.bid=k;b.team=o.team||v.team;b.x=o.x;b.y=o.y;b.a=o.a;b.lvl=o.lvl;stats(b);b.hp=Math.min(b.mh,v.h||b.mh);b.tot=v.t||0;b.inv=.5;initLegs(b);spiders.push(b)}BM={};NB=Math.max(0,(teamMode?14:15)-(1+Object.keys(RM).length));
for(let i=spiders.filter(x=>x.bot&&x.alive).length;i<NB;i++)spawnBot(true);feed('👑 Bạn là chủ phòng (điều khiển bot)')}
else br.onDisconnect().cancel()}
function botTick(dt){if(performance.now()-joinT<1500)return;
const now=performance.now(),nr=Object.values(RM).filter(o=>!o.away&&now-o.seen<3000).map(o=>o.uid).concat(acc.uid).sort()[0]===acc.uid?'host':'guest';if(nr!==role)setRole(nr);
if(role=='host'){NB=Math.max(0,(teamMode?14:15)-(1+Object.keys(RM).length));let nb=spiders.filter(x=>x.bot&&x.alive);if(nb.length>NB){const w=nb.reduce((p,q)=>(q.lvl-p.lvl||q.tot-p.tot)<0?q:p);kill(w,null);nb=spiders.filter(x=>x.bot&&x.alive)}while(nb.length<NB){spawnBot(true);nb=spiders.filter(x=>x.bot&&x.alive)}
bsT-=dt;if(bsT<=0){bsT=.1;const o={};for(const x of nb)if(x.bid&&x.alive)o[x.bid]={sp:x.sp,name:x.name,x:x.x|0,y:x.y|0,a:+x.a.toFixed(2),vx:x.vx|0,vy:x.vy|0,l:x.lvl,h:x.hp|0,m:x.mh|0,t:x.tot|0,b:x.bcn||0,team:x.team||null};db.ref('rooms/'+rid+'/bots').set(o).catch(()=>{})}}
else{NB=0;for(const x of spiders)if(x.bot&&!x.remote&&x.alive)x.alive=false}}

// dữ liệu người chơi gửi lên; k = nhịp tim (tăng mỗi lần ghi) để người khác biết tab này còn chạy
function meData(extra){return Object.assign({sp:P.sp,name:P.name,x:P.x|0,y:P.y|0,a:+P.a.toFixed(2),vx:P.vx|0,vy:P.vy|0,l:P.lvl,h:P.hp|0,m:P.mh|0,t:P.tot|0,b:bc,k:++hbk,team:P.team||null},extra)}
// ---------- ghi đè (wrap) các hàm gốc để thêm logic online
const _h=hurt;hurt=function(t,d,s){if(teamMode&&t.team&&s&&s.team===t.team)return;if(t.remote){if(!rid||!t.alive)return;
if(s===P){db.ref('rooms/'+rid+'/'+(t.rbot?'botdmg':'dmg/'+t.uid)).push(t.rbot?{b:t.bid,d:Math.round(d),f:acc.uid,fn:P.name,team:P.team}:{d:Math.round(d),f:acc.uid,fn:P.name,team:P.team});t.hit=.14;if(CFG.dmg)texts.push({x:t.x,y:t.y-17*t.sz,l:.8,s:Math.round(d),c:'#ffe066'})}
else if(role=='host'&&s&&s.bot&&!s.remote&&!t.rbot){db.ref('rooms/'+rid+'/dmg/'+t.uid).push({d:Math.round(d),f:'',fn:s.name,team:s.team,id:'bot:'+s.bid});t.hit=.14}
return}_h(t,d,s)};
function addTeamScore(team){if(!teamMode||!rid||!teamRoundKey)return;const key=team===1?'red':'blue';db.ref('rooms/'+rid+'/teamMatch/rounds/'+teamRoundKey+'/scores/'+key).transaction(v=>(v||0)+1).catch(()=>{})}
function recordRoundKill(s){if(!teamMode||!rid||!teamRoundKey||!s)return;const uid=s===P?acc.uid:(s.uid||(s.bot&&s.bid?'bot:'+s.bid:null));if(!uid)return;const ref=db.ref('rooms/'+rid+'/teamMatch/rounds/'+teamRoundKey+'/players/'+uid),name=s===P?P.name:(s.name||'Nhện'),team=s.team||0;roundWrites.push(ref.transaction(current=>{current=current||{};current.kills=(Number(current.kills)||0)+1;current.name=name;current.team=team;current.bot=uid.startsWith('bot:');return current}).catch(()=>{}))}
function updateTeamHud(){if(!teamMode)return;$('scoreRed').textContent=teamScores.red|0;$('scoreBlue').textContent=teamScores.blue|0;$('teamHud').style.display='flex'}
function teamTick(){if(!teamMode||!teamStart||teamFinished)return;const left=Math.max(0,300000-(Date.now()+serverOffset-teamStart));$('teamClock').textContent=`${String(Math.ceil(left/1000/60)|0).padStart(2,'0')}:${String(Math.ceil(left/1000)%60).toString().padStart(2,'0')}`;if(left<=0)finishTeamMatch()}
function resultText(tag,className,text){const el=document.createElement(tag);el.className=className;el.textContent=text;return el}
function showTeamResults(players,scores){const red=scores.red|0,blue=scores.blue|0,winner=red===blue?0:red>blue?1:2,names=['HÒA','ĐỘI ĐỎ CHIẾN THẮNG','ĐỘI XANH CHIẾN THẮNG'];$('resultTeam').textContent=winner?`NHÀ VÔ ĐỊCH · ${winner===1?'ĐỘI ĐỎ':'ĐỘI XANH'}`:'TRẬN ĐẤU CÂN TÀI';$('resultTitle').textContent=names[winner];$('resultSubtitle').textContent=winner?'Năm phút giao tranh. Một đội đã vươn lên dẫn đầu.':'Hai đội ngang tài sau 5 phút thi đấu.';$('finalRed').textContent=red;$('finalBlue').textContent=blue;
const podium=$('resultPodium');podium.replaceChildren();for(let i=0;i<3;i++){const entry=players[i]||{name:'Chưa xếp hạng',kills:0,team:0},card=resultText('article',`podium-place place-${i+1}`,''),medal=resultText('span','podium-medal',['♛','Ⅱ','Ⅲ'][i]),team=resultText('span',`podium-team ${entry.team===1?'team-red':entry.team===2?'team-blue':''}`,entry.team===1?'ĐỘI ĐỎ':entry.team===2?'ĐỘI XANH':'—'),name=resultText('strong','podium-name',entry.name),kills=resultText('span','podium-kills',`${entry.kills|0} HẠ GỤC`);card.append(medal,team,name,kills);podium.appendChild(card)}
const list=$('resultRanking');list.replaceChildren();players.forEach((entry,i)=>{const row=document.createElement('div');row.className=`ranking-row${i<3?' ranking-top':''}`;row.append(resultText('span','ranking-place',String(i+1).padStart(2,'0')),resultText('strong','ranking-name',entry.name),resultText('span',`ranking-team ${entry.team===1?'team-red':entry.team===2?'team-blue':''}`,entry.team===1?'ĐỎ':entry.team===2?'XANH':'—'),resultText('b','ranking-kills',entry.kills|0));list.appendChild(row)});
const confetti=$('resultConfetti');confetti.replaceChildren();for(let i=0;i<34;i++){const bit=document.createElement('i');bit.className='result-confetti';bit.style.setProperty('--x',`${(i*47+13)%100}%`);bit.style.setProperty('--delay',`${(i%9)*-.37}s`);bit.style.setProperty('--hue',`${(i*59)%360}`);confetti.appendChild(bit)}$('teamResult').classList.add('show');$('teamResult').setAttribute('aria-hidden','false')}
async function finishTeamMatch(){if(teamFinished)return;teamFinished=true;playing=false;endRun();const matchId=rid,roundKey=teamRoundKey;let players=[],scores=Object.assign({},teamScores);try{await Promise.all(roundWrites);if(matchId&&roundKey){const base=db.ref(`rooms/${matchId}/teamMatch/rounds/${roundKey}`),[people,team]=await Promise.all([base.child('players').once('value'),base.child('scores').once('value')]);players=Object.entries(people.val()||{}).map(([id,p])=>({id,name:p.name||'Nhện',team:p.team||0,kills:p.kills|0,bot:!!p.bot}));scores=Object.assign(scores,team.val()||{})}}catch(e){console.warn('Không tải được bảng xếp hạng',e)}if(!players.length&&P)players=[{name:P.name,team:P.team||0,kills:P.kills|0}];players.sort((a,b)=>b.kills-a.kills);leaveNet();teamMode=false;window.TEAM_MATCH=false;$('teamHud').style.display='none';$('hud').classList.add('off');showTeamResults(players,scores)}
setInterval(()=>teamMode&&teamTick(),250);
$('resultLobby').onclick=()=>{$('teamResult').classList.remove('show');$('teamResult').setAttribute('aria-hidden','true');lob(true)};
const _k=kill;kill=function(t,s){if(t.bot&&!t.remote&&t.alive&&rid&&role=='host'&&s&&s.remote&&!s.rbot&&s.uid)db.ref('rooms/'+rid+'/kills/'+s.uid).push({n:t.name,l:t.lvl,t:t.tot|0});if(t===P&&rid&&t.alive&&t.lastHit&&t.lastHit.uid)db.ref('rooms/'+rid+'/kills/'+t.lastHit.uid).push({n:t.name,l:t.lvl,t:t.tot|0});const w=t.alive;_k(t,s);if(!w)return;if(teamMode&&s&&s.team&&s.team!==t.team){addTeamScore(s.team);recordRoundKill(s)}if(s===P)earn(5+t.lvl*2);if(t===P&&!teamMode){setTimeout(endRun,900);if(rid)setTimeout(leaveNet,900)}};
const _b=bite;bite=function(s){const c=s.cd.b;_b(s);if(s===P&&c<=0&&s.cd.b>0)bc++;else if(s.bot&&c<=0&&s.cd.b>0)s.bcn=(s.bcn||0)+1};
const _sb=spawnBot;spawnBot=function(i){_sb(i);const b=spiders[spiders.length-1];if(b&&b.bot){b.bid='b'+Date.now().toString(36)+(++bseq);if(teamMode){const red=spiders.filter(x=>x.alive&&x.team===1).length,blue=spiders.filter(x=>x.alive&&x.team===2).length;b.team=red<=blue?1:2}}};
const _us=updSpider;updSpider=function(s,dt){if(s.remote){for(const k of['bite','hit'])s[k]=Math.max(0,s[k]-dt);remStep(s,dt);return}_us(s,dt)};
const _u=update;update=function(dt){_u(dt);if(teamMode)teamTick();if(!rid||!P)return;sendT-=dt;
if(sendT<=0&&P.alive){sendT=.1;db.ref('rooms/'+rid+'/players/'+acc.uid).set(meData()).catch(()=>{})}
botTick(dt)};
addEventListener('pagehide',leaveNet);
db&&db.ref('.info/serverTimeOffset').on('value',s=>{serverOffset=s.val()||0});
// Tab bị ẩn -> báo "away" ngay để người khác tiếp quản host; tab hiện lại -> chờ bầu lại, tránh 2 host cùng lúc
document.addEventListener('visibilitychange',()=>{if(!rid||!db||!P||!P.alive)return;
if(document.hidden)db.ref('rooms/'+rid+'/players/'+acc.uid).set(meData({away:1})).catch(()=>{});
else{joinT=performance.now();if(role=='host'&&Object.keys(RM).length){for(const x of spiders)if(x.bot&&!x.remote)x.alive=false;role=null}}});
setSel(0);lob(true);
});