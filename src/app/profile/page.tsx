"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaBell,
  FaLock,
  FaPalette,
  FaGlobe,
  FaSave,
  FaEdit,
  FaSignOutAlt,
  FaCamera,
  FaCheck,
  FaTimes,
  FaBriefcase,
} from "react-icons/fa";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPage] = useState("profile"); // Header navigation için
  const [currentView, setCurrentView] = useState("profile"); // Profil sekmeleri için
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Form state
  const [profileData, setProfileData] = useState({
    firstName: "Turkcell",
    lastName: "Yöneticisi",
    email: "admin@turkcell.com.tr",
    company: "Turkcell Teknoloji",
    department: "İnsan Kaynakları",
    position: "HR Müdürü",
    phone: "+90 555 123 45 67",
    bio: "İnsan kaynakları alanında 8+ yıllık deneyime sahip, teknoloji odaklı çözümler geliştermeyi seven bir profesyonelim.",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    interviewReminders: true,
    weeklyReports: true,
    language: "tr",
    theme: "light",
    timezone: "Europe/Istanbul",
  });

  const handleSave = () => {
    setShowSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const renderProfileForm = () => (
    <div className="space-y-6">
      {/* Profil Fotoğrafı */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-hiri-purple to-hiri-blue rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            T
          </div>
          {isEditing && (
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-hiri-purple text-white rounded-full flex items-center justify-center hover:bg-hiri-purple-dark transition-colors shadow-md">
              <FaCamera className="text-xs" />
            </button>
          )}
        </div>
        {isEditing && (
          <Button variant="outline" size="sm">
            Fotoğraf Değiştir
          </Button>
        )}
      </div>

      {/* Kişisel Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ad
          </label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData({ ...profileData, firstName: e.target.value })
            }
            disabled={!isEditing}
            className="hiri-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Soyad
          </label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) =>
              setProfileData({ ...profileData, lastName: e.target.value })
            }
            disabled={!isEditing}
            className="hiri-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-posta
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            disabled={!isEditing}
            className="hiri-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefon
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
            disabled={!isEditing}
            className="hiri-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Şirket
          </label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) =>
              setProfileData({ ...profileData, company: e.target.value })
            }
            disabled={!isEditing}
            className="hiri-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departman
          </label>
          <input
            type="text"
            value={profileData.department}
            onChange={(e) =>
              setProfileData({ ...profileData, department: e.target.value })
            }
            disabled={!isEditing}
            className="hiri-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pozisyon
        </label>
        <input
          type="text"
          value={profileData.position}
          onChange={(e) =>
            setProfileData({ ...profileData, position: e.target.value })
          }
          disabled={!isEditing}
          className="hiri-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hakkımda
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) =>
            setProfileData({ ...profileData, bio: e.target.value })
          }
          disabled={!isEditing}
          rows={4}
          className="hiri-input"
          placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
        />
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Bildirim Ayarları */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaBell className="mr-2 text-hiri-purple" />
            Bildirim Tercihleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "emailNotifications",
              label: "E-posta Bildirimleri",
              desc: "Önemli güncellemeler için e-posta alın",
            },
            {
              key: "smsNotifications",
              label: "SMS Bildirimleri",
              desc: "Acil durumlar için SMS alın",
            },
            {
              key: "interviewReminders",
              label: "Mülakat Hatırlatıcıları",
              desc: "Yaklaşan mülakatlar için hatırlatıcı",
            },
            {
              key: "weeklyReports",
              label: "Haftalık Raporlar",
              desc: "Haftalık özet raporları alın",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    settings[item.key as keyof typeof settings] as boolean
                  }
                  onChange={(e) =>
                    setSettings({ ...settings, [item.key]: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hiri-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hiri-purple"></div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Genel Ayarlar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaPalette className="mr-2 text-hiri-purple" />
            Genel Ayarlar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dil
            </label>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
              className="hiri-input"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              value={settings.theme}
              onChange={(e) =>
                setSettings({ ...settings, theme: e.target.value })
              }
              className="hiri-input"
            >
              <option value="light">Açık Tema</option>
              <option value="dark">Koyu Tema</option>
              <option value="auto">Sistem Ayarı</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saat Dilimi
            </label>
            <select
              value={settings.timezone}
              onChange={(e) =>
                setSettings({ ...settings, timezone: e.target.value })
              }
              className="hiri-input"
            >
              <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
              <option value="Europe/London">Londra (UTC+0)</option>
              <option value="America/New_York">New York (UTC-5)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Güvenlik */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaLock className="mr-2 text-hiri-purple" />
            Güvenlik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Şifre Değiştir
          </Button>
          <Button variant="outline" className="w-full justify-start">
            İki Faktörlü Kimlik Doğrulama
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:bg-red-50 border-red-200"
          >
            Hesabı Deaktive Et
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentView={currentPage} />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Başlık ve Profil Özeti */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="w-24 h-24 bg-gradient-to-br from-hiri-purple to-hiri-blue rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                T
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-gray-600 mt-1 text-lg font-medium">
                  {profileData.position}
                </p>
                <p className="text-gray-500 text-sm">{profileData.company}</p>
              </div>
            </div>

            {/* Başarı Bildirimi */}
            {showSaveSuccess && (
              <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
                <FaCheck className="mr-2" />
                Değişiklikler başarıyla kaydedildi!
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setCurrentView("profile")}
                className={`relative py-4 px-1 text-sm font-medium transition-all duration-200 ${
                  currentView === "profile"
                    ? "text-hiri-purple border-b-2 border-hiri-purple"
                    : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      currentView === "profile"
                        ? "bg-hiri-purple text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FaUser className="text-xs" />
                  </div>
                  <span>Profil Bilgileri</span>
                </div>
                {currentView === "profile" && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-hiri-purple to-hiri-blue"></div>
                )}
              </button>

              <button
                onClick={() => setCurrentView("settings")}
                className={`relative py-4 px-1 text-sm font-medium transition-all duration-200 ${
                  currentView === "settings"
                    ? "text-hiri-purple border-b-2 border-hiri-purple"
                    : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      currentView === "settings"
                        ? "bg-hiri-purple text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FaBell className="text-xs" />
                  </div>
                  <span>Ayarlar</span>
                </div>
                {currentView === "settings" && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-hiri-purple to-hiri-blue"></div>
                )}
              </button>
            </nav>
          </div>

          {/* Ana İçerik */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {currentView === "profile"
                    ? "Profil Bilgileri"
                    : "Ayarlar ve Tercihler"}
                </CardTitle>
                {currentView === "profile" && (
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          size="sm"
                        >
                          <FaTimes className="mr-2" />
                          İptal
                        </Button>
                        <Button onClick={handleSave} size="sm">
                          <FaSave className="mr-2" />
                          Kaydet
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                      >
                        <FaEdit className="mr-2" />
                        Düzenle
                      </Button>
                    )}
                  </div>
                )}
                {currentView === "settings" && (
                  <Button onClick={handleSave} size="sm">
                    <FaSave className="mr-2" />
                    Kaydet
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {currentView === "profile"
                ? renderProfileForm()
                : renderSettings()}
            </CardContent>
          </Card>

          {/* Alt Kısım - Çıkış Butonu */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 border border-red-200 hover:border-red-600"
            >
              <FaSignOutAlt className="mr-2" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
