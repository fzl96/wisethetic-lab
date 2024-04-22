import * as z from "zod";

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const SigninSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const SignupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Mimimum 6 characters required",
  }),
  confirmPassword: z.string().min(6, {
    message: "Mimimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Mimimum 6 characters required",
  }),
  confirmPassword: z.string().min(1, {
    message: "Confirm password is required",
  }),
});
