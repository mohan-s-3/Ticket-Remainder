
"use client";

import { useState, useEffect, useCallback } from 'react';
import DateSelector from '@/components/date-selector';
import BookingDetailsActions from '@/components/booking-details-actions';
import BookingTimeline from '@/components/booking-timeline';
import ChatAssistant from '@/components/chat-assistant';
import { Train } from 'lucide-react';

export default function HomePage() {
  const [selectedTravelDate, setSelectedTravelDate] = useState<Date | undefined>();
  const [calculatedBookingDate, setCalculatedBookingDate] = useState<Date | undefined>();
  const [showDetails, setShowDetails] = useState(false);

  const handleDateSelect = useCallback((travelDate: Date, bookingDate: Date) => {
    setSelectedTravelDate(travelDate);
    setCalculatedBookingDate(bookingDate);
  }, []);
  
  useEffect(() => {
    if (selectedTravelDate && calculatedBookingDate) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  }, [selectedTravelDate, calculatedBookingDate]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center font-body">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Train className="h-10 w-10 md:h-12 md:w-12 text-primary mr-3" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Train Ticket Reminder
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          Never miss your train ticket booking window again! Select your travel date to get started.
        </p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DateSelector onDateSelect={handleDateSelect} />
          
          <div 
            className={`space-y-6 transition-opacity duration-700 ease-in-out ${showDetails ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}
            style={{ transform: showDetails ? 'translateY(0)' : 'translateY(10px)', willChange: 'opacity, transform' }}
          >
            {selectedTravelDate && calculatedBookingDate && (
              <>
                <BookingDetailsActions 
                  travelDate={selectedTravelDate}
                  bookingDate={calculatedBookingDate}
                />
                <BookingTimeline
                  travelDate={selectedTravelDate}
                  bookingOpenDate={calculatedBookingDate}
                />
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <ChatAssistant />
        </div>
      </main>

      <footer className="w-full max-w-4xl mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Train Ticket Reminder. Crafted with care.</p>
      </footer>
    </div>
  );
}
