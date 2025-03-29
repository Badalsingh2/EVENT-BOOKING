'use client'

import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface Organizer {
  id: string
  full_name: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  reason: string
}

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([])
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

    const toastId = toast.loading('Updating status...')
    
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

      setOrganizers(prev => prev.map(org => 
        org.id === userId ? { 
          ...org, 
          status,
          reason: status === 'approved' 
            ? 'Approved by administrator' 
            : 'Rejected by administrator'
        } : org
      ))
      
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

      setOrganizers(prev => prev.filter(org => org.id !== userId))
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
          onClick={fetchOrganizers}
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
        Organizer Requests
      </h1>
      
      <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['Name', 'Email', 'Status', 'Reason', 'Actions'].map((header) => (
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
            {organizers.map((organizer) => (
              <tr key={organizer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {organizer.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {organizer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${organizer.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                      organizer.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                    {organizer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {organizer.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {organizer.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateOrganizerStatus(organizer.id, 'approved')}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateOrganizerStatus(organizer.id, 'rejected')}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => deleteOrganizer(organizer.id)}
                      className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {organizers.length === 0 && (
          <div className="text-center py-4 bg-white dark:bg-gray-900">
            <p className="text-gray-500 dark:text-gray-400">No pending organizer requests</p>
          </div>
        )}
      </div>
    </div>
  )
}