// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI booking assistant for Indian rail travel.
 *
 * - chatWithBookingAssistant - A function that handles the conversation with the AI assistant.
 * - ChatInput - The input type for the chatWithBookingAssistant function.
 * - ChatOutput - The return type for the chatWithBookingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  userInput: z
    .string()
    .describe(
      'The user input question regarding dates and deadlines for Indian rail travel.'
    ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z
    .string()
    .describe(
      'The response from the AI booking assistant, answering the user question.'
    ),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chatWithBookingAssistant(input: ChatInput): Promise<ChatOutput> {
  return chatWithBookingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithBookingAssistantPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are an AI booking assistant specializing in Indian rail travel.

You will answer user questions regarding dates and deadlines related to Indian rail travel.

User question: {{{userInput}}}`,
});

const chatWithBookingAssistantFlow = ai.defineFlow(
  {
    name: 'chatWithBookingAssistantFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
