import { motion } from 'motion/react';
import { Check, X, Sparkles, ArrowRight } from 'lucide-react';

interface ComparisonSectionProps {
  onCtaClick?: () => void;
}

export default function ComparisonSection({ onCtaClick }: ComparisonSectionProps) {
  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const el = document.getElementById('plans');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const withoutBeatClone = [
    "Paga R$ 300 a R$ 2.000 por cada beat exclusivo.",
    "Divide royalties ou corre risco de strike de copyright.",
    "Fica semanas esperando beatmaker responder e entregar.",
    "Falta de constância por depender de terceiros.",
    "Preso a licenças limitadas que bloqueiam monetização."
  ];

  const withBeatClone = [
    "Transforma qualquer referência em beat autoral em segundos.",
    "100% dos direitos e royalties pra você monetizar.",
    "Crie e lance músicas em massa sem limites de download.",
    "I.A que reproduz a energia e estrutura das maiores referências.",
    "Acesso Vitalício por menos do que você pagaria num único beat."
  ];

  return (
    <section id="comparison" className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 py-16 overflow-hidden border-b border-white/5 bg-[#010000]">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-10 w-[200px] h-[200px] bg-red-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[250px] h-[250px] bg-[#0066FF]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-[440px] mx-auto mb-10 z-10">
        <div className="inline-flex items-center gap-1.5 bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#38bdf8] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          <Sparkles size={11} className="text-[#0066FF]" />
          <span>ANÁLISE COMPARATIVA</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight uppercase tracking-tight">
          COMPARATIVO DE ESCOLHA
        </h2>
      </div>

      {/* Grid container of two cards with high visual contrast */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-[380px] z-10">
        {/* Card ❌ Sem BeatClone */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-[20px] bg-[#121212]/80 border border-red-500/20 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-2.5 mb-5 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold">
              <X size={18} />
            </div>
            <div>
              <h3 className="font-display text-white text-base font-bold tracking-tight">
                Sem a BeatClone
              </h3>
              <p className="text-[11px] text-red-400 font-mono">Método lento e caro</p>
            </div>
          </div>

          <ul className="flex flex-col gap-3.5">
            {withoutBeatClone.map((item, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs text-white/50 font-sans">
                <span className="text-red-500 shrink-0 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Card ✅ Com BeatClone */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="p-6 rounded-[20px] bg-gradient-to-b from-[#0a1628] to-[#121212] border-2 border-[#0066FF] relative overflow-hidden shadow-[0_0_30px_rgba(0,102,255,0.25)]"
        >
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#0066FF]/20 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-2.5 mb-5 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#0066FF]/20 flex items-center justify-center text-[#38bdf8]">
              <Check size={18} className="stroke-[3]" />
            </div>
            <div>
              <h3 className="font-display text-white text-base font-bold tracking-tight">
                Com a BeatClone
              </h3>
              <p className="text-[11px] text-[#38bdf8] font-mono">Autonomia total com I.A</p>
            </div>
          </div>

          <ul className="flex flex-col gap-3.5">
            {withBeatClone.map((item, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs text-white font-sans font-medium">
                <span className="text-[#0066FF] font-bold shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Standardized Interactive CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[380px] mt-8 z-10 text-center"
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
