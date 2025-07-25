"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaRocket } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@hiribot.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowError(false);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Geçersiz bilgiler. E-posta adresinizi ve şifrenizi kontrol edin."
        );
        setShowError(true);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/4 bg-gradient-to-br from-hiri-purple via-hiri-blue to-hiri-pink relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Particles */}
          <div className="absolute top-16 left-8 w-2 h-2 bg-white/30 rounded-full animate-float-slow"></div>
          <div className="absolute top-32 right-12 w-1.5 h-1.5 bg-white/40 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-32 left-12 w-2.5 h-2.5 bg-white/20 rounded-full animate-float-fast"></div>
          <div className="absolute bottom-16 right-8 w-1 h-1 bg-white/50 rounded-full animate-float-slow"></div>

          {/* Geometric Shapes */}
          <div className="absolute top-24 right-16 w-8 h-8 border border-white/20 rotate-45 animate-rotate-slow"></div>
          <div className="absolute bottom-40 left-16 w-12 h-12 border border-white/15 rounded-full animate-pulse-soft"></div>

          {/* Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-gradient-shift"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-8 text-white w-full">
          {/* Logo */}
          <div className="text-center group">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30 transition-all duration-500 hover:scale-110 hover:rotate-6 hover:shadow-white/20 group-hover:bg-white/30 cursor-pointer">
              <FaRocket className="text-2xl text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h1 className="text-3xl font-bold mb-3 tracking-wide transition-all duration-300 hover:scale-105 cursor-default">
              Hiri
            </h1>
            <p className="text-white/70 text-sm font-medium transition-all duration-300 hover:text-white/90">
              AI Mülakat Platformu
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-3/4 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-hiri-purple/10 to-hiri-blue/10 rounded-full blur-3xl animate-pulse-soft"></div>
          <div
            className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-hiri-blue/10 to-hiri-pink/10 rounded-full blur-3xl animate-pulse-soft"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-hiri-purple rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-105 transition-transform duration-300">
              <FaRocket className="text-2xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hiri&apos;ye Hoş Geldiniz
            </h1>
            <p className="text-gray-600">AI Mülakat Platformu</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 hover:shadow-3xl transition-all duration-500 hover:bg-white group">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200/30 via-gray-100/30 to-gray-200/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 transition-all duration-300">
                Yönetici Girişi
              </h2>
              <p className="text-gray-600 transition-colors duration-300">
                Mülakatları yönetmek için kontrol panelinize erişin
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="group/input">
                  <Input
                    type="email"
                    label="E-posta Adresi"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={
                      <FaUser className="text-gray-400 group-focus-within/input:text-gray-600 transition-colors duration-200" />
                    }
                    placeholder="E-posta adresinizi girin"
                    required
                    className="bg-gray-50/80 border-gray-200 focus:border-hiri-purple focus:ring-2 focus:ring-hiri-purple/20 transition-all duration-300 hover:bg-gray-100/80 focus:bg-white focus:shadow-lg"
                  />
                </div>

                <div className="group/input">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={
                      <FaLock className="text-gray-400 group-focus-within/input:text-gray-600 transition-colors duration-200" />
                    }
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-105 flex items-center justify-center h-full"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    }
                    placeholder="Şifrenizi girin"
                    required
                    className="bg-gray-50/80 border-gray-200 focus:border-hiri-purple focus:ring-2 focus:ring-hiri-purple/20 transition-all duration-300 hover:bg-gray-100/80 focus:bg-white focus:shadow-lg"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl text-sm animate-shake">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                    {error}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-hiri-purple to-hiri-blue hover:from-hiri-purple-dark hover:to-hiri-blue-dark text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-hiri-purple/30 hover:-translate-y-1 transform active:translate-y-0 active:shadow-lg relative overflow-hidden group/btn"
                isLoading={isLoading}
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>

                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Giriş yapılıyor...
                  </div>
                ) : (
                  <span className="relative z-10">Giriş Yap</span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
