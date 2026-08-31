import { z } from 'zod';
import { EXECUTABLE_LANGUAGES } from '../types/models.js';

export const aiCodeOnlySchema = z.object({
  language: z.enum(EXECUTABLE_LANGUAGES),
  code: z.string().min(1).max(100_000),
});

export const aiLearningQuestionSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty').max(2000),
  language: z.enum(EXECUTABLE_LANGUAGES).optional(),
  code: z.string().max(100_000).optional(),
});

export const aiGenerateSchema = z.object({
  language: z.enum(EXECUTABLE_LANGUAGES),
  prompt: z.string().min(1, 'Prompt cannot be empty').max(8000),
});

export type AiCodeOnlyInput = z.infer<typeof aiCodeOnlySchema>;
export type AiLearningQuestionInput = z.infer<typeof aiLearningQuestionSchema>;
export type AiGenerateInput = z.infer<typeof aiGenerateSchema>;
