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

  const { fid, username, displayName } = frameMessage;
  const url = new URL(req.url);
  const targetFid = url.searchParams.get('fid') || fid.toString();
  
  // Return tipping frame
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>TIP FAV - Tip Creator</title>
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="${process.env.NEXT_PUBLIC_APP_URL}/api/frames/tip-image?fid=${targetFid}">
        <meta name="fc:frame:button:1" content="0.001 ETH">
        <meta name="fc:frame:button:1:action" content="post">
        <meta name="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_APP_URL}/frames/process-tip?amount=0.001&token=ETH&fid=${targetFid}">
        <meta name="fc:frame:button:2" content="0.005 ETH">
        <meta name="fc:frame:button:2:action" content="post">
        <meta name="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_APP_URL}/frames/process-tip?amount=0.005&token=ETH&fid=${targetFid}">
        <meta name="fc:frame:button:3" content="0.01 ETH">
        <meta name="fc:frame:button:3:action" content="post">
        <meta name="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_APP_URL}/frames/process-tip?amount=0.01&token=ETH&fid=${targetFid}">
        <meta name="fc:frame:button:4" content="View Profile">
        <meta name="fc:frame:button:4:action" content="post">
        <meta name="fc:frame:button:4:target" content="${process.env.NEXT_PUBLIC_APP_URL}/frames/profile?fid=${targetFid}">
      </head>
      <body>
        <h1>Tip Creator</h1>
      </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
    status: 200,
  });
}