import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLiveTypeBeats } from '../lib/supabaseMedia';

interface TypeBeatsSectionProps {
  onCtaClick?: () => void;
}

interface PlayerItem {
  id: string;
  type: 'original' | 'clone';
  tag: string;
  title: string;
  subtitle: string;
  cover: string;
  audioUrl: string;
  beatId: string;
}

export default function TypeBeatsSection({ onCtaClick }: TypeBeatsSectionProps) {
  const { beats, audioPool } = useLiveTypeBeats();
  const [activePlayKey, setActivePlayKey] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const playersList: PlayerItem[] = [
    // Par 1: Playboi Carti
    {
      id: 'player-1-playboi-original',
      type: 'original',
      tag: 'Original',
      title: '[FREE] Beat Type Playboi Carti "Noturno"',
      subtitle: 'Retirado do Youtube com Direitos Autorais.',
      cover: 'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/beatsCapa/PlayboiAntes.png',
      audioUrl: 'https://pub-77b507c58a5640869754c46ba3b90061.r2.dev/PlayboiAntes.WAV',
      beatId: 'playboi-antes'
    },
    {
      id: 'player-2-playboi-ia',
      type: 'clone',
      tag: 'Recriado com I.A',
      title: '[FREE] Beat Type Playboi Carti "Noturno"',
      subtitle: 'Recriado pela BeatClone 100% Livre de Direitos Autorais.',
      cover: 'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/beatsCapa/PlayboiDepois.png',
      audioUrl: 'https://pub-77b507c58a5640869754c46ba3b90061.r2.dev/PlayboiRecriado.WAV',
      beatId: 'playboi-recriado'
    },
    // Par 2: Rockstar Brandão
    {
      id: 'player-3-brandao-original',
      type: 'original',
      tag: 'Original',
      title: 'Rockstar Brandão Instrumental',
      subtitle: 'Retirado da música do Brandão.',
      cover: 'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/beatsCapa/BrandaoAntes.png',
      audioUrl: 'https://pub-77b507c58a5640869754c46ba3b90061.r2.dev/BrandaoAntes.WAV',
      beatId: 'brandao-antes'
    },
    {
      id: 'player-4-brandao-ia',
      type: 'clone',
      tag: 'Recriado com I.A',
      title: 'Rockstar Brandão Instrumental',
      subtitle: 'Recriado pela BeatClone 100% Livre de Direitos Autorais.',
      cover: 'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/beatsCapa/BrandaoDepois.png',
      audioUrl: 'https://pub-77b507c58a5640869754c46ba3b90061.r2.dev/BrandaoRecriado.WAV',
      beatId: 'brandao-recriado'
    }
  ];

  const handlePlayToggle = (player: PlayerItem) => {
    // If clicking on active player, pause it
    if (activePlayKey === player.id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      setActivePlayKey(null);
      return;
    }

    // Stop current playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    setCurrentTime(0);

    const attachListeners = (audio: HTMLAudioElement) => {
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime || 0);
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };
      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };
      audio.onended = () => {
        setActivePlayKey(null);
        setCurrentTime(0);
      };
    };

    const pooled = audioPool.current.get(player.beatId);
    if (pooled) {
      pooled.currentTime = 0;
      attachListeners(pooled);
      pooled.play().then(() => {
        currentAudioRef.current = pooled;
        setActivePlayKey(player.id);
        if (pooled.duration && !isNaN(pooled.duration)) {
          setDuration(pooled.duration);
        }
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    } else {
      const audio = new Audio(player.audioUrl);
      attachListeners(audio);
      audio.play().then(() => {
        currentAudioRef.current = audio;
        setActivePlayKey(player.id);
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>, player: PlayerItem) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    if (activePlayKey === player.id && currentAudioRef.current) {
      const targetTime = clickPos * (currentAudioRef.current.duration || duration || 30);
      currentAudioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    } else {
      // Start playing and seek
      handlePlayToggle(player);
      setTimeout(() => {
        if (currentAudioRef.current) {
          const targetTime = clickPos * (currentAudioRef.current.duration || 30);
          currentAudioRef.current.currentTime = targetTime;
          setCurrentTime(targetTime);
        }
      }, 50);
    }
  };

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const el = document.getElementById('plans');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="type-beats" 
      className="relative flex flex-col justify-center items-center px-5 sm:px-6 py-16 overflow-hidden border-b border-white/5 bg-[#010000]"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[#0066FF]/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-[460px] mx-auto mb-8 z-10">
        <div className="inline-flex items-center gap-1.5 bg-[#0066FF]/15 text-[#38bdf8] border border-[#0066FF]/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
          <Sparkles size={11} />
          <span>Tecnologia BeatClone I.A</span>
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-display text-2xl sm:text-3xl font-black text-white leading-tight uppercase tracking-tight"
        >
          Original x Recriado com a BeatClone:
        </motion.h2>
      </div>

      {/* 4 Minimalist Players: 1 Original x 1 Recriado por I.A, 1 Original x 1 Recriado por I.A */}
      <div className="flex flex-col gap-4 w-full max-w-[460px] z-10 mb-8">
        {playersList.map((player, idx) => {
          const isPlaying = activePlayKey === player.id;
          const isOriginal = player.type === 'original';
          const progressPercent = isPlaying && duration > 0 ? (currentTime / duration) * 100 : 0;

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              onClick={() => handlePlayToggle(player)}
              className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                isOriginal
                  ? isPlaying
                    ? 'bg-gradient-to-r from-red-950/40 via-[#141212] to-[#121212] border-red-500 shadow-[0_12px_35px_rgba(239,68,68,0.35)]'
                    : 'bg-[#121212]/95 border-red-500/35 hover:border-red-500/60 shadow-[0_8px_25px_rgba(239,68,68,0.2)] hover:shadow-[0_12px_30px_rgba(239,68,68,0.3)]'
                  : isPlaying
                    ? 'bg-gradient-to-r from-[#0066FF]/25 via-[#0d182b] to-[#121212] border-[#0066FF] shadow-[0_12px_35px_rgba(0,102,255,0.45)]'
                    : 'bg-[#121212]/95 border-[#0066FF]/40 hover:border-[#0066FF]/70 shadow-[0_8px_25px_rgba(0,102,255,0.22)] hover:shadow-[0_12px_30px_rgba(0,102,255,0.35)]'
              }`}
            >
              {/* Main Player Row */}
              <div className="flex items-center gap-3.5">
                {/* Photo / Artwork */}
                <div className={`relative w-15 h-15 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border ${
                  isOriginal 
                    ? 'border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.25)]' 
                    : 'border-[#0066FF]/50 shadow-[0_0_12px_rgba(0,102,255,0.3)]'
                }`}>
                  <img 
                    src={player.cover} 
                    alt={player.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/15" />
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      isOriginal 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                        : 'bg-[#0066FF]/25 text-[#38bdf8] border-[#0066FF]/40'
                    }`}>
                      {isOriginal ? (
                        <AlertCircle size={10} className="shrink-0" />
                      ) : (
                        <CheckCircle2 size={10} className="shrink-0 text-[#38bdf8]" />
                      )}
                      {player.tag}
                    </span>
                    {!isOriginal && (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Livre</span>
                    )}
                  </div>

                  <h3 className="font-display font-black text-white text-sm sm:text-[15px] leading-snug truncate">
                    {player.title}
                  </h3>
                  <p className={`text-[11px] font-sans truncate mt-0.5 ${
                    isOriginal ? 'text-red-300/80' : 'text-[#38bdf8]/90 font-medium'
                  }`}>
                    {player.subtitle}
                  </p>
                </div>

                {/* Play/Pause Button */}
                <button
                  type="button"
                  aria-label={isPlaying ? "Pausar" : "Tocar"}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer ${
                    isOriginal
                      ? isPlaying
                        ? 'bg-red-500 text-white scale-105 shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                        : 'bg-red-600/90 group-hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] group-hover:scale-105'
                      : isPlaying
                        ? 'bg-[#0066FF] text-white scale-105 shadow-[0_0_22px_rgba(0,102,255,0.9)]'
                        : 'bg-[#0066FF] group-hover:bg-[#1a75ff] text-white shadow-[0_0_16px_rgba(0,102,255,0.5)] group-hover:scale-105'
                  }`}
                >
                  {isPlaying ? (
                    <Pause size={16} className="fill-current" />
                  ) : (
                    <Play size={16} className="fill-current translate-x-[1px]" />
                  )}
                </button>
              </div>

              {/* Sutil Linha do Tempo (Timeline) */}
              <div 
                className="mt-3 pt-2.5 border-t border-white/5 flex flex-col gap-1.5"
                onClick={(e) => handleSeek(e, player)}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={isOriginal ? (isPlaying ? 'text-red-400 font-bold' : 'text-gray-400') : (isPlaying ? 'text-[#38bdf8] font-bold' : 'text-gray-400')}>
                    {isPlaying ? formatTime(currentTime) : '0:00'}
                  </span>
                  
                  {isPlaying && (
                    <div className="flex items-end gap-[2px]">
                      {[0.6, 0.9, 0.7, 1.1, 0.8].map((s, i) => (
                        <motion.span
                          key={i}
                          className={`w-[2px] rounded-full ${isOriginal ? 'bg-red-500' : 'bg-[#0066FF]'}`}
                          animate={{ height: ['2px', '10px', '2px'] }}
                          transition={{ duration: s, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                  )}

                  <span className="text-gray-500">
                    {isPlaying ? formatTime(duration) : '0:30'}
                  </span>
                </div>

                {/* Sutil Barra de Progresso Interativa */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative group/bar hover:h-2 transition-all">
                  <div 
                    className={`h-full rounded-full transition-all duration-100 ${
                      isOriginal 
                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                        : 'bg-[#0066FF] shadow-[0_0_8px_rgba(0,102,255,0.8)]'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Brief Minimalist App Demo (Looping GIF-style, compact 4x4) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full flex justify-center mb-8 z-10"
      >
        <div className="w-[200px] sm:w-[220px] aspect-square relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-[0_12px_35px_rgba(0,0,0,0.8)]">
          <video
            src="https://pub-77b507c58a5640869754c46ba3b90061.r2.dev/DemoLooping.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-bottom block pointer-events-none select-none"
          />
        </div>
      </motion.div>

      {/* Prominent CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] text-center z-10"
      >
        <motion.button
          onClick={handleCta}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative group w-full bg-[#0066FF] hover:bg-[#1a75ff] text-white font-display font-extrabold text-sm sm:text-base py-4 px-6 rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(0,102,255,0.45)] hover:shadow-[0_0_35px_rgba(0,102,255,0.7)] hover:scale-[1.03] active:scale-[0.98] tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 overflow-hidden"
        >
          {/* Sutil brilho de varredura interativa */}
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 group-hover:left-[100%]" />
          
          <span className="relative z-10">GARANTIR MEU ACESSO</span>
          <ArrowRight size={18} className="relative z-10 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
        </motion.button>
      </motion.div>
    </section>
  );
}
