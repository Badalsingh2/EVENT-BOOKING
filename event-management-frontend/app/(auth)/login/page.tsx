"use client"

import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { EyeIcon, EyeOffIcon, Lock, Mail } from 'lucide-react'
import { AppLayout } from '@/components/layout'

export default function LoginPage() {
    const { login } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await login(email, password)

            // Get the updated user from local storage after login
            const userStr = localStorage.getItem('user')
            if (userStr) {
                const user = JSON.parse(userStr)

                // Log for debugging
                console.log("User data retrieved:", user)

                // Redirect based on user role
                switch (user.role?.toLowerCase()) {
                    case 'admin':
                        router.push('/admin/organizers')
                        break
                    case 'organizer':
                        router.push('/event')
                        break
                    case 'attendee':
                        router.push('/')
                        break
                    default:
                        router.push('/')
                }
            } else {
                console.error("No user data found in localStorage after login")
                setError("Login successful but user data not found")
                setIsLoading(false)
            }
        } catch (err: any) {
            console.error("Login error:", err)
            setError(err.message || 'Invalid email or password')
            setIsLoading(false)
        }
    }

    return (
        <AppLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 p-4">
                <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-purple-800/10 border border-gray-100 dark:border-gray-800">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs text-purple-600 hover:text-purple-500 dark:text-purple-400">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors py-2 h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                        </span>
                        <Link
                            href="/register"
                            className="text-purple-600 hover:underline dark:text-purple-400 font-medium"
                        >
                            Create account
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}