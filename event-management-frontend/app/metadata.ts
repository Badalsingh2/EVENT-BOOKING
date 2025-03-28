import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'EventPro',
    template: '%s | EventPro',
  },
  description: 'Comprehensive Event Management Platform',
  keywords: ['Events', 'Management', 'Ticketing', 'Registration'],
  openGraph: {
    title: 'EventPro',
    description: 'Professional Event Management Platform',
    url: 'https://yourapp.com',
    siteName: 'EventPro',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}