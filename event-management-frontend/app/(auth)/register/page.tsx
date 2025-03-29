"use client"

import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { EyeIcon, EyeOffIcon, Lock, Mail, User, UserPlus } from 'lucide-react'


export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'attendee'
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      await register(formData)
      router.push('/')
    } catch (err: unknown) {
      console.error("Registration error:", err)
      if (err instanceof Error) {
        setError(err.message);
    } else {
        setError("Invalid email or password");
    }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-950 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 transform transition-transform hover:scale-105 duration-300">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="mt-2 text-gray-400">
              Join our event community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm bg-red-900/30 border border-red-800 text-red-300 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-indigo-300" />
                  </div>
                  <Input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="pl-10 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-500/30 rounded-lg"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-indigo-300" />
                  </div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-500/30 rounded-lg"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-300" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-500/30 rounded-lg"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-indigo-300 hover:text-indigo-400 transition-colors" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-indigo-300 hover:text-indigo-400 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Account Type
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full rounded-lg bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-500/30 py-2 px-3"
                >
                  <option value="attendee">Event Attendee</option>
                  <option value="organizer">Event Organizer</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium py-2 h-12 rounded-lg shadow-md hover:shadow-indigo-800/30 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-700 absolute w-full"></div>
              <div className="bg-gray-800 px-4 relative text-sm text-gray-400">or continue with</div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-4">
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-colors">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-colors">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                  <path d="M22.451 14.225c-.814 2.172-3.097 3.749-5.2 3.967-2.285.229-4.936-.616-6.357-2.365-1.908-2.341-2.04-6.054.7-7.904 1.661-1.12 4.621-1.346 6.789.384-1.782-2.466-6.752-2.796-9.218-.576-2.523 2.276-1.081 5.804.5 8.115 1.737 2.541 4.676 3.505 7.733 2.984 3.116-.534 5.017-2.815 6-5.605h-9.798c0-.593 0-1.186 0-1.778h10.5c.209 1.134.271 2.147.351 2.778z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="text-center text-sm pt-4">
            <span className="text-gray-400">
              Already have an account?{' '}
            </span>
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}