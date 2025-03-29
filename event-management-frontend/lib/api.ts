// src/lib/api.ts
import { Booking } from '@/types/booking';
import { OrganizerStatus, UserCreate } from '@/types/user';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to attach the token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const authService = {
    async login(email: string, password: string) {
      try {
        const response = await api.post('/auth/login', { email, password });
        
        // Assuming the response includes a token and user info
        const { access_token, user } = response.data;
        
        // Store the token
        localStorage.setItem('authToken', access_token);
        
        return { user };
      } catch (error) {
        console.error('Login error', error);
        throw error;
      }
    },
  
    async register(userData: {
      email: string;
      full_name: string;
      password: string;
      role?: 'admin' | 'organizer' | 'attendee';
    }) {
      try {
        const response = await api.post('/auth/register', userData);
        return response.data;
      } catch (error) {
        console.error('Registration error', error);
        throw error;
      }
    },
  
    async getCurrentUser() {
      try {
        const response = await api.get('/auth/me');
        return response.data;
      } catch (error) {
        console.error('Get current user error', error);
        throw error;
      }
    },
  
    logout() {
      localStorage.removeItem('authToken');
    }
  };

export const eventService = {
  createEvent: (eventData: Event) => api.post('/events/create', eventData),
  listEvents: () => api.get('/events/'),
  approveEvent: (eventId: string) => api.put(`/events/${eventId}/approve`),
  rejectEvent: (eventId: string) => api.put(`/events/${eventId}/reject`),
};

export const bookingService = {
  bookEvent: (bookingData: Booking) => api.post('/bookings/book', bookingData),
};

export const adminService = {
  registerAdmin: (adminData: UserCreate, setupToken?: string) => 
    api.post('/admin/register', adminData, { 
      params: setupToken ? { setup_token: setupToken } : {} 
    }),
  listOrganizers: (status?: OrganizerStatus) => 
    api.get('/admin/organizers', { params: { status } }),
  updateOrganizerStatus: (userId: string, status: OrganizerStatus, reason?: string) => 
    api.put(`/admin/organizers/${userId}`, { status, reason }),
};

export default api;