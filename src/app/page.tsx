
"use client";

import { useState, useEffect, useCallback } from 'react';
import DateSelector from '@/components/date-selector';
import BookingDetailsActions from '@/components/booking-details-actions';
import BookingTimeline from '@/components/booking-timeline';
import ChatAssistant from '@/components/chat-assistant';
import { Train, Bot } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

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
        <div className="flex flex-col items-center justify-center md:flex-row md:items-center mb-4">
          <Train className="h-10 w-10 text-primary mb-2 md:mb-0 md:h-12 md:w-12 md:mr-3" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary text-center md:text-left">
            IRCTC Book My Train – 60 Days
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          Never miss your train ticket booking again!
        </p>
      </header>

      <main className="w-full max-w-4xl">
        <div className="space-y-6">
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
      </main>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl md:w-auto md:h-auto md:px-6 md:py-3 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground text-lg z-40 hidden"
            aria-label="Ask AI"
          >
            <Bot className="h-6 w-6 md:mr-2" />
            <span className="hidden md:inline">Ask AI</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-[350px] md:w-[400px] p-0 mr-1 mb-2 border-border shadow-xl rounded-lg"
        >
          <ChatAssistant />
        </PopoverContent>
      </Popover>

      <footer className="w-full max-w-4xl mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Train Ticket Reminder. Crafted with care.</p>
      </footer>
    </div>
  );
}
