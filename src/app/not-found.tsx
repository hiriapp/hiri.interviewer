"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import { FaHome, FaSearch, FaUserPlus, FaChevronLeft } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <Header currentView="" />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Ilustrasyon */}
          <div className="mb-8">
            <div className="relative">
              {/* Büyük 404 Texti */}
              <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 leading-none select-none">
                404
              </h1>

              {/* Dekoratif Elementler */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute top-1/2 -left-6 w-4 h-4 bg-purple-300 rounded-full opacity-40 animate-bounce"></div>
              <div className="absolute -bottom-2 left-1/3 w-6 h-6 bg-purple-100 rounded-full opacity-50 animate-pulse delay-300"></div>
            </div>
          </div>

          {/* Ana Mesaj */}
          <div className="mb-8 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Sayfa Bulunamadı
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir.
              <br className="hidden sm:block" />
              Ana sayfaya dönerek devam edebilirsiniz.
            </p>
          </div>

          {/* Hızlı Eylemler */}
          <div className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => router.push("/dashboard")}
                className="group flex flex-col items-center p-6 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <FaHome className="text-purple-600 text-xl" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Ana Sayfa
                </span>
              </button>

              <button
                onClick={() => router.push("/candidates")}
                className="group flex flex-col items-center p-6 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <FaSearch className="text-purple-600 text-xl" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Aday Ara
                </span>
              </button>

              <button
                onClick={() => router.push("/candidates/create")}
                className="group flex flex-col items-center p-6 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <FaUserPlus className="text-purple-600 text-xl" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Yeni Aday
                </span>
              </button>
            </div>
          </div>

          {/* Ana Aksiyon Butonları */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              <FaChevronLeft className="mr-2" />
              Geri Dön
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <FaHome className="mr-2" />
              Ana Sayfaya Git
            </button>
          </div>

          {/* Yardımcı Metin */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Sorun devam ederse{" "}
              <a
                href="mailto:destek@hiri.com"
                className="text-purple-600 hover:text-purple-700 font-medium underline decoration-purple-200 hover:decoration-purple-300"
              >
                destek ekibimiz
              </a>{" "}
              ile iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
