"use client";

import { useState, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import {
  FaArrowLeft,
  FaVideo,
  FaVoicemail,
  FaMagic,
  FaPlus,
  FaFolderOpen,
  FaPencilAlt,
  FaSave,
  FaPaperPlane,
  FaGripVertical,
  FaSlidersH,
  FaTrashAlt,
} from "react-icons/fa";
// import { DUMMY_CANDIDATES } from "@/lib/dummy-data";

// Temporary dummy data
type LocalCandidate = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
};

const DUMMY_CANDIDATES: LocalCandidate[] = [
  {
    id: "aday1",
    name: "Mehmet Ali",
    surname: "Demir",
    email: "mehmetalidemir@example.com",
    phone: "0555 123 4567",
    position: "Senior Software Developer - Turkcell",
  },
];

type Question = {
  id: string;
  text: string;
  thinkTime: number;
  time: number;
  retries: number;
};

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

// Component that uses searchParams
function OnDemandInterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const candidate: LocalCandidate | null =
    DUMMY_CANDIDATES.find((c) => c.id === candidateId) || null;

  const [interviewType, setInterviewType] = useState("video");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const addQuestionWithAI = () => {
    const newQuestions: Question[] = [
      {
        id: `q${Date.now()}`,
        text: "Bu pozisyonda sizi en çok neyin heyecanlandırdığını anlatır mısınız?",
        time: 120,
        thinkTime: 30,
        retries: 1,
      },
      {
        id: `q${Date.now() + 1}`,
        text: "Ekip çalışması ve bireysel çalışma arasında nasıl bir denge kurarsınız? Bir örnek verin.",
        time: 120,
        thinkTime: 30,
        retries: 1,
      },
      {
        id: `q${Date.now() + 2}`,
        text: "Kariyerinizdeki en zorlayıcı proje neydi ve bu zorluğun üstesinden nasıl geldiniz?",
        time: 180,
        thinkTime: 45,
        retries: 1,
      },
    ];
    setQuestions((prev) => [...prev, ...newQuestions]);
    alert(`${newQuestions.length} adet AI tabanlı örnek soru eklendi.`);
  };

  const addQuestionManually = () => {
    setQuestions((prev) => [
      ...prev,
      { id: `q${Date.now()}`, text: "", time: 90, thinkTime: 30, retries: 1 },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (
    id: string,
    field: keyof Question,
    value: string | number
  ) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleFinalSend = () => {
    alert("Mülakat daveti gönderildi! (Prototip)");
    setShowPreviewModal(false);
    router.push(`/candidates/${candidateId}`);
  };

  if (!candidate) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100">
        <Header currentView="adaylar" />
        <main className="container mx-auto p-8 flex-grow text-center">
          <h1 className="text-2xl font-bold text-slate-700">
            Aday bulunamadı.
          </h1>
          <p className="text-slate-500 my-4">
            Lütfen geçerli bir aday seçerek tekrar deneyin.
          </p>
          <button
            onClick={() => router.push("/candidates")}
            className="hiri-button hiri-button-primary"
          >
            Adaylar Sayfasına Dön
          </button>
        </main>
        <Footer />

        {/* Önizle ve Gönder Modalı */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-2xl font-bold text-slate-800">
                  Önizle ve Gönder
                </h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <i className="fas fa-times fa-lg"></i>
                </button>
              </div>

              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto bg-gray-50">
                {/* Sol: İnteraktif Akış */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="font-bold text-lg mb-3 text-slate-700">
                    Mülakat Akışı (Sıralamayı Değiştir)
                  </h3>
                  <div className="space-y-3">
                    {questions.map((q, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border rounded-md p-3 flex items-center gap-3"
                      >
                        <span className="text-gray-400 cursor-grab">
                          <FaGripVertical />
                        </span>
                        <span className="font-semibold text-gray-600">
                          {i + 1}.
                        </span>
                        <span className="flex-grow text-sm">{q.text}</span>
                        <span className="text-xs text-gray-500">{q.time}s</span>
                      </div>
                    ))}
                    {questions.length === 0 && (
                      <p className="text-center text-gray-500 py-6">
                        Henüz soru eklenmedi.
                      </p>
                    )}
                  </div>
                </div>

                {/* Sağ: İnteraktif Mail */}
                <div className="bg-white border rounded-lg p-4 flex flex-col shadow-sm">
                  <h3 className="font-bold text-lg mb-3 text-slate-700">
                    Davet Maili (İçeriği Düzenle)
                  </h3>
                  <div className="border rounded-md p-3 flex-grow bg-gray-50/50">
                    <div className="text-sm text-gray-500 mb-3">
                      <p>
                        <strong>Konu:</strong>
                      </p>
                      <input
                        type="text"
                        className="font-semibold w-full bg-transparent border-b focus:outline-none focus:border-purple-500 p-1"
                        defaultValue={`${candidate?.name || ""} ${
                          candidate?.surname || ""
                        } - ${
                          interviewType === "video" ? "Video" : "Telefon"
                        } Mülakat Davetiniz`}
                      />
                    </div>
                    <hr className="my-3" />
                    <div className="prose prose-sm max-w-none w-full h-full">
                      <textarea
                        className="w-full h-60 p-2 border rounded focus:outline-none focus:border-purple-500 text-sm resize-none"
                        defaultValue={`Merhaba ${candidate?.name} ${
                          candidate?.surname
                        },

Turkcell şirketindeki ${
                          candidate?.position
                        } pozisyonu için bir sonraki adımı sizinle paylaşmaktan mutluluk duyarız.

Sizi daha yakından tanımak için hazırladığımız bu ${
                          interviewType === "video"
                            ? "video mülakatı"
                            : "telefon mülakatını"
                        } tamamlamak için lütfen ${
                          interviewType === "video"
                            ? "aşağıdaki linke tıklayarak mülakata başlayın"
                            : "telefonunuzu açık tutun, sizi arayacağız"
                        }.

Başarılar dileriz,
Turkcell İK Ekibi`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center p-4 border-t bg-gray-100 rounded-b-xl">
                <button
                  onClick={handleFinalSend}
                  className="hiri-button hiri-button-primary flex items-center gap-2"
                >
                  <FaPaperPlane /> Daveti Şimdi Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header currentView="candidates" />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <button
              onClick={() => router.push(`/candidates/${candidateId}`)}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center mb-1"
            >
              <FaArrowLeft className="mr-2" />
              Aday Profiline Dön
            </button>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Yeni On-Demand Mülakat Hazırla
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="hiri-button hiri-button-outline">
              <FaSave className="mr-2" />
              Taslak Kaydet
            </button>
            <button
              onClick={() => setShowPreviewModal(true)}
              className="hiri-button hiri-button-primary"
            >
              <FaPaperPlane className="mr-2" /> Önizle ve Gönder
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Sütun: Ayarlar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-8">
              {/* Mülakat Türü */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-slate-700">
                  1. Mülakat Türünü Seçin
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setInterviewType("video")}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${
                      interviewType === "video"
                        ? "border-hiri-purple bg-purple-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          interviewType === "video"
                            ? "bg-hiri-purple text-white"
                            : "bg-slate-100 text-hiri-purple"
                        }`}
                      >
                        <FaVideo />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-slate-800">
                          Video Mülakat
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Aday, link üzerinden web kamerasıyla soruları
                          yanıtlar.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setInterviewType("phone")}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${
                      interviewType === "phone"
                        ? "border-hiri-purple bg-purple-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          interviewType === "phone"
                            ? "bg-hiri-purple text-white"
                            : "bg-slate-100 text-hiri-purple"
                        }`}
                      >
                        <FaVoicemail />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-slate-800">
                          Telefon Mülakatı
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          HiriBot, adayı arayarak sesli soruları iletir.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mülakat Soruları */}
              <div>
                <h2 className="text-xl font-semibold mb-3 text-slate-700">
                  2. Mülakat Sorularını Hazırlayın
                </h2>
                <button
                  onClick={addQuestionWithAI}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg mb-4 flex items-center justify-center gap-3 hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <FaMagic /> Tek Tıkla AI ile Oluştur (CV ve Pozisyona Göre)
                </button>
                <div className="space-y-3">
                  {questions.length === 0 ? (
                    <p className="text-center text-slate-500 py-6">
                      Başlamak için sorular oluşturun veya bir set yükleyin.
                    </p>
                  ) : (
                    questions.map((q, index) => (
                      <div
                        key={q.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2 transition hover:shadow-md"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-gray-400 cursor-grab">
                            <FaGripVertical />
                          </span>
                          <span className="font-semibold text-gray-600">
                            {index + 1}.
                          </span>
                          <div className="flex-grow">
                            <input
                              type="text"
                              value={q.text}
                              onChange={(e) =>
                                updateQuestion(q.id, "text", e.target.value)
                              }
                              className="w-full text-base bg-transparent focus:outline-none p-1 hiri-input"
                              placeholder="Sorunuzu buraya yazın..."
                            />
                          </div>
                          <button
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => removeQuestion(q.id)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="relative mt-4">
                  <button
                    onClick={addQuestionManually}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                  >
                    <FaPlus /> Yeni Ekle
                  </button>
                </div>

                {/* 3. Videolar (Opsiyonel) */}
                <div className="pt-6 border-t">
                  <h2 className="text-xl font-semibold mb-3 text-slate-700">
                    3. Videolar Ekleyin (Opsiyonel)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                      <div className="text-gray-400 mb-2">
                        <FaVideo className="text-3xl mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Karşılama Videosu
                      </p>
                      <button className="hiri-button hiri-button-secondary text-xs py-1.5 px-3">
                        <FaPlus className="mr-1" /> Video Ekle
                      </button>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                      <div className="text-gray-400 mb-2">
                        <FaVideo className="text-3xl mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Veda Videosu</p>
                      <button className="hiri-button hiri-button-secondary text-xs py-1.5 px-3">
                        <FaPlus className="mr-1" /> Video Ekle
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Davet ve Zamanlamayı Ayarlayın */}
                <div className="pt-6 border-t">
                  <h2 className="text-xl font-semibold mb-3 text-slate-700">
                    4. Davet ve Zamanlamayı Ayarlayın
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Mülakat Son Tarihi
                      </label>
                      <input type="date" className="hiri-input" />
                    </div>

                    {interviewType === "phone" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">
                          Telefon Arama Sıklığı
                        </label>
                        <select className="hiri-input">
                          <option value="2-2">
                            2 gün boyunca, günde 2 kez (Önerilen)
                          </option>
                          <option value="3-1">
                            3 gün boyunca, günde 1 kez
                          </option>
                          <option value="1-1">Sadece 1 kez</option>
                          <option value="custom">Özel...</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Davet Maili Konusu
                      </label>
                      <input
                        type="text"
                        className="hiri-input mb-3"
                        defaultValue={`${candidate?.name} ${
                          candidate?.surname
                        } - ${
                          interviewType === "video" ? "Video" : "Telefon"
                        } Mülakat Davetiniz`}
                      />

                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Mail İçeriği
                      </label>
                      <textarea
                        rows={8}
                        className="hiri-input"
                        defaultValue={`Merhaba ${candidate?.name} ${
                          candidate?.surname
                        },

Turkcell şirketindeki ${
                          candidate?.position
                        } pozisyonu için bir sonraki adımı sizinle paylaşmaktan mutluluk duyarız.

Sizi daha yakından tanımak için hazırladığımız bu ${
                          interviewType === "video"
                            ? "video mülakatı"
                            : "telefon mülakatını"
                        } tamamlamak için lütfen ${
                          interviewType === "video"
                            ? "aşağıdaki linke tıklayarak mülakata başlayın"
                            : "telefonunuzu açık tutun, sizi arayacağız"
                        }.

Başarılar dileriz,
Turkcell İK Ekibi`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Sütun: Canlı Önizleme */}
          <div className="sticky top-8">
            <div className="bg-[#232a3b] rounded-2xl p-3 shadow-2xl h-full">
              <div className="bg-slate-100 rounded-xl flex-grow h-full p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                  {interviewType === "video"
                    ? "Video Mülakat"
                    : "Telefon Mülakatı"}
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                  {candidate.position}
                </p>
                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-3 bg-white shadow-sm"
                    >
                      <p className="font-semibold text-gray-800">
                        {i + 1}. {q.text || "..."}
                      </p>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                      <p>Canlı önizleme burada görünecek.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Preview Modal */}
      {showPreviewModal && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setShowPreviewModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-2xl font-bold text-slate-800">
                  Önizle ve Gönder
                </h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <i className="fas fa-times fa-lg"></i>
                </button>
              </div>
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto bg-gray-50">
                {/* Sol: İnteraktif Akış */}
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h3 className="font-bold text-lg mb-3 text-slate-700">
                    Mülakat Akışı (Sıralamayı Değiştir)
                  </h3>
                  <div className="space-y-3">
                    {questions.map((q, index) => (
                      <div
                        key={q.id}
                        className="border rounded-lg p-3 bg-white"
                      >
                        <p className="font-semibold text-gray-800">
                          {index + 1}. {q.text || "..."}
                        </p>
                      </div>
                    ))}
                    {questions.length === 0 && (
                      <p className="text-center text-gray-500 py-6">
                        Henüz soru eklenmemiş.
                      </p>
                    )}
                  </div>
                </div>
                {/* Sağ: İnteraktif Mail */}
                <div className="bg-white border rounded-lg p-4 flex flex-col shadow-sm">
                  <h3 className="font-bold text-lg mb-3 text-slate-700">
                    Davet Maili (İçeriği Düzenle)
                  </h3>
                  <div className="border rounded-md p-3 flex-grow bg-gray-50/50">
                    <div className="text-sm text-gray-500">
                      <p>
                        <strong>Konu:</strong>{" "}
                        <input
                          type="text"
                          defaultValue={`${
                            candidate?.name || "Aday"
                          } Video Mülakat Davetiniz`}
                          className="font-semibold w-full bg-transparent border-b focus:outline-none focus:border-purple-500"
                        />
                      </p>
                    </div>
                    <hr className="my-3" />
                    <div
                      contentEditable="true"
                      className="prose prose-sm max-w-none w-full h-full focus:outline-none p-1"
                      suppressContentEditableWarning={true}
                    >
                      Merhaba {candidate?.name || "Aday"},<br />
                      <br />
                      {candidate?.position || "Pozisyon"} pozisyonu için video
                      mülakatınıza davet ediyoruz...
                      <br />
                      <br />
                      İyi günler dileriz.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center p-4 border-t bg-gray-100 rounded-b-xl">
                <button
                  onClick={() => {
                    alert("Mülakat daveti gönderildi! (Prototip)");
                    setShowPreviewModal(false);
                  }}
                  className="hiri-button hiri-button-primary flex items-center gap-2"
                >
                  <FaPaperPlane />
                  Daveti Şimdi Gönder
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

// Main component with Suspense boundary
export default function OnDemandCreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnDemandInterviewContent />
    </Suspense>
  );
}
