import z from "zod";

const correoSchema = z.string().email("Correo no válido");

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "Debe contener al menos un número");

export const registerSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    correo: correoSchema,
    telefono: z.string().min(7, "Teléfono no válido"),
    contrasena: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const updateUserSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
    telefono: z.string().min(7, "Teléfono no válido").optional(),
    contrasena: passwordSchema.optional(),
});

export const updateUserAdminSchema = updateUserSchema.extend({
    rolapp: z.enum(["MASTER", "USER"]).optional(),
    isactive: z.number().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;