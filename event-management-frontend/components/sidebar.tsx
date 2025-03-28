'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    HomeIcon,
    PersonIcon,
    RocketIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Button } from './ui/button'

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const sidebarLinks = [
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
        {
            href: '/profile',
            icon: <PersonIcon className="h-5 w-5" />,
            label: 'Profile'
        },
    ]

    return (
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
                            </span></Link>
                    </div>
                    <button
                        onClick={onToggle}
                        className="hover:bg-purple-100 dark:hover:bg-purple-800 p-2 rounded-lg"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-grow space-y-2">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
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
                    ))}
                </div>

                {/* Collapsed Toggle Button */}
                {!isOpen && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onToggle}
                        className="absolute top-4 right-[-44px] p-2 bg-white dark:bg-purple-800 rounded-lg shadow-md hover:scale-105 transition-transform"
                    >
                        <ChevronRightIcon className="h-5 w-5 text-purple-600 dark:text-purple-200" />
                    </motion.button>
                )}
            </div>
        </motion.div>
    )
}