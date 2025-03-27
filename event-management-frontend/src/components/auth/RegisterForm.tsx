// src/components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { authService } from '@/lib/api';
import { RoleEnum } from '@/types/user';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RoleEnum>('attendee');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await authService.register({
        email,
        full_name: fullName,
        password,
        role
      });
      
      // Redirect to login page or dashboard depending on role
      router.push('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block mb-2">Email</label>
        <Input 
          type="email" 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>
      <div>
        <label htmlFor="fullName" className="block mb-2">Full Name</label>
        <Input 
          type="text" 
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required 
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2">Password</label>
        <Input 
          type="password" 
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>
      <div>
        <label htmlFor="role" className="block mb-2">Role</label>
        <select 
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as RoleEnum)}
          className="w-full p-2 border rounded"
        >
          <option value="attendee">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full">Register</Button>
    </form>
  );
}