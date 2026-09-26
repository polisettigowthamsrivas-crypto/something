const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let animationRunning = false;

function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
addEventListener("resize",resize); resize();

function launchConfetti(count=180){
  for(let i=0;i<count;i++){
    pieces.push({
      x: innerWidth/2 + (Math.random()-.5)*160,
      y: innerHeight*.38,
      vx:(Math.random()-.5)*13,
      vy:Math.random()*-12-4,
      size:Math.random()*8+4,
      rot:Math.random()*6,
      vr:(Math.random()-.5)*.25,
      life:Math.random()*120+90,
      type:Math.random()>.5?"rect":"circle"
    });
  }
  if(!animationRunning){animationRunning=true;requestAnimationFrame(drawConfetti)}
}
function drawConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  pieces.forEach(p=>{
    p.x+=p.vx;p.vy+=.22;p.y+=p.vy;p.rot+=p.vr;p.life--;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
    ctx.globalAlpha=Math.max(0,p.life/80);
    ctx.fillStyle=["#ff9bd5","#d9a7ff","#8fe7ff","#ffd18e","#ffffff"][Math.floor(Math.random()*5)];
    if(p.type==="rect")ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*1.8);
    else{ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill()}
    ctx.restore();
  });
  pieces=pieces.filter(p=>p.life>0&&p.y<innerHeight+50);
  if(pieces.length){requestAnimationFrame(drawConfetti)}else{animationRunning=false;ctx.clearRect(0,0,canvas.width,canvas.height)}
}

const modal=document.getElementById("modal");
function openSurprise(){modal.classList.add("open");modal.setAttribute("aria-hidden","false");launchConfetti(230)}
function closeSurprise(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
document.getElementById("surpriseBtn").onclick=openSurprise;
document.getElementById("closeBtn").onclick=closeSurprise;
document.getElementById("modalCelebrate").onclick=()=>{launchConfetti(320);playMelody();};
modal.addEventListener("click",e=>{if(e.target===modal)closeSurprise()});

const toast=document.getElementById("toast");
document.getElementById("wishBtn").onclick=()=>{
  launchConfetti(260);
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),3000);
};

let audioCtx=null, playing=false, timer=null;
const musicBtn=document.getElementById("musicBtn");

function playMelody(){
  if(playing)return;
  audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
  const notes=[261.63,261.63,293.66,261.63,349.23,329.63,261.63,261.63,293.66,261.63,392,349.23];
  let i=0; playing=true; musicBtn.innerHTML="♫ <span>Playing</span>";
  const play=()=>{
    if(!playing)return;
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type="sine"; osc.frequency.value=notes[i%notes.length];
    gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.12,audioCtx.currentTime+.03);
    gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.42);
    osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.45);
    i++;timer=setTimeout(play,500);
  }; play();
}
function stopMelody(){playing=false;clearTimeout(timer);musicBtn.innerHTML="♫ <span>Music</span>"}
musicBtn.onclick=()=>{if(playing)stopMelody();else playMelody()};

document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSurprise()});


// Madhurima's birthday countdown — October 20, 2026, India time (IST)
const birthdayTarget = new Date("2026-10-20T00:00:00+05:30").getTime();
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const birthdayStatus = document.getElementById("birthdayStatus");
const countdown = document.getElementById("countdown");
let birthdayCelebrated = false;

function updateCountdown(){
  const now = Date.now();
  const distance = birthdayTarget - now;

  if(distance <= 0){
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    birthdayStatus.textContent = "🎉 TODAY IS MADHURIMA'S BIRTHDAY! 🎂❤️";
    countdown.classList.add("birthday-live");

    if(!birthdayCelebrated){
      birthdayCelebrated = true;
      setTimeout(() => launchConfetti(420), 400);
    }
    return;
  }

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  daysEl.textContent = String(days).padStart(2,"0");
  hoursEl.textContent = String(hours).padStart(2,"0");
  minutesEl.textContent = String(minutes).padStart(2,"0");
  secondsEl.textContent = String(seconds).padStart(2,"0");
}

updateCountdown();
setInterval(updateCountdown, 1000);
