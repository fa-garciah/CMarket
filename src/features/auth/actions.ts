"use server";

import { registerUser, resendVerificationEmail, checkUserVerified } from "@/server/services/userService";
import { RegisterInput, UpdateUserInput } from "@/types/auth.types";
import { updateUser } from "@/server/services/userService";
import { redirect } from "next/navigation";
import { auth, unstable_update } from "@/server/auth";

export async function registerUserAction(data: RegisterInput) {
    return registerUser(data);
}

export async function resendVerificationEmailAction(correo: string) {
    return resendVerificationEmail(correo);
}

export async function checkUserVerifiedAction(correo: string) {
    return checkUserVerified(correo);
}

export async function updateUserAction(data: UpdateUserInput) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const result = await updateUser(Number(session.user.id), data)
  if (result && 'error' in result) return { error: result.error }

  return { success: true, nombre: data.nombre, telefono: data.telefono }
}