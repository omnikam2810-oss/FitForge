import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export const useAppStatus = () => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('Checking services...');

  useEffect(() => {
    const check = async () => {
      try {
        const res = await apiClient.get('/health/sync');
        if (res.data?.message) {
          setMessage(res.data.message);
        }
        setStatus('ready');
      } catch (error) {
        setStatus('error');
        setMessage('Backend unavailable');
      }
    };

    check();
  }, []);

  return { status, message };
};
