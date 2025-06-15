'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface Song {
  title: string
  artist: string
  filename: string
  url: string
}

const MUSIC_PATH = '/';  // Files are directly in public/ folder
const SONGS = [
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

const AUTOPLAY_DELAY_MS = 2000;
const AUTOPLAY_EXTRA_DELAY_MS = 3000;
const ERROR_SKIP_DELAY_MS = 2000;
const RELOAD_DELAY_MS = 1000;
const MAX_SONG_INFO_LENGTH = 40;
const COLLAPSED_SONG_INFO_LENGTH = 35;

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function truncateText(text: string, maxLength: number = MAX_SONG_INFO_LENGTH) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

type AudioStatus = 'Ready' | 'Loading...' | 'Playing' | 'Paused' | string;

function useAudioPlayer(
  playlist: Song[],
  currentIndex: number,
  volume: number,
  onSongEnd: () => void,
  onError: (msg: string) => void,
  isPlaying: boolean,
  setIsPlaying: (v: boolean) => void,
  setStatus: (s: AudioStatus) => void
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = playlist[currentIndex] || null;

  // Stable event handlers
  const handleSongEnd = useCallback(() => {
    onSongEnd();
  }, [onSongEnd]);

  const handleLoadStart = useCallback(() => {
    setStatus('Loading...');
  }, [setStatus]);

  const handleCanPlay = useCallback(() => {
    setStatus('Ready');
  }, [setStatus]);

  const handleError = useCallback((e: Event) => {
    const error = e.target as HTMLAudioElement;
    onError(`Error: ${currentSong?.title || 'Unknown'}`);
    setIsPlaying(false);
    setTimeout(() => {
      onSongEnd();
    }, ERROR_SKIP_DELAY_MS);
  }, [onError, currentSong, setIsPlaying, onSongEnd]);

  const handleLoadedData = useCallback(() => {}, []);

  // Setup audio element on song change
  useEffect(() => {
    if (!currentSong) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('ended', handleSongEnd);
      audioRef.current.removeEventListener('loadstart', handleLoadStart);
      audioRef.current.removeEventListener('canplay', handleCanPlay);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.removeEventListener('loadeddata', handleLoadedData);
    }
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audio.volume = volume / 100;
    audio.src = currentSong.url;
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);
    audioRef.current = audio;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
    };
  }, [currentSong, volume, handleSongEnd, handleLoadStart, handleCanPlay, handleError, handleLoadedData]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Play/pause logic
  const play = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      if (audioRef.current.readyState < 2) {
        setStatus('Loading...');
        audioRef.current.addEventListener('canplay', async () => {
          try {
            await audioRef.current!.play();
            setIsPlaying(true);
            setStatus('Playing');
          } catch {
            setStatus('Play failed');
          }
        }, { once: true });
        return;
      }
      await audioRef.current.play();
      setIsPlaying(true);
      setStatus('Playing');
    } catch {
      setStatus('Click ▶ to start');
      setIsPlaying(false);
    }
  }, [setIsPlaying, setStatus]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setStatus('Paused');
    }
  }, [setIsPlaying, setStatus]);

  // Autoplay on song change
  useEffect(() => {
    if (currentSong && !isPlaying) {
      const timer = setTimeout(() => {
        play();
      }, AUTOPLAY_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [currentSong, isPlaying, play]);

  return { audioRef, play, pause, currentSong };
}

function SongInfo({ song }: { song: Song | null }) {
  return (
    <div className="song-info">
      <div className="song-title">{song?.title || 'Ready to play'}</div>
      <div className="song-artist">{song?.artist || 'Click ▶ to start'}</div>
    </div>
  );
}

function VolumeControl({ volume, onChange }: { volume: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="volume-container">
      <span className="volume-icon">♪</span>
      <input
        type="range"
        className="volume-slider"
        min="0"
        max="100"
        value={volume}
        onChange={onChange}
      />
      <span className="volume-label">{volume}%</span>
    </div>
  );
}

export function RadioWidget() {
  const [isCollapsed, setIsCollapsed] = useState(true)  
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)  
  const [status, setStatus] = useState<AudioStatus>('Ready')
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShuffled, setIsShuffled] = useState(true)
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set())
  
  // Initialize playlist
  useEffect(() => {
    let songs = SONGS.map(song => ({ ...song, url: MUSIC_PATH + song.filename }))
    
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
    
    if (isShuffled) {
      // Shuffle the playlist
      songs = shuffleArray(songs)
    }
    
    setPlaylist(songs)
    if (songs.length > 0) {
      setCurrentIndex(0)
      setStatus(`Loaded ${songs.length} songs`)
      setFailedIndexes(new Set())
    }
  }, [isShuffled])

  // Derive currentSong
  const currentSong = playlist[currentIndex] || null

  // Audio logic
  const onSongEnd = useCallback(() => {
    if (playlist.length === 0) return
    let nextIdx = currentIndex + 1
    let attempts = 0
    while (attempts < playlist.length) {
      if (nextIdx >= playlist.length) nextIdx = 0
      if (!failedIndexes.has(nextIdx)) break
      nextIdx++
      attempts++
    }
    setCurrentIndex(nextIdx)
    setIsPlaying(false)
  }, [playlist.length, currentIndex, failedIndexes])

  const onError = useCallback((msg: string) => {
    setStatus(msg)
    setIsPlaying(false)
    setFailedIndexes(prev => new Set(prev).add(currentIndex))
  }, [currentIndex])

  const { play, pause } = useAudioPlayer(
    playlist,
    currentIndex,
    volume,
    onSongEnd,
    onError,
    isPlaying,
    setIsPlaying,
    setStatus
  )

  // UI event handlers
  const toggleWidget = useCallback(() => setIsCollapsed(c => !c), [])

  const togglePlay = useCallback(() => {
    if (!currentSong) {
      setStatus('No song selected')
      return
    }
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [currentSong, isPlaying, play, pause])

  const nextSong = useCallback(() => {
    if (playlist.length === 0) return
    let nextIdx = currentIndex + 1
    if (nextIdx >= playlist.length) nextIdx = 0
    setCurrentIndex(nextIdx)
    setIsPlaying(false)
  }, [playlist.length, currentIndex])

  const toggleShuffle = useCallback(() => setIsShuffled(s => !s), [])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value))
  }, [])

  // Guard for empty playlist
  if (playlist.length === 0) {
    return (
      <div className="radio-widget collapsed" id="radioWidget">
        <div className="widget-header">
          <div className="collapsed-controls">
            <div className="collapsed-song-info">No songs found</div>
            <button className="collapsed-play-btn" disabled>▶</button>
          </div>
          <button className="collapse-btn" onClick={toggleWidget}>+</button>
        </div>
        <div className="widget-content">
          <div className="now-playing">No songs available</div>
        </div>
      </div>
    )
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
          min-height: 120px;
          max-height: 120px;
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
              {currentSong ? truncateText(`${currentSong.artist} - ${currentSong.title}`, COLLAPSED_SONG_INFO_LENGTH) : 'Loading...'}
            </div>
            <button className="collapsed-play-btn" onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
          
          {/* Expanded view - shows when expanded */}
          <div className="header-controls">
            <div className="controls">
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
            <SongInfo song={currentSong} />
          </div>
          
          <VolumeControl volume={volume} onChange={handleVolumeChange} />
          
          <div className={`status ${status === 'Playing' ? 'success' : status === 'Error loading' ? 'error' : ''}`}>
            {status}
          </div>
        </div>
      </div>
    </>
  )
}
