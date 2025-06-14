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
          width: 50px !important;
          height: 50px !important;
        }
        
        .radio-widget.expanded {
          width: 260px;
          min-height: 85px;
        }
        
        .widget-header {
          background: rgba(30, 41, 59, 0.8);
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          border-bottom: 1px solid rgba(71, 85, 105, 0.3);
        }
        
        .widget-title {
          color: #f1f5f9;
          font-size: 12px;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0.025em;
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
          padding: 12px;
          display: block;
        }
        
        .radio-widget.collapsed .widget-content {
          display: none;
        }
        
        .radio-widget.collapsed .widget-header {
          padding: 15px;
          justify-content: center;
          border: none;
        }
        
        .radio-widget.collapsed .widget-title {
          display: none;
        }
        
        .now-playing {
          margin-bottom: 10px;
        }
        
        .song-info {
          color: #f1f5f9;
          font-size: 11px;
          line-height: 1.3;
        }
        
        .song-title {
          font-weight: 500;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .song-artist {
          color: #94a3b8;
          font-size: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 30px;
          height: 26px;
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
          min-width: 40px;
        }
        
        .volume-container {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .volume-icon {
          color: #94a3b8;
          font-size: 12px;
          width: 14px;
        }
        
        .volume-slider {
          flex: 1;
          height: 3px;
          background: rgba(71, 85, 105, 0.4);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          appearance: none;
        }
        
        .volume-label {
          color: #64748b;
          font-size: 9px;
          min-width: 22px;
          text-align: right;
        }
        
        .status {
          color: #64748b;
          font-size: 9px;
          text-align: center;
          padding: 2px 0;
          margin-top: 4px;
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
