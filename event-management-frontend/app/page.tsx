"use client"


import Image from "next/image";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, Toaster } from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import AnimatedBackground from '@/components/animated-background'; // Import the new component
import { useRouter } from "next/navigation";
import AnimatedHeadline from "@/components/animated-template";

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    price: number;
    image_url: string;
    description: string;
    category: string;
}

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter()

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('https://event-booking-k8id.onrender.com/events/');
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                console.error("Error loading events:", err);  // Logs the error for debugging
                toast.error('Failed to load events');
            }finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleBookNow = async (eventId: string) => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user'); // Retrieve user data from localStorage
    
        if (!token) {
            toast.error('You should login first!');
            setTimeout(() => {
                router.push('/login'); // Redirect to login page after 3 seconds
            }, 3000);
            return;
        }
    
        if (!userData) {
            toast.error('User data not found. Please log in again.');
            setTimeout(() => {
                router.push('/login'); // Redirect to login page after 3 seconds
            }, 3000);
            return;
        }
    
        // Parse the stored user data and extract email
        let userEmail = "";
        try {
            const user = JSON.parse(userData); // Convert string to object
            userEmail = user.email; // Extract email
        } catch (error) {
            console.error("Error parsing user data:", error);
            toast.error('Invalid user data. Please log in again.');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
            return;
        }
    
        try {
            const response = await fetch('https://event-booking-k8id.onrender.com/bookings/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ user_email: userEmail, event_id: eventId }), // Send both user_email & event_id
            });
    
            if (response.ok) {
                toast.success('Event booked successfully!');
            } else {
                const errorData = await response.json();
                toast.error(`Booking failed: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            toast.error('Error processing booking');
            console.error('Booking error:', error);
        }
    };
    
    
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950 relative">
                {/* Add the animated background */}
                <AnimatedBackground />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1e293b',
                            color: '#fff',
                            borderRadius: '0.75rem',
                        },
                    }}
                />
                {/* Hero Section */}
                <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-blue-900/20 to-purple-900/30" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-10" />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center z-10 px-4 max-w-4xl w-full"
                    >
                        <AnimatedHeadline/>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative max-w-2xl mx-auto mt-6"
                        >
                            <input
                                type="text"
                                placeholder="Search events, locations, or categories..."
                                className="w-full px-8 py-4 rounded-full border-2 border-indigo-700 bg-gray-800/80 backdrop-blur-xl shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/30 text-lg placeholder:text-indigo-300/50 text-gray-200 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-4 top-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105">
                                <SearchIcon className="h-6 w-6" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Rest of your existing code remains the same */}
                {/* Events Grid */}
                <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
                    {/* Your existing events grid code... */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <Skeleton className="h-64 rounded-3xl bg-gray-700/50" />
                                    <Skeleton className="h-6 w-3/4 rounded-full bg-gray-700/50" />
                                    <Skeleton className="h-4 w-1/2 rounded-full bg-gray-700/50" />
                                    <div className="flex justify-between mt-4">
                                        <Skeleton className="h-10 w-24 rounded-full bg-gray-700/50" />
                                        <Skeleton className="h-10 w-32 rounded-full bg-gray-700/50" />
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
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="group relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden backdrop-blur-lg border border-gray-700"
                                >
                                    {/* Event image section */}
                                    <div className="relative h-60">
                                        <Image
                                            src={event.image_url || '/placeholder-event.jpg'}
                                            alt={event.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <Badge
                                            key={`${event.id}-badge`}
                                            className="absolute top-4 right-4 bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800"
                                        >
                                            {event.category}
                                        </Badge>
                                    </div>

                                    <div className="p-6 lg:p-8">
                                        <h3 className="text-2xl font-bold mb-4 text-gray-100 group-hover:text-indigo-300 transition-colors">
                                            {event.title}
                                        </h3>

                                        <div className="flex flex-col gap-3 mb-6">
                                            <div className="flex items-center gap-3 text-indigo-300">
                                                <CalendarIcon className="h-5 w-5 flex-shrink-0" />
                                                <span className="text-sm font-medium text-gray-300">
                                                    {new Date(event.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-indigo-300">
                                                <MapPinIcon className="h-5 w-5 flex-shrink-0" />
                                                <span className="text-sm font-medium text-gray-300">{event.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                                            {event.description}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
                                                    ${event.price}
                                                </span>
                                                <span className="text-sm text-gray-500">/person</span>
                                            </div>
                                            <Button
                                                onClick={() => handleBookNow(event.id)}
                                                className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-700/20 transition-all"
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
                            <div className="inline-block bg-gray-800/80 p-8 rounded-3xl backdrop-blur-lg shadow-lg border border-gray-700">
                                <div className="text-4xl mb-4">🎭</div>
                                <h2 className="text-3xl font-bold mb-4 text-indigo-300">No events found</h2>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    Try adjusting your search terms or explore our popular categories
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
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