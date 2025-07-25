"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import { FaPlus, FaEdit } from "react-icons/fa";

// Dummy data - gerçek uygulamada API'den gelecek
const DUMMY_POSITIONS = [
  {
    id: "pos1",
    title: "Senior Software Developer - Turkcell",
    description: `Turkcell olarak yeteneklerimize eşsiz insan deneyimi yaşatarak, değer yaratan sürdürülebilir bir organizasyon inşa etmeyi ve işveren markamızı zirveye taşımayı hedefliyoruz. Bu hedef doğrultusunda benimsediğimiz değerlerimizi iş yapış biçimlerimize yansıtıyoruz. 

Ne Bekliyoruz?
Tercihen yazılım mühendisliği, Bilgisayar Bilimleri veya ilgili bir alanda Lisans veya Yüksek Lisans derecesi olan,
Profesyonel frontend geliştirme alanında en az 5 yıl deneyimi olan,
React (Hooks, Context API ve/veya popüler state management kütüphaneleri - Redux, Zustand vb.) konusunda derinlemesine bilgi sahibi ve pratik deneyimi olan,
Güçlü TypeScript bilgisi olan, HTML5 ve CSS3 konularında yetkin,
RESTful API'leri tüketme konusunda kanıtlanmış deneyime sahip...`,
    requirements: [
      "React (Hooks, Context API, Redux/Zustand)",
      "TypeScript",
      "HTML5, CSS3",
      "RESTful APIs",
      "Webpack, Vite, Babel",
      "Jest, React Testing Library",
      "Git",
      "AI-assisted development",
    ],
    responsibilities: [
      "Sezgisel, duyarlı ve estetik kullanıcı arayüzleri geliştirmek",
      "Yeni özellikler ve işlevler implemente etmek",
      "API'lerle veri alışverişi sağlamak",
      "Temiz, sürdürülebilir, iyi belgelenmiş kod yazmak",
      "Performans optimizasyonu yapmak",
      "Diğer ekiplerle işbirliği yapmak",
    ],
  },
  {
    id: "pos2",
    title: "Junior Marketing Specialist - Hiri Inc.",
    description:
      "Hiri Inc. olarak pazarlama ekibimize dinamik, öğrenmeye açık bir Junior Marketing Specialist arıyoruz. İnovasyon, müşteri odaklılık ve takım çalışması değerlerimizle uyumlu adayları bekliyoruz.\n\nNe Bekliyoruz?\nPazarlama, İletişim veya ilgili bir alanda Lisans derecesi,\n0-2 yıl dijital pazarlama deneyimi (stajlar dahil),\nTemel SEO/SEM bilgisi ve Google Analytics aşinalığı,\nİçerik üretme ve etkili hikaye anlatma becerisi,\nSosyal medya platformlarına (Instagram, LinkedIn, Twitter) ve yönetim araçlarına hakimiyet...",
    requirements: [
      "Pazarlama, İletişim veya ilgili alanda Lisans",
      "0-2 yıl dijital pazarlama deneyimi",
      "Temel SEO/SEM bilgisi",
      "İçerik üretme ve hikaye anlatma becerisi",
      "Sosyal medya platformlarına hakimiyet (Instagram, LinkedIn, Twitter)",
    ],
    responsibilities: [
      "Sosyal medya hesaplarını aktif yönetmek ve etkileşimi artırmak",
      "Dijital pazarlama kampanyalarına (email, PPC) destek olmak",
      "Pazar araştırması ve rakip analizi yapmak",
      "Blog yazıları, infografikler ve kısa videolar için içerik üretmek",
    ],
  },
];

export default function PositionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPositions = DUMMY_POSITIONS.filter(
    (position) =>
      position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPosition = () => {
    router.push("/positions/create");
  };

  const handleEditPosition = (position: (typeof DUMMY_POSITIONS)[0]) => {
    router.push(`/positions/${position.id}/edit`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header currentView="positions" />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {/* Başlık ve Yeni Pozisyon Butonu */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-800 mb-4 sm:mb-0">
            Pozisyonlar
          </h1>
          <button
            onClick={handleNewPosition}
            className="hiri-button hiri-button-primary text-sm py-2.5"
          >
            <FaPlus className="mr-2" /> Yeni Pozisyon Ekle
          </button>
        </div>

        {/* Ana Kart */}
        <div className="hiri-card">
          {/* Arama ve Sayaç */}
          <div className="flex justify-between items-center mb-5">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hiri-input w-full sm:w-1/3 text-sm"
              placeholder="Pozisyon ara..."
            />
            <span className="text-sm text-slate-500">
              {filteredPositions.length} Pozisyon Gösteriliyor
            </span>
          </div>

          {/* Pozisyon Listesi */}
          <div className="space-y-4">
            {filteredPositions.length === 0 ? (
              <p className="text-center text-slate-500 italic py-4">
                Arama kriterlerinize uygun pozisyon bulunamadı.
              </p>
            ) : (
              filteredPositions.map((position) => (
                <div
                  key={position.id}
                  className="hiri-card flex justify-between items-start hover:shadow-lg transition-shadow duration-300"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-hiri-purple mb-1">
                      {position.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">
                      ID: {position.id}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {position.description.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleEditPosition(position)}
                      className="hiri-button hiri-button-secondary text-xs py-1 px-3"
                    >
                      <FaEdit className="mr-1" />
                      Düzenle/Gör
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
