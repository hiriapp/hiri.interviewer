"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Footer } from "@/components/layout/Footer";
import { SuccessModal, ErrorModal, ConfirmationModal } from "@/components/ui";
import {
  FaSearch,
  FaUserPlus,
  FaVideo,
  FaPaperPlane,
  FaEye,
  FaFileAlt,
  FaSyncAlt,
  FaUsers,
  FaPlus,
} from "react-icons/fa";
import { DUMMY_CANDIDATES, AI_COMPARISON_ANALYSES } from "@/lib/dummy-data";

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

// Modal Portal Component
function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

// Status türleri
type CandidateStatus =
  | "Beklemede"
  | "Mülakatta"
  | "Tamamlandı"
  | "Değerlendiriliyor";

// Helper functions
const getCandidateStatus = (candidate: any): CandidateStatus => {
  if (candidate.interviews && candidate.interviews.length > 0) {
    const lastInterview = candidate.interviews[candidate.interviews.length - 1];
    switch (lastInterview.status) {
      case "Planlandı":
        return "Beklemede";
      case "Başladı":
        return "Mülakatta";
      case "Tamamlandı":
        return lastInterview.hasReport ? "Tamamlandı" : "Değerlendiriliyor";
      default:
        return "Beklemede";
    }
  }
  return "Beklemede";
};

