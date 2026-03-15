'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookingForm } from '@/components/BookingForm';
import { ArrowLeft } from 'lucide-react';

export default function NewBookingPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard/bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Link>
      </Button>

      {/* Form */}
      <BookingForm onSuccess={() => router.push('/dashboard/bookings')} />
    </div>
  );
}
