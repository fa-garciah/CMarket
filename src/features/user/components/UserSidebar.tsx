"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, Package, PlusCircle, User, Pencil, LogOut, Menu, X, ShoppingBag, ArrowLeftRight } from "lucide-react"
import { useState } from "react"
import { signOut } from "next-auth/react"

const navItems = [
  { label: "Inicio", href: "/", icon: Home, exact: true },
  { label: "Mis Comunidades", href: "/mis-comunidades", icon: Building2, exact: false },
  { label: "Mis Productos", href: "/profile", icon: Package, exact: false },
  { label: "Transacciones", href: "/transacciones", icon: ArrowLeftRight, exact: false },
  { label: "Publicar Producto", href: "/agregar-producto", icon: PlusCircle, exact: false },
]

const bottomItems = (userId: string) => [
  { label: "Mi Perfil", href: "/profile", icon: User },
  { label: "Editar Perfil", href: `/editar-perfil/${userId}`, icon: Pencil },
]

function NavBody({
  userId,
  nombre,
  onClose,
}: {
  userId: string
  nombre: string
  onClose?: () => void
}) {
  const pathname = usePathname()

  const linkClass = (href: string, exact?: boolean) => {
    const active = exact ? pathname === href : pathname.startsWith(href)
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active
        ? "bg-violet-50 text-violet-700 border border-violet-100"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`
  }

  return (
    <>
      {/* User chip */}
      <div className="mx-3 mb-2 mt-4 rounded-xl bg-gray-100 border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-sm font-bold text-violet-700 shrink-0">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{nombre}</p>
            <p className="text-xs text-gray-400 truncate">Miembro</p>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Mercado</p>
        {navItems.map(({ label, href, icon: Icon, exact }) => (
          <Link key={href} href={href} onClick={onClose} className={linkClass(href, exact)}>
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-gray-200 space-y-1">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Cuenta</p>
        {bottomItems(userId).map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} onClick={onClose} className={linkClass(href)}>
            <Icon size={17} />
            {label}
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </>
  )
}

export default function UserSidebar({ nombre, userId }: { nombre: string; userId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 overflow-y-auto bg-white border-r border-gray-200 shrink-0">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2">
          <ShoppingBag size={20} className="text-violet-600" />
          <div>
            <span className="text-lg font-bold text-gray-900">CMarket</span>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-0.5">Mercado</p>
          </div>
        </div>
        <NavBody userId={userId} nombre={nombre} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <ShoppingBag size={18} className="text-violet-600" />
        <span className="text-base font-bold text-gray-900">CMarket</span>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 w-72 h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-violet-600" />
            <span className="text-lg font-bold text-gray-900">CMarket</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <NavBody userId={userId} nombre={nombre} onClose={() => setOpen(false)} />
      </aside>
    </>
  )
}
