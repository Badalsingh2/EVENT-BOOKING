import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import './globals.css'

// Optimize font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 md:ml-64 mt-16 p-6">
                <div className="mx-auto max-w-7xl">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}