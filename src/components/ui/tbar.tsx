// src/components/ui/tbar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Événements", href: "/dashboard/events", icon: CalendarDays },
  { name: "Réservations", href: "/dashboard/reservations", icon: Ticket },
  { name: "Utilisateurs", href: "/dashboard/users", icon: Users },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export default function TBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // Exemple d'utilisateur (à remplacer par vos données réelles)
  const user = {
    name: "Acme Inc",
    email: "acme@example.com",
    avatar: null, // ou une URL d'avatar
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

//   const handleLogout = async () => {
//     "use server";
//     await auth.api.signOut({
//       headers: await headers(),
//     });
//     redirect("/");
//   };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out z-50
        ${collapsed ? "w-20" : "w-64"}
        flex flex-col justify-between
        shadow-sm
      `}
    >
      {/* HEADER : Logo + toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white font-bold text-xl rounded-lg w-10 h-10 flex items-center justify-center">
              E
            </div>
            <span className="text-xl font-bold text-gray-800">Evenn</span>
          </div>
        )}
        {collapsed && (
          <div className="bg-indigo-600 text-white font-bold text-xl rounded-lg w-10 h-10 flex items-center justify-center mx-auto">
            E
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* USER INFO */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
              {!collapsed && <span>{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* BOUTON DÉCONNEXION */}
      <div className="p-4 border-t border-gray-100">
        <form action="">
          <button
            type="submit"
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
              text-red-600 hover:bg-red-50 transition-colors
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Se déconnecter</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}