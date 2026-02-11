import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const fid = url.searchParams.get('fid') || '1';
  
  // Generate profile image with Farcaster user info
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
      
      <circle cx="600" cy="200" r="80" fill="#ffffff"/>
      <text x="600" y="350" font-family="Arial, sans-serif" font-size="48" fill="#ffffff" text-anchor="middle" font-weight="bold">
        FID: ${fid}
      </text>
      <text x="600" y="420" font-family="Arial, sans-serif" font-size="36" fill="#e2e8f0" text-anchor="middle">
        TIP FAV Creator
      </text>
      <text x="600" y="500" font-family="Arial, sans-serif" font-size="28" fill="#94a3b8" text-anchor="middle">
        Tip your favorite creators on Farcaster
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