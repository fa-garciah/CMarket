'use client'

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

    const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterFormValues>();
    const [serverError, setServerError] = useState<string | undefined>(undefined);
    const router = useRouter();

    const onSubmitHandler = handleSubmit(async (data) => {

        const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();


        const resJSON = await registerUserAction({
            nombre: fullName,
            correo: data.email,
            telefono: data.tel,
            contrasena: data.password
        });

        if ('error' in resJSON) {
            setServerError(resJSON.error);
            reset();
            return;
        }
        router.push(`/verificar-correo?email=${encodeURIComponent(data.email)}`)
    });

    return (
        <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_700px_at_20%_-10%,#8580a8_0%,#5c5878_45%,#44405b_100%)] px-4 py-8 sm:px-6 lg:px-12">
            <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.35),transparent_44%)]" />

            <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-[28px] border border-white/20 bg-[#231f39]/90 shadow-[0_40px_120px_rgba(10,10,30,0.45)] backdrop-blur md:grid-cols-[1.03fr_1fr]">
                    <aside className="relative hidden min-h-[700px] p-6 md:flex md:flex-col">
                        <div className="h-full rounded-2xl border border-white/10 bg-[#17142b]" />
                    </aside>

                    <div className="flex min-h-[700px] items-center p-6 sm:p-10 lg:p-12">
                        <div className="w-full">
                            <div className="mb-8">
                                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Crea una cuenta</h1>
                                <p className="mt-3 text-sm text-slate-300">
                                    ¿Ya tienes cuenta? {" "}
                                    <Link href="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
                                        Inicia sesion
                                    </Link>
                                </p>
                            </div>

                            <form onSubmit={onSubmitHandler} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">Nombre</label>
                                        <input
                                            type="text"
                                            {...register("firstName", {
                                                required: {
                                                    value: true,
                                                    message: "El nombre es necesario"
                                                }
                                            })}
                                            placeholder="Francisco"
                                            className="h-12 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-300/70 focus:bg-white/12"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-200">Apellido</label>
                                        <input
                                            type="text"
                                            {...register("lastName", {
                                                required: {
                                                    value: true,
                                                    message: "El apellido es necesario"
                                                }
                                            })}
                                            placeholder="Garcia"
                                            className="h-12 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-300/70 focus:bg-white/12"
                                        />
                                    </div>
                                </div>

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
                                        placeholder="nombre.apellido@anahuac.mx"
                                        className="h-12 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-300/70 focus:bg-white/12"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">Telefono</label>
                                    <input
                                        type="tel"
                                        {...register("tel", {
                                            required: {
                                                value: true,
                                                message: "El telefono es necesario"
                                            }
                                        })}
                                        placeholder="9981234567"
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

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-200">Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        {...register("passwordConfirm", {
                                            required: {
                                                value: true,
                                                message: "Debes confirmar la contraseña"
                                            },
                                            validate: (
                                                value,
                                                formValue) =>
                                                value === formValue.password || "Las contraseñas no coinciden"
                                        })}
                                        placeholder="••••••••"
                                        className="h-12 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-300/70 focus:bg-white/12"
                                    />
                                </div>

                                {(errors.firstName || errors.lastName || errors.email || errors.tel || errors.password || errors.passwordConfirm || serverError) && (
                                    <div className="rounded-xl border border-rose-400/30 bg-rose-500/12 p-3 text-sm font-medium text-rose-200">
                                        {errors.firstName?.message || errors.lastName?.message || errors.email?.message || errors.tel?.message || errors.password?.message || errors.passwordConfirm?.message || serverError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="mt-2 h-12 w-full rounded-xl bg-indigo-500 font-semibold text-white transition hover:bg-indigo-400"
                                >
                                    Crear cuenta
                                </button>

                                <div className="flex items-center gap-4 py-2">
                                    <div className="h-px flex-1 bg-white/15" />
                                    <span className="text-xs text-slate-400">o</span>
                                    <div className="h-px flex-1 bg-white/15" />
                                </div>

                                <Link
                                    href="/login"
                                    className="flex h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                                >
                                    Iniciar sesion
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
