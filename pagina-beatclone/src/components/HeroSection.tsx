import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Flame, CheckCircle, VolumeX, Volume2, Play } from 'lucide-react';
import { getTodayDateFormatted } from '../utils/dateUtils';

interface HeroSectionProps {
  onCtaClick?: () => void;
}

const BEATCLONE_LOGO_URL = 'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/BeatCloneLogo.png';
const VSL_VIDEO_URL = 'https://res.cloudinary.com/exjogwsw/video/upload/v1790301259/VslBeatCloneV1.mp4';

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  const todayDate = getTodayDateFormatted();
  const logo = BEATCLONE_LOGO_URL;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStartedWithSound, setHasStartedWithSound] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [smartProgress, setSmartProgress] = useState(0);

  // Guarantee autoplay muted on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Autoplay muted was restricted:', err);
      });
    }
  }, []);

  // Handler for clicking the popup: Reset video from 0, unmute, and play with sound
  const handleUnmuteAndReset = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      setSmartProgress(0);
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
      setIsMuted(false);
      setHasStartedWithSound(true);
    }
  };

  // Smart progress calculation: starts fast and uniformly decelerates towards the end
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total > 0) {
        const realRatio = Math.min(Math.max(current / total, 0), 1);
        // Uniform deceleration curve f(x) = 1 - (1 - x)^2
        const curvedProgress = (1 - Math.pow(1 - realRatio, 2)) * 100;
        setSmartProgress(curvedProgress);
      }
    }
  };

  const handleVideoClick = () => {
    if (!hasStartedWithSound) {
      handleUnmuteAndReset();
      return;
    }
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  return (
    <section id="hero" className="relative min-h-[95vh] flex flex-col justify-between items-center px-6 py-12 overflow-hidden border-b border-white/5 bg-[#010000]">
      {/* Absolute Ambient Background Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-[150px] h-[150px] bg-primary/10 rounded-full blur-[50px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="text-center max-w-[500px] mx-auto z-10 pt-4 flex flex-col items-center">
        {/* Logo / Brand above Headline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex items-center justify-center gap-2"
        >
          <img 
            src={logo} 
            alt="BeatClone" 
            className="h-9 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="font-display font-black text-xl tracking-wider text-white">
            BEAT<span className="text-[#0066FF]">CLONE</span>
          </span>
        </motion.div>

        {/* Promo Badge with today's date */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-4 inline-flex items-center gap-2 bg-[#0066FF]/15 text-[#38bdf8] border border-[#0066FF]/30 text-[11px] font-mono font-bold px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,102,255,0.2)]"
        >
          <Flame size={12} className="animate-pulse fill-[#0066FF] text-[#0066FF]" />
          <span>PROMOÇÃO ACESSO VITALÍCIO VÁLIDA ATÉ {todayDate}</span>
        </motion.div>

        {/* Requested Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-[1.25]"
        >
          Transforme qualquer Beat Autoral em uma versão sem direitos autorais com I.A.
        </motion.h1>

        {/* Requested Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 text-sm sm:text-base mt-4 font-sans leading-relaxed px-2 font-medium"
        >
          Sem perder qualidade. <strong className="text-white font-bold">100% Liberdade para Usar e Monetizar</strong>, e com <strong className="text-white font-bold">Stems Editáveis</strong> para modificar o que quiser.
        </motion.p>
      </div>

      {/* VSL Video Container (9:16 Aspect Ratio) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-[320px] sm:max-w-[340px] mt-7 mb-6 relative z-10 flex justify-center items-center"
      >
        {/* Glow behind video */}
        <div className="absolute inset-0 bg-[#0066FF]/25 rounded-3xl filter blur-2xl scale-95 z-0 pointer-events-none" />

        {/* Video Wrapper 9:16 */}
        <div 
          onClick={handleVideoClick}
          className="w-full aspect-[9/16] relative z-10 rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_15px_35px_rgba(0,102,255,0.3)] cursor-pointer group"
        >
          <video
            ref={videoRef}
            src={VSL_VIDEO_URL}
            autoPlay
            muted={isMuted}
            playsInline
            loop
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          />

          {/* Central Popup (when not started with sound) */}
          {!hasStartedWithSound && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleUnmuteAndReset();
              }}
              className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px] transition-opacity cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-[#0d0d0d]/90 border border-[#0066FF]/50 shadow-[0_0_35px_rgba(0,102,255,0.45)] backdrop-blur-md text-center max-w-[230px] hover:scale-105 active:scale-95 transition-transform duration-200">
                <span className="font-display font-bold text-white text-base leading-tight">
                  Vídeo já começou!
                </span>

                <div className="w-14 h-14 rounded-full bg-[#0066FF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,102,255,0.8)] animate-pulse">
                  <VolumeX size={26} className="text-white" />
                </div>

                <span className="font-sans font-semibold text-xs text-gray-200 tracking-wide">
                  Toque para ouvir.
                </span>
              </div>
            </div>
          )}

          {/* Paused Indicator (only after started with sound) */}
          {hasStartedWithSound && !isPlaying && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[1px] pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white">
                <Play size={24} className="fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Corner Mute / Unmute Button (available after user has started with sound) */}
          {hasStartedWithSound && (
            <button
              onClick={toggleMute}
              className="absolute bottom-3.5 right-3 z-30 p-2 rounded-full bg-black/75 hover:bg-black text-white border border-white/15 backdrop-blur-sm transition-all shadow-lg active:scale-90"
              title={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}

          {/* Smart Visual Timeline Bar (Blue Gradient) */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 bg-black/70 z-20 overflow-hidden pointer-events-none">
            <div 
              className="h-full bg-gradient-to-r from-[#004ecc] via-[#0066FF] to-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.8)] transition-[width] duration-200 ease-out"
              style={{ width: `${smartProgress}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Badges Stack Below VSL */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="flex flex-wrap gap-x-3 gap-y-2 justify-center items-center mb-4 max-w-lg z-10 text-[11px] font-mono text-gray-300 font-bold tracking-wider uppercase"
      >
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
          <CheckCircle size={12} className="text-[#0066FF]" /> Uso ilimitado
        </span>
        <span className="text-white/20 hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
          <CheckCircle size={12} className="text-[#0066FF]" /> Acesso Vitalício
        </span>
        <span className="text-white/20 hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
          <CheckCircle size={12} className="text-[#0066FF]" /> Autoria 100% sua
        </span>
      </motion.div>
    </section>
  );
}
