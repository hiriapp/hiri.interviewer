"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { HiriBotChat } from "@/components/dashboard/HiriBotChat";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  FaUsers,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaPlus,
  FaTimes,
  FaEdit,
  FaSearch,
  FaFlag,
  FaBookmark,
  FaStickyNote,
} from "react-icons/fa";

// Mock data
const upcomingInterviews = [
  {
    id: "1",
    candidateName: "Mehmet Ali Demir",
    position: "Kıdemli Yazılım Geliştirici",
    date: "2025-06-10",
    time: "10:00",
  },
  {
    id: "2",
    candidateName: "Çağdaş Ozan Pamuk",
    position: "Kıdemli Yazılım Geliştirici",
    date: "2025-06-12",
    time: "14:30",
  },
];

interface Note {
  id: string;
  title: string;
  content: string;
  category: "general" | "candidate" | "interview" | "reminder" | "task";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  color: string;
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

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [currentView, setCurrentView] = useState("dashboard");
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Teknik Mülakat",
      content: "Salı günü Mehmet Ali Demir'in teknik mülakatını gözden geçir",
      category: "interview",
      priority: "high",
      createdAt: new Date("2025-01-20T10:00:00"),
      updatedAt: new Date("2025-01-20T10:00:00"),
      color: "#EF4444",
    },
    {
      id: "2",
      title: "İş Tanımı",
      content: "Pazarlama pozisyonu iş tanımını güncelle",
      category: "task",
      priority: "medium",
      createdAt: new Date("2025-01-19T14:30:00"),
      updatedAt: new Date("2025-01-19T14:30:00"),
      color: "#F59E0B",
    },
  ]);

  // Note Modal State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    category: "general" as Note["category"],
    priority: "medium" as Note["priority"],
    color: "#8B5CF6",
  });

  // Search and Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "all" | Note["category"]
  >("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-hiri-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const categoryConfig = {
    general: { icon: FaStickyNote, label: "Genel", color: "#8B5CF6" },
    candidate: { icon: FaUsers, label: "Aday", color: "#06B6D4" },
    interview: { icon: FaCalendarAlt, label: "Mülakat", color: "#EF4444" },
    reminder: { icon: FaBookmark, label: "Hatırlatma", color: "#10B981" },
    task: { icon: FaFlag, label: "Görev", color: "#F59E0B" },
  };

  const priorityConfig = {
    low: { label: "Düşük", color: "#10B981" },
    medium: { label: "Orta", color: "#F59E0B" },
    high: { label: "Yüksek", color: "#EF4444" },
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setNoteForm({
      title: "",
      content: "",
      category: "general",
      priority: "medium",
      color: "#8B5CF6",
    });
    setShowNoteModal(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority,
      color: note.color,
    });
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      alert("Başlık ve içerik alanları zorunludur!");
      return;
    }

    const now = new Date();

    if (editingNote) {
      // Update existing note
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id
            ? { ...note, ...noteForm, updatedAt: now }
            : note
        )
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...noteForm,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    setShowNoteModal(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Bu notu silmek istediğinizden emin misiniz?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setNoteForm((prev) => ({ ...prev, [field]: value }));
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || note.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentView={currentView} />

      <main className="container mx-auto p-3 sm:p-4 lg:p-8 flex-grow">
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
            Hoş Geldiniz, Turkcell!
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Main Content - HiriBot and Quick Actions */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              <HiriBotChat />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <Card
                  variant="compact"
                  className="text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center p-4 lg:p-6">
                    <FaUsers className="text-3xl sm:text-4xl lg:text-5xl text-purple-600 mb-3 lg:mb-4" />
                    <h2 className="text-base lg:text-lg font-semibold text-slate-700 mb-1">
                      Aday Yönetimi
                    </h2>
                    <p className="text-xs text-slate-500 mb-2 lg:mb-3 px-2">
                      Adaylarınızı görüntüleyin ve yönetin
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push("/candidates")}
                    >
                      Adaylara Git
                    </Button>
                  </div>
                </Card>

                <Card
                  variant="compact"
                  className="text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center p-4 lg:p-6">
                    <FaBriefcase className="text-3xl sm:text-4xl lg:text-5xl text-blue-500 mb-3 lg:mb-4" />
                    <h2 className="text-base lg:text-lg font-semibold text-slate-700 mb-1">
                      Pozisyon Yönetimi
                    </h2>
                    <p className="text-xs text-slate-500 mb-2 lg:mb-3 px-2">
                      İş pozisyonları oluşturun ve yönetin
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push("/positions")}
                    >
                      Pozisyonlara Git
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-4 lg:space-y-6">
              {/* Upcoming Interviews */}
              <Card>
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="flex items-center text-base lg:text-lg">
                    <FaCalendarAlt className="mr-2 text-hiri-purple text-sm lg:text-base" />
                    Yaklaşan Mülakatlar
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {upcomingInterviews.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      Yaklaşan mülakat bulunmuyor.
                    </p>
                  ) : (
                    <div className="space-y-2 lg:space-y-3">
                      {upcomingInterviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="border-l-4 border-purple-400 pl-2 lg:pl-3 py-2 bg-purple-50 rounded-r"
                        >
                          <h3 className="text-xs lg:text-sm font-semibold text-slate-800">
                            {interview.candidateName}
                          </h3>
                          <p className="text-xs text-slate-600">
                            {interview.position}
                          </p>
                          <div className="flex items-center text-xs text-slate-500 mt-1">
                            <FaClock className="mr-1 text-xs" />
                            {new Date(interview.date).toLocaleDateString(
                              "tr-TR"
                            )}{" "}
                            - {interview.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Personal Notes */}
              <Card>
                <CardHeader className="pb-3 lg:pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base lg:text-lg">
                      Kişisel Notlar
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreateNote}
                      className="text-xs lg:text-sm"
                    >
                      <FaPlus className="mr-1 text-xs" />
                      Not Ekle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Search and Filter - Compact */}
                  <div className="mb-3 flex gap-2">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ara..."
                        className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-hiri-purple focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterCategory}
                      onChange={(e) =>
                        setFilterCategory(
                          e.target.value as keyof typeof categoryConfig | "all"
                        )
                      }
                      className="text-xs py-1.5 px-3 pr-10 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-hiri-purple focus:border-transparent w-24 flex-shrink-0 appearance-none bg-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 8px center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "14px",
                      }}
                    >
                      <option value="all">Tümü</option>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {filteredNotes.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-4">
                        {searchQuery || filterCategory !== "all"
                          ? "Arama kriterlerinize uygun not bulunamadı."
                          : "Henüz not eklenmedi."}
                      </p>
                    ) : (
                      filteredNotes.map((note) => {
                        const categoryInfo = categoryConfig[note.category];
                        const priorityInfo = priorityConfig[note.priority];
                        const CategoryIcon = categoryInfo.icon;

                        return (
                          <div
                            key={note.id}
                            className="group relative p-3 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
                            style={{
                              borderLeftColor: note.color,
                              borderLeftWidth: "4px",
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <CategoryIcon
                                    className="text-xs flex-shrink-0"
                                    style={{ color: categoryInfo.color }}
                                  />
                                  <h4 className="text-xs font-medium text-slate-800 truncate min-w-0 flex-1">
                                    {note.title}
                                  </h4>
                                  <span
                                    className="text-xs px-1.5 py-0.5 rounded-full text-white font-medium flex-shrink-0"
                                    style={{
                                      backgroundColor: priorityInfo.color,
                                    }}
                                  >
                                    {priorityInfo.label}
                                  </span>
                                  <span className="text-xs px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-full flex-shrink-0">
                                    {note.updatedAt.toLocaleDateString(
                                      "tr-TR",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                      }
                                    )}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 line-clamp-2 mb-1">
                                  {note.content}
                                </p>
                                <div className="text-xs text-slate-400">
                                  <span>{categoryInfo.label}</span>
                                </div>
                              </div>

                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditNote(note);
                                  }}
                                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                  <FaEdit className="text-xs" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNote(note.id);
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                >
                                  <FaTimes className="text-xs" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Note Modal */}
      {showNoteModal && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setShowNoteModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingNote ? "Not Düzenle" : "Yeni Not Ekle"}
                </h2>
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Başlık*
                  </label>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="Not başlığı..."
                    className="hiri-input"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    İçerik*
                  </label>
                  <textarea
                    value={noteForm.content}
                    onChange={(e) =>
                      handleFormChange("content", e.target.value)
                    }
                    placeholder="Not içeriği..."
                    rows={4}
                    className="hiri-input resize-none"
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={noteForm.category}
                      onChange={(e) =>
                        handleFormChange("category", e.target.value)
                      }
                      className="hiri-input"
                    >
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Öncelik
                    </label>
                    <select
                      value={noteForm.priority}
                      onChange={(e) =>
                        handleFormChange("priority", e.target.value)
                      }
                      className="hiri-input"
                    >
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Renk
                  </label>
                  <div className="flex gap-2">
                    {[
                      "#8B5CF6",
                      "#06B6D4",
                      "#EF4444",
                      "#10B981",
                      "#F59E0B",
                      "#EC4899",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleFormChange("color", color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          noteForm.color === color
                            ? "border-slate-800 scale-110"
                            : "border-slate-300 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => setShowNoteModal(false)}
                >
                  İptal
                </Button>
                <Button variant="primary" onClick={handleSaveNote}>
                  {editingNote ? "Güncelle" : "Kaydet"}
                </Button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      <Footer />
    </div>
  );
}
