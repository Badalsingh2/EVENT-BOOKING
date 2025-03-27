// src/lib/role-access.ts
import { User } from '@/types/user';

export function canCreateEvent(user: User | null): boolean {
  return user?.role === 'organizer' || user?.role === 'admin';
}

export function canApproveEvent(user: User | null): boolean {
  return user?.role === 'admin';
}

export function canBookEvent(user: User | null): boolean {
  return user?.role === 'attendee' || user?.role === 'admin';
}

// Middleware for protecting routes
export function withRoleProtection(allowedRoles: string[]) {
  return function ProtectedRoute(Component: React.ComponentType<any>) {
    return function WrappedComponent(props: any) {
      const { user, loading } = useAuth();

      // Loading state
      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
      }

      // Not authenticated
      if (!user) {
        return <Navigate to="/login" />;
      }

      // Check role
      if (!allowedRoles.includes(user.role)) {
        return (
          <div className="flex justify-center items-center h-screen text-red-500">
            You do not have permission to access this page.
          </div>
        );
      }

      return <Component {...props} />;
    };
  };
}

// Example usage in a page
export const OrganizerDashboard = withRoleProtection(['organizer', 'admin'])(
  function OrganizerDashboard() {
    // Page content for organizers
    return <div>Organizer Dashboard</div>;
  }
);