import z from "zod";

const correoSchema = z.string().email("Correo no válido");

export const registerSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    correo: correoSchema,
    telefono: z.string().min(7, "Teléfono no válido"),
    contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const updateUserSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
    telefono: z.string().min(7, "Teléfono no válido").optional(),
    contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;