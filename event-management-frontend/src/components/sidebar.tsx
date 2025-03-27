'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  HomeIcon, 
  PersonIcon, 
  RocketIcon, 
  HamburgerMenuIcon, 
  Cross1Icon 
} from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const sidebarLinks = [
    { 
      href: '/', 
      icon: <HomeIcon className="h-5 w-5" />, 
      label: 'Dashboard' 
    },
    { 
      href: '/events', 
      icon: <RocketIcon className="h-5 w-5" />, 
      label: 'Events' 
    },
    { 
      href: '/profile', 
      icon: <PersonIcon className="h-5 w-5" />, 
      label: 'Profile' 
    },
  ]

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-background p-2 rounded-md shadow-md"
      >
        {isOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-64 bg-background border-r border-border transform transition-transform duration-300 z-40",
        "md:translate-x-0", // Always visible on medium and larger screens
        isOpen ? "translate-x-0" : "-translate-x-full", // Slide in/out on mobile
        "pt-16 md:pt-0" // Adjust for navbar on mobile
      )}>
        <div className="space-y-2 p-4">
          {sidebarLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md transition"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 md:hidden z-30"
        />
      )}
    </>
  )
}