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
  FaBolt,
  FaCalendarAlt,
  FaUpload,
  FaDownload,
  FaChartBar,
  FaMagic,
  FaQuestionCircle,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaStickyNote,
  FaFileImport,
  FaUserPlus,
  FaEye,
  FaShareAlt,
  FaLink,
  FaCopy,
  FaLinkedin,
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

  // LinkedIn import modal states
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const [linkedinImportStep, setLinkedinImportStep] = useState(1);
  const [linkedinFile, setLinkedinFile] = useState<File | null>(null);
  const [linkedinImportProgress, setLinkedinImportProgress] = useState(0);
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

  // Notes and Logs state
  const [showNotesLogsAccordion, setShowNotesLogsAccordion] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  // Share Profile state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareDuration, setShareDuration] = useState(12);
  const [generatedLink, setGeneratedLink] = useState("");
  const [shareableFields, setShareableFields] = useState({
    cvSummary: true,
    compatibility: true,
    personality: true,
    interviews: true,
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

    // Add the external interview to candidate's data
    if (candidate?.interviews) {
      const newInterview = {
        id: `ext_${Date.now()}`,
        type: "Dış Mülakat",
        date: externalInterviewForm.date,
        time: "", // External interviews don't have specific time
        status: "Tamamlandı",
        notes: externalInterviewForm.notes || "Dış mülakat kaydı eklendi.",
        hasReport: false,
        interviewers: externalInterviewForm.interviewers || "",
        files: {
          notes: externalInterviewForm.notesFile?.name,
          video: externalInterviewForm.videoFile?.name,
        },
      };

      // Add to interviews array using type assertion
      (candidate.interviews as any[]).push(newInterview);

      // Add a log entry for the external interview
      if (candidate?.logs) {
        (candidate.logs as any[]).unshift({
          user: "Tuna Can",
          timestamp:
            new Date().toLocaleDateString("tr-TR") +
            " " +
            new Date().toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          action: "Dış mülakat kaydı eklendi.",
          icon: "fa-upload",
          color: "bg-green-100 text-green-600",
        });
      }
    }

    alert("Dış mülakat kaydı başarıyla eklendi!");
    setShowExternalInterviewModal(false);

    // Reset form
    setExternalInterviewForm({
      date: "",
      interviewers: "",
      notes: "",
      notesFile: null,
      videoFile: null,
    });
  };

  // LinkedIn import handler
  const handleLinkedinImport = () => {
    // Step 2'ye geç - işlem başlıyor
    setLinkedinImportStep(2);
    setLinkedinImportProgress(0);

    // Progress simulation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setLinkedinImportProgress(progress);

      if (progress >= 100) {
        clearInterval(progressInterval);

        // Simulated LinkedIn data - would normally come from CSV parsing
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
          position: candidate?.position || "Pozisyon Belirtilmemiş",
          compatibilityScore: Math.floor(Math.random() * (95 - 75 + 1) + 75), // 75-95 arası
          compatibilityReasons: [
            "LinkedIn profilinden otomatik analiz sonucu uygun görülmektedir.",
            "Deneyim ve beceriler pozisyon gereksinimleriyle uyumludur.",
            "Eğitim altyapısı pozisyon için yeterli düzeydedir.",
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
        // In a real app, this would be an API call
        DUMMY_CANDIDATES.push(...newCandidates);

        // Simulate CV scraping process
        newCandidates.forEach((newCandidate, index) => {
          setTimeout(() => {
            // Update candidate data in DUMMY_CANDIDATES after "scraping"
            const candidateIndex = DUMMY_CANDIDATES.findIndex(
              (c) => c.id === newCandidate.id
            );
            if (candidateIndex !== -1) {
              DUMMY_CANDIDATES[candidateIndex] = {
                ...DUMMY_CANDIDATES[candidateIndex],
                cvSummary: `LinkedIn'den taranan detaylı profil: ${
                  Math.floor(Math.random() * 5) + 3
                } yıl deneyimli, ${
                  newCandidate.position
                } pozisyonu için uygun görülmektedir. Profil tarama tamamlandı.`,
                compatibilityScore: Math.floor(
                  Math.random() * (95 - 75 + 1) + 75
                ),
                cvText: `${newCandidate.name.toUpperCase()} ${newCandidate.surname.toUpperCase()}
${newCandidate.email} | ${newCandidate.phone}

LINKEDIN PROFIL ÖZETI
${Math.floor(Math.random() * 5) + 3} yıl deneyimli profesyonel

DENEYİMLER
- Senior pozisyonlarda çalışma deneyimi
- Takım liderliği ve proje yönetimi
- Teknik beceriler ve uzmanlık alanları

YETENEKLER
- İlgili pozisyon becerileri
- Soft skills ve iletişim
- Liderlik ve problem çözme

EĞİTİM
Üniversite mezunu
Çeşitli sertifikalar ve eğitimler

Bu bilgiler LinkedIn profilinden otomatik olarak çıkarılmış ve AI tarafından analiz edilmiştir.`,
              };
            }

            console.log(
              `LinkedIn candidate ${newCandidate.name} ${newCandidate.surname} processing completed`
            );
          }, (index + 1) * 2000); // Her aday için 2 saniye aralık
        });

        // Close modal and show success
        setTimeout(() => {
          setShowLinkedinModal(false);
          setLinkedinImportStep(1);
          setLinkedinFile(null);
          setLinkedinImportProgress(0);

          alert(
            `Başarılı! LinkedIn'den ${newCandidates.length} aday sisteme eklendi ve adaylar tablosunda görünecektir. Arka plan işlemi profillerini detaylı olarak taramaya başlıyor.`
          );
        }, 500);
      }
    }, 200); // Her 200ms'de %10 artış = 2 saniye toplam
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
        experienceAnalysis:
          "Aday, önceki projelerinde React ve TypeScript'i etkin bir şekilde kullandığını, özellikle büyük ölçekli uygulamalarda state management (Redux, Zustand) ve performans optimizasyonu konularında önemli katkılar sağladığını belirtti. React Flow ile geliştirdiği iş akışı arayüzleri, karmaşık UI problemlerine yenilikçi çözümler getirme yeteneğini göstermektedir. Proje yönetimi metodolojilerinden Agile (Scrum) ile çalıştığını ve bu metodolojinin avantajlarını etkin bir şekilde kullandığını ifade etti.",
        otherSkills:
          "AI destekli geliştirme araçlarına (GitHub Copilot) aşina olması ve açık kaynak projelere katkıda bulunması, teknolojik gelişmeleri takip ettiğini ve topluluk odaklı olduğunu göstermektedir. Temel Python bilgisi ve Docker kullanımı da artılarıdır. Finansal süreçleri yönetirken kullandığı spesifik araçlar belirtilmedi ancak genel problem çözme yaklaşımı bu tür araçlara hızla adapte olabileceğini düşündürmektedir.",
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
        starExamples: [
          {
            situation:
              "Önceki projesinde büyük bir e-ticaret sitesinde sayfa yükleme sürelerinin yavaş olması ve kullanıcı deneyimini olumsuz etkilemesi.",
            task: "Sayfa performansını %30 oranında iyileştirmek ve kullanıcı memnuniyetini artırmak.",
            action:
              "Detaylı performans analizi yaptı (Lighthouse, Profiler). Code splitting, lazy loading tekniklerini uyguladı. Gereksiz re-render'ları önlemek için React.memo, useMemo ve useCallback kancalarını etkin kullandı. Resimleri yeni nesil formatlarda (örn: WebP) optimize etti ve CDN kullanımını yaygınlaştırdı.",
            result:
              "Sayfa yükleme süreleri (LCP) ortalama %40 iyileşti, interaktiflik (FID) skorları yükseldi, kullanıcı memnuniyetinde belirgin artış ve bounce rate'de %15 düşüş gözlendi.",
            competency: "Performans Optimizasyonu",
          },
          {
            situation:
              "Yeni bir özellik için karmaşık, sürükle-bırak tabanlı bir iş akışı tasarım arayüzü geliştirilmesi gerekti.",
            task: "Kullanıcıların düğümleri kolayca ekleyip bağlayabileceği, konfigüre edebileceği interaktif ve performanslı bir arayüz oluşturmak.",
            action:
              "React Flow kütüphanesini seçti, özel düğüm tipleri ve kenar bağlantıları geliştirdi. Durum yönetimi için Zustand kullandı. Arayüzün karmaşıklığına rağmen yüksek performansı korumak için sanallaştırma tekniklerini araştırdı ve uyguladı.",
            result:
              "Kullanıcılar özelliği hızla benimsedi ve iş akışlarını %50 daha hızlı oluşturabildiklerini belirtti. Geliştirme süresi, benzer karmaşıklıktaki bir özellik için beklenenden %20 daha kısa sürdü.",
            competency: "UI/UX Geliştirme ve Kütüphane Kullanımı",
          },
        ],
        suitabilityAndRecommendations: {
          suitabilityStatus: "Pozisyona Yüksek Derecede Uygun",
          developmentSuggestions: [
            "AWS servisleri (özellikle sunucusuz mimariler ve veritabanları) üzerine sertifikasyon veya proje bazlı çalışmalar yapması önerilir.",
            "Mobil uygulama geliştirme (React Native vb.) konusunda temel bilgi edinmesi, gelecekteki projeler için bir avantaj olabilir.",
            "Daha fazla açık kaynak projeye liderlik yaparak veya karmaşık modüller geliştirerek katkıda bulunmaya devam etmesi teşvik edilir.",
          ],
        },
        overallSummary: {
          communication:
            "Aday, teknik konuları net, anlaşılır ve özgüvenli bir şekilde ifade edebilmektedir. Sorulara verdiği yanıtlar derinlemesine ve düşündüğünü göstermektedir. Takım içi iletişimi güçlüdür.",
          level:
            "Deneyimi, teknik derinliği, liderlik potansiyeli ve mülakattaki genel performansı ile 'Senior Software Developer' ve hatta 'Lead Developer' potansiyeli taşıyan bir adaydır.",
          conclusion:
            "Mehmet Ali Demir, aranan pozisyonun gerektirdiği tüm temel ve birçok tercih edilen yetkinliğe fazlasıyla sahiptir. Teknik becerileri, problem çözme yaklaşımı ve öğrenme isteği ile ekibe önemli katkılar sağlayacağı değerlendirilmektedir. İşe alımı kesinlikle tavsiye edilir.",
        },
        interviewNotesRaw:
          "Aday mülakat boyunca kendinden emin ve sakindi. Teknik sorulara verdiği yanıtlar tatmin ediciydi. Özellikle React performans optimizasyonu konusundaki bilgisi ve tecrübesi etkileyici. STAR metoduyla anlattığı örnekler, yetkinliklerini somutlaştırdı. Ekip çalışmasına ve sürekli öğrenmeye verdiği önem olumlu.",
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

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;

    // Add note to candidate data (in a real app, this would be an API call)
    if (candidate?.notes) {
      (candidate.notes as any[]).push({
        user: "Tuna Can", // In a real app, this would come from the current user
        timestamp:
          new Date().toLocaleDateString("tr-TR") +
          " " +
          new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        text: newNoteText.trim(),
      });

      // Add a log entry for the note
      if (candidate?.logs) {
        (candidate.logs as any[]).unshift({
          user: "Tuna Can",
          timestamp:
            new Date().toLocaleDateString("tr-TR") +
            " " +
            new Date().toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          action: "Aday hakkında not eklendi.",
          icon: "fa-sticky-note",
          color: "bg-yellow-100 text-yellow-600",
        });
      }
    }

    setNewNoteText("");
  };

  const handleShareProfile = () => {
    if (!candidate) return;

    // Reset form
    setShareEmail("");
    setShareDuration(12);
    setGeneratedLink("");

    // Set shareable fields based on candidate data
    setShareableFields({
      cvSummary: true,
      compatibility: true,
      personality: !!candidate.personalityInventorySummaryAI,
      interviews: candidate.interviews.length > 0,
    });

    setShowShareModal(true);
  };

  const handleGenerateShareLink = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shareEmail.trim()) {
      alert("E-posta adresi gereklidir!");
      return;
    }

    // Generate a unique share link (in a real app, this would be handled by the backend)
    const shareId = crypto.randomUUID().slice(0, 8);
    const baseUrl = window.location.href.split("?")[0];
    const link = `${baseUrl}?shareId=${shareId}&duration=${shareDuration}`;

    setGeneratedLink(link);

    // In a real app, you would send this info to the backend to store the share link
    console.log("Share link generated:", {
      candidateId: candidate?.id,
      email: shareEmail,
      duration: shareDuration,
      fields: shareableFields,
      link: link,
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      alert("Link kopyalandı!");
    } catch (err) {
      console.error("Link kopyalanırken hata oluştu:", err);
      alert("Link kopyalanamadı. Lütfen manuel olarak kopyalayın.");
    }
  };

  const openUnifiedChat = () => {
    // Placeholder for HiriBot chat functionality
    alert("HiriBot sohbet özelliği yakında eklenecek!");
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

    if ((selectedReport as any).experienceAnalysis) {
      reportText += `\nDENEYİM ANALİZİ\n--------------------\n${
        (selectedReport as any).experienceAnalysis
      }\n\n`;
    }

    if ((selectedReport as any).otherSkills) {
      reportText += `\nDİĞER YETENEKLER\n--------------------\n${
        (selectedReport as any).otherSkills
      }\n\n`;
    }

    reportText += `\nGÜÇLÜ YÖNLER\n--------------------\n`;
    selectedReport.strengths.forEach((strength: string) => {
      reportText += `- ${strength.replace(/\*\*/g, "")}\n`;
    });

    reportText += `\nGELİŞİME AÇIK ALANLAR\n--------------------\n`;
    selectedReport.areasForDevelopment.forEach((area: string) => {
      reportText += `- ${area.replace(/\*\*/g, "")}\n`;
    });

    if (
      (selectedReport as any).starExamples &&
      (selectedReport as any).starExamples.length > 0
    ) {
      reportText += `\nSTAR METODU İLE YETKİNLİK ÖRNEKLERİ\n--------------------\n`;
      (selectedReport as any).starExamples.forEach((star: any) => {
        reportText += `Durum (Situation): ${star.situation}\n`;
        reportText += `Görev (Task): ${star.task}\n`;
        reportText += `Eylem (Action): ${star.action}\n`;
        reportText += `Sonuç (Result): ${star.result}\n`;
        reportText += `Gösterdiği Yetkinlik: ${
          star.competency || "Belirtilmemiş"
        }\n\n`;
      });
    }

    if ((selectedReport as any).suitabilityAndRecommendations) {
      reportText += `\nADAYIN UYGUNLUĞU VE TAVSİYELER\n--------------------\n`;
      reportText += `Uygunluk Durumu: ${
        (selectedReport as any).suitabilityAndRecommendations.suitabilityStatus
      }\n`;
      reportText += `Gelişim Önerileri:\n`;
      (
        selectedReport as any
      ).suitabilityAndRecommendations.developmentSuggestions.forEach(
        (suggestion: string) => {
          reportText += `- ${suggestion}\n`;
        }
      );
      reportText += `\n`;
    }

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
              className="hiri-button hiri-button-secondary text-sm py-2"
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
          <div className="flex items-center gap-2">
            <button
              onClick={openUnifiedChat}
              className="hiri-button hiri-button-primary text-sm py-2"
            >
              <FaMagic className="mr-2" />
              HiriBot ile Sohbet
            </button>
            <button
              onClick={handleShareProfile}
              className="hiri-button hiri-button-secondary text-sm py-2"
            >
              <FaShareAlt className="mr-2" />
              Profili Paylaş
            </button>
            <button
              onClick={() => router.push("/candidates")}
              className="hiri-button hiri-button-secondary text-sm py-2"
            >
              <FaArrowLeft className="mr-2" />
              Aday Listesine Dön
            </button>
          </div>
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
              <button
                onClick={() => setActiveTab("linkedin")}
                className={`py-3 px-1 border-b-3 font-semibold text-sm transition-colors ${
                  activeTab === "linkedin"
                    ? "border-hiri-purple text-hiri-purple"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <FaLinkedin className="inline mr-2" />
                LinkedIn
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
                    Yapay Zeka Kişilik Envanteri Özeti
                  </h2>
                  {candidate?.personalityInventorySummaryAI ? (
                    <p className="text-sm text-slate-600 bg-teal-50 p-4 rounded-lg border border-teal-200 leading-relaxed">
                      {candidate.personalityInventorySummaryAI}
                    </p>
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-hiri-purple transition-colors">
                      <FaFileImport className="mx-auto text-3xl text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600 font-medium">
                        Kişilik Envanteri Yükle
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF, DOCX dosyası yükleyerek kişilik analizi yapın
                      </p>
                      <button className="hiri-button hiri-button-secondary text-xs mt-3">
                        <FaUpload className="mr-2" />
                        Dosya Seç
                      </button>
                    </div>
                  )}
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
                  onClick={handleInstantInvite}
                  className="hiri-button hiri-button-primary"
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
                        <div className="mb-3 sm:mb-0 flex-grow">
                          <p className="font-semibold text-slate-700 text-base">
                            {interview.date}{" "}
                            {interview.time && `${interview.time} -`}{" "}
                            {interview.type}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {interview.notes.length > 70
                              ? `${interview.notes.substring(0, 70)}...`
                              : interview.notes}
                          </p>

                          {/* Additional info for external interviews */}
                          {interview.type === "Dış Mülakat" &&
                            (interview as any).interviewers && (
                              <p className="text-xs text-slate-600 mt-1">
                                <span className="font-medium">
                                  Mülakatçılar:
                                </span>{" "}
                                {(interview as any).interviewers}
                              </p>
                            )}

                          {/* File attachments for external interviews */}
                          {interview.type === "Dış Mülakat" &&
                            (interview as any).files && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {(interview as any).files.notes && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    <FaFileAlt className="mr-1" />
                                    {(interview as any).files.notes}
                                  </span>
                                )}
                                {(interview as any).files.video && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                    <FaUpload className="mr-1" />
                                    {(interview as any).files.video}
                                  </span>
                                )}
                              </div>
                            )}
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

          {/* LinkedIn Sekmesi */}
          {activeTab === "linkedin" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-700">
                  <FaLinkedin className="inline mr-2 text-blue-600" />
                  LinkedIn Aday Aktarımı
                </h2>
                <button
                  onClick={() => setShowLinkedinModal(true)}
                  className="hiri-button hiri-button-primary"
                >
                  <FaLinkedin className="mr-2" />
                  LinkedIn'den CSV Aktar
                </button>
              </div>

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
                      LinkedIn'de aday araması yapın ve sonuçları CSV formatında
                      dışa aktarın.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      2
                    </span>
                    <p>
                      Dışa aktardığınız CSV dosyasını yukarıdaki butona
                      tıklayarak yükleyin.
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
                  <h4 className="font-semibold text-blue-800">Toplu İşlem</h4>
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
                  aramalarınızı genişletin ve daha detaylı profil bilgilerine
                  erişin. Aktarılan adaylar doğrudan <strong>Adaylar</strong>{" "}
                  sayfasında görünecektir.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Notes and Transaction History Accordion */}
        <div className="mt-8">
          <div
            className="cursor-pointer p-4 bg-slate-50 rounded-lg font-semibold transition-colors hover:bg-slate-100 border border-slate-200 flex justify-between items-center"
            onClick={() => setShowNotesLogsAccordion(!showNotesLogsAccordion)}
          >
            <span className="flex items-center">
              <FaHistory className="mr-2 text-hiri-purple" />
              Notlar ve İşlem Geçmişi
            </span>
            {showNotesLogsAccordion ? (
              <FaChevronUp className="transition-transform" />
            ) : (
              <FaChevronDown className="transition-transform" />
            )}
          </div>

          {showNotesLogsAccordion && (
            <div className="bg-white border border-slate-200 border-t-0 rounded-b-lg p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notes Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-200">
                    Aday Hakkındaki Notlar
                  </h3>
                  <div className="mb-4">
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-hiri-purple focus:border-transparent"
                      rows={3}
                      placeholder="Yeni not ekleyin..."
                    />
                    <button
                      onClick={handleAddNote}
                      className="hiri-button hiri-button-primary text-sm py-2 px-4 mt-2"
                    >
                      <FaStickyNote className="mr-2" />
                      Kaydet
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {candidate?.notes && candidate.notes.length > 0 ? (
                      [...candidate.notes].reverse().map((note, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 p-3 rounded-lg border border-slate-200"
                        >
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {note.text}
                          </p>
                          <p className="text-xs text-slate-500 mt-2 text-right">
                            -- {note.user} ({note.timestamp})
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm italic text-center p-4 text-slate-500">
                        Henüz not eklenmemiş.
                      </p>
                    )}
                  </div>
                </div>

                {/* Transaction History Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-slate-200">
                    İşlem Geçmişi
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {candidate?.logs && candidate.logs.length > 0 ? (
                      [...candidate.logs].reverse().map((log, index) => {
                        const getIconComponent = (iconName: string) => {
                          switch (iconName) {
                            case "fa-sticky-note":
                              return <FaStickyNote />;
                            case "fa-file-import":
                              return <FaFileImport />;
                            case "fa-user-plus":
                              return <FaUserPlus />;
                            case "fa-eye":
                              return <FaEye />;
                            case "fa-upload":
                              return <FaUpload />;
                            default:
                              return <FaHistory />;
                          }
                        };

                        return (
                          <div
                            key={index}
                            className="flex items-start py-3 border-b border-slate-100 last:border-b-0"
                          >
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${log.color}`}
                            >
                              {getIconComponent(log.icon)}
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm text-slate-700">
                                {log.action}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {log.user} - {log.timestamp}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm italic text-center p-4 text-slate-500">
                        İşlem geçmişi bulunamadı.
                      </p>
                    )}
                  </div>
                </div>
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

                {/* Deneyim Analizi */}
                {(selectedReport as any).experienceAnalysis && (
                  <div>
                    <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                      <FaFileAlt className="mr-2 inline" />
                      Deneyim Analizi
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {(selectedReport as any).experienceAnalysis}
                    </p>
                  </div>
                )}

                {/* Diğer Yetenekler */}
                {(selectedReport as any).otherSkills && (
                  <div>
                    <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                      <FaFileAlt className="mr-2 inline" />
                      Diğer Yetenekler
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {(selectedReport as any).otherSkills}
                    </p>
                  </div>
                )}

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

                {/* STAR Metodu ile Yetkinlik Örnekleri */}
                {(selectedReport as any).starExamples &&
                  (selectedReport as any).starExamples.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                        <FaFileAlt className="mr-2 inline" />
                        STAR Metodu ile Yetkinlik Örnekleri
                      </h3>
                      <div className="space-y-4">
                        {(selectedReport as any).starExamples.map(
                          (star: any, index: number) => (
                            <div
                              key={index}
                              className="p-4 bg-indigo-50 rounded-md border border-indigo-200 shadow-sm"
                            >
                              <p className="font-medium text-indigo-700 mb-1">
                                Durum (Situation):
                              </p>
                              <p className="mb-3 text-slate-600">
                                {star.situation}
                              </p>
                              <p className="font-medium text-indigo-700 mb-1">
                                Görev (Task):
                              </p>
                              <p className="mb-3 text-slate-600">{star.task}</p>
                              <p className="font-medium text-indigo-700 mb-1">
                                Eylem (Action):
                              </p>
                              <p className="mb-3 text-slate-600">
                                {star.action}
                              </p>
                              <p className="font-medium text-indigo-700 mb-1">
                                Sonuç (Result):
                              </p>
                              <p className="mb-3 text-slate-600">
                                {star.result}
                              </p>
                              <p className="font-medium text-purple-700 mt-2">
                                Gösterdiği Yetkinlik:
                              </p>
                              <p className="text-slate-600">
                                {star.competency || "Belirtilmemiş"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Adayın Uygunluğu ve Tavsiyeler */}
                {(selectedReport as any).suitabilityAndRecommendations && (
                  <div>
                    <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                      <FaFileAlt className="mr-2 inline" />
                      Adayın Uygunluğu ve Tavsiyeler
                    </h3>
                    <div className="space-y-3">
                      <p>
                        <strong className="text-slate-700">
                          Uygunluk Durumu:
                        </strong>
                        <span
                          className={`ml-2 font-bold ${
                            (
                              selectedReport as any
                            ).suitabilityAndRecommendations.suitabilityStatus.includes(
                              "Yüksek"
                            )
                              ? "text-green-600"
                              : (
                                  selectedReport as any
                                ).suitabilityAndRecommendations.suitabilityStatus.includes(
                                  "Değerlendirilebilir"
                                )
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {
                            (selectedReport as any)
                              .suitabilityAndRecommendations.suitabilityStatus
                          }
                        </span>
                      </p>
                      <div>
                        <strong className="text-slate-700">
                          Gelişim Önerileri:
                        </strong>
                        <ul className="list-disc list-inside space-y-1 mt-2 pl-4 text-slate-600">
                          {(
                            selectedReport as any
                          ).suitabilityAndRecommendations.developmentSuggestions.map(
                            (suggestion: string, index: number) => (
                              <li key={index}>{suggestion}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Genel Değerlendirme */}
                <div>
                  <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                    <FaChartBar className="mr-2 inline" />
                    Genel Değerlendirme
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

                {/* Görsel Değerlendirmeler */}
                <div>
                  <h3 className="text-lg font-semibold text-hiri-purple mb-3 border-b-2 border-hiri-purple pb-1">
                    <FaChartBar className="mr-2 inline" />
                    Görsel Değerlendirmeler
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-700 text-base mb-2">
                        Yetenek Haritası (Örnek)
                      </h4>
                      <img
                        src="https://placehold.co/600x400/E0E7FF/4338CA?text=Yetenek+Radar+Grafigi%0A(Teknik,+Yumusak+Beceriler)"
                        alt="Yetenek Haritası Grafiği"
                        className="w-full h-auto rounded-lg shadow-sm border border-slate-200"
                      />
                      <p className="text-xs text-slate-500 mt-2 text-center">
                        Adayın temel yetkinliklerinin görsel temsili.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 text-base mb-2">
                        Beceri Bulutu (Örnek)
                      </h4>
                      <img
                        src="https://placehold.co/600x400/DBEAFE/1D4ED8?text=Beceri+Bulutu%0A(React,+TypeScript,+JavaScript)"
                        alt="Beceri Bulutu Grafiği"
                        className="w-full h-auto rounded-lg shadow-sm border border-slate-200"
                      />
                      <p className="text-xs text-slate-500 mt-2 text-center">
                        Mülakatta ve CV'de öne çıkan anahtar kelimeler.
                      </p>
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
                          <FaUpload className="mx-auto text-2xl text-slate-400 mb-2" />
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

      {/* Share Profile Modal Portal */}
      {showShareModal && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setShowShareModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-700">
                    Aday Profilini Paylaş
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {candidate?.name} {candidate?.surname} adlı adayın profilini
                    paylaşıyorsunuz.
                  </p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
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
                  onSubmit={handleGenerateShareLink}
                  className="p-6 space-y-6"
                >
                  {/* Shareable Fields */}
                  <div>
                    <label className="block text-base font-semibold mb-3">
                      Paylaşılacak Alanlar
                    </label>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <div className="flex items-center">
                        <input
                          id="share_cvSummary"
                          type="checkbox"
                          checked={shareableFields.cvSummary}
                          onChange={(e) =>
                            setShareableFields((prev) => ({
                              ...prev,
                              cvSummary: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-hiri-purple rounded border-gray-300 focus:ring-hiri-purple"
                        />
                        <label
                          htmlFor="share_cvSummary"
                          className="ml-3 text-sm"
                        >
                          CV Özeti
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="share_compatibility"
                          type="checkbox"
                          checked={shareableFields.compatibility}
                          onChange={(e) =>
                            setShareableFields((prev) => ({
                              ...prev,
                              compatibility: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-hiri-purple rounded border-gray-300 focus:ring-hiri-purple"
                        />
                        <label
                          htmlFor="share_compatibility"
                          className="ml-3 text-sm"
                        >
                          Uyumluluk Skoru
                        </label>
                      </div>

                      {candidate?.personalityInventorySummaryAI && (
                        <div className="flex items-center">
                          <input
                            id="share_personality"
                            type="checkbox"
                            checked={shareableFields.personality}
                            onChange={(e) =>
                              setShareableFields((prev) => ({
                                ...prev,
                                personality: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 text-hiri-purple rounded border-gray-300 focus:ring-hiri-purple"
                          />
                          <label
                            htmlFor="share_personality"
                            className="ml-3 text-sm"
                          >
                            Kişilik Envanteri
                          </label>
                        </div>
                      )}

                      {candidate?.interviews &&
                        candidate.interviews.length > 0 && (
                          <div className="flex items-center">
                            <input
                              id="share_interviews"
                              type="checkbox"
                              checked={shareableFields.interviews}
                              onChange={(e) =>
                                setShareableFields((prev) => ({
                                  ...prev,
                                  interviews: e.target.checked,
                                }))
                              }
                              className="h-4 w-4 text-hiri-purple rounded border-gray-300 focus:ring-hiri-purple"
                            />
                            <label
                              htmlFor="share_interviews"
                              className="ml-3 text-sm"
                            >
                              Mülakatlar
                            </label>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Email and Duration */}
                  <div className="border-t pt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        E-posta*
                      </label>
                      <input
                        type="email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        className="hiri-input"
                        placeholder="paylasilacak@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Link Geçerlilik Süresi (Saat)
                      </label>
                      <input
                        type="number"
                        value={shareDuration}
                        onChange={(e) =>
                          setShareDuration(Number(e.target.value))
                        }
                        className="hiri-input w-32"
                        min="1"
                        max="168"
                      />
                    </div>
                  </div>

                  {/* Generated Link */}
                  {generatedLink && (
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Oluşturulan Paylaşım Linki
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={generatedLink}
                          readOnly
                          className="hiri-input bg-slate-100 text-slate-600 flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="hiri-button hiri-button-secondary px-4 flex-shrink-0"
                        >
                          <FaCopy className="mr-2" />
                          Kopyala
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="hiri-button hiri-button-primary"
                    >
                      <FaLink className="mr-2" />
                      Link Oluştur
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* LinkedIn Import Modal */}
      {showLinkedinModal && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => {
              setShowLinkedinModal(false);
              setLinkedinImportStep(1);
              setLinkedinFile(null);
              setLinkedinImportProgress(0);
            }}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {linkedinImportStep === 1 && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-slate-700">
                      LinkedIn'den Aday Aktar (CSV)
                    </h2>
                    <button
                      onClick={() => {
                        setShowLinkedinModal(false);
                        setLinkedinImportStep(1);
                        setLinkedinFile(null);
                        setLinkedinImportProgress(0);
                      }}
                      className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  <p className="text-sm text-slate-500 mb-5">
                    LinkedIn'den dışa aktardığınız aday listesi dosyasını (CSV)
                    yükleyin. Sistem, her adayın profilini tarayarak tam CV
                    bilgilerini alacaktır.
                  </p>

                  <label className="dropzone-style mt-1 flex flex-col items-center justify-center px-6 py-10 rounded-lg cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <FaLinkedin className="text-5xl text-blue-500 mx-auto mb-4" />
                      <div className="flex text-sm text-slate-500 mt-4">
                        <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-purple-600 hover:text-purple-500">
                          Dosya seçin
                        </span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".csv"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setLinkedinFile(file);
                              handleLinkedinImport();
                            }
                          }}
                        />
                        <p className="pl-1">veya sürükleyip bırakın</p>
                      </div>
                      <p className="text-xs text-slate-400">
                        Sadece CSV dosyaları
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {linkedinImportStep === 2 && (
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-semibold mb-4 text-slate-700">
                    Adaylar Sisteme Ekleniyor...
                  </h2>
                  <FaSyncAlt className="fa-spin text-5xl text-purple-600 mb-4 mx-auto animate-spin" />
                  <p className="text-slate-600">
                    Adaylar ekleniyor ve HiriBot CV'lerini taramak için sıraya
                    alıyor.
                  </p>

                  <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${linkedinImportProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    İşlem devam ediyor... {linkedinImportProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
