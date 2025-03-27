// src/components/events/BookingModal.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { eventService } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { handleApiError } from '@/lib/error-handler';

interface BookingModalProps {
  event: {
    id: string;
    title: string;
    price: number;
    available_seats: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: () => void;
}

export function BookingModal({ 
  event, 
  isOpen, 
  onClose, 
  onBookingComplete 
}: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleBooking = async () => {
    if (!user) {
      setError('Please log in to book an event');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await eventService.bookEvent({
        user_email: user.email,
        event_id: event.id
      });

      // Success callback
      onBookingComplete();
      onClose();
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Event: {event.title}</DialogTitle>
          <DialogDescription>
            Confirm your booking for this event
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Event Details */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Price</Label>
            <span className="col-span-3">
              {event.price > 0 ? `$${event.price}` : 'Free'}
            </span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Available Seats</Label>
            <span className="col-span-3">
              {event.available_seats}
            </span>
          </div>

          {/* User Email */}
          {user && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <Input 
                value={user.email} 
                disabled 
                className="col-span-3" 
              />
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleBooking}
            disabled={loading || event.available_seats === 0}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}