import z from 'zod'

export const loginFormSchema = z.object({
    email: z.email({ message: 'Please enter a valid email' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Password need to be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
})