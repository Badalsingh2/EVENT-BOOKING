'use client';

import React, { useState, useEffect } from 'react';
import { eventService } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, TicketIcon, Users } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950 flex justify-center items-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-10" />
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950 flex justify-center items-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-10" />
        <div className="bg-gradient-to-r from-rose-600/20 to-pink-500/20 border border-rose-600/30 text-rose-300 px-6 py-4 rounded-xl max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950 py-12 px-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-10" />
      
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            Upcoming Events
          </h2>
        </motion.div>
        
        {events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 backdrop-blur-lg bg-gray-800/30 p-8 rounded-2xl shadow-xl border border-gray-700"
          >
            No events available at the moment.
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-lg hover:shadow-xl hover:shadow-indigo-700/10 transition-all overflow-hidden rounded-2xl">
                  <CardHeader className="border-b border-gray-700/50 pb-4">
                    <div className="space-y-1">
                      <Badge variant={event.status === 'pending' ? 'secondary' : 'default'} className="mb-2">
                        {event.status}
                      </Badge>
                      <CardTitle className="text-xl text-gray-200">{event.title}</CardTitle>
                      <CardDescription className="flex items-center text-gray-400">
                        <MapPinIcon className="w-4 h-4 mr-1" /> {event.location}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <p className="text-gray-300 line-clamp-3 text-sm">{event.description}</p>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center text-gray-400 text-sm">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>{format(new Date(event.date), 'PPP')}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-400 text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{event.available_seats} seats left</span>
                        </div>
                      </div>

                      <div className="flex items-center pt-2">
                        <TicketIcon className="w-5 h-5 mr-2 text-indigo-400" />
                        <span className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
                          {event.price ? `$${event.price}` : 'Free'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t border-gray-700/50 pt-4">
                    <Button 
                      onClick={() => handleBookEvent(event.id)}
                      disabled={event.available_seats === 0}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl py-3 shadow-lg hover:shadow-indigo-700/20 transition-all font-medium"
                    >
                      {event.available_seats === 0 ? 'Sold Out' : 'Book Event'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}