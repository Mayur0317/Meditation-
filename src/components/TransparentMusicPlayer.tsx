import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YOUTUBE_VIDEO_ID = '4vSzefD9oh4';

interface TransparentMusicPlayerProps {
  isVisible?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onUserInteract?: () => void;
}

export const TransparentMusicPlayer: React.FC<TransparentMusicPlayerProps> = ({
  isVisible = true,
  onPlayStateChange,
  onUserInteract
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Initialize YouTube Iframe Player API for background streaming
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player('youtube-stream-audio-element', {
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(85);
              const dur = event.target.getDuration();
              if (dur) setDuration(dur);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                onPlayStateChange?.(true);
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                setIsPlaying(false);
                onPlayStateChange?.(false);
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

  // Update playback time during playback
  useEffect(() => {
    if (isPlaying && !isScrubbing) {
      progressTimerRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const curr = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (curr !== undefined) {
            setCurrentTime(curr);
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
  }, [isPlaying, isScrubbing, duration]);

  const togglePlay = () => {
    onUserInteract?.();
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        onPlayStateChange?.(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
        onPlayStateChange?.(true);
      }
    } catch (e) {
      console.error('YouTube player error:', e);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onUserInteract?.();
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTo = pos * duration;
    setCurrentTime(seekTo);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seekTo, true);
    }
  };

  const handleMouseMoveProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    onUserInteract?.();
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverTime(pos * duration);
  };

  const handleMouseLeaveProgress = () => {
    setHoverTime(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hoverPercent = hoverTime !== null && duration > 0 ? (hoverTime / duration) * 100 : null;

  return (
    <>
      {/* Background YouTube Audio Stream Anchor - Never Unmounted */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
        <div id="youtube-stream-audio-element" />
      </div>

      {/* Disappearing Transparent Music Player Controls on Play / Cursor Inactivity */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full px-4 sm:px-8 pointer-events-auto flex flex-col items-center select-none"
          >
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-4 text-[#fdf8ee]">
              {/* Glowing Transparent Play/Pause Button */}
              <div className="flex items-center justify-center">
                <motion.button
                  id="main-play-pause-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlay}
                  className={`relative group w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border transition-all duration-500 shadow-2xl backdrop-blur-xs ${
                    isPlaying
                      ? 'bg-amber-400/15 border-amber-400/80 text-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.5)]'
                      : 'bg-black/15 hover:bg-white/10 border-white/30 hover:border-amber-400/80 text-[#fdf8ee] shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                  }`}
                  title={isPlaying ? 'Pause (Space / P)' : 'Play (Space / P)'}
                >
                  {/* Expanding Ripple Rings when Playing */}
                  {isPlaying && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full border-2 border-amber-400/50 pointer-events-none"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2.8, delay: 0.6, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full border border-amber-400/30 pointer-events-none"
                      />
                    </>
                  )}

                  {isPlaying ? (
                    <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current transition-transform group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                  ) : (
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 transition-transform group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                  )}
                </motion.button>
              </div>

              {/* Responsive Full-Width Transparent Progress Bar with Timestamps */}
              <div className="w-full flex items-center gap-3 sm:gap-4 mt-1">
                {/* Current Time Elapsed */}
                <span className="text-xs sm:text-sm font-['Space_Mono'] text-[#fdf8ee]/80 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] w-12 sm:w-16 tracking-wider select-none shrink-0 text-left">
                  {formatTime(currentTime)}
                </span>

                {/* Transparent Progress Bar Track with Hover Scrubbing */}
                <div
                  ref={progressBarRef}
                  onClick={handleProgressBarClick}
                  onMouseMove={handleMouseMoveProgress}
                  onMouseLeave={handleMouseLeaveProgress}
                  className="relative flex-1 py-3 cursor-pointer group/progress select-none"
                >
                  {/* Timestamp Hover Tooltip */}
                  {hoverTime !== null && hoverPercent !== null && (
                    <div
                      className="absolute -top-7 transform -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-black/80 border border-amber-400/50 text-[11px] font-['Space_Mono'] text-amber-300 shadow-lg pointer-events-none backdrop-blur-md transition-all drop-shadow"
                      style={{ left: `${hoverPercent}%` }}
                    >
                      {formatTime(hoverTime)}
                    </div>
                  )}

                  {/* Transparent Background Track */}
                  <div className="w-full h-1.5 sm:h-2 rounded-full bg-white/20 group-hover/progress:bg-white/30 backdrop-blur-sm overflow-hidden transition-all duration-300 relative shadow-inner">
                    {/* Hover indicator track */}
                    {hoverPercent !== null && (
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-white/30 rounded-full pointer-events-none"
                        style={{ width: `${hoverPercent}%` }}
                      />
                    )}

                    {/* Active Filled Progress Bar */}
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.8)] transition-all duration-150 relative"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Glowing Thumb Knob on Hover */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-300 border-2 border-stone-950 shadow-[0_0_12px_rgba(245,158,11,0.9)] opacity-0 group-hover/progress:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `calc(${progressPercent}% - 8px)` }}
                  />
                </div>

                {/* Total Duration */}
                <span className="text-xs sm:text-sm font-['Space_Mono'] text-[#fdf8ee]/80 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] w-12 sm:w-16 text-right tracking-wider select-none shrink-0">
                  {duration ? formatTime(duration) : '--:--'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
