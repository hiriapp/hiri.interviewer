"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import {
  FaArrowLeft,
  FaUser,
  FaUpload,
  FaCloudUploadAlt,
  FaCheckCircle,
} from "react-icons/fa";

// Dummy positions data
const DUMMY_POSITIONS = [
  {
    id: "pos1",
    title: "Senior Software Developer - Turkcell",
  },
  {
    id: "pos2",
    title: "Junior Marketing Specialist - Hiri Inc.",
  },
];

export default function CreateCandidatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("manuel");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manuel form data
  const [manuelForm, setManuelForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    cvText: "",
  });

  // CV upload form data
  const [cvForm, setCvForm] = useState({
    position: "",
  });

  const handleManuelInputChange = (field: string, value: string) => {
    setManuelForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz!");
        return;
      }

      // File type check
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Sadece PDF, DOCX ve TXT dosyaları yüklenebilir!");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleManuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !manuelForm.firstName ||
      !manuelForm.lastName ||
      !manuelForm.email ||
      !manuelForm.position
    ) {
      alert("Lütfen gerekli alanları doldurunuz!");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert("Aday başarıyla oluşturuldu! (Prototip)");
      setIsSubmitting(false);
      router.push("/candidates");
    }, 1500);
  };

  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !cvForm.position) {
      alert("Lütfen dosya seçin ve pozisyon belirtin!");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert("CV yüklendi ve aday oluşturuldu! (Prototip)");
      setIsSubmitting(false);
      router.push("/candidates");
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header currentView="candidates" />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {/* Başlık ve Geri Butonu */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-800 mb-4 sm:mb-0">
            Yeni Aday Oluştur
          </h1>
          <button
            onClick={() => router.push("/candidates")}
            className="hiri-button hiri-button-secondary"
          >
            <FaArrowLeft className="mr-2" />
            Aday Listesine Dön
          </button>
        </div>

        {/* Ana Kart */}
        <div className="hiri-card max-w-3xl mx-auto">
          {/* Sekmeler */}
          <div className="mb-6 border-b border-slate-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("manuel")}
                className={`py-3 px-1 border-b-3 font-semibold text-sm transition-colors ${
                  activeTab === "manuel"
                    ? "border-hiri-purple text-hiri-purple"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Manuel Bilgi Girişi
              </button>
              <button
                onClick={() => setActiveTab("cv")}
                className={`py-3 px-1 border-b-3 font-semibold text-sm transition-colors ${
                  activeTab === "cv"
                    ? "border-hiri-purple text-hiri-purple"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                CV Yükleyerek Oluştur
              </button>
            </div>
          </div>

          {/* Manuel Giriş Formu */}
          {activeTab === "manuel" && (
            <form onSubmit={handleManuelSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Adı*
                  </label>
                  <input
                    type="text"
                    value={manuelForm.firstName}
                    onChange={(e) =>
                      handleManuelInputChange("firstName", e.target.value)
                    }
                    className="hiri-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Soyadı*
                  </label>
                  <input
                    type="text"
                    value={manuelForm.lastName}
                    onChange={(e) =>
                      handleManuelInputChange("lastName", e.target.value)
                    }
                    className="hiri-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Email Adresi*
                </label>
                <input
                  type="email"
                  value={manuelForm.email}
                  onChange={(e) =>
                    handleManuelInputChange("email", e.target.value)
                  }
                  className="hiri-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={manuelForm.phone}
                  onChange={(e) =>
                    handleManuelInputChange("phone", e.target.value)
                  }
                  className="hiri-input"
                  placeholder="+90 555 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Değerlendirildiği Pozisyon*
                </label>
                <select
                  value={manuelForm.position}
                  onChange={(e) =>
                    handleManuelInputChange("position", e.target.value)
                  }
                  className="hiri-input"
                  required
                >
                  <option value="">Pozisyon Seçiniz...</option>
                  {DUMMY_POSITIONS.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  CV Metni (Opsiyonel)
                </label>
                <textarea
                  rows={6}
                  value={manuelForm.cvText}
                  onChange={(e) =>
                    handleManuelInputChange("cvText", e.target.value)
                  }
                  className="hiri-input resize-none"
                  placeholder="Adayın CV metnini buraya yapıştırabilirsiniz..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="hiri-button hiri-button-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Aday Oluşturuluyor...
                  </div>
                ) : (
                  <>
                    <FaUser className="mr-2" />
                    Adayı Oluştur
                  </>
                )}
              </button>
            </form>
          )}

          {/* CV Yükleme Formu */}
          {activeTab === "cv" && (
            <form onSubmit={handleCvSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Değerlendirildiği Pozisyon*
                </label>
                <select
                  value={cvForm.position}
                  onChange={(e) =>
                    setCvForm((prev) => ({ ...prev, position: e.target.value }))
                  }
                  className="hiri-input"
                  required
                >
                  <option value="">Pozisyon Seçiniz...</option>
                  {DUMMY_POSITIONS.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  CV Dosyası*
                </label>
                <div className="mt-1 flex flex-col items-center justify-center px-6 py-8 border-2 border-slate-300 border-dashed rounded-lg hover:border-hiri-purple transition-colors min-h-[220px] relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {selectedFile ? (
                    <div className="text-center">
                      <FaCheckCircle className="text-5xl text-green-500 mb-4 mx-auto" />
                      <div className="text-sm font-medium text-green-700 mb-2">
                        Dosya Seçildi: {selectedFile.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        Boyut: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Dosyayı Değiştir
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <FaCloudUploadAlt className="text-5xl text-slate-400 mb-4 mx-auto" />
                      <div className="flex text-sm text-slate-500">
                        <span className="font-medium text-hiri-purple cursor-pointer hover:text-hiri-purple-dark">
                          Dosya yükle
                        </span>
                        <span className="ml-1">veya sürükleyip bırakın</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        PDF, DOCX, TXT (MAX. 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedFile}
                className="hiri-button hiri-button-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    CV İşleniyor...
                  </div>
                ) : (
                  <>
                    <FaUpload className="mr-2" />
                    CV Yüklensin ve Aday Oluşturulsun
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
