import type { PropsWithChildren } from 'react';
import { useSessionMonitoring } from './useSessionMonitoring';

const MonitoringProvider = (props: PropsWithChildren) => {
  useSessionMonitoring();
  return props.children;
};

export default MonitoringProvider;
