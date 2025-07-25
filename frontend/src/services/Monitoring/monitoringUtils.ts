export const SESSION_TTL = 30 * 60 * 1000;

export const LS_SESSION_KEY = 'applymatch:session:key';

export function generateSessionId() {
  return `s_${Math.random().toString(36).substring(2)}_${Date.now()}`;
}
