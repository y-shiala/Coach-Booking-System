'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Service } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  customerId: z.string().min(1, 'Customer is required'),
  selectedSlot: z.string().min(1, 'Please select a time slot'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSuccess?: () => void;
}


function getNextDateForDay(dayName: string): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  const targetDay = days.indexOf(dayName.toLowerCase());
  const todayDay = today.getDay();
  let daysUntilTarget = targetDay - todayDay;
  if (daysUntilTarget <= 0) daysUntilTarget += 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilTarget);
  return nextDate.toISOString().split('T')[0];
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [timeSlots, setTimeSlots] = useState<{ day: string; start: string; end: string }[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

 

  const loadServices = async () => {
    try {
      const data = await apiClient.get<Service[]>('/services');
      setServices(data || []);
    } catch (error: any) {
      toast.error('Failed to load services');
    } finally {
      setIsLoadingServices(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await apiClient.get<any[]>('/users');
     
      setCustomers(data.filter((u) => u.role === 'customer'));
    } catch (error: any) {
      toast.error('Failed to load customers');
    } finally {
      setIsLoadingCustomers(false);
    }
  };

   useEffect(() => {
    loadServices();
    loadCustomers();
  }, []);

  const handleServiceChange = (serviceId: string) => {
    const found = services.find((s: any) => s.id === serviceId);
    if (found) {
      setSelectedService(found);
      const coach = (found as any).staffId;

      if (coach?.availability) {
        const slots = Object.entries(coach.availability).map(
          ([day, times]: [string, any]) => ({
            day,
            start: Array.isArray(times) ? times[0] : '',
            end: Array.isArray(times) ? times[1] : '',
          })
        );
        setTimeSlots(slots);
      } else {
        setTimeSlots([]);
      }
      setValue('selectedSlot', '');
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const [day, startTime] = data.selectedSlot.split('|');
      const nextDate = getNextDateForDay(day);
      const startDateTime = new Date(`${nextDate}T${startTime}:00`).toISOString();

      await apiClient.post('/bookings', {
        serviceId: data.serviceId,
        customerId: data.customerId, 
        startTime: startDateTime,
      });

      toast.success('Booking created successfully');
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Failed to create booking';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Booking</CardTitle>
        <CardDescription>Book a coaching session for a customer</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Service Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Service</label>
            {isLoadingServices ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span className="text-sm">Loading services...</span>
              </div>
            ) : (
              <Controller
                name="serviceId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleServiceChange(value);
                    }}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service: any) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} — ${service.price} ({service.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            {errors.serviceId && (
              <p className="text-xs text-destructive">{errors.serviceId.message}</p>
            )}
          </div>

          {/* Service + Coach Details */}
          {selectedService && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Coach</p>
                  <p className="font-medium">{(selectedService as any).staffId?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedService.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-primary">${selectedService.price}</p>
                </div>
              </div>
            </div>
          )}

          {/*
           
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Customer</label>
            {isLoadingCustomers ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span className="text-sm">Loading customers...</span>
              </div>
            ) : customers.length === 0 ? (
              <div className="px-3 py-2 border border-input rounded-md bg-muted text-sm text-muted-foreground">
                No customers registered yet
              </div>
            ) : (
              <Controller
                name="customerId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            {errors.customerId && (
              <p className="text-xs text-destructive">{errors.customerId.message}</p>
            )}
          </div> */}

          {/* Time Slot Selection */}
          {timeSlots.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Available Time Slot</label>
              <p className="text-xs text-muted-foreground">
                Your booking will be scheduled for the next occurrence of the selected day.
              </p>
              <Controller
                name="selectedSlot"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(({ day, start, end }) => (
                        <SelectItem key={day} value={`${day}|${start}|${end}`}>
                          <span className="capitalize">{day}</span>: {start} - {end}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.selectedSlot && (
                <p className="text-xs text-destructive">{errors.selectedSlot.message}</p>
              )}
            </div>
          )}

          {/* No availability message */}
          {selectedService && timeSlots.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                This coach has not set their availability yet.
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea
              {...register('notes')}
              placeholder="Add any special requests or notes..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Creating booking...
              </>
            ) : (
              'Create Booking'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}