function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  
  return Response.json({
    "accountAssociation": {
      "header": "",
      "payload": "",
      "signature": ""
    },
    "miniapp": {
      "version": "1",
      "name": "TIP FAV",
      "homeUrl": "https://tip-fav.vercel.app",
      "iconUrl": "https://tip-fav.vercel.app/icon.png",
      "splashImageUrl": "https://tip-fav.vercel.app/splash.png",
      "splashBackgroundColor": "#000000",
      "webhookUrl": "https://tip-fav.vercel.app/api/webhook",
      "subtitle": "Instant Farcaster Tipping",
      "description": "Tip your favorite Farcaster creators instantly with ETH or USDC",
      "screenshotUrls": [
        "https://tip-fav.vercel.app/screenshot1.png",
        "https://tip-fav.vercel.app/screenshot2.png",
        "https://tip-fav.vercel.app/screenshot3.png"
      ],
      "primaryCategory": "social",
      "tags": ["tipping", "farcaster", "crypto", "base"],
      "heroImageUrl": "https://tip-fav.vercel.app/hero.png",
      "tagline": "Tip creators instantly",
      "ogTitle": "TIP FAV - Farcaster Tipping App",
      "ogDescription": "Tip your favorite Farcaster creators instantly with ETH or USDC",
      "ogImageUrl": "https://tip-fav.vercel.app/og-image.png",
      "noindex": true
    }
  });
}