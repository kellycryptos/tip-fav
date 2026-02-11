import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const fid = url.searchParams.get('fid') || '1';
  
  // Generate tipping interface image
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0f0f0f"/>
      <rect x="0" y="0" width="1200" height="630" fill="url(#gradient)"/>
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8b5cf6"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
      </defs>
      
      <circle cx="600" cy="150" r="60" fill="#ffffff"/>
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="42" fill="#ffffff" text-anchor="middle" font-weight="bold">
        Tip Creator FID: ${fid}
      </text>
      <text x="600" y="350" font-family="Arial, sans-serif" font-size="32" fill="#e2e8f0" text-anchor="middle">
        Choose your tip amount
      </text>
      <rect x="200" y="400" width="250" height="80" rx="12" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-width="2"/>
      <text x="325" y="450" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle">0.001 ETH</text>
      
      <rect x="475" y="400" width="250" height="80" rx="12" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-width="2"/>
      <text x="600" y="450" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle">0.005 ETH</text>
      
      <rect x="750" y="400" width="250" height="80" rx="12" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-width="2"/>
      <text x="875" y="450" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle">0.01 ETH</text>
      
      <text x="600" y="550" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle">
        TIP FAV - Farcaster Tipping App
      </text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}