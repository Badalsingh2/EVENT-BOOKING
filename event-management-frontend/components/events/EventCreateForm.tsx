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
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950 py-12 px-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto backdrop-blur-lg bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-700"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            Create New Event
          </h2>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-rose-600/20 to-pink-500/20 border border-rose-600/30 text-rose-300 px-4 py-3 rounded-xl" 
                role="alert"
              >
                {error}
              </motion.div>
            )}
            
            {/* Event Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-300">Event Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter event title" 
                      {...field} 
                      className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-300">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event" 
                      {...field} 
                      className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl min-h-24"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-indigo-300">Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal h-12 rounded-xl",
                            "bg-gray-900/60 border-gray-700 text-gray-200",
                            !field.value && "text-gray-500"
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
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="bg-gray-800 text-gray-200"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-300">Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Event location" 
                      {...field} 
                      className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-indigo-300">Ticket Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-rose-300" />
                  </FormItem>
                )}
              />

              {/* Total Seats */}
              <FormField
                control={form.control}
                name="total_seats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-indigo-300">Total Seats</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Number of seats" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-rose-300" />
                  </FormItem>
                )}
              />
            </div>

            {/* Organizer Email */}
            <FormField
              control={form.control}
              name="organizer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-300">Organizer Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Your email" 
                      {...field} 
                      className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-4"
            >
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl py-3 h-12 shadow-lg hover:shadow-indigo-700/20 transition-all font-medium"
              >
                Create Event
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}