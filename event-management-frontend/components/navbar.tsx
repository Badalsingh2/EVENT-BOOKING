'use client'

import React, { useState, useEffect } from 'react'
import { 
  MoonIcon,
  SunIcon,
  HamburgerMenuIcon,
  Cross1Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface NavbarProps {
  onSidebarToggle: () => void
  isSidebarOpen: boolean
}

export function Navbar({ onSidebarToggle, isSidebarOpen }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40",
        "bg-white/80 dark:bg-purple-900/50",
        "backdrop-blur-md border-b border-purple-700/30",
        "shadow-sm"
      )}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <div className="flex items-center space-x-4">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800"
          >
            {isSidebarOpen ? (
              <ChevronLeftIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </Button> */}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>

          <div className="hidden md:flex space-x-2">
            <Link href="/login">
              <Button variant="secondary">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button>
                Register
              </Button>
            </Link>
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-purple-600 dark:text-purple-300 border-purple-700"
          >
            {isMobileMenuOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-purple-800"
          >
            <div className="flex flex-col items-center space-y-4 pb-6 px-4">
              <div className="flex space-x-2 mt-4 w-full">
                <Link href="/auth/login" className="w-full">
                  <Button variant="secondary" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" className="w-full">
                  <Button className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}