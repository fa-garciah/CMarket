"use client";

import { registerUserAction } from "@/features/auth/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  tel: string;
  password: string;
  passwordConfirm: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>();
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
      reset();
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
                {...register("firstName", {
                  required: { value: true, message: "El nombre es necesario" },
                })}
                placeholder="Francisco"
                className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Apellido *
              </label>
              <input
                type="text"
                {...register("lastName", {
                  required: {
                    value: true,
                    message: "El apellido es necesario",
                  },
                })}
                placeholder="Garcia"
                className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Correo institucional *
            </label>
            <input
              type="email"
              {...register("email", {
                required: { value: true, message: "El correo es necesario" },
              })}
              placeholder="nombre.apellido@anahuac.mx"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Telefono *
            </label>
            <input
              type="tel"
              {...register("tel", {
                required: { value: true, message: "El telefono es necesario" },
              })}
              placeholder="9981234567"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Contrasena *
            </label>
            <input
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "La contrasena es necesaria",
                },
              })}
              placeholder="........"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirmar contrasena *
            </label>
            <input
              type="password"
              {...register("passwordConfirm", {
                required: {
                  value: true,
                  message: "Debes confirmar la contrasena",
                },
                validate: (value, formValue) =>
                  value === formValue.password ||
                  "Las contrasenas no coinciden",
              })}
              placeholder="........"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {(errors.firstName ||
            errors.lastName ||
            errors.email ||
            errors.tel ||
            errors.password ||
            errors.passwordConfirm ||
            serverError) && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {errors.firstName?.message ||
                errors.lastName?.message ||
                errors.email?.message ||
                errors.tel?.message ||
                errors.password?.message ||
                errors.passwordConfirm?.message ||
                serverError}
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
