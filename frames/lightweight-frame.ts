// Light-weight Frame implementation for TIP FAV
// This is a simplified version focusing on the core tipping functionality

export async function GET(request: Request) {
  const url = new URL(request.url);
  const creatorFid = url.searchParams.get('creatorFid') || '1';
  const creatorName = url.searchParams.get('creatorName') || 'Creator';
  const tipAmount = url.searchParams.get('tipAmount') || '0.001';

  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>TIP FAV - Tip ${creatorName}</title>
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="https://tip-fav.vercel.app/api/og/tip?creator=${creatorName}&amount=${tipAmount}">
        <meta name="fc:frame:button:1" content="Confirm ${tipAmount} ETH Tip">
        <meta name="fc:frame:button:1:action" content="post">
        <meta name="fc:frame:button:1:target" content="https://tip-fav.vercel.app/frames/tip?creatorFid=${creatorFid}&creatorName=${creatorName}&amount=${tipAmount}">
        <meta name="fc:frame:button:2" content="Change Amount">
        <meta name="fc:frame:button:2:action" content="post">
        <meta name="fc:frame:button:2:target" content="https://tip-fav.vercel.app/frames/amount-options?creatorFid=${creatorFid}&creatorName=${creatorName}">
        <meta name="fc:frame:post_url" content="https://tip-fav.vercel.app/frames/process-tip">
      </head>
      <body>
        <div style="padding: 20px;">
          <h1>Tip ${creatorName}</h1>
          <p>Confirm your ${tipAmount} ETH tip</p>
        </div>
      </body>
    </html>
  `);
}

export async function POST(request: Request) {
  // Parse the frame message
  const body = await request.json();
  
  // Extract user information from the frame
  const { untrustedData } = body;
  const { fid, inputText } = untrustedData;
  
  // For simplicity, we'll just return a confirmation frame
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>TIP FAV - Confirmation</title>
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="https://tip-fav.vercel.app/api/og/confirm?fid=${fid}">
        <meta name="fc:frame:button:1" content="Complete Tip">
        <meta name="fc:frame:button:1:action" content="post">
        <meta name="fc:frame:button:1:target" content="https://tip-fav.vercel.app/frames/complete-tip">
        <meta name="fc:frame:post_url" content="https://tip-fav.vercel.app/frames/finalize-tip">
      </head>
      <body>
        <div style="padding: 20px;">
          <h1>Confirm Tip</h1>
          <p>Your tip is ready to be processed</p>
        </div>
      </body>
    </html>
  `);
}