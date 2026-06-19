"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Building2, Users, UserCircle, Menu, X, LogOut } from "lucide-react"

type SidebarItem = {
  label: string
  href?: string
  icon: React.ElementType
  exact?: boolean
  action?: () => void
}

const navItems: SidebarItem[] = [
  { label: "Dashboard", href: "/master", icon: LayoutDashboard, exact: true },
  { label: "Comunidades", href: "/master/comunidades", icon: Building2, exact: false },
  { label: "Usuarios", href: "/master/usuarios", icon: Users, exact: false },
]

const bottomItems: SidebarItem[] = [
  { label: "Mi Perfil", href: "/master/perfil", icon: UserCircle },
  {
    label: "Cerrar sesión",
    icon: LogOut,
    action: () => signOut({ callbackUrl: "/login" }),
  },
]

const mobileMenuItems: SidebarItem[] = [...navItems, ...bottomItems]

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  action,
}: {
  href?: string
  icon: React.ElementType
  label: string
  active: boolean
  action?: () => void
}) {
  if (action) {
    return (
      <button
        type="button"
        onClick={action}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
          active
            ? "bg-white/20 text-white"
            : "text-violet-100 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon size={18} />
        {label}
      </button>
    )
  }

  return (
    <Link
      href={href ?? "#"}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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
  const [open, setOpen] = useState(false)

  return (
    <aside className="w-full md:w-60 md:min-h-screen flex flex-col bg-violet-700 text-white md:shrink-0">
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-white/20 md:block">
        <div>
          <span className="text-xl font-bold">CMarket</span>
          <p className="text-xs text-violet-200 mt-0.5 uppercase tracking-widest">Panel Master</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20 md:hidden"
          aria-expanded={open}
          aria-label="Abrir menú"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav
        className={`${
          open ? "block" : "hidden"
        } flex flex-col gap-2 overflow-hidden rounded-b-3xl bg-violet-700/95 px-3 py-3 shadow-[0_15px_40px_rgba(80,46,211,0.18)] md:block md:overflow-visible md:shadow-none md:bg-transparent md:px-3 md:py-4`}
      >
        {open
          ? mobileMenuItems.map(({ label, href, icon, exact, action }) => (
              <NavLink
                key={label}
                href={href}
                icon={icon}
                label={label}
                active={href ? (exact ? pathname === href : pathname.startsWith(href)) : false}
                action={action}
              />
            ))
          : navItems.map(({ label, href, icon, exact }) => (
              <NavLink
                key={href}
                href={href}
                icon={icon}
                label={label}
                active={href ? (exact ? pathname === href : pathname.startsWith(href)) : false}
              />
            ))}
        {open && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-white md:hidden">
            <p className="text-xs uppercase tracking-[0.24em] text-violet-200">Conectado como</p>
            <p className="mt-1 text-sm font-medium text-white truncate">{nombre}</p>
          </div>
        )}
      </nav>

      <div className="border-t border-white/20 px-3 pb-4 pt-4 md:mt-auto md:space-y-1">
        <div className="hidden md:block">
          {bottomItems.map(({ label, href, icon, action }) => (
            <NavLink
              key={label}
              href={href}
              icon={icon}
              label={label}
              active={href ? pathname.startsWith(href) : false}
              action={action}
            />
          ))}
        </div>

        <div className="hidden md:block px-3 pt-3 mt-1">
          <p className="text-xs text-violet-300">Conectado como</p>
          <p className="text-sm font-medium text-white truncate">{nombre}</p>
        </div>
      </div>
    </aside>
  )
}
