import { z } from "zod";

const baseRegistrationSchema = z.object({
  role: z.enum(["client", "affiliate"]),
  username: z.string().trim().min(1, "Username is required."),
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  confirmPassword: z.string().min(1, "Confirm password is required."),
  serviceName: z.string().trim().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

export const registrationSubmissionSchema = baseRegistrationSchema
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "the password does not match",
      });
    }

    if (values.role === "affiliate") {
      if (!values.serviceName?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["serviceName"],
          message: "Service name is required.",
        });
      }

      if (!values.address?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Address is required.",
        });
      }

      if (!values.phone?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Phone number is required.",
        });
      }
    }
  })
  .transform((values) => ({
    ...values,
    username: values.username.trim(),
    email: values.email.trim(),
    serviceName: values.serviceName?.trim() ?? "",
    address: values.address?.trim() ?? "",
    phone: values.phone?.trim() ?? "",
  }));

export type RegistrationFormValues = z.input<typeof registrationSubmissionSchema>;
export type RegistrationSubmission = z.output<typeof registrationSubmissionSchema>;
