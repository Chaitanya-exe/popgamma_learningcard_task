import {z} from 'zod';

export const LearningCardRequest = z.object({
    board: z.enum(["CBSE", "ICSE", "IB"]),
    grade: z.number().min(1).max(12),
    concept: z.string()
})

export type validatedSchema = z.infer<typeof LearningCardRequest>

export const LearningCardResponse = z.object({
    title: z.string(),
    description: z.string(),
    concept: z.string(),
    latex: z.string()
})

export type validatedLLMResponse = z.infer<typeof LearningCardResponse>

export interface ApiResponse<T> {
    success: boolean;
    data?: T,
    error?: {
        code: string;
        message: string;
    }
}

export const svgResponse = z.object({
    title: z.string(),
    svgContent: z.string(),
    description: z.string()
})
export type validatedSvg = z.infer<typeof svgResponse>