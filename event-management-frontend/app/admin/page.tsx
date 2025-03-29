'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation' // Changed from next/router to next/navigation

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  const handleUnauthorized = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      handleUnauthorized()
      return
    }
    // Get admin info from localStorage
    try {
      const userDataString = localStorage.getItem('user')
      if (userDataString) {
        const userData = JSON.parse(userDataString)
        setAdminName(userData.email || 'Administrator')
      } else {
        setAdminName('Administrator')
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      setAdminName('Administrator')
    }
    setLoading(false)
  }, [])

  const navigateTo = (path: string) => {
    router.push(path)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-10" />
      
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent"
        >
          Admin Dashboard
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-xl text-indigo-200"
        >
          Welcome, <span className="text-indigo-300 font-semibold">{adminName}</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {/* Admin Card for Organizers */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-gray-700 overflow-hidden backdrop-blur-lg shadow-lg bg-gray-800/50 p-8 cursor-pointer"
            onClick={() => navigateTo('/admin/organizers')}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-indigo-300">Organizer Management</h2>
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/60 text-indigo-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-300 mb-8">Manage organizer applications, approve or reject requests, and manage existing organizers.</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-indigo-700/20 transition-all">
                Manage Organizers
              </button>
            </div>
          </motion.div>

          {/* Admin Card for Events */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-gray-700 overflow-hidden backdrop-blur-lg shadow-lg bg-gray-800/50 p-8 cursor-pointer"
            onClick={() => navigateTo('/admin/events')}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-indigo-300">Event Management</h2>
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-900/60 text-indigo-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-300 mb-8">Review, approve, edit, and manage all events in the system. Monitor event status and attendance.</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-indigo-700/20 transition-all">
                Manage Events
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-gray-700 overflow-hidden backdrop-blur-lg shadow-lg bg-gray-800/50 p-8 mb-12"
        >
          <h2 className="text-2xl font-semibold text-indigo-300 mb-6">System Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
              <div className="text-gray-400 text-sm mb-1">Activity Status</div>
              <div className="text-2xl font-bold text-indigo-200">Active</div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
              <div className="text-gray-400 text-sm mb-1">Last Login</div>
              <div className="text-2xl font-bold text-indigo-200">
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
              <div className="text-gray-400 text-sm mb-1">Admin Role</div>
              <div className="text-2xl font-bold text-indigo-200">Super Admin</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}