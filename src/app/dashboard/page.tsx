"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FaTh, FaPlus, FaChartBar } from "react-icons/fa";

export default function DashboardPage() {
  const router = useRouter();

  // State management for dashboard content
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] =
    useState<any>(null);
  const [selectedInterviewForReport, setSelectedInterviewForReport] =
    useState<any>(null);
  const [currentSelectedCompetencies, setCurrentSelectedCompetencies] =
    useState<Set<string>>(new Set());
  const [currentSelectedGeneralTopics, setCurrentSelectedGeneralTopics] =
    useState<Set<string>>(new Set());
  const [currentSelectedManualQuestions, setCurrentSelectedManualQuestions] =
    useState<Set<string>>(new Set());
  const [bulkSelectedCandidates, setBulkSelectedCandidates] = useState<
    Set<string>
  >(new Set());
  const [bulkCurrentSelectedCompetencies, setBulkCurrentSelectedCompetencies] =
    useState<Set<string>>(new Set());
  const [
    bulkCurrentSelectedGeneralTopics,
    setBulkCurrentSelectedGeneralTopics,
  ] = useState<Set<string>>(new Set());
  const [
    bulkCurrentSelectedManualQuestions,
    setBulkCurrentSelectedManualQuestions,
  ] = useState<Set<string>>(new Set());

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // CV Modal states
  const [showCvModal, setShowCvModal] = useState(false);
  const [selectedCvText, setSelectedCvText] = useState("");
  const [selectedCandidateName, setSelectedCandidateName] = useState("");

  // Comparison Modal states
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonCandidates, setComparisonCandidates] = useState<any[]>([]);

  // Modal states
  const [showInterviewSetupModal, setShowInterviewSetupModal] = useState(false);
  const [showBulkInterviewSetupModal, setShowBulkInterviewSetupModal] =
    useState(false);
  const [showInterviewReportModal, setShowInterviewReportModal] =
    useState(false);
  const [showAdditionalFormViewModal, setShowAdditionalFormViewModal] =
    useState(false);

  // Data with comprehensive candidate information
  const DUMMY_DATA = {
    candidates: [
      {
        id: "c1",
        name: "Ayşe Yılmaz",
        email: "ayse.yilmaz@email.com",
        position: "Yazılım Geliştirici",
        cvUrl: "#",
        status: "Beklemede",
        compatibilityScore: 92,
        compatibilityReasons: [
          "Güçlü teknik beceriler",
          "Proje yönetimi deneyimi",
          "Takım çalışmasına uygun",
        ],
        skills: {
          JavaScript: 9,
          React: 8,
          "Node.js": 8,
          Python: 7,
          Liderlik: 6,
          İletişim: 8,
        },
        strengths: [
          "Full-stack geliştirme deneyimi",
          "Modern teknolojilere hakimiyet",
          "Takım çalışması ve mentorluk",
        ],
        weaknesses: [
          "Liderlik deneyimi sınırlı",
          "Büyük ölçekli sistem mimarisi",
        ],
        cvText: `AYŞE YILMAZ
Senior Yazılım Geliştirici

İLETİŞİM BİLGİLERİ
Email: ayse.yilmaz@email.com
Telefon: +90 555 123 4567
LinkedIn: linkedin.com/in/ayseyilmaz
GitHub: github.com/ayseyilmaz

ÖZET
5+ yıl deneyimli full-stack yazılım geliştirici. Modern web teknolojileri ile ölçeklenebilir uygulamalar geliştirme konusunda uzman. Takım liderliği ve mentorluk deneyimi.

DENEYİM

Senior Yazılım Geliştirici | ABC Teknoloji | 2021 - Günümüz
• React ve Node.js kullanarak e-ticaret platformu geliştirme (500K+ kullanıcı)
• Mikroservis mimarisi tasarımı ve implementasyonu
• Junior geliştiricilere mentorluk ve code review süreçleri
• CI/CD pipeline kurulumu ve DevOps süreçleri
• PostgreSQL ve Redis ile veritabanı optimizasyonu

Yazılım Geliştirici | XYZ Yazılım | 2019 - 2021
• React tabanlı SaaS uygulaması geliştirme
• RESTful API tasarımı ve geliştirme
• Unit test ve integration test yazımı
• Agile/Scrum metodolojileri ile çalışma

Junior Yazılım Geliştirici | Tech Startup | 2018 - 2019
• JavaScript ile web uygulaması geliştirme
• HTML5, CSS3, Bootstrap ile responsive tasarım
• Git versiyon kontrolü ve ekip çalışması

EĞİTİM
Bilgisayar Mühendisliği Lisans | İstanbul Teknik Üniversitesi | 2014 - 2018
• GPA: 3.2/4.0
• Mezuniyet Projesi: "Machine Learning ile Müşteri Davranış Analizi"

SERTİFİKALAR
• AWS Certified Developer Associate (2022)
• React Advanced Patterns Certification (2021)
• Node.js Professional Certification (2020)

TEKNİK YETENEKLER
Frontend: React, Vue.js, TypeScript, HTML5, CSS3, SASS
Backend: Node.js, Express.js, Python, Django, FastAPI
Veritabanı: PostgreSQL, MongoDB, Redis
Cloud: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes
Araçlar: Git, Webpack, Jest, Cypress, Jira

DİLLER
• Türkçe (Ana dil)
• İngilizce (C1 - İleri seviye)
• Almanca (A2 - Başlangıç)

PROJELER
E-Ticaret Platformu (2022-2023)
• React, Node.js, PostgreSQL kullanarak geliştirildi
• 500K+ aktif kullanıcı, günlük 50K+ işlem
• Mikroservis mimarisi, Docker containerization

Task Management SaaS (2020-2021)
• Vue.js frontend, Python Django backend
• Real-time bildirimler için WebSocket
• Stripe entegrasyonu ile ödeme sistemi`,
      },
      // ... (other candidates would continue here but truncated for brevity)
    ],
    interviews: [
      {
        id: "i1",
        candidateId: "c1",
        candidateName: "Ayşe Yılmaz",
        position: "Yazılım Geliştirici",
        status: "Tamamlandı",
        startDate: "2025-07-10 10:00",
        endDate: "2025-07-10 10:15",
        report: {
          summary:
            "Ayşe Yılmaz, yazılım geliştirme alanındaki güçlü teknik bilgisi ve problem çözme becerileriyle dikkat çekiyor. Ekip çalışmasına yatkınlığı ve öğrenmeye açık yapısı pozisyon için olumlu. Ancak liderlik deneyimi konusunda daha fazla detay alınması faydalı olacaktır.",
          score: 85,
          qa: [
            {
              q: "Kendinizden ve kariyer hedeflerinizden bahseder misiniz?",
              a: "Ayşe, X Üniversitesi'nden mezun olduğunu ve Y yıldır yazılım geliştirme alanında çalıştığını belirtti. Kariyer hedefinin Full-Stack Developer olarak uzmanlaşmak olduğunu ifade etti.",
            },
          ],
          competencies: [
            { name: "Teknik Bilgi", score: "Yüksek" },
            { name: "Problem Çözme", score: "Yüksek" },
            { name: "Ekip Çalışması", score: "Orta-Yüksek" },
            { name: "Liderlik", score: "Düşük (Geliştirilebilir)" },
            { name: "İletişim", score: "Orta" },
          ],
          secondLanguage: {
            score: "B2 (Upper-Intermediate)",
            summary:
              "Adayın İngilizce konuşma akıcılığı iyi seviyede. Karmaşık cümleler kurabiliyor ve kendini rahat ifade edebiliyor. Telaffuzda küçük aksaklıklar mevcut ancak anlaşılırlığı etkilemiyor.",
          },
          missingInfo: [
            "Liderlik deneyimi örnekleri",
            "Çatışma çözme becerisi",
          ],
        },
        additionalForm: null,
      },
    ],
    defaultCompetencies: ["Problem Çözme", "Teknik Bilgi"],
    questionTemplates: [
      {
        id: "tpl1",
        name: "Yazılım Geliştirici Temel Mülakat",
        competencies: ["Teknik Bilgi", "Problem Çözme", "Ekip Çalışması"],
        generalTopics: ["Maaş Beklentisi", "Hibrit Çalışma Uyumu"],
        manualQuestions: ["Son 6 ayda öğrendiğiniz yeni bir teknoloji var mı?"],
      },
    ],
  };

  // Helper functions
  const toggleCompetency = (competency: string, isBulk = false) => {
    if (isBulk) {
      const newSet = new Set(bulkCurrentSelectedCompetencies);
      if (newSet.has(competency)) {
        newSet.delete(competency);
      } else {
        newSet.add(competency);
      }
      setBulkCurrentSelectedCompetencies(newSet);
    } else {
      const newSet = new Set(currentSelectedCompetencies);
      if (newSet.has(competency)) {
        newSet.delete(competency);
      } else {
        newSet.add(competency);
      }
      setCurrentSelectedCompetencies(newSet);
    }
  };

  const toggleGeneralTopic = (topic: string, isBulk = false) => {
    if (isBulk) {
      const newSet = new Set(bulkCurrentSelectedGeneralTopics);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      setBulkCurrentSelectedGeneralTopics(newSet);
    } else {
      const newSet = new Set(currentSelectedGeneralTopics);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      setCurrentSelectedGeneralTopics(newSet);
    }
  };

  const toggleCandidateSelection = (candidateId: string) => {
    const newSet = new Set(bulkSelectedCandidates);
    if (newSet.has(candidateId)) {
      newSet.delete(candidateId);
    } else {
      newSet.add(candidateId);
    }
    setBulkSelectedCandidates(newSet);
  };

  const openInterviewSetupModal = (candidateId: string) => {
    const candidate = DUMMY_DATA.candidates.find((c) => c.id === candidateId);
    if (candidate) {
      setSelectedCandidateForInterview(candidate);
      setShowInterviewSetupModal(true);
    }
  };

  const openInterviewReportModal = (interviewId: string) => {
    const interview = DUMMY_DATA.interviews.find((i) => i.id === interviewId);
    if (interview) {
      setSelectedInterviewForReport(interview);
      setShowInterviewReportModal(true);
    }
  };

  const handleShowCv = (candidate: any) => {
    if (candidate.cvText) {
      setSelectedCvText(candidate.cvText);
      setSelectedCandidateName(candidate.name);
      setShowCvModal(true);
    } else {
      alert("Bu aday için CV metni bulunamadı.");
    }
  };

  // Filter candidates
  const uniquePositions = [
    ...new Set(DUMMY_DATA.candidates.map((c) => c.position)),
  ].sort();
  const allStatuses = [
    "Beklemede",
    "Mülakatta",
    "Değerlendiriliyor",
    "Tamamlandı",
  ];

  const filteredCandidates = DUMMY_DATA.candidates.filter((candidate) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      candidate.name.toLowerCase().includes(search) ||
      candidate.position.toLowerCase().includes(search);

    const matchesPosition =
      selectedPosition === "" || candidate.position === selectedPosition;
    const matchesStatus =
      selectedStatus === "" || candidate.status === selectedStatus;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  // Comparison functions
  const handleCompareSelected = () => {
    if (bulkSelectedCandidates.size === 2) {
      const candidateIds = Array.from(bulkSelectedCandidates);
      const candidatesData = candidateIds
        .map((id) => DUMMY_DATA.candidates.find((c) => c.id === id))
        .filter(Boolean);

      setComparisonCandidates(candidatesData);
      setShowComparisonModal(true);
    } else {
      alert("Karşılaştırma için tam olarak 2 aday seçmelisiniz.");
    }
  };

  const handleCloseComparisonModal = () => {
    setShowComparisonModal(false);
    setBulkSelectedCandidates(new Set()); // Clear selections
    setComparisonCandidates([]);
  };

  return (
    <DashboardLayout title="HiriBot İK Dashboard" activeSection="dashboard">
      {/* Dashboard Section */}
      {activeSection === "dashboard" && (
        <section>
          {/* Header Section with Gradient */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white p-6 mb-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="mb-4 lg:mb-0">
                  <h1 className="text-3xl font-bold mb-1 flex items-center">
                    <FaTh className="mr-3 text-2xl" />
                    Dashboard
                  </h1>
                  <p className="text-purple-100 text-base">
                    İK süreçlerinizi yönetmek için hazırlanmış modern dashboard
                  </p>
                </div>
                <button
                  onClick={() => router.push("/positions/create")}
                  className="bg-white text-purple-700 hover:bg-purple-50 font-semibold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center text-sm"
                >
                  <FaPlus className="mr-2" />
                  Hızlı Başlat
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Candidates Card */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 3a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    +12%
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">125</p>
                  <p className="text-sm text-gray-600">Toplam Aday</p>
                </div>
              </div>
            </div>

            {/* Completed Interviews Card */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    +8%
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">42</p>
                  <p className="text-sm text-gray-600">Tamamlanan Mülakat</p>
                </div>
              </div>
            </div>

            {/* Pending Interviews Card */}
            <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    -2
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">8</p>
                  <p className="text-sm text-gray-600">Bekleyen Mülakat</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other sections (candidates, interviews, reports) would be here */}
      {activeSection === "candidates" && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Adaylar Sayfası
          </h2>
          <p className="text-gray-500">Bu bölüm geliştirme aşamasındadır.</p>
        </div>
      )}

      {activeSection === "interviews" && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Mülakatlar Sayfası
          </h2>
          <p className="text-gray-500">Bu bölüm geliştirme aşamasındadır.</p>
        </div>
      )}

      {activeSection === "reports" && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Raporlar Sayfası
          </h2>
          <p className="text-gray-500">Bu bölüm geliştirme aşamasındadır.</p>
        </div>
      )}

      {/* CV Modal */}
      {showCvModal && (
        <div className="modal is-open">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="text-xl font-semibold">
                {selectedCandidateName} - CV İçeriği
              </h2>
              <button
                className="text-slate-400 hover:text-slate-600 text-2xl"
                onClick={() => setShowCvModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <pre className="bg-gray-50 p-4 rounded-md text-xs leading-relaxed whitespace-pre-wrap font-mono">
                {selectedCvText}
              </pre>
            </div>
            <div className="modal-footer">
              <button
                className="hiri-button hiri-button-secondary"
                onClick={() => setShowCvModal(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
