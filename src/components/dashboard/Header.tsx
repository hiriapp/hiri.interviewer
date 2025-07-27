"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa";

interface HeaderProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
  onToggleSidebar?: () => void;
}

export function Header({
  onNavigate,
  currentView,
  onToggleSidebar,
}: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="bg-hiri-gradient text-white shadow-md sticky top-0 z-50 relative w-full">
      <div className="w-full px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Mobile Hamburger Menu */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden mr-3 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
              >
                <FaBars className="text-lg text-white" />
              </button>
            )}

            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-lg font-semibold">
                <span className="text-white">hiri</span>
                <span className="text-blue-200 font-light">.interviewer</span>
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold hidden sm:inline">
              Kurum
            </span>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-9 w-9 rounded-full bg-white/30 text-white flex items-center justify-center text-sm font-bold hover:bg-white/40 transition-colors"
              >
                T
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 py-1">
                  <a
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Profil
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
