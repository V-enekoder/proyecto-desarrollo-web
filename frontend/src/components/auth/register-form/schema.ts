import * as z from "zod";

export const registerSchema = z
  .object({
    username: z
      .string({ error: "El nombre de usuario es requerido" })
      .nonempty({ error: "El nombre de usuario es requerido" }),
    name: z
      .string({ error: "El nombre es requerido" })
      .nonempty({ error: "El nombre es requerido" }),
    email: z.email({ error: "Correo electrónico inválido" }),
    password: z
      .string({ error: "La contraseña es requerida" })
      .min(6, { error: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z.string({ error: "Confirma la contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });
