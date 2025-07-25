"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

interface HeaderProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

export function Header({ onNavigate, currentView }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navigationItems = [
    { id: "candidates", label: "Adaylar", path: "/candidates" },
    { id: "positions", label: "Pozisyonlar", path: "/positions" },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (item: { id: string; path: string }) => {
    if (onNavigate) {
      onNavigate(item.id);
    } else {
      router.push(item.path);
    }
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavigation = (item: { id: string; path: string }) => {
    handleNavigation(item);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-hiri-gradient text-white shadow-md sticky top-0 z-50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2 ml-10">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? "bg-white/30"
                      : "hover:bg-white/20"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden h-9 w-9 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
            >
              <div className="relative">
                <FaTimes
                  className={`text-lg absolute transition-all duration-300 transform ${
                    isMobileMenuOpen
                      ? "rotate-0 opacity-100 scale-100"
                      : "rotate-90 opacity-0 scale-75"
                  }`}
                />
                <FaBars
                  className={`text-lg transition-all duration-300 transform ${
                    isMobileMenuOpen
                      ? "rotate-90 opacity-0 scale-75"
                      : "rotate-0 opacity-100 scale-100"
                  }`}
                />
              </div>
            </button>

            <span className="text-sm font-semibold hidden sm:inline">
              Turkcell
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

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out relative z-40 ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/10 border-t border-white/20 shadow-lg backdrop-blur-sm">
          <div
            className="px-4 py-3 space-y-2 transform transition-transform duration-300 ease-in-out"
            style={{
              transform: isMobileMenuOpen
                ? "translateY(0)"
                : "translateY(-10px)",
            }}
          >
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleMobileNavigation(item)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  currentView === item.id
                    ? "bg-white/30 text-white shadow-md"
                    : "hover:bg-white/20 text-white/90"
                }`}
                style={{
                  animationDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Menu - Additional Options */}
            <hr className="border-white/20 my-3 transition-opacity duration-300" />

            <a
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/20 text-white/90 block transform hover:scale-105"
            >
              Profil
            </a>

            <button
              onClick={() => {
                handleSignOut();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/20 text-white/90 transform hover:scale-105"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            animation: "fadeIn 0.3s ease-in-out",
          }}
        />
      )}
    </header>
  );
}
