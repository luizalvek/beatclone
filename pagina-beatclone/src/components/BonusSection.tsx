import { motion } from 'motion/react';
import { Gift, Sparkles, Users, TrendingUp, Layout, Lock } from 'lucide-react';
import { useLiveBonuses } from '../lib/supabaseMedia';

export default function BonusSection() {
  const bonuses = useLiveBonuses();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles size={24} className="text-[#0066FF]" />;
      case 'Users': return <Users size={24} className="text-[#0066FF]" />;
      case 'TrendingUp': return <TrendingUp size={24} className="text-[#0066FF]" />;
      case 'Layout': return <Layout size={24} className="text-[#0066FF]" />;
      default: return <Gift size={24} className="text-[#0066FF]" />;
    }
  };

  const getLabel = (id: string) => {
    if (id === 'bonus-1') return "TRAP LYRICS AI";
    if (id === 'bonus-2') return "COMUNIDADE VIP";
    if (id === 'bonus-3') return "DESAFIO 21 DIAS";
    return "MODELO DE PERFIS";
  };

  return (
    <section id="bonus" className="relative min-h-[95vh] flex flex-col justify-center items-center px-6 py-20 overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#010000] to-[#040814]">
      {/* Background decorations */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-[500px] mx-auto mb-12 z-10">
        <h2 className="font-display text-3xl font-extrabold text-white mt-2 leading-tight uppercase">
          Bônus Exclusivos
        </h2>
        <p className="text-white/50 text-sm mt-3 font-sans leading-relaxed">
          Garanta estes super bônus inclusos na versão completa da BeatClone.
        </p>
      </div>

      {/* List of Bonus Cards - Single Column Layout */}
      <div className="flex flex-col gap-5 w-full max-w-[420px] z-10">
        {bonuses.map((bonus, i) => (
          <motion.div 
            key={bonus.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="p-5 rounded-[24px] bg-[#121212]/95 border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-[#0066FF]/20 transition-all duration-300"
          >
            {/* Aspect Ratio perfectly matching 1896x830 */}
            <div className="relative aspect-[1896/830] w-full rounded-[16px] bg-gradient-to-br from-[#181818] to-black border border-white/10 flex flex-col justify-between p-4 overflow-hidden">
              {bonus.cover ? (
                <img 
                  src={bonus.cover} 
                  alt={bonus.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex justify-between items-start z-10">
                    <div className="p-2.5 bg-primary/15 rounded-xl border border-primary/20">
                      {getIcon(bonus.iconName)}
                    </div>
                    <span className="text-[8px] font-mono tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded">
                      {getLabel(bonus.id)}
                    </span>
                  </div>

                  <div className="z-10 mt-auto">
                    <div className="w-1/3 h-1 bg-primary rounded-full mb-1" />
                    <div className="w-1/2 h-0.5 bg-white/10 rounded-full" />
                  </div>
                </>
              )}

              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[9px] font-mono text-[#38bdf8] bg-black/75 backdrop-blur-md border border-[#0066FF]/20 px-2.5 py-1 rounded-full font-bold z-10">
                <Lock size={9} className="text-[#0066FF] animate-pulse" />
                DESBLOQUEADO GRÁTIS
              </div>
            </div>

            {/* Bonus Metadata Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-white text-base font-extrabold tracking-tight group-hover:text-[#38bdf8] transition-colors duration-200">
                  {bonus.title}
                </h3>
                <p className="text-white/50 text-xs mt-2 leading-relaxed font-sans">
                  {bonus.description}
                </p>
              </div>

              {/* Pricing status */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-xs">
                <span className="text-white/40 font-sans">Valor Individual:</span>
                <div className="font-mono flex items-center gap-2">
                  <span className="line-through text-red-500 font-bold">
                    R$ {bonus.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    R$ 0,00
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
