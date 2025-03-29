"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface UserInfo {
  full_name: string;
  email: string;
  role: string;
  status?: string;
  booked_events?: Booking[];
}

interface Booking {
  event_id: string;
  user_email: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  organizer_email: string;
  total_seats: number;
  available_seats: number;
  status: string;
  image_url?: string;
}

interface BookingWithEvent extends Event {
  user_email: string;
}

export default function UserProfilePage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [bookings, setBookings] = useState<BookingWithEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode<{ sub?: string }>(token);
        const userId = decoded?.sub;
        if (!userId) {
          console.error("User ID not found in token");
          return;
        }

        const response = await fetch(`https://event-booking-k8id.onrender.com/events/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: UserInfo = await response.json();
          setUserInfo(data);
          if (data.booked_events) {
            await fetchBookings(data.booked_events);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async (bookedEvents: Booking[]) => {
      if (!bookedEvents || bookedEvents.length === 0) return;

      const eventDetails = await Promise.all(
        bookedEvents.map(async (booking) => {
          try {
            const response = await fetch(`https://event-booking-k8id.onrender.com/events/get_e/${booking.event_id}`);
            if (response.ok) {
              const eventData: Event = await response.json();
              return { ...eventData, user_email: booking.user_email };
            }
          } catch (error) {
            console.error(`Failed to fetch event ${booking.event_id}`, error);
          }
          return null;
        })
      );

      setBookings(eventDetails.filter(Boolean) as BookingWithEvent[]);
    };

    fetchUserInfo();
  }, [user]); // Added user to dependency array since we're using useAuth

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className="w-full h-48 rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <h1 className="text-4xl font-bold">Profile Not Found</h1>
        <p>Unable to load user profile information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <section className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage your account and event bookings
        </p>
      </section>

      {/* User Information Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Account Details</h2>
          <InfoItem label="Full Name" value={userInfo.full_name} />
          <InfoItem label="Email" value={userInfo.email} />
          <InfoItem label="Account Type" value={userInfo.role} />
          <InfoItem label="Account Status" value={userInfo.status || "Active"} />
          <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700">
            Update Profile
          </Button>
        </div>

        <div className="dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {userInfo.full_name[0]}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {userInfo.full_name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{userInfo.role}</p>
        </div>
      </section>

      {/* Bookings Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            My Bookings
          </h2>
          <Button variant="outline" className="border-purple-600 text-purple-600">
            View All
          </Button>
        </div>

        {bookings.length > 0 ? (
          <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <Table className="dark:bg-gray-800">
              <TableHeader className="bg-gray-50 dark:bg-gray-700">
                <TableRow>
                  <TableHead className="text-gray-600 dark:text-gray-300">Event</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300">Location</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((event) => (
                  <TableRow key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                      {event.title}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {event.location}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={event.status === "confirmed" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No upcoming events booked</p>
          </div>
        )}
      </section>

      {/* Event Details Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Booked Event Details
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((event) => (
            <div key={event.id} className="dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-6">
              {event.image_url && (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Date" value={new Date(event.date).toLocaleString()} />
                  <InfoItem label="Location" value={event.location} />
                  <InfoItem label="Price" value={`$${event.price}`} />
                  <InfoItem 
                    label="Seats Available" 
                    value={`${event.available_seats}/${event.total_seats}`} 
                  />
                  <InfoItem label="Organizer" value={event.organizer_email} />
                  <InfoItem label="Your Email" value={event.user_email} />
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700">
                    View Tickets
                  </Button>
                  <Button variant="outline" className="flex-1 border-purple-600 text-purple-600">
                    Cancel Booking
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string | number;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <p className="text-gray-800 dark:text-gray-200 font-medium">{value}</p>
    </div>
  );
}