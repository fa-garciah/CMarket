'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react";
import { checkUserVerifiedAction } from "@/features/auth/actions";
import Link from "next/link";
import { useState, Suspense } from "react";


type LoginFormValues = {
  email: string,
  password: string
}

function LoginContent() {

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const errorParam = searchParams.get("error");

  const onSubmit = handleSubmit(async (data) =>{
    const check = await checkUserVerifiedAction(data.email);
    if (check.status === "not-verified") {
      router.push(`/verificar-correo?email=${encodeURIComponent(data.email)}`);
      return;
    }

    const resp = await signIn('credentials', {
      correo: data.email,
      contrasena: data.password,
      redirect: false
    });

    if (resp?.error) {
      if (resp.error === "no-verificado") {
        router.push(`/verificar-correo?email=${encodeURIComponent(data.email)}`);
        return;
      }
      setServerError("Correo o contraseña incorrectos");
    } else {
      router.push("/");
    }
  })

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_700px_at_20%_-10%,#8580a8_0%,#5c5878_45%,#44405b_100%)] px-4 py-8 sm:px-6 lg:px-12">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.35),transparent_44%)]" />

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/20 bg-[#231f39]/90 shadow-[0_40px_120px_rgba(10,10,30,0.45)] backdrop-blur md:grid-cols-[1.03fr_1fr]">
          <aside className="relative hidden min-h-[680px] p-6 md:flex md:flex-col">
            <div className="h-full rounded-2xl border border-white/10 bg-[#17142b]" />
          </aside>

          <div className="flex min-h-[680px] items-center p-6 sm:p-10 lg:p-12">
            <div className="w-full">
              <div className="mb-8">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Inicia sesion</h1>
                <p className="mt-3 text-sm text-slate-300">
                  ¿Aun no tienes cuenta? {" "}
                  <Link href="/register" className="font-semibold text-indigo-300 hover:text-indigo-200">
                    Registrate
                  </Link>
                </p>
              </div>

              {verified === "true" && (
                <div className="mb-4 rounded-xl border border-emerald-400/25 bg-emerald-500/12 p-3 text-sm font-medium text-emerald-200">
                  ¡Cuenta verificada! Ya puedes iniciar sesión.
                </div>
              )}
              {errorParam === "token-expirado" && (
                <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/12 p-3 text-sm font-medium text-rose-200">
                  El link expiró. Solicita uno nuevo.
                </div>
              )}
              {errorParam === "token-invalido" && (
                <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/12 p-3 text-sm font-medium text-rose-200">
                  El link no es válido.
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Correo institucional</label>
                  <input
                    type="email"
                    {...register("email", {
                      required: {
                        value: true,
                        message: "El correo institucional es necesario"
                      }
                    })}
                    placeholder="example@anahuac.mx"
                    className="h-12 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-300/70 focus:bg-white/12"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Contraseña</label>
                  <input
                    type="password"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "La contraseña es necesaria"
                      }
                    })}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-300/70 focus:bg-white/12"
                  />
                </div>

                {(errors.email || errors.password || serverError) && (
                  <div className="rounded-xl border border-rose-400/30 bg-rose-500/12 p-3 text-sm font-medium text-rose-200">
                    {errors.email?.message || errors.password?.message || serverError}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-2 h-12 w-full rounded-xl bg-indigo-500 font-semibold text-white transition hover:bg-indigo-400"
                >
                  Entrar
                </button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-white/15" />
                  <span className="text-xs text-slate-400">o</span>
                  <div className="h-px flex-1 bg-white/15" />
                </div>

                <Link
                  href="/register"
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Crear cuenta
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}