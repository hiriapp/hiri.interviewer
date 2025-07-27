"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import { SuccessModal, ErrorModal, ProgressModal } from "@/components/ui";
import { DUMMY_CANDIDATES } from "@/lib/dummy-data";
import {
  FaArrowLeft,
  FaUser,
  FaUpload,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaLinkedin,
  FaFileAlt,
  FaChartBar,
  FaSyncAlt,
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

  // LinkedIn import data
  const [linkedinFile, setLinkedinFile] = useState<File | null>(null);
  const [linkedinImportStep, setLinkedinImportStep] = useState(1);
  const [linkedinImportProgress, setLinkedinImportProgress] = useState(0);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
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
        setModalContent({
          title: "Dosya Boyutu Hatası",
          message: "Dosya boyutu 5MB'dan büyük olamaz!",
        });
        setShowErrorModal(true);
        return;
      }

      // File type check
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        setModalContent({
          title: "Dosya Türü Hatası",
          message: "Sadece PDF, DOCX ve TXT dosyaları yüklenebilir!",
        });
        setShowErrorModal(true);
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
      setModalContent({
        title: "Eksik Bilgi",
        message: "Lütfen gerekli alanları doldurunuz!",
      });
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setModalContent({
        title: "Başarılı!",
        message: "Aday başarıyla oluşturuldu!",
      });
      setShowSuccessModal(true);

      // Set refresh flag for candidates page
      localStorage.setItem("candidatesRefresh", "true");

      // Navigate after success modal is shown
      setTimeout(() => {
        router.push("/candidates");
      }, 1000);
    }, 1500);
  };

  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !cvForm.position) {
      setModalContent({
        title: "Eksik Bilgi",
        message: "Lütfen dosya seçin ve pozisyon belirtin!",
      });
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setModalContent({
        title: "Başarılı!",
        message: "CV yüklendi ve aday oluşturuldu!",
      });
      setShowSuccessModal(true);

      // Set refresh flag for candidates page
      localStorage.setItem("candidatesRefresh", "true");

      // Navigate after success modal is shown
      setTimeout(() => {
        router.push("/candidates");
      }, 1000);
    }, 2000);
  };

  const handleLinkedinFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File type check for CSV
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setModalContent({
          title: "Dosya Türü Hatası",
          message: "Sadece CSV dosyaları yüklenebilir!",
        });
        setShowErrorModal(true);
        return;
      }

      // File size check (2MB for CSV)
      if (file.size > 2 * 1024 * 1024) {
        setModalContent({
          title: "Dosya Boyutu Hatası",
          message: "Dosya boyutu 2MB'dan büyük olamaz!",
        });
        setShowErrorModal(true);
        return;
      }

      setLinkedinFile(file);
    }
  };

  const handleLinkedinImport = () => {
    if (!linkedinFile) {
      setModalContent({
        title: "Dosya Seçilmedi",
        message: "Lütfen LinkedIn CSV dosyasını seçin!",
      });
      setShowErrorModal(true);
      return;
    }

    setLinkedinImportStep(2);
    setLinkedinImportProgress(0);
    setIsSubmitting(true);
    setShowProgressModal(true);

    // Progress simulation with real data creation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setLinkedinImportProgress(progress);

      if (progress >= 100) {
        clearInterval(progressInterval);

        // Simulated LinkedIn data - normally would come from CSV parsing
        const linkedinCsvData = [
          {
            id: "aday_bulk_1",
            name: "Ayşe",
            surname: "Yılmaz",
            profileUrl: "linkedin.com/in/ayseyilmaz",
          },
          {
            id: "aday_bulk_2",
            name: "Fatma",
            surname: "Kaya",
            profileUrl: "linkedin.com/in/fatmakaya",
          },
          {
            id: "aday_bulk_3",
            name: "Ali",
            surname: "Çelik",
            profileUrl: "linkedin.com/in/alicelik",
          },
          {
            id: "aday_bulk_4",
            name: "Mehmet",
            surname: "Demir",
            profileUrl: "linkedin.com/in/mehmetdemir",
          },
          {
            id: "aday_bulk_5",
            name: "Zeynep",
            surname: "Öztürk",
            profileUrl: "linkedin.com/in/zeynepozturk",
          },
        ];

        // Create new candidates with proper DUMMY_CANDIDATES structure
        const newCandidates = linkedinCsvData.map((item, index) => ({
          id: `linkedin_${Date.now()}_${index}`,
          name: item.name,
          surname: item.surname,
          email: `${item.name.toLowerCase()}.${item.surname.toLowerCase()}@example.com`,
          phone: `0555 ${Math.floor(Math.random() * 900) + 100} ${
            Math.floor(Math.random() * 90) + 10
          }${Math.floor(Math.random() * 90) + 10}`,
          position: "LinkedIn'den Aktarıldı", // Default position
          source: {
            icon: "fab fa-linkedin",
            color: "text-blue-500",
            name: "LinkedIn",
          },
          compatibilityScore: Math.floor(Math.random() * (95 - 75 + 1) + 75), // 75-95 arası
          compatibilityReasons: [
            "LinkedIn profilinden otomatik analiz sonucu uygun görülmektedir.",
            "Deneyim ve beceriler pozisyon gereksinimleriyle uyumludur.",
            "Eğitim altyapısı pozisyon için yeterli düzeydedir.",
          ],
          skills: {
            Teknik: Math.floor(Math.random() * (9 - 6 + 1) + 6),
            "Problem Çözme": Math.floor(Math.random() * (9 - 7 + 1) + 7),
            Liderlik: Math.floor(Math.random() * (8 - 5 + 1) + 5),
            İletişim: Math.floor(Math.random() * (9 - 7 + 1) + 7),
            "Takım Çalışması": Math.floor(Math.random() * (9 - 7 + 1) + 7),
            Öğrenme: Math.floor(Math.random() * (9 - 7 + 1) + 7),
          },
          strengths: [
            "LinkedIn profilinde güçlü profesyonel ağ",
            "İlgili alanda deneyim",
            "Sürekli gelişim odaklı yaklaşım",
          ],
          weaknesses: [
            "Detaylı teknik yetkinlik değerlendirmesi gerekli",
            "Kültürel uyum analizi yapılmalı",
          ],
          cvSummary: `LinkedIn'den aktarılan ${item.name} ${item.surname}, ${
            Math.floor(Math.random() * 5) + 3
          } yıl deneyimli bir profesyoneldir. Pozisyon gereksinimleri ile uyumlu background'a sahiptir.`,
          personalityInventorySummaryAI:
            "LinkedIn profil analizi sonucu değerlendirme yapılmıştır. Detaylı kişilik envanteri tamamlandığında daha kapsamlı analiz sağlanacaktır.",
          cvText: `${item.name.toUpperCase()} ${item.surname.toUpperCase()}
${item.name.toLowerCase()}.${item.surname.toLowerCase()}@example.com | LinkedIn: ${
            item.profileUrl
          }

ÖZET
LinkedIn'den aktarılan profesyonel profil. ${
            Math.floor(Math.random() * 5) + 3
          } yıl deneyimli.

DENEYİMLER
[LinkedIn profilinden otomatik olarak çıkarılan deneyim bilgileri]

YETENEKLER
[LinkedIn profilinden otomatik olarak çıkarılan yetenek bilgileri]

EĞİTİM
[LinkedIn profilinden otomatik olarak çıkarılan eğitim bilgileri]`,
          interviews: [],
          notes: [
            {
              user: "Sistem",
              timestamp:
                new Date().toLocaleDateString("tr-TR") +
                " " +
                new Date().toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              text: `LinkedIn'den CSV ile aktarıldı.`,
            },
          ],
          logs: [
            {
              user: "Sistem",
              timestamp:
                new Date().toLocaleDateString("tr-TR") +
                " " +
                new Date().toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              action: `LinkedIn'den CSV ile aktarıldı`,
              icon: "fa-linkedin",
              color: "bg-blue-100 text-blue-600",
            },
          ],
        }));

        // Add to DUMMY_CANDIDATES array (simulate adding to real database)
        DUMMY_CANDIDATES.push(...newCandidates);

        console.log(
          `Added ${newCandidates.length} candidates from LinkedIn import:`,
          newCandidates
        );

        setTimeout(() => {
          setIsSubmitting(false);
          setShowProgressModal(false);
          setModalContent({
            title: "Başarılı!",
            message: `LinkedIn'den ${newCandidates.length} aday başarıyla aktarıldı ve sisteme eklendi!`,
          });
          setShowSuccessModal(true);

          // Set refresh flag for candidates page
          localStorage.setItem("candidatesRefresh", "true");

          // Navigate after success modal is shown
          setTimeout(() => {
            router.push("/candidates");
          }, 1000);
        }, 500);
      }
    }, 200);
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
              <button
                onClick={() => setActiveTab("linkedin")}
                className={`py-3 px-1 border-b-3 font-semibold text-sm transition-colors ${
                  activeTab === "linkedin"
                    ? "border-hiri-purple text-hiri-purple"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <FaLinkedin className="inline mr-2" />
                LinkedIn Aktarımı
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

          {/* LinkedIn Aktarım Formu */}
          {activeTab === "linkedin" && (
            <div className="space-y-6">
              {linkedinImportStep === 1 && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      <FaLinkedin className="inline mr-2" />
                      LinkedIn Aday Aktarımı Nasıl Çalışır?
                    </h3>
                    <div className="space-y-3 text-sm text-blue-700">
                      <div className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          1
                        </span>
                        <p>
                          LinkedIn'de aday araması yapın ve sonuçları CSV
                          formatında dışa aktarın.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          2
                        </span>
                        <p>
                          Dışa aktardığınız CSV dosyasını aşağıdaki alana
                          yükleyin.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          3
                        </span>
                        <p>
                          HiriBot otomatik olarak her adayın LinkedIn profilini
                          tarayarak detaylı CV bilgilerini alacaktır.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          4
                        </span>
                        <p>
                          Adaylar sisteme otomatik olarak eklenir ve adaylar
                          tablosunda görünür hale gelir.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      LinkedIn CSV Dosyası*
                    </label>
                    <div className="mt-1 flex flex-col items-center justify-center px-6 py-8 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 transition-colors min-h-[220px] relative">
                      <input
                        type="file"
                        onChange={handleLinkedinFileChange}
                        accept=".csv"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      {linkedinFile ? (
                        <div className="text-center">
                          <FaCheckCircle className="text-5xl text-green-500 mb-4 mx-auto" />
                          <div className="text-sm font-medium text-green-700 mb-2">
                            Dosya Seçildi: {linkedinFile.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Boyut: {(linkedinFile.size / 1024).toFixed(2)} KB
                          </div>
                          <button
                            type="button"
                            onClick={() => setLinkedinFile(null)}
                            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                          >
                            Dosyayı Değiştir
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1 text-center">
                          <FaLinkedin className="text-5xl text-blue-500 mb-4 mx-auto" />
                          <div className="flex text-sm text-slate-500">
                            <span className="font-medium text-blue-600 cursor-pointer hover:text-blue-800">
                              CSV dosyası yükle
                            </span>
                            <span className="ml-1">
                              veya sürükleyip bırakın
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            Sadece CSV dosyaları (MAX. 2MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <FaFileAlt className="text-green-600 text-3xl mx-auto mb-2" />
                      <h4 className="font-semibold text-green-800">
                        Otomatik CV Tarama
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        LinkedIn profillerinden tam CV bilgileri otomatik olarak
                        çıkarılır
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                      <FaChartBar className="text-purple-600 text-3xl mx-auto mb-2" />
                      <h4 className="font-semibold text-purple-800">
                        Uyumluluk Analizi
                      </h4>
                      <p className="text-sm text-purple-700 mt-1">
                        AI destekli pozisyon uyumluluk skorları hesaplanır
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <FaSyncAlt className="text-blue-600 text-3xl mx-auto mb-2" />
                      <h4 className="font-semibold text-blue-800">
                        Toplu İşlem
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Tek seferde yüzlerce aday profili işlenebilir
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      💡 Pro İpucu
                    </h4>
                    <p className="text-sm text-yellow-700">
                      En iyi sonuçlar için LinkedIn Premium kullanarak aday
                      aramalarınızı genişletin ve daha detaylı profil
                      bilgilerine erişin. Aktarılan adaylar doğrudan{" "}
                      <strong>Adaylar</strong> sayfasında görünecektir.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLinkedinImport}
                    disabled={!linkedinFile || isSubmitting}
                    className="hiri-button hiri-button-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adaylar Aktarılıyor...
                      </div>
                    ) : (
                      <>
                        <FaLinkedin className="mr-2" />
                        LinkedIn'den Adayları Aktar
                      </>
                    )}
                  </button>
                </>
              )}

              {linkedinImportStep === 2 && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold mb-4 text-slate-700">
                    Adaylar Sisteme Ekleniyor...
                  </h2>
                  <FaSyncAlt className="text-6xl text-purple-600 mb-6 mx-auto animate-spin" />
                  <p className="text-slate-600 mb-6">
                    Adaylar ekleniyor ve HiriBot CV'lerini taramak için sıraya
                    alıyor.
                  </p>

                  <div className="max-w-md mx-auto">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${linkedinImportProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-500 mt-3">
                      İşlem devam ediyor... {linkedinImportProgress}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={modalContent.title}
        message={modalContent.message}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={modalContent.title}
        message={modalContent.message}
      />

      <ProgressModal
        isOpen={showProgressModal}
        title="İşlem Devam Ediyor"
        message="LinkedIn'den adaylar aktarılıyor, lütfen bekleyin..."
        progress={linkedinImportProgress}
      />
    </div>
  );
}
