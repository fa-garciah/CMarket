export default function Footer() {
  return (
    <footer className="bg-gray-900 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <p className="text-[#FF6B00] font-black text-xl">CMARKET</p>
          <p className="text-gray-400 text-sm mt-2">© 2026 Todos los derechos reservados.</p>
          <p className="text-gray-400 text-sm">La plataforma oficial de intercambio para estudiantes de la Universidad Anáhuac Cancún.</p>
        </div>
        <div>
          <p className="text-white font-bold">SOPORTE Y CONTACTO</p>
          <p className="text-gray-400 text-sm mt-2">Centro de ayuda y contacto</p>
          <p className="text-[#FF6B00] font-bold mt-1">📞 9988776644</p>
        </div>
      </div>
    </footer>
  )
}