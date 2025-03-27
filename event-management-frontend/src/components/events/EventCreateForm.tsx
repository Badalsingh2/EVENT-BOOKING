// src/components/events/EventCreateForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { eventService } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useRouter } from 'next/navigation';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Zod validation schema for event creation
const eventCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date({
    required_error: "Event date is required",
  }),
  location: z.string().min(3, "Location must be at least 3 characters"),
  price: z.number().min(0, "Price cannot be negative").optional(),
  total_seats: z.number().int().min(1, "Must have at least 1 seat"),
  organizer_email: z.string().email("Invalid email address")
});

type EventCreateFormData = z.infer<typeof eventCreateSchema>;

export function EventCreateForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<EventCreateFormData>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      price: 0,
      total_seats: 1,
      organizer_email: ''
    }
  });

  const onSubmit = async (data: EventCreateFormData) => {
    try {
      setError(null);
      // Convert date to ISO string for API
      const eventData = {
        ...data,
        date: data.date.toISOString(),
        available_seats: data.total_seats
      };

      await eventService.createEvent(eventData);
      router.push('/events');  // Redirect to events list after successful creation
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Event creation failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Event</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}
          
          {/* Event Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Event Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter event title" 
                    {...field} 
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your event" 
                    {...field} 
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Date Picker */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-700">Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Location</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Event location" 
                    {...field} 
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Ticket Price (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Total Seats */}
          <FormField
            control={form.control}
            name="total_seats"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Total Seats</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Number of seats" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Organizer Email */}
          <FormField
            control={form.control}
            name="organizer_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Organizer Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="Your email" 
                    {...field} 
                    className="border-gray-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Event
          </Button>
        </form>
      </Form>
    </div>
  );
}