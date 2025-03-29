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
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface NavbarProps {
  isLoggedIn?: boolean
  userProfile?: {
    name: string
    image?: string
  }
  onLogout?: () => void
}

export function Navbar({
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
    return <nav className="sticky top-0 z-40 w-full h-16 bg-gray-900 backdrop-blur-md border-b border-gray-800 shadow-sm" />
  }

  // Handle rendering the correct icon based on current theme
  const isDarkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')

  return (
    <nav className="sticky top-0 z-40 w-full bg-gray-900 backdrop-blur-md border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Brand */}
          <div className="flex items-center">
            <Link href="/">
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
                EventPro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Authentication Buttons or User Profile */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2"
                >
                  <Link href="/profile">
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                      <Avatar className="h-8 w-8 border-2 border-indigo-500">
                        {userProfile.image ? (
                          <AvatarImage src={userProfile.image} alt={userProfile.name} />
                        ) : (
                          <AvatarFallback className="bg-indigo-900 text-indigo-200">
                            {userProfile.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-gray-200">{userProfile.name}</span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                  >
                    <ExitIcon className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="cursor-pointer border-indigo-500 text-indigo-300 hover:bg-indigo-900/30">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" size="sm" className="cursor-pointer bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white">
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
              className="text-indigo-400 mr-2"
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
              className="md:hidden text-indigo-400 border-gray-700"
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
            className="md:hidden bg-gray-900 border-b border-gray-800"
          >
            <div className="px-4 py-3 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg">
                      <Avatar className="h-8 w-8 border-2 border-indigo-500">
                        {userProfile.image ? (
                          <AvatarImage src={userProfile.image} alt={userProfile.name} />
                        ) : (
                          <AvatarFallback className="bg-indigo-900 text-indigo-200">
                            {userProfile.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-gray-200">{userProfile.name}</span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/30"
                  >
                    <ExitIcon className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-indigo-400">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-start bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white">
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