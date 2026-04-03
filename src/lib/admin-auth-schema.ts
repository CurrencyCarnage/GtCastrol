import { z } from "zod";

const adminRegistrationBaseSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  confirmPassword: z.string().min(1, "Confirm password is required."),
});

export const adminRegistrationSchema = adminRegistrationBaseSchema
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "the password does not match",
      });
    }
  })
  .transform((values) => ({
    ...values,
    username: values.username.trim(),
    email: values.email.trim().toLowerCase(),
  }));

export const adminLoginSchema = z.object({
  identifier: z.string().trim().min(1, "Username or email is required."),
  password: z.string().min(1, "Password is required."),
});

export type AdminRegistrationFormValues = z.input<typeof adminRegistrationSchema>;
export type AdminRegistrationSubmission = z.output<typeof adminRegistrationSchema>;
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
