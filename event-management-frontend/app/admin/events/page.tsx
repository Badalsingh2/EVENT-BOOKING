'use client'

import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

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

  const fetchEvents = async () => {
    const token = getAuthToken()
    if (!token) {
      handleUnauthorized()
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/events', {
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
  }

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
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={fetchEvents}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Event Management
      </h1>

      {/* Pending Events Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Pending Approval ({pendingEvents.length})
        </h2>
        <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {['Title', 'Description', 'Date', 'Location', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {event.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateEventStatus(event.id, 'approved')}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateEventStatus(event.id, 'rejected')}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 transition-colors"
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
            <div className="text-center py-4 bg-white dark:bg-gray-900">
              <p className="text-gray-500 dark:text-gray-400">No pending events</p>
            </div>
          )}
        </div>
      </div>

      {/* Processed Events Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Processed Events ({processedEvents.length})
        </h2>
        <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {['Title', 'Organizer', 'Date', 'Location', 'Status', 'Updated'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {processedEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {event.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {event.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${event.status === 'approved' ? 
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {new Date(event.updated_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {processedEvents.length === 0 && (
            <div className="text-center py-4 bg-white dark:bg-gray-900">
              <p className="text-gray-500 dark:text-gray-400">No processed events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}