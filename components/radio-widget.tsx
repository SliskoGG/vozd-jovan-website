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
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  // Use useRef to maintain single audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize playlist
  useEffect(() => {
    const songs = CONFIG.SONGS.map(song => ({
      ...song,
      url: CONFIG.MUSIC_PATH + song.filename
    }))
    
    // Test if files are accessible with more detailed logging
    songs.forEach(async (song, index) => {
      try {
        const response = await fetch(song.url, { method: 'HEAD' })
        const status = response.ok ? '✅ Found' : '❌ Not found'
        console.log(`File ${index + 1}: "${song.filename}" - ${status} (${response.status})`)
        
        if (!response.ok) {
          console.warn(`Problem with file: ${song.title} - ${song.filename}`)
          console.warn(`Full URL: ${song.url}`)
        }
      } catch (error) {
        console.error(`File ${index + 1}: "${song.filename}" - ❌ Error:`, error)
      }
    })
    
    // Only shuffle on initial load, not when shuffle is toggled
    if (playlist.length === 0) {
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
    }
  }, []) // Remove isShuffled dependency

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
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
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
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

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
      // Autoplay after a short delay, but only for the first song
      const timer = setTimeout(() => {
        attemptAutoplay()
      }, 2000) // Increased delay for better browser compatibility
      
      return () => clearTimeout(timer)
    }
  }, [currentSong])

  // Additional autoplay trigger for initial load
  useEffect(() => {
    if (playlist.length > 0 && currentSong && !isPlaying) {
      const timer = setTimeout(() => {
        attemptAutoplay()
      }, 3000) // Extra autoplay attempt
      
      return () => clearTimeout(timer)
    }
  }, [playlist])

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
    const error = e.target as HTMLAudioElement
    console.error('Audio error:', {
      error: error.error,
      src: error.src,
      networkState: error.networkState,
      readyState: error.readyState,
      currentSong: currentSong?.title
    })
    
    setStatus(`Error: ${currentSong?.title || 'Unknown'}`)
    setIsPlaying(false)
    
    // Try next song if current one fails
    setTimeout(() => {
      console.log('Trying next song due to error...')
      nextSong()
    }, 2000)
  }

  const handleLoadedData = () => {
    console.log('Data loaded:', currentSong?.url)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const attemptAutoplay = async () => {
    if (!audioRef.current || !currentSong) return

    try {
      // Ensure audio is loaded
      if (audioRef.current.readyState < 2) {
        console.log('Waiting for audio to load before autoplay...')
        audioRef.current.addEventListener('canplay', attemptAutoplay, { once: true })
        return
      }

      console.log('Attempting autoplay for:', currentSong.title)
      await audioRef.current.play()
      setIsPlaying(true)
      setStatus('Playing')
      console.log('Autoplay successful')
    } catch (error) {
      console.log('Autoplay blocked - user interaction required:', error)
      setStatus('Click ▶ to start')
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

    console.log('Toggle play for:', currentSong.title, 'Current state:', isPlaying)

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        setStatus('Paused')
        console.log('Paused:', currentSong.title)
      } else {
        // Check if audio is loaded
        if (audioRef.current.readyState < 2) {
          setStatus('Loading...')
          console.log('Audio not ready, waiting...')
          audioRef.current.addEventListener('canplay', async () => {
            try {
              await audioRef.current!.play()
              setIsPlaying(true)
              setStatus('Playing')
              console.log('Play successful after loading:', currentSong.title)
            } catch (err) {
              console.error('Play failed after loading:', err)
              setStatus('Play failed')
            }
          }, { once: true })
          return
        }

        console.log('Playing:', currentSong.title, 'Ready state:', audioRef.current.readyState)
        await audioRef.current.play()
        setIsPlaying(true)
        setStatus('Playing')
        console.log('Play successful:', currentSong.title)
      }
    } catch (error) {
      console.error('Play error for', currentSong.title, ':', error)
      setStatus(`Failed: ${currentSong.title}`)
      setIsPlaying(false)
      
      // Try to reload the problematic song
      setTimeout(() => {
        console.log('Reloading audio element for:', currentSong.title)
        if (audioRef.current && currentSong) {
          audioRef.current.src = currentSong.url
          audioRef.current.load()
        }
      }, 1000)
    }
  }

  const nextSong = () => {
    if (playlist.length === 0) return
    
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentIndex(nextIndex)
    setCurrentSong(playlist[nextIndex])
    setIsPlaying(false) // Will attempt autoplay in useEffect
  }

  const previousSong = () => {
    if (playlist.length === 0) return
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setCurrentSong(playlist[prevIndex])
    setIsPlaying(false) // Will attempt autoplay in useEffect
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
    // Don't recreate playlist or stop music, just toggle the state
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    // Volume will be applied in useEffect
  }

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickProgress = clickX / rect.width
    const newTime = clickProgress * duration
    
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
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
          width: 280px !important;
          height: 40px !important;
        }
        
        .radio-widget.expanded {
          width: 320px;
          min-height: 140px;
          max-height: 140px;
        }
        
        .widget-header {
          background: rgba(30, 41, 59, 0.8);
          padding: 6px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: auto;
          border-bottom: 1px solid rgba(71, 85, 105, 0.3);
          gap: 10px;
        }
        
        .radio-widget.collapsed .widget-header {
          border-bottom: none;
          padding: 6px 10px;
        }
        
        .collapsed-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0; /* Allow text to shrink */
        }
        
        .collapsed-song-info {
          flex: 1;
          color: #f1f5f9;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0; /* Allow text to shrink */
          margin-right: 8px;
        }
        
        .collapsed-play-btn {
          background: #334155;
          border: 1px solid rgba(148, 163, 184, 0.6);
          color: #f1f5f9;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          min-width: 40px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0; /* Don't shrink the button */
          font-weight: 500;
        }
        
        .collapsed-play-btn:hover {
          background: #475569;
          border-color: rgba(148, 163, 184, 0.8);
          color: #ffffff;
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
          background: #334155;
          border: 1px solid rgba(148, 163, 184, 0.6);
          color: #f1f5f9;
          cursor: pointer;
          font-size: 16px;
          padding: 6px;
          border-radius: 4px;
          transition: all 0.2s;
          width: 32px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: bold;
        }
        
        .collapse-btn:hover {
          background: #475569;
          border-color: rgba(148, 163, 184, 0.8);
          color: #ffffff;
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

        .progress-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(71, 85, 105, 0.4);
          border-radius: 3px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #14b8a6;
          border-radius: 3px;
          transition: width 0.1s ease;
        }

        .time-display {
          color: #64748b;
          font-size: 10px;
          min-width: 35px;
          text-align: center;
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
              {currentSong ? truncateText(`${currentSong.artist} - ${currentSong.title}`, 35) : 'Loading...'}
            </div>
            <button className="collapsed-play-btn" onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
          
          {/* Expanded view - shows when expanded */}
          <div className="header-controls">
            <div className="controls">
              <button className="control-btn" onClick={previousSong}>
                ⏮ Prev
              </button>
              <button className="control-btn play-btn" onClick={togglePlay}>
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button className="control-btn" onClick={nextSong}>
                ⏭ Next
              </button>
              <button 
                className={`control-btn ${isShuffled ? 'active' : ''}`} 
                onClick={toggleShuffle}
              >
                🔀 Shuffle
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
                {currentSong?.artist || 'Click ▶ to start'}
              </div>
            </div>
          </div>

          <div className="progress-container">
            <span className="time-display">{formatTime(currentTime)}</span>
            <div className="progress-bar" onClick={handleProgressClick}>
              <div 
                className="progress-fill" 
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              ></div>
            </div>
            <span className="time-display">{formatTime(duration)}</span>
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
