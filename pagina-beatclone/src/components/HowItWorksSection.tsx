import { motion } from 'motion/react';
import { Mail, CheckCircle2, ShieldCheck, LogIn, ArrowRight, Award } from 'lucide-react';

const MOCKUP_COMO_RECEBER_URL = 'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/mockup/BeatCloneMockup3SemFundo.png';

export default function HowItWorksSection() {
  const mockupNotebook = MOCKUP_COMO_RECEBER_URL;

  return (
    <section id="how-it-works" className="relative min-h-[90vh] flex flex-col justify-center items-center px-5 sm:px-6 py-20 overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#040814] to-[#010000]">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-10 w-[200px] h-[200px] bg-[#0066FF]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-[480px] mx-auto mb-10 z-10">
        <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight uppercase tracking-tight">
          COMO VOCÊ VAI RECEBER
        </h2>
        <motion.p 
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-gray-300 text-sm sm:text-base mt-2 font-sans font-medium"
        >
          O acesso é imediato e direto no seu e-mail.
        </motion.p>
      </div>

      {/* Main Content Box & Steps */}
      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-[460px] z-10">
        
        {/* Step-by-Step UI/UX with exact requested copy */}
        <div className="flex flex-col gap-3.5 w-full">
          
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#121212]/95 border border-white/10 hover:border-[#0066FF]/30 transition-all duration-300 shadow-md flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center shrink-0 text-[#38bdf8] mt-0.5">
              <ShieldCheck size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0066FF]/20 text-[#38bdf8] border border-[#0066FF]/30 uppercase">
                  Passo 01
                </span>
              </div>
              <p className="text-white font-sans text-sm font-semibold leading-snug">
                Confirme seu pedido abaixo no Checkout da Cakto
              </p>
              <p className="text-gray-400 text-xs mt-1 font-sans">
                Campeã de confiança no Reclame Aqui
              </p>

              {/* Selo Reclame Aqui RA1000 */}
              <div className="mt-2.5 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#006837]/30 via-[#009245]/20 to-black/40 border border-[#009245]/40 shadow-sm">
                <div className="w-5 h-5 rounded-full bg-[#009245] flex items-center justify-center text-white shrink-0 shadow-[0_0_8px_rgba(0,146,69,0.5)]">
                  <Award size={12} className="stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-display font-black text-[11px] text-[#22c55e] tracking-tight">
                    RA 1000
                  </span>
                  <span className="text-[9px] font-mono text-gray-300 font-bold uppercase tracking-wider">
                    Reclame AQUI
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#121212]/95 border border-white/10 hover:border-[#0066FF]/30 transition-all duration-300 shadow-md flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center shrink-0 text-[#38bdf8] mt-0.5">
              <Mail size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0066FF]/20 text-[#38bdf8] border border-[#0066FF]/30 uppercase">
                  Passo 02
                </span>
              </div>
              <p className="text-white font-sans text-sm font-semibold leading-snug">
                Receba os dados de acesso instantaneamente na sua caixa de entrada.
              </p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0a1628] to-[#121212] border border-[#0066FF]/40 hover:border-[#0066FF]/70 transition-all duration-300 shadow-[0_4px_20px_rgba(0,102,255,0.15)] flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center shrink-0 text-white mt-0.5 shadow-[0_0_12px_rgba(0,102,255,0.6)]">
              <LogIn size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0066FF] text-white uppercase">
                  Passo 03
                </span>
              </div>
              <p className="text-white font-display font-bold text-sm sm:text-[15px] leading-snug">
                Faça o login na plataforma, e pronto!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mockup visual display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px] relative mt-2"
        >
          <img 
            src={mockupNotebook} 
            alt="BeatClone Web App Mockup" 
            className="w-full h-auto object-contain drop-shadow-[0_15px_35px_rgba(0,102,255,0.2)]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#0066FF]/10 rounded-2xl filter blur-2xl -z-10 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

