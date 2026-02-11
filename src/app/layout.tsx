import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";
import { ToastProvider } from "@/components/Toast";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TIP FAV - Farcaster Tipping App",
  description: "Tip your favorite Farcaster creators instantly with ETH or USDC",
  openGraph: {
    title: "TIP FAV",
    description: "Tip your favorite Farcaster creators instantly with ETH or USDC",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TIP FAV",
    description: "Tip your favorite Farcaster creators instantly with ETH or USDC",
    images: ["/og-image.png"],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: 'https://tip-fav.vercel.app/embed-image',
      button: {
        title: 'Launch TIP FAV',
        action: {
          type: 'launch_miniapp',
          name: 'TIP FAV',
          url: 'https://tip-fav.vercel.app',
          splashImageUrl: 'https://tip-fav.vercel.app/splash-image',
          splashBackgroundColor: '#000000',
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} antialiased`}
      >
        <Web3Provider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Web3Provider>
      </body>
    </html>
  );
}