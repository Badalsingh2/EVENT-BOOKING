'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    HomeIcon,
    PersonIcon,
    RocketIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExitIcon,
    GearIcon
} from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
    isLoggedIn?: boolean
    userProfile?: {
        name: string
        image?: string
    }
    onLogout?: () => void
}

export function Sidebar({ 
    isOpen, 
    onToggle, 
    isLoggedIn = false, 
    userProfile = { name: 'User' },
    onLogout = () => console.log('Logout clicked')
}: SidebarProps) {
    // Common sidebar links
    const commonLinks = [
        {
            href: '/dashboard',
            icon: <HomeIcon className="h-5 w-5" />,
            label: 'Dashboard'
        },
        {
            href: '/events',
            icon: <RocketIcon className="h-5 w-5" />,
            label: 'Events'
        },
    ]
    
    // Links shown only when logged in
    const loggedInLinks = [
        {
            href: '/profile',
            icon: <PersonIcon className="h-5 w-5" />,
            label: 'Profile'
        },
        {
            href: '/settings',
            icon: <GearIcon className="h-5 w-5" />,
            label: 'Settings'
        },
    ]
    
    // Combine links based on login status
    const sidebarLinks = isLoggedIn 
        ? [...commonLinks, ...loggedInLinks]
        : commonLinks
    
    return (
        <>
            <motion.div
                initial={{ x: '-100%' }}
                animate={{
                    x: isOpen ? 0 : '-100%',
                    transition: {
                        duration: 0.3,
                        ease: "easeInOut"
                    }
                }}
                className={cn(
                    "fixed top-0 left-0 h-screen w-64 z-50",
                    "bg-white/90 dark:bg-purple-900/50",
                    "backdrop-blur-md border-r border-purple-700/30",
                    "shadow-lg shadow-purple-900/20"
                )}
            >
                <div className="p-4 h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-2">
                            <RocketIcon className="h-6 w-6 text-purple-500 dark:text-purple-300 animate-pulse" />
                            <Link href="/">
                                <span className="font-bold text-xl text-purple-800 dark:text-purple-100">
                                    EventPro
                                </span>
                            </Link>
                        </div>
                        <button
                            onClick={onToggle}
                            className="hover:bg-purple-100 dark:hover:bg-purple-800 p-2 rounded-lg"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* User Profile (when logged in) */}
                    {isLoggedIn && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-3 bg-purple-100 dark:bg-purple-800/40 rounded-lg"
                        >
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 border-2 border-purple-500">
                                    {userProfile.image ? (
                                        <AvatarImage src={userProfile.image} alt={userProfile.name} />
                                    ) : (
                                        <AvatarFallback className="bg-purple-200 text-purple-700">
                                            {userProfile.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-purple-800 dark:text-purple-100 font-medium">
                                        {userProfile.name}
                                    </p>
                                    <Link href="/profile">
                                        <p className="text-xs text-purple-600 dark:text-purple-300 hover:underline">
                                            View Profile
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation Links */}
                    <div className="flex-grow space-y-2">
                        <AnimatePresence>
                            {sidebarLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ 
                                        opacity: 1, 
                                        x: 0,
                                        transition: { delay: index * 0.05 }
                                    }}
                                >
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "group flex items-center space-x-3 p-2 rounded-lg",
                                            "text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-white",
                                            "transition-all duration-300 transform",
                                            "hover:bg-purple-700/30 hover:scale-[1.02]",
                                            "relative overflow-hidden"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-purple-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="text-purple-600 dark:text-purple-300">
                                            {link.icon}
                                        </div>
                                        <span className="relative z-10">{link.label}</span>
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Logout Button (when logged in) */}
                    {isLoggedIn && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4"
                        >
                            <Button
                                variant="ghost"
                                onClick={onLogout}
                                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                                <ExitIcon className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Collapsed Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onToggle}
                    className="fixed top-4 left-0 z-50 p-2 bg-white dark:bg-purple-800 rounded-r-lg shadow-md hover:scale-105 transition-transform"
                >
                    <ChevronRightIcon className="h-5 w-5 text-purple-600 dark:text-purple-200" />
                </motion.button>
            )}
        </>
    )
}