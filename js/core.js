// ===== CORE: tiện ích, canvas, cấu hình, trạng thái toàn cục =====
const $=id=>document.getElementById(id),C=$('g'),X=C.getContext('2d'),R=Math.random,TAU=Math.PI*2,rr=(a,b)=>a+R()*(b-a);
const ad=(a,b)=>{let d=(b-a)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d};
let W,H,DPR;function rs(){DPR=Math.min(devicePixelRatio||1,2);const rotated=document.documentElement.classList.contains('force-landscape');W=rotated?innerHeight:innerWidth;H=rotated?innerWidth:innerHeight;C.width=W*DPR;C.height=H*DPR}addEventListener('resize',rs);rs();
const WS=5000,CDM={b:.3,q:4.5,e:6,r:12},DF=[.75,1,1.3];let NB=20;const CFG={q:1,zoom:1,bots:20,diff:1,names:1,dmg:1,shake:1,audio:1,mm:1,fps:0};try{Object.assign(CFG,JSON.parse(localStorage.getItem('spcfg')||'{}'))}catch(e){}NB=CFG.bots;

const LL=62,LEG=[[1.35,.7],[.7,1.2],[-.15,1.3],[-1.05,1.0]],HAIR=Array.from({length:70},()=>[rr(0,TAU),Math.sqrt(R()),rr(.15,.3)]);
let spiders=[],P=null,foods=[],projs=[],zones=[],silks=[],fxs=[],parts=[],texts=[],T=0,playing=false,sel=0,shk=0,bt=0,lbT=0,focus=null;
const cam={x:WS/2,y:WS/2,z:1},mouse={x:0,y:0,down:false};
