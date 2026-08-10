import { z } from "zod";

export const createDeveloperInputSchema = z.object({
  firstName: z.string().min(1).max(50).describe("The first name of the developer"),
  lastName: z.string().min(1).max(50).describe("The last name of the developer"),
  email: z.string().email().describe("The email address of the developer"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(128)
    .describe("The password of the developer"),
});

export const loginDeveloperInputSchema = z.object({
  email: z.string().email().describe("The email address of the developer"),
  password: z.string().describe("The password of the developer"),
});

export type CreateDeveloperInput = z.infer<typeof createDeveloperInputSchema>;
export type LoginDeveloperInput = z.infer<typeof loginDeveloperInputSchema>;
