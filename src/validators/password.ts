import { z } from "zod";

export const password = () =>
  z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (val) => /[A-Z]/.test(val),
      "Password must contain at least one uppercase letter"
    )
    .refine(
      (val) => /[0-9]/.test(val),
      "Password must contain at least one number"
    )
    .refine(
      (val) => /[!@#$%^&*]/.test(val),
      "Password must contain at least one special character"
    );
