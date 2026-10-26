"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Users,
  BarChart3,
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const navItems = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mes événements", href: "/dashboard/events", icon: CalendarDays },
  { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
  { name: "Réservations", href: "/dashboard/reservations", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Revenus", href: "/dashboard/revenue", icon: DollarSign },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;          // pour le bureau
  onToggle?: () => void;        // pour le bureau (chevron)
  onClose?: () => void;         // pour le mobile (bouton ✕)
}

export default function Sidebar({ collapsed = false, onToggle, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Vous êtes déconnecté.");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("Impossible de vous déconnecter.");
        },
      },
    });
  };

  // On détermine si la sidebar est en mode mobile : onClose est présent
  const isMobile = !!onClose;

  return (
    <aside
      className={`
        h-full bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out
        flex flex-col
        ${collapsed ? "w-20" : "w-64"}
        ${isMobile ? "w-64" : ""} /* sur mobile, toujours w-64 */
        fixed left-0 top-0 z-50
      `}
    >
      {/* En-tête : logo + bouton de fermeture/chevron */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="bg-[#2563EB] text-white font-bold text-xl rounded-lg w-10 h-10 flex items-center justify-center">
              E
            </div>
            <span className="text-xl font-bold text-gray-800">Evenn</span>
          </Link>
        ) : (
          <Link href="/dashboard">
            <div className="bg-[#2563EB] text-white font-bold text-xl rounded-lg w-10 h-10 flex items-center justify-center">
              E
            </div>
          </Link>
        )}

        {/* Bouton de contrôle : chevron sur bureau, ✕ sur mobile */}
        {isMobile ? (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Fermer la navigation"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        ) : onToggle ? (
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? "Déplier" : "Replier"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (
            item.href !== "/dashboard" && pathname?.startsWith(item.href + "/")
          );
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && onClose?.()}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive
                  ? "bg-[#2563EB]/10 text-[#2563EB] font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
                ${collapsed && !isMobile ? "justify-center" : ""}
              `}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-[#2563EB]" : "text-gray-400"}`} />
              {(!collapsed || isMobile) && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            text-red-600 hover:bg-red-50 transition-colors
            ${collapsed && !isMobile ? "justify-center" : ""}
          `}
        >
          <LogOut className="h-5 w-5" />
          {(!collapsed || isMobile) && <span>Se déconnecter</span>}
        </button>
      </div>
    </aside>
  );
}