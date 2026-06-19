"use client";

import { registerUserAction } from "@/features/auth/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  tel: string;
  password: string;
  passwordConfirm: string;
};

const registerFormSchema = z
  .object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Correo no válido"),
    tel: z.string().min(7, "Teléfono no válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    passwordConfirm: z.string().min(1, "Debes confirmar la contrasena"),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.passwordConfirm) {
      ctx.addIssue({
        path: ["passwordConfirm"],
        code: z.ZodIssueCode.custom,
        message: "Las contrasenas no coinciden",
      });
    }
  });

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
  });
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const router = useRouter();

  const onSubmitHandler = handleSubmit(async (data) => {
    const fullName = (
      data.firstName.trim() +
      " " +
      data.lastName.trim()
    ).trim();

    const resJSON = await registerUserAction({
      nombre: fullName,
      correo: data.email,
      telefono: data.tel,
      contrasena: data.password,
    });

    if ("error" in resJSON) {
      setServerError(resJSON.error);
      return;
    }
    router.push("/verificar-correo?email=" + encodeURIComponent(data.email));
  });

  return (
    <>
      <div className="relative w-full max-w-sm rounded-2xl bg-gray-100 px-8 py-8">
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Nombre *
              </label>
              <input
                type="text"
                {...register("firstName")}
                placeholder="Francisco"
                className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Apellido *
              </label>
              <input
                type="text"
                {...register("lastName")}
                placeholder="Garcia"
                className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Correo institucional *
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="nombre.apellido@anahuac.mx"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Telefono *
            </label>
            <input
              type="tel"
              {...register("tel")}
              placeholder="9981234567"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
            {errors.tel && (
              <p className="mt-2 text-sm text-red-600">{errors.tel.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Contrasena *
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="........"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.
            </p>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirmar contrasena *
            </label>
            <input
              type="password"
              {...register("passwordConfirm")}
              placeholder="........"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
            {errors.passwordConfirm && (
              <p className="mt-2 text-sm text-red-600">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-full bg-violet-600 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-violet-700"
          >
            Crear cuenta
          </button>
        </form>
      </div>

      <div className="relative flex gap-6 text-sm text-violet-600">
        <Link href="/login" className="hover:underline">
          Ya tienes una cuenta? Inicia sesion
        </Link>
      </div>
    </>
  );
}
