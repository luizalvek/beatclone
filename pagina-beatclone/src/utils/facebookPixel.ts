export const FB_PIXEL_ID = '1741462783541395';
export const FB_ACCESS_TOKEN = 'EAAR6bKnubhkBSZAhVr3fGmxGTjF4TJZBBy0FhYP2NuPlZBJaduD5E3ETBDDBHHNdyQXndM5XIwDazX983KtJ0XvxZB7ZAL337AoE71MkBwuaZCoSnMfkxiw1RZAM3ipu9CdmZBNyxBUOmX25NcNBAeJICknhOXuBi4dIwzA6EHWIgfeZCUid6ZCBLc9CBDRwiCdgZDZD';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Sends event directly to Meta Conversions API (CAPI) for 100% reliable tracking
 */
async function sendCapiEvent(eventName: string, customData?: Record<string, any>) {
  try {
    const url = `https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`;
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: typeof window !== 'undefined' ? window.location.href : '',
          user_data: {
            client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          },
          custom_data: customData || {}
        }
      ]
    };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Meta CAPI dispatch notice:', err));
  } catch (err) {
    console.warn('CAPI error:', err);
  }
}

/**
 * Tracks PageView event via Meta Pixel & CAPI
 */
export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
  sendCapiEvent('PageView');
}

/**
 * Handles checkout navigation state (registers PageView only as requested)
 */
export function trackInitiateCheckout(_planName?: string, _priceValue?: number) {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('beatfy_checkout_visited', 'true');
      sessionStorage.setItem('beatfy_checkout_time', Date.now().toString());
    } catch (e) {
      // Ignore storage errors
    }
  }
}
