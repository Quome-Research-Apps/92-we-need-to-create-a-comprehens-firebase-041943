'use server';

/**
 * @fileOverview Predicts the final grade in a course based on current grades and remaining assignment weights.
 *
 * - predictFinalGrade - A function that predicts the final grade.
 * - PredictFinalGradeInput - The input type for the predictFinalGrade function.
 * - PredictFinalGradeOutput - The return type for the predictFinalGrade function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFinalGradeInputSchema = z.object({
  currentGrade: z.number().describe('The current grade in the course (0-100).'),
  remainingWeight: z
    .number()
    .describe('The percentage weight of the remaining assignments (0-100).'),
  optimisticScenario: z
    .string()
    .describe(
      'Describe an optimistic scenario of effort applied to the remaining assignments.'
    ),
  pessimisticScenario: z
    .string()
    .describe(
      'Describe a pessimistic scenario of effort (or lack thereof) applied to the remaining assignments.'
    ),
});
export type PredictFinalGradeInput = z.infer<typeof PredictFinalGradeInputSchema>;

const PredictFinalGradeOutputSchema = z.object({
  optimisticPrediction: z
    .number()
    .describe(
      'The predicted final grade (0-100) based on the optimistic scenario.'
    ),
  pessimisticPrediction: z
    .number()
    .describe(
      'The predicted final grade (0-100) based on the pessimistic scenario.'
    ),
  advice: z
    .string()
    .describe(
      'Advice to the student, suggesting a course of action based on the predicted grades.'
    ),
});
export type PredictFinalGradeOutput = z.infer<typeof PredictFinalGradeOutputSchema>;

export async function predictFinalGrade(
  input: PredictFinalGradeInput
): Promise<PredictFinalGradeOutput> {
  return predictFinalGradeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFinalGradePrompt',
  input: {schema: PredictFinalGradeInputSchema},
  output: {schema: PredictFinalGradeOutputSchema},
  prompt: `You are a seasoned academic advisor, skilled at helping students understand their grades and plan for success.

  A student currently has a grade of {{currentGrade}} and {{remainingWeight}} percent of the grade remains.

  Here are two scenarios regarding the remaining {{remainingWeight}} percent of the grade, one optimistic and one pessimistic:

  Optimistic Scenario: {{optimisticScenario}}
  Pessimistic Scenario: {{pessimisticScenario}}

  Based on these scenarios, predict the student's final grade in both cases, and provide advice on what the student should do to achieve their desired outcome. Return the predicted grades as numbers between 0 and 100.
  `,
});

const predictFinalGradeFlow = ai.defineFlow(
  {
    name: 'predictFinalGradeFlow',
    inputSchema: PredictFinalGradeInputSchema,
    outputSchema: PredictFinalGradeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
