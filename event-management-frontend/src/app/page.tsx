// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
            Event Management System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover, create, and manage events with ease. 
            Whether you're an organizer or an attendee, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>For Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Browse upcoming events, book tickets, and manage your registrations.
              </p>
              <Link href="/events" className="block">
                <Button variant="outline" className="w-full">
                  View Events
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Organizers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Create and manage your own events, track bookings, and engage with attendees.
              </p>
              <Link href="/events/create" className="block">
                <Button variant="outline" className="w-full">
                  Create Event
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                New to our platform? Register now to start your event journey.
              </p>
              <div className="flex space-x-2">
                <Link href="/auth/login" className="w-full">
                  <Button variant="secondary" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" className="w-full">
                  <Button className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Why Choose Our Event Management System?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">
                Simple, intuitive interface for booking events in just a few clicks.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Flexible Management</h3>
              <p className="text-muted-foreground">
                Powerful tools for organizers to create and manage events seamlessly.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Robust authentication and data protection to keep your information safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}