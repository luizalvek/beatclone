import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  ShieldCheck, 
  Check, 
  Clock, 
  Zap, 
  Sparkles, 
  Lock, 
  AlertTriangle,
  ArrowRight,
  Gift,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Trophy,
  Tag
} from 'lucide-react';
import { trackInitiateCheckout } from '../utils/facebookPixel';
import { getTodayDateFormatted } from '../utils/dateUtils';
import { Plan } from '../types';

interface BackRedirectPageProps {
  onBackToMain?: () => void;
}

export interface DiscountPlan extends Plan {
  discountPrice: string;
  originalPriceStrikethrough: string;
  discountBadge: string;
  checkoutUrl: string;
}

const BEATCLONE_LOGO_URL = 'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/BeatCloneLogo.png';
const BEATCLONE_MOCKUP_URL = 'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/mockup/BeatCloneMockup1.png';

// 8 Slices definition for the Roulette Wheel
interface Slice {
  id: number;
  label: string;
  sublabel: string;
  bgColor: string;
  textColor: string;
  isJackpot?: boolean;
}

const ROULETTE_SLICES: Slice[] = [
  { id: 0, label: "50% OFF", sublabel: "⭐ MÁXIMO", bgColor: "#0066FF", textColor: "#FFFFFF", isJackpot: true },
  { id: 1, label: "SEM PRÊMIO", sublabel: "0% OFF", bgColor: "#18181b", textColor: "#71717a" },
  { id: 2, label: "20% OFF", sublabel: "CUPOM", bgColor: "#0f172a", textColor: "#94a3b8" },
  { id: 3, label: "TENTE DE NOVO", sublabel: "0% OFF", bgColor: "#1c1917", textColor: "#78716c" },
  { id: 4, label: "30% OFF", sublabel: "BOM!", bgColor: "#172554", textColor: "#60a5fa" },
  { id: 5, label: "PERDEU A VEZ", sublabel: "0% OFF", bgColor: "#18181b", textColor: "#71717a" },
  { id: 6, label: "10% OFF", sublabel: "CUPOM", bgColor: "#0f172a", textColor: "#94a3b8" },
  { id: 7, label: "NADA HOJE", sublabel: "0% OFF", bgColor: "#1c1917", textColor: "#78716c" },
];

// Audio synthesis helpers for high immersion (0 external dependencies)
function playTickSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch (e) {
    // Silent fail if audio blocked
  }
}

function playWinFanfare() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.12, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.38);
    });
  } catch (e) {
    // Silent fail
  }
}

