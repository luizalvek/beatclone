import { useEffect, useState } from 'react';
import { trackPageView } from './utils/facebookPixel';
import { ShieldCheck, Check } from 'lucide-react';

// Section components imports
import HeroSection from './components/HeroSection';
import TypeBeatsSection from './components/TypeBeatsSection';
import WhatYouGetSection from './components/WhatYouGetSection';
import SocialProofSection from './components/SocialProofSection';
import HowItWorksSection from './components/HowItWorksSection';
import ComparisonSection from './components/ComparisonSection';
import BonusSection from './components/BonusSection';
import PlansSection from './components/PlansSection';
import FaqSection from './components/FaqSection';
import BackRedirectPage from './pages/BackRedirectPage';
import defaultLogo from '../Midias/Logo.png';
import { useSupabaseMedia } from './lib/supabase';
import { preloadAllAppMedia } from './lib/supabaseMedia';

// Time limit for checkout return state validity (20 minutes in milliseconds)
const CHECKOUT_EXPIRATION_MS = 20 * 60 * 1000;

function clearCheckoutReturnState() {
  try {
    sessionStorage.removeItem('beatfy_checkout_visited');
    sessionStorage.removeItem('beatfy_checkout_time');
  } catch (e) {
    // Ignore storage errors
  }
}

function isCheckoutReturnValid(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const visited = sessionStorage.getItem('beatfy_checkout_visited');
    const timeStr = sessionStorage.getItem('beatfy_checkout_time');

    if (visited !== 'true' || !timeStr) {
      return false;
    }

    const timestamp = parseInt(timeStr, 10);
    if (isNaN(timestamp)) {
      clearCheckoutReturnState();
      return false;
    }

    const elapsed = Date.now() - timestamp;
    if (elapsed > CHECKOUT_EXPIRATION_MS) {
      // Estado do checkout expirado - limpa para evitar falsos positivos futuros
      clearCheckoutReturnState();
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<'main' | 'back-redirect'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;

      if (
        path.includes('back-redirect') || 
        search.includes('redirect=true') || 
        search.includes('from_checkout') || 
        hash === '#back-redirect'
      ) {
        return 'back-redirect';
      }
      if (isCheckoutReturnValid()) {
        return 'back-redirect';
      }
    }
    return 'main';
  });

  const logo = 'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/BeatCloneLogo.png';

  // Pre-warm all app media into memory for instantaneous 0ms playback & loading
  useEffect(() => {
    preloadAllAppMedia();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [currentView]);

  // Handle direct hash navigation for #back-redirect
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#back-redirect') {
        setCurrentView('back-redirect');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Detection for leads returning after clicking CTAs in the Plans Section specifically
  useEffect(() => {
    const checkCheckoutReturn = () => {
      if (isCheckoutReturnValid()) {
        console.log('Lead returned from plans checkout! Showing 50% OFF Back Redirect page...');
        clearCheckoutReturnState();
        if (currentView !== 'back-redirect') {
          setCurrentView('back-redirect');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkCheckoutReturn();
      }
    };

    const handleFocus = () => {
      checkCheckoutReturn();
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || document.visibilityState === 'visible') {
        checkCheckoutReturn();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    checkCheckoutReturn();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [currentView]);

  // Intercept browser back button when lead attempts to go back from main sales page
  useEffect(() => {
    if (currentView !== 'main') return;

    // Push history state to capture browser Back button click on main page
    try {
      window.history.pushState({ page: 'beatfy-sales' }, '', window.location.href);
    } catch (e) {
      // Ignore history state limitations
    }

    const handlePopState = () => {
      console.log('Lead pressed back button on main page! Showing Back Redirect page...');
      setCurrentView('back-redirect');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentView]);

  const scrollToPlans = () => {
    const element = document.getElementById('plans');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const switchView = (view: 'main' | 'back-redirect') => {
    setCurrentView(view);
    if (view === 'back-redirect') {
      window.location.hash = 'back-redirect';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is viewing the Back Redirect Page
  if (currentView === 'back-redirect') {
    return <BackRedirectPage onBackToMain={() => switchView('main')} />;
  }

  // Render original main sales page
  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center font-sans selection:bg-primary selection:text-white relative">
      {/* Single Unified Responsive Container */}
      <div className="w-full max-w-[480px] bg-dark-bg text-white flex flex-col min-h-screen border-x border-white/5 shadow-2xl relative">
        {/* Render all sections sequentially */}
        <HeroSection onCtaClick={scrollToPlans} />
        
        <TypeBeatsSection onCtaClick={scrollToPlans} />
        
        <WhatYouGetSection onCtaClick={scrollToPlans} />
        
        <SocialProofSection onCtaClick={scrollToPlans} />
        
        <HowItWorksSection />
        
        <ComparisonSection onCtaClick={scrollToPlans} />
        
        <BonusSection />
        
        <PlansSection />
        
        <FaqSection />

        {/* Premium Footer */}
        <footer className="bg-black py-12 px-6 border-t border-white/5 text-center text-xs text-white/40 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="BeatClone" 
              className="h-7 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-extrabold text-sm tracking-wider text-white">BEAT<span className="text-[#0066FF]">CLONE</span></span>
          </div>
          
          <p className="max-w-[320px] leading-relaxed text-white/50">
            Transforme qualquer Beat Pago em uma versão sem direitos autorais com I.A. 100% liberdade para usar e monetizar.
          </p>

          {/* Minimal Nav Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-white/40 font-mono">
            <a href="#how-it-works" className="hover:text-[#0066FF] transition-colors">Como Funciona</a>
            <a href="#type-beats" className="hover:text-[#0066FF] transition-colors">Exemplos</a>
            <a href="#plans" className="hover:text-[#0066FF] transition-colors">Planos</a>
            <a href="#faq" className="hover:text-[#0066FF] transition-colors">FAQ</a>
          </div>
          
          <div className="w-full max-w-[300px] h-px bg-white/5 my-2" />

          {/* Security Seals */}
          <div className="flex justify-center gap-6 w-full max-w-[300px]">
            <div className="flex items-center gap-1.5 text-[10px] text-white/55 font-mono">
              <ShieldCheck size={13} className="text-[#0066FF]" />
              <span>Site 100% Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/55 font-mono">
              <Check size={13} className="text-[#0066FF]" />
              <span>Garantia de 7 Dias</span>
            </div>
          </div>

          <p className="text-[10px] text-white/30 font-mono mt-2">
            © 2026 BeatClone. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
}

