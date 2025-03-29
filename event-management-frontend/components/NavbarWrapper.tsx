"use client"
import { useAuth } from '@/context/auth-context'
import { Navbar } from '@/components/navbar' // Adjust import path if needed

export function NavbarWrapper() {
    const { user, logout } = useAuth()
    
    return (
        <Navbar 
            isLoggedIn={!!user} 
            userProfile={{ 
                name: user?.email || user?.full_name || 'User',
            }}
            onLogout={logout}
        />
    )
}