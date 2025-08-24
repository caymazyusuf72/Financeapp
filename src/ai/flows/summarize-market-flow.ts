'use server';
/**
 * @fileOverview A market analysis AI agent.
 *
 * - summarizeMarket - A function that handles the market summarization process.
 * - SummarizeMarketInput - The input type for the summarizeMarket function.
 * - SummarizeMarketOutput - The return type for the summarizeMarket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {Asset} from '@/lib/types';

const SummarizeMarketInputSchema = z.object({
  assets: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      symbol: z.string(),
      price: z.number(),
      change24h: z.number(),
      type: z.enum(['currency', 'crypto', 'stock', 'metal']),
      iconUrl: z.string().optional(),
    })
  ),
});
export type SummarizeMarketInput = z.infer<typeof SummarizeMarketInputSchema>;

export type SummarizeMarketOutput = string;

export async function summarizeMarket(
  input: SummarizeMarketInput
): Promise<SummarizeMarketOutput> {
  return summarizeMarketFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMarketPrompt',
  input: {schema: SummarizeMarketInputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are a financial analyst providing a brief, insightful summary of the current market state based on the provided data.
The data includes currencies, precious metals, cryptocurrencies, and stock indices.

Analyze the data and provide a short (2-3 sentences) summary of the overall market trends.
- Highlight the best and worst performing asset categories if there are any notable standouts.
- Mention any significant movements in major assets (e.g., Bitcoin, Gold, major indices).
- Keep the tone neutral and informative.

Do not just list the data. Provide a high-level, synthesized analysis.

Here is the data:
{{#each assets}}
- {{name}} ({{symbol}}), Type: {{type}}, Price: {{price}}, 24h Change: {{change24h}}%
{{/each}}
`,
});

const summarizeMarketFlow = ai.defineFlow(
  {
    name: 'summarizeMarketFlow',
    inputSchema: SummarizeMarketInputSchema,
    outputSchema: z.string(),
  },
  async (input: SummarizeMarketInput) => {
    const {output} = await prompt(input);
    return output ?? '';
  }
);
