'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimeSlot } from '@/lib/types';
import { X } from 'lucide-react';

interface AvailabilitySchedulerProps {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
  disabled?: boolean;
}

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export function AvailabilityScheduler({
  value,
  onChange,
  disabled = false,
}: AvailabilitySchedulerProps) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number]>('monday');

  const addSlot = () => {
    if (startTime >= endTime) {
      alert('Start time must be before end time');
      return;
    }

    // Check if slot already exists for this day
    const existingIndex = value.findIndex((slot) => slot.day === selectedDay);

    const newSlot: TimeSlot = {
      day: selectedDay,
      startTime,
      endTime,
    };

    if (existingIndex >= 0) {
      const updated = [...value];
      updated[existingIndex] = newSlot;
      onChange(updated);
    } else {
      onChange([...value, newSlot]);
    }
  };

  const removeSlot = (day: (typeof DAYS)[number]) => {
    onChange(value.filter((slot) => slot.day !== day));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Availability</CardTitle>
        <CardDescription>Set your available coaching hours for each day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Slot */}
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <div>
            <label className="text-sm font-medium">Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as (typeof DAYS)[number])}
              disabled={disabled}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {DAY_LABELS[day]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={disabled}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={disabled}
                className="mt-1"
              />
            </div>
          </div>

          <Button onClick={addSlot} disabled={disabled} className="w-full">
            Add Slot
          </Button>
        </div>

        {/* Display Slots */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Your Schedule</h4>
          {value.length === 0 ? (
            <p className="text-sm text-muted-foreground">No availability set yet</p>
          ) : (
            <div className="space-y-2">
              {DAYS.map((day) => {
                const slot = value.find((s) => s.day === day);
                if (!slot) return null;

                return (
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card"
                  >
                    <div>
                      <p className="font-medium text-sm">{DAY_LABELS[day]}</p>
                      <p className="text-xs text-muted-foreground">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSlot(day)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
