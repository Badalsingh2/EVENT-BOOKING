// src/types/event.ts
export interface Event {
    id?: string;
    title: string;
    description: string;
    date: string;
    location: string;
    price?: number | null;
    organizer_email: string;
    total_seats: number;
    available_seats: number;
    status?: string;
  }