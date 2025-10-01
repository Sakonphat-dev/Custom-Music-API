const music_container = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progress_container = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');


const songs = ["Where Our Blue Is (Acoustic Version)","Usher - Hey Daddy (Daddy's Home)","Lady Gaga - Judas","Adele - Skyfall","廻廻奇譚 - Eve MV","King Gnu - SPECIALZ"];
let index = 0;  
function loadSongs(song){
    title.innerText=  `${song} .mp3`;
    cover.src = `Cover/${song}.jpg`;
    audio.src = `Music/${song}.mp3`;
}

let lastVolume = 1; 
audio.volume = 1;

function setVolumeIcon(vol, muted){
  const i = volumeBtn.querySelector('i');
  i.className = ''; 
  if(muted || vol === 0){
    i.classList.add('fa-solid','fa-volume-xmark');
  }else if(vol <= 0.5){
    i.classList.add('fa-solid','fa-volume-low');
  }else{
    i.classList.add('fa-solid','fa-volume-high');
  }
}

function setRangeTrackFill(){
  // สำหรับ webkit ให้แสดงสีเขียวตาม value
  const v = parseFloat(volumeRange.value);
  volumeRange.style.setProperty('--value', v);
}

volumeRange.addEventListener('input', (e)=>{
  const v = parseFloat(e.target.value || '0');
  audio.muted = (v === 0); 
  audio.volume = v;
  if(v > 0) lastVolume = v;
  setVolumeIcon(v, audio.muted);
  setRangeTrackFill();
});

volumeBtn.addEventListener('click', ()=>{
  
  if(audio.muted || audio.volume === 0){
    
    const restore = lastVolume > 0 ? lastVolume : 0.5;
    audio.muted = false;
    audio.volume = restore;
    volumeRange.value = restore;
  }else{
    audio.muted = true;
    volumeRange.value = 0;
  }
  setVolumeIcon(audio.volume, audio.muted);
  setRangeTrackFill();
});

setVolumeIcon(audio.volume, audio.muted);
setRangeTrackFill();



loadSongs(songs[index])
playBtn.addEventListener('click',()=>{
    const isPlay=music_container.classList.contains('play');
    if(isPlay){
        pauseSong();
    }else{
        playSong();
    }
});
prevBtn.addEventListener('click',()=>{
    index--;
    if(index<0){
        index=songs.length-1;
    }
    loadSongs(songs[index]);
    playSong();
});

nextBtn.addEventListener('click',(nextsong));
function nextsong(){
    index++;
    if(index>songs.length-1){
        index = 0;
    }
    loadSongs(songs[index]);
    playSong();
}
audio.addEventListener('timeupdate', (e) => {
  const { currentTime, duration } = audio;
  progress.style.width = `${(currentTime / duration) * 100}%`;
  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});
audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

function playSong(){
    music_container.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
}
function pauseSong(){
    music_container.classList.remove('play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    audio.pause();
}  
audio.addEventListener('timeupdate',updateprogress);
function updateprogress(e){
    const {duration,currentTime} = e.srcElement;
    const progressPercent=(currentTime/duration)*100;
    progress.style.width=`${progressPercent}%`; 
}
progress_container.addEventListener('click',setProcess);

function setProcess(e){
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX/width)*duration;
}

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

audio.addEventListener('ended',nextsong);

