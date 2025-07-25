"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import { FaSearch, FaUserPlus, FaArrowRight } from "react-icons/fa";
import { DUMMY_CANDIDATES } from "@/lib/dummy-data";

// Tooltip Portal Component
function TooltipPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

export default function CandidatesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentView, setCurrentView] = useState("candidates");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Merkezi veri kaynağından adayları al
  const candidates = DUMMY_CANDIDATES;

  const filteredCandidates = candidates.filter((candidate) => {
    const fullName = `${candidate.name} ${candidate.surname}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      candidate.email.toLowerCase().includes(search) ||
      candidate.position.toLowerCase().includes(search)
    );
  });

  const handleViewCandidate = (candidateId: string) => {
    router.push(`/candidates/${candidateId}`);
  };

  const handleTooltipShow = (candidateId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setActiveTooltip(candidateId);
  };

  const handleTooltipHide = () => {
    setActiveTooltip(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header currentView={currentView} />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {/* Başlık ve Yeni Aday Butonu */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-800 mb-4 sm:mb-0">
            Adaylar
          </h1>
          <button
            onClick={() => router.push("/candidates/create")}
            className="hiri-button hiri-button-primary"
          >
            <FaUserPlus className="mr-2" />
            Yeni Aday Oluştur
          </button>
        </div>

        {/* Ana Kart */}
        <div className="hiri-card">
          {/* Arama ve Sayaç */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative sm:w-2/5 lg:w-1/3 w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Aday ara (isim, email, pozisyon)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hiri-input pl-10"
              />
            </div>
            <span className="text-sm text-slate-500">
              <span className="font-semibold">{filteredCandidates.length}</span>{" "}
              Aday Gösteriliyor
            </span>
          </div>

          {/* Tablo */}
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-1/5 min-w-[140px]">
                    Ad Soyad
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-1/4 min-w-[180px]">
                    Email
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-1/4 min-w-[160px]">
                    Pozisyon
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-1/5 min-w-[120px]">
                    Uyumluluk
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-32 min-w-[120px]">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredCandidates.map((candidate, index) => (
                  <tr
                    key={candidate.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-3 py-4 text-sm font-medium text-slate-800">
                      <div className="truncate">
                        {candidate.name} {candidate.surname}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-500">
                      <div className="truncate" title={candidate.email}>
                        {candidate.email}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-500">
                      <div className="truncate" title={candidate.position}>
                        {candidate.position}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-500">
                      <div className="relative">
                        <div
                          className="w-full bg-slate-200 rounded-full h-5 cursor-help"
                          onMouseEnter={(e) =>
                            handleTooltipShow(candidate.id, e)
                          }
                          onMouseLeave={handleTooltipHide}
                        >
                          <div
                            className="bg-gradient-to-r from-hiri-purple to-indigo-500 h-5 rounded-full text-xs font-semibold text-white flex items-center justify-center transition-all duration-500"
                            style={{
                              width: `${candidate.compatibilityScore}%`,
                            }}
                          >
                            {candidate.compatibilityScore}%
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-left text-sm font-medium">
                      <button
                        onClick={() => handleViewCandidate(candidate.id)}
                        className="text-hiri-purple hover:text-hiri-purple-dark font-semibold transition-colors duration-200 whitespace-nowrap"
                      >
                        Görüntüle{" "}
                        <FaArrowRight className="inline ml-1 text-xs" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Boş Durum */}
            {filteredCandidates.length === 0 && (
              <div className="text-center py-12">
                <FaSearch className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aday bulunamadı
                </h3>
                <p className="text-sm text-slate-500">
                  Arama kriterlerinize uygun aday bulunmuyor.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Portal Tooltip */}
      {activeTooltip && (
        <TooltipPortal>
          <div
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: tooltipPosition.x - 150, // Tooltip'i ortalamak için
              top: tooltipPosition.y - 120, // Tooltip'i yukarı taşımak için
            }}
          >
            <div className="w-80 bg-slate-800 text-white text-xs rounded-lg p-4 shadow-2xl">
              <div className="space-y-2">
                {(() => {
                  const candidate = filteredCandidates.find(
                    (c) => c.id === activeTooltip
                  );
                  return candidate?.compatibilityReasons.map(
                    (reason, index) => (
                      <div key={index} className="flex items-start">
                        <span className="mr-2 text-hiri-purple">•</span>
                        <span className="leading-relaxed">{reason}</span>
                      </div>
                    )
                  );
                })()}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </TooltipPortal>
      )}
    </div>
  );
}