export default function BackRedirectPage({ onBackToMain }: BackRedirectPageProps) {
  const logo = BEATCLONE_LOGO_URL;
  const mockupBeatClone = BEATCLONE_MOCKUP_URL;
  
  // Roulette Modal State
  const [showRoulettePopup, setShowRoulettePopup] = useState(true);
  const [wheelState, setWheelState] = useState<'idle' | 'spinning' | 'won'>('idle');
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isClaimed, setIsClaimed] = useState(false);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 10-minute countdown timer state
  const [timeLeft, setTimeLeft] = useState(599); // 09:59
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Initial confetti and countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  const triggerCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#0066FF', '#FF3B30', '#FFCC00', '#FFFFFF', '#0047b3']
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#0066FF', '#FF3B30', '#FFFFFF']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#0066FF', '#FFCC00', '#FFFFFF']
        });
      }, 250);
    } catch (err) {
      console.log('Confetti error:', err);
    }
  };

  // Spin Roulette Handler - ALWAYS precisely lands on 50% OFF (Segment 0 at 12 o'clock)
  const handleSpinRoulette = () => {
    if (wheelState === 'spinning' || wheelState === 'won') return;

    setWheelState('spinning');

    // Start tick sounds simulation
    let speed = 70;
    tickIntervalRef.current = setInterval(() => {
      playTickSound();
    }, speed);

    // After 2.5s slow down tick sound
    setTimeout(() => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = setInterval(() => {
          playTickSound();
        }, 160);
      }
    }, 2500);

    // After 3.6s further slow down tick
    setTimeout(() => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = setInterval(() => {
          playTickSound();
        }, 320);
      }
    }, 3600);

    // Slices are 45 deg. Slice 0 is centered at 0 deg (12 o'clock).
    // Rotation = 360 * 8 (8 full turns) + small natural random jitter (-6 to +6 deg)
    // This strictly guarantees landing on slice 0 (which spans -22.5 to +22.5 deg)
    const jitter = (Math.random() - 0.5) * 12; // -6 to +6 degrees
    const totalRotation = 360 * 8 + jitter;
    setRotationDegrees(totalRotation);

    // Spin duration 4.5 seconds
    setTimeout(() => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      setWheelState('won');
      playWinFanfare();
      triggerCelebrationConfetti();
    }, 4500);
  };

  // Claim discount handler - switches from popup to the full 50% OFF redirect page
  const handleClaimDiscount = () => {
    triggerCelebrationConfetti();
    setIsClaimed(true);
    setShowRoulettePopup(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format timer string MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const todayDate = getTodayDateFormatted();

  // ⚡ 50% OFF Plans Configuration for BeatClone
  const discountPlans: DiscountPlan[] = [
    {
      id: "plan-basic-50",
      name: "Plano Básico",
      price: "8,95",
      originalPriceStrikethrough: "17,90",
      discountPrice: "8,95",
      discountBadge: "50% OFF",
      period: "vitalício",
      popular: false,
      benefits: [
        { text: "Acesso à ferramenta BeatClone I.A.", included: true },
        { text: "Transforme qualquer referência em beat inédito.", included: true },
        { text: "100% Direitos Comerciais Liberados.", included: true },
        { text: "Download ilimitado em alta definição.", included: true },
        { text: "Bônus: I.A de letras de Trap (Não incluso).", included: false },
        { text: "Bônus: Comunidade exclusiva (Não inclusa).", included: false },
        { text: "Bônus: Desafio de 21 dias (Não incluso).", included: false },
        { text: "Bônus: Modelo de perfis que viralizam (Não incluso).", included: false },
      ],
      ctaText: "QUERO PLANO BÁSICO POR R$ 8,95",
      checkoutUrl: "https://pay.cakto.com.br/cc2pcv4"
    },
    {
      id: "plan-pro-50",
      name: "Plano PRO ⭐",
      price: "13,95",
      originalPriceStrikethrough: "27,90",
      discountPrice: "13,95",
      discountBadge: "50% OFF MAIS ESCOLHIDO",
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
      ctaText: "🔥 QUERO O PLANO PRO ⭐ POR R$ 13,95",
      checkoutUrl: "https://pay.cakto.com.br/33ohzow"
    }
  ];

  const handleSelectPlan = (plan: DiscountPlan) => {
    triggerCelebrationConfetti();
    const priceVal = parseFloat(plan.discountPrice.replace(',', '.'));
    trackInitiateCheckout(`50% OFF - ${plan.name}`, priceVal);

    if (plan.checkoutUrl) {
      window.open(plan.checkoutUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const scrollToPlans = () => {
    const elem = document.getElementById('discount-plans');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      id: 'f1',
      question: 'O que acontece se eu sair ou fechar esta página?',
      answer: 'Se você fechar a janela, atualizar ou sair da página, o seu desconto de 50% será cancelado imediatamente. O sistema invalidará o cupom e os planos voltarão ao preço normal cheio (R$ 17,90 e R$ 27,90).'
    },
    {
      id: 'f2',
      question: 'O valor com 50% OFF é pagamento único ou mensalidade?',
      answer: 'Pagamento único! Você paga uma única vez com 50% de desconto e tem ACESSO VITALÍCIO à BeatClone. Sem mensalidades e sem cobranças futuras.'
    },
    {
      id: 'f3',
      question: 'A licença comercial do Plano PRO continua valendo com o desconto?',
      answer: 'Sim! Com o Plano PRO ⭐ você mantém 100% dos direitos comerciais liberados para monetizar e lançar suas músicas no Spotify, YouTube, Apple Music e todas as plataformas digitais sem risco de strike.'
    },
    {
      id: 'f4',
      question: 'Como recebo o acesso após confirmar a compra?',
      answer: 'O envio é imediato. Assim que o pagamento for confirmado, você receberá seus dados de acesso direto no seu e-mail e WhatsApp cadastrados.'
    }
  ];

  // SVG parameters for the Roulette Wheel
  const wheelRadius = 138;
  const cx = 160;
  const cy = 160;
  const sliceAngle = 45; // 360 / 8 = 45 degrees

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center font-sans selection:bg-[#0066FF] selection:text-white relative">
      
      {/* ========================================================================= */}
      {/* POPUP DA ROLETA DA SORTE (EXIBIDA ANTES DE IR PARA A PÁGINA DE REDIRECT) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showRoulettePopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[420px] bg-[#0c0d12] border border-[#0066FF]/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_60px_rgba(0,102,255,0.35)] relative overflow-hidden flex flex-col items-center text-center my-auto"
            >
              {/* Background ambient light */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#0066FF]/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FF3B30]/15 rounded-full blur-3xl pointer-events-none" />

              {/* Logo / Header */}
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <img 
                  src={logo} 
                  alt="BeatClone" 
                  className="h-6 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="font-display font-black text-sm tracking-wider text-white">
                  BEAT<span className="text-[#0066FF]">CLONE</span>
                </span>
              </div>

              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#FF3B30]/15 border border-[#FF3B30]/40 text-[#FF3B30] text-[10px] font-mono font-extrabold px-3 py-1 rounded-full mb-3 shadow-[0_0_15px_rgba(255,59,48,0.25)] animate-pulse">
                <AlertTriangle size={12} />
                <span>ESPERE! ANTES DE SAIR GANHE UM PRÊMIO</span>
              </div>

              {/* Title & Persuasive Copy */}
              <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white leading-tight">
                🎰 ROLETA DA SORTE BEATCLONE
              </h2>
              <p className="text-xs text-gray-300 font-sans mt-1.5 max-w-[320px] leading-relaxed">
                Você recebeu <span className="text-[#38bdf8] font-bold">1 giro grátis</span>! Gire agora para descobrir seu cupom exclusivo de desconto.
              </p>

              {/* ======================================= */}
              {/* THE INTERACTIVE ROULETTE WHEEL          */}
              {/* ======================================= */}
              <div className="relative my-4 flex items-center justify-center">
                {/* Outer Glow Ring */}
                <div className="absolute w-[290px] h-[290px] rounded-full bg-gradient-to-r from-[#0066FF]/30 via-[#FFCC00]/20 to-[#0066FF]/30 blur-md pointer-events-none animate-pulse" />

                {/* SVG Wheel */}
                <div className="relative w-[280px] h-[280px] select-none">
                  {/* Fixed Pointer Indicator (12 o'clock needle) */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-b from-yellow-400 to-amber-600 border-2 border-white shadow-md flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div 
                      className={`w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[18px] border-t-[#FF3B30] -mt-1.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-100 ${
                        wheelState === 'spinning' ? 'scale-110' : ''
                      }`}
                    />
                  </div>

                  {/* Rotating Wheel Group */}
                  <svg 
                    viewBox="0 0 320 320" 
                    className="w-full h-full drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
                    style={{
                      transform: `rotate(${rotationDegrees}deg)`,
                      transition: wheelState === 'spinning' 
                        ? 'transform 4.5s cubic-bezier(0.12, 0.82, 0.18, 1)' 
                        : 'none'
                    }}
                  >
                    {/* Metallic Outer Rim */}
                    <circle cx={cx} cy={cy} r="156" fill="#18181b" stroke="#0066FF" strokeWidth="4" />
                    <circle cx={cx} cy={cy} r="150" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />

                    {/* Slices */}
                    {ROULETTE_SLICES.map((slice, i) => {
                      const startAngle = i * sliceAngle - 22.5;
                      const endAngle = i * sliceAngle + 22.5;
                      const radStart = (startAngle * Math.PI) / 180;
                      const radEnd = (endAngle * Math.PI) / 180;

                      const x1 = cx + wheelRadius * Math.sin(radStart);
                      const y1 = cy - wheelRadius * Math.cos(radStart);
                      const x2 = cx + wheelRadius * Math.sin(radEnd);
                      const y2 = cy - wheelRadius * Math.cos(radEnd);

                      const midAngle = i * sliceAngle;

                      return (
                        <g key={slice.id}>
                          {/* Segment Path */}
                          <path
                            d={`M ${cx} ${cy} L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 0 1 ${x2} ${y2} Z`}
                            fill={slice.bgColor}
                            stroke="#ffffff15"
                            strokeWidth="1.5"
                          />

                          {/* Segment Text Container rotated around wheel center */}
                          <g transform={`rotate(${midAngle} ${cx} ${cy})`}>
                            {/* Inner Golden border highlight for Jackpot slice */}
                            {slice.isJackpot && (
                              <path
                                d={`M ${cx} ${cy} L ${cx - 32} 55 L ${cx + 32} 55 Z`}
                                fill="#ffffff10"
                              />
                            )}

                            {/* Main Label */}
                            <text
                              x={cx}
                              y={slice.isJackpot ? 56 : 58}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill={slice.isJackpot ? '#FFFFFF' : slice.textColor}
                              fontSize={slice.isJackpot ? '13' : '10'}
                              fontWeight="900"
                              fontFamily="system-ui, sans-serif"
                              style={{ letterSpacing: '0.05em' }}
                            >
                              {slice.label}
                            </text>

                            {/* Sublabel / Tag */}
                            <text
                              x={cx}
                              y={slice.isJackpot ? 74 : 73}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill={slice.isJackpot ? '#FFD700' : '#64748b'}
                              fontSize="8"
                              fontWeight="800"
                              fontFamily="monospace"
                            >
                              {slice.sublabel}
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* Perimeter Light Bulbs (24 glowing studs) */}
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const angle = (idx * 360) / 24;
                      const rad = (angle * Math.PI) / 180;
                      const bx = cx + 148 * Math.sin(rad);
                      const by = cy - 148 * Math.cos(rad);
                      const isEven = idx % 2 === 0;
                      return (
                        <circle
                          key={idx}
                          cx={bx}
                          cy={by}
                          r={isEven ? 3 : 2}
                          fill={isEven ? '#FFD700' : '#FFFFFF'}
                          opacity={wheelState === 'spinning' ? (isEven ? 1 : 0.4) : 0.8}
                        />
                      );
                    })}

                    {/* Center Hub */}
                    <circle cx={cx} cy={cy} r="32" fill="#09090b" stroke="#FFD700" strokeWidth="2.5" />
                    <circle cx={cx} cy={cy} r="26" fill="#18181b" />
                    <text
                      x={cx}
                      y={cy - 4}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="900"
                      fontFamily="system-ui, sans-serif"
                    >
                      BEAT
                    </text>
                    <text
                      x={cx}
                      y={cy + 7}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#0066FF"
                      fontSize="9"
                      fontWeight="900"
                      fontFamily="system-ui, sans-serif"
                    >
                      CLONE
                    </text>
                  </svg>
                </div>
              </div>

              {/* ==================================================== */}
              {/* ACTION BUTTON / WIN STATE CONTENT                    */}
              {/* ==================================================== */}
              {wheelState !== 'won' ? (
                <div className="w-full mt-2 relative z-10">
                  <button
                    onClick={handleSpinRoulette}
                    disabled={wheelState === 'spinning'}
                    className={`w-full py-4 px-5 rounded-2xl font-display font-black text-sm sm:text-base transition-all duration-300 uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                      wheelState === 'spinning'
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed animate-pulse'
                        : 'bg-gradient-to-r from-[#0066FF] via-[#2575fc] to-[#0047b3] text-white shadow-[0_0_30px_rgba(0,102,255,0.6)] hover:brightness-110 active:scale-98'
                    }`}
                  >
                    {wheelState === 'spinning' ? (
                      <>
                        <RotateCw size={18} className="animate-spin" />
                        <span>GIRANDO A ROLETA... BOA SORTE!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} className="text-yellow-300 animate-bounce" />
                        <span>🎰 GIRAR ROLETA GRÁTIS AGORA!</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 font-mono mt-2 flex items-center justify-center gap-1">
                    <Lock size={10} className="text-emerald-400" />
                    <span>1 Giro Grátis • Teste a sua sorte agora</span>
                  </p>
                </div>
              ) : (
                /* WON STATE: CELEBRATION BOX & TRANSITION BUTTON */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full mt-2 bg-gradient-to-b from-[#0066FF]/20 to-black/60 border border-[#0066FF] p-4 rounded-2xl relative z-10 flex flex-col items-center"
                >
                  <div className="inline-flex items-center gap-1 text-[11px] font-mono font-black text-yellow-300 bg-yellow-400/20 px-3 py-0.5 rounded-full mb-1">
                    <Trophy size={13} className="fill-yellow-400" />
                    <span>PARABÉNS! VOCÊ TIROU O MAIOR PRÊMIO</span>
                  </div>

                  <h3 className="font-display text-2xl font-black text-white leading-tight mt-1">
                    🎉 50% DE DESCONTO VITALÍCIO!
                  </h3>

                  <div className="mt-2 bg-red-500/15 border border-red-500/40 px-3 py-1.5 rounded-xl text-center">
                    <p className="text-[11px] font-mono font-black text-red-300 flex items-center justify-center gap-1">
                      <AlertTriangle size={12} className="shrink-0 text-red-400" />
                      <span>SE SAIR DA PÁGINA, VOCÊ PERDE ESSE DESCONTO!</span>
                    </p>
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Clock size={12} className="animate-spin" />
                    <span>Desconto reservado por apenas {formatTime(timeLeft)} minutos</span>
                  </div>

                  <button
                    onClick={handleClaimDiscount}
                    className="w-full mt-4 py-4 px-5 bg-gradient-to-r from-[#0066FF] via-[#1a75ff] to-[#0047b3] text-white font-display font-black text-sm sm:text-base rounded-xl shadow-[0_0_30px_rgba(0,102,255,0.7)] hover:brightness-110 active:scale-98 transition-all tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>👉 RESGATAR MEU DESCONTO ANTES DE SAIR</span>
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* PÁGINA DE REDIRECT COM OS 50% DE DESCONTO LIBERADOS                       */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[480px] bg-dark-bg text-white flex flex-col min-h-screen border-x border-white/5 shadow-2xl relative pb-24">
        
        {/* ========================================== */}
        {/* TOP URGENCY TICKER BANNER                  */}
        {/* ========================================== */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-[#FF3B30] via-[#0066FF] to-[#0047b3] p-2.5 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-extrabold text-white tracking-wide uppercase">
            <AlertTriangle size={15} className="animate-bounce shrink-0 fill-white/20" />
            <span>⚠️ SE SAIR DA PÁGINA, VOCÊ PERDE O DESCONTO DE 50%</span>
            <div className="bg-black/40 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold text-yellow-300 border border-yellow-300/30 flex items-center gap-1 ml-1">
              <Clock size={11} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Roulette Claimed Notification Banner */}
        {isClaimed && (
          <div className="bg-red-500/20 border-b border-red-500/40 px-4 py-2 text-center text-xs font-mono font-bold text-red-300 flex items-center justify-center gap-2">
            <AlertTriangle size={14} className="text-yellow-300 shrink-0" />
            <span>🚨 NÃO ATUALIZE OU FECHE A ABA: SEU DESCONTO EXPIRA SE VOCÊ SAIR!</span>
          </div>
        )}

        {/* ========================================== */}
        {/* HERO / HEADLINE SECTION                    */}
        {/* ========================================== */}
        <section className="relative px-6 pt-8 pb-10 flex flex-col items-center text-center overflow-hidden border-b border-white/5">
          {/* Ambient Glows */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-[#0066FF]/20 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute top-10 right-0 w-[120px] h-[120px] bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />

          {/* BeatClone Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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

          {/* 50% OFF Badge Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 bg-[#FF3B30]/20 text-[#FF3B30] border border-[#FF3B30]/50 text-[11px] font-mono font-black px-3.5 py-1.5 rounded-full mb-4 shadow-[0_0_20px_rgba(255,59,48,0.3)] animate-pulse"
          >
            <Flame size={13} className="fill-current" />
            <span>CONDIÇÃO ÚNICA: SE FECHAR A ABA VOCÊ PERDE O DESCONTO</span>
          </motion.div>

          {/* Direct, Urgent Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-2xl sm:text-3xl font-black text-white leading-tight uppercase tracking-tight"
          >
            🚨 PARE! SE SAIR DA PÁGINA, VOCÊ PERDE 50% DE DESCONTO
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg font-display font-extrabold text-[#38bdf8] mt-3 leading-snug"
          >
            Garanta a BeatClone vitalícia pela metade do preço antes de sair.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-xs sm:text-sm text-gray-300 font-sans mt-3 max-w-[380px] leading-relaxed bg-white/5 border border-white/10 p-3.5 rounded-2xl"
          >
            Você liberou 50% de desconto real na roleta. Mas atenção: essa é uma sessão única. Se fechar esta aba ou sair do site agora, o cupom expira permanentemente e os valores voltam ao preço normal.
          </motion.p>

          {/* Reserved Spot Counter */}
          <div className="mt-5 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-mono font-bold px-3.5 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>EXPIRA EM {formatTime(timeLeft)} • SE SAIR DA PÁGINA O CUPOM É CANCELADO</span>
          </div>

          {/* Main Hero CTA Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-[380px] mt-6"
          >
            <button
              onClick={scrollToPlans}
              className="w-full bg-gradient-to-r from-[#0066FF] via-[#1a75ff] to-[#0047b3] text-white font-display font-black text-sm sm:text-base py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(0,102,255,0.5)] active:scale-98 tracking-wide uppercase cursor-pointer flex items-center justify-center gap-2 hover:brightness-110"
            >
              <Flame size={20} className="fill-white shrink-0 animate-bounce" />
              <span>🔥 GARANTIR 50% OFF ANTES DE SAIR</span>
              <ArrowRight size={18} className="shrink-0" />
            </button>
            
            <p className="text-[10px] text-gray-400 font-mono mt-2.5">
              🔒 Desconto intransferível • Se fechar a aba o desconto é perdido
            </p>
          </motion.div>

          {/* App Visual Preview with 50% OFF Badge */}
          <div className="w-full max-w-[280px] mt-7 relative flex justify-center items-center">
            <div className="absolute -top-3 -right-2 z-20 bg-[#FF3B30] text-white font-display font-black text-xs px-3 py-1.5 rounded-full shadow-lg border border-white/20 rotate-12 flex items-center gap-1">
              <Gift size={12} />
              <span>50% OFF</span>
            </div>
            <img 
              src={mockupBeatClone} 
              alt="BeatClone App 50% OFF" 
              className="w-full h-auto object-contain relative z-10 drop-shadow-[0_15px_35px_rgba(0,102,255,0.35)]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#0066FF]/20 rounded-full filter blur-2xl scale-90 z-0 pointer-events-none" />
          </div>
        </section>

        {/* ========================================== */}
        {/* REASON / WHAT YOU LOSE IF YOU LEAVE        */}
        {/* ========================================== */}
        <section className="px-6 py-8 bg-[#0a0a0a] border-b border-white/5 relative">
          <div className="text-center max-w-[380px] mx-auto">
            <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full mb-2">
              <AlertTriangle size={12} />
              <span>O QUE VOCÊ VAI PERDER SE SAIR AGORA:</span>
            </div>
            <h3 className="font-display text-lg font-extrabold uppercase text-white tracking-tight">
              TUDO ISSO PELA METADE DO PREÇO NORMAL:
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Acesso vitalício à ferramenta BeatClone pelo menor preço histórico.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 max-w-[380px] mx-auto">
            {[
              "Acesso vitalício à ferramenta BeatClone I.A (sem mensalidades)",
              "Transforme qualquer referência em beat inédito sem direitos autorais",
              "Direitos Comerciais 100% Liberados para monetizar no Spotify e YouTube",
              "Download Ilimitado em áudio WAV de estúdio",
              "Todos os 4 Bônus Exclusivos inclusos no Plano PRO",
              "Garantia Incondicional de 7 Dias para testar com risco zero"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/5 border border-white/5 p-3 rounded-xl text-xs text-gray-200">
                <div className="w-5 h-5 rounded-full bg-[#0066FF]/20 text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="stroke-[3]" />
                </div>
                <span className="font-sans font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================== */}
        {/* PLANS SECTION (50% OFF PRICING)            */}
        {/* ========================================== */}
        <section id="discount-plans" className="px-6 py-12 relative overflow-hidden border-b border-white/5 bg-[#010000]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#0066FF]/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-[400px] mx-auto mb-8 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full mb-3">
              <AlertTriangle size={12} />
              <span>AVISO: SE SAIR DA PÁGINA O LINK EXPIRA</span>
            </div>
            
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
              ESCOLHA SEU PLANO ANTES DE SAIR
            </h2>
            <p className="text-xs text-gray-400 mt-2 font-sans">
              Ao fechar ou recarregar esta janela, os links com 50% de desconto serão cancelados permanentemente.
            </p>
          </div>

          {/* Plan Cards Stack */}
          <div className="flex flex-col gap-6 w-full max-w-[380px] mx-auto relative z-10">
            {discountPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`p-6 rounded-[24px] relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-white via-white to-gray-100 text-black shadow-[0_0_50px_rgba(0,102,255,0.35)] border-2 border-[#0066FF]'
                    : 'bg-[#121212]/95 text-white border border-white/10'
                }`}
              >
                {/* 50% OFF Badge */}
                <div className={`absolute top-4 right-4 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
                  plan.popular 
                    ? 'bg-[#0066FF] text-white border-black/20' 
                    : 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/30'
                }`}>
                  <Flame size={11} className="fill-current animate-pulse" />
                  <span>{plan.discountBadge}</span>
                </div>

                <div>
                  {/* Plan Name */}
                  <h3 className={`font-display text-xl font-black tracking-tight ${plan.popular ? 'text-black' : 'text-white'}`}>
                    {plan.name}
                  </h3>

                  {/* Pricing Box with Strikethrough */}
                  <div className={`mt-3 pb-4 border-b ${plan.popular ? 'border-black/10' : 'border-white/10'}`}>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className={plan.popular ? 'text-black/50 line-through' : 'text-white/40 line-through'}>
                        De R$ {plan.originalPriceStrikethrough}
                      </span>
                      <span className="bg-[#FF3B30] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        -50%
                      </span>
                    </div>

                    <div className="mt-1 flex items-baseline gap-1">
                      <span className={`text-xs font-mono font-bold ${plan.popular ? 'text-black/60' : 'text-white/50'}`}>R$</span>
                      <span className={`text-4xl font-display font-black leading-none tracking-tight ${plan.popular ? 'text-black' : 'text-white'}`}>
                        {plan.price.split(',')[0]}
                      </span>
                      <span className={`text-xl font-sans font-bold ${plan.popular ? 'text-black' : 'text-white'}`}>,{plan.price.split(',')[1]}</span>
                      <span className={`text-xs font-mono ml-1.5 ${plan.popular ? 'text-black/50' : 'text-white/40'}`}>/ {plan.period}</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <ul className="mt-5 flex flex-col gap-3">
                    {plan.benefits.map((benefitItem, idx) => {
                      const item = typeof benefitItem === 'string' ? { text: benefitItem, included: true } : benefitItem;
                      return (
                        <li 
                          key={idx} 
                          className={`flex items-start gap-2 text-xs font-sans ${
                            !item.included
                              ? 'text-white/40'
                              : plan.popular 
                                ? 'text-black/90 font-semibold' 
                                : 'text-gray-300'
                          }`}
                        >
                          {item.included ? (
                            <Check size={14} className="text-[#0066FF] shrink-0 mt-0.5 stroke-[3]" />
                          ) : (
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={14} className="text-white/30 stroke-[2]" />
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

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full mt-6 py-4 px-4 rounded-xl font-display font-black text-xs transition-all duration-300 active:scale-98 tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/30 hover:scale-[1.02] hover:brightness-105'
                      : 'bg-white/10 hover:bg-white/20 text-white hover:text-[#38bdf8] border border-white/10'
                  }`}
                >
                  <Flame size={14} className={plan.popular ? 'fill-white' : 'fill-current'} />
                  <span>{plan.ctaText}</span>
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 max-w-[360px] mx-auto bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-center">
            <p className="text-[11px] text-red-300 font-mono font-bold flex items-center justify-center gap-1.5">
              <AlertTriangle size={13} className="shrink-0 text-red-400" />
              <span>AVISO: Se sair da página, o cupom expira e os valores voltam para R$ 17,90 e R$ 27,90.</span>
            </p>
          </div>
        </section>

        {/* ========================================== */}
        {/* GUARANTEE & SECURITY SEALS                 */}
        {/* ========================================== */}
        <section className="px-6 py-10 bg-[#0a0a0a] border-b border-white/5 text-center">
          <div className="max-w-[380px] mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#0066FF]/15 border border-[#0066FF]/30 flex items-center justify-center text-[#38bdf8] mb-3 shadow-[0_0_20px_rgba(0,102,255,0.2)]">
              <ShieldCheck size={30} />
            </div>

            <h3 className="font-display text-lg font-bold uppercase text-white">
              7 DIAS DE GARANTIA INCONDICIONAL
            </h3>
            
            <p className="text-xs text-gray-300 mt-2 font-sans leading-relaxed">
              Assine com 50% OFF agora, acesse a BeatClone I.A, recrie seus beats e teste por 7 dias. Se por qualquer motivo não gostar, devolvemos 100% do seu dinheiro sem perguntas.
            </p>

            <div className="mt-5 flex items-center justify-center gap-6 text-[11px] font-mono text-gray-400 border-t border-white/5 pt-4 w-full">
              <div className="flex items-center gap-1.5">
                <Lock size={13} className="text-[#0066FF]" />
                <span>Checkout 100% Criptografado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={13} className="text-[#0066FF]" />
                <span>Liberação Imediata</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* FREQUENTLY ASKED QUESTIONS (FAQ)           */}
        {/* ========================================== */}
        <section className="px-6 py-10 border-b border-white/5 bg-[#010000]">
          <div className="text-center max-w-[380px] mx-auto mb-6">
            <h3 className="font-display text-lg font-extrabold uppercase text-white flex items-center justify-center gap-2">
              <HelpCircle size={18} className="text-[#0066FF]" />
              DÚVIDAS FREQUENTES
            </h3>
          </div>

          <div className="flex flex-col gap-3 max-w-[380px] mx-auto">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 text-left font-display text-xs font-bold text-white flex justify-between items-center gap-3 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={16} className="text-[#38bdf8] shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-gray-300 font-sans leading-relaxed border-t border-white/5 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================== */}
        {/* FOOTER & RETURN TO MAIN                    */}
        {/* ========================================== */}
        <footer className="bg-black py-10 px-6 text-center text-xs text-gray-400 flex flex-col items-center gap-5">
          <div className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="BeatClone" 
              className="h-6 w-auto object-contain opacity-90"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-black text-sm tracking-wider text-white">
              BEAT<span className="text-[#0066FF]">CLONE</span>
            </span>
          </div>

          <p className="text-[11px] text-gray-400 max-w-[320px] leading-relaxed">
            Transforme qualquer beat pago em uma versão sem direitos autorais com I.A. Oferta exclusiva de retorno com 50% OFF válida até {todayDate}.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                setWheelState('won');
                setShowRoulettePopup(true);
              }}
              className="text-[11px] text-[#38bdf8] hover:underline font-mono cursor-pointer flex items-center gap-1"
            >
              <Tag size={12} />
              <span>Ver meu prêmio na Roleta da Sorte</span>
            </button>
          </div>

          <p className="text-[10px] text-gray-500 font-mono mt-2">
            © 2026 BeatClone. Todos os direitos reservados.
          </p>
        </footer>

        {/* ========================================== */}
        {/* STICKY BOTTOM BAR (MOBILE & DESKTOP)       */}
        {/* ========================================== */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 bg-[#121212]/95 backdrop-blur-xl border-t border-red-500/40 p-3 flex items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-red-400 font-extrabold">
              <Clock size={11} className="animate-spin" />
              <span>SE SAIR PERDE O DESCONTO • {formatTime(timeLeft)}</span>
            </div>
            <p className="text-[11px] font-display font-black text-white truncate">
              Plano PRO por apenas <span className="text-[#38bdf8]">R$ 13,95</span>
            </p>
          </div>

          <button
            onClick={scrollToPlans}
            className="bg-gradient-to-r from-[#FF3B30] via-[#0066FF] to-[#0047b3] text-white font-display font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shrink-0 shadow-[0_0_15px_rgba(255,59,48,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Flame size={13} className="fill-white" />
            <span>GARANTIR 50% AGORA</span>
          </button>
        </div>
      </div>
    </div>
  );
}
