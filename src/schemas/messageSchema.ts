import { z } from 'zod'

export const messaegeSchema = z.object({
    content: z
        .string()
        .min(10, {message: "Minumum 10 characters required!"})
        .max(300, {message: "Maximum 300 characters are allowed!"})

})