"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn, getSession } from "next-auth/react";
import { checkUserVerifiedAction } from "@/features/auth/actions";
import Link from "next/link";
import { useState, Suspense } from "react";

type LoginFormValues = {
  email: string;
  password: string;
};

function LoginContent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const errorParam = searchParams.get("error");

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);

    const check = await checkUserVerifiedAction(data.email);
    if (check.status === "not-found") {
      setServerError("No existe una cuenta con ese correo");
      return;
    }

    if (check.status === "not-verified") {
      setServerError(
        "Tu cuenta no esta verificada. Te enviamos a verificacion de correo",
      );
      router.push(`/verificar-correo?email=${encodeURIComponent(data.email)}`);
      return;
    }

    const resp = await signIn("credentials", {
      correo: data.email,
      contrasena: data.password,
      redirect: false,
    });

    if (resp?.error) {
      if (resp.error === "no-verificado") {
        setServerError(
          "Tu cuenta no esta verificada. Te enviamos a verificacion de correo",
        );
        router.push(
          `/verificar-correo?email=${encodeURIComponent(data.email)}`,
        );
        return;
      }
      setServerError("Contrasena incorrecta");
    } else {
      const session = await getSession()
      if (session?.user.rolapp === "MASTER") {
        router.push("/master")
      } else {
        router.push("/")
      }
    }
  });

  return (
    <>
      <div className="relative w-full max-w-sm rounded-2xl bg-gray-100 px-8 py-8">
        {verified === "true" && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            ¡Cuenta verificada! Ya puedes iniciar sesión.
          </div>
        )}
        {errorParam === "token-expirado" && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            El link expiró. Solicita uno nuevo.
          </div>
        )}
        {errorParam === "token-invalido" && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            El link no es válido.
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Correo
            </label>
            <input
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "El correo es necesario",
                },
              })}
              placeholder="example@gmail.com"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "La contraseña es necesaria",
                },
              })}
              placeholder="••••••••"
              className="h-11 w-full rounded-full bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {(errors.email || errors.password || serverError) && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {errors.email?.message || errors.password?.message || serverError}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-full bg-violet-600 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-violet-700"
          >
            Acceso
          </button>
        </form>
      </div>

      <div className="relative flex gap-6 text-sm text-violet-600">
        <Link href="/register" className="hover:underline">
          ¿No tienes una cuenta?
        </Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
