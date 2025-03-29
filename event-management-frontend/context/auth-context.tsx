"use client"

import { useRouter } from 'next/navigation'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type User = {
  email: string
  full_name: string
  role: string
  status?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: { email: string; full_name: string; password: string; role: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch('http://127.0.0.1:8000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) throw new Error('Login failed')
    
    const responseData = await response.json()
    
    // Extract token and user information
    const { access_token, token_type, user_role, user_status } = responseData
    
    // Create a user object to match your User type
    const userData: User = {
      email, // Using the email from login
      full_name: '', // You may not have this from login response
      role: user_role,
      status: user_status
    }
    
    // Store both token and user data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(userData))
    
    setUser(userData)
  }

  const register = async (userData: { email: string; full_name: string; password: string; role: string }) => {
    const response = await fetch('http://127.0.0.1:8000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })

    if (!response.ok) throw new Error('Registration failed')
    
    const newUser = await response.json()
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    router.push("/")

  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}