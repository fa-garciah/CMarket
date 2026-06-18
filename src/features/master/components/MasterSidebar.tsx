"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, Users, UserCircle, Settings } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/master", icon: LayoutDashboard, exact: true },
  { label: "Comunidades", href: "/master/comunidades", icon: Building2, exact: false },
  { label: "Usuarios", href: "/master/usuarios", icon: Users, exact: false },
]

const bottomItems = [
  { label: "Mi Perfil", href: "/master/perfil", icon: UserCircle },
  { label: "Configuración", href: "/master/configuracion", icon: Settings },
]

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-white/20 text-white"
          : "text-violet-100 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  )
}

export default function MasterSidebar({ nombre }: { nombre: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen flex flex-col bg-violet-700 shrink-0">
      <div className="px-6 py-5 border-b border-white/20">
        <span className="text-xl font-bold text-white">CMarket</span>
        <p className="text-xs text-violet-200 mt-0.5 uppercase tracking-widest">Panel Master</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon, exact }) => (
          <NavLink
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={exact ? pathname === href : pathname.startsWith(href)}
          />
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-white/20 pt-4 space-y-1">
        {bottomItems.map(({ label, href, icon }) => (
          <NavLink
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={pathname.startsWith(href)}
          />
        ))}
        <div className="px-3 pt-3 mt-1">
          <p className="text-xs text-violet-300">Conectado como</p>
          <p className="text-sm font-medium text-white truncate">{nombre}</p>
        </div>
      </div>
    </aside>
  )
}
