'use client'

import { useEffect, useState, useRef } from 'react'

interface Song {
  title: string
  artist: string
  filename: string
  url: string
}

const CONFIG = {
  MUSIC_PATH: '/',  // Files are directly in public/ folder
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
  const [isCollapsed, setIsCollapsed] = useState(true)  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [volume, setVolume] = useState(50)  
  const [status, setStatus] = useState('Ready')
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShuffled, setIsShuffled] = useState(true)
  
  // Use useRef to maintain single audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize playlist
  useEffect(() => {
    const songs = CONFIG.SONGS.map(song => ({
      ...song,
      url: CONFIG.MUSIC_PATH + song.filename
    }))
    
    // Test if files are accessible
    songs.forEach(song => {
      fetch(song.url, { method: 'HEAD' })
        .then(response => {
          console.log(`File ${song.filename}:`, response.ok ? 'Found' : 'Not found', response.status)
        })
        .catch(error => {
          console.error(`File ${song.filename} error:`, error)
        })
    })
    
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
      setCurrentIndex(0)
      setStatus(`Loaded ${songs.length} songs`)
    }
  }, [isShuffled])

  // Handle song changes and audio setup
  useEffect(() => {
    if (!currentSong) return

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeEventListener('ended', handleSongEnd)
      audioRef.current.removeEventListener('loadstart', handleLoadStart)
      audioRef.current.removeEventListener('canplay', handleCanPlay)
      audioRef.current.removeEventListener('error', handleError)
      audioRef.current.removeEventListener('loadeddata', handleLoadedData)
    }

    // Create new audio element
    const audio = new Audio()
    audio.crossOrigin = "anonymous"
    audio.preload = "metadata"
    audio.volume = volume / 100
    audio.src = currentSong.url

    // Add event listeners
    audio.addEventListener('ended', handleSongEnd)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadeddata', handleLoadedData)

    audioRef.current = audio

    console.log('Loading song:', currentSong.url)
    
    return () => {
      // Cleanup on unmount or song change
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current.load()
      }
    }
  }, [currentSong])

  // Autoplay after initial setup
  useEffect(() => {
    if (currentSong && audioRef.current && !isPlaying) {
      // Autoplay after a short delay
      const timer = setTimeout(() => {
        attemptAutoplay()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [currentSong])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Event handlers
  const handleSongEnd = () => {
    nextSong()
  }

  const handleLoadStart = () => {
    setStatus('Loading...')
  }

  const handleCanPlay = () => {
    setStatus('Ready')
  }

  const handleError = (e: Event) => {
    console.error('Audio error:', e)
    setStatus('Error loading')
    setIsPlaying(false)
  }

  const handleLoadedData = () => {
    console.log('Data loaded:', currentSong?.url)
  }

  const attemptAutoplay = async () => {
    if (!audioRef.current || !currentSong) return

    try {
      await audioRef.current.play()
      setIsPlaying(true)
      setStatus('Playing')
      console.log('Autoplay successful')
    } catch (error) {
      console.log('Autoplay blocked - user interaction required')
      setStatus('Click play to start')
      setIsPlaying(false)
    }
  }

  const toggleWidget = () => {
    setIsCollapsed(!isCollapsed)
  }

  const togglePlay = async () => {
    if (!currentSong || !audioRef.current) {
      setStatus('No song selected')
      return
    }

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        setStatus('Paused')
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
        setStatus('Playing')
      }
    } catch (error) {
      console.error('Play error:', error)
      setStatus('Play error')
      setIsPlaying(false)
    }
  }

  const nextSong = () => {
    if (playlist.length === 0) return
    
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentIndex(nextIndex)
    setCurrentSong(playlist[nextIndex])
    setIsPlaying(false) // Will attempt autoplay in useEffect
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    // Volume will be applied in useEffect
  }

  return (
    <>
      <style jsx>{`
        .radio-widget {
          position: fixed !important;
          top: 15px !important;
          left: 15px !important;
          z-index: 9999 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(71, 85, 105, 0.4);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        
        .radio-widget.collapsed {
          width: 250px !important;
          height: 35px !important;
        }
        
        .radio-widget.expanded {
          width: 320px;
          min-height: 120px;
          max-height: 120px;
        }
        
        .widget-header {
          background: rgba(30, 41, 59, 0.8);
          padding: 6px 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: auto;
          border-bottom: 1px solid rgba(71, 85, 105, 0.3);
        }
        
        .radio-widget.collapsed .widget-header {
          border-bottom: none;
          padding: 8px;
        }
        
        .collapsed-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        
        .collapsed-song-info {
          flex: 1;
          color: #f1f5f9;
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .collapsed-play-btn {
          background: #1e293b;
          border: 1px solid rgba(71, 85, 105, 0.4);
          color: #e2e8f0;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 9px;
          min-width: 35px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .collapsed-play-btn:hover {
          background: #334155;
        }
        
        .header-controls {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }
        
        .radio-widget.collapsed .header-controls {
          display: none;
        }
        
        .radio-widget.expanded .collapsed-controls {
          display: none;
        }
        
        .widget-title {
          display: none;
        }
        
        .collapse-btn {
          background: none;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
          border-radius: 3px;
          transition: all 0.2s;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .widget-content {
          padding: 8px;
          display: block;
        }
        
        .radio-widget.collapsed .widget-content {
          display: none;
        }
        
        .radio-widget.collapsed .widget-title {
          display: none;
        }
        
        .now-playing {
          margin-bottom: 10px;
        }
        
        .song-info {
          color: #f1f5f9;
          font-size: 12px;
          line-height: 1.3;
        }
        
        .song-title {
          font-weight: 500;
          margin-bottom: 3px;
        }
        
        .song-artist {
          color: #94a3b8;
          font-size: 11px;
        }
        
        .controls {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }
        
        .control-btn {
          background: #1e293b;
          border: 1px solid rgba(71, 85, 105, 0.4);
          color: #e2e8f0;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          height: 28px;
          font-weight: 400;
        }
        
        .control-btn:hover {
          background: #334155;
          border-color: rgba(71, 85, 105, 0.6);
          color: #f1f5f9;
        }
        
        .control-btn.active {
          background: #0f766e;
          border-color: #14b8a6;
          color: #f0fdfa;
        }
        
        .play-btn {
          min-width: 50px;
        }
        
        .volume-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .volume-icon {
          color: #94a3b8;
          font-size: 12px;
          width: 14px;
        }
        
        .volume-slider {
          width: 80px;
          height: 4px;
          background: rgba(71, 85, 105, 0.4);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          appearance: none;
        }
        
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: #64748b;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .volume-label {
          color: #64748b;
          font-size: 10px;
          min-width: 28px;
          text-align: right;
        }
        
        .status {
          color: #64748b;
          font-size: 9px;
          text-align: center;
          margin-top: 5px;
        }
        
        .status.success {
          color: #059669;
        }
        
        .status.error {
          color: #dc2626;
        }
        
        .status.loading {
          color: #eab308;
        }
      `}</style>
      <div className={`radio-widget ${isCollapsed ? 'collapsed' : 'expanded'}`} id="radioWidget">
        <div className="widget-header">
          {/* Collapsed view - shows in header */}
          <div className="collapsed-controls">
            <div className="collapsed-song-info">
              {currentSong ? `${currentSong.artist} - ${currentSong.title}` : 'Loading...'}
            </div>
            <button className="collapsed-play-btn" onClick={togglePlay}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
          
          {/* Expanded view - shows when expanded */}
          <div className="header-controls">
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
          </div>
          
          <button className="collapse-btn" onClick={toggleWidget}>
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
