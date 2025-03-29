'use client'

import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

interface Organizer {
  id: string
  full_name: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  reason: string
}

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [pendingOrganizers, setPendingOrganizers] = useState<Organizer[]>([])
  const [processedOrganizers, setProcessedOrganizers] = useState<Organizer[]>([])
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

  const fetchOrganizers = async () => {
    const token = getAuthToken()
    if (!token) {
      handleUnauthorized()
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/admin/organizers', {
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
      setOrganizers(data)
      
      // Separate organizers into pending and processed
      const pending = data.filter((organizer: Organizer) => organizer.status === 'pending')
      const processed = data.filter((organizer: Organizer) => organizer.status !== 'pending')
      
      setPendingOrganizers(pending)
      setProcessedOrganizers(processed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizers')
      toast.error('Failed to load organizers')
    } finally {
      setLoading(false)
    }
  }

  const updateOrganizerStatus = async (userId: string, status: 'approved' | 'rejected') => {
    const token = getAuthToken()
    if (!token) {
      handleUnauthorized()
      return
    }

    const toastId = toast.loading(`Updating organizer to ${status}...`)
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/organizers/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          reason: status === 'approved' 
            ? 'Approved by administrator' 
            : 'Rejected by administrator'
        })
      })

      if (!response.ok) {
        if (response.status === 401) handleUnauthorized()
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update state
      setPendingOrganizers(prev => prev.filter(org => org.id !== userId))
      setProcessedOrganizers(prev => [
        ...prev,
        ...organizers.filter(org => org.id === userId)
          .map(org => ({ 
            ...org, 
            status,
            reason: status === 'approved' 
              ? 'Approved by administrator' 
              : 'Rejected by administrator' 
          }))
      ])
      
      toast.success(`Organizer ${status} successfully`, { id: toastId })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
      toast.error(`Failed to ${status} organizer`, { id: toastId })
      fetchOrganizers()
    }
  }

  const deleteOrganizer = async (userId: string) => {
    const token = getAuthToken()
    if (!token) {
      handleUnauthorized()
      return
    }

    const toastId = toast.loading('Deleting organizer...')
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/organizers/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) handleUnauthorized()
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setProcessedOrganizers(prev => prev.filter(org => org.id !== userId))
      toast.success('Organizer deleted successfully', { id: toastId })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete organizer')
      toast.error('Failed to delete organizer', { id: toastId })
      fetchOrganizers()
    }
  }

  useEffect(() => {
    fetchOrganizers()
  }, [])

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
            onClick={fetchOrganizers}
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
          Organizer Management
        </motion.h1>

        {/* Pending Organizers Section */}
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
              {pendingOrganizers.length} organizers
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-700 overflow-hidden backdrop-blur-lg shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/80">
                  <tr>
                    {['Name', 'Email', 'Status', 'Reason', 'Actions'].map((header) => (
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
                  {pendingOrganizers.map((organizer) => (
                    <tr key={organizer.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {organizer.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {organizer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-yellow-600/20 text-yellow-300 border border-yellow-600/30 inline-flex text-xs leading-5 font-semibold rounded-full">
                          {organizer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {organizer.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => updateOrganizerStatus(organizer.id, 'approved')}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl shadow-lg hover:shadow-emerald-700/20 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateOrganizerStatus(organizer.id, 'rejected')}
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
              {pendingOrganizers.length === 0 && (
                <div className="text-center py-12 bg-gray-800/50">
                  <div className="text-4xl mb-4">👥</div>
                  <p className="text-gray-400 text-lg">No pending organizer requests</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Processed Organizers Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-300">
              Processed Organizers
            </h2>
            <div className="ml-3 px-3 py-1 bg-indigo-900/60 text-indigo-200 rounded-full text-sm">
              {processedOrganizers.length} organizers
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-700 overflow-hidden backdrop-blur-lg shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/80">
                  <tr>
                    {['Name', 'Email', 'Status', 'Reason', 'Actions'].map((header) => (
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
                  {processedOrganizers.map((organizer) => (
                    <tr key={organizer.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                        {organizer.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {organizer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${organizer.status === 'approved' ? 
                            'bg-gradient-to-r from-emerald-600/20 to-teal-500/20 text-emerald-300 border border-emerald-600/30' : 
                            'bg-gradient-to-r from-rose-600/20 to-pink-500/20 text-rose-300 border border-rose-600/30'}`}>
                          {organizer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {organizer.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteOrganizer(organizer.id)}
                          className="px-4 py-2 bg-gradient-to-r from-gray-600 to-slate-500 hover:from-gray-700 hover:to-slate-600 text-white rounded-xl shadow-lg hover:shadow-gray-700/20 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {processedOrganizers.length === 0 && (
                <div className="text-center py-12 bg-gray-800/50">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-gray-400 text-lg">No processed organizers yet</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}