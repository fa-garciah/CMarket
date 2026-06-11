'use client'

import { resendVerificationEmailAction } from "@/features/auth/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function VerificarCorreoContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";
    const [status, setStatus] = useState<"idle" | "enviando" | "enviado" | "error">("idle");

    async function handleReenviar() {
        setStatus("enviando");
        const result = await resendVerificationEmailAction(email);
        if ("error" in result) {
            setStatus("error");
        } else {
            setStatus("enviado");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <header className="py-10 bg-[#FF6B00] text-white text-center shadow-lg">
                <h1 className="text-4xl font-black tracking-tight">CMARKET</h1>
                <p className="mt-2 text-orange-100 font-medium">VERIFICACIÓN</p>
            </header>

            <main className="flex-grow flex items-center justify-center p-6 bg-gray-700">
                <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 text-center">
                    <div className="text-6xl mb-6">📧</div>
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-3">Verifica tu correo</h2>
                    <p className="text-gray-500 mb-2">
                        Te enviamos un link de verificación a:
                    </p>
                    <p className="font-bold text-[#FF6B00] mb-6">{email}</p>
                    <p className="text-gray-400 text-sm mb-8">
                        Revisa tu bandeja de entrada y haz click en el link para activar tu cuenta. El link expira en 24 horas.
                    </p>

                    {status === "enviado" && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-semibold border border-green-100 mb-4">
                            ¡Correo reenviado exitosamente!
                        </div>
                    )}
                    {status === "error" && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100 mb-4">
                            No se pudo reenviar el correo. Intenta de nuevo.
                        </div>
                    )}

                    <button
                        onClick={handleReenviar}
                        disabled={status === "enviando" || status === "enviado"}
                        className="w-full py-4 bg-[#FF6B00] hover:bg-[#e66000] disabled:bg-orange-300 text-white font-black rounded-xl transition-all mb-4"
                    >
                        {status === "enviando" ? "ENVIANDO..." : "REENVIAR CORREO"}
                    </button>

                    <Link
                        href="/login"
                        className="w-full block py-4 bg-white border-2 border-gray-200 hover:border-[#FF6B00] text-gray-700 font-bold rounded-xl text-center transition-all"
                    >
                        VOLVER AL LOGIN
                    </Link>
                </div>
            </main>
            
            <footer className="py-8 text-center bg-[#FF6B00] ">
                <p className="text-sm font-medium text-white">
                    © 2026 CMarket - Universidad Anáhuac Cancún
                </p>
            </footer>
        </div>

    );
}

export default function VerificarCorreoPage() {
  return (
    <Suspense>
      <VerificarCorreoContent />
    </Suspense>
  );
}
