import { z } from "zod"

export const registerSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    password: z.string().min(6, { message: "Password must contain 6 char."})

})