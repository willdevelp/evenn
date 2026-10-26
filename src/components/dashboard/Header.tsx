"use client";

import { useState, useEffect } from "react";
import { Search, Bell, User, ChevronDown, LogOut, Settings, Menu } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void; // pour ouvrir la sidebar mobile
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nouvelle réservation pour Concert de Jazz", read: false },
    { id: 2, message: "Événement Festival de la Bière complet", read: false },
    { id: 3, message: "Conférence Tech - 5 places restantes", read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Gauche : hamburger (visible sur mobile) + recherche */}
      <div className="flex items-center gap-3 flex-1">
        {/* Bouton menu mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Ouvrir la navigation"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        {/* Barre de recherche */}
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement, un ticket..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50"
          />
        </div>
      </div>

      {/* Droite : notifications + profil */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-100 transition relative"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown notifications */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 p-4">Aucune notification</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition ${
                        !notif.read ? "bg-indigo-50" : ""
                      }`}
                    >
                      <p className="text-sm text-gray-700">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profil */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-lg transition"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              A
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {/* Dropdown profil */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100">
                <p className="font-medium text-gray-800">Acme Inc</p>
                <p className="text-xs text-gray-500">acme@example.com</p>
              </div>
              <div className="p-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
                <button
                  onClick={() => {
                    // Déconnexion
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}