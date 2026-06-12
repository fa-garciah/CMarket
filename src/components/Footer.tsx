export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#17142b]/95 py-10 px-6 shadow-[0_-18px_45px_rgba(10,10,30,0.25)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row">
        <div>
          <p className="text-xl font-black tracking-[0.26em] text-indigo-100">CMARKET</p>
          <p className="mt-2 text-sm text-slate-300">© 2026 Todos los derechos reservados.</p>
          <p className="text-sm text-slate-300/90">La plataforma oficial de intercambio para estudiantes de la Universidad Anáhuac Cancún.</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.25)] backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white">Soporte y contacto</p>
          <p className="mt-2 text-sm text-slate-300">Centro de ayuda y contacto</p>
          <p className="mt-3 text-base font-black text-indigo-200">📞 9988776644</p>
        </div>
      </div>
    </footer>
  )
}