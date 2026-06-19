import { prisma } from "@/server/db/db";
import { registerSchema, RegisterInput, UpdateUserInput, updateUserSchema } from "@/types/auth.types";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sendVerificationEmail } from "./emailService";
import z from "zod";

export async function registerUser(data: RegisterInput) {
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { nombre, telefono, contrasena } = parsed.data;
  const correo = parsed.data.correo.trim().toLowerCase();

  const exist = await prisma.usuario.findUnique({ where: { correo } });
  if (exist) return { error: "El correo ya esta registrado" };

  const hashedPassword = await bcrypt.hash(contrasena, 12);

  const verifytoken = randomUUID()
  const verifytokenexpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const saved = await prisma.usuario.create({
    data: {
      nombre,
      correo,
      telefono,
      contrasena: hashedPassword,
      fecharegistro: new Date(),
      isactive: 0,  
      verifytoken,
      verifytokenexpiry,
    },
  });

  await sendVerificationEmail(correo, verifytoken)

  return { id: saved.idusuario, correo: saved.correo };
}

export async function verifyEmail(token: string) {
  const usuario = await prisma.usuario.findFirst({ where: { verifytoken: token } })
  if (!usuario) return { error: "token-invalido" }
  if (!usuario.verifytokenexpiry || usuario.verifytokenexpiry < new Date()) return { error: "token-expirado" }
  
  await prisma.usuario.update({
    where: { idusuario: usuario.idusuario },
    data: { isactive: 1, verifytoken: null, verifytokenexpiry: null }
  })
  return { ok: true }
}

export async function resendVerificationEmail(correo: string) {
  const normalizedCorreo = correo.trim().toLowerCase()
  const usuario = await prisma.usuario.findUnique({ where: { correo: normalizedCorreo } })
  if (!usuario) return { error: "correo-no-encontrado" }
  if (usuario.isactive === 1) return { error: "ya-verificado" }
  
  const verifytoken = randomUUID()
  const verifytokenexpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.usuario.update({
    where: { correo: normalizedCorreo },
    data: { verifytoken, verifytokenexpiry }
  })

  await sendVerificationEmail(normalizedCorreo, verifytoken)
  return { ok: true }
}

export async function getUsersByEmail(correo: string) {
  return prisma.usuario.findUnique({ where: { correo: correo.trim().toLowerCase() } });
}

export async function checkUserVerified(correo: string) {
  const usuario = await prisma.usuario.findUnique({ where: { correo: correo.trim().toLowerCase() } })
  if (!usuario) return { status: "not-found" }
  if (usuario.isactive === 0) return { status: "not-verified" }
  return { status: "ok" }
}

export async function setUserPasswordHash(idusuario: number, plainPassword: string) {
  const hashedPassword = await bcrypt.hash(plainPassword, 12)
  await prisma.usuario.update({
    where: { idusuario },
    data: { contrasena: hashedPassword }
  })
}

export async function getUserById(id: number) {
  return prisma.usuario.findUnique({
    where: { idusuario: id },
    select: { nombre: true, telefono: true }
  })
}

export async function getAllUsuarios() {
  return prisma.usuario.findMany({
    select: {
      idusuario: true,
      nombre: true,
      correo: true,
      telefono: true,
      rolapp: true,
      isactive: true,
      fecharegistro: true,
      membresias: {
        select: {
          rol: true,
          estado: true,
          comunidad: { select: { nombre: true } },
        },
        where: { estado: "APROBADA" },
      },
    },
    orderBy: { fecharegistro: "desc" },
  })
}

export async function createUserByMaster(data: {
  nombre: string
  correo: string
  telefono: string
  contrasena: string
  rolapp?: "MASTER" | "USER"
}) {
  const correo = data.correo.trim().toLowerCase()
  const existe = await prisma.usuario.findUnique({ where: { correo } })
  if (existe) return { error: "El correo ya está registrado" }

  const hashedPassword = await bcrypt.hash(data.contrasena, 12)

  const usuario = await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      correo,
      telefono: data.telefono,
      contrasena: hashedPassword,
      rolapp: data.rolapp ?? "USER",
      isactive: 1,
    },
  })

  return { ok: true, id: usuario.idusuario }
}

export async function updateUser(id: number, data: UpdateUserInput) {
  const parsed = updateUserSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const updateData: any = {}

  if (parsed.data.nombre) updateData.nombre = parsed.data.nombre
  if (parsed.data.telefono) updateData.telefono = parsed.data.telefono
  if (parsed.data.contrasena) updateData.contrasena = await bcrypt.hash(parsed.data.contrasena, 12)
  if ((parsed.data as any).rolapp) updateData.rolapp = (parsed.data as any).rolapp
  if ((parsed.data as any).isactive !== undefined) updateData.isactive = (parsed.data as any).isactive

  if (Object.keys(updateData).length === 0) {
    return { error: "No hay cambios que guardar" }
  }

  await prisma.usuario.update({
    where: { idusuario: id },
    data: updateData
  })

  return { ok: true }
}