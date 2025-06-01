"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarPlus, Download } from 'lucide-react';
import { generateIcsFileContent, generateGoogleCalendarLink, generateOutlookCalendarLink } from '@/lib/calendar-utils';
import { format } from 'date-fns';

interface CalendarIntegrationProps {
  bookingDate: Date | undefined;
  travelDate: Date | undefined;
}

export default function CalendarIntegration({ bookingDate, travelDate }: CalendarIntegrationProps) {
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
    URL.revokeObjectURL(link.href); // Clean up blob URL
  };

  const googleLink = generateGoogleCalendarLink(eventDetails.title, eventDetails.description, eventDetails.startTime, eventDetails.endTime);
  const outlookLink = generateOutlookCalendarLink(eventDetails.title, eventDetails.description, eventDetails.startTime, eventDetails.endTime);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <CalendarPlus className="mr-2 h-6 w-6" /> Add to Calendar
        </CardTitle>
        <CardDescription>
          Set a reminder for the booking date in your preferred calendar.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      </CardContent>
    </Card>
  );
}
