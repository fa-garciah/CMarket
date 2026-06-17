"use client";

import { useRef } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["700"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mainRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    mainRef.current.style.setProperty(
      "--mx",
      `${((e.clientX - rect.left) / rect.width) * 100}%`,
    );
    mainRef.current.style.setProperty(
      "--my",
      `${((e.clientY - rect.top) / rect.height) * 100}%`,
    );
  };

  return (
    <main
      ref={mainRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-white flex flex-col items-center justify-center gap-6 px-4 py-8"
    >
      <style>{`
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate(0, 0) scale(1); }
          33%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: translate(18px, -22px) scale(1.06); }
          66%       { border-radius: 50% 60% 30% 60% / 30% 40% 70% 50%; transform: translate(-12px, 12px) scale(0.96); }
        }
        .blob-1 { animation: blob 9s ease-in-out infinite; }
        .blob-2 { animation: blob 12s ease-in-out infinite 3s reverse; }
        .blob-3 { animation: blob 10s ease-in-out infinite 1.5s; }
        .spotlight { background: radial-gradient(480px circle at var(--mx, 50%) var(--my, 50%), rgba(139,92,246,0.10), transparent 65%); }
      `}</style>

      <div className="blob-1 pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full bg-violet-200 opacity-60" />
      <div className="blob-2 pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-300 opacity-40" />
      <div className="blob-3 pointer-events-none absolute top-1/2 -right-20 h-56 w-56 rounded-full bg-violet-100 opacity-50" />
      <div className="spotlight pointer-events-none absolute inset-0" />

      <h1
        className={`${plusJakarta.className} relative text-4xl font-bold text-violet-600`}
      >
        CMarket
      </h1>

      {children}
    </main>
  );
}
