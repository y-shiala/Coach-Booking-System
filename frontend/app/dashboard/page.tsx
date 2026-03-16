'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Calendar, CheckCircle, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalServices: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      setIsLoading(true);

      if (user?.role === 'coach') {
        const [services, bookings] = await Promise.all([
          apiClient.get<any[]>(`/services?staffId=${user.id}`),
          apiClient.get<any[]>('/bookings'), 
        ]);

        const totalEarnings = bookings
          .filter((b) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        setStats({
          totalBookings: bookings.length,
          completedBookings: bookings.filter((b) => b.status === 'completed').length,
          totalServices: services.length,
          totalEarnings,
        });
      } else {
       
        const bookings = await apiClient.get<any[]>('/bookings');

        setStats({
          totalBookings: bookings.length,
          completedBookings: bookings.filter((b) => b.status === 'completed').length,
          totalServices: 0,
          totalEarnings: 0,
        });
      }
    } catch (error) {
      console.error('Failed to load stats', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = user?.role === 'coach'
    ? [
        {
          title: 'Total Bookings',
          value: stats.totalBookings,
          subtitle: 'All time bookings',
          icon: Calendar,
        },
        {
          title: 'Completed',
          value: stats.completedBookings,
          subtitle: 'Sessions finished',
          icon: CheckCircle,
        },
        {
          title: 'My Services',
          value: stats.totalServices,
          subtitle: 'Services offered',
          icon: Briefcase,
        },
        {
          title: 'Total Earnings',
          value: `$${stats.totalEarnings.toFixed(2)}`,
          subtitle: 'From confirmed sessions',
          icon: DollarSign,
        },
      ]
    : [
        {
          title: 'Total Bookings',
          value: stats.totalBookings,
          subtitle: 'All time bookings',
          icon: Calendar,
        },
        {
          title: 'Completed',
          value: stats.completedBookings,
          subtitle: 'Sessions finished',
          icon: CheckCircle,
        },
      ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'coach'
            ? 'Manage your coaching sessions and availability'
            : 'Book coaching sessions with top coaches'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${user?.role === 'coach' ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`}>
        {statCards.map(({ title, value, subtitle, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '...' : value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
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
                <p>✓ Pay deposit to confirm booking</p>
                <p>✓ Connect with expert coaches</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}