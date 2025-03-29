"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, MapPinIcon, TicketIcon, DollarSign, Loader2, AlertCircle, Plus, Users } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
  image_url: string
}

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')

        const response = await fetch('http://127.0.0.1:8000/events/organize_events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

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

  const isOrganizerApproved = user?.status === 'approved'

  const filteredEvents = events.filter(event => {
    if (activeTab === "all") return true
    if (activeTab === "approved") return event.status === "approved"
    if (activeTab === "pending") return event.status === "pending"
    return true
  })

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Organizer Profile Card */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-white">
              <h2 className="text-2xl font-bold">
                Organizer Dashboard
              </h2>
              <div className="mt-1 text-purple-100 font-medium">
                {user?.email || "12badal@example.com"}
              </div>
            </div>
            <div className="backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-white">
              <span className="text-sm">Status:</span>
              <Badge variant={
                user?.status === 'approved' ? 'success' :
                user?.status === 'pending' ? 'warning' :
                'destructive'
              } className="py-1">
                {user?.status === 'approved' ? 'Approved' :
                 user?.status === 'pending' ? 'Pending Approval' :
                 user?.status || 'Rejected'}
              </Badge>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="backdrop-blur-sm rounded-lg p-4">
              <div className="text-purple-100 text-sm">Total Events</div>
              <div className="text-white text-2xl font-bold mt-1">{events.length}</div>
            </div>
            <div className="backdrop-blur-sm rounded-lg p-4">
              <div className="text-purple-100 text-sm">Approved Events</div>
              <div className="text-white text-2xl font-bold mt-1">
                {events.filter(e => e.status === 'approved').length}
              </div>
            </div>
            <div className="backdrop-blur-sm rounded-lg p-4">
              <div className="text-purple-100 text-sm">Total Capacity</div>
              <div className="text-white text-2xl font-bold mt-1">
                {events.reduce((sum, event) => sum + event.total_seats, 0)} seats
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isOrganizerApproved && (
        <Alert className="border-amber-200 dark:border-amber-800/30">
          <AlertCircle className="h-5 w-5 text-amber-800 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-medium">Account approval pending</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            Your organizer account requires admin approval before you can create events.
            Please check back later or contact support for more information.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">My Events</h1>

        {isOrganizerApproved && (
          <Button 
            onClick={() => router.push("/event/create")}
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="dark:bg-gray-800 p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
          >
            All Events
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
          >
            Approved
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
          >
            Pending
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-lg dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                <TicketIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No events found</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
                {isOrganizerApproved
                  ? activeTab === "all" 
                    ? "Create your first event to get started with ticket sales and management." 
                    : `No ${activeTab} events found. Check another category or create new events.`
                  : "You'll be able to create events once your account is approved by an administrator."}
              </p>
              {isOrganizerApproved && (
                <Button
                  onClick={() => router.push("/event/create")}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border dark:border-gray-700 transition-all hover:shadow-lg">
                  {/* Status indicator bar */}
                  <div className={`h-2 ${event.status === 'approved' ? 'bg-green-500' :
                                 event.status === 'pending' ? 'bg-amber-500' : 
                                 'bg-gray-500'}`} />

                  {/* Event Image Section - Updated to use Next.js Image component */}
                  {event.image_url && (
                    <div className="w-full h-48 relative overflow-hidden">
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-purple-600 dark:text-purple-400 line-clamp-1 text-lg font-bold">
                        {event.title}
                      </CardTitle>
                      <Badge variant={
                        event.status === 'approved' ? 'success' : 
                        event.status === 'pending' ? 'warning' : 
                        'secondary'
                      } className="ml-2">
                        {event.status === 'approved' ? 'Approved' :
                         event.status === 'pending' ? 'Pending' : 
                         event.status}
                      </Badge>
                    </div>
                    <CardDescription className="dark:text-gray-400">
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="h-4 w-4 text-purple-500" />
                        {formatDate(event.date)}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <MapPinIcon className="h-4 w-4 text-purple-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <DollarSign className="h-4 w-4 text-purple-500" />
                        <span>${event.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-2 rounded-md dark:bg-purple-900/20">
                      <Users className="h-4 w-4 text-purple-500" />
                      <div className="text-sm flex-1">
                        <div className="flex justify-between">
                          <span>Available seats:</span>
                          <span className="font-medium">{event.available_seats}/{event.total_seats}</span>
                        </div>
                        <div className="w-full dark:bg-gray-700 h-1.5 rounded-full mt-1">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full" 
                            style={{
                              width: `${(event.available_seats / event.total_seats) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end items-center border-t dark:border-gray-700 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/30"
                    >
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}