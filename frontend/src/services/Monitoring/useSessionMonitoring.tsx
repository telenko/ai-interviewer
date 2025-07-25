// useSessionAnalytics.ts
import { useEffect, useRef } from 'react';
import { useMonitoring } from './useMonitoring';
import { generateSessionId, LS_SESSION_KEY, SESSION_TTL } from './monitoringUtils';

const userActivityEvents = [
  // Mouse
  'mousemove',
  'mousedown',
  'mouseup',
  'click',
  'dblclick',
  'contextmenu',
  'wheel',
  'scroll',

  // Hover
  'mouseover',
  'mouseout',
  'mouseenter',
  'mouseleave',

  // Keyboard
  'keydown',
  'keyup',
  'keypress',

  // Sensors
  'touchstart',
  'touchmove',
  'touchend',
  'touchcancel',

  // Pointer events
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointercancel',

  // window interaction
  'resize',
  'focus',
  'blur',
  'visibilitychange',
];

function prolongSession() {
  const now = Date.now();
  localStorage.setItem('lastActive', `${now}`);
}

export function useSessionMonitoring() {
  const { sendEvent, flushBuffer } = useMonitoring();
  const sessionId = useRef<string | null>(null);

  function syncSessionId() {
    sessionId.current = localStorage.getItem(LS_SESSION_KEY);
  }

  useEffect(() => {
    const now = Date.now();
    let sid = localStorage.getItem(LS_SESSION_KEY);
    const lastActive = parseInt(localStorage.getItem('lastActive') || '0');

    if (!sid || now - lastActive > SESSION_TTL) {
      sid = generateSessionId();
      localStorage.setItem(LS_SESSION_KEY, sid);
      console.log('START');
      sendEvent('session_start', { sessionId: sid });
    }

    sessionId.current = sid;
    prolongSession();

    window.addEventListener('beforeunload', handleUnload);
    userActivityEvents.forEach((event) => {
      window.addEventListener(event, prolongSession);
    });

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      userActivityEvents.forEach((event) => {
        window.removeEventListener(event, prolongSession);
      });
    };
  }, []);

  function handleUnload() {
    syncSessionId();
    if (!sessionId.current) {
      return;
    }
    sendEvent('session_end', { sessionId: sessionId.current });
    flushBuffer();
  }

  return null;
}
