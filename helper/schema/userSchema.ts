import { z } from 'zod';

const userSignupSchema = z.object({
    fullname: z.string().min(1, { message: "Full name is required" }),
    contact: z.string().min(10, { message: "Contact number must be at least 10 digits" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    role: z.enum(['staff', 'client'], { message: "Role is required" }) 
});

export default userSignupSchema;
