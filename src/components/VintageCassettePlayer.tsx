import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Youtube,
  Tv,
  ExternalLink
} from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YOUTUBE_VIDEO_ID = '4vSzefD9oh4';
const YOUTUBE_URL = `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`;

export const VintageCassettePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [tapeCounter, setTapeCounter] = useState<number>(1);
  const [videoTitle] = useState<string>(
    'Tibetan Singing Bowl Meditation • 432Hz Sound Bath'
  );

  const playerRef = useRef<any>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize YouTube Iframe Player API
  useEffect(() => {
    // Check if script is already added
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player('youtube-stream-element', {
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              setIsPlayerReady(true);
              event.target.setVolume(volume * 100);
              const dur = event.target.getDuration();
              if (dur) setDuration(dur);
            },
            onStateChange: (event: any) => {
              // YT.PlayerState: PLAYING (1), PAUSED (2), ENDED (0), BUFFERING (3)
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                setIsPlaying(false);
              }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  // Update playback time and tape counter during playing
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const curr = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (curr !== undefined) {
            setCurrentTime(curr);
            setTapeCounter(Math.floor(curr) % 1000);
          }
          if (dur && dur !== duration) {
            setDuration(dur);
          }
        }
      }, 1000);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('YouTube player error:', e);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(newVol * 100);
      if (newVol > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const handleMuteToggle = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (playerRef.current) {
      if (nextMute) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume * 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekToTime = parseFloat(e.target.value);
    setCurrentTime(seekToTime);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seekToTime, true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      id="vintage-cassette-deck"
      className="fixed bottom-0 inset-x-0 z-50 p-2 sm:p-4 bg-gradient-to-t from-black/95 via-[#140e0a]/90 to-transparent pointer-events-none"
    >
      <div className="max-w-4xl mx-auto pointer-events-auto">
        {/* Visual YouTube Video Screen (Toggleable) */}
        <div
          className={`mb-3 p-3 rounded-2xl bg-black/90 border border-amber-500/30 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            showVideo ? 'block animate-in fade-in zoom-in-95' : 'h-0 p-0 border-0 m-0 opacity-0 overflow-hidden pointer-events-none'
          }`}
        >
          {showVideo && (
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs text-amber-300 font-['Space_Mono'] flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-red-500" /> YouTube Playlist Source
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#a1887f] hover:text-amber-300 flex items-center gap-1"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-xs text-[#a1887f] hover:text-[#f3e8d2] px-2 py-0.5 rounded bg-stone-900 border border-stone-800"
                >
                  Hide Screen
                </button>
              </div>
            </div>
          )}
          <div className="relative w-full aspect-video sm:h-64 rounded-xl overflow-hidden bg-black shadow-inner">
            {/* The single persistent YouTube iframe mount */}
            <div id="youtube-stream-element" className="w-full h-full" />
          </div>
        </div>

        {/* Main Glassmorphism Cassette Deck */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#1c130d]/85 border border-[#553b26]/70 p-3 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col gap-3 text-[#f3e8d2]">
          {/* Top Bar: Cassette Visualizer + Track Info + Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
            {/* Left: Compact Cassette Graphic */}
            <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto z-10">
              <div className="relative w-28 h-16 sm:w-36 sm:h-20 bg-gradient-to-br from-[#2b241e] to-[#120e0b] rounded-lg border border-[#553b26] p-1 shadow-md flex flex-col justify-between overflow-hidden shrink-0">
                {/* Tape Label */}
                <div className="w-full bg-[#f4ebd0] text-[#1c130d] px-1.5 py-0.5 rounded-sm flex items-center justify-between border-b border-[#a89984]">
                  <span className="text-[9px] sm:text-[10px] font-['Space_Mono'] font-bold tracking-tight truncate">
                    YOUTUBE STREAM
                  </span>
                  <span className="text-[8px] font-['Space_Mono'] bg-red-800 text-white px-1 rounded flex items-center gap-0.5">
                    <Youtube className="w-2 h-2 fill-current" /> 4vSzef
                  </span>
                </div>

                {/* Tape Reel Window & Spinning Spools */}
                <div className="w-full h-7 sm:h-9 bg-[#0d0a08] rounded border border-[#3e2d20] flex items-center justify-around px-2 relative">
                  {/* Left Spool */}
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-dashed border-amber-400/80 bg-[#1e1510] flex items-center justify-center transition-transform ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '3s' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>

                  {/* Magnetic Tape Ribbon Window */}
                  <div className="w-8 sm:w-12 h-2 bg-[#2d1b11] rounded-sm border border-amber-900/60" />

                  {/* Right Spool */}
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-dashed border-amber-400/80 bg-[#1e1510] flex items-center justify-center transition-transform ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '3s' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                </div>

                {/* Tape Running Status */}
                <div className="flex items-center justify-between text-[7px] text-[#a89984] font-['Space_Mono'] px-1">
                  <span>DOLBY 432Hz</span>
                  <span className={isPlaying ? 'text-amber-400 font-bold' : 'text-stone-600'}>
                    {isPlaying ? '● PLAYING' : '○ STOPPED'}
                  </span>
                </div>
              </div>

              {/* Track Info */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-['Marcellus',serif] text-sm sm:text-base text-[#fef08a] truncate max-w-[200px] sm:max-w-xs">
                    {videoTitle}
                  </span>
                  <span className="text-[10px] font-['Space_Mono'] bg-red-950/80 border border-red-700/60 text-red-300 px-1.5 rounded flex items-center gap-1">
                    <Youtube className="w-2.5 h-2.5" /> YT
                  </span>
                </div>
                <div className="text-xs text-[#bcaaa4] font-['Cormorant_Garamond',serif] italic truncate">
                  Meditation Music Playlist • Official YouTube Stream
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] font-['Space_Mono'] text-[#8d7b68]">
                  <span>TAPE #{String(tapeCounter).padStart(3, '0')}</span>
                  <span>
                    {formatTime(currentTime)} / {duration ? formatTime(duration) : '--:--'}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Playback Controls */}
            <div className="flex items-center gap-3 z-10">
              {/* Main Play/Pause Button */}
              <button
                id="main-play-pause-btn"
                onClick={togglePlay}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                  isPlaying
                    ? 'bg-gradient-to-br from-amber-500 to-amber-700 border-amber-300 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                    : 'bg-[#2a1d13] border-[#775031] text-[#fef08a] hover:bg-[#3d2a1b] hover:border-amber-400 hover:scale-105'
                }`}
                title={isPlaying ? 'Pause YouTube Music' : 'Play YouTube Music'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Toggle Video Screen Button */}
              <button
                id="toggle-video-screen-btn"
                onClick={() => setShowVideo(!showVideo)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-all ${
                  showVideo
                    ? 'bg-red-950/90 border-red-500 text-red-200'
                    : 'bg-[#25180f] border-[#443020] text-[#d7ccc8] hover:bg-[#332115] hover:text-red-300'
                }`}
                title="Toggle YouTube Video Screen"
              >
                <Tv className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">{showVideo ? 'Hide Video' : 'View Video'}</span>
              </button>
            </div>

            {/* Right: Master Volume Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end z-10">
              {/* Volume Icon & Slider */}
              <div className="flex items-center gap-2">
                <button
                  id="toggle-mute-btn"
                  onClick={handleMuteToggle}
                  className="text-[#a1887f] hover:text-amber-300 p-1"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 sm:w-28 accent-amber-400 cursor-pointer"
                  title="YouTube Audio Volume"
                />
              </div>
            </div>
          </div>

          {/* Bottom Scrubbing Progress Bar */}
          {duration > 0 && (
            <div className="w-full flex items-center gap-2 pt-1 border-t border-[#3d2b1b]/50">
              <span className="text-[10px] font-['Space_Mono'] text-[#a1887f] w-9 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-[#2a1d13] rounded-lg appearance-none cursor-pointer accent-amber-400"
                title="Seek audio track"
              />
              <span className="text-[10px] font-['Space_Mono'] text-[#a1887f] w-9">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
