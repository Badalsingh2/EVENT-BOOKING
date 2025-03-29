'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RoleEnum } from '@/types/user';

// Zod validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["attendee", "organizer"] as const, {
    required_error: "Please select a role",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      full_name: '',
      password: '',
      role: 'attendee'
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await authService.register(data);
      router.push('/login');  // Redirect to login page after successful registration
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-800 to-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:40px_40px] opacity-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md backdrop-blur-lg bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-700"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            Create Account
          </h2>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-300">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      type="email" 
                      {...field} 
                      className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-300">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
                      type="text" 
                      {...field} 
                      className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-300">Password</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Create a password" 
                      type="password" 
                      {...field} 
                      className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-300">Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-200 focus:border-indigo-500 rounded-xl h-12">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                      <SelectItem value="attendee">Attendee</SelectItem>
                      <SelectItem value="organizer">Organizer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl py-3 h-12 shadow-lg hover:shadow-indigo-700/20 transition-all font-medium"
              >
                Register
              </Button>
            </motion.div>
          </form>
        </Form>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400">
            Already have an account? <a href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Login</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RegisterForm;