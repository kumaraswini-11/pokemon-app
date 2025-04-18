import {z} from "zod";

const email = z.string().email({message: "Please enter a valid email."}).toLowerCase().trim();

const password = z
  .string()
  .min(6, {
    message: "Password must be at least 6 characters.",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[0-9]/, {message: "Contain at least one number."})
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: "Password must contain at least one special character.",
  });

export const signUpFormSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}).trim(),
  email,
  password,
  provider: z.string().optional(),
  // confirmPassword: z.string().min(6, {message: "Confirm password is required"}),
});
// .refine(data => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });
export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
  email,
  password,
});
export type SignInFormValues = z.infer<typeof signInFormSchema>;
