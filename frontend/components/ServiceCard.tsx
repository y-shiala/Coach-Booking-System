import Link from 'next/link';
import { Service } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, DollarSign, User, Calendar } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  actionButton?: React.ReactNode;
}

export function ServiceCard({ service, actionButton }: ServiceCardProps) {
 
  const coach = service.staffId as any;

 
  const availabilitySlots = coach?.availability
    ? Object.entries(coach.availability).map(([day, times]: [string, any]) => ({
        day,
        times,
      }))
    : [];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="line-clamp-2">{service.name}</CardTitle>
        <CardDescription className="line-clamp-2">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-3">
          
          {coach && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{coach.name}</span>
            </div>
          )}

          {/* Duration */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{service.duration} minutes</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">${service.price}</span>
          </div>

          {/* Availability */}
          {availabilitySlots.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Available Days</span>
              </div>
              <div className="pl-6 space-y-1">
                {availabilitySlots.map(({ day, times }) => (
                  <div key={day} className="text-xs text-muted-foreground capitalize">
                    {day}: {Array.isArray(times) ? times.join(' - ') : times}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action */}
        {actionButton}
      </CardContent>
    </Card>
  );
}