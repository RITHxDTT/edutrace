import z from 'zod'

export const loginFormSchema = z.object({
    email: z.email({ message: 'Please enter a valid email' }).trim(),
    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
            {
                message:
                    "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number, and special character (#@$!%*?&)",
            }
        ),
})