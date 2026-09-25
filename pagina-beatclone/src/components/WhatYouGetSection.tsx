import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Layers, DollarSign } from 'lucide-react';

interface WhatYouGetSectionProps {
  onCtaClick?: () => void;
}

export default function WhatYouGetSection({ onCtaClick }: WhatYouGetSectionProps) {
  const deliverables = [
    {
      id: 'item-1',
      title: 'Direitos Comerciais 100% Seus',
      description: 'Monetize no Spotify, venda a faixa, use no YouTube ou em clientes. O lucro é todo seu.',
      badge: '100% SEU LUCRO',
      highlight: true,
      icon: <DollarSign size={18} className="text-emerald-400" />
    },
    {
      id: 'item-2',
      title: 'Clone a Estética, Não o Instrumental',
      description: 'Pegue a estrutura e atmosfera de qualquer referência sem correr o risco de strikes ou processos.',
      badge: '100% SEGURO',
      highlight: true,
      icon: <ShieldCheck size={18} className="text-[#0066FF]" />
    },
    {
      id: 'item-3',
      title: 'Stems e Pistas Separadas',
      description: 'Receba os elementos da música separados para editar, modificar ou rearranjar cada parte individualmente na sua DAW, como FL Studio ou Ableton.',
      badge: 'STEMS EDITÁVEIS',
      highlight: false,
      icon: <Layers size={18} className="text-violet-400" />
    }
  ];

  return (
    <section 
      id="o-que-voce-recebe" 
      className="relative flex flex-col justify-center items-center px-5 sm:px-6 py-16 overflow-hidden border-b border-white/5 bg-[#010000]"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[#0066FF]/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-4 w-[180px] h-[180px] bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Header Section */}
      <div className="text-center max-w-[440px] mx-auto mb-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#38bdf8] text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-[0_0_12px_rgba(0,102,255,0.15)]"
        >
          <Sparkles size={12} className="text-[#0066FF]" />
          <span>VANTAGENS EXCLUSIVAS</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-tight"
        >
          O QUE VOCÊ RECEBE:
        </motion.h2>
      </div>

      {/* List of Deliverables / Benefits Cards */}
      <div className="flex flex-col gap-3.5 w-full max-w-[440px] z-10">
        {deliverables.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
              item.highlight 
                ? 'bg-gradient-to-r from-[#0a1628] to-[#121212] border-[#0066FF]/30 shadow-[0_4px_20px_rgba(0,102,255,0.12)]' 
                : 'bg-[#121212]/90 border-white/5 hover:border-white/15'
            }`}
          >
            {/* Custom Icon Badge */}
            <div className="shrink-0 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mt-0.5 shadow-sm">
              {item.icon}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <h3 className="font-display font-bold text-white text-sm sm:text-[15px] leading-snug tracking-tight">
                  {item.title}
                </h3>
                <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5">
                  {item.badge}
                </span>
              </div>
              <p className="text-gray-300 text-xs sm:text-[13px] leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
