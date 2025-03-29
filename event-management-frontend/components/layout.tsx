'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-950">
      <Navbar
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
        onLogout={onLogout}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="transition-all duration-300">
        {children}
      </motion.main>
    </div>
  )
}