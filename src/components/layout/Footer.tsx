"use client";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-1 sm:space-y-0">
          {/* Left - Brand */}
          <div className="flex items-center space-x-2">
            <span className="text-white font-semibold text-sm">
              hiri<span className="font-light">.interviewer</span>
            </span>
          </div>

          {/* Right - Copyright */}
          <div className="text-xs text-slate-400">
            © 2025 Hiri.ai - Tüm Hakları Saklıdır
          </div>
        </div>
      </div>
    </footer>
  );
}
