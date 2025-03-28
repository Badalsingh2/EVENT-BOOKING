"use client"

import Layout from "@/components/layout";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    price: number;
    image: string;
    description: string;
    category: string;
}

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/events/');
                const data = await res.json();
                setEvents(data);
            } catch (error) {
                toast.error('Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleBookNow = async (eventId: string) => {
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventId }),
            });

            if (response.ok) {
                toast.success('Event booked successfully!');
            } else {
                toast.error('Booking failed');
            }
        } catch (error) {
            toast.error('Error processing booking');
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-purple-50/20 via-blue-50/10 to-transparent dark:from-purple-900/10 dark:via-blue-900/5">
                {/* Hero Section */}
                <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-400/20 to-pink-500/20 dark:from-purple-600/10 dark:via-blue-600/10 dark:to-pink-600/10" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-10 dark:opacity-5" />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center z-10 px-4 max-w-4xl w-full"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-600 bg-clip-text text-transparent leading-tight"
                        >
                            Experience Unforgettable <br /> Moments
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative max-w-2xl mx-auto"
                        >
                            <input
                                type="text"
                                placeholder="Search events, locations, or categories..."
                                className="w-full px-8 py-4 rounded-full border-2 border-purple-400/50 bg-white/80 dark:bg-purple-900/30 backdrop-blur-xl shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300/30 dark:focus:ring-purple-600/30 text-lg placeholder:text-purple-700/80 dark:placeholder:text-purple-300/60 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-4 top-3 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105">
                                <SearchIcon className="h-6 w-6" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Events Grid */}
                <div className="container mx-auto px-4 py-12 lg:py-16">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <Skeleton className="h-64 rounded-3xl" />
                                    <Skeleton className="h-6 w-3/4 rounded-full" />
                                    <Skeleton className="h-4 w-1/2 rounded-full" />
                                    <div className="flex justify-between mt-4">
                                        <Skeleton className="h-10 w-24 rounded-full" />
                                        <Skeleton className="h-10 w-32 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredEvents.map((event) => (
                                <motion.div
                                    key={event.id} // Unique key here
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="group relative bg-white dark:bg-purple-900/50 rounded-2xl shadow-lg overflow-hidden backdrop-blur-lg"
                                >
                                    {/* Event image section */}
                                    <div className="relative h-60">
                                        <Image
                                            src={event.image || '/placeholder-event.jpg'}
                                            alt={event.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <Badge
                                            key={`${event.id}-badge`} // Unique key for badge if multiple
                                            className="absolute top-4 right-4"
                                        >
                                            {event.category}
                                        </Badge>
                                    </div>

                                    <div className="p-6 lg:p-8">
                                        <h3 className="text-2xl font-bold mb-4 text-purple-900 dark:text-purple-100">
                                            {event.title}
                                        </h3>

                                        <div className="flex flex-col gap-3 mb-6">
                                            <div className="flex items-center gap-3 text-purple-600 dark:text-purple-300">
                                                <CalendarIcon className="h-5 w-5 flex-shrink-0" />
                                                <span className="text-sm font-medium">
                                                    {new Date(event.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-purple-600 dark:text-purple-300">
                                                <MapPinIcon className="h-5 w-5 flex-shrink-0" />
                                                <span className="text-sm font-medium">{event.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                                            {event.description}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                    ${event.price}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">/person</span>
                                            </div>
                                            <Button
                                                onClick={() => handleBookNow(event.id)}
                                                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 px-6 py-3 rounded-xl shadow-lg hover:shadow-purple-400/20 transition-all"
                                            >
                                                Book Now
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {!loading && filteredEvents.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="inline-block bg-purple-100/50 dark:bg-purple-900/30 p-8 rounded-3xl backdrop-blur-lg">
                                <div className="text-4xl mb-4">🎭</div>
                                <h2 className="text-3xl font-bold mb-4">No events found</h2>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                    Try adjusting your search terms or explore our popular categories
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}