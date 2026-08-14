import { useEffect, useRef, useState } from 'react';
import { fetchLatestOrderSignal } from '../lib/api';

const POLL_INTERVAL_MS = 15000;

// Génère un bip audible sans fichier externe (Web Audio API).
function playBeep() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    [880, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + i * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.4);
    });
  } catch {
    // Silencieux si l'audio n'est pas disponible (ex: onglet en arrière-plan sur certains navigateurs).
  }
}

// Alerte quand une nouvelle commande arrive : bip sonore + notification navigateur (si autorisée).
// N'appelle jamais de callback au tout premier chargement (on initialise juste la référence).
export function useOrderAlarm(onNewOrder?: () => void) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const lastIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setNotificationsEnabled(result === 'granted');
  };

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const signal = await fetchLatestOrderSignal();
        if (cancelled) return;

        if (!initializedRef.current) {
          // Premier appel : on mémorise juste l'état actuel, pas d'alarme au chargement de la page.
          lastIdRef.current = signal.latestId;
          initializedRef.current = true;
          return;
        }

        if (signal.latestId && signal.latestId !== lastIdRef.current) {
          lastIdRef.current = signal.latestId;
          playBeep();
          if (notificationsEnabled && typeof Notification !== 'undefined') {
            new Notification('🔔 Nouvelle commande', {
              body: 'Une nouvelle commande vient d\'arriver sur Élégance Hair.'
            });
          }
          onNewOrder?.();
        }
      } catch {
        // Silencieux : une erreur réseau ponctuelle ne doit pas spammer la console.
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsEnabled]);

  return { notificationsEnabled, requestNotificationPermission };
}
