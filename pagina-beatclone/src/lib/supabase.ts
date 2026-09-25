import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { TypeBeat, Bonus } from '../types';

// Supabase Configuration
// Default URL points to the user's project (qijblktzycfbhqruprfc.supabase.co)
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://qijblktzycfbhqruprfc.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_dummy_key_placeholder';

export const DEFAULT_STORAGE_BUCKET = 
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'midias';

// Primary Supabase Client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    }
  }
});

// Cache for verified URLs to ensure instantaneous (0ms) resolution
const mediaUrlCache = new Map<string, string>();
const audioPreloadCache = new Map<string, HTMLAudioElement>();
const imagePreloadCache = new Set<string>();

/**
 * Generates the direct Supabase Storage public CDN URL for a given asset path.
 * Served through Cloudflare edge caching for real-time, low-latency streaming.
 */
export function getSupabasePublicUrl(path: string, bucket: string = DEFAULT_STORAGE_BUCKET): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`;
}

/**
 * Resolves a media URL with Supabase preference, fallback support, and instant caching.
 */
export function resolveMediaUrl(
  supabasePath: string, 
  localFallback: string, 
  bucket: string = DEFAULT_STORAGE_BUCKET
): string {
  const cacheKey = `${bucket}:${supabasePath}`;
  if (mediaUrlCache.has(cacheKey)) {
    return mediaUrlCache.get(cacheKey)!;
  }

  // Pre-seed with the direct Supabase public CDN URL
  const supabaseUrl = getSupabasePublicUrl(supabasePath, bucket);
  return supabaseUrl;
}

/**
 * Preloads an audio file from Supabase in the background so that when the user
 * clicks Play, the playback starts with 0ms buffering delay.
 */
export function preloadAudio(url: string): HTMLAudioElement {
  if (audioPreloadCache.has(url)) {
    return audioPreloadCache.get(url)!;
  }
  
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = url;
  audio.load();
  audioPreloadCache.set(url, audio);
  return audio;
}

/**
 * Preloads an image file from Supabase in the background for instant rendering.
 */
export function preloadImage(url: string): void {
  if (imagePreloadCache.has(url) || typeof window === 'undefined') return;
  
  const img = new Image();
  img.src = url;
  img.onload = () => {
    imagePreloadCache.add(url);
  };
}

/**
 * Hook to dynamically load a media URL from Supabase with instant fallback.
 * Checks availability in the background and notifies component if live Supabase
 * file is available or updated in real time.
 */
export function useSupabaseMedia(
  supabasePath: string,
  localFallback: string,
  bucket: string = DEFAULT_STORAGE_BUCKET
): string {
  const cacheKey = `${bucket}:${supabasePath}`;
  const [url, setUrl] = useState<string>(() => {
    if (mediaUrlCache.has(cacheKey)) {
      return mediaUrlCache.get(cacheKey)!;
    }
    return localFallback;
  });

  useEffect(() => {
    let isMounted = true;
    const directUrl = getSupabasePublicUrl(supabasePath, bucket);

    // Fast HEAD check to verify if the asset is active in Supabase Storage
    const checkSupabase = async () => {
      try {
        const response = await fetch(directUrl, { method: 'HEAD' });
        if (response.ok && isMounted) {
          mediaUrlCache.set(cacheKey, directUrl);
          setUrl(directUrl);
          // If it is an image, preload it
          if (/\.(png|jpe?g|webp|svg|gif)$/i.test(supabasePath)) {
            preloadImage(directUrl);
          }
        } else if (isMounted && !mediaUrlCache.has(cacheKey)) {
          setUrl(localFallback);
        }
      } catch (err) {
        // In case of network/cors issue, gracefully keep fallback
        if (isMounted && !mediaUrlCache.has(cacheKey)) {
          setUrl(localFallback);
        }
      }
    };

    checkSupabase();

    // Listen for Realtime storage broadcasts or updates
    const channel = supabase
      .channel(`media-sync-${supabasePath.replace(/[^a-zA-Z0-9]/g, '_')}`)
      .on('broadcast', { event: 'media-update' }, (payload) => {
        if (payload?.payload?.path === supabasePath && isMounted) {
          // Add cache buster query param for live hot-reload
          const updatedUrl = `${directUrl}?t=${Date.now()}`;
          mediaUrlCache.set(cacheKey, updatedUrl);
          setUrl(updatedUrl);
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [supabasePath, localFallback, bucket]);

  return url;
}
