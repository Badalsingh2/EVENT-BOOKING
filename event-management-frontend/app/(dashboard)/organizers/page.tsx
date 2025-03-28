// app/dashboard/organizers/page.tsx
"use client"

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useState, useEffect } from 'react'

export default function OrganizersPage() {
  const { user } = useAuth()
  const [organizers, setOrganizers] = useState([])

  useEffect(() => {
    const fetchOrganizers = async () => {
      const response = await fetch('/api/admin/organizers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setOrganizers(data)
    }
    
    if (user?.role === 'admin') fetchOrganizers()
  }, [user])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Manage Organizers</h1>
      
      <Table className="dark:bg-gray-800 rounded-lg">
        <TableHeader>
          <TableRow className="dark:hover:bg-gray-700">
            <TableHead className="dark:text-gray-300">Name</TableHead>
            <TableHead className="dark:text-gray-300">Email</TableHead>
            <TableHead className="dark:text-gray-300">Status</TableHead>
            <TableHead className="dark:text-gray-300">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizers.map((organizer: { id: any; full_name: any; email: any; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; role: any }) => (
            <TableRow key={organizer.id} className="dark:hover:bg-gray-700">
              <TableCell className="dark:text-gray-300">{organizer.full_name}</TableCell>
              <TableCell className="dark:text-gray-300">{organizer.email}</TableCell>
              <TableCell>
                <Badge variant={
                  organizer.status === 'approved' ? 'default' : 
                  organizer.status === 'pending' ? 'secondary' : 'destructive'
                }>
                  {organizer.status}
                </Badge>
              </TableCell>
              <TableCell className="dark:text-gray-300">{organizer.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {organizers.length === 0 && (
        <div className="text-center py-12 dark:text-gray-400">
          <p>No organizers found</p>
          <Button className="mt-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700">
            Invite New Organizer
          </Button>
        </div>
      )}
    </div>
  )
}