'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface Song {
  title: string
  artist: string
  filename: string
  url: string
  genre: string
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function RadioWidget() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [volume, setVolume] = useState(50)
  const [status, setStatus] = useState('Ready')
  const [allSongs, setAllSongs] = useState<Song[]>([])
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShuffled, setIsShuffled] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeGenre, setActiveGenre] = useState('All')
  const [genres, setGenres] = useState<string[]>([])
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasAutoPlayed = useRef(false)
  const wasPlayingRef = useRef(false)

  const applyFilter = useCallback((songs: Song[], genre: string, shuffle: boolean) => {
    let filtered = genre === 'All' ? songs : songs.filter(s => s.genre === genre)
    if (shuffle) {
      filtered = shuffleArray(filtered)
    }
    return filtered
  }, [])

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

        setAllSongs(songs)

        const uniqueGenres = Array.from(new Set(songs.map(s => s.genre).filter(Boolean)))
        setGenres(uniqueGenres)
        
        const finalPlaylist = applyFilter(songs, 'All', isShuffled)
        
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
  }, [])

  useEffect(() => {
    if (!currentSong) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }

    const audio = new Audio()
    audio.preload = "metadata"
    audio.volume = volume / 100
    audio.src = currentSong.url

    audio.addEventListener('ended', () => nextSong())
    audio.addEventListener('loadstart', () => setStatus('Loading...'))
    audio.addEventListener('canplay', () => setStatus('Ready'))
    audio.addEventListener('error', (e) => {
      console.error('Audio error for:', currentSong.title, e)
      setStatus(`File not found: ${currentSong.title}`)
      setIsPlaying(false)
    })
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })
    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration)
      } else {
        setDuration(0)
      }
    })

    audioRef.current = audio

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
    const nextIdx = (currentIndex + 1) % playlist.length
    setCurrentIndex(nextIdx)
    setCurrentSong(playlist[nextIdx])
    
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
    const prevIdx = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    setCurrentIndex(prevIdx)
    setCurrentSong(playlist[prevIdx])
    
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
      const currentSongObj = currentSong
      const otherSongs = playlist.filter((_, index) => index !== currentIndex)
      const shuffledOthers = shuffleArray(otherSongs)
      const newPlaylist = currentSongObj ? [currentSongObj, ...shuffledOthers] : shuffledOthers
      setPlaylist(newPlaylist)
      setCurrentIndex(0)
    } else {
      const filtered = applyFilter(allSongs, activeGenre, false)
      setPlaylist(filtered)
      const newIndex = filtered.findIndex(s => s.filename === currentSong?.filename)
      setCurrentIndex(newIndex >= 0 ? newIndex : 0)
    }
  }

  const handleGenreChange = (genre: string) => {
    setActiveGenre(genre)
    wasPlayingRef.current = isPlaying

    const filtered = applyFilter(allSongs, genre, isShuffled)
    setPlaylist(filtered)

    if (filtered.length > 0) {
      const currentInFiltered = currentSong
        ? filtered.findIndex(s => s.filename === currentSong.filename)
        : -1

      if (currentInFiltered >= 0) {
        setCurrentIndex(currentInFiltered)
      } else {
        setCurrentIndex(0)
        setCurrentSong(filtered[0])
        if (wasPlayingRef.current) {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                setIsPlaying(true)
                setStatus('Playing')
              }).catch(() => {
                setIsPlaying(false)
                setStatus('Click ▶ to start')
              })
            }
          }, 500)
        }
      }
      setStatus(`${genre === 'All' ? 'All' : genre}: ${filtered.length} songs`)
    } else {
      setCurrentSong(null)
      setCurrentIndex(0)
      setStatus('No songs in this genre')
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
          min-height: 180px;
          max-height: 220px;
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
          margin-bottom: 8px;
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

        .genre-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .genre-tab {
          background: #1e293b;
          border: 1px solid rgba(71, 85, 105, 0.4);
          color: #94a3b8;
          padding: 2px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 10px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .genre-tab:hover {
          background: #334155;
          color: #f1f5f9;
        }

        .genre-tab.active {
          background: #0f766e;
          border-color: #14b8a6;
          color: #f0fdfa;
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

          .genre-tab {
            font-size: 9px !important;
            padding: 2px 6px !important;
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

          {genres.length > 0 && (
            <div className="genre-tabs">
              <button
                className={`genre-tab ${activeGenre === 'All' ? 'active' : ''}`}
                onClick={() => handleGenreChange('All')}
              >
                All
              </button>
              {genres.map(genre => (
                <button
                  key={genre}
                  className={`genre-tab ${activeGenre === genre ? 'active' : ''}`}
                  onClick={() => handleGenreChange(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}

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
