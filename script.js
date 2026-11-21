const $ = (id) => document.getElementById(id);
const audio = $("audioPlayer");
let currentApp = "home";
let currentUrl = null;

function updateClock(){
  const now = new Date();
  $("clock").textContent = now.toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit",hour12:false});
  $("footerTime").textContent = $("clock").textContent;
  $("dateLine").textContent = now.toLocaleDateString("uz-UZ",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  $("topDate").textContent = now.toLocaleDateString("uz-UZ",{day:"2-digit",month:"short",year:"numeric"}).toUpperCase();
}
updateClock(); setInterval(updateClock,1000);

function showHome(){
  currentApp="home"; $("homeView").classList.remove("hidden"); $("appView").classList.add("hidden");
  document.querySelectorAll(".nav-home").forEach(b=>b.classList.add("active"));
}
function openApp(name){
  currentApp=name; $("homeView").classList.add("hidden"); $("appView").classList.remove("hidden");
  document.querySelectorAll(".nav-home").forEach(b=>b.classList.remove("active"));
  const titles={music:"MUSIC PLAYER",radio:"FM RADIO",navigation:"NAVIGATION",bluetooth:"BLUETOOTH",vehicle:"VEHICLE",settings:"SETTINGS"};
  $("appTitle").textContent=titles[name]||"APPLICATION";
  const views={music:musicView,radio:radioView,navigation:navigationView,bluetooth:bluetoothView,vehicle:vehicleView,settings:settingsView};
  $("appContent").innerHTML=(views[name]||(()=>"<p class='muted'>This section is not available.</p>"))();
  bindAppEvents(name);
}
document.querySelectorAll("[data-app]").forEach(btn=>btn.addEventListener("click",()=>openApp(btn.dataset.app)));
$("backHome").addEventListener("click",showHome);
$("homeButton").addEventListener("click",showHome);

function musicView(){return `<div class="music-layout"><div class="large-art">♫</div><div><div class="eyebrow">LOCAL AUDIO PLAYER</div><h2 class="track-name" id="appTrackTitle">No track selected</h2><p class="muted" id="appTrackArtist">Choose an audio file stored on your phone.</p><input class="progress" id="seekBar" type="range" min="0" max="100" value="0"><div class="time-row"><span id="currentTime">0:00</span><span id="duration">0:00</span></div><div class="action-row"><button class="primary-btn" id="chooseAudio">＋ ADD MUSIC</button><button class="secondary-btn" id="playAudio">▶ PLAY</button><button class="secondary-btn" id="stopAudio">■ STOP</button></div></div></div>`}
function radioView(){return `<h2 class="panel-title">FM RADIO</h2><div class="status-card"><div class="eyebrow">CURRENT FREQUENCY</div><div style="font-size:42px;font-weight:600;margin:8px 0"> FM <span id="frequency">101.0</span></div><p>Radio interface preview. Live FM reception requires compatible vehicle hardware or a radio stream.</p></div><input id="freqSlider" type="range" min="875" max="1080" value="1010" style="width:100%;accent-color:var(--blue)"><div class="action-row"><button class="secondary-btn" id="freqDown">− 0.1</button><button class="secondary-btn" id="freqUp">+ 0.1</button></div>`}
function navigationView(){return `<h2 class="panel-title">NAVIGATION</h2><div class="status-card"><strong>Explore your route</strong><p>Open a map service to search for a destination and view directions.</p></div><div class="action-row"><button class="primary-btn" id="openMaps">OPEN GOOGLE MAPS ↗</button></div>`}
function bluetoothView(){return `<h2 class="panel-title">BLUETOOTH</h2><div class="status-card"><strong id="btStatus">No device connected</strong><p>This is a visual simulator. A webpage cannot scan or pair with car Bluetooth directly.</p></div><div class="action-row"><button class="primary-btn" id="btDemo">SIMULATE CONNECTION</button><button class="secondary-btn" id="btDisconnect">DISCONNECT</button></div>`}
function vehicleView(){return `<h2 class="panel-title">VEHICLE INFORMATION</h2><div class="status-card"><strong>CHEVROLET COBALT</strong><p>Multimedia concept • Vehicle data shown here is demonstration-only.</p></div><div class="setting-row"><span>Vehicle profile</span><strong>COBALT • SEDAN</strong></div><div class="setting-row"><span>System version</span><strong>TESLA UI 1.0</strong></div><div class="setting-row"><span>Connection</span><strong style="color:#45d69a">READY</strong></div>`}
function settingsView(){return `<h2 class="panel-title">SYSTEM PREFERENCES</h2><div class="setting-row"><span>Screen brightness</span><input id="brightness" type="range" min="35" max="100" value="85"></div><div class="setting-row"><span>System volume</span><input id="volumeSetting" type="range" min="0" max="100" value="65"></div><div class="setting-row"><span>Interface theme</span><strong>Dark / Blue</strong></div><div class="setting-row"><span>Display ratio</span><strong>16:9</strong></div><p class="muted">Brightness changes the preview appearance only. Device-level screen brightness is controlled by Android.</p>`}
function bindAppEvents(name){
  if(name==="music"){
    $("chooseAudio").onclick=()=>$("audioFile").click();
    $("playAudio").onclick=()=>{if(audio.src)audio.play().catch(()=>{});};
    $("stopAudio").onclick=()=>{audio.pause();audio.currentTime=0;};
    $("seekBar").oninput=e=>{if(audio.duration)audio.currentTime=(e.target.value/100)*audio.duration;};
    audio.ontimeupdate=()=>{const pct=audio.duration?(audio.currentTime/audio.duration)*100:0;const seek=$("seekBar");if(seek)seek.value=pct;const ct=$("currentTime"),du=$("duration");if(ct)ct.textContent=formatTime(audio.currentTime);if(du)du.textContent=formatTime(audio.duration||0);};
  }
  if(name==="radio"){
    const slider=$("freqSlider");const update=()=>{$("frequency").textContent=(slider.value/10).toFixed(1);};
    slider.oninput=update;$("freqDown").onclick=()=>{slider.value=Math.max(875,+slider.value-1);update();};$("freqUp").onclick=()=>{slider.value=Math.min(1080,+slider.value+1);update();};
  }
  if(name==="navigation")$("openMaps").onclick=()=>window.open("https://www.google.com/maps","_blank","noopener");
  if(name==="bluetooth"){
    $("btDemo").onclick=()=>{$("btStatus").textContent="Demo device connected";$("connection").textContent="DEMO CONNECTED";};
    $("btDisconnect").onclick=()=>{$("btStatus").textContent="No device connected";$("connection").textContent="SYSTEM READY";};
  }
  if(name==="settings"){
    $("volumeSetting").oninput=e=>{audio.volume=e.target.value/100;$("volumeHome").value=e.target.value;};
    $("brightness").oninput=e=>{document.querySelector(".screen").style.filter=`brightness(${e.target.value/85})`;};
  }
}
function formatTime(seconds){if(!Number.isFinite(seconds))return"0:00";const m=Math.floor(seconds/60),s=Math.floor(seconds%60);return `${m}:${String(s).padStart(2,"0")}`;}
$("audioFile").addEventListener("change",e=>{
  const file=e.target.files&&e.target.files[0];if(!file)return;
  if(currentUrl)URL.revokeObjectURL(currentUrl);
  currentUrl=URL.createObjectURL(file);audio.src=currentUrl;
  $("trackTitle").textContent=file.name.replace(/\.[^.]+$/,"");$("trackArtist").textContent="Local audio • Ready to play";
  if(currentApp==="music"){const title=$("appTrackTitle"),artist=$("appTrackArtist");if(title)title.textContent=file.name.replace(/\.[^.]+$/,"");if(artist)artist.textContent="Local audio • Ready to play";}
  audio.play().catch(()=>{});
});
$("miniPlay").onclick=()=>{if(audio.src)audio.paused?audio.play():audio.pause();else openApp("music");};
$("miniStop").onclick=()=>{audio.pause();audio.currentTime=0;};
$("volumeHome").oninput=e=>{audio.volume=e.target.value/100;};
audio.volume=.65;
audio.onplay=()=>{$("miniPlay").textContent="Ⅱ";const b=$("playAudio");if(b)b.textContent="Ⅱ PAUSE";};
audio.onpause=()=>{$("miniPlay").textContent="▶";const b=$("playAudio");if(b)b.textContent="▶ PLAY";};
