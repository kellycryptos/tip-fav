import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Providers } from './Providers';
import './globals.css';

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

