// src/types/user.ts
export type RoleEnum = 'admin' | 'organizer' | 'attendee';
export type OrganizerStatus = 'pending' | 'approved' | 'rejected';

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
  role?: RoleEnum;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserPublic {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status?: string | null;
  created_at: string;
}