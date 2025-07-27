"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
  FaCog,
} from "react-icons/fa";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPage] = useState("profile");
  const [currentView, setCurrentView] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "Kurum",
    lastName: "Yöneticisi",
    email: "admin@kurum.com.tr",
    company: "Kurum Teknoloji",
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
                <div className="relative inline-block w-11 h-6">
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      settings[item.key as keyof typeof settings]
                        ? "bg-hiri-purple"
                        : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      settings[item.key as keyof typeof settings]
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

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
    <DashboardLayout title="Profil - HiriBot" activeSection="profile">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white p-6 mb-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="mb-4 lg:mb-0 flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold border border-white/30">
                  T
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1 flex items-center">
                    <FaUser className="mr-3 text-2xl" />
                    Profil Ayarları
                  </h1>
                  <p className="text-purple-100 text-base">
                    Hesap bilgilerinizi ve tercihlerinizi yönetin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-purple-700 hover:bg-purple-50 font-semibold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center text-sm"
              >
                <FaEdit className="mr-2" />
                {isEditing ? "Düzenlemeyi Bitir" : "Bilgileri Düzenle"}
              </button>
            </div>
          </div>
        </div>

        {showSaveSuccess && (
          <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
            <FaCheck className="mr-2" />
            Değişiklikler başarıyla kaydedildi!
          </div>
        )}

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
            {currentView === "profile" ? renderProfileForm() : renderSettings()}
          </CardContent>
        </Card>

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
    </DashboardLayout>
  );
}
