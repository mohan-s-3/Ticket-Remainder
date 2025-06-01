"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { CalendarClock, CalendarCheck2, CalendarX2 } from 'lucide-react';

interface BookingTimelineProps {
  travelDate: Date | undefined;
  bookingOpenDate: Date | undefined;
}

export default function BookingTimeline({ travelDate, bookingOpenDate }: BookingTimelineProps) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [currentDateLabel, setCurrentDateLabel] = useState('');
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (!travelDate || !bookingOpenDate) {
      setProgressPercentage(0);
      setCurrentDateLabel('');
      setStatusText('');
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0); // Normalize today for comparison with dates

    const bookingOpenTime = bookingOpenDate.getTime();
    const travelTime = travelDate.getTime();
    const todayTime = today.getTime();

    setCurrentDateLabel(format(today, 'MMM d, yyyy'));

    if (todayTime < bookingOpenTime) {
      setProgressPercentage(0);
      setStatusText("Booking hasn't opened yet.");
    } else if (todayTime > travelTime) {
      setProgressPercentage(100);
      setStatusText("Travel date has passed.");
    } else {
      const totalDuration = travelTime - bookingOpenTime;
      const elapsedDuration = todayTime - bookingOpenTime;
      
      if (totalDuration <= 0) { // Should not happen if dates are logical
        setProgressPercentage(todayTime >= travelTime ? 100 : 0);
      } else {
        setProgressPercentage(Math.min(100, (elapsedDuration / totalDuration) * 100));
      }
      
      if (todayTime === bookingOpenTime) {
        setStatusText("Booking opens today at 8 AM!");
      } else if (todayTime === travelTime) {
        setStatusText("Today is your travel date!");
      } else {
        const daysRemaining = Math.ceil((travelTime - todayTime) / (1000 * 60 * 60 * 24));
        setStatusText(`${daysRemaining} day${daysRemaining > 1 ? 's' : ''} until travel. Book soon if you haven't!`);
      }
    }
  }, [travelDate, bookingOpenDate]);

  if (!travelDate || !bookingOpenDate) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <CalendarClock className="mr-2 h-6 w-6" /> Booking Timeline
        </CardTitle>
        <CardDescription>
          Visualize your booking window from opening day to travel day.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full pt-4">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
            <div className="text-left">
              <CalendarCheck2 className="inline-block h-4 w-4 mr-1 text-green-600" />
              Booking Opens
              <br />
              {format(bookingOpenDate, 'MMM d, yyyy')}
            </div>
            <div className="text-right">
              <CalendarX2 className="inline-block h-4 w-4 mr-1 text-red-600" />
              Travel Date
              <br />
              {format(travelDate, 'MMM d, yyyy')}
            </div>
          </div>
          {progressPercentage > 0 && progressPercentage < 100 && (
            <div 
              className="absolute text-xs font-semibold text-primary" 
              style={{ left: `${progressPercentage}%`, top: '-0.5rem', transform: 'translateX(-50%)' }}
            >
              Today
              <div className="h-2 w-px bg-primary absolute left-1/2 -bottom-2.5"></div>
            </div>
          )}
        </div>
        {statusText && (
          <p className="text-center text-sm text-foreground/90 font-medium pt-2">{statusText}</p>
        )}
      </CardContent>
    </Card>
  );
}
