import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowRight, MessageCircle } from 'lucide-react';
import avatarKaven from '../../Midias/perfisDepoimentos/@kaven1.webp';
import avatarNyro from '../../Midias/perfisDepoimentos/@nyro.beats.webp';
import avatarYoungvren from '../../Midias/perfisDepoimentos/@youngvren.webp';
import avatarZyne from '../../Midias/perfisDepoimentos/@zyne.beatmaker.webp';

interface SocialProofSectionProps {
  onCtaClick?: () => void;
}

interface InstaComment {
  id: string;
  username: string;
  isVerified: boolean;
  avatarUrl: string;
  timeAgo: string;
  comment: string;
  likes: number;
  isLiked?: boolean;
}

const INSTA_COMMENTS: InstaComment[] = [
  {
    id: 'c1',
    username: '@kaven1',
    isVerified: true,
    avatarUrl: avatarKaven,
    timeAgo: '2 d',
    comment: 'Eu peguei a vibe de uma referência gringa que custava R$ 1.500 a licença. A BeatClone gerou uma versão inédita com a mesma pressão e 100% autoral em 30 segundos! 🔥',
    likes: 1420,
    isLiked: true
  },
  {
    id: 'c2',
    username: '@nyro.beats',
    isVerified: false,
    avatarUrl: avatarNyro,
    timeAgo: '4 d',
    comment: 'Gastava uma nota com beatmaker que demorava semanas. Com a BeatClone eu mesmo subo a referência, monto o som e já lancei no Spotify com 100% dos royalties pra mim 🚀',
    likes: 689,
    isLiked: true
  },
  {
    id: 'c3',
    username: '@youngvren',
    isVerified: true,
    avatarUrl: avatarYoungvren,
    timeAgo: '1 sem',
    comment: 'Acabou o bloqueio criativo no estúdio. A I.A capta a estrutura e os timbres perfeitamente mas entrega um beat novo pronto pra lançar. Já bati 80k de streams no single! 💥',
    likes: 924,
    isLiked: true
  },
  {
    id: 'c4',
    username: '@zyne.beatmaker',
    isVerified: false,
    avatarUrl: avatarZyne,
    timeAgo: '3 d',
    comment: 'A qualidade dos 808s e do mix é surreal. Ninguém diz que foi gerado com I.A. Direitos comerciais 100% meus, sem risco nenhum de strike no YouTube.',
    likes: 512,
    isLiked: true
  }
];

export default function SocialProofSection({ onCtaClick }: SocialProofSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slow continuous looping carousel timer (shifts smoothly every 4.8 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INSTA_COMMENTS.length);
    }, 4800);
    return () => clearInterval(timer);
  }, []);

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const element = document.getElementById('plans');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentComment = INSTA_COMMENTS[currentIndex];

  return (
    <section 
      id="social-proof" 
      className="relative flex flex-col justify-center items-center px-5 sm:px-6 py-14 overflow-hidden border-b border-white/5 bg-[#010000]"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[#0066FF]/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Header section with realistic proof copy */}
      <div className="text-center max-w-[440px] mx-auto mb-8 z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-display text-xl sm:text-2xl font-black text-white leading-tight uppercase tracking-tight"
        >
          Veja o que artistas e produtores estão falando da BeatClone:
        </motion.h2>
      </div>

      {/* Instagram Comment Box Mockup - Ultra Faithful to Instagram Dark UI */}
      <div className="w-full max-w-[440px] z-10">
        {/* Instagram Post Comments Window Frame */}
        <div className="rounded-2xl bg-[#0d0d0d] border border-[#262626] shadow-[0_8px_30px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Instagram Comment Header Bar */}
          <div className="px-4 py-2.5 bg-[#141414] border-b border-[#262626] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-gray-400" />
              <span className="text-[12px] font-semibold text-gray-200 tracking-tight font-sans">
                Comentários
              </span>
            </div>
            <span className="text-[11px] text-[#38bdf8] font-sans font-medium">
              BeatClone • Comunidade
            </span>
          </div>

          {/* Looping Comment Area */}
          <div className="p-4 sm:p-5 min-h-[125px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentComment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full flex items-start gap-3"
              >
                {/* Instagram Story Gradient Ring / Avatar */}
                <div className="relative shrink-0 mt-0.5">
                  <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5] flex items-center justify-center">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#0d0d0d] p-[1.5px] flex items-center justify-center">
                      <img 
                        src={currentComment.avatarUrl} 
                        alt={currentComment.username} 
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <p className="text-[13px] sm:text-[14px] text-[#f5f5f5] leading-snug font-sans break-words">
                    <span className="font-semibold text-white inline-flex items-center gap-1 mr-1.5 cursor-pointer hover:underline">
                      {currentComment.username}
                      {currentComment.isVerified && (
                        <svg className="w-3.5 h-3.5 text-[#0095f6] fill-current inline-block" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </span>
                    {currentComment.comment}
                  </p>

                  {/* Instagram Action Subline: Time • Curtidas • Responder */}
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-[#a8a8a8] font-sans font-medium">
                    <span>{currentComment.timeAgo}</span>
                    <span>{currentComment.likes} curtidas</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Responder</span>
                  </div>
                </div>

                {/* Heart Icon on Right */}
                <div className="shrink-0 flex flex-col items-center gap-1 pt-1 pl-1 cursor-pointer">
                  <Heart size={14} className="text-[#ff3040] fill-[#ff3040]" />
                  <span className="text-[10px] text-[#a8a8a8] font-sans">
                    {currentComment.likes > 999 ? `${(currentComment.likes / 1000).toFixed(1)}k` : currentComment.likes}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Standardized Interactive CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] mt-8 z-10 text-center"
      >
        <motion.button
          onClick={handleCta}
          id="btn-depoimentos-cta"
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
