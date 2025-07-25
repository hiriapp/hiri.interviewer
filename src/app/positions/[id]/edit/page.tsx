"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import { FaArrowLeft } from "react-icons/fa";

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

export default function EditPositionPage() {
  const router = useRouter();
  const params = useParams();
  const positionId = params.id as string;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  // Pozisyon verilerini yükle
  useEffect(() => {
    const position = DUMMY_POSITIONS.find((p) => p.id === positionId);
    if (position) {
      setFormData({
        title: position.title,
        description: position.description,
      });
    }
    setIsLoading(false);
  }, [positionId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert("Lütfen tüm zorunlu alanları doldurun!");
      return;
    }

    // Simulate updating position
    alert(`Pozisyon başarıyla güncellendi! (ID: ${positionId})`);
    router.push("/positions");
  };

  const handleBack = () => {
    router.push("/positions");
  };

  const handleDelete = () => {
    if (
      confirm(
        "Bu pozisyonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      )
    ) {
      alert(`Pozisyon silindi! (ID: ${positionId})`);
      router.push("/positions");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100">
        <Header currentView="positions" />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hiri-purple mx-auto"></div>
            <p className="mt-4 text-slate-600">
              Pozisyon bilgileri yükleniyor...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const position = DUMMY_POSITIONS.find((p) => p.id === positionId);

  if (!position) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100">
        <Header currentView="positions" />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Pozisyon bulunamadı
            </h1>
            <button
              onClick={handleBack}
              className="hiri-button hiri-button-secondary"
            >
              <FaArrowLeft className="mr-2" />
              Pozisyon Listesine Dön
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header currentView="positions" />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {/* Başlık ve Geri Butonu */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">
              Pozisyon Düzenle
            </h1>
            <p className="text-slate-600 text-sm mt-1">ID: {positionId}</p>
          </div>
          <button
            onClick={handleBack}
            className="hiri-button hiri-button-secondary text-sm py-2"
          >
            <FaArrowLeft className="mr-2" />
            Pozisyon Listesine Dön
          </button>
        </div>

        {/* Form Kartı */}
        <div className="hiri-card max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pozisyon Başlığı */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Pozisyon Başlığı*
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="hiri-input"
                placeholder="örn: Senior Frontend Developer"
                required
              />
            </div>

            {/* Pozisyon Açıklaması */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Pozisyon Açıklaması (İş İlanı Metni)*
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={15}
                className="hiri-input"
                placeholder="LinkedIn veya diğer kaynaklardan kopyaladığınız iş ilanı metnini buraya yapıştırın..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="hiri-button hiri-button-primary flex-1 py-3 text-base"
              >
                Değişiklikleri Kaydet
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="hiri-button hiri-button-outline border-red-300 text-red-600 hover:bg-red-50 py-3 text-base"
              >
                Pozisyonu Sil
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
