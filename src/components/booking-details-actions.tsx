
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, CalendarPlus, Download } from 'lucide-react';
import { format } from 'date-fns';
import { generateIcsFileContent, generateGoogleCalendarLink, generateOutlookCalendarLink } from '@/lib/calendar-utils';

interface BookingDetailsActionsProps {
  bookingDate: Date | undefined;
  travelDate: Date | undefined;
}

export default function BookingDetailsActions({ bookingDate, travelDate }: BookingDetailsActionsProps) {
  if (!bookingDate || !travelDate) {
    return null;
  }

  const eventDetails = {
    title: `Book Train Tickets for ${format(travelDate, 'PPP')}`,
    description: `Reminder to book train tickets for your travel on ${format(travelDate, 'PPP')}. Booking opens at 8:00 AM. Check IRCTC for exact Tatkal timings if applicable.`,
    startTime: bookingDate,
    endTime: new Date(bookingDate.getTime() + 30 * 60000), // 30 minutes duration
  };

  const handleDownloadIcs = () => {
    const icsContent = generateIcsFileContent(eventDetails.title, eventDetails.description, eventDetails.startTime, eventDetails.endTime);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `train_booking_reminder_${format(travelDate, 'yyyy-MM-dd')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); 
  };

  const googleLink = generateGoogleCalendarLink(eventDetails.title, eventDetails.description, eventDetails.startTime, eventDetails.endTime);
  const outlookLink = generateOutlookCalendarLink(eventDetails.title, eventDetails.description, eventDetails.startTime, eventDetails.endTime);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <Timer className="mr-2 h-6 w-6" /> Booking opens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-chart-2/15 border-2 border-chart-2/40 rounded-lg shadow-md">
          <div className="flex items-start">
            <div>
              <p className="text-xl text-foreground/90">
                <strong className="font-bold text-chart-2">{format(bookingDate, 'PPP')} at 8:00 AM</strong>
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              onClick={() => window.open(googleLink, '_blank')}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base"
              aria-label="Add to Google Calendar"
            >
              <CalendarPlus className="mr-2 h-5 w-5" /> Google
            </Button>
            <Button
              onClick={() => window.open(outlookLink, '_blank')}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base"
              aria-label="Add to Outlook Calendar"
            >
              <CalendarPlus className="mr-2 h-5 w-5" /> Outlook
            </Button>
            <Button
              onClick={handleDownloadIcs}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-base"
              aria-label="Download ICS for Apple Calendar"
            >
              <Download className="mr-2 h-5 w-5" /> Apple (.ics)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
