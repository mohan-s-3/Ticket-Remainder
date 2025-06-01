"use client";

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DateSelectorProps {
  onDateSelect: (travelDate: Date, bookingDate: Date) => void;
}

export default function DateSelector({ onDateSelect }: DateSelectorProps) {
  const [travelDate, setTravelDate] = useState<Date | undefined>();
  const [bookingOpenDate, setBookingOpenDate] = useState<Date | undefined>();
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
      setBookingOpenDate(bookingOpen);
      onDateSelect(travelDate, bookingOpen);
    } else {
      setBookingOpenDate(undefined);
      // Potentially clear dates in parent if travelDate is undefined
      // onDateSelect(undefined, undefined) - requires prop type change
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

        {bookingOpenDate && travelDate && (
          <Alert className="bg-primary/10 border-primary/30 transition-opacity duration-500 ease-in-out opacity-100">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">Booking Window Information</AlertTitle>
            <AlertDescription className="text-foreground/80 text-base">
              For travel on <strong className="font-semibold">{format(travelDate, 'PPP')}</strong>,
              bookings will open on <strong className="font-semibold">{format(bookingOpenDate, 'PPP')} at 8:00 AM</strong>.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
