"use client"

import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar 
          onSidebarToggle={toggleSidebar} 
          onNavbarVisibilityChange={setIsNavbarVisible}
          isVisible={isNavbarVisible}
        />
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar} 
          isNavbarVisible={isNavbarVisible}
        />
        
        <main className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-0",
          "pt-16 min-h-screen"
        )}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default Layout