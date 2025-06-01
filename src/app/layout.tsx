
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'IRCTC Book My Train – 60 Days',
  description: 'Your smart assistant for Indian Railways ticket booking reminders and travel planning. Calculate booking dates, set calendar reminders, and chat with an AI assistant.',
  keywords: ['train ticket', 'indian railways', 'booking reminder', 'irctc', 'travel planning', 'ai assistant', '60 days booking'],
  authors: [{ name: 'Train Ticket Reminder App' }],
  openGraph: {
    title: 'IRCTC Book My Train – 60 Days',
    description: 'Never miss the train ticket booking window for Indian Railways. Get reminders and AI assistance.',
    type: 'website',
    // url: 'your-app-url.com', // Replace with actual URL when deployed
    // images: [ // Add a suitable image URL
    //   {
    //     url: 'your-app-og-image.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Train Ticket Reminder App',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IRCTC Book My Train – 60 Days',
    description: 'Plan your Indian Railways journey with booking reminders and AI help.',
    // site: '@yourtwitterhandle', // Replace with actual Twitter handle
    // creator: '@yourtwitterhandle', // Replace with actual Twitter handle
    // images: ['your-app-twitter-image.png'], // Replace with actual image URL
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
