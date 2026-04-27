'use client'

import { useEffect, useState, useRef } from 'react'

interface Song {
  title: string
  artist: string
  filename: string
  url: string
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasAutoPlayed = useRef(false)

  // Initialize playlist from JSON file
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setStatus('Loading songs...')
        const response = await fetch('/songs.json')
        if (!response.ok) {
          throw new Error(`Failed to load songs.json: ${response.status}`)
        }
        
        const songs: Song[] = await response.json()
        console.log(`Loaded ${songs.length} songs from songs.json`)
        
        // Test file accessibility
        for (const song of songs) {
          try {
            const fileResponse = await fetch(song.url, { method: 'HEAD' })
            console.log(`"${song.title}" - ${fileResponse.ok ? 'Found' : 'Not found'} (${fileResponse.status})`)
            if (!fileResponse.ok) {
              console.warn(`File not accessible: ${song.url}`)
            }
          } catch (error) {
            console.error(`Error checking "${song.title}":`, error)
          }
        }
        
        let finalPlaylist = songs
        if (isShuffled) {
          finalPlaylist = [...songs]
          for (let i = finalPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [finalPlaylist[i], finalPlaylist[j]] = [finalPlaylist[j], finalPlaylist[i]]
          }
        }
        
        setPlaylist(finalPlaylist)
        if (finalPlaylist.length > 0) {
          setCurrentSong(finalPlaylist[0])
          setCurrentIndex(0)
          setStatus(`Loaded ${finalPlaylist.length} songs`)
        } else {
          setStatus('No songs found')
        }
        
      } catch (error) {
        console.error('Failed to load songs:', error)
        setStatus('Failed to load songs')
      }
    }
    
    loadSongs()
  }, []) // Only run once on mount

  // Handle song changes
  useEffect(() => {
    if (!currentSong) return

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }

    // Create new audio
    const audio = new Audio()
    audio.preload = "metadata"
    audio.volume = volume / 100
    audio.src = currentSong.url

    // Add event listeners
    audio.addEventListener('ended', () => nextSong())
    audio.addEventListener('loadstart', () => setStatus('Loading...'))
    audio.addEventListener('canplay', () => setStatus('Ready'))
    audio.addEventListener('error', (e) => {
      console.error('Audio error for:', currentSong.title, e)
      setStatus(`File not found: ${currentSong.title}`)
      setIsPlaying(false)
      // Don't auto-advance on error, let user manually skip
    })
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })
    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration)
        console.log(`Duration for "${currentSong.title}": ${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60).toString().padStart(2, '0')}`)
      } else {
        console.warn(`Invalid duration for "${currentSong.title}":`, audio.duration)
        setDuration(0)
      }
    })

    audioRef.current = audio

    // Autoplay only once on first load
    if (!hasAutoPlayed.current) {
      hasAutoPlayed.current = true
      setTimeout(() => {
        attemptAutoplay()
      }, 2000)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [currentSong])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const attemptAutoplay = async () => {
    if (!audioRef.current) return

    try {
      await audioRef.current.play()
      setIsPlaying(true)
      setStatus('Playing')
    } catch (error) {
      setStatus('Click ▶ to start')
      setIsPlaying(false)
    }
  }

  const toggleWidget = () => {
    setIsCollapsed(!isCollapsed)
  }

  const togglePlay = async () => {
    if (!audioRef.current) return

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
      setStatus('Play error')
      setIsPlaying(false)
    }
  }

  const nextSong = () => {
    if (playlist.length === 0) return
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentIndex(nextIndex)
    setCurrentSong(playlist[nextIndex])
    
    // Continue playing if we were playing
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true)
            setStatus('Playing')
          }).catch(() => {
            setIsPlaying(false)
            setStatus('Error')
          })
        }
      }, 500)
    }
  }

  const previousSong = () => {
    if (playlist.length === 0) return
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setCurrentSong(playlist[prevIndex])
    
    // Continue playing if we were playing
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true)
            setStatus('Playing')
          }).catch(() => {
            setIsPlaying(false)
            setStatus('Error')
          })
        }
      }, 500)
    }
  }

  const toggleShuffle = () => {
  const newShuffleState = !isShuffled
  setIsShuffled(newShuffleState)
  
  if (newShuffleState) {
    // Shuffle the playlist but keep current song at current position
    const currentSongObj = currentSong
    const otherSongs = playlist.filter((_, index) => index !== currentIndex)
    
    // Shuffle the other songs
    for (let i = otherSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherSongs[i], otherSongs[j]] = [otherSongs[j], otherSongs[i]]
    }
    
    // Put current song first, then shuffled songs
    const newPlaylist = [currentSongObj, ...otherSongs]
    setPlaylist(newPlaylist)
    setCurrentIndex(0)
  } else {
    // Restore original order - reload from JSON
    const loadOriginalOrder = async () => {
      try {
        const response = await fetch('/songs.json')
        const originalSongs = await response.json()
        setPlaylist(originalSongs)
        
        // Find current song in original playlist
        const newIndex = originalSongs.findIndex(song => 
          song.filename === currentSong?.filename
        )
        setCurrentIndex(newIndex >= 0 ? newIndex : 0)
      } catch (error) {
        console.error('Failed to restore original order:', error)
      }
    }
    loadOriginalOrder()
  }
}

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
  }

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
          top: 12px !important;
          left: 20px !important;
          z-index: 10000 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(12px);
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(148, 163, 184, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .radio-widget.collapsed {
          width: 260px !important;
          height: 36px !important;
        }
        
        .radio-widget.expanded {
          width: 380px;
          min-height: 140px;
          max-height: 140px;
        }
        
        .widget-header {
          background: rgba(30, 41, 59, 0.8);
          padding: 4px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: auto;
          border-bottom: 1px solid rgba(71, 85, 105, 0.3);
          gap: 10px;
        }
        
       .radio-widget.expanded {
  width: 380px;
  min-height: 150px;
  max-height: 150px;
}
        
        .collapsed-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }
        
        .collapsed-song-info {
          flex: 1;
          color: #f1f5f9;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
          margin-right: 6px;
        }
        
        .collapsed-play-btn {
          background: #334155;
          border: 1px solid rgba(148, 163, 184, 0.6);
          color: #f1f5f9;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          min-width: 36px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
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
        
        .collapse-btn {
          background: #334155;
          border: 1px solid rgba(148, 163, 184, 0.6);
          color: #f1f5f9;
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
          width: 28px;
          height: 24px;
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
          padding: 10px 12px 8px 12px;
          display: block;
        }
        
        .radio-widget.collapsed .widget-content {
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
        
        .volume-container {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 4px;
        }
        
        .volume-icon {
          color: #94a3b8;
          font-size: 12px;
          width: 14px;
        }
        
        .volume-slider {
          width: 110px;
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
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .radio-widget {
            top: 8px !important;
            left: 10px !important;
            right: 10px !important;
            width: auto !important;
          }
          
          .radio-widget.collapsed {
            width: auto !important;
            max-width: calc(100vw - 20px) !important;
          }
          
          .radio-widget.expanded {
            width: auto !important;
            max-width: calc(100vw - 20px) !important;
          }
        }
        
        @media (max-width: 480px) {
          .radio-widget {
            font-size: 13px;
          }
          
          .collapsed-song-info {
            font-size: 10px !important;
          }
          
          .control-btn {
            font-size: 10px !important;
            padding: 4px 6px !important;
            min-width: 30px !important;
            height: 24px !important;
          }
          
          .volume-slider {
            width: 70px !important;
          }
          
          .volume-container {
            gap: 6px !important;
          }
        }
      `}</style>
      <div className={`radio-widget ${isCollapsed ? 'collapsed' : 'expanded'}`} id="radioWidget">
        <div className="widget-header">
          <div className="collapsed-controls">
            <div className="collapsed-song-info">
              {currentSong ? truncateText(`${currentSong.artist} - ${currentSong.title}`, 32) : 'Loading...'}
            </div>
            <button className="collapsed-play-btn" onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
          
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
          
          <div className={`status ${status === 'Playing' ? 'success' : status.includes('not found') || status.includes('Error') ? 'error' : ''}`}>
            {status}
          </div>
        </div>
      </div>
    </>
  )
}
