'use client'

import React, { useState, useEffect } from 'react'
import {
  MoonIcon,
  SunIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  ExitIcon,
  DashboardIcon,
  PersonIcon,
  CalendarIcon
} from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
    return <nav className="sticky top-0 z-40 w-full h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 shadow-sm" />
  }

  // Handle rendering the correct icon based on current theme
  const isDarkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')

  // Check if user is admin directly from localStorage
  let dashboardLink = '/'
  let eventLink = '/event'
  if (typeof window !== 'undefined') {
    try {
      const userJSON = localStorage.getItem('user')
      if (userJSON) {
        const userData = JSON.parse(userJSON)
        if (userData && userData.role === 'admin') {
          dashboardLink = '/admin'
          eventLink = '/admin/events'
        }
      }
    } catch (error) {
      console.error('Error reading user data from localStorage:', error)
    }
  }
  
  // Navigation items with dynamic dashboard link
  const navItems = [
    { name: 'Dashboard', href: dashboardLink, icon: <DashboardIcon className="h-4 w-4 mr-2" /> },
    { name: 'Events', href: eventLink, icon: <CalendarIcon className="h-4 w-4 mr-2" /> },
    { name: 'Profile', href: '/profile', icon: <PersonIcon className="h-4 w-4 mr-2" /> }
  ]

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-40 w-full ${
        scrolled 
          ? 'bg-gray-900/80 backdrop-blur-lg shadow-lg' 
          : 'bg-gray-900/60 backdrop-blur-md'
      } border-b border-gray-800/30 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Brand */}
          <div className="flex items-center">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <span className="font-extrabold text-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                  EventPro
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 transition-all group-hover:w-full duration-300"></span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isLoggedIn && (
              <div className="mr-4">
                <ul className="flex space-x-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link href={item.href}>
                          <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                          >
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              size="sm"
                              className={`${
                                isActive 
                                  ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                                  : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                              } transition-all duration-200`}
                            >
                              {item.icon}
                              {item.name}
                            </Button>
                          </motion.div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Theme Toggle */}
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.1 }}
              whileTap={{ rotate: 0, scale: 0.9 }}
              className="mr-4"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`rounded-full ${isDarkMode ? 'bg-indigo-900/30 text-yellow-300' : 'bg-indigo-100/10 text-indigo-400'} hover:bg-indigo-800/40`}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </Button>
            </motion.div>

            {/* Authentication Buttons or User Profile */}
            {isLoggedIn ? (
              <div className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center"
                >
                  <Link href="/profile">
                    <motion.div
                      whileHover={{ y: -2, backgroundColor: 'rgba(79, 70, 229, 0.2)' }}
                      className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer border border-transparent hover:border-indigo-500/30 transition-all duration-300"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8 ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900">
                          {userProfile.image ? (
                            <AvatarImage src={userProfile.image} alt={userProfile.name} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white">
                              {userProfile.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                      </div>
                      <span className="text-gray-200 font-medium">{userProfile.name}</span>
                    </motion.div>
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onLogout}
                      className="ml-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-colors duration-300"
                    >
                      <ExitIcon className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/login">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="cursor-pointer border-indigo-500 text-indigo-300 hover:bg-indigo-900/30 transition-colors duration-300"
                    >
                      Login
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/register">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-indigo-500/30 transition-all duration-300"
                    >
                      Register
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ rotate: 0, scale: 0.9 }}
              className="mr-2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`rounded-full ${isDarkMode ? 'bg-indigo-900/30 text-yellow-300' : 'bg-indigo-100/10 text-indigo-400'} hover:bg-indigo-800/40`}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-indigo-400 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/60"
              >
                {isMobileMenuOpen ? (
                  <Cross1Icon className="h-5 w-5" />
                ) : (
                  <HamburgerMenuIcon className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-gradient-to-b from-gray-900 to-gray-900/95 backdrop-blur-lg border-b border-gray-800/50"
          >
            <div className="px-4 py-5 space-y-3">
              {isLoggedIn && (
                <>
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start ${
                              isActive 
                                ? "bg-indigo-600 text-white" 
                                : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                            }`}
                          >
                            {item.icon}
                            {item.name}
                          </Button>
                        </Link>
                      </motion.div>
                    )
                  })}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent my-3"></div>
                </>
              )}
              
              {isLoggedIn ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center space-x-3 p-3 bg-gray-800/40 hover:bg-gray-800/60 rounded-xl backdrop-blur-sm border border-gray-700/50">
                        <div className="relative">
                          <Avatar className="h-10 w-10 ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900">
                            {userProfile.image ? (
                              <AvatarImage src={userProfile.image} alt={userProfile.name} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white">
                                {userProfile.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-medium">{userProfile.name}</span>
                          <span className="text-xs text-indigo-400">View Profile</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
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
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-indigo-400 border-indigo-500/50 hover:bg-indigo-900/30"
                      >
                        Login
                      </Button>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="default" 
                        className="w-full justify-start bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      >
                        Register
                      </Button>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}