const getStatusTagClass = (status: CandidateStatus): string => {
  switch (status) {
    case "Tamamlandı":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Mülakatta":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Değerlendiriliyor":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Beklemede":
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const getUniquePositions = (candidates: any[]) => {
  const positions = candidates.map((c) => c.position);
  return [...new Set(positions)].sort();
};

export default function CandidatesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentView, setCurrentView] = useState("candidates");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // CV Modal
  const [showCvModal, setShowCvModal] = useState(false);
  const [selectedCvText, setSelectedCvText] = useState("");
  const [selectedCandidateName, setSelectedCandidateName] = useState("");

  // Interview Setup Modals
  const [showInterviewSetupModal, setShowInterviewSetupModal] = useState(false);
  const [showBulkInterviewSetupModal, setShowBulkInterviewSetupModal] =
    useState(false);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] =
    useState<any>(null);

  // Interview Settings States
  const [interviewLanguage, setInterviewLanguage] = useState("tr");
  const [assessSecondLanguage, setAssessSecondLanguage] = useState(false);
  const [selectedCompetencies, setSelectedCompetencies] = useState<Set<string>>(
    new Set()
  );
  const [selectedGeneralTopics, setSelectedGeneralTopics] = useState<
    Set<string>
  >(new Set());
  const [manualQuestions, setManualQuestions] = useState<Set<string>>(
    new Set()
  );
  const [customQuestionInput, setCustomQuestionInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Bulk Interview Settings (separate states)
  const [bulkInterviewLanguage, setBulkInterviewLanguage] = useState("tr");
  const [bulkAssessSecondLanguage, setBulkAssessSecondLanguage] =
    useState(false);
  const [bulkSelectedCompetencies, setBulkSelectedCompetencies] = useState<
    Set<string>
  >(new Set());
  const [bulkSelectedGeneralTopics, setBulkSelectedGeneralTopics] = useState<
    Set<string>
  >(new Set());
  const [bulkManualQuestions, setBulkManualQuestions] = useState<Set<string>>(
    new Set()
  );
  const [bulkCustomQuestionInput, setBulkCustomQuestionInput] = useState("");
  const [bulkSelectedTemplate, setBulkSelectedTemplate] = useState("");

  // Çoklu seçim state'leri
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  // Aday karşılaştırma state'leri
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonCandidates, setComparisonCandidates] = useState<any[]>([]);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
  });
  const [confirmationAction, setConfirmationAction] = useState<() => void>(
    () => {}
  );

  // Modal kontrol
  useEffect(() => {
    if (
      showCvModal ||
      showInterviewSetupModal ||
      showBulkInterviewSetupModal ||
      showComparisonModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    showCvModal,
    showInterviewSetupModal,
    showBulkInterviewSetupModal,
    showComparisonModal,
  ]);

  // Karşılaştırma modalı açıldığında radar chart'ları oluştur
  useEffect(() => {
    if (showComparisonModal && comparisonCandidates.length === 2) {
      // DOM güncellenene kadar bekle
      setTimeout(() => {
        createRadarChart(
          `chart-${comparisonCandidates[0].id}`,
          comparisonCandidates[0],
          "rgba(124, 58, 237, 0.2)",
          "rgb(124, 58, 237)"
        );
        createRadarChart(
          `chart-${comparisonCandidates[1].id}`,
          comparisonCandidates[1],
          "rgba(59, 130, 246, 0.2)",
          "rgb(59, 130, 246)"
        );
      }, 100);
    }
  }, [showComparisonModal, comparisonCandidates]);

  // Competencies and Topics
  const competencies = [
    "Liderlik",
    "Problem Çözme",
    "İletişim",
    "Ekip Çalışması",
    "Adaptasyon",
    "Teknik Bilgi",
  ];
  const generalTopics = [
    "Maaş Beklentisi",
    "Hibrit Çalışma Uyumu",
    "Seyahat Engeli",
    "Kariyer Motivasyonu",
  ];

  // Question Templates (State olarak yönetiliyor)
  const [questionTemplates, setQuestionTemplates] = useState([
    {
      id: "tpl1",
      name: "Yazılım Geliştirici Temel Mülakat",
      competencies: ["Teknik Bilgi", "Problem Çözme", "Ekip Çalışması"],
      generalTopics: ["Maaş Beklentisi", "Hibrit Çalışma Uyumu"],
      manualQuestions: ["Son 6 ayda öğrendiğiniz yeni bir teknoloji var mı?"],
    },
    {
      id: "tpl2",
      name: "Pazarlama Uzmanı Mülakatı",
      competencies: ["İletişim", "Adaptasyon"],
      generalTopics: ["Kariyer Motivasyonu"],
      manualQuestions: [
        "Dijital pazarlamada en başarılı bulduğunuz kampanya nedir?",
      ],
    },
    {
      id: "tpl3",
      name: "Liderlik Pozisyonu Mülakatı",
      competencies: ["Liderlik", "Problem Çözme", "İletişim"],
      generalTopics: ["Maaş Beklentisi", "Seyahat Engeli"],
      manualQuestions: ["En zor yönettiğiniz proje hangisiydi?"],
    },
  ]);

  // Aday listesi state yönetimi
  const [candidates, setCandidates] = useState(DUMMY_CANDIDATES);

  // Sayfa yüklendiğinde verileri yenile
  // Sayfa yüklendiğinde ve focus olduğunda verileri yenile
  useEffect(() => {
    const refreshCandidates = () => {
      setCandidates([...DUMMY_CANDIDATES]);
      console.log(
        "Candidates refreshed, total count:",
        DUMMY_CANDIDATES.length
      );
    };

    // İlk yükleme
    refreshCandidates();

    // Yeni aday eklendiyse refresh flag'ini kontrol et
    const shouldRefresh = localStorage.getItem("candidatesRefresh");
    if (shouldRefresh === "true") {
      refreshCandidates();
      localStorage.removeItem("candidatesRefresh");
    }

    // Sayfa focus olduğunda da kontrol et (başka tabdan döndüğünde)
    const handleFocus = () => {
      const shouldRefreshOnFocus = localStorage.getItem("candidatesRefresh");
      if (shouldRefreshOnFocus === "true") {
        refreshCandidates();
        localStorage.removeItem("candidatesRefresh");
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);
  const uniquePositions = getUniquePositions(candidates);
  const allStatuses: CandidateStatus[] = [
    "Beklemede",
    "Mülakatta",
    "Değerlendiriliyor",
    "Tamamlandı",
  ];

  const filteredCandidates = candidates.filter((candidate) => {
    const fullName = `${candidate.name} ${candidate.surname}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    const status = getCandidateStatus(candidate);

    const matchesSearch =
      fullName.includes(search) ||
      candidate.email.toLowerCase().includes(search) ||
      candidate.position.toLowerCase().includes(search);

    const matchesPosition =
      selectedPosition === "" || candidate.position === selectedPosition;
    const matchesStatus = selectedStatus === "" || status === selectedStatus;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  // Çoklu seçim fonksiyonları
  const handleSelectCandidate = (candidateId: string, checked: boolean) => {
    const newSelected = new Set(selectedCandidates);
    if (checked) {
      newSelected.add(candidateId);
    } else {
      newSelected.delete(candidateId);
    }
    setSelectedCandidates(newSelected);
    setSelectAll(
      newSelected.size === filteredCandidates.length &&
        filteredCandidates.length > 0
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredCandidates.map((c) => c.id));
      setSelectedCandidates(allIds);
    } else {
      setSelectedCandidates(new Set());
    }
    setSelectAll(checked);
  };

  // CV Modal fonksiyonları
  const handleShowCv = (candidate: any) => {
    if (candidate.cvText) {
      setSelectedCvText(candidate.cvText);
      setSelectedCandidateName(`${candidate.name} ${candidate.surname}`);
      setShowCvModal(true);
    } else {
      setModalContent({
        title: "CV Bulunamadı",
        message: "Bu aday için CV metni bulunamadı.",
      });
      setShowErrorModal(true);
    }
  };

  // Template functions
  const loadTemplate = (templateId: string, isBulk = false) => {
    const template = questionTemplates.find((tpl) => tpl.id === templateId);
    if (!template) {
      setModalContent({
        title: "Şablon Bulunamadı",
        message: "Seçilen şablon bulunamadı!",
      });
      setShowErrorModal(true);
      return;
    }

    console.log("Loading template:", template); // Debug

    if (isBulk) {
      // Önce mevcut seçimleri temizle
      setBulkSelectedCompetencies(new Set());
      setBulkSelectedGeneralTopics(new Set());
      setBulkManualQuestions(new Set());

      // Sonra şablon verilerini yükle
      setTimeout(() => {
        setBulkSelectedCompetencies(new Set(template.competencies));
        setBulkSelectedGeneralTopics(new Set(template.generalTopics));
        setBulkManualQuestions(new Set(template.manualQuestions));
        console.log("Bulk template loaded:", {
          competencies: template.competencies,
          topics: template.generalTopics,
          questions: template.manualQuestions,
        });
      }, 50);

      // Dropdown'ı temizle
      setBulkSelectedTemplate("");
    } else {
      // Önce mevcut seçimleri temizle
      setSelectedCompetencies(new Set());
      setSelectedGeneralTopics(new Set());
      setManualQuestions(new Set());

      // Sonra şablon verilerini yükle
      setTimeout(() => {
        setSelectedCompetencies(new Set(template.competencies));
        setSelectedGeneralTopics(new Set(template.generalTopics));
        setManualQuestions(new Set(template.manualQuestions));
        console.log("Single template loaded:", {
          competencies: template.competencies,
          topics: template.generalTopics,
          questions: template.manualQuestions,
        });
      }, 50);

      // Dropdown'ı temizle
      setSelectedTemplate("");
    }

    setModalContent({
      title: "Şablon Yüklendi",
      message: `"${template.name}" şablonu başarıyla yüklendi!`,
    });
    setShowSuccessModal(true);
  };

  const saveTemplate = (isBulk = false) => {
    const competenciesSet = isBulk
      ? bulkSelectedCompetencies
      : selectedCompetencies;
    const topicsSet = isBulk
      ? bulkSelectedGeneralTopics
      : selectedGeneralTopics;
    const questionsSet = isBulk ? bulkManualQuestions : manualQuestions;

    // Boş şablon kontrolü
    if (
      competenciesSet.size === 0 &&
      topicsSet.size === 0 &&
      questionsSet.size === 0
    ) {
      setModalContent({
        title: "Boş Şablon",
        message: "En az bir yetkinlik, konu veya soru seçmelisiniz!",
      });
      setShowErrorModal(true);
      return;
    }

    // Şablon kaydetme için basit bir prompt (daha sonra modal'la değiştirilebilir)
    const templateName = prompt("Şablon için bir isim girin:");
    if (templateName && templateName.trim()) {
      const newTemplate = {
        id: "tpl" + Date.now(),
        name: templateName.trim(),
        competencies: Array.from(competenciesSet),
        generalTopics: Array.from(topicsSet),
        manualQuestions: Array.from(questionsSet),
      };

      console.log("Saving template:", newTemplate); // Debug

      // State'i güncelle ki yeni şablon listede görünsün
      setQuestionTemplates((prev) => [...prev, newTemplate]);
      setModalContent({
        title: "Şablon Kaydedildi",
        message: `"${templateName}" şablonu başarıyla kaydedildi!`,
      });
      setShowSuccessModal(true);
    }
  };

  // Interview Modal fonksiyonları
  const handleStartInterview = (candidate: any) => {
    setSelectedCandidateForInterview(candidate);
    // Reset states
    setInterviewLanguage("tr");
    setAssessSecondLanguage(false);
    setSelectedCompetencies(new Set(["Problem Çözme", "Teknik Bilgi"])); // Default selections
    setSelectedGeneralTopics(new Set());
    setManualQuestions(new Set());
    setCustomQuestionInput("");
    setSelectedTemplate("");
    setShowInterviewSetupModal(true);
  };

  const handleBulkInterview = () => {
    if (selectedCandidates.size === 0) return;
    // Reset bulk states
    setBulkInterviewLanguage("tr");
    setBulkAssessSecondLanguage(false);
    setBulkSelectedCompetencies(new Set(["Problem Çözme", "Teknik Bilgi"])); // Default selections
    setBulkSelectedGeneralTopics(new Set());
    setBulkManualQuestions(new Set());
    setBulkCustomQuestionInput("");
    setBulkSelectedTemplate("");
    setShowBulkInterviewSetupModal(true);
  };

  // Competency/Topic handlers
  const toggleCompetency = (competency: string, isBulk = false) => {
    if (isBulk) {
      const newSet = new Set(bulkSelectedCompetencies);
      if (newSet.has(competency)) {
        newSet.delete(competency);
      } else {
        newSet.add(competency);
      }
      setBulkSelectedCompetencies(newSet);
    } else {
      const newSet = new Set(selectedCompetencies);
      if (newSet.has(competency)) {
        newSet.delete(competency);
      } else {
        newSet.add(competency);
      }
      setSelectedCompetencies(newSet);
    }
  };

  const toggleGeneralTopic = (topic: string, isBulk = false) => {
    if (isBulk) {
      const newSet = new Set(bulkSelectedGeneralTopics);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      setBulkSelectedGeneralTopics(newSet);
    } else {
      const newSet = new Set(selectedGeneralTopics);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      setSelectedGeneralTopics(newSet);
    }
  };

  const addCustomQuestion = (isBulk = false) => {
    const input = isBulk ? bulkCustomQuestionInput : customQuestionInput;
    if (input.trim()) {
      if (isBulk) {
        setBulkManualQuestions(new Set([...bulkManualQuestions, input.trim()]));
        setBulkCustomQuestionInput("");
      } else {
        setManualQuestions(new Set([...manualQuestions, input.trim()]));
        setCustomQuestionInput("");
      }
    }
  };

  const handleStartInterviewProcess = () => {
    setModalContent({
      title: "Mülakat Başlatıldı",
      message: `${selectedCandidateForInterview?.name} için mülakat başlatılıyor...`,
    });
    setShowSuccessModal(true);
    setShowInterviewSetupModal(false);
  };

  const handleStartBulkInterviewProcess = () => {
    setModalContent({
      title: "Toplu Mülakat Başlatıldı",
      message: `${selectedCandidates.size} aday için toplu mülakat başlatılıyor...`,
    });
    setShowSuccessModal(true);
    setShowBulkInterviewSetupModal(false);
    setSelectedCandidates(new Set()); // Clear selections
    setSelectAll(false);
  };

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

  // Aday karşılaştırma fonksiyonları
  const handleCompareSelected = () => {
    if (selectedCandidates.size === 2) {
      const candidateIds = Array.from(selectedCandidates);
      const candidatesData = candidateIds
        .map((id) => candidates.find((c) => c.id === id))
        .filter(Boolean);

      setComparisonCandidates(candidatesData);
      setShowComparisonModal(true);
    } else {
      setModalContent({
        title: "Seçim Hatası",
        message: "Karşılaştırma için tam olarak 2 aday seçmelisiniz.",
      });
      setShowErrorModal(true);
    }
  };

  const handleCloseComparisonModal = () => {
    setShowComparisonModal(false);
    setSelectedCandidates(new Set()); // Seçimleri temizle
    setSelectAll(false);
    setComparisonCandidates([]);
  };

  // Radar chart oluşturma fonksiyonu
  const createRadarChart = (
    canvasId: string,
    candidate: any,
    bgColor: string,
    borderColor: string
  ) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Eğer önceki chart varsa yok et
    if ((canvas as any).chart) {
      (canvas as any).chart.destroy();
    }

    const chart = new (window as any).Chart(ctx, {
      type: "radar",
      data: {
        labels: Object.keys(candidate.skills || {}),
        datasets: [
          {
            label: candidate.name,
            data: Object.values(candidate.skills || {}),
            fill: true,
            backgroundColor: bgColor,
            borderColor: borderColor,
            pointBackgroundColor: borderColor,
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: borderColor,
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            top: 30,
            bottom: 30,
            left: 30,
            right: 30,
          },
        },
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        scales: {
          r: {
            angleLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: {
              stepSize: 2,
              display: true,
              font: {
                size: 10,
              },
              color: "rgba(0, 0, 0, 0.4)",
            },
            pointLabels: {
              font: {
                size: 11,
                weight: "normal",
              },
              color: "rgba(0, 0, 0, 0.7)",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Chart'ı canvas'a kaydet ki sonra yok edebilsin
    (canvas as any).chart = chart;
  };

  return (
    <DashboardLayout title="Aday Havuzu - HiriBot" activeSection="candidates">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white p-6 mb-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold mb-1 flex items-center">
                  <FaUsers className="mr-3 text-2xl" />
                  Adaylar
                </h1>
                <p className="text-purple-100 text-base">
                  Aday havuzunuzu yönetin ve yetenekleri keşfedin
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setCandidates([...DUMMY_CANDIDATES]);
                    setModalContent({
                      title: "Liste Yenilendi",
                      message: `${DUMMY_CANDIDATES.length} aday yüklendi.`,
                    });
                    setShowSuccessModal(true);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center text-sm border border-white/20"
                  title="Listeyi Yenile"
                >
                  <FaSyncAlt className="mr-2" />
                  Yenile
                </button>
                <button
                  onClick={() => router.push("/candidates/create")}
                  className="bg-white text-purple-700 hover:bg-purple-50 font-semibold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center text-sm"
                >
                  <FaPlus className="mr-2" />
                  Yeni Aday Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtreler - Responsive */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="space-y-4">
            {/* Arama - Full width on mobile */}
            <div className="w-full relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Aday ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filtreler - Stack on mobile, inline on desktop */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Tüm Pozisyonlar</option>
                {uniquePositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Tüm Durumlar</option>
                {allStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Çoklu Seçim ve Toplu İşlemler */}
          {(selectedCandidates.size > 0 || filteredCandidates.length > 0) && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-600">
                    Tümünü Seç{" "}
                    {selectedCandidates.size > 0 &&
                      `(${selectedCandidates.size})`}
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCompareSelected}
                  disabled={selectedCandidates.size !== 2}
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors justify-center ${
                    selectedCandidates.size === 2
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <i className="fas fa-balance-scale w-3 h-3 mr-1.5" />
                  Karşılaştır ({selectedCandidates.size}/2)
                </button>
                <button
                  onClick={handleBulkInterview}
                  disabled={selectedCandidates.size === 0}
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors justify-center ${
                    selectedCandidates.size > 0
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaVideo className="w-3 h-3 mr-1.5" />
                  Mülakat ({selectedCandidates.size})
                </button>
                <button
                  onClick={() =>
                    selectedCandidates.size > 0
                      ? alert("Toplu e-posta özelliği geliştiriliyor.")
                      : null
                  }
                  disabled={selectedCandidates.size === 0}
                  className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors justify-center ${
                    selectedCandidates.size > 0
                      ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "border border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                  }`}
                >
                  <FaPaperPlane className="w-3 h-3 mr-1.5" />
                  E-posta ({selectedCandidates.size})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tablo Container */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Başlık */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{filteredCandidates.length}</span>{" "}
                aday gösteriliyor
              </p>
              {(searchTerm || selectedPosition || selectedStatus) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedPosition("");
                    setSelectedStatus("");
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </div>

          {/* Tablo */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-3 sm:px-6 py-3 text-left">
                    <span className="sr-only">Seç</span>
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aday
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Pozisyon
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    CV
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Uyumluluk
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCandidates.map((candidate) => {
                  const status = getCandidateStatus(candidate);
                  const isSelected = selectedCandidates.has(candidate.id);

                  return (
                    <tr
                      key={candidate.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isSelected ? "bg-purple-50" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 sm:px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectCandidate(
                              candidate.id,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                        />
                      </td>

                      {/* Aday Bilgileri */}
                      <td className="px-3 sm:px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {candidate.name} {candidate.surname}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 truncate">
                            {candidate.email}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {candidate.position}
                          </div>
                        </div>
                      </td>

                      {/* Pozisyon - Hidden on mobile */}
                      <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                        <div className="text-sm text-gray-900">
                          {candidate.position}
                        </div>
                      </td>

                      {/* CV - Hidden on mobile/small tablet */}
                      <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                        {candidate.cvText ? (
                          <button
                            onClick={() => handleShowCv(candidate)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                            title="CV'yi Görüntüle"
                          >
                            <FaFileAlt className="w-3 h-3 mr-1" />
                            Görüntüle
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">CV Yok</span>
                        )}
                      </td>

                      {/* Durum */}
                      <td className="px-3 sm:px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getStatusTagClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Uyumluluk - Hidden on smaller screens */}
                      <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div
                              className="w-full bg-gray-200 rounded-full h-2 cursor-help"
                              onMouseEnter={(e) =>
                                handleTooltipShow(candidate.id, e)
                              }
                              onMouseLeave={handleTooltipHide}
                            >
                              <div
                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${candidate.compatibilityScore}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                            {candidate.compatibilityScore}%
                          </span>
                        </div>
                      </td>

                      {/* İşlemler */}
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handleViewCandidate(candidate.id)}
                            className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"
                            title="Detayları Görüntüle"
                          >
                            <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleStartInterview(candidate)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Mülakat Başlat"
                          >
                            <FaVideo className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          {/* CV button for mobile - show when CV column is hidden */}
                          {candidate.cvText && (
                            <button
                              onClick={() => handleShowCv(candidate)}
                              className="p-1.5 text-gray-400 hover:text-green-600 transition-colors md:hidden"
                              title="CV Görüntüle"
                            >
                              <FaFileAlt className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Boş Durum */}
            {filteredCandidates.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="text-gray-400 mb-4">
                  <FaSearch className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aday bulunamadı
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedPosition || selectedStatus
                    ? "Arama kriterlerinize uygun aday bulunmuyor."
                    : "Henüz aday eklenmemiş."}
                </p>
                {(searchTerm || selectedPosition || selectedStatus) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedPosition("");
                      setSelectedStatus("");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Filtreleri Temizle
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CV Modal */}
        {showCvModal && (
          <ModalPortal>
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
              onClick={() => setShowCvModal(false)}
            >
              <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                    {selectedCandidateName} - CV İçeriği
                  </h2>
                  <button
                    onClick={() => setShowCvModal(false)}
                    className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-grow overflow-auto p-6">
                  <pre className="bg-gray-50 p-4 rounded-md text-xs leading-relaxed whitespace-pre-wrap font-mono">
                    {selectedCvText}
                  </pre>
                </div>
              </div>
            </div>
          </ModalPortal>
        )}

        {/* Single Interview Setup Modal */}
        {showInterviewSetupModal && (
          <ModalPortal>
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
              onClick={() => setShowInterviewSetupModal(false)}
            >
              <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    HiriBot Mülakatı Başlat
                  </h2>
                  <button
                    onClick={() => setShowInterviewSetupModal(false)}
                    className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-grow overflow-auto p-4 sm:p-6">
                  <p className="mb-4 text-sm sm:text-base">
                    Seçilen Aday:{" "}
                    <strong>
                      {selectedCandidateForInterview?.name}{" "}
                      {selectedCandidateForInterview?.surname}
                    </strong>{" "}
                    - {selectedCandidateForInterview?.position}
                  </p>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-purple-800 mb-2">
                      CV Analizi Özeti (Simülasyon)
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      HiriBot, adayın CV'sini otomatik olarak analiz etti:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      <li>
                        Belirtilen Yetkinlikler: Proje Yönetimi, Python, Veri
                        Analizi
                      </li>
                      <li>
                        Eksik/Net Olmayan Alanlar: Liderlik Deneyimi, Çatışma
                        Çözme Becerisi
                      </li>
                    </ul>
                  </div>

                  {/* Şablon Yükle */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Şablon Yükle:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Önceden kaydettiğiniz bir soru şablonunu yükleyerek mevcut
                      seçimleri otomatik doldurun.
                    </p>
                    <div className="flex gap-2">
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                      >
                        <option value="">Şablon Seçiniz</option>
                        {questionTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          selectedTemplate &&
                          loadTemplate(selectedTemplate, false)
                        }
                        disabled={!selectedTemplate}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Yükle
                      </button>
                    </div>
                  </div>

                  {/* Mülakat Dili */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Mülakat Dili:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      HiriBot adayı bu dilde karşılayacak ve tüm mülakatı bu
                      dilde yürütecektir.
                    </p>
                    <select
                      value={interviewLanguage}
                      onChange={(e) => setInterviewLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  {/* İkinci Dil Yetkinliği */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Ek Dil Yetkinliği Değerlendir:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Adayın mülakat sırasında ek bir dilde (örn. İngilizce)
                      yetkinliğinin değerlendirilmesini ister misiniz?
                    </p>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={assessSecondLanguage}
                        onChange={(e) =>
                          setAssessSecondLanguage(e.target.checked)
                        }
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                      />
                      <label className="text-gray-700 font-medium">
                        İngilizce Yetkinliğini Değerlendir
                      </label>
                    </div>
                  </div>

                  {/* Yetkinlikler */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Pozisyona Özel Yetkinlikler (Soru Kütüphanesi):
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      HiriBot'un mülakat sırasında hangi yetkinlikler üzerine
                      odaklanmasını istersiniz?
                    </p>
                    <div className="flex flex-wrap gap-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      {competencies.map((competency) => (
                        <button
                          key={competency}
                          onClick={() => toggleCompetency(competency)}
                          className={`px-3 py-2 rounded-md border font-medium transition-colors text-sm ${
                            selectedCompetencies.has(competency)
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                          }`}
                        >
                          {competency}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Seçilen yetkinlikler:{" "}
                        {selectedCompetencies.size > 0
                          ? Array.from(selectedCompetencies).join(", ")
                          : "Yok"}
                      </p>
                    </div>
                  </div>

                  {/* Genel Konular */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Ek Bilgiler ve Özel Konular:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Adaydan mülakat sırasında öğrenmek istediğiniz CV dışı
                      genel bilgileri seçin.
                    </p>
                    <div className="flex flex-wrap gap-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      {generalTopics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => toggleGeneralTopic(topic)}
                          className={`px-3 py-2 rounded-md border font-medium transition-colors text-sm ${
                            selectedGeneralTopics.has(topic)
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Seçilen konular:{" "}
                        {selectedGeneralTopics.size > 0
                          ? Array.from(selectedGeneralTopics).join(", ")
                          : "Yok"}
                      </p>
                    </div>
                  </div>

                  {/* Manuel Soru Ekle */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Manuel Özel Soru Ekle:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      HiriBot'un adaya sormasını istediğiniz spesifik bir soru
                      ekleyin.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customQuestionInput}
                        onChange={(e) => setCustomQuestionInput(e.target.value)}
                        placeholder="Örn: X projesindeki rolünüz neydi?"
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      />
                      <button
                        onClick={() => addCustomQuestion()}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                      >
                        Soru Ekle
                      </button>
                    </div>
                    {manualQuestions.size > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                          Eklenen manuel sorular:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {Array.from(manualQuestions).map(
                            (question, index) => (
                              <li key={index}>{question}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t">
                  <button
                    onClick={() => saveTemplate(false)}
                    className="px-4 py-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    Şablon Olarak Kaydet
                  </button>
                  <button
                    onClick={() => setShowInterviewSetupModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleStartInterviewProcess}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Mülakatı Başlat
                  </button>
                </div>
              </div>
            </div>
          </ModalPortal>
        )}

        {/* Bulk Interview Setup Modal */}
        {showBulkInterviewSetupModal && (
          <ModalPortal>
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
              onClick={() => setShowBulkInterviewSetupModal(false)}
            >
              <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Toplu Mülakat Daveti Gönder
                  </h2>
                  <button
                    onClick={() => setShowBulkInterviewSetupModal(false)}
                    className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-grow overflow-auto p-4 sm:p-6">
                  <p className="mb-4 text-sm sm:text-base">
                    <strong>{selectedCandidates.size}</strong> Aday için toplu
                    mülakat ayarları:
                  </p>

                  {/* Şablon Yükle */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Şablon Yükle:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Önceden kaydettiğiniz bir soru şablonunu yükleyerek mevcut
                      seçimleri otomatik doldurun.
                    </p>
                    <div className="flex gap-2">
                      <select
                        value={bulkSelectedTemplate}
                        onChange={(e) =>
                          setBulkSelectedTemplate(e.target.value)
                        }
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                      >
                        <option value="">Şablon Seçiniz</option>
                        {questionTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          bulkSelectedTemplate &&
                          loadTemplate(bulkSelectedTemplate, true)
                        }
                        disabled={!bulkSelectedTemplate}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Yükle
                      </button>
                    </div>
                  </div>

                  {/* Mülakat Dili */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Mülakat Dili:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      HiriBot adayları bu dilde karşılayacak ve tüm mülakatı bu
                      dilde yürütecektir.
                    </p>
                    <select
                      value={bulkInterviewLanguage}
                      onChange={(e) => setBulkInterviewLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  {/* İkinci Dil Yetkinliği */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Ek Dil Yetkinliği Değerlendir:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Adayların mülakat sırasında ek bir dilde (örn. İngilizce)
                      yetkinliğinin değerlendirilmesini ister misiniz?
                    </p>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={bulkAssessSecondLanguage}
                        onChange={(e) =>
                          setBulkAssessSecondLanguage(e.target.checked)
                        }
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                      />
                      <label className="text-gray-700 font-medium">
                        İngilizce Yetkinliğini Değerlendir
                      </label>
                    </div>
                  </div>

                  {/* Yetkinlikler */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Pozisyona Özel Yetkinlikler (Soru Kütüphanesi):
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      HiriBot'un mülakat sırasında hangi yetkinlikler üzerine
                      odaklanmasını istersiniz?
                    </p>
                    <div className="flex flex-wrap gap-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      {competencies.map((competency) => (
                        <button
                          key={competency}
                          onClick={() => toggleCompetency(competency, true)}
                          className={`px-3 py-2 rounded-md border font-medium transition-colors text-sm ${
                            bulkSelectedCompetencies.has(competency)
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                          }`}
                        >
                          {competency}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Seçilen yetkinlikler:{" "}
                        {bulkSelectedCompetencies.size > 0
                          ? Array.from(bulkSelectedCompetencies).join(", ")
                          : "Yok"}
                      </p>
                    </div>
                  </div>

                  {/* Genel Konular */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Ek Bilgiler ve Özel Konular:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Adaylardan mülakat sırasında öğrenmek istediğiniz CV dışı
                      genel bilgileri seçin.
                    </p>
                    <div className="flex flex-wrap gap-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      {generalTopics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => toggleGeneralTopic(topic, true)}
                          className={`px-3 py-2 rounded-md border font-medium transition-colors text-sm ${
                            bulkSelectedGeneralTopics.has(topic)
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-purple-300"
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Seçilen konular:{" "}
                        {bulkSelectedGeneralTopics.size > 0
                          ? Array.from(bulkSelectedGeneralTopics).join(", ")
                          : "Yok"}
                      </p>
                    </div>
                  </div>

                  {/* Manuel Soru Ekle */}
                  <div className="mb-6">
                    <label className="block text-base font-semibold mb-2">
                      Manuel Özel Soru Ekle:
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      HiriBot'un adaylara sormasını istediğiniz spesifik bir
                      soru ekleyin.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bulkCustomQuestionInput}
                        onChange={(e) =>
                          setBulkCustomQuestionInput(e.target.value)
                        }
                        placeholder="Örn: X projesindeki rolünüz neydi?"
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      />
                      <button
                        onClick={() => addCustomQuestion(true)}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                      >
                        Soru Ekle
                      </button>
                    </div>
                    {bulkManualQuestions.size > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                          Eklenen manuel sorular:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {Array.from(bulkManualQuestions).map(
                            (question, index) => (
                              <li key={index}>{question}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t">
                  <button
                    onClick={() => saveTemplate(true)}
                    className="px-4 py-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    Şablon Olarak Kaydet
                  </button>
                  <button
                    onClick={() => setShowBulkInterviewSetupModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleStartBulkInterviewProcess}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Davetleri Gönder ve Mülakatları Başlat
                  </button>
                </div>
              </div>
            </div>
          </ModalPortal>
        )}

        {/* Aday Karşılaştırma Modal */}
        {showComparisonModal && comparisonCandidates.length === 2 && (
          <ModalPortal>
            <div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
              style={{ zIndex: 9999 }}
              onClick={handleCloseComparisonModal}
            >
              <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h2 className="text-3xl font-bold text-slate-700">
                    Aday Karşılaştırma Analizi
                  </h2>
                  <button
                    onClick={handleCloseComparisonModal}
                    className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {comparisonCandidates.map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className="border p-4 rounded-lg bg-white shadow-sm"
                      >
                        <h3 className="text-xl font-bold text-center mb-4">
                          {candidate.name} {candidate.surname}
                        </h3>

                        <canvas id={`chart-${candidate.id}`}></canvas>

                        <div className="mt-4">
                          <h4 className="font-semibold text-green-600">
                            Güçlü Yönler
                          </h4>
                          <ul className="list-disc list-inside text-sm text-slate-600">
                            {candidate.strengths?.map(
                              (strength: string, idx: number) => (
                                <li key={idx}>{strength}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="mt-2">
                          <h4 className="font-semibold text-red-600">
                            Gelişime Açık Yönler
                          </h4>
                          <ul className="list-disc list-inside text-sm text-slate-600">
                            {candidate.weaknesses?.map(
                              (weakness: string, idx: number) => (
                                <li key={idx}>{weakness}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                    <h3 className="font-bold text-lg text-indigo-800 mb-2 flex items-center gap-2">
                      <i className="fas fa-robot"></i> Yapay Zeka Karşılaştırma
                      Analizi
                    </h3>
                    <p
                      className="text-sm text-indigo-900"
                      dangerouslySetInnerHTML={{
                        __html: (() => {
                          const key1 = `${comparisonCandidates[0].id}_${comparisonCandidates[1].id}`;
                          const key2 = `${comparisonCandidates[1].id}_${comparisonCandidates[0].id}`;
                          const analysis =
                            (AI_COMPARISON_ANALYSES as any)[key1] ||
                            (AI_COMPARISON_ANALYSES as any)[key2] ||
                            "Bu iki aday için henüz karşılaştırma analizi oluşturulmamış.";
                          return analysis.replace(
                            /\*\*(.*?)\*\*/g,
                            "<strong>$1</strong>"
                          );
                        })(),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ModalPortal>
        )}

        {/* Tooltip */}
        {activeTooltip && (
          <TooltipPortal>
            <div
              className="fixed pointer-events-none z-50"
              style={{
                left: tooltipPosition.x - 150,
                top: tooltipPosition.y - 120,
              }}
            >
              <div className="w-80 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-xl">
                <div className="space-y-2">
                  {(() => {
                    const candidate = filteredCandidates.find(
                      (c) => c.id === activeTooltip
                    );
                    return candidate?.compatibilityReasons.map(
                      (reason, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span className="leading-relaxed">{reason}</span>
                        </div>
                      )
                    );
                  })()}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </TooltipPortal>
        )}

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

        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={confirmationAction}
          title={modalContent.title}
          message={modalContent.message}
        />
      </div>
    </DashboardLayout>
  );
}
