'use server';

/**
 * @fileOverview A flow that uses Genkit to summarize note content.
 *
 * - aiSummarizeNote - A function that handles the summarization of note content.
 * - AISummarizeNoteInput - The input type for the aiSummarizeNote function.
 * - AISummarizeNoteOutput - The return type for the aiSummarizeNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISummarizeNoteInputSchema = z.object({
  noteContent: z
    .string()
    .describe('The content of the note to be summarized.'),
});
export type AISummarizeNoteInput = z.infer<typeof AISummarizeNoteInputSchema>;

const AISummarizeNoteOutputSchema = z.object({
  summary: z
    .string()
    .describe('A short summary of the note content.'),
});
export type AISummarizeNoteOutput = z.infer<typeof AISummarizeNoteOutputSchema>;

export async function aiSummarizeNote(input: AISummarizeNoteInput): Promise<AISummarizeNoteOutput> {
  return aiSummarizeNoteFlow(input);
}

const summarizeNotePrompt = ai.definePrompt({
  name: 'summarizeNotePrompt',
  input: {schema: AISummarizeNoteInputSchema},
  output: {schema: AISummarizeNoteOutputSchema},
  prompt: `Summarize the following note content in a concise manner.\n\nNote Content: {{{noteContent}}}`,
});

const aiSummarizeNoteFlow = ai.defineFlow(
  {
    name: 'aiSummarizeNoteFlow',
    inputSchema: AISummarizeNoteInputSchema,
    outputSchema: AISummarizeNoteOutputSchema,
  },
  async input => {
    const {output} = await summarizeNotePrompt(input);
    return output!;
  }
);
