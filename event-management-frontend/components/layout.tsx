'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { motion } from 'framer-motion'

interface AppLayoutProps {
  children: React.ReactNode
  isLoggedIn?: boolean
  userProfile?: {
    name: string
    image?: string
  }
  onLogout?: () => void
}

export function AppLayout({
  children,
  isLoggedIn = false,
  userProfile = { name: 'User' },
  onLogout = () => console.log('Logout clicked')
}: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    
    // Set initial state
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-950">
      <Navbar
        onSidebarToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onLogout={onLogout}
      />
      
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onLogout={onLogout}
      />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        }`}
      >
        <div className="p-4 md:p-8">
          {children}
        </div>
      </motion.main>
    </div>
  )
}