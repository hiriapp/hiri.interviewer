"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  FaRobot,
  FaSearch,
  FaChartLine,
  FaMagic,
  FaUser,
  FaTimes,
  FaHistory,
  FaPlus,
  FaTrash,
  FaEdit,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";

// Types
interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
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

export function HiriBotChat() {
  const [chatInput, setChatInput] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Get current session
  const currentSession = chatSessions.find(
    (session) => session.id === currentSessionId
  );
  const chatMessages = currentSession?.messages || [];

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("hiri-chat-sessions");
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map(
          (session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          })
        );
        setChatSessions(parsedSessions);
      } catch (error) {
        console.error("Error loading chat sessions:", error);
      }
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem("hiri-chat-sessions", JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  const createNewSession = (initialMessage?: ChatMessage): string => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: initialMessage
        ? generateSessionTitle(initialMessage.content)
        : "Yeni Konuşma",
      messages: initialMessage ? [initialMessage] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const generateSessionTitle = (firstMessage: string): string => {
    const truncated = firstMessage.slice(0, 30);
    return truncated.length < firstMessage.length
      ? `${truncated}...`
      : truncated;
  };

  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, ...updates, updatedAt: new Date() }
          : session
      )
    );
  };

  const deleteSession = (sessionId: string) => {
    if (confirm("Bu konuşmayı silmek istediğinizden emin misiniz?")) {
      setChatSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
    }
  };

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setShowSidebar(false);
  };

  const startNewConversation = () => {
    setCurrentSessionId(null);
    setShowSidebar(false);
  };

  const handleOpenChat = () => {
    // If no input but has chat history, just open modal to show history
    if (!chatInput.trim()) {
      if (chatSessions.length > 0) {
        setShowChatModal(true);
        return;
      } else {
        return; // No input and no history, do nothing
      }
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createNewSession(userMessage);
    } else {
      updateSession(sessionId, {
        messages: [...chatMessages, userMessage],
      });
    }

    setShowChatModal(true);
    setChatInput("");

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: "assistant",
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
      };

      const updatedMessages = currentSession
        ? [...currentSession.messages, userMessage, aiResponse]
        : [userMessage, aiResponse];

      updateSession(sessionId!, {
        messages: updatedMessages,
      });
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: "user",
      content: chatInput,
      timestamp: new Date(),
    };

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createNewSession(userMessage);
    } else {
      updateSession(sessionId, {
        messages: [...chatMessages, userMessage],
      });
    }

    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: "assistant",
        content: generateAIResponse(userMessage.content),
        timestamp: new Date(),
      };

      const session = chatSessions.find((s) => s.id === sessionId);
      const updatedMessages = session
        ? [...session.messages, userMessage, aiResponse]
        : [userMessage, aiResponse];

      updateSession(sessionId!, {
        messages: updatedMessages,
      });
      setIsTyping(false);
    }, 1500);
  };

  const handleEditSessionTitle = (sessionId: string, newTitle: string) => {
    if (newTitle.trim()) {
      updateSession(sessionId, { title: newTitle.trim() });
    }
    setEditingSessionId(null);
    setEditingTitle("");
  };

  const generateAIResponse = (userQuery: string): string => {
    const lowerQuery = userQuery.toLowerCase();

    if (lowerQuery.includes("aday") || lowerQuery.includes("candidate")) {
      return "Aday verilerinizi analiz ediyorum. Sistemde kayıtlı adaylar arasında en uygun olanları bulabilir, özgeçmişlerini değerlendirebilirim. Hangi pozisyon veya özel kriterler var mı?";
    } else if (
      lowerQuery.includes("mülakat") ||
      lowerQuery.includes("interview")
    ) {
      return "Mülakat süreçlerinizde size yardımcı olabilirim. Uygun adayları seçebilir, mülakat sorularını hazırlayabilir ve değerlendirmeleri analiz edebilirim. Nasıl yardımcı olabilirim?";
    } else if (lowerQuery.includes("analiz") || lowerQuery.includes("rapor")) {
      return "Verilerinizi detaylı analiz ederek kapsamlı raporlar oluşturabilirim. Aday performansları, uyumluluk skorları ve trend analizleri sunabilirim. Hangi konuda analiz istiyorsunuz?";
    } else if (
      lowerQuery.includes("pozisyon") ||
      lowerQuery.includes("position")
    ) {
      return "Açık pozisyonlarınız için en uygun adayları bulabilir, pozisyon gereksinimlerine göre değerlendirmeler yapabilirim. Hangi pozisyon için yardım istiyorsunuz?";
    } else {
      return `"${userQuery}" konusunda size yardımcı olmaya hazırım. Aday analizi, mülakat süreçleri, CV değerlendirmeleri ve raporlama konularında uzmanım. Daha spesifik olabilir misiniz?`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showChatModal) {
        handleSendMessage();
      } else {
        handleOpenChat();
      }
    }
  };

  const quickActions = [
    "En yüksek skorlu 5 adayı listele",
    "Bu haftaki mülakat sonuçlarını özetle",
    "Senior Developer için uygun adayları bul",
    "Son 30 günün işe alım trendlerini göster",
  ];

  const suggestedQueries = [
    "Kıdemli Geliştirici için en iyi 5 adayı göster",
    "Mehmet Ali Demir'in profilini analiz et",
    "Gamze Nur'a mülakat daveti gönder",
  ];

  // Auto scroll chat to bottom
  useEffect(() => {
    if (showChatModal) {
      const chatContainer = document.getElementById("dashboardChatContainer");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [chatMessages, showChatModal]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center min-h-[320px] sm:min-h-[400px] lg:min-h-[480px]">
        <div className="bg-purple-100 rounded-full p-3 lg:p-4 mb-3 lg:mb-4">
          <div className="bg-purple-200 rounded-full p-1.5 lg:p-2">
            <FaRobot className="text-2xl sm:text-3xl lg:text-4xl text-purple-600" />
          </div>
        </div>

        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">
          Hiri Bot
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-4 lg:mb-6 px-2">
          CV analizi veya diğer görevler hakkında soru sorun...
        </p>

        <div className="w-full max-w-xl relative mb-4 lg:mb-6">
          <div className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={
                chatSessions.length > 0
                  ? "Yeni soru yazın veya geçmiş sohbetlerinizi görün..."
                  : "örn: En uygun 5 adayı listele..."
              }
              onKeyDown={handleKeyPress}
              className="hiri-input text-sm pl-10 pr-20"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="text-sm" />
            </div>
            <button
              onClick={showChatModal ? handleSendMessage : handleOpenChat}
              disabled={
                (!chatInput.trim() && chatSessions.length === 0) || isTyping
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-hiri-purple hover:bg-hiri-purple-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-hiri-purple focus:ring-offset-2"
            >
              {isTyping
                ? "..."
                : !chatInput.trim() && chatSessions.length > 0
                ? "Sohbet Aç"
                : "Gönder"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 lg:gap-2 mb-4 lg:mb-8">
          {suggestedQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => setChatInput(query)}
              className="text-xs lg:text-sm font-medium text-purple-700 bg-purple-100 border-2 border-dashed border-purple-200 rounded-full px-3 lg:px-4 py-1 lg:py-1.5 hover:bg-purple-200 transition-colors"
            >
              &quot;{query}&quot;
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 w-full max-w-xl">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 lg:p-4 text-left flex items-start gap-3 lg:gap-4 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
            <FaSearch className="text-lg sm:text-xl lg:text-2xl text-purple-500 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-800 text-sm lg:text-base">
                CV Analizi
              </h3>
              <p className="text-xs lg:text-sm text-slate-500">
                CV&apos;leri detaylı analiz edin ve öneriler alın.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 lg:p-4 text-left flex items-start gap-3 lg:gap-4 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
            <FaChartLine className="text-lg sm:text-xl lg:text-2xl text-purple-500 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-800 text-sm lg:text-base">
                Karşılaştırma
              </h3>
              <p className="text-xs lg:text-sm text-slate-500">
                Adayları karşılaştırın ve en uygun olanı bulun.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal Portal */}
      {showChatModal && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => {
              setShowChatModal(false);
              setCurrentSessionId(null);
              setShowSidebar(false);
            }}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sidebar */}
              <div
                className={`bg-slate-900 text-white transition-all duration-300 flex flex-col ${
                  showSidebar ? "w-80" : "w-0"
                } overflow-hidden rounded-l-xl`}
              >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center">
                      <FaHistory className="mr-2" />
                      Konuşma Geçmişi
                    </h3>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <FaChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* New Conversation Button */}
                <div className="p-4 border-b border-slate-700">
                  <button
                    onClick={startNewConversation}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-4 py-2 flex items-center justify-center text-sm transition-colors"
                  >
                    <FaPlus className="mr-2 text-xs" />
                    Yeni Konuşma
                  </button>
                </div>

                {/* Sessions List */}
                <div className="flex-1 overflow-y-auto p-2">
                  {chatSessions.length === 0 ? (
                    <div className="text-center text-slate-400 mt-8">
                      <FaHistory className="mx-auto mb-2 text-2xl" />
                      <p className="text-sm">Henüz konuşma geçmişi yok</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {chatSessions.map((session) => (
                        <div
                          key={session.id}
                          className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                            currentSessionId === session.id
                              ? "bg-slate-700 border border-slate-600"
                              : "hover:bg-slate-800"
                          }`}
                          onClick={() => selectSession(session.id)}
                        >
                          {editingSessionId === session.id ? (
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onBlur={() =>
                                handleEditSessionTitle(session.id, editingTitle)
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleEditSessionTitle(
                                    session.id,
                                    editingTitle
                                  );
                                }
                                if (e.key === "Escape") {
                                  setEditingSessionId(null);
                                  setEditingTitle("");
                                }
                              }}
                              className="w-full bg-slate-600 text-white text-sm rounded px-2 py-1 border-none outline-none"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <>
                              <h4 className="text-sm font-medium text-white truncate mb-1">
                                {session.title}
                              </h4>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-400">
                                  {session.messages.length} mesaj
                                </p>
                                <p className="text-xs text-slate-500">
                                  {session.updatedAt.toLocaleDateString(
                                    "tr-TR",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>

                              {/* Action buttons */}
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSessionId(session.id);
                                    setEditingTitle(session.title);
                                  }}
                                  className="p-1 text-slate-400 hover:text-white transition-colors"
                                >
                                  <FaEdit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSession(session.id);
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-hiri-purple to-indigo-600 text-white rounded-tr-xl">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="text-white hover:text-gray-200 transition-colors p-1 mr-2"
                    >
                      <FaBars className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <FaMagic className="text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {currentSession
                          ? currentSession.title
                          : "Hiri AI Asistanı"}
                      </h3>
                      <p className="text-sm text-white text-opacity-80">
                        İK ve İşe Alım Danışmanınız
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowChatModal(false);
                      setCurrentSessionId(null);
                      setShowSidebar(false);
                    }}
                    className="text-white hover:text-gray-200 transition-colors p-1"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div
                  id="dashboardChatContainer"
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white"
                >
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-slate-500 mt-16">
                      <FaRobot className="mx-auto mb-4 text-4xl text-slate-400" />
                      <h3 className="text-lg font-semibold mb-2">
                        Merhaba! Size nasıl yardımcı olabilirim?
                      </h3>
                      <p className="text-sm">
                        Aday analizi, mülakat süreçleri veya CV
                        değerlendirmeleri hakkında sorularınızı sorabilirsiniz.
                      </p>
                    </div>
                  ) : (
                    chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
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
                    ))
                  )}

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
                <div className="p-4 border-t border-slate-200 bg-white rounded-br-xl">
                  {/* Quick Actions - Only show when input is empty */}
                  {chatInput === "" && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => setChatInput(action)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Sorunuzu yazın..."
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
          </div>
        </ModalPortal>
      )}
    </>
  );
}
