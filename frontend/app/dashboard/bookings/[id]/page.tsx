'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Booking } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<Booking>(`/bookings/${bookingId}`);
      setBooking(data);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load booking');
      router.push('/dashboard/bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    try {
      setIsCancelling(true);
      await apiClient.put(`/bookings/${booking.id}`, { status: 'cancelled' });
      toast.success('Booking cancelled successfully');
      router.push('/dashboard/bookings');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertDescription>Booking not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  // 👇 Handle populated fields from backend
  const service = booking.serviceId as any;
  const coach = booking.staffId as any;
  const customer = booking.customerId as any;

  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const durationMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60)
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard/bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Link>
      </Button>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {service?.name || 'Booking Details'}
              </CardTitle>
              <CardDescription className="mt-2">
                Booking ID: {booking.id}
              </CardDescription>
            </div>
            <StatusBadge status={booking.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Service Details */}
          <div>
            <h3 className="font-semibold mb-3">Service Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{service?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">${booking.totalPrice}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{durationMinutes} minutes</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Time</p>
                <p className="font-medium">
                  {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Time</p>
                <p className="font-medium">
                  {endDate.toLocaleDateString()} at {endDate.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Participants</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Coach</p>
                <p className="font-medium">{coach?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{customer?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer Email</p>
                <p className="font-medium">{customer?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Notes</h3>
              <p className="text-muted-foreground">{booking.notes}</p>
            </div>
          )}

          {/* Actions */}
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <div className="border-t pt-6 flex gap-3">
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}