import { z } from 'zod'

export const acceptingMessageSchema = z.object({
    messages: z.boolean()
})