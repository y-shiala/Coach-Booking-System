'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceCard } from '@/components/ServiceCard';
import { Service } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Empty } from '@/components/ui/empty';

export default function ServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

const loadServices = async () => {
  try {
    setIsLoading(true);
    const data = await apiClient.get<Service[]>('/services');
  
    setServices(data || []);
  } catch (error: any) {
    toast.error(error?.message || 'Failed to load services');
  } finally {
    setIsLoading(false);
  }
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'coach'
              ? 'Manage your coaching services'
              : 'Browse available coaching services'}
          </p>
        </div>
        {user?.role === 'coach' && (
          <Button asChild size="lg">
            <Link href="/dashboard/services/new">
              <Plus className="mr-2 h-4 w-4" />
              New Service
            </Link>
          </Button>
        )}
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <Empty
          icon="briefcase"
          title="No services available"
          description={
            user?.role === 'coach'
              ? 'Create your first coaching service to get started.'
              : 'No services are currently available. Check back later.'
          }
          action={
            user?.role === 'coach' ? (
              <Button asChild>
                <Link href="/dashboard/services/new">Create Service</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              actionButton={
                user?.role === 'coach' ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/services/${service.id}`}>Edit Service</Link>
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/bookings/new?serviceId=${service.id}`}>Book Now</Link>
                  </Button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
