import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, CheckCircle2, X, Zap } from 'lucide-react';

export interface ActivityData {
  id: string;
  name: string;
  action: string;
  plan: string;
  time: string;
  location?: string;
}

// Easily editable mockup activity list
export const DEFAULT_ACTIVITIES: ActivityData[] = [
  {
    id: '1',
    name: 'André Pereira',
    action: 'acabou de adquirir o',
    plan: 'Plano PRO ⭐ (50% OFF)',
    time: 'há 1 minuto',
    location: 'São Paulo, SP'
  },
  {
    id: '2',
    name: 'Lucas Beatz',
    action: 'garantiu 50% OFF no',
    plan: 'Plano Premium',
    time: 'há 3 minutos',
    location: 'Rio de Janeiro, RJ'
  },
  {
    id: '3',
    name: 'Matheus Santos',
    action: 'acabou de assinar o',
    plan: 'Plano PRO ⭐ (50% OFF)',
    time: 'há 4 minutos',
    location: 'Belo Horizonte, MG'
  },
  {
    id: '4',
    name: 'Gabriel Rodrigues',
    action: 'aproveitou a oferta do',
    plan: 'Plano Basic',
    time: 'há 6 minutos',
    location: 'Curitiba, PR'
  },
  {
    id: '5',
    name: 'Felipe M. Producer',
    action: 'garantiu acesso vitalício no',
    plan: 'Plano PRO ⭐',
    time: 'há 8 minutos',
    location: 'Salvador, BA'
  }
];

interface SocialProofPopupProps {
  activities?: ActivityData[];
  intervalMs?: number;
}

export default function SocialProofPopup({
  activities = DEFAULT_ACTIVITIES,
  intervalMs = 6000
}: SocialProofPopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || activities.length === 0) return;

    // Initial show after 2 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Loop interval
    const cycleInterval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 800);

    }, intervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(cycleInterval);
    };
  }, [activities, intervalMs, dismissed]);

  if (dismissed || activities.length === 0) return null;

  const current = activities[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 max-w-[340px] w-[calc(100%-2rem)] pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-[#121212]/95 backdrop-blur-md border border-[#0066FF]/40 p-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,102,255,0.25)] flex items-start gap-3 relative overflow-hidden"
          >
            {/* Top gradient accent glow */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0066FF] to-transparent" />

            {/* Icon Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center shrink-0 text-[#38bdf8] shadow-inner mt-0.5">
              <Flame size={20} className="fill-[#0066FF] animate-pulse" />
            </div>

            {/* Info text */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-white leading-tight truncate">
                <span>{current.name}</span>
                <CheckCircle2 size={12} className="text-[#38bdf8] shrink-0" />
              </div>
              
              <p className="text-[11px] text-gray-300 font-sans leading-snug mt-0.5">
                {current.action} <span className="font-bold text-[#38bdf8]">{current.plan}</span>
              </p>

              <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Zap size={10} className="fill-current" />
                  Compra verificada
                </span>
                <span>•</span>
                <span>{current.time}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Fechar notificação"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
