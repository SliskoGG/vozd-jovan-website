// Configuration
const CONFIG = {
    // Path to your music files (relative to your website root)
    MUSIC_PATH: '/music/',
    
    // List your music files here
    SONGS: [
    {
        title: 'Kinematograf naseg detinjstva',
        artist: 'Atomsko skloniste',
        filename: 'Atomsko_skloniste-Kinematograf_naseg_detinjstva.mp3'
    },
    {
        title: 'Nek vam je sa srecom', 
        artist: 'Atomsko skloniste',
        filename: 'Atomsko_skloniste-Nek_vam_je_sa_srecom.mp3'
    },
    {
        title: 'Ne cvikaj generacijo',
        artist: 'Atomsko skloniste', 
        filename: 'Atomsko_skloniste-Ne_cvikaj_generacijo.mp3'
    }
]
};

// Radio Player Class
class WebRadioPlayer {
    constructor() {
        this.currentSong = null;
        this.currentAudio = null;
        this.nextAudio = null;
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffled = true;
        this.volume = 0.7;
        this.isLoading = false;
        
        this.initializeElements();
        this.loadPlaylist();
    }

    initializeElements() {
        this.playBtn = document.getElementById('playBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeDisplay = document.getElementById('volumeDisplay');
        this.songTitle = document.getElementById('songTitle');
        this.songArtist = document.getElementById('songArtist');
        this.status = document.getElementById('status');
        
        // Set shuffle button as active by default
        this.shuffleBtn.classList.add('active');
    }

    async loadPlaylist() {
        this.updateStatus('Loading playlist...', 'loading');
        
        try {
            // Create playlist with full URLs
            this.playlist = CONFIG.SONGS.map(song => ({
                title: song.title,
                artist: song.artist,
                url: CONFIG.MUSIC_PATH + song.filename,
                filename: song.filename
            }));

            if (this.playlist.length > 0) {
                this.shufflePlaylist();
                this.updateSongInfo();
                this.preloadCurrentSong();
                this.updateStatus(`Loaded ${this.playlist.length} songs`, 'success');
            } else {
                this.updateStatus('No songs found', 'error');
            }
        } catch (error) {
            console.error('Error loading playlist:', error);
            this.updateStatus('Load error', 'error');
        }
    }

    shufflePlaylist() {
        if (this.isShuffled) {
            for (let i = this.playlist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
            }
        }
    }

    async preloadCurrentSong() {
        if (this.playlist.length === 0) return;
        
        const song = this.playlist[this.currentIndex];
        this.currentAudio = new Audio(song.url);
        this.currentAudio.volume = this.volume;
        
        this.currentAudio.addEventListener('ended', () => this.nextSong());
        this.currentAudio.addEventListener('loadstart', () => this.updateStatus('Loading...', 'loading'));
        this.currentAudio.addEventListener('canplay', () => this.updateStatus('Ready', 'success'));
        this.currentAudio.addEventListener('error', () => this.updateStatus('Error loading song', 'error'));
        
        // Preload next song
        this.preloadNextSong();
    }

    async preloadNextSong() {
        const nextIndex = (this.currentIndex + 1) % this.playlist.length;
        const nextSong = this.playlist[nextIndex];
        
        this.nextAudio = new Audio(nextSong.url);
        this.nextAudio.volume = this.volume;
    }

    updateSongInfo() {
        if (this.playlist.length === 0) return;
        
        const song = this.playlist[this.currentIndex];
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
    }

    updateStatus(message, type = '') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
    }

    async togglePlay() {
        if (this.playlist.length === 0) {
            this.updateStatus('No songs', 'error');
            return;
        }

        if (!this.currentAudio) {
            await this.preloadCurrentSong();
        }

        if (this.isPlaying) {
            this.currentAudio.pause();
            this.playBtn.textContent = 'Play';
            this.updateStatus('Paused', '');
        } else {
            try {
                await this.currentAudio.play();
                this.playBtn.textContent = 'Pause';
                this.updateStatus('Playing', 'success');
            } catch (error) {
                console.error('Play error:', error);
                this.updateStatus('Play error', 'error');
                return;
            }
        }
        
        this.isPlaying = !this.isPlaying;
    }

    nextSong() {
        if (this.playlist.length === 0) return;

        if (this.currentAudio) {
            this.currentAudio.pause();
        }

        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        
        // Use preloaded next song if available
        if (this.nextAudio) {
            this.currentAudio = this.nextAudio;
            this.nextAudio = null;
        }

        this.updateSongInfo();
        this.preloadNextSong();

        if (this.isPlaying) {
            this.currentAudio.play().catch(error => {
                console.error('Play error:', error);
                this.updateStatus('Play error', 'error');
            });
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        
        if (this.isShuffled) {
            this.shuffleBtn.classList.add('active');
            this.shufflePlaylist();
            this.currentIndex = 0;
            this.updateSongInfo();
            this.preloadCurrentSong();
        } else {
            this.shuffleBtn.classList.remove('active');
        }
    }

    setVolume(value) {
        this.volume = value / 100;
        this.volumeDisplay.textContent = `${value}%`;
        
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
        if (this.nextAudio) {
            this.nextAudio.volume = this.volume;
        }
    }
}

// Widget Controls
function toggleWidget() {
    const widget = document.getElementById('radioWidget');
    const collapseBtn = document.getElementById('collapseBtn');
    
    if (widget.classList.contains('collapsed')) {
        widget.classList.remove('collapsed');
        widget.classList.add('expanded');
        collapseBtn.textContent = '−';
    } else {
        widget.classList.remove('expanded');
        widget.classList.add('collapsed');
        collapseBtn.textContent = '+';
    }
}

// Initialize player when page loads
let radioPlayer;
window.addEventListener('DOMContentLoaded', () => {
    radioPlayer = new WebRadioPlayer();
});

// Global functions for button onclick events
function togglePlay() {
    radioPlayer.togglePlay();
}

function nextSong() {
    radioPlayer.nextSong();
}

function toggleShuffle() {
    radioPlayer.toggleShuffle();
}

function setVolume(value) {
    radioPlayer.setVolume(value);
}
