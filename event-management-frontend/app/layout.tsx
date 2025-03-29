import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { AuthProvider } from '@/context/auth-context'
import { NavbarWrapper } from '@/components/NavbarWrapper' // Add this import

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'EventoMeter',
    description: 'Event Management',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn("min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-950", inter.variable)}>
                <AuthProvider>
                    <NavbarWrapper />
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}