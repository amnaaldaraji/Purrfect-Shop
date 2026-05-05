let audio = document.getElementById('bgMusic');
let widgetOpen = true;

// show or hide the music player when you click the arrow
function toggleMusicWidget() {
    let body = document.getElementById('musicBody');
    let btn = document.getElementById('musicToggle');
    widgetOpen = !widgetOpen;
    body.classList.toggle('hidden', !widgetOpen);
    btn.textContent = widgetOpen ? '▼' : '▲';
}

let musicPlaying = false;
let progressInterval = null;

// play or pause 
function toggleMusic() {
    if (musicPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
}

// when the song starts playing, update the button and start the timer
audio.addEventListener('play', function() {
    musicPlaying = true;
    document.getElementById('musicBtn').classList.add('playing');
    startProgressUpdate();
});

// when it pauses, switch the button back
audio.addEventListener('pause', function() {
    musicPlaying = false;
    document.getElementById('musicBtn').classList.remove('playing');
    stopProgressUpdate();
});

// go back 10 seconds
function seekBack() {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
}

// skip forward 10 seconds
function seekForward() {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
}

// jump to wherever you clicked on the progress bar
function seekToClick(event) {
    let rect = event.currentTarget.getBoundingClientRect();
    let percent = (event.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
}

// turns seconds into mm:ss format
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = '0' + secs;
    return mins + ':' + secs;
}

// updates the progress bar and time display every half second
function startProgressUpdate() {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(function() {
        let percent = (audio.currentTime / audio.duration) * 100;
        document.getElementById('musicProgress').style.width = percent + '%';
        document.getElementById('musicTime').textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
    }, 500);
}

// stop the timer when music pauses
function stopProgressUpdate() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}
