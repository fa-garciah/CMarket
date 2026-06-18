"use client";

import { resendVerificationEmailAction } from "@/features/auth/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function VerificarCorreoContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [status, setStatus] = useState<
    "idle" | "enviando" | "enviado" | "error"
  >("idle");

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
    <>
      <div className="relative w-full max-w-sm rounded-2xl bg-gray-100 px-8 py-8 text-center">
        <div className="mb-4 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-violet-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h2 className="mb-1 text-lg font-bold text-gray-800">
          Verifica tu correo
        </h2>
        <p className="mb-1 text-sm text-gray-500">
          Te enviamos un link de verificación a:
        </p>
        <p className="mb-4 text-sm font-bold text-violet-600">{email}</p>
        <p className="mb-6 text-xs text-gray-400">
          Revisa tu bandeja de entrada y haz clic en el link para activar tu
          cuenta. El link expira en 24 horas.
        </p>

        {status === "enviado" && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            ¡Correo reenviado exitosamente!
          </div>
        )}
        {status === "error" && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            No se pudo reenviar el correo. Intenta de nuevo.
          </div>
        )}

        <button
          onClick={handleReenviar}
          disabled={status === "enviando" || status === "enviado"}
          className="mt-2 h-12 w-full rounded-full bg-violet-600 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-violet-700 disabled:bg-violet-300"
        >
          {status === "enviando" ? "Enviando..." : "Reenviar correo"}
        </button>
      </div>

      <div className="relative flex gap-6 text-sm text-violet-600">
        <Link href="/login" className="hover:underline">
          Volver al login
        </Link>
      </div>
    </>
  );
}

export default function VerificarCorreoPage() {
  return (
    <Suspense>
      <VerificarCorreoContent />
    </Suspense>
  );
}
