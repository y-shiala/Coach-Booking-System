'use client';

import { Booking } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Empty } from '@/components/ui/empty';

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onCancel?: (id: string) => void;
}

export function BookingsTable({
  bookings,
  isLoading,
  onCancel,
}: BookingsTableProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Empty
        icon="calendar"
        title="No bookings yet"
        description="Start by creating a new booking or wait for customers to book your services."
        action={
          <Button asChild>
            <Link href="/dashboard/bookings/new">Create Booking</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left text-sm font-medium">Service</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Client</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Date & Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const startDate = new Date(booking.startTime);
              const endDate = new Date(booking.endTime);

              return (
                <tr key={booking.id} className="border-b hover:bg-muted/50 transition">
                  <td className="px-6 py-4 text-sm font-medium">
                    {(booking.serviceId as any)?.name || 'Unknown Service'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {(booking.customerId as any)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      {startDate.toLocaleDateString()} {startDate.toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(startDate, { addSuffix: true })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/dashboard/bookings/${booking.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
