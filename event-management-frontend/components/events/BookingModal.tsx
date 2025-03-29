'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { eventService } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { handleApiError } from '@/lib/error-handler';
import { motion, AnimatePresence } from 'framer-motion';

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
      <DialogContent className="sm:max-w-md backdrop-blur-lg bg-gray-800/90 border border-gray-700 shadow-xl rounded-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
              Book Event: {event.title}
            </DialogTitle>
            <DialogDescription className="text-gray-400 mt-2">
              Confirm your booking for this event
            </DialogDescription>
          </DialogHeader>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-6 py-4"
        >
          <div className="space-y-5">
            {/* Event Details */}
            <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-indigo-300">Price</span>
                <span className="font-semibold text-gray-200">
                  {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-indigo-300">Available Seats</span>
                <span className={`font-semibold ${event.available_seats > 0 ? 'text-green-400' : 'text-rose-400'}`}>
                  {event.available_seats}
                </span>
              </div>
            </div>

            {/* User Email */}
            {user && (
              <div className="space-y-2">
                <Label className="text-indigo-300">Email</Label>
                <Input 
                  value={user.email} 
                  disabled 
                  className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12" 
                />
              </div>
            )}
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-r from-rose-600/20 to-pink-500/20 border border-rose-600/30 text-rose-300 px-4 py-3 rounded-xl mt-5"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DialogFooter className="bg-gray-900/30 px-6 py-4 border-t border-gray-700 gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleBooking}
              disabled={loading || event.available_seats === 0}
              className={`bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl py-2 shadow-lg hover:shadow-indigo-700/20 transition-all font-medium ${event.available_seats === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Booking...' : event.available_seats === 0 ? 'Sold Out' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}