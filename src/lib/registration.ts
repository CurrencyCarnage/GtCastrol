import { z } from "zod";

const optionalCoordinateSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : value;
  }

  return value;
}, z.number().finite().optional());

const baseRegistrationSchema = z.object({
  role: z.enum(["client", "affiliate"]),
  username: z.string().trim().min(1, "Username is required."),
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  confirmPassword: z.string().min(1, "Confirm password is required."),
  serviceName: z.string().trim().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  googlePlaceId: z.string().trim().optional(),
  latitude: optionalCoordinateSchema,
  longitude: optionalCoordinateSchema,
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

      if (!Number.isFinite(values.latitude) || !Number.isFinite(values.longitude)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Choose your location on the map so we can guide nearby customers to your service.",
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
    googlePlaceId: values.googlePlaceId?.trim() ?? "",
    latitude: values.latitude,
    longitude: values.longitude,
  }));

export type RegistrationFormValues = z.input<typeof registrationSubmissionSchema>;
export type RegistrationSubmission = z.output<typeof registrationSubmissionSchema>;
