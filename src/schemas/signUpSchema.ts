import { z } from 'zod';

export const usernameValitdation = z
    .string()
    .min(2, "Username length must be between 2 and 20 characters!")
    .max(20, "Username length must be between 2 and 20 characters!")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain any special character!")


export const signUpSchema = z.object({
    username: usernameValitdation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: 'Password must be of minumum 6 character length!'})
})