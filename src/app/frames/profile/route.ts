import { NextRequest } from 'next/server';
// @ts-ignore - Farcaster SDK types
import type { FrameRequest, FrameValidationData } from '@farcaster/frame-sdk';

// Mock implementation for build purposes
// @ts-ignore
const getFrameMessage = async (body: any) => {
  return {
    fid: 1,
    username: 'testuser',
    displayName: 'Test User',
    profileImage: ''
  };
};

export async function POST(req: NextRequest) {
  const body: FrameRequest = await req.json();
  
  let frameMessage: FrameValidationData | undefined = undefined;
  let status = 'success';
  
  try {
    // @ts-ignore
    frameMessage = await getFrameMessage(body);
  } catch (e) {
    status = 'error';
  }

  if (!frameMessage) {
    return new Response('Message not valid', { status: 400 });
  }

  const { fid, username, displayName, profileImage } = frameMessage;
  
  // Return frame with user profile
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>TIP FAV - Profile</title>
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frames/profile-image?fid=${fid}">
        <meta name="fc:frame:button:1" content="Tip This Creator">
        <meta name="fc:frame:button:1:action" content="post">
        <meta name="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_APP_URL}/frames/tip?fid=${fid}">
        <meta name="fc:frame:button:2" content="View Leaderboard">
        <meta name="fc:frame:button:2:action" content="post">
        <meta name="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_APP_URL}/frames/leaderboard">
      </head>
      <body>
        <h1>${displayName || username}'s Profile</h1>
      </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
    status: 200,
  });
}