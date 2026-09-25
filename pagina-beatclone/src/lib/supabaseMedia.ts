import { useState, useEffect, useRef } from 'react';
import { 
  getSupabasePublicUrl, 
  supabase, 
  preloadAudio, 
  preloadImage,
  DEFAULT_STORAGE_BUCKET 
} from './supabase';
import { TypeBeat, Bonus } from '../types';

// Fallback local media imports
import defaultLogo from '../../Midias/Logo.png';
import defaultMockupCelular from '../../Midias/Mockup/MockupCelular.png';
import defaultMockupNotebook from '../../Midias/Mockup/Beatfy-MockupNotebook.png';

import coverLeviano from '../../Midias/TypeBeats/TypeBeatLeviano.png';
import coverOrochi from '../../Midias/TypeBeats/TypeBeat Orochi.png';
import coverTravis from '../../Midias/TypeBeats/TypeBeat Travis Scott.png';
import coverCarti from '../../Midias/TypeBeats/TypeBeat Playboi Carti.png';

import audioLeviano from '../../Midias/TypeBeatsAudio/TypeLeviano.mp3';
import audioOrochi from '../../Midias/TypeBeatsAudio/TypeOrochi.mp3';
import audioTravis from '../../Midias/TypeBeatsAudio/TypeTravisScott.mp3';
import audioCarti from '../../Midias/TypeBeatsAudio/TypePlayboiCarti.mp3';

import b1 from '../../Midias/Bônus/B1.png';
import b2 from '../../Midias/Bônus/B2.png';
import b3 from '../../Midias/Bônus/B3.png';
import b4 from '../../Midias/Bônus/B4.png';

// Initial Type Beats definition with both local and Supabase paths
export const INITIAL_BEATS: (TypeBeat & { 
  supabaseCoverPath: string; 
  supabaseAudioPath: string;
})[] = [
  {
    id: 'beat-1',
    title: 'Type Leviano',
    producer: 'Prod. Beatfy',
    bpm: 78,
    scale: 'E♭ minor',
    tags: ['Leviano', 'Trap', 'Melodic'],
    duration: '3:12',
    isPremium: true,
    synthStyle: 'drake',
    cover: coverLeviano,
    audioUrl: audioLeviano,
    supabaseCoverPath: 'TypeBeats/TypeBeatLeviano.png',
    supabaseAudioPath: 'TypeBeatsAudio/TypeLeviano.mp3',
  },
  {
    id: 'beat-2',
    title: 'Type Orochi',
    producer: 'Prod. Beatfy',
    bpm: 127,
    scale: 'E♭ minor',
    tags: ['Orochi', 'Trap', 'Nacional'],
    duration: '2:54',
    isPremium: true,
    synthStyle: 'travis',
    cover: coverOrochi,
    audioUrl: audioOrochi,
    supabaseCoverPath: 'TypeBeats/TypeBeat Orochi.png',
    supabaseAudioPath: 'TypeBeatsAudio/TypeOrochi.mp3',
  },
  {
    id: 'beat-3',
    title: 'Type Travis Scott',
    producer: 'Prod. Beatfy',
    bpm: 136,
    scale: 'D minor',
    tags: ['Travis Scott', 'Trap', 'Dark'],
    duration: '3:15',
    isPremium: true,
    synthStyle: 'metro',
    cover: coverTravis,
    audioUrl: audioTravis,
    supabaseCoverPath: 'TypeBeats/TypeBeat Travis Scott.png',
    supabaseAudioPath: 'TypeBeatsAudio/TypeTravisScott.mp3',
  },
  {
    id: 'beat-4',
    title: 'Type Playboi Carti',
    producer: 'Prod. Beatfy',
    bpm: 144,
    scale: 'C minor',
    tags: ['Playboi Carti', 'Rage', 'Synth'],
    duration: '2:45',
    isPremium: true,
    synthStyle: 'travis',
    cover: coverCarti,
    audioUrl: audioCarti,
    supabaseCoverPath: 'TypeBeats/TypeBeat Playboi Carti.png',
    supabaseAudioPath: 'TypeBeatsAudio/TypePlayboiCarti.mp3',
  },
];

// Initial Bonus definition with both local and Supabase paths
export const INITIAL_BONUSES: (Bonus & { supabaseCoverPath: string })[] = [
  {
    id: "bonus-1",
    title: "I.A treinada para escrever letras de Trap.",
    description: "Nunca mais sofra com bloqueio criativo. Crie versos, refrões e rimas perfeitas adaptadas ao seu estilo em segundos.",
    originalPrice: 197,
    iconName: "Sparkles",
    cover: "https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/bonus/AICopywriter.jfif",
    supabaseCoverPath: "bonus/AICopywriter.jfif",
  },
  {
    id: "bonus-2",
    title: "Comunidade exclusiva.",
    description: "Faça networking, encontre outros artistas, feche parcerias, compartilhe suas faixas e evolua junto com a cena.",
    originalPrice: 97,
    iconName: "Users",
    cover: "https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/bonus/Comunidade.jpg",
    supabaseCoverPath: "bonus/Comunidade.jpg",
  },
  {
    id: "bonus-3",
    title: "Desafio de 21 dias para viralizar como artista independente.",
    description: "O plano de ação diário passo a passo para postar seus sons, criar conteúdo viral e chamar atenção de gravadoras.",
    originalPrice: 147,
    iconName: "TrendingUp",
    cover: "https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/bonus/Viralizar21Dias.jpg",
    supabaseCoverPath: "bonus/Viralizar21Dias.jpg",
  },
  {
    id: "bonus-4",
    title: "Modelo de perfis que viralizam artistas.",
    description: "Templates, estruturas de biografia, posicionamento visual e formatos de vídeos validados que transformam visualizações em fãs fiéis.",
    originalPrice: 127,
    iconName: "Layout",
    cover: "https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/bonus/EstruturaDePerfil.png",
    supabaseCoverPath: "bonus/EstruturaDePerfil.png",
  },
];

