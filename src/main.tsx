import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Providers } from './Providers';
import './globals.css';

console.log('main.tsx: Module execution start');

const container = document.getElementById('root');
console.log('main.tsx: container found:', !!container);
if (container) {
    console.log('main.tsx: Rendering App...');
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <Providers>
                <App />
            </Providers>
        </React.StrictMode>
    );
}

