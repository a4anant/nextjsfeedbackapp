import { z } from 'zod'

export const verifySchema = z.object({
    code: z
            .string()
            .min(6, {message: 'Verify code must be between 6 and 100 characters!'})
            .max(100, {message: 'Verify code must be between 6 and 100 characters!'})
})