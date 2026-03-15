'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ServiceForm } from '@/components/ServiceForm';
import { ArrowLeft } from 'lucide-react';

export default function NewServicePage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
      </Button>

      {/* Form */}
      <ServiceForm onSuccess={() => router.push('/dashboard/services')} />
    </div>
  );
}
