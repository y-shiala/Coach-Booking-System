'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const serviceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.coerce.number().min(15, 'Duration must be at least 15 minutes'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  onSuccess?: () => void;
}

export function ServiceForm({ onSuccess }: ServiceFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  const onSubmit = async (data: ServiceFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await apiClient.post('/services', {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        
      });

      toast.success('Service created successfully');
      reset();
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to create service';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Service</CardTitle>
        <CardDescription>Add a new coaching service to your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Service Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Name</label>
            <Input
              {...register('name')}
              placeholder="e.g., Personal Training Session"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register('description')}
              placeholder="Describe what your service includes..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Duration & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                {...register('duration')}
                type="number"
                placeholder="60"
                disabled={isSubmitting}
              />
              {errors.duration && (
                <p className="text-xs text-destructive">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($)</label>
              <Input
                {...register('price')}
                type="number"
                placeholder="100"
                step="0.01"
                disabled={isSubmitting}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Creating service...
              </>
            ) : (
              'Create Service'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
