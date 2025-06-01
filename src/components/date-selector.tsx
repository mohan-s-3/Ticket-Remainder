
"use client";

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DateSelectorProps {
  onDateSelect: (travelDate: Date, bookingDate: Date) => void;
}

export default function DateSelector({ onDateSelect }: DateSelectorProps) {
  const [travelDate, setTravelDate] = useState<Date | undefined>();
  const [minDate, setMinDate] = useState<Date>(new Date());

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setMinDate(today);
  }, []);

  useEffect(() => {
    if (travelDate) {
      const bookingOpen = new Date(travelDate);
      bookingOpen.setDate(travelDate.getDate() - 60);
      bookingOpen.setHours(8, 0, 0, 0); // Booking opens at 8 AM
      onDateSelect(travelDate, bookingOpen);
    } else {
      // If travelDate is cleared, the parent's useEffect will handle hiding details.
      // We might want to explicitly call onDateSelect with undefined if parent needs it.
      // For now, this setup means onDateSelect is only called with valid dates.
    }
  }, [travelDate, onDateSelect]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <CalendarIcon className="mr-2 h-6 w-6" /> Select Your Travel Date
        </CardTitle>
        <CardDescription>
          Choose your intended date of travel to calculate when ticket bookings open.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal text-lg py-6',
                !travelDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {travelDate ? format(travelDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={travelDate}
              onSelect={setTravelDate}
              initialFocus
              disabled={(date) => date < minDate}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}
