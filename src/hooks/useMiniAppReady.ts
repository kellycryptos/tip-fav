import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';

export function useMiniAppReady() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);
}