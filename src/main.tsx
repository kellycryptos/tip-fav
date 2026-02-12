import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Providers } from './Providers';
import './globals.css';
import sdk from '@farcaster/miniapp-sdk';

// Trigger ready as early as possible to dismiss splash screen
sdk.actions.ready();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Providers>
            <App />
        </Providers>
    </React.StrictMode>
);

