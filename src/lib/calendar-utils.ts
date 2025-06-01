"use client"; // This file might be used in client components, marking it as client module.

import { format } from 'date-fns';

const formatDateForCalendar = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d{3}/g, '');
};

export function generateIcsFileContent(title: string, description: string, startTime: Date, endTime: Date): string {
  const eventStart = formatDateForCalendar(startTime);
  const eventEnd = formatDateForCalendar(endTime);
  const now = formatDateForCalendar(new Date());
  
  // UID should be unique
  const uid = `${now}-${Math.random().toString(36).substring(2)}@trainremainder.app`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TrainRemainderApp//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${eventStart}`,
    `DTEND:${eventEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`, // Escape newlines for ICS
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "TRIGGER:-PT15M", // 15 minutes before
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function generateGoogleCalendarLink(title: string, description: string, startTime: Date, endTime: Date): string {
  const eventStart = formatDateForCalendar(startTime);
  const eventEnd = formatDateForCalendar(endTime);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${eventStart}/${eventEnd}`,
    details: description,
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata', // Use local timezone or default
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookCalendarLink(title: string, description: string, startTime: Date, endTime: Date): string {
  // Outlook Web uses a different format for dates (YYYY-MM-DDTHH:mm:ss)
  const formatOutlookDate = (date: Date) => {
    // Ensure date is formatted to ISO string then slice, handling potential timezone issues locally.
    // For web links, UTC is often safer unless API specifies local.
    // Let's use a simplified ISO format without Z for web links, assuming Outlook handles it.
    const S = (n:number) => n < 10 ? '0'+n : n.toString();
    return `${date.getFullYear()}-${S(date.getMonth()+1)}-${S(date.getDate())}T${S(date.getHours())}:${S(date.getMinutes())}:${S(date.getSeconds())}`;
  }
  
  const eventStart = formatOutlookDate(startTime);
  const eventEnd = formatOutlookDate(endTime);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    startdt: eventStart,
    enddt: eventEnd,
    body: description,
    // location: '', // Optional location
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
