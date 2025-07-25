import { useMonitoring } from './useMonitoring';

export function useActivityMonitoring() {
  const { sendEvent } = useMonitoring();

  function trackClick(element: string) {
    sendEvent('click', { element });
  }

  return { trackClick };
}
