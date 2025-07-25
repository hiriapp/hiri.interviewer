"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import { FaArrowLeft } from "react-icons/fa";

export default function CreatePositionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

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

    // Simulate saving position
    alert("Yeni pozisyon başarıyla oluşturuldu!");
    router.push("/positions");
  };

  const handleBack = () => {
    router.push("/positions");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header currentView="positions" />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {/* Başlık ve Geri Butonu */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">
            Yeni Pozisyon Ekle
          </h1>
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

            {/* Submit Button */}
            <button
              type="submit"
              className="hiri-button hiri-button-primary w-full py-3 text-base"
            >
              Pozisyonu Kaydet
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
