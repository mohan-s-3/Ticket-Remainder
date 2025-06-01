
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, Send, RotateCcw } from 'lucide-react';
import { chatWithBookingAssistant, ChatInput } from '@/ai/flows/chat-with-booking-assistant';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
}

const faqSuggestions = [
  "How many days in advance can I book a train ticket in India?",
  "What are the rules for Tatkal ticket booking?",
  "What is the refund policy if my train is delayed or cancelled?",
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text: messageText }]);
    setIsLoading(true);

    try {
      const aiInput: ChatInput = { userInput: messageText };
      const result = await chatWithBookingAssistant(aiInput);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'ai', text: result.response }]);
    } catch (error) {
      console.error("Error chatting with assistant:", error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'ai', text: "Sorry, I couldn't process your request at the moment. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const currentInput = input.trim();
    if (!currentInput) return;
    setInput('');
    await sendMessage(currentInput);
  };

  const handleFaqClick = async (suggestion: string) => {
    if (isLoading) return;
    setInput(''); 
    await sendMessage(suggestion);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setIsLoading(false); 
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Card className="shadow-lg h-full flex flex-col border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <Bot className="mr-2 h-5 w-5" /> AI Booking Assistant
          </CardTitle>
          <CardDescription className="text-xs">
            Ask about Indian rail travel.
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNewChat} aria-label="New Chat">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-hidden p-0">
        <ScrollArea className="h-0 flex-grow p-3 max-h-[350px]" ref={scrollAreaRef}> {/* Adjusted max-h and padding */}
          {messages.length === 0 && !isLoading && (
            <div className="mb-3 space-y-1.5">
              <p className="text-xs text-muted-foreground mb-1.5 px-1">
                Suggestions:
              </p>
              {faqSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-1.5 px-2 text-xs whitespace-normal text-muted-foreground hover:text-accent-foreground"
                  onClick={() => handleFaqClick(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <Avatar className="h-7 w-7">
                    <AvatarFallback><Bot size={16}/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-2.5 py-1.5 text-xs shadow-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground border border-border'
                  }`}
                >
                  {message.text}
                </div>
                {message.type === 'user' && (
                   <Avatar className="h-7 w-7">
                    <AvatarFallback><User size={16}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && messages.length > 0 && messages[messages.length -1].type === 'user' && (
              <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-7 w-7">
                   <AvatarFallback><Bot size={16}/></AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] rounded-lg px-2.5 py-1.5 text-xs bg-card text-card-foreground shadow-sm border border-border">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="border-t border-border p-3 flex items-center gap-2 bg-background">
          <Input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-grow h-9 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90 h-9 w-9 p-0">
            <Send className="h-3.5 w-3.5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
