"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, MapPinIcon, TicketIcon, DollarSign, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { format } from 'date-fns'
import { AppLayout } from '@/components/layout'

// Define the Event type
type Event = {
  id: string
  title: string
  description: string
  date: string
  location: string
  price: number
  organizer_email: string
  total_seats: number
  available_seats: number
  status: string
}

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date and time"
  }),
  location: z.string().min(5, "Location must be at least 5 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  total_seats: z.coerce.number().min(1, "Total seats must be at least 1")
})

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [open, setOpen] = useState(false)
  
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      location: "",
      price: 0,
      total_seats: 100
    }
  })

  // Fetch organizer's events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://127.0.0.1:8000/events/');
        
        
        if (!response.ok) throw new Error('Failed to fetch events')
        
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (user?.role === 'organizer') {
      fetchEvents()
    }
  }, [user])

  const handleCreateEvent = async (values: z.infer<typeof eventFormSchema>) => {
    setIsCreating(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://127.0.0.1:8000/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...values,
          organizer_email: user?.email,
          // Convert field names to match API requirements
          total_seats: values.total_seats,
          available_seats: values.total_seats
        })
      })
      
      if (!response.ok) throw new Error('Failed to create event')
      
      const newEvent = await response.json()
      setEvents(prev => [newEvent, ...prev])
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Error creating event:', error)
    } finally {
      setIsCreating(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
   <AppLayout>
     <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">Manage Events</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
              Create New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-purple-600 dark:text-purple-400">
                Create New Event
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateEvent)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Event Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="dark:bg-gray-800 dark:border-gray-700" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="dark:bg-gray-800 dark:border-gray-700" 
                          rows={3} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">Date & Time</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="datetime-local"
                            className="dark:bg-gray-800 dark:border-gray-700" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">Location</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="dark:bg-gray-800 dark:border-gray-700" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="0"
                            step="0.01"
                            className="dark:bg-gray-800 dark:border-gray-700" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="total_seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-gray-300">Total Seats</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="1"
                            className="dark:bg-gray-800 dark:border-gray-700" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No events found</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create your first event to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden dark:bg-gray-800 border dark:border-gray-700 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-purple-600 dark:text-purple-400 line-clamp-1">
                  {event.title}
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(event.date)}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <TicketIcon className="h-4 w-4" />
                  <span className="text-sm">{event.available_seats} of {event.total_seats} seats available</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">${event.price.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2">
                <Badge variant={
                  event.status === 'approved' ? 'success' : 
                  event.status === 'pending' ? 'warning' : 
                  'secondary'
                }>
                  {event.status === 'approved' ? 'Approved' : 
                   event.status === 'pending' ? 'Pending Approval' : 
                   event.status}
                </Badge>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
   </AppLayout>
  )
}