/**
 * Preloads all media assets into the browser cache upfront.
 * This guarantees 0ms delay when user interacts with beats or scrolls.
 */
export function preloadAllAppMedia(): void {
  if (typeof window === 'undefined') return;

  // Preload Images
  const imagesToPreload = [
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/BeatCloneLogo.png',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/mockup/BeatCloneMockup1.png',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/mockup/BeatCloneMockup3SemFundo.png',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/beatsCapa/PlayboiAntes.png',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/beatsCapa/PlayboiDepois.png',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/beatsCapa/BrandaoAntes.png',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/beatsCapa/BrandaoDepois.png',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/bonus/AICopywriter.jfif',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/bonus/Comunidade.jpg',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/bonus/Viralizar21Dias.jpg',
    'https://xpxvqysciqwnysufujnx.supabase.co/storage/v1/object/public/media/bonus/EstruturaDePerfil.png',
    defaultLogo,
    defaultMockupCelular,
    defaultMockupNotebook,
  ];
  imagesToPreload.forEach(preloadImage);

  // Preload Beat Audio files
  const audioUrls = [
    'https://pub-77b507c58a5640869754c46ba3b90061.r2.dev/PlayboiAntes.WAV',
    'https://pub-77b507c58a5640869754c46ba3b90061.r2.dev/PlayboiRecriado.WAV',
    'https://pub-77b507c58a5640869754c46ba3b90061.r2.dev/BrandaoAntes.WAV',
    'https://pub-77b507c58a5640869754c46ba3b90061.r2.dev/BrandaoRecriado.WAV',
  ];
  audioUrls.forEach(preloadAudio);
}

/**
 * Hook to manage Type Beats with real-time Supabase sync and zero-latency playback.
 */
export function useLiveTypeBeats() {
  const [beats, setBeats] = useState<TypeBeat[]>(INITIAL_BEATS);
  const audioPoolRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Initialize and pre-warm audio pool for zero delay
  useEffect(() => {
    beats.forEach((beat) => {
      if (beat.audioUrl && !audioPoolRef.current.has(beat.id)) {
        const audio = new Audio(beat.audioUrl);
        audio.preload = 'auto';
        audioPoolRef.current.set(beat.id, audio);
      }
    });

    return () => {
      audioPoolRef.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioPoolRef.current.clear();
    };
  }, []);

  // Sync with Supabase Storage & Database in real time
  useEffect(() => {
    let isMounted = true;

    // Check each beat in Supabase Storage and switch to Supabase CDN when active
    INITIAL_BEATS.forEach(async (initBeat) => {
      const sbCover = getSupabasePublicUrl(initBeat.supabaseCoverPath);
      const sbAudio = getSupabasePublicUrl(initBeat.supabaseAudioPath);

      try {
        const [coverRes, audioRes] = await Promise.allSettled([
          fetch(sbCover, { method: 'HEAD' }),
          fetch(sbAudio, { method: 'HEAD' })
        ]);

        const hasSbCover = coverRes.status === 'fulfilled' && coverRes.value.ok;
        const hasSbAudio = audioRes.status === 'fulfilled' && audioRes.value.ok;

        if (isMounted && (hasSbCover || hasSbAudio)) {
          setBeats((prev) =>
            prev.map((b) => {
              if (b.id !== initBeat.id) return b;
              const newCover = hasSbCover ? sbCover : b.cover;
              const newAudio = hasSbAudio ? sbAudio : b.audioUrl;

              // Preload the updated audio immediately
              if (hasSbAudio && newAudio) {
                const pooled = audioPoolRef.current.get(b.id);
                if (pooled) {
                  pooled.src = newAudio;
                  pooled.load();
                } else {
                  const freshAudio = new Audio(newAudio);
                  freshAudio.preload = 'auto';
                  audioPoolRef.current.set(b.id, freshAudio);
                }
              }

              return {
                ...b,
                cover: newCover,
                audioUrl: newAudio,
              };
            })
          );
        }
      } catch (err) {
        // Keep fallback
      }
    });

    // Real-time channel for live updates
    const channel = supabase
      .channel('realtime-typebeats')
      .on('broadcast', { event: 'beat-update' }, (payload) => {
        if (!isMounted || !payload?.payload) return;
        const updated = payload.payload as Partial<TypeBeat> & { id: string };
        setBeats((prev) =>
          prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b))
        );
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { beats, audioPool: audioPoolRef };
}

/**
 * Hook to manage Bonuses with live Supabase covers
 */
export function useLiveBonuses() {
  const [bonuses] = useState<Bonus[]>(INITIAL_BONUSES);
  return bonuses;
}

/**
 * Standard app images with live Supabase resolution
 */
export const APP_MEDIA = {
  logo: {
    supabasePath: 'Logo.png',
    fallback: defaultLogo,
  },
  mockupCelular: {
    supabasePath: 'Mockup/MockupCelular.png',
    fallback: defaultMockupCelular,
  },
  mockupNotebook: {
    supabasePath: 'Mockup/Beatfy-MockupNotebook.png',
    fallback: defaultMockupNotebook,
  },
};
