"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import {
  FaArrowLeft,
  FaFileAlt,
  FaSyncAlt,
  FaVideo,
  FaBolt,
  FaCalendarAlt,
  FaUpload,
  FaDownload,
  FaChartBar,
  FaMagic,
  FaQuestionCircle,
  FaUser,
} from "react-icons/fa";
import { DUMMY_CANDIDATES } from "@/lib/dummy-data";

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

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("genelBakis");
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvSummary, setCvSummary] = useState("");
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewType, setInterviewType] = useState("");
  const [showCompatibilityTooltip, setShowCompatibilityTooltip] =
    useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{
    id: string;
    aday: typeof candidate;
    date: string;
    time: string;
    type: string;
    introduction: string;
    strengths: string[];
    areasForDevelopment: string[];
    overallSummary: {
      communication: string;
      level: string;
      conclusion: string;
    };
  } | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(
    null
  );
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      type: "user" | "assistant";
      content: string;
      timestamp: Date;
    }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showExternalInterviewModal, setShowExternalInterviewModal] =
    useState(false);
  const [externalInterviewForm, setExternalInterviewForm] = useState({
    date: "",
    interviewers: "",
    notes: "",
    notesFile: null as File | null,
    videoFile: null as File | null,
  });
  const candidateId = params.id as string;

  // Merkezi veri kaynağından aday bilgilerini al
  const candidate = DUMMY_CANDIDATES.find((c) => c.id === candidateId);

  const currentCvText = candidate?.cvText || "CV metni bulunamadı.";

  // Debug için modal state'ini izle ve body overflow'u kontrol et
  useEffect(() => {
    if (showCvModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCvModal]);

  // Auto scroll chat to bottom
  useEffect(() => {
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages]);

  // Aksiyon fonksiyonları
  const handleUpdateSummary = () => {
    alert("CV özeti güncelleniyor... (AI işliyor)");
    setCvSummary(candidate?.cvSummary + " (Özet güncellendi)");
    setTimeout(() => {
      alert("CV özeti başarıyla güncellendi!");
    }, 1500);
  };

  const handleShowCv = () => {
    setShowCvModal(true);
  };

  const handleDownloadQuestions = () => {
    const questionsText = `MÜLAKAT SORU ÖNERİLERİ (STAR Tekniği)
Aday: ${candidate?.name} ${candidate?.surname}
Pozisyon: ${candidate?.position}
====================================

GEÇMIŞ DENEYİMLER VE PROBLEM ÇÖZME
--------------------
1. Daha önceki bir rolünüzde karşılaştığınız teknik bir zorluğu, bu zorluktaki temel görevinizi, problemi çözmek için uyguladığınız adımları/kullandığınız yöntemleri ve bu sürecin sonucunu/projeye etkisini detaylandırır mısınız?

2. Bir projede, Java 17 ve üzeri bir versiyon kullanarak yeni özellikleri entegre etmek durumunda kaldınız. Bu projedeki karşılaştığınız zorluklar ve göreviniz nelerdi?

TAKIM ÇALIŞMASI VE İLETİŞİM
--------------------
1. Bir projede, farklı disiplinlerden gelen takım üyeleriyle çalıştınız ve herkesin farklı görüşleri vardı. Bu durumda nasıl bir iletişim stratejisi izlediniz?

2. Zaman baskısı altında bir ekip projesini tamamlamak zorunda kaldığınız bir durumu anlatın.
`;

    const blob = new Blob([questionsText], {
      type: "text/plain;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Mulakat_Sorulari_${
      candidate?.surname
    }_${candidate?.name?.charAt(0)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleChangeQuestion = (
    categoryIndex: number,
    questionIndex: number
  ) => {
    alert(`Soru değiştiriliyor... (AI yeni soru oluşturuyor)`);
    setTimeout(() => {
      alert("Yeni soru oluşturuldu!");
    }, 1000);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCvModal(false);
        setShowInterviewModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Mülakat aksiyon fonksiyonları
  const handleCreateOnDemand = () => {
    router.push(`/interviews/on-demand/create?candidateId=${candidateId}`);
  };

  const handleInstantInvite = () => {
    setInterviewType("instant");
    setShowInterviewModal(true);
  };

  const handleScheduledInterview = () => {
    setInterviewType("scheduled");
    setShowInterviewModal(true);
  };

  const handleExternalInterview = () => {
    setExternalInterviewForm({
      date: "",
      interviewers: "",
      notes: "",
      notesFile: null,
      videoFile: null,
    });
    setShowExternalInterviewModal(true);
  };

  const handleExternalInterviewFormChange = (
    field: string,
    value: string | File | null
  ) => {
    setExternalInterviewForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExternalInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!externalInterviewForm.date) {
      alert("Mülakat tarihi zorunludur!");
      return;
    }

    // Simulate adding external interview to candidate's data
    const newInterview = {
      id: `ext_${Date.now()}`,
      type: "Dış Mülakat",
      date: externalInterviewForm.date,
      time: "",
      status: "Tamamlandı",
      notes: externalInterviewForm.notes || "Dış mülakat kaydı eklendi.",
      hasReport: false,
      interviewers: externalInterviewForm.interviewers,
      files: {
        notes: externalInterviewForm.notesFile?.name,
        video: externalInterviewForm.videoFile?.name,
      },
    };

    alert("Dış mülakat kaydı başarıyla eklendi!");
    setShowExternalInterviewModal(false);
  };

  const handleViewReport = (interviewId: string) => {
    const interview = candidate?.interviews.find((i) => i.id === interviewId);
    if (interview && interview.hasReport) {
      // Mock report data - normally would come from API
      const mockReport = {
        id: interview.id,
        aday: candidate,
        date: interview.date,
        time: interview.time,
        type: interview.type,
        introduction:
          "Mehmet Ali Demir, Senior Software Developer pozisyonu için değerlendirilen, 7+ yıl deneyimli bir frontend geliştiricidir. Mülakat, adayın teknik derinliğini ve pratik uygulama becerilerini ölçmeyi amaçlamıştır. Genel olarak pozisyona uygun bir profil çizmektedir.",
        strengths: [
          "**React & TypeScript Yetkinliği:** Projelerinde bu teknolojileri derinlemesine kullandığını somut örneklerle (SaaS platformu geliştirme, %30 hata oranı azaltma) destekledi.",
          "**Problem Çözme ve Analitik Düşünme:** Karmaşık UI problemlerini çözme ve performans iyileştirmeleri yapma konusundaki başarıları (sayfa yükleme %40 iyileştirme).",
          "**Teknik Liderlik ve Mentorluk:** Junior geliştiricilere mentorluk yapması ve kod inceleme süreçlerini yönetmesi.",
          "**Modern Araç ve Teknolojilere Hakimiyet:** Vite, Webpack, Jest, Cypress, React Flow gibi güncel araçları etkin kullanması.",
          "**İletişim ve Takım Çalışması:** Agile/Scrum tecrübesi ve açık kaynak katkıları, işbirliğine yatkınlığını göstermektedir.",
        ],
        areasForDevelopment: [
          "**Veri Görselleştirme (D3.js):** Temel düzeyde bilgisi olsa da, daha karmaşık veri görselleştirme projelerinde deneyim kazanması faydalı olacaktır.",
          "**Kapsamlı E2E Test Deneyimi:** Cypress bilgisi temel düzeyde, daha büyük ölçekli projelerde E2E test stratejileri geliştirme ve uygulama konusunda derinleşebilir.",
          "**Yapay Zeka Pratik Uygulamaları:** AI/ML konseptlerine aşinalığı olsa da, bu alanda bitmiş bir proje sunmaması, pratik uygulama deneyiminin sınırlı olabileceğini düşündürmektedir.",
        ],
        overallSummary: {
          communication:
            "Aday, teknik konuları net, anlaşılır ve özgüvenli bir şekilde ifade edebilmektedir. Sorulara verdiği yanıtlar derinlemesine ve düşündüğünü göstermektedir. Takım içi iletişimi güçlüdür.",
          level:
            "Deneyimi, teknik derinliği, liderlik potansiyeli ve mülakattaki genel performansı ile 'Senior Software Developer' ve hatta 'Lead Developer' potansiyeli taşıyan bir adaydır.",
          conclusion:
            "Mehmet Ali Demir, aranan pozisyonun gerektirdiği tüm temel ve birçok tercih edilen yetkinliğe fazlasıyla sahiptir. Teknik becerileri, problem çözme yaklaşımı ve öğrenme isteği ile ekibe önemli katkılar sağlayacağı değerlendirilmektedir. İşe alımı kesinlikle tavsiye edilir.",
        },
      };
      setSelectedReport(mockReport);
      setShowReportModal(true);
    } else {
      alert("Bu mülakat için detaylı rapor bulunamadı.");
    }
  };

  const handleChatWithAI = (interviewId: string) => {
    setSelectedInterviewId(interviewId);
    setChatMessages([
      {
        id: "welcome",
        type: "assistant",
        content:
          "Merhaba! Bu mülakat hakkında ne sormak istersiniz? Adayın performansı, güçlü yanları veya gelişim alanları hakkında sorular sorabilirsiniz.",
        timestamp: new Date(),
      },
    ]);
    setShowChatModal(true);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      type: "user" as const,
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Bu konuda adayın performansı oldukça iyiydi. Özellikle teknik bilgisi ve problem çözme yaklaşımı dikkat çekiciydi.",
        "Adayın bu alandaki deneyimi güçlü. Mülakat sırasında verdiği örnekler bu yetkinliğini net bir şekilde gösterdi.",
        "Bu konuda daha detaylı bilgi için mülakat raporunu inceleyebilirsiniz. Genel olarak pozitif bir değerlendirme aldı.",
        "Aday bu konuda iyi bir performans sergiledi. Gelişim potansiyeli yüksek görünüyor.",
        "Mülakat boyunca bu konuda oldukça özgüvenli ve bilgili görünüyordu. İletişim becerileri de iyiydi.",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMessage = {
        id: `ai_${Date.now()}`,
        type: "assistant" as const,
        content: randomResponse,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCompatibilityTooltipShow = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowCompatibilityTooltip(true);
  };

  const handleCompatibilityTooltipHide = () => {
    setShowCompatibilityTooltip(false);
  };

  const downloadReportAsText = () => {
    if (!selectedReport || !candidate) return;

    let reportText = `MÜLAKAT SONUÇ RAPORU\n====================================\n\n`;
    reportText += `Aday: ${candidate.name} ${candidate.surname}\n`;
    reportText += `Pozisyon: ${candidate.position}\n`;
    reportText += `Pozisyona Uyumluluk Skoru: %${candidate.compatibilityScore}\n`;
    reportText += `Mülakat Tarihi: ${selectedReport.date} ${
      selectedReport.time || ""
    }\n`;
    reportText += `Mülakat Türü: ${selectedReport.type}\n`;
    reportText += `\n------------------------------------\n`;

    reportText += `\nGİRİŞ\n--------------------\n${selectedReport.introduction}\n\n`;

    reportText += `\nGÜÇLÜ YÖNLER\n--------------------\n`;
    selectedReport.strengths.forEach((strength: string) => {
      reportText += `- ${strength.replace(/\*\*/g, "")}\n`;
    });

    reportText += `\nGELİŞİME AÇIK ALANLAR\n--------------------\n`;
    selectedReport.areasForDevelopment.forEach((area: string) => {
      reportText += `- ${area.replace(/\*\*/g, "")}\n`;
    });

    reportText += `\nGENEL DEĞERLENDİRME\n--------------------\n`;
    reportText += `İletişim Becerileri: ${selectedReport.overallSummary.communication}\n\n`;
    reportText += `Seviye Değerlendirmesi: ${selectedReport.overallSummary.level}\n\n`;
    reportText += `Sonuç: ${selectedReport.overallSummary.conclusion}\n`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Mulakat_Raporu_${
      candidate.surname
    }_${candidate.name.charAt(0)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  if (!candidate) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100">
        <Header currentView="candidates" />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Aday bulunamadı
            </h1>
            <button
              onClick={() => router.push("/candidates")}
              className="hiri-button hiri-button-secondary"
            >
              <FaArrowLeft className="mr-2" />
              Aday Listesine Dön
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // STAR metoduyla mülakat soruları
  const interviewQuestions = [
    {
      category: "Geçmiş Deneyimler ve Problem Çözme",
      questions: [
        "Daha önceki bir rolünüzde karşılaştığınız teknik bir zorluğu, bu zorluktaki temel görevinizi, problemi çözmek için uyguladığınız adımları/kullandığınız yöntemleri ve bu sürecin sonucunu/projeye etkisini detaylandırır mısınız?",
        "Bir projede, Java 17 ve üzeri bir versiyon kullanarak yeni özellikleri entegre etmek durumunda kaldınız. Bu projedeki karşılaştığınız zorluklar ve göreviniz nelerdi?",
      ],
    },
    {
      category: "Takım Çalışması ve İletişim",
      questions: [
        "Bir projede, farklı disiplinlerden gelen takım üyeleriyle çalıştınız ve herkesin farklı görüşleri vardı. Bu durumda nasıl bir iletişim stratejisi izlediniz?",
        "Zaman baskısı altında bir ekip projesini tamamlamak zorunda kaldığınız bir durumu anlatın.",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header currentView="candidates" />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {/* Başlık ve Geri Butonu */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-slate-800">
              {candidate.name} {candidate.surname}
            </h1>
            <p className="text-slate-500 text-sm">{candidate.email}</p>
            <p className="text-slate-500 text-sm">{candidate.phone}</p>
          </div>
          <button
            onClick={() => router.push("/candidates")}
            className="hiri-button hiri-button-secondary"
          >
            <FaArrowLeft className="mr-2" />
            Aday Listesine Dön
          </button>
        </div>

        {/* Ana Kart */}
        <div className="hiri-card">
          {/* Sekmeler */}
          <div className="mb-6 border-b border-slate-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("genelBakis")}
                className={`py-3 px-1 border-b-3 font-semibold text-sm transition-colors ${
                  activeTab === "genelBakis"
                    ? "border-hiri-purple text-hiri-purple"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Genel Bakış
              </button>
              <button
                onClick={() => setActiveTab("mulakatHazirligi")}
                className={`py-3 px-1 border-b-3 font-semibold text-sm transition-colors ${
                  activeTab === "mulakatHazirligi"
                    ? "border-hiri-purple text-hiri-purple"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Mülakat Hazırlığı
              </button>
              <button
                onClick={() => setActiveTab("mulakatKayitlari")}
                className={`py-3 px-1 border-b-3 font-semibold text-sm transition-colors ${
                  activeTab === "mulakatKayitlari"
                    ? "border-hiri-purple text-hiri-purple"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Mülakat Kayıtları
              </button>
            </div>
          </div>

          {/* Genel Bakış Sekmesi */}
          {activeTab === "genelBakis" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-700 mb-3">
                    Yapay Zeka CV Özeti
                  </h2>
                  <p className="text-sm text-slate-600 bg-indigo-50 p-4 rounded-lg border border-indigo-200 leading-relaxed">
                    {cvSummary || candidate.cvSummary}
                  </p>
                  <button
                    onClick={handleUpdateSummary}
                    className="text-xs text-hiri-purple hover:text-hiri-purple-dark mt-2 font-medium transition-colors"
                  >
                    Özeti Güncelle <FaSyncAlt className="inline ml-1" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-700 mb-3">
                    Yüklenen CV
                  </h2>
                  <button
                    onClick={handleShowCv}
                    className="hiri-button hiri-button-secondary"
                  >
                    <FaFileAlt className="mr-2" />
                    CV&apos;yi Görüntüle
                  </button>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-700 mb-3">
                    Değerlendirildiği Pozisyon
                  </h2>
                  <p className="text-sm text-slate-600 font-medium bg-slate-100 p-3 rounded-md">
                    {candidate.position}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-700 mb-3">
                    Pozisyona Uyumluluk Skoru
                  </h2>
                  <div className="relative">
                    <div
                      className="w-full bg-slate-200 rounded-full h-8 cursor-help"
                      onMouseEnter={handleCompatibilityTooltipShow}
                      onMouseLeave={handleCompatibilityTooltipHide}
                    >
                      <div
                        className="bg-gradient-to-r from-hiri-purple to-indigo-500 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all duration-500"
                        style={{ width: `${candidate.compatibilityScore}%` }}
                      >
                        {candidate.compatibilityScore}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mülakat Hazırlığı Sekmesi */}
          {activeTab === "mulakatHazirligi" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-700">
                  Yapay Zeka Mülakat Soru Önerileri (STAR Tekniği)
                </h2>
                <button
                  onClick={handleDownloadQuestions}
                  className="hiri-button hiri-button-secondary text-xs"
                >
                  <FaDownload className="mr-2" />
                  Soruları İndir (.txt)
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {interviewQuestions.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <h4 className="font-semibold text-slate-700 mb-3 text-base">
                      {category.category}
                    </h4>
                    <ul className="space-y-3 text-sm">
                      {category.questions.map((question, questionIndex) => (
                        <li
                          key={questionIndex}
                          className="group bg-white p-3 rounded-lg border border-slate-200 hover:border-hiri-purple/30 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-slate-600 leading-relaxed flex-1 mr-3">
                              <FaQuestionCircle className="inline text-hiri-purple mr-2 opacity-70" />
                              {question}
                            </span>
                            <button
                              onClick={() =>
                                handleChangeQuestion(
                                  categoryIndex,
                                  questionIndex
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-hiri-purple bg-hiri-light-purple hover:bg-hiri-purple hover:text-white rounded-full border border-hiri-purple/20 hover:border-hiri-purple transition-all duration-200 hover:scale-105 hover:shadow-md group/btn flex-shrink-0"
                            >
                              <FaSyncAlt className="text-xs group-hover/btn:rotate-180 transition-transform duration-300" />
                              <span>Değiştir</span>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mülakat Kayıtları Sekmesi */}
          {activeTab === "mulakatKayitlari" && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCreateOnDemand}
                  className="hiri-button hiri-button-primary"
                >
                  <FaVideo className="mr-2" />
                  On-Demand Mülakat Oluştur
                </button>
                <button
                  onClick={handleInstantInvite}
                  className="hiri-button hiri-button-secondary"
                >
                  <FaBolt className="mr-2" />
                  HiriBot&apos;u Anlık Davet Et
                </button>
                <button
                  onClick={handleScheduledInterview}
                  className="hiri-button hiri-button-secondary"
                >
                  <FaCalendarAlt className="mr-2" />
                  HiriBot ile Planlı Mülakat
                </button>
                <button
                  onClick={handleExternalInterview}
                  className="hiri-button hiri-button-secondary"
                >
                  <FaUpload className="mr-2" />
                  Dış Mülakat Kaydı Ekle
                </button>
              </div>

              <h3 className="text-lg font-semibold text-slate-700 pt-4 border-t border-slate-200">
                Geçmiş Mülakatlar
              </h3>

              <div className="space-y-4">
                {candidate.interviews.length === 0 ? (
                  <p className="text-slate-500 italic p-3 bg-slate-50 rounded-md text-center">
                    Bu aday için henüz mülakat kaydı bulunmamaktadır.
                  </p>
                ) : (
                  candidate.interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-3 sm:mb-0">
                          <p className="font-semibold text-slate-700 text-base">
                            {interview.date} {interview.time} - {interview.type}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {interview.notes.substring(0, 70)}...
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                          {interview.hasReport && (
                            <button
                              onClick={() => handleViewReport(interview.id)}
                              className="hiri-button hiri-button-primary text-xs"
                            >
                              <FaChartBar className="mr-1" />
                              Raporu Gör
                            </button>
                          )}
                          <button
                            onClick={() => handleChatWithAI(interview.id)}
                            className="hiri-button hiri-button-secondary text-xs"
                          >
                            <FaMagic className="mr-1" />
                            AI ile Sohbet
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* --- MODALS (Portal ile) --- */}
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
                <h2 className="text-2xl font-semibold text-slate-700">
                  CV İçeriği
                </h2>
                <button
                  onClick={() => setShowCvModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="flex-grow overflow-auto p-6">
                <pre className="bg-slate-50 p-4 rounded-md text-xs leading-relaxed whitespace-pre-wrap font-mono">
                  {currentCvText}
                </pre>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Mülakat Davet Modal */}
      {showInterviewModal && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setShowInterviewModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-semibold text-slate-700">
                  {interviewType === "instant"
                    ? "HiriBot'u Anlık Mülakata Davet Et"
                    : "HiriBot ile Planlı Mülakat"}
                </h2>
                <button
                  onClick={() => setShowInterviewModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Toplantı Linki*
                    </label>
                    <input
                      type="url"
                      className="hiri-input"
                      placeholder="https://meet.google.com/abc-def-ghi"
                      required
                    />
                  </div>

                  {interviewType === "scheduled" && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">
                            Mülakat Tarihi
                          </label>
                          <input type="date" className="hiri-input" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-2">
                            Başlangıç Saati
                          </label>
                          <input type="time" className="hiri-input" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="bg-hiri-light-purple p-4 rounded-lg border border-hiri-purple">
                    <p className="text-sm text-hiri-purple-dark flex items-start">
                      <span className="mr-2 mt-1">ℹ️</span>
                      <span>
                        <strong>Dikkat:</strong> HiriBot&apos;un mülakata{" "}
                        {interviewType === "instant"
                          ? "anında katılması"
                          : "planlanan zamanda katılması"}{" "}
                        için{" "}
                        {interviewType === "instant"
                          ? "geçerli bir toplantı linki girin"
                          : "bilgileri eksiksiz girin"}
                        .
                      </span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="hiri-button hiri-button-primary w-full py-3"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(
                        `${
                          interviewType === "instant" ? "Anlık" : "Planlı"
                        } mülakat oluşturuldu!`
                      );
                      setShowInterviewModal(false);
                    }}
                  >
                    {interviewType === "instant"
                      ? "HiriBot&apos;u Anlık Davet Et"
                      : "Planlı Mülakatı Oluştur"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Compatibility Tooltip Portal */}
      {showCompatibilityTooltip && (
        <ModalPortal>
          <div
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: tooltipPosition.x - 200, // Tooltip'i ortalamak için
              top: tooltipPosition.y - 120, // Tooltip'i yukarı taşımak için
            }}
          >
            <div className="w-96 bg-slate-800 text-white text-xs rounded-lg p-4 shadow-2xl">
              <div className="space-y-2">
                {candidate?.compatibilityReasons.map((reason, index) => (
                  <div key={index} className="flex items-start">
                    <span className="mr-2 text-hiri-purple">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Report Modal Portal */}
      {showReportModal && selectedReport && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setShowReportModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4 p-6">
                <h2 className="text-2xl font-bold text-slate-700">
                  Mülakat Sonuç Raporu
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={downloadReportAsText}
                    className="hiri-button hiri-button-secondary text-sm py-1.5 px-3"
                  >
                    <FaDownload className="mr-2" />
                    Raporu İndir (.txt)
                  </button>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Report Header Info */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 mx-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <p>
                    <strong className="text-hiri-purple">
                      <FaUser className="mr-2 inline" />
                      Aday:
                    </strong>{" "}
                    {candidate?.name} {candidate?.surname}
                  </p>
                  <p>
                    <strong className="text-hiri-purple">
                      <FaFileAlt className="mr-2 inline" />
                      Pozisyon:
                    </strong>{" "}
                    {candidate?.position}
                  </p>
                  <p>
                    <strong className="text-hiri-purple">
                      <FaChartBar className="mr-2 inline" />
                      Uyumluluk Skoru:
                    </strong>
                    <span className="font-bold text-lg text-green-600 ml-2">
                      {candidate?.compatibilityScore}%
                    </span>
                  </p>
                  <p>
                    <strong className="text-hiri-purple">
                      <FaCalendarAlt className="mr-2 inline" />
                      Mülakat Tarihi:
                    </strong>{" "}
                    {selectedReport.date} {selectedReport.time || ""}
                  </p>
                </div>
              </div>

              {/* Report Content */}
              <div className="flex-grow overflow-y-auto px-6 pb-6 space-y-6 text-sm leading-relaxed">
                {/* Giriş */}
                <div>
                  <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                    <FaFileAlt className="mr-2 inline" />
                    Giriş
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedReport.introduction}
                  </p>
                </div>

                {/* Güçlü Yönler */}
                <div>
                  <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                    <FaArrowLeft className="mr-2 inline rotate-90 text-green-600" />
                    Güçlü Yönler
                  </h3>
                  <ul className="space-y-2">
                    {selectedReport.strengths.map(
                      (strength: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start text-slate-600"
                        >
                          <span className="mr-2 text-green-600 mt-1">•</span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: strength.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              ),
                            }}
                          />
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Gelişime Açık Alanlar */}
                <div>
                  <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                    <FaArrowLeft className="mr-2 inline rotate-90 text-orange-600" />
                    Gelişime Açık Alanlar
                  </h3>
                  <ul className="space-y-2">
                    {selectedReport.areasForDevelopment.map(
                      (area: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start text-slate-600"
                        >
                          <span className="mr-2 text-orange-600 mt-1">•</span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: area.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              ),
                            }}
                          />
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Genel Değerlendirme */}
                <div>
                  <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                    <FaChartBar className="mr-2 inline" />
                    Genel Değerlendirme ve Özet
                  </h3>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg border">
                    <p>
                      <strong className="text-slate-700">
                        İletişim Becerileri:
                      </strong>
                      <span className="ml-2 text-slate-600">
                        {selectedReport.overallSummary.communication}
                      </span>
                    </p>
                    <p>
                      <strong className="text-slate-700">
                        Seviye Değerlendirmesi:
                      </strong>
                      <span className="ml-2 text-slate-600">
                        {selectedReport.overallSummary.level}
                      </span>
                    </p>
                    <p>
                      <strong className="text-slate-700">Sonuç:</strong>
                      <span className="ml-2 text-slate-600">
                        {selectedReport.overallSummary.conclusion}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Görsel Placeholder */}
                <div>
                  <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                    <FaChartBar className="mr-2 inline" />
                    Görsel Değerlendirmeler
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <h4 className="font-semibold text-slate-700 mb-2">
                        Yetenek Haritası (Örnek)
                      </h4>
                      <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-8 border-2 border-dashed border-purple-300">
                        <FaChartBar className="text-6xl text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">
                          Adayın temel yetkinliklerinin görsel temsili
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-slate-700 mb-2">
                        Beceri Bulutu (Örnek)
                      </h4>
                      <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 border-2 border-dashed border-blue-300">
                        <FaFileAlt className="text-6xl text-blue-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">
                          Mülakatta öne çıkan anahtar kelimeler
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* AI Chat Modal Portal */}
      {showChatModal && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setShowChatModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-hiri-purple to-indigo-600 text-white rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <FaMagic className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      AI Mülakat Asistanı
                    </h3>
                    <p className="text-sm text-white text-opacity-80">
                      {candidate?.name} {candidate?.surname} - Mülakat Analizi
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Chat Messages */}
              <div
                id="chatContainer"
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white"
              >
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.type === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === "user"
                            ? "bg-hiri-purple text-white"
                            : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                        }`}
                      >
                        {message.type === "user" ? (
                          <FaUser className="text-xs" />
                        ) : (
                          <FaMagic className="text-xs" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`relative p-3 rounded-2xl shadow-sm ${
                          message.type === "user"
                            ? "bg-hiri-purple text-white rounded-br-md"
                            : "bg-white text-slate-700 border border-slate-200 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.type === "user"
                              ? "text-white text-opacity-70"
                              : "text-slate-400"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        {/* Message tail */}
                        <div
                          className={`absolute top-4 ${
                            message.type === "user"
                              ? "right-0 translate-x-1 border-l-8 border-l-hiri-purple border-t-4 border-b-4 border-t-transparent border-b-transparent"
                              : "left-0 -translate-x-1 border-r-8 border-r-white border-t-4 border-b-4 border-t-transparent border-b-transparent"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <FaMagic className="text-xs text-white" />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md p-3 shadow-sm">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
                {/* Quick Actions - Moved above input */}
                {chatInput === "" && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setChatInput("Adayın güçlü yanları nelerdir?")
                      }
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                    >
                      💪 Güçlü yanları
                    </button>
                    <button
                      onClick={() => setChatInput("Gelişim alanları nelerdir?")}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                    >
                      📈 Gelişim alanları
                    </button>
                    <button
                      onClick={() =>
                        setChatInput("Teknik yetkinlikleri nasıl?")
                      }
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                    >
                      🔧 Teknik beceriler
                    </button>
                  </div>
                )}

                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Mülakat hakkında soru sorun..."
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hiri-purple focus:border-transparent transition-all duration-200 h-11"
                    />
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isTyping}
                    className="w-11 h-11 bg-hiri-purple hover:bg-hiri-purple-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-hiri-purple focus:ring-offset-2"
                  >
                    {isTyping ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* External Interview Modal Portal */}
      {showExternalInterviewModal && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setShowExternalInterviewModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h2 className="text-2xl font-semibold text-slate-700">
                  Dış Mülakat Kaydı Ekle
                </h2>
                <button
                  onClick={() => setShowExternalInterviewModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Form - Scrollable Content */}
              <div
                className="overflow-y-auto"
                style={{ height: "calc(85vh - 140px)" }}
              >
                <form
                  onSubmit={handleExternalInterviewSubmit}
                  className="p-6 space-y-5"
                >
                  {/* Mülakat Tarihi */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Mülakat Tarihi*
                    </label>
                    <input
                      type="date"
                      value={externalInterviewForm.date}
                      onChange={(e) =>
                        handleExternalInterviewFormChange(
                          "date",
                          e.target.value
                        )
                      }
                      className="hiri-input"
                      required
                    />
                  </div>

                  {/* Mülakatı Yapanlar */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Mülakatı Yapan(lar)
                    </label>
                    <input
                      type="text"
                      value={externalInterviewForm.interviewers}
                      onChange={(e) =>
                        handleExternalInterviewFormChange(
                          "interviewers",
                          e.target.value
                        )
                      }
                      className="hiri-input"
                      placeholder="örn: Ayşe Kaya, Ali Veli"
                    />
                  </div>

                  {/* Mülakat Notları (Metin) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Mülakat Notları (Metin)
                    </label>
                    <textarea
                      value={externalInterviewForm.notes}
                      onChange={(e) =>
                        handleExternalInterviewFormChange(
                          "notes",
                          e.target.value
                        )
                      }
                      rows={4}
                      className="hiri-input"
                      placeholder="Mülakat notlarını buraya yazın..."
                    />
                  </div>

                  {/* Mülakat Notları (Dosya) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Mülakat Notları (Dosya)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleExternalInterviewFormChange(
                            "notesFile",
                            e.target.files?.[0] || null
                          )
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <div className="hiri-input flex items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-hiri-purple transition-colors cursor-pointer">
                        <div className="text-center">
                          <FaUpload className="mx-auto text-2xl text-slate-400 mb-2" />
                          <p className="text-sm text-slate-600">
                            {externalInterviewForm.notesFile
                              ? externalInterviewForm.notesFile.name
                              : "PDF, DOC, DOCX veya TXT dosyası seçin"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mülakat Videosu */}
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Mülakat Videosu (Opsiyonel)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleExternalInterviewFormChange(
                            "videoFile",
                            e.target.files?.[0] || null
                          )
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="video/*"
                      />
                      <div className="hiri-input flex items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-hiri-purple transition-colors cursor-pointer">
                        <div className="text-center">
                          <FaVideo className="mx-auto text-2xl text-slate-400 mb-2" />
                          <p className="text-sm text-slate-600">
                            {externalInterviewForm.videoFile
                              ? externalInterviewForm.videoFile.name
                              : "Video dosyası seçin (MP4, MOV, AVI...)"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="hiri-button hiri-button-primary w-full py-3 text-base"
                    >
                      <FaUpload className="mr-2" />
                      Dış Mülakat Kaydını Ekle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
