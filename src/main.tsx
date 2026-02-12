import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Providers } from './Providers';
import './globals.css';
import sdk from '@farcaster/miniapp-sdk';

// Trigger ready as early as possible to dismiss splash screen
try {
    if (typeof window !== 'undefined') {
        sdk.actions.ready();
    }
} catch (e) {
    console.error('Farcaster SDK ready error:', e);
}

const container = document.getElementById('root');
if (container) {
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <Providers>
                <App />
            </Providers>
        </React.StrictMode>
    );
}

