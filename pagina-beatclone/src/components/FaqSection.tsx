import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      question: "Como funciona a BeatClone?",
      answer: "Você escolhe ou sobe qualquer áudio/link de beat como referência. Nossa I.A analisa a estrutura, o BPM, a harmonia e os timbres, e gera uma nova versão 100% autoral e inédita em segundos, sem direitos autorais."
    },
    {
      id: "faq-2",
      question: "Os beats gerados possuem direitos comerciais?",
      answer: "Sim! Os direitos são 100% seus. Você pode monetizar no Spotify, Apple Music, YouTube, vender a faixa para clientes ou lançar nas redes. Todo o lucro é exclusivamente seu."
    },
    {
      id: "faq-3",
      question: "Corro risco de tomar copyright strike?",
      answer: "Não. A BeatClone não faz cópia idêntica nem copia áudio protegido. Ela clona a estética e gera novos elementos musicais com inteligência artificial, garantindo segurança jurídica contra strikes."
    },
    {
      id: "faq-4",
      question: "Quantos beats posso gerar e baixar?",
      answer: "No plano vitalício, o uso e os downloads são ilimitados. Você pode produzir quantas faixas quiser para criar um catálogo massivo de lançamentos."
    },
    {
      id: "faq-5",
      question: "Preciso ter conhecimento de produção musical?",
      answer: "Zero conhecimento necessário. A interface foi feita para qualquer artista ou MC: suba a referência, aperte um botão e receba o beat mixado e masterizado pronto para gravar."
    },
    {
      id: "faq-6",
      question: "Qual a diferença entre o Plano Básico e o Plano PRO?",
      answer: "O Plano Básico (R$ 17,90) dá acesso à ferramenta de clonagem com I.A e direitos comerciais sem os bônus. O Plano PRO (R$ 27,90) inclui a ferramenta completa mais todos os 4 super bônus: I.A treinada para escrever letras de Trap, Comunidade exclusiva, Desafio de 21 dias para viralizar como artista independente e Modelo de perfis que viralizam artistas."
    },
    {
      id: "faq-7",
      question: "É assinatura mensal ou pagamento único?",
      answer: "É pagamento único com Acesso Vitalício! Você paga uma única vez e garante seu acesso para sempre, sem mensalidades nem taxas recorrentes."
    },
    {
      id: "faq-8",
      question: "Como e quando recebo meu acesso?",
      answer: "O envio é automático e imediato. Assim que o pagamento for aprovado, os dados de login e o link da plataforma são enviados direto para o seu e-mail."
    },
    {
      id: "faq-9",
      question: "Posso acessar pelo celular?",
      answer: "Sim, a BeatClone é 100% compatível com celulares, tablets e computadores diretamente pelo navegador."
    }
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 py-20 overflow-hidden bg-gradient-to-b from-[#010000] to-black">
      {/* Background radial glow */}
      <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-[#0066FF]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-[500px] mx-auto mb-12 z-10">
        <h2 className="font-display text-3xl font-extrabold text-white mt-2 leading-tight uppercase">
          Perguntas Frequentes
        </h2>
        <p className="text-white/50 text-xs mt-3 font-mono uppercase tracking-wider">
          Dúvidas comuns sobre a plataforma
        </p>
      </div>

      {/* Accordion List */}
      <div className="w-full max-w-[520px] z-10 flex flex-col gap-3">
        {faqs.map((faq, idx) => {
          const isOpen = openId === faq.id;
          return (
            <div 
              key={faq.id}
              className={`rounded-[16px] border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'bg-[#121212] border-[#0066FF]/40' 
                  : 'bg-[#121212]/85 border-white/5 hover:border-white/10'
              }`}
            >
              {/* Question Row */}
              <button 
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-4 md:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
              >
                <span className="font-display text-white text-xs md:text-sm font-bold leading-snug select-none">
                  {faq.question}
                </span>
                <span className={`p-1 rounded-full shrink-0 transition-colors ${isOpen ? 'bg-[#0066FF]/20 text-[#38bdf8]' : 'bg-white/5 text-white/50'}`}>
                  {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              {/* Answer Row (Animated collapse/expand) */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-white/[0.03] pt-3 text-xs text-white/60 leading-relaxed font-sans">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Elegant CTA footer subtext */}
      <div className="text-center max-w-[360px] mx-auto mt-12 px-4 z-10">
        <p className="text-white/40 text-xs font-mono leading-relaxed">
          Pagamento único e 100% seguro. Acesso vitalício sem mensalidades ou taxas recorrentes.
        </p>
      </div>
    </section>
  );
}
