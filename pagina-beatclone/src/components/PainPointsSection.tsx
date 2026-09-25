import { motion } from 'motion/react';
import { Flame, Sparkles, Users, Zap } from 'lucide-react';

interface PainPointsSectionProps {
  onCtaClick?: () => void;
}

export default function PainPointsSection({ onCtaClick }: PainPointsSectionProps) {
  return (
    <section id="pain-points" className="relative flex flex-col justify-center items-center px-5 sm:px-6 py-14 overflow-hidden border-b border-white/5 bg-[#010000]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-[#0066FF]/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-10 right-4 w-[180px] h-[180px] bg-red-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-[440px] mx-auto mb-8 z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-2xl sm:text-3xl font-black text-white leading-tight uppercase tracking-tight"
        >
          PARE DE COMPETIR EM DESVANTAGEM
        </motion.h2>
      </div>

      {/* Styled Copy Cards */}
      <div className="flex flex-col gap-3.5 w-full max-w-[440px] z-10">
        {/* Item 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="p-4.5 sm:p-5 rounded-2xl bg-[#121212]/90 border border-white/5 hover:border-red-500/20 transition-all duration-300 flex items-start gap-3.5"
        >
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
            <Flame size={18} />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">
            Enquanto você tá procurando beat, tem gente <strong className="text-white font-semibold">com metade do seu talento</strong> postando música todo o dia <span className="text-red-400 font-semibold">e crescendo</span>.
          </p>
        </motion.div>

        {/* Item 2 - Destaque */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#121212] to-[#121212] border border-[#0066FF]/30 shadow-[0_4px_20px_rgba(0,102,255,0.12)] flex items-start gap-3.5"
        >
          <div className="w-8 h-8 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#38bdf8] shrink-0 mt-0.5 shadow-[0_0_12px_rgba(0,102,255,0.25)]">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-1">A realidade do jogo</p>
            <p className="text-[#38bdf8] text-base sm:text-lg font-display font-extrabold tracking-tight leading-snug">
              A diferença não é talento, <br className="hidden sm:inline" />
              <span className="text-white">é criar músicas em massa.</span>
            </p>
          </div>
        </motion.div>

        {/* Item 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="p-4.5 sm:p-5 rounded-2xl bg-[#121212]/90 border border-white/5 hover:border-[#0066FF]/20 transition-all duration-300 flex items-start gap-3.5"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <Users size={18} />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">
            Grandes rappers investem <strong className="text-white">dezenas de milhares de reais</strong> para produzirem beats, e agora você pode ter um <span className="text-[#38bdf8] font-semibold">gerador de beats que faz o mesmo</span> sem precisar investir tanto.
          </p>
        </motion.div>

        {/* Item 4 - Fechamento Objetivo */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.24 }}
          onClick={onCtaClick}
          className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-[#0066FF]/15 to-[#0066FF]/5 border border-[#0066FF]/30 text-center flex items-center justify-center gap-2 cursor-pointer hover:border-[#0066FF]/60 transition-all group"
        >
          <Zap size={16} className="text-[#0066FF] group-hover:scale-110 transition-transform" />
          <p className="text-white font-display font-bold text-sm sm:text-[15px] tracking-tight">
            Escolha o Beat e <span className="text-[#38bdf8] font-extrabold">crie uma versão melhorada com I.A</span> agora mesmo!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
