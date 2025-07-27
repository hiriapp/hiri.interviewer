"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  FaPlus,
  FaEdit,
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaStar,
  FaExternalLinkAlt,
} from "react-icons/fa";

// Dummy data - gerçek uygulamada API'den gelecek
const DUMMY_POSITIONS = [
  {
    id: "pos1",
    title: "Senior Software Developer",
    company: "Kurum Teknoloji",
    location: "İstanbul, Türkiye",
    type: "Tam Zamanlı",
    level: "Senior",
    department: "Mühendislik",
    status: "Aktif",
    applicants: 24,
    posted: "3 gün önce",
    salary: "25.000 - 35.000 TL",
    description: `Kurum olarak yeteneklerimize eşsiz insan deneyimi yaşatarak, değer yaratan sürdürülebilir bir organizasyon inşa etmeyi ve işveren markamızı zirveye taşımayı hedefliyoruz. Bu hedef doğrultusunda benimsediğimiz değerlerimizi iş yapış biçimlerimize yansıtıyoruz.`,
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
    title: "Junior Marketing Specialist",
    company: "Hiri Inc.",
    location: "İstanbul, Türkiye",
    type: "Tam Zamanlı",
    level: "Junior",
    department: "Pazarlama",
    status: "Aktif",
    applicants: 12,
    posted: "1 hafta önce",
    salary: "15.000 - 20.000 TL",
    description:
      "Hiri Inc. olarak pazarlama ekibimize dinamik, öğrenmeye açık bir Junior Marketing Specialist arıyoruz. İnovasyon, müşteri odaklılık ve takım çalışması değerlerimizle uyumlu adayları bekliyoruz.",
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

export default function PositionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPositions = DUMMY_POSITIONS.filter(
    (position) =>
      position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPosition = () => {
    router.push("/positions/create");
  };

  const handleEditPosition = (position: (typeof DUMMY_POSITIONS)[0]) => {
    router.push(`/positions/${position.id}/edit`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-700";
      case "Pasif":
        return "bg-gray-100 text-gray-700";
      case "Dolu":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Senior":
        return "bg-purple-100 text-purple-700";
      case "Mid":
        return "bg-blue-100 text-blue-700";
      case "Junior":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout title="Pozisyonlar - HiriBot" activeSection="positions">
      <div className="container mx-auto">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white p-6 mb-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold mb-1 flex items-center">
                  <FaBriefcase className="mr-3 text-2xl" />
                  Pozisyonlar
                </h1>
                <p className="text-purple-100 text-base">
                  Açık pozisyonları yönetin ve yeni fırsatlar yaratın
                </p>
              </div>
              <button
                onClick={handleNewPosition}
                className="bg-white text-purple-700 hover:bg-purple-50 font-semibold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center text-sm"
              >
                <FaPlus className="mr-2" />
                Yeni Pozisyon Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <div className="w-full md:flex-1 md:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Pozisyon, şirket veya departman ara..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="font-medium">
                  {filteredPositions.length} Pozisyon
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-purple-500 text-xs" />
                <span className="font-medium">
                  {filteredPositions.reduce(
                    (acc, pos) => acc + pos.applicants,
                    0
                  )}{" "}
                  Başvuru
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Positions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPositions.length === 0 ? (
            <div className="col-span-2 text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBriefcase className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Pozisyon Bulunamadı
                </h3>
                <p className="text-gray-500">
                  Arama kriterlerinize uygun pozisyon bulunamadı. Farklı anahtar
                  kelimeler deneyin.
                </p>
              </div>
            </div>
          ) : (
            filteredPositions.map((position) => (
              <div
                key={position.id}
                className="group relative bg-white rounded-2xl border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 pb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-purple-100 transition-colors">
                        {position.title}
                      </h3>
                      <p className="text-purple-100 font-medium">
                        {position.company}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          position.status
                        )}`}
                      >
                        {position.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-purple-100">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt />
                      <span>{position.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>{position.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUsers />
                      <span>{position.applicants} başvuru</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 pt-0">
                  {/* Position Info */}
                  <div className="relative -mt-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                            position.level
                          )}`}
                        >
                          {position.level} Level
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {position.department}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {position.description.substring(0, 120)}...
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{position.posted}</span>
                        <span className="font-semibold text-green-600">
                          {position.salary}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Aranan Yetenekler
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {position.requirements.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {position.requirements.length > 4 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                          +{position.requirements.length - 4} daha
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleEditPosition(position)}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    Pozisyonu Düzenle
                    <FaExternalLinkAlt className="text-xs" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
