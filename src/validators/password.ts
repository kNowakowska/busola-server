import { z } from "zod";

export const password = () =>
  z
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .refine(
      (val) => /[A-Z]/.test(val),
      "Hasło musi zawierać co najmniej jedną wielką literę"
    )
    .refine(
      (val) => /[0-9]/.test(val),
      "Hasło musi zawierać co najmniej jedną cyfrę"
    )
    .refine(
      (val) => /[!@#$%^&*]/.test(val),
      "Hasło musi zawierać co najmniej jeden znak specjalny"
    );
