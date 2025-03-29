'use client'

import React, { useState, useEffect } from 'react'
import {
  MoonIcon,
  SunIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PersonIcon,
  ExitIcon
} from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface NavbarProps {
  onSidebarToggle: () => void
  isSidebarOpen: boolean
  isLoggedIn?: boolean
  userProfile?: {
    name: string
    image?: string
  }
  onLogout?: () => void
}

export function Navbar({
  onSidebarToggle,
  isSidebarOpen,
  isLoggedIn = false,
  userProfile = { name: 'User' },
  onLogout = () => console.log('Logout clicked')
}: NavbarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  // Close mobile menu when viewport width changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileMenuOpen])

  if (!mounted) {
    return <nav className="sticky top-0 z-40 w-full h-16 bg-white/90 dark:bg-purple-950/90 backdrop-blur-md border-b border-purple-700/30 shadow-sm" />
  }

  // Handle rendering the correct icon based on current theme
  const isDarkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 dark:bg-purple-950/90 backdrop-blur-md border-b border-purple-700/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Sidebar toggle and Brand */}
          <div className="flex items-center">
            <button
              onClick={onSidebarToggle}
              className="mr-2 p-2 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <ChevronLeftIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>
            <Link href="/">
              <span className="font-bold text-xl text-purple-800 dark:text-purple-100">
                EventPro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-purple-600 dark:text-purple-300"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>

            {/* Authentication Buttons or User Profile */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2"
                >
                  <Link href="/profile">
                    <div className="flex items-center space-x-2 p-2 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-lg cursor-pointer">
                      <Avatar className="h-8 w-8 border-2 border-purple-500">
                        {userProfile.image ? (
                          <AvatarImage src={userProfile.image} alt={userProfile.name} />
                        ) : (
                          <AvatarFallback className="bg-purple-200 text-purple-700">
                            {userProfile.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-purple-700 dark:text-purple-200">{userProfile.name}</span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <ExitIcon className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-300">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-purple-600 dark:text-purple-300 mr-2"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-purple-600 dark:text-purple-300 border-purple-700"
            >
              {isMobileMenuOpen ? (
                <Cross1Icon className="h-5 w-5" />
              ) : (
                <HamburgerMenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-purple-950 border-b border-purple-700/30"
          >
            <div className="px-4 py-3 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2 p-2 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-lg">
                      <Avatar className="h-8 w-8 border-2 border-purple-500">
                        {userProfile.image ? (
                          <AvatarImage src={userProfile.image} alt={userProfile.name} />
                        ) : (
                          <AvatarFallback className="bg-purple-200 text-purple-700">
                            {userProfile.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-purple-700 dark:text-purple-200">{userProfile.name}</span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <ExitIcon className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-purple-600 dark:text-purple-300">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}