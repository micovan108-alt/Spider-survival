// ===== ONLINE ADD-ON: sảnh, cửa hàng, đăng nhập Google, ghép trận, đồng bộ realtime =====
// Cần: firebase-config.js (const FB) và toàn bộ module game đã nạp xong.
addEventListener('load',()=>{
const PR=[0,400,600,700,900,1100,1300],fresh=()=>({coins:100,owned:[0],kills:0,best:1,day:''}); // PR = giá mở khóa từng loài nhện (theo thứ tự SP)
const gid=localStorage.gid||(localStorage.gid='g'+Math.random().toString(36).slice(2,10));
let acc={uid:gid,name:localStorage.gname||'Bạn',google:false},pf=fresh(),db=null,rid=null,refs=[],RM={},sendT=0,bc=0,cancel=false,pvS=null,BM={},role=null,joinT=0,bseq=0,bsT=0,hbk=0;
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
<div class="glass match-panel"><div class="eyebrow">TRẬN ĐẤU</div><h2 class="panel-title">Sẵn sàng vào trận</h2><div id="rb"></div><label class="field-label" for="ln">TÊN HIỂN THỊ</label><input id="ln" maxlength="14"><button class="big" id="bm">TÌM TRẬN ONLINE</button><p class="help-text">Ghép trận tự động · tối đa 15 người chơi và bot</p><button class="big" id="bo">LUYỆN TẬP OFFLINE</button><button class="big" id="dl"></button><div id="stt" class="lobby-metrics"></div></div></div>
<div class="main" id="ts" style="display:none"></div></div>
<div id="mm2" style="display:none;position:fixed;inset:0;z-index:12;background:#000d;align-items:center;justify-content:center;flex-direction:column;gap:18px;color:#fff;font-family:Bahnschrift,Segoe UI,sans-serif"><div class="spn"></div><div id="mmt" style="font:700 20px Bahnschrift,Segoe UI,sans-serif;text-align:center"></div><button class="mb" id="mmc">HỦY</button></div>`);
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
NB=room?0:CFG.bots;start();lob(false);if(room)joinNet(room)}
$('bo').onclick=()=>play(null);
// Giữ chỗ nguyên tử bằng transaction: 2 người ghép cùng lúc không thể vượt quá 15 và luôn vào cùng phòng đông nhất còn chỗ
let claimed=null;
function unclaim(){if(claimed&&db){db.ref('rooms/'+claimed+'/players/'+acc.uid).remove().catch(()=>{});claimed=null}}
async function claimRoom(){
for(let t=0;t<4;t++){
let d={};try{d=(await db.ref('rooms').once('value')).val()||{}}catch(e){return 'err'}
const cand=[];for(let i=1;i<=6;i++){const n=Object.keys((d['r'+i]||{}).players||{}).length;if(n<15)cand.push(['r'+i,n])}
cand.sort((x,y)=>y[1]-x[1]); // phòng đông nhất trước; hòa thì giữ thứ tự r1,r2...
if(!cand.length)return null;
const id=cand[0][0],seed={sp:sel,name:acc.name,x:2500,y:2500,a:0,vx:0,vy:0,l:1,h:100,m:100,t:0,b:0};
try{const r=await db.ref('rooms/'+id+'/players').transaction(cur=>{cur=cur||{};if(!cur[acc.uid]&&Object.keys(cur).length>=15)return;cur[acc.uid]=seed;return cur});
if(r.committed){claimed=id;db.ref('rooms/'+id+'/players/'+acc.uid).onDisconnect().remove();return{id,n:Object.keys(r.snapshot.val()||{}).length-1}}}catch(e){return 'err'}
}return null}
$('bm').onclick=async()=>{if(!db){toast('Không có kết nối → chơi luyện tập');return play(null)}
if(!pf.owned.includes(sel)){toast('Hãy mở khóa nhện này trước!');return}
acc.name=($('ln').value||'Bạn').trim().slice(0,14);
cancel=false;$('mm2').style.display='flex';$('mmt').textContent='Đang tìm trận...';
const [r]=await Promise.all([claimRoom(),new Promise(x=>setTimeout(x,1100))]);
if(cancel){unclaim();return}
if(r==='err'){$('mm2').style.display='none';toast('Lỗi kết nối (kiểm tra Rules)');return}
if(!r){$('mm2').style.display='none';toast('Tất cả phòng đã đầy!');return}
$('mmt').innerHTML=`Đã tìm thấy trận<br><small style="opacity:.75">Phòng ${r.id.slice(1)} · ${r.n} người chơi khác · bot yếu nhất sẽ nhường chỗ</small>`;
await new Promise(x=>setTimeout(x,900));if(cancel){unclaim();return}
$('mm2').style.display='none';claimed=null;play(r.id)};
$('mmc').onclick=()=>{cancel=true;unclaim();$('mm2').style.display='none'};
function endRun(){if(!P||P.paid)return;P.paid=1;pf.kills+=P.kills;pf.best=Math.max(pf.best,P.lvl);const n=P.tot/40|0;n?earn(n):saveP()}
$('s_r').onclick=()=>{closeSt();if(playing){endRun();leaveNet();playing=false;$('rb').style.display='none';lob(true)}};

// ---------- online sync
const on=(r,e,f)=>{r.on(e,f);refs.push([r,e,f])};
function joinNet(id){rid=id;RM={};BM={};role=null;joinT=performance.now();bsT=0;const R_=db.ref('rooms/'+id),pl=R_.child('players');bindBots(R_);pl.child(acc.uid).onDisconnect().remove();
on(pl,'child_added',addRem);on(pl,'child_changed',addRem);
on(pl,'child_removed',s=>{const o=RM[s.key];if(o){o.alive=false;delete RM[s.key]}});
on(R_.child('dmg/'+acc.uid),'child_added',s=>{const v=s.val();s.ref.remove();if(P&&P.alive&&v)hurt(P,v.d,{name:v.fn,uid:v.f})});
on(R_.child('kills/'+acc.uid),'child_added',s=>{const v=s.val();s.ref.remove();if(P&&P.alive&&v){gainXP(P,30+v.l*22+v.t*.25);P.kills++;feed(`${P.name} ⚔ ${v.n}`);toast('HẠ GỤC '+String(v.n).toUpperCase()+'!');earn(10+v.l*3)}})}
function leaveNet(){refs.forEach(([r,e,f])=>r.off(e,f));refs=[];if(rid&&db)db.ref('rooms/'+rid+'/players/'+acc.uid).remove().catch(()=>{});Object.values(RM).forEach(o=>o.alive=false);Object.values(BM).forEach(o=>o.alive=false);if(rid&&db){const br=db.ref('rooms/'+rid+'/bots');if(role=='host')br.remove().catch(()=>{});br.onDisconnect().cancel()}RM={};BM={};role=null;rid=null}
function addRem(s){const v=s.val();if(s.key===acc.uid||!v||v.sp==null)return;let o=RM[s.key];
if(!o){o=mk(v.sp,false,v.name);o.remote=true;o.uid=s.key;o.x=v.x;o.y=v.y;o.a=v.a;o.lvl=v.l;stats(o);initLegs(o);o.bc=v.b;RM[s.key]=o;o.seen=performance.now();spiders.push(o)}if(o.lk!==v.k||o.away!==!!v.away){o.lk=v.k;o.away=!!v.away;o.seen=performance.now()}o.tg=v}
function remStep(s,dt){const v=s.tg;if(!v)return;const k=Math.min(1,dt*10);s.x+=(v.x-s.x)*k;s.y+=(v.y-s.y)*k;s.a+=ad(s.a,v.a)*Math.min(1,dt*14);s.vx=v.vx;s.vy=v.vy;
if(v.l!==s.lvl){s.lvl=v.l;stats(s)}s.hp=v.h;s.mh=v.m;s.tot=v.t;if(v.b!==s.bc){s.bc=v.b;s.bite=.2}updLegs(s,dt)}

// ---------- đồng bộ BOT: 1 người làm chủ phòng (host) chạy bot, người khác chỉ nhận & hiển thị
// host = uid nhỏ nhất trong phòng; host rời đi thì người kế tiếp tự lên làm host
function bindBots(R_){
on(R_.child('bots'),'value',snap=>{if(role=='host')return;const v=snap.val()||{};
for(const k in v){const d=v[k];let o=BM[k];if(!o){o=mk(d.sp,false,d.name);o.remote=true;o.rbot=true;o.bid=k;o.uid='bot:'+k;o.x=d.x;o.y=d.y;o.a=d.a;o.lvl=d.l;stats(o);initLegs(o);o.bc=d.b;BM[k]=o;spiders.push(o)}o.tg=d}
for(const k in BM)if(!v[k]){const o=BM[k];o.hp=0;delete BM[k];kill(o,null)}});
on(R_.child('botdmg'),'child_added',snap=>{const v=snap.val();snap.ref.remove();if(role!='host'||!v)return;
const b=spiders.find(x=>x.bot&&x.bid===v.b&&x.alive);if(b)hurt(b,v.d,RM[v.f]||{name:v.fn})})}
function setRole(nr){role=nr;const br=db.ref('rooms/'+rid+'/bots');
if(nr=='host'){br.onDisconnect().remove();for(const k in BM){const o=BM[k],v=o.tg||{};o.alive=false;const b=mk(o.sp,true,o.name);b.bid=k;b.x=o.x;b.y=o.y;b.a=o.a;b.lvl=o.lvl;stats(b);b.hp=Math.min(b.mh,v.h||b.mh);b.tot=v.t||0;b.inv=.5;initLegs(b);spiders.push(b)}BM={};NB=Math.max(0,15-(1+Object.keys(RM).length));
for(let i=spiders.filter(x=>x.bot&&x.alive).length;i<NB;i++)spawnBot(true);feed('👑 Bạn là chủ phòng (điều khiển bot)')}
else br.onDisconnect().cancel()}
function botTick(dt){if(performance.now()-joinT<1500)return;
const now=performance.now(),nr=Object.values(RM).filter(o=>!o.away&&now-o.seen<3000).map(o=>o.uid).concat(acc.uid).sort()[0]===acc.uid?'host':'guest';if(nr!==role)setRole(nr);
if(role=='host'){NB=Math.max(0,15-(1+Object.keys(RM).length));const nb=spiders.filter(x=>x.bot&&x.alive);if(nb.length>NB){const w=nb.reduce((p,q)=>(q.lvl-p.lvl||q.tot-p.tot)<0?q:p);kill(w,null)}
bsT-=dt;if(bsT<=0){bsT=.1;const o={};for(const x of nb)if(x.bid&&x.alive)o[x.bid]={sp:x.sp,name:x.name,x:x.x|0,y:x.y|0,a:+x.a.toFixed(2),vx:x.vx|0,vy:x.vy|0,l:x.lvl,h:x.hp|0,m:x.mh|0,t:x.tot|0,b:x.bcn||0};db.ref('rooms/'+rid+'/bots').set(o).catch(()=>{})}}
else{NB=0;for(const x of spiders)if(x.bot&&!x.remote&&x.alive)x.alive=false}}

// dữ liệu người chơi gửi lên; k = nhịp tim (tăng mỗi lần ghi) để người khác biết tab này còn chạy
function meData(extra){return Object.assign({sp:P.sp,name:P.name,x:P.x|0,y:P.y|0,a:+P.a.toFixed(2),vx:P.vx|0,vy:P.vy|0,l:P.lvl,h:P.hp|0,m:P.mh|0,t:P.tot|0,b:bc,k:++hbk},extra)}
// ---------- ghi đè (wrap) các hàm gốc để thêm logic online
const _h=hurt;hurt=function(t,d,s){if(t.remote){if(!rid||!t.alive)return;
if(s===P){db.ref('rooms/'+rid+'/'+(t.rbot?'botdmg':'dmg/'+t.uid)).push(t.rbot?{b:t.bid,d:Math.round(d),f:acc.uid,fn:P.name}:{d:Math.round(d),f:acc.uid,fn:P.name});t.hit=.14;if(CFG.dmg)texts.push({x:t.x,y:t.y-17*t.sz,l:.8,s:Math.round(d),c:'#ffe066'})}
else if(role=='host'&&s&&s.bot&&!s.remote&&!t.rbot){db.ref('rooms/'+rid+'/dmg/'+t.uid).push({d:Math.round(d),f:'',fn:s.name});t.hit=.14}
return}_h(t,d,s)};
const _k=kill;kill=function(t,s){if(t.bot&&!t.remote&&t.alive&&rid&&role=='host'&&s&&s.remote&&!s.rbot&&s.uid)db.ref('rooms/'+rid+'/kills/'+s.uid).push({n:t.name,l:t.lvl,t:t.tot|0});if(t===P&&rid&&t.alive&&t.lastHit&&t.lastHit.uid)db.ref('rooms/'+rid+'/kills/'+t.lastHit.uid).push({n:t.name,l:t.lvl,t:t.tot|0});const w=t.alive;_k(t,s);if(!w)return;if(s===P)earn(5+t.lvl*2);if(t===P){setTimeout(endRun,900);if(rid)setTimeout(leaveNet,900)}};
const _b=bite;bite=function(s){const c=s.cd.b;_b(s);if(s===P&&c<=0&&s.cd.b>0)bc++;else if(s.bot&&c<=0&&s.cd.b>0)s.bcn=(s.bcn||0)+1};
const _sb=spawnBot;spawnBot=function(i){_sb(i);const b=spiders[spiders.length-1];if(b&&b.bot)b.bid='b'+Date.now().toString(36)+(++bseq)};
const _us=updSpider;updSpider=function(s,dt){if(s.remote){for(const k of['bite','hit'])s[k]=Math.max(0,s[k]-dt);remStep(s,dt);return}_us(s,dt)};
const _u=update;update=function(dt){_u(dt);if(!rid||!P)return;sendT-=dt;
if(sendT<=0&&P.alive){sendT=.1;db.ref('rooms/'+rid+'/players/'+acc.uid).set(meData()).catch(()=>{})}
botTick(dt)};
addEventListener('pagehide',leaveNet);
// Tab bị ẩn -> báo "away" ngay để người khác tiếp quản host; tab hiện lại -> chờ bầu lại, tránh 2 host cùng lúc
document.addEventListener('visibilitychange',()=>{if(!rid||!db||!P||!P.alive)return;
if(document.hidden)db.ref('rooms/'+rid+'/players/'+acc.uid).set(meData({away:1})).catch(()=>{});
else{joinT=performance.now();if(role=='host'&&Object.keys(RM).length){for(const x of spiders)if(x.bot&&!x.remote)x.alive=false;role=null}}});
setSel(0);lob(true);
});