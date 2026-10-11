// ===== AUDIO: âm thanh tổng hợp bằng Web Audio, không cần asset ngoài =====
let audioCtx=null,audioNoise=null;const activeClips=new Set(),AUDIO_RANGE=1100,backgroundMusic=new Audio(new URL('audio/nhac_nen.mp3',document.baseURI).href);
backgroundMusic.loop=true;backgroundMusic.volume=.22;
function syncBackgroundMusic(){if(playing&&!paused&&CFG.audio){if(backgroundMusic.paused)backgroundMusic.play().catch(()=>{})}else if(!backgroundMusic.paused)backgroundMusic.pause()}
const spellSounds={
'0e':{notes:[520,260,610],wave:'square',step:.055,noise:.035,filter:1800,duration:.2},
'0r':{notes:[115,165,125,90],wave:'sawtooth',step:.08,noise:.12,filter:550,duration:.38},
'1e':{notes:[105,62],wave:'triangle',step:.08,noise:.2,filter:420,duration:.28},
'1r':{notes:[980,720,1180,840,1350],wave:'square',step:.025,noise:.08,filter:2800,duration:.2},
'2e':{notes:[210,320,470,660,880],wave:'sawtooth',step:.045,noise:.07,filter:1900,duration:.34},
'2r':{notes:[180,420,880,340],wave:'sine',step:.06,noise:.18,filter:1500,duration:.34},
'3e':{notes:[760,330,690],wave:'triangle',step:.07,noise:.045,filter:1400,duration:.27},
'3r':{notes:[125,95,75,250],wave:'sine',step:.09,noise:.1,filter:650,duration:.4},
'4e':{notes:[880,1320,1760],wave:'sine',step:.065,noise:.025,filter:3800,duration:.28},
'4r':{notes:[660,990,1320,1760],wave:'sine',step:.055,noise:.08,filter:3400,duration:.38},
'5e':{notes:[185,460,120,75],wave:'sawtooth',step:.045,noise:.22,filter:1150,duration:.34},
'5r':{notes:[90,130,82,120],wave:'sawtooth',step:.09,noise:.24,filter:800,duration:.48},
'6e':{notes:[430,780,390],wave:'triangle',step:.06,noise:.025,filter:2100,duration:.27},
'6r':{notes:[165,285,110],wave:'triangle',step:.085,noise:.13,filter:900,duration:.38}
};
const spellFiles={
'0e':'dan_doc.mp3','0r':'may_doc.mp3',
'1r':'mua_long.mp3',
'2e':'luoi_cua_xoay.mp3',
'3e':'bay_to.mp3','3r':'hut_hon.mp3',
'4e':'manh_bang.mp3','4r':'bao_tuyet.mp3',
'5e':'cau_lua.mp3','5r':'dia_nguc_lua.mp3',
'6e':'to_keo.mp3'
};
const soundFiles={death:'nhen_chet.mp3',q:'toc_bien.mp3'};
function audioLevel(source){
const dx=(source?.x??P?.x??0)-(P?.x??0),dy=(source?.y??P?.y??0)-(P?.y??0),distance=Math.hypot(dx,dy);return{attenuation:Math.pow(Math.max(0,1-distance/AUDIO_RANGE),1.6),pan:Math.max(-1,Math.min(1,dx/500))}
}
function audioMix(source,volume=1){
const level=audioLevel(source),input=audioCtx.createGain(),pan=audioCtx.createStereoPanner();input.gain.value=level.attenuation*volume;pan.pan.value=level.pan;input.connect(pan);pan.connect(audioCtx.destination);return{input,pan,attenuation:level.attenuation}
}
function soundFx(name,spiderIndex=-1,skillKey='',source=P){
if(!CFG.audio||!playing)return;
const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;
if(!audioCtx){audioCtx=new AudioContextClass();audioNoise=audioCtx.createBuffer(1,audioCtx.sampleRate*.18,audioCtx.sampleRate);const data=audioNoise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1}
if(audioCtx.state==='suspended')audioCtx.resume();
if(audioLevel(source).attenuation<=.001)return;
const file=name==='spell'?spellFiles[`${spiderIndex}${skillKey}`]:soundFiles[name];
if(file){
const clip=new Audio(new URL(`audio/${file}`,document.baseURI).href),mix=audioMix(source,.55),media=audioCtx.createMediaElementSource(clip);clip.volume=.7;media.connect(mix.input);activeClips.add(clip);
let usedFallback=false;const cleanup=()=>{activeClips.delete(clip);[media,mix.input,mix.pan].forEach(node=>{try{node.disconnect()}catch(e){}})};const fallback=()=>{cleanup();if(!usedFallback){usedFallback=true;playSynth(name,spiderIndex,skillKey,source)}};
clip.addEventListener('ended',cleanup,{once:true});clip.addEventListener('error',fallback,{once:true});
const playback=clip.play();if(playback&&playback.catch)playback.catch(fallback);return
}
playSynth(name,spiderIndex,skillKey,source)
}
function playSynth(name,spiderIndex,skillKey,source){
const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;
if(!audioCtx){audioCtx=new AudioContextClass();audioNoise=audioCtx.createBuffer(1,audioCtx.sampleRate*.18,audioCtx.sampleRate);const data=audioNoise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1}
if(audioCtx.state==='suspended')audioCtx.resume();
const mix=audioMix(source,.72);if(mix.attenuation<=.001)return;
const now=audioCtx.currentTime,spell=name==='spell'?spellSounds[`${spiderIndex}${skillKey}`]:null;
const tones={start:[440,660,880],bite:[180],hit:[95],kill:[520,780,1040],level:[440,554,659,880],death:[330,247,165],q:[260,390],e:[370,554],r:[280,420]};
const notes=spell?spell.notes:tones[name]||tones.e;
notes.forEach((frequency,index)=>{
const when=now+index*(spell?.step||.075),osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
osc.type=spell?.wave||(name==='hit'||name==='bite'?'triangle':'sine');osc.frequency.setValueAtTime(frequency,when);
if(name==='q')osc.frequency.exponentialRampToValueAtTime(frequency*1.8,when+.12);
if(name==='death')osc.frequency.exponentialRampToValueAtTime(frequency*.65,when+.22);
gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(name==='hit'?.12:.09,when+.012);gain.gain.exponentialRampToValueAtTime(.0001,when+(spell?.duration|| (name==='level'?.22:.14)));
osc.connect(gain);gain.connect(mix.input);osc.start(when);osc.stop(when+(spell?.duration||.24));
});
if(name==='hit'||name==='bite'||name==='q'||spell?.noise){
const src=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),gain=audioCtx.createGain();src.buffer=audioNoise;filter.type='lowpass';filter.frequency.value=spell?.filter||(name==='q'?1800:700);
const noiseLevel=spell?.noise||(name==='q'?.055:.045),noiseDuration=spell?.duration||(name==='q'?.16:.07);
gain.gain.setValueAtTime(noiseLevel,now);gain.gain.exponentialRampToValueAtTime(.0001,now+noiseDuration);src.connect(filter);filter.connect(gain);gain.connect(mix.input);src.start(now);src.stop(now+noiseDuration)
}
const lastTone=(notes.length-1)*(spell?.step||.075)+(spell?.duration||.24);setTimeout(()=>{mix.input.disconnect();mix.pan.disconnect()},(lastTone+.12)*1000)
}
