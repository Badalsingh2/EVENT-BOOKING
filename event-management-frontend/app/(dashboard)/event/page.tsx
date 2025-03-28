// app/dashboard/events/page.tsx
"use client"

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, MapPinIcon, TicketIcon } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

const eventFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.string().datetime(),
  location: z.string().min(5),
  price: z.number().min(0),
  totalSeats: z.number().min(1)
})

export default function EventsPage() {
  const { user } = useAuth()
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema)
  })

  const handleCreateEvent = async (values: z.infer<typeof eventFormSchema>) => {
    try {
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...values,
          organizer_email: user?.email
        })
      })
      
      if (!response.ok) throw new Error('Failed to create event')
      // Handle success
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Manage Events</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
              Create New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-purple-600 dark:text-purple-400">
                Create New Event
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateEvent)} className="space-y-4">
                <FormField
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Event Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="dark:bg-gray-800 dark:border-gray-700" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Add other form fields similarly */}
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700">
                  Create Event
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[].map(event => (
          <Card key={event.id} className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-purple-600 dark:text-purple-400">{event.title}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 dark:text-gray-300">
                <MapPinIcon className="h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2 dark:text-gray-300">
                <TicketIcon className="h-4 w-4" />
                {event.available_seats} seats available
              </div>
              <Badge variant={event.status === 'approved' ? 'default' : 'secondary'}>
                {event.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}