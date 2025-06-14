'use client'

import { useEffect, useState } from 'react'

interface Song {
  title: string
  artist: string
  filename: string
  url: string
}

const CONFIG = {
  MUSIC_PATH: '/music/',
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
}

export function RadioWidget() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [volume, setVolume] = useState(70)
  const [status, setStatus] = useState('Ready')
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShuffled, setIsShuffled] = useState(true)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  // Initialize playlist
  useEffect(() => {
    const songs = CONFIG.SONGS.map(song => ({
      ...song,
      url: CONFIG.MUSIC_PATH + song.filename
    }))
    
    if (isShuffled) {
      // Shuffle the playlist
      for (let i = songs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [songs[i], songs[j]] = [songs[j], songs[i]]
      }
    }
    
    setPlaylist(songs)
    if (songs.length > 0) {
      setCurrentSong(songs[0])
      setStatus(`Loaded ${songs.length} songs`)
    }
  }, [isShuffled])

  // Update current audio when song changes
  useEffect(() => {
    if (currentSong) {
      const audio = new Audio(currentSong.url)
      audio.volume = volume / 100
      
      audio.addEventListener('ended', () => {
        nextSong()
      })
      
      audio.addEventListener('loadstart', () => setStatus('Loading...'))
      audio.addEventListener('canplay', () => setStatus('Ready'))
      audio.addEventListener('error', () => setStatus('Error loading'))
      
      setCurrentAudio(audio)
      
      return () => {
        audio.pause()
        audio.remove()
      }
    }
  }, [currentSong])

  const toggleWidget = () => {
    setIsCollapsed(!isCollapsed)
  }

  const togglePlay = async () => {
    if (!currentAudio || !currentSong) return

    if (isPlaying) {
      currentAudio.pause()
      setIsPlaying(false)
      setStatus('Paused')
    } else {
      try {
        await currentAudio.play()
        setIsPlaying(true)
        setStatus('Playing')
      } catch (error) {
        console.error('Play error:', error)
        setStatus('Play error')
      }
    }
  }

  const nextSong = () => {
    if (playlist.length === 0) return
    
    if (currentAudio) {
      currentAudio.pause()
    }
    
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentIndex(nextIndex)
    setCurrentSong(playlist[nextIndex])
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (currentAudio) {
      currentAudio.volume = newVolume / 100
    }
  }

  return (
    <>
      <link rel="stylesheet" href="/css/radio-widget.css" />
      <div className={`radio-widget ${isCollapsed ? 'collapsed' : 'expanded'}`} id="radioWidget">
        <div className="widget-header" onClick={toggleWidget}>
          <h3 className="widget-title">Radio</h3>
          <button className="collapse-btn">
            {isCollapsed ? '+' : '−'}
          </button>
        </div>
        <div className="widget-content">
          <div className="now-playing">
            <div className="song-info">
              <div className="song-title">
                {currentSong?.title || 'Ready to play'}
              </div>
              <div className="song-artist">
                {currentSong?.artist || 'Click play to start'}
              </div>
            </div>
          </div>
          <div className="controls">
            <button className="control-btn play-btn" onClick={togglePlay}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button className="control-btn" onClick={nextSong}>
              Next
            </button>
            <button 
              className={`control-btn ${isShuffled ? 'active' : ''}`} 
              onClick={toggleShuffle}
            >
              Shuffle
            </button>
          </div>
          <div className="volume-container">
            <span className="volume-icon">♪</span>
            <input 
              type="range" 
              className="volume-slider"
              min="0" 
              max="100" 
              value={volume}
              onChange={handleVolumeChange}
            />
            <span className="volume-label">{volume}%</span>
          </div>
          <div className={`status ${status === 'Playing' ? 'success' : status === 'Error loading' ? 'error' : ''}`}>
            {status}
          </div>
        </div>
      </div>
    </>
  )
}
