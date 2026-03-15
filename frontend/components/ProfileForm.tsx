'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, TimeSlot } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { AvailabilityScheduler } from './AvailabilityScheduler';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  price_per_hour: z.coerce.number().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userId: string;
  isCoach: boolean;
}

export function ProfileForm({ userId, isCoach }: ProfileFormProps) {
  const { refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<TimeSlot[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const data = await apiClient.get<User>(`/users/${userId}`);
      reset({
        name: data.name,
        bio: data.bio || '',
        price_per_hour: data.price_per_hour || undefined,
      });
    } catch (err: any) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      
      const availabilityMap: Record<string, string[]> = {};
      if (isCoach && availability.length > 0) {
        availability.forEach((slot) => {
          availabilityMap[slot.day] = [slot.startTime, slot.endTime];
        });
      }

      await apiClient.put(`/users/${userId}`, {
        name: data.name,
        bio: data.bio || undefined,
        price_per_hour: isCoach ? data.price_per_hour : undefined,
        availability: isCoach && availability.length > 0
          ? availabilityMap
          : undefined,
      });

      toast.success('Profile updated successfully');
      await refreshUser();
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              {...register('name')}
              placeholder="John Doe"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              {...register('bio')}
              placeholder="Tell us about your coaching experience and expertise..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              rows={4}
              disabled={isSubmitting}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          {isCoach && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Price per Hour ($)</label>
              <Input
                {...register('price_per_hour')}
                type="number"
                placeholder="100"
                step="0.01"
                disabled={isSubmitting}
              />
              {errors.price_per_hour && (
                <p className="text-xs text-destructive">{errors.price_per_hour.message}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability for Coaches */}
      {isCoach && (
        <AvailabilityScheduler
          value={availability}
          onChange={setAvailability}
          disabled={isSubmitting}
        />
      )}

      {/* Submit */}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner className="mr-2" />
            Saving changes...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
}