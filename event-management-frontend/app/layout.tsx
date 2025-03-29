import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { AuthProvider } from '@/context/auth-context'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Your Application',
    description: 'Application Description',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn("min-h-screen font-sans antialiased", inter.variable)}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
