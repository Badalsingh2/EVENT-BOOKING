'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: 'pending' | 'approved' | 'rejected'
  updated_at: string
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [pendingEvents, setPendingEvents] = useState<Event[]>([])
  const [processedEvents, setProcessedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const fetchEvents = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      handleUnauthorized()
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/admin/all_events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) handleUnauthorized()
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setEvents(data)
      
      // Separate events into pending and processed
      const pending = data.filter((event: Event) => event.status === 'pending')
      const processed = data.filter((event: Event) => event.status !== 'pending')
      
      setPendingEvents(pending)
      setProcessedEvents(processed)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEventStatus = async (eventId: string, status: 'approved' | 'rejected') => {
    const token = getAuthToken()
    if (!token) {
      handleUnauthorized()
      return
    }

    const toastId = toast.loading(`Updating event to ${status}...`)
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/events/${eventId}/${status}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) handleUnauthorized()
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update state
      setPendingEvents(prev => prev.filter(event => event.id !== eventId))
      setProcessedEvents(prev => [
        ...prev,
        ...events.filter(event => event.id === eventId)
          .map(event => ({ ...event, status, updated_at: new Date().toISOString() }))
      ])
      
      toast.success(`Event ${status} successfully`, { id: toastId })
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${status} event`)
      toast.error(`Failed to ${status} event`, { id: toastId })
      fetchEvents()
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents]) // Added fetchEvents to dependency array

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950 flex flex-col justify-center items-center p-8 text-red-400">
        <div className="bg-gray-800/80 p-8 rounded-3xl backdrop-blur-lg shadow-lg border border-gray-700">
          <h2 className="text-3xl font-bold mb-4 text-red-300">Error Occurred</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl hover:shadow-indigo-700/20 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-10" />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '0.75rem',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent"
        >
          Event Management
        </motion.h1>

        {/* Pending Events Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-300">
              Pending Approval
            </h2>
            <div className="ml-3 px-3 py-1 bg-indigo-900/60 text-indigo-200 rounded-full text-sm">
              {pendingEvents.length} events
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-700 overflow-hidden backdrop-blur-lg shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/80">
                  <tr>
                    {['Title', 'Description', 'Date', 'Location', 'Actions'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                  {pendingEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {event.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => updateEventStatus(event.id, 'approved')}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-emerald-700/20 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateEventStatus(event.id, 'rejected')}
                            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-rose-700/20 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pendingEvents.length === 0 && (
                <div className="text-center py-12 bg-gray-800/50">
                  <div className="text-4xl mb-4">🎭</div>
                  <p className="text-gray-400 text-lg">No pending events to review</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Processed Events Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-300">
              Processed Events
            </h2>
            <div className="ml-3 px-3 py-1 bg-indigo-900/60 text-indigo-200 rounded-full text-sm">
              {processedEvents.length} events
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-700 overflow-hidden backdrop-blur-lg shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/80">
                  <tr>
                    {['Title', 'Description', 'Date', 'Location', 'Status', 'Updated'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                  {processedEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {event.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${event.status === 'approved' ? 
                            'bg-gradient-to-r from-emerald-600/20 to-teal-500/20 text-emerald-300 border border-emerald-600/30' : 
                            'bg-gradient-to-r from-rose-600/20 to-pink-500/20 text-rose-300 border border-rose-600/30'}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(event.updated_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {processedEvents.length === 0 && (
                <div className="text-center py-12 bg-gray-800/50">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-gray-400 text-lg">No processed events yet</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}