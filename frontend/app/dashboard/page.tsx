'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'coach'
            ? 'Manage your coaching sessions and availability'
            : 'Book coaching sessions with top coaches'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground mt-1">View all bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground mt-1">Sessions finished</p>
          </CardContent>
        </Card>

        {user?.role === 'coach' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">—</div>
                <p className="text-xs text-muted-foreground mt-1">Your offerings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">—</div>
                <p className="text-xs text-muted-foreground mt-1">Total revenue</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            {user?.role === 'coach'
              ? 'Set up your profile, add services, and start accepting bookings'
              : 'Browse services, book sessions, and manage your schedule'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            {user?.role === 'coach' ? (
              <>
                <p>✓ Complete your profile and set your rate</p>
                <p>✓ Add your coaching services</p>
                <p>✓ Set your weekly availability</p>
                <p>✓ Accept bookings from customers</p>
              </>
            ) : (
              <>
                <p>✓ Browse available coaching services</p>
                <p>✓ Book sessions at your convenience</p>
                <p>✓ Manage your bookings</p>
                <p>✓ Connect with expert coaches</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
