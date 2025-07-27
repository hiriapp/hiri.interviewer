"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FaArrowLeft, FaBriefcase } from "react-icons/fa";

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
    <DashboardLayout
      title="Yeni Pozisyon Ekle - HiriBot"
      activeSection="positions"
    >
      <div className="container mx-auto">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white p-6 mb-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold mb-1 flex items-center">
                  <FaBriefcase className="mr-3 text-2xl" />
                  Yeni Pozisyon Ekle
                </h1>
                <p className="text-purple-100 text-base">
                  Yeni iş ilanı oluşturun ve adayları bekleyin
                </p>
              </div>
              <button
                onClick={handleBack}
                className="bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 flex items-center text-sm border border-white/20"
              >
                <FaArrowLeft className="mr-2" />
                Pozisyon Listesine Dön
              </button>
            </div>
          </div>
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
      </div>
    </DashboardLayout>
  );
}
