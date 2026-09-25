import { motion } from 'motion/react';
import { Check, Flame, ShieldCheck, Zap } from 'lucide-react';
import { Plan } from '../types';
import { trackInitiateCheckout } from '../utils/facebookPixel';
import { getTodayDateFormatted } from '../utils/dateUtils';

interface PlansSectionProps {
  onPlanClick?: (planId: string) => void;
}

export default function PlansSection({ onPlanClick }: PlansSectionProps) {
  // =========================================================================
  // ⚡ CONFIGURAÇÃO DE LINKS DE PAGAMENTO
  // =========================================================================
  const LINKS_DE_PAGAMENTO: Record<string, string> = {
    "plan-basic": "https://pay.cakto.com.br/q7uiqtz",     // Plano Básico
    "plan-pro": "https://pay.cakto.com.br/78mz9nf",       // Plano PRO ⭐
  };

  const todayDate = getTodayDateFormatted();

  const handlePlanClick = (planId: string) => {
    try {
      sessionStorage.setItem('beatfy_checkout_visited', 'true');
      sessionStorage.setItem('beatfy_checkout_time', Date.now().toString());
    } catch (e) {
      // Ignore storage error
    }

    // Dispara o evento de InitiateCheckout do Facebook Pixel & CAPI
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const priceVal = parseFloat(plan.price.replace(',', '.'));
      trackInitiateCheckout(plan.name, priceVal);
    }

    if (onPlanClick) {
      onPlanClick(planId);
    }

    const url = LINKS_DE_PAGAMENTO[planId];
    if (url) {
      console.log(`Redirecionando para checkout do plano: ${planId} -> ${url}`);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const plans: Plan[] = [
    {
      id: "plan-basic",
      name: "Plano Básico",
      price: "17,90",
      period: "vitalício",
      popular: false,
      benefits: [
        { text: "Acesso à ferramenta BeatClone I.A.", included: true },
        { text: "Transforme qualquer referência em beat inédito.", included: true },
        { text: "100% Direitos Comerciais Liberados.", included: true },
        { text: "Download ilimitado em alta definição.", included: true },
        { text: "Sem nenhum bônus adicional incluso.", included: false },
        { text: "Bônus: I.A de letras de Trap (Não incluso).", included: false },
        { text: "Bônus: Comunidade exclusiva (Não inclusa).", included: false },
        { text: "Bônus: Desafio de 21 dias (Não incluso).", included: false },
        { text: "Bônus: Modelo de perfis que viralizam (Não incluso).", included: false },
      ],
      ctaText: "GARANTIR PLANO BÁSICO"
    },
    {
      id: "plan-pro",
      name: "Plano PRO ⭐",
      price: "27,90",
      period: "vitalício",
      popular: true,
      benefits: [
        { text: "Acesso completo à ferramenta BeatClone I.A.", included: true },
        { text: "Transforme qualquer referência em beat inédito.", included: true },
        { text: "100% Direitos Comerciais Liberados.", included: true },
        { text: "Download ilimitado em alta definição.", included: true },
        { text: "BÔNUS 1: I.A treinada para escrever letras de Trap.", included: true },
        { text: "BÔNUS 2: Comunidade exclusiva.", included: true },
        { text: "BÔNUS 3: Desafio de 21 dias para viralizar como artista independente.", included: true },
        { text: "BÔNUS 4: Modelo de perfis que viralizam artistas.", included: true },
      ],
      ctaText: "GARANTIR PLANO PRO"
    }
  ];

  return (
    <section id="plans" className="relative min-h-[95vh] flex flex-col justify-center items-center px-6 py-16 overflow-hidden border-b border-white/5 bg-[#010000]">
      {/* Background glow behind plans */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-[420px] mx-auto mb-8 z-10 flex flex-col items-center">
        {/* Promotional Banner with Today's Date */}
        <div className="inline-flex items-center gap-2 bg-[#0066FF]/15 text-[#38bdf8] border border-[#0066FF]/30 text-[11px] font-mono font-bold px-4 py-2 rounded-full mb-4 shadow-[0_0_20px_rgba(0,102,255,0.25)]">
          <Flame size={14} className="animate-pulse fill-[#0066FF]" />
          <span>OFERTA VITALÍCIA VÁLIDA ATÉ {todayDate}</span>
        </div>

        <h2 className="font-display text-3xl font-extrabold text-white leading-tight uppercase">
          ESCOLHA SEU PLANO
        </h2>
        <p className="text-xs text-white/60 font-sans mt-2">
          Pagamento único. Acesso vitalício para sempre.
        </p>
      </div>

      {/* Vertical list layout for mobile screens */}
      <div className="flex flex-col gap-6 w-full max-w-[360px] z-10">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={() => handlePlanClick(plan.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlanClick(plan.id);
              }
            }}
            className={`p-6 rounded-[24px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.99] select-none ${
              plan.popular 
                ? 'bg-white text-black shadow-[0_20px_50px_rgba(0,102,255,0.25)] hover:shadow-[0_25px_60px_rgba(0,102,255,0.35)]' 
                : 'bg-[#121212]/90 text-white border border-white/5 hover:border-[#0066FF]/40 hover:shadow-[0_10px_30px_rgba(0,102,255,0.15)]'
            }`}
          >
            {/* Highlights and glowing badges */}
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-[#0066FF]/10 text-[#0066FF] font-display font-black text-[9px] px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#0066FF]/20">
                <Flame size={10} className="fill-current animate-bounce" />
                MAIS ESCOLHIDO
              </div>
            )}

            {/* Plan Info */}
            <div className="mb-6">
              <h3 className={`font-display text-xl font-extrabold tracking-tight ${plan.popular ? 'text-black' : 'text-white'}`}>
                {plan.name}
              </h3>
              
              {/* Pricing area */}
              <div className={`mt-4 flex items-baseline gap-1 pb-4 border-b ${plan.popular ? 'border-black/5' : 'border-white/5'}`}>
                <span className={`text-xs font-mono font-bold ${plan.popular ? 'text-black/50' : 'text-white/40'}`}>R$</span>
                <span className={`text-4xl font-display font-black leading-none tracking-tight ${plan.popular ? 'text-black' : 'text-white'}`}>
                  {plan.price.split(',')[0]}
                </span>
                <span className={`text-lg font-sans font-bold ${plan.popular ? 'text-black' : 'text-white'}`}>,{plan.price.split(',')[1]}</span>
                <span className={`text-xs font-mono ml-1.5 ${plan.popular ? 'text-black/40' : 'text-white/30'}`}>/ {plan.period}</span>
              </div>

              {/* Benefits list */}
              <ul className="mt-6 flex flex-col gap-3.5">
                {plan.benefits.map((benefitItem, idx) => {
                  const item = typeof benefitItem === 'string' ? { text: benefitItem, included: true } : benefitItem;
                  return (
                    <li 
                      key={idx} 
                      className={`flex gap-2.5 items-start text-xs font-sans ${
                        !item.included
                          ? 'text-white/40'
                          : plan.popular 
                            ? 'text-black/85 font-semibold' 
                            : 'text-white/80'
                      }`}
                    >
                      {item.included ? (
                        <Check size={14} className="text-[#0066FF] shrink-0 mt-0.5" />
                      ) : (
                        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={14} className="text-white/30" />
                          <span className="absolute w-[16px] h-[1.5px] bg-red-500/80 rotate-[-45deg] pointer-events-none rounded" />
                        </div>
                      )}
                      <span className={item.included ? '' : 'line-through decoration-white/30'}>
                        {item.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Action CTA Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePlanClick(plan.id);
              }}
              className={`w-full py-4 px-5 rounded-xl font-display font-black text-xs transition-all duration-300 active:scale-98 tracking-wider uppercase cursor-pointer ${
                plan.popular 
                  ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/25 hover:bg-[#0052cc]' 
                  : 'bg-white/5 hover:bg-white/10 text-white hover:text-[#38bdf8]'
              }`}
            >
              {plan.ctaText}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 z-10 text-center max-w-[340px] px-4">
        <p className="text-xs text-gray-400 font-sans italic leading-relaxed">
          Pagamento único e 100% seguro. Acesso vitalício sem mensalidades ou taxas recorrentes.
        </p>
      </div>
    </section>
  );
}
