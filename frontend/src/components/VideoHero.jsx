import { useEffect, useRef, useState } from "react";

// Poster-first video hero. If the video src fails we gracefully fall back to
// the poster image.
export const VideoHero = ({ children, poster, sources = [], className = "" }) => {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm && ref.current) { ref.current.pause(); setPlaying(false); }
  }, []);

  const toggleMute = () => {
    if (!ref.current) return;
    ref.current.muted = !ref.current.muted;
    setMuted(ref.current.muted);
  };
  const togglePlay = () => {
    if (!ref.current) return;
    if (ref.current.paused) { ref.current.play(); setPlaying(true); }
    else { ref.current.pause(); setPlaying(false); }
  };

  return (
    <div className={`relative min-h-[100vh] w-full overflow-hidden ${className}`} data-testid="video-hero">
      {videoOk && sources.length > 0 ? (
        <video
          ref={ref}
          autoPlay muted={muted} loop playsInline preload="metadata"
          poster={poster}
          onError={() => setVideoOk(false)}
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="hero-video"
        >
          {sources.map((s, i) => <source key={i} src={s.src} type={s.type} />)}
        </video>
      ) : (
        <img src={poster} alt="Aura Hotels" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 hero-overlay"></div>

      {/* Video controls (only visible when video is being used) */}
      {videoOk && sources.length > 0 && (
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
          <button onClick={togglePlay} className="w-10 h-10 rounded-full glass-dark text-white grid place-items-center hover:scale-105 transition-transform" aria-label={playing ? "Pause video" : "Play video"} data-testid="hero-play-toggle">
            <i className={`fa-solid fa-${playing ? "pause" : "play"} text-xs`}></i>
          </button>
          <button onClick={toggleMute} className="w-10 h-10 rounded-full glass-dark text-white grid place-items-center hover:scale-105 transition-transform" aria-label={muted ? "Unmute" : "Mute"} data-testid="hero-mute-toggle">
            <i className={`fa-solid fa-volume-${muted ? "xmark" : "high"} text-xs`}></i>
          </button>
        </div>
      )}

      {children}
    </div>
  );
};

export default VideoHero;
