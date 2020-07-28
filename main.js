const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;
console.log(circumference);

function setOffset(percent) {
	let offset = circumference - percent / 100 * circumference;
	circle.style.strokeDashoffset = offset;
}

let songs = [];
let songCounter = 1;
for (songCounter; songCounter <= 6; songCounter++) { // здесь нужно задать число проигроваемых песен
	songs.push('audio/song' + songCounter + '.mp3');
}

let songTitles = ["Проклятый старый дом", "Красно-Жёлтые дни", "Танец злобного гения", "Stan", "Feel Good Inc", "The Lion Sleeps Toonight"]; // Названия песен в определенном порядке
let songAuthors = ["Король и Шут", "Кино", "Король и Шут", "Eminem & Dido", "Gorillaz", "The Tokens"];  // Авторы песен в определенном порядке

const fillBar = document.getElementById('fillBar'),
	  songTitle = document.getElementById('songTitle'),
	  sontAuthor = document.getElementById('songAuthor'),
	  handlePoint = document.getElementById('handle');

const pauseIcon = document.querySelector('.songStatus__pause'),
  	  playIcon  = document.querySelector('.songStatus__play');

const songDurationText = document.getElementById('songDuration'),
	  songCurTimeText = document.getElementById('songCurTime');

let song = new Audio();
let currentSong = 0;
let currentSongTitle = 0;
let currentSongAuthor = 0;

window.onload = function() {
	song.src = songs[currentSong];
	songTitle.textContent = songTitles[currentSongTitle];
	sontAuthor.textContent = songAuthors[currentSongAuthor];
}

song.addEventListener('loadedmetadata', () => {
	let clearSongDuration = parseInt(song.duration);
	console.log(clearSongDuration);
	if (clearSongDuration%60 < 10) {
		songDurationText.textContent = parseInt(clearSongDuration/60) + ':0' + clearSongDuration%60;
	} else {
		songDurationText.textContent = parseInt(clearSongDuration/60) + ':' + clearSongDuration%60;
	}
});

function playSong() {
	song.src = songs[currentSong];
	songTitle.textContent = songTitles[currentSongTitle];
	sontAuthor.textContent = songAuthors[currentSongAuthor];
	song.play();
}

function playOrPauseButton() {
	currentVolume = song.volume;

	if (song.paused) {
		song.play();

		let timerId = setTimeout(function tick() {
			if (currentVolume >= 1) {
				pauseIcon.classList.remove('hidden');
				playIcon.classList.add('hidden');
			} else {
				currentVolume += 0.01;
				song.volume = currentVolume.toFixed(2);
				timerId = setTimeout(tick, 3);
			}
		}, 3);

	} else {
		let timerId = setTimeout(function tick() {
			if (currentVolume <= 0) {
				pauseIcon.classList.add('hidden');
				playIcon.classList.remove('hidden');
				song.pause();
				currentVolume = 1;
			} else {
				currentVolume -= 0.01;
				song.volume = currentVolume.toFixed(2);
				timerId = setTimeout(tick, 3);
			}
		}, 3);
	}
}

song.addEventListener('timeupdate', function() {
	let clearCurTime = parseInt(song.currentTime);
	if (clearCurTime%60 < 10) {
		songCurTimeText.textContent = parseInt(clearCurTime/60) + ':0' + clearCurTime%60;
	} else {
		songCurTimeText.textContent = parseInt(clearCurTime/60) + ':' + clearCurTime%60;
	}
	let position = song.currentTime / song.duration;
	setOffset(position * 100);
	handlePoint.style.transform = ' rotate(' + '-' + position * 180 + 'deg)' + ' translateY(50%) ';
	if (song.currentTime == song.duration) {
		playNextSong();
	}
});

function playNextSong() {
	currentSong++;
	currentSongAuthor++;
	currentSongTitle++;
	if (currentSong > songs.length - 1) {
		currentSong = 0;
		currentSongAuthor = 0;
		currentSongTitle = 0;
	}
	playSong();
	playIcon.classList.add('hidden');
	pauseIcon.classList.remove('hidden');
}

function playPreviousSong() {
	currentSong--;
	currentSongAuthor--;
	currentSongTitle--;
	if (currentSong < 0) {
		currentSong = songs.length - 1;
		currentSongAuthor = songs.length - 1;
		currentSongTitle = songs.length - 1;
	}
	playSong();
	playIcon.classList.add('hidden');
	pauseIcon.classList.remove('hidden');
}

function audioRewind() {
	let currentRadius = (radius + 10)/100,
		audioCurrentPos = event.offsetX;

	song.currentTime = song.duration * (audioCurrentPos/circumference*currentRadius);
	console.log(audioCurrentPos/circumference*currentRadius);

	if ((audioCurrentPos/circumference*currentRadius) < 0.05) {
		song.currentTime = 0;
	}
}
