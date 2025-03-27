// src/components/events/EventList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { eventService } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number | null;
  total_seats: number;
  available_seats: number;
  status: string;
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await eventService.listEvents();
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleBookEvent = async (eventId: string) => {
    try {
      // In a real app, you'd get the user's email dynamically
      await eventService.bookEvent({
        user_email: 'current_user@example.com', 
        event_id: eventId
      });
      // Optionally update the events list or show a success message
    } catch (err) {
      // Handle booking error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Upcoming Events
      </h1>
      
      {events.length === 0 ? (
        <div className="text-center text-gray-500">
          No events available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 line-clamp-3">{event.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant={event.status === 'pending' ? 'secondary' : 'default'}>
                      {event.status}
                    </Badge>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.date), 'PPP')}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {event.price ? `$${event.price}` : 'Free'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {event.available_seats} seats left
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleBookEvent(event.id)}
                  disabled={event.available_seats === 0}
                  className="w-full"
                >
                  {event.available_seats === 0 ? 'Sold Out' : 'Book Event'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}