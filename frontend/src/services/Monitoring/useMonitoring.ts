import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

const BASE_MONITORING_URL = import.meta.env.VITE_MONITORING_URL;

let buffer: any[] = [];
let USER_ID: string;

function sendEvent(type: string, data: any = {}) {
  buffer.push({
    eventType: type,
    ...data,
  });
}

const flushBuffer = () => {
  if (buffer.length === 0 || !USER_ID) return;
  navigator.sendBeacon(
    BASE_MONITORING_URL + '/event',
    JSON.stringify({
      events: buffer,
      user_id: USER_ID,
    }),
  );
  buffer = [];
};

export function useMonitoring() {
  const auth = useAuth();

  // Отримуємо унікальний user ID (з Claim `sub`)
  const userId = auth.user?.profile?.sub;

  useEffect(() => {
    USER_ID = userId || '';
  }, [userId]);

  useEffect(() => {
    const flushInterval = setInterval(flushBuffer, 60 * 1000); // 1 хвилина

    return () => {
      clearInterval(flushInterval);
      flushBuffer();
    };
  }, [flushBuffer]);

  return { sendEvent, flushBuffer };
}
