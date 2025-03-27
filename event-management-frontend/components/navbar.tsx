'use client'

import Link from 'next/link'
import { 
  HomeIcon, 
  PersonIcon, 
  RocketIcon, 
  MoonIcon, 
  SunIcon 
} from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <RocketIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">EventPro</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-1 hover:text-primary transition">
            <HomeIcon className="h-4 w-4" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link href="/events" className="flex items-center space-x-1 hover:text-primary transition">
            <RocketIcon className="h-4 w-4" />
            <span className="hidden md:inline">Events</span>
          </Link>
          <Link href="/profile" className="flex items-center space-x-1 hover:text-primary transition">
            <PersonIcon className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="hover:bg-accent"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>

          <div className="flex space-x-2">
            <Link href="/auth/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}