"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  FaPlay,
  FaVideo,
  FaMicrophone,
  FaUser,
  FaCheck,
  FaSyncAlt,
} from "react-icons/fa";

type InterviewStep =
  | "email"
  | "welcome"
  | "tech-check"
  | "interview"
  | "complete"
  | "form"
  | "finished";

interface ChatMessage {
  id: string;
  sender: "hiribot" | "candidate";
  message: string;
}

const hiribotQuestions = [
  "Merhaba! HiriBot mülakatınıza hoş geldiniz. Lütfen kendinizden ve kariyer hedeflerinizden bahsedin.",
  "Önceki iş deneyiminizde karşılaştığınız en büyük zorluk neydi ve bunu nasıl aştınız?",
  "Takım çalışmasında ne kadar iyisiniz? Bir takım projesindeki rolünüz ve katkılarınızdan örnek verebilir misiniz?",
];

export default function InterviewPage() {
  const [currentStep, setCurrentStep] = useState<InterviewStep>("email");
  const [timeLeft, setTimeLeft] = useState(30); // 30 saniye demo için
  const [questionIndex, setQuestionIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingProgress, setSpeakingProgress] = useState(0);
  const [speakingStatus, setSpeakingStatus] = useState("HiriBot konuşuyor...");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    officeDays: "",
    travelRestriction: "",
    careerMotivation: "",
  });

  // Media cihazları için state'ler
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isTestingDevices, setIsTestingDevices] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const hasInitialized = useRef(false);

  // Ses seviyesi analizi için fonksiyon
  const startAudioLevelMonitoring = useCallback(async (stream: MediaStream) => {
    try {
      console.log("Audio monitoring başlatılıyor...");

      // Önce önceki analizi durdur
      stopAudioLevelMonitoring();

      const audioContext = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      // Audio context'i resume et (user interaction policy için)
      if (audioContext.state === "suspended") {
        console.log("Audio context suspended, resuming...");
        await audioContext.resume();
      }

      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      console.log("Audio context state:", audioContext.state);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      console.log("Audio context ve analyser hazır");

      const updateAudioLevel = () => {
        if (
          analyserRef.current &&
          audioContextRef.current &&
          audioContextRef.current.state === "running"
        ) {
          analyserRef.current.getByteFrequencyData(dataArray);

          // RMS hesaplama (daha iyi ses seviyesi için)
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);

          // Daha hassas normalizasyon
          let normalizedLevel = 0;
          if (rms > 1) {
            normalizedLevel = Math.min(100, Math.log10(rms + 1) * 25);
          }

          setAudioLevel(Math.round(normalizedLevel));

          // Debug için daha sık log at
          if (Math.random() < 0.05) {
            console.log(
              "🎤 Audio:",
              "RMS:",
              rms.toFixed(2),
              "Level:",
              Math.round(normalizedLevel) + "%",
              "Context:",
              audioContextRef.current.state
            );
          }
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
      console.log("Audio level monitoring başlatıldı");
    } catch (error) {
      console.error("Ses analizi başlatılamadı:", error);
    }
  }, []);

  const stopAudioLevelMonitoring = useCallback(() => {
    console.log("Audio monitoring durduruluyor...");
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  // Medya cihazlarını listele
  const getMediaDevices = useCallback(async () => {
    try {
      // İlk önce izin al
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setPermissionGranted(true);

      // İzin alındıktan sonra cihazları listele
      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices.filter(
        (device) => device.kind === "audioinput"
      );
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );

      setAudioDevices(audioInputs);
      setVideoDevices(videoInputs);

      // İlk cihazları varsayılan olarak seç
      if (audioInputs.length > 0) {
        setSelectedAudioDevice(audioInputs[0].deviceId);
      }
      if (videoInputs.length > 0) {
        setSelectedVideoDevice(videoInputs[0].deviceId);
      }

      // İlk stream'i kapat, seçilen cihazlarla yeni stream oluşturacağız
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Medya cihazlarına erişim hatası:", error);
      setPermissionGranted(false);
    }
  }, []);

  // Seçilen cihazlarla medya stream başlat
  const startMediaStream = async (
    audioDeviceId: string,
    videoDeviceId: string
  ) => {
    try {
      setIsTestingDevices(true);

      // Önceki analizi durdur
      stopAudioLevelMonitoring();

      // Önceki stream'i kapat
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        audio: audioDeviceId
          ? {
              deviceId: { exact: audioDeviceId },
              echoCancellation: true,
              noiseSuppression: true,
            }
          : true,
        video: videoDeviceId
          ? {
              deviceId: { exact: videoDeviceId },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }
          : true,
      };

      console.log("Stream başlatılıyor:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Stream oluşturuldu:", stream.getTracks());
      console.log("Video tracks:", stream.getVideoTracks());
      console.log("Audio tracks:", stream.getAudioTracks());

      setMediaStream(stream);
      console.log(
        "MediaStream state'e set edildi - useEffect video bağlamasını yapacak"
      );

      // Ses seviyesi analizi başlat
      if (stream.getAudioTracks().length > 0) {
        console.log("Ses analizi başlatılıyor");
        // Küçük bir delay ile audio monitoring başlat
        setTimeout(async () => {
          await startAudioLevelMonitoring(stream);
        }, 200);
      }

      setIsTestingDevices(false);
    } catch (error) {
      console.error("Stream başlatma hatası:", error);
      setIsTestingDevices(false);
    }
  };

  // Cihaz değiştiğinde stream'i güncelle
  useEffect(() => {
    if (selectedAudioDevice && selectedVideoDevice && permissionGranted) {
      startMediaStream(selectedAudioDevice, selectedVideoDevice);
    }
  }, [selectedAudioDevice, selectedVideoDevice, permissionGranted]);

  // MediaStream değiştiğinde video elementine bağla
  useEffect(() => {
    if (mediaStream && videoRef.current) {
      console.log("useEffect: Video element ve stream mevcut, bağlanıyor...");
      videoRef.current.srcObject = mediaStream;

      // Force play
      const playVideo = async () => {
        if (videoRef.current) {
          try {
            videoRef.current.muted = true;
            await videoRef.current.play();
            console.log("useEffect: Video başarıyla başladı");
          } catch (error) {
            console.error("useEffect: Video play hatası:", error);
          }
        }
      };

      // Küçük bir delay ile play
      setTimeout(playVideo, 100);
    } else if (!mediaStream && videoRef.current) {
      console.log("useEffect: Stream yok, video temizleniyor");
      videoRef.current.srcObject = null;
    }
  }, [mediaStream]);

  // Component unmount olduğunda stream'i temizle
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      stopAudioLevelMonitoring();
    };
  }, [mediaStream, stopAudioLevelMonitoring]);

  const endInterview = useCallback(() => {
    addChatMessage(
      "hiribot",
      "Zamanınız için teşekkür ederiz! Sonraki adımlar hakkında yakında sizinle iletişime geçeceğiz. Hoşça kalın!"
    );
    setTimeout(() => {
      setCurrentStep("complete");
      // Rastgele form göstermek için karar ver (%70 şans)
      setShowForm(Math.random() < 0.7);
    }, 3000);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (questionIndex < hiribotQuestions.length) {
      addChatMessage("hiribot", hiribotQuestions[questionIndex]);
      simulateSpeaking(3000, true);
      setQuestionIndex((prev) => prev + 1);
    } else {
      endInterview();
    }
  }, [questionIndex, endInterview]);

  const startInterview = useCallback(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setCurrentStep("interview");
      handleNextQuestion();
    }
  }, [handleNextQuestion]);

  // Step değiştiğinde init durumunu sıfırla
  useEffect(() => {
    if (currentStep !== "interview") {
      hasInitialized.current = false;
    }
  }, [currentStep]);

  // Mülakat için zamanlayıcı etkisi
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === "interview" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentStep === "interview") {
      endInterview();
    }
    return () => clearInterval(interval);
  }, [currentStep, timeLeft, endInterview]);

  // Konuşma simülasyonu etkisi
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    if (isSpeaking) {
      interval = setInterval(() => {
        setSpeakingProgress((prev) => {
          if (prev >= 100) {
            setIsSpeaking(false);
            setSpeakingStatus("Lütfen cevabınızı verin.");
            // Gecikmeden sonra aday cevabını simüle et
            timeoutId = setTimeout(() => {
              handleNextQuestion();
            }, 4000);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [isSpeaking, handleNextQuestion]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const addChatMessage = (sender: "hiribot" | "candidate", message: string) => {
    const newMessage: ChatMessage = {
      id: `${sender}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender,
      message,
    };
    setChatMessages((prev) => {
      // Aynı mesajın tekrarını önle
      if (prev.length > 0 && prev[prev.length - 1].message === message) {
        return prev;
      }
      return [...prev, newMessage];
    });
  };

  const simulateSpeaking = (duration: number, isHiribot: boolean) => {
    if (isHiribot) {
      setSpeakingStatus("HiriBot konuşuyor...");
      setSpeakingProgress(0);
    } else {
      setSpeakingStatus("Dinlemek için cevabınızı bekliyor...");
      setSpeakingProgress(100);
    }
    setIsSpeaking(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("finished");
  };

  const renderEmailStep = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gelen Kutusu</h1>
      <Card className="text-left">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <div>
            <div className="text-xl font-semibold">
              Turkcell HiriBot Mülakat Daveti
            </div>
            <div className="text-sm text-gray-600">
              Turkcell İnsan Kaynakları &lt;hr@turkcell.com.tr&gt;
            </div>
          </div>
          <div className="text-sm text-gray-500">Bugün, 14:30</div>
        </div>

        <div className="space-y-4 text-gray-700">
          <p>Merhaba Aday,</p>
          <p>
            Turkcell&apos;e başvurunuz için teşekkür ederiz. Değerlendirme
            sürecimizin bir parçası olarak, AI destekli mülakat asistanımız
            HiriBot ile etkileşimli bir mülakata davet ediliyorsunuz.
          </p>
          <p>
            Bu mülakat, becerilerinizi daha iyi anlamamıza ve pozisyon için
            uygunluğunuzu değerlendirmemize yardımcı olacaktır. Mülakat maksimum
            15 dakika sürecektir.
          </p>
          <p>Mülakatı başlatmak için lütfen aşağıdaki bağlantıya tıklayın:</p>

          <Button
            onClick={() => setCurrentStep("welcome")}
            variant="primary"
            className="mt-6"
            rightIcon={<FaPlay />}
          >
            Mülakatı Başlat
          </Button>

          <p className="mt-4">İyi şanslar!</p>
          <p className="mt-2">
            Saygılarımızla,
            <br />
            Turkcell İnsan Kaynakları Ekibi
          </p>
        </div>
      </Card>
    </div>
  );

  const renderWelcomeStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        HiriBot Mülakatınıza Hoş Geldiniz!
      </h1>
      <div className="space-y-6 text-lg text-gray-600">
        <p>
          Bu mülakat, AI asistanımız HiriBot ile etkileşimli bir sohbet
          olacaktır.
        </p>
        <p>
          Amacımız becerilerinizi daha iyi anlamak ve potansiyelinizi
          keşfetmektir. Mülakat maksimum 15 dakika sürecektir (bu demo 30 saniye
          çalışır).
        </p>
        <div className="bg-hiri-light-purple p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-hiri-purple">
            <strong>Not:</strong> Mülakat sırasında internet bağlantınız
            kesilirse, endişelenmeyin. HiriBot cevaplarınızı otomatik olarak
            kaydeder ve kaldığınız yerden devam edebilirsiniz.
          </p>
        </div>
      </div>
      <Button
        onClick={() => setCurrentStep("tech-check")}
        variant="primary"
        size="lg"
        className="mt-8"
        rightIcon={<FaPlay />}
      >
        Mülakatı Başlat
      </Button>
    </div>
  );

  const renderTechCheckStep = () => (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Teknik Kontrol
      </h2>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Mülakatı başlatmadan önce mikrofonunuzun ve kameranızın çalıştığından
        emin olalım.
      </p>

      {!permissionGranted ? (
        <div className="text-center mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Kamera ve Mikrofon İzni Gerekli
            </h3>
            <p className="text-blue-700 mb-4">
              Mülakat için kameranıza ve mikrofonunuza erişim iznine ihtiyacımız
              var.
            </p>
            <Button
              onClick={getMediaDevices}
              variant="primary"
              leftIcon={<FaVideo />}
            >
              İzin Ver ve Cihazları Listele
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Mikrofon Seçimi ve Testi */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mikrofon Seçimi:
                </label>
                <select
                  value={selectedAudioDevice}
                  onChange={(e) => setSelectedAudioDevice(e.target.value)}
                  className="w-full px-4 py-3 mb-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiri-purple focus:border-transparent outline-none transition-all duration-200 cursor-pointer hover:border-hiri-purple"
                  disabled={isTestingDevices}
                  style={{ zIndex: 10 }}
                >
                  {audioDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label ||
                        `Mikrofon ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 h-48 flex flex-col justify-center items-center">
                <FaMicrophone
                  className={`text-3xl mb-3 transition-colors duration-200 ${
                    mediaStream && audioLevel > 5
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />

                <span className="text-sm font-medium text-gray-700 mb-4">
                  Mikrofon Testi
                </span>

                {/* Minimal ses seviye göstergesi */}
                <div className="flex space-x-1 mb-3">
                  {[...Array(4)].map((_, i) => {
                    const barThreshold = (i + 1) * 25; // 0-100 arası eşit bölüm
                    const isActive = audioLevel >= barThreshold;

                    return (
                      <div
                        key={i}
                        className={`w-2 h-6 rounded-full transition-all duration-150 ${
                          isActive
                            ? i < 2
                              ? "bg-green-500"
                              : i < 3
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            : "bg-gray-200"
                        }`}
                      />
                    );
                  })}
                </div>

                <p className="text-center text-xs text-gray-500">
                  {mediaStream
                    ? audioLevel > 5
                      ? "Ses alınıyor"
                      : "Konuşun"
                    : "Bekliyor..."}
                </p>
              </div>
            </div>

            {/* Kamera Seçimi ve Önizleme */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Kamera Seçimi:
                </label>
                <select
                  value={selectedVideoDevice}
                  onChange={(e) => setSelectedVideoDevice(e.target.value)}
                  className="w-full px-4 py-3 mb-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-hiri-purple focus:border-transparent outline-none transition-all duration-200 cursor-pointer hover:border-hiri-purple"
                  disabled={isTestingDevices}
                  style={{ zIndex: 10 }}
                >
                  {videoDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Kamera ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-900 rounded-lg overflow-hidden h-48 relative border-2 border-gray-700">
                {isTestingDevices ? (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800">
                    <div className="text-center">
                      <FaSyncAlt className="animate-spin text-3xl mb-3 text-hiri-purple" />
                      <span className="text-sm">Kamera başlatılıyor...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={(el) => {
                        videoRef.current = el;
                        console.log("Video ref atandı:", !!el);
                      }}
                      autoPlay
                      muted
                      playsInline
                      controls={false}
                      preload="auto"
                      className="w-full h-full object-cover transform scale-x-[-1]"
                      style={{ backgroundColor: "#1f2937" }}
                      onLoadedMetadata={(e) => {
                        console.log("Video metadata yüklendi", e.target);
                      }}
                      onCanPlay={() => console.log("Video canplay event")}
                      onPlay={() => console.log("Video play event")}
                      onLoadStart={() => console.log("Video load start")}
                      onLoadedData={() => console.log("Video loaded data")}
                      onError={(e) => console.error("Video error event:", e)}
                      onAbort={() => console.log("Video abort")}
                      onStalled={() => console.log("Video stalled")}
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-3 py-1 rounded-full text-xs text-white font-medium">
                      📹 Kamera Önizleme
                    </div>
                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          (mediaStream?.getVideoTracks()?.length || 0) > 0
                            ? "bg-green-400 animate-pulse"
                            : "bg-red-400"
                        }`}
                      />
                      <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                        {(mediaStream?.getVideoTracks()?.length || 0) > 0
                          ? "CANLI"
                          : "BEKLIYOR"}
                      </span>
                    </div>
                    {!mediaStream && (
                      <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800">
                        <div className="text-center">
                          <FaVideo className="text-4xl mb-2 mx-auto text-gray-500" />
                          <span className="text-sm opacity-80">
                            Kamera bekleniyor...
                          </span>
                          <div className="text-xs mt-2 opacity-60">
                            {`mediaStream: ${!!mediaStream}, videoRef: ${!!videoRef.current}`}
                          </div>
                        </div>
                      </div>
                    )}
                    {mediaStream && !mediaStream.getVideoTracks().length && (
                      <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800">
                        <div className="text-center">
                          <FaVideo className="text-4xl mb-2 mx-auto text-red-500" />
                          <span className="text-sm opacity-80">
                            Video track yok!
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Durum Bilgisi */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      (mediaStream?.getAudioTracks()?.length || 0) > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-gray-700">
                    Mikrofon:{" "}
                    {(mediaStream?.getAudioTracks().length || 0) > 0
                      ? "Hazır"
                      : "Bekliyor"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      (mediaStream?.getVideoTracks().length || 0) > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-gray-700">
                    Kamera:{" "}
                    {(mediaStream?.getVideoTracks().length || 0) > 0
                      ? "Hazır"
                      : "Bekliyor"}
                  </span>
                </div>
              </div>

              {(mediaStream?.getAudioTracks().length || 0) > 0 &&
                (mediaStream?.getVideoTracks().length || 0) > 0 && (
                  <div className="flex items-center text-green-600">
                    <FaCheck className="mr-1" />
                    <span className="font-medium">Tüm cihazlar hazır</span>
                  </div>
                )}
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={startInterview}
              variant="primary"
              size="lg"
              rightIcon={<FaPlay />}
              disabled={
                !mediaStream ||
                isTestingDevices ||
                (mediaStream?.getAudioTracks().length || 0) === 0 ||
                (mediaStream?.getVideoTracks().length || 0) === 0
              }
            >
              {isTestingDevices ? (
                <>
                  <FaSyncAlt className="animate-spin mr-2" />
                  Cihazlar Test Ediliyor...
                </>
              ) : (
                "Teknik Kontrol Tamamlandı, Mülakatı Başlat"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderInterviewStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="text-2xl font-semibold text-hiri-purple mb-4">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-lg p-6 text-white flex flex-col items-center justify-center h-48 relative">
          <FaUser className="text-4xl mb-4" />
          <span>HiriBot</span>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
            HiriBot
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 text-white flex flex-col items-center justify-center h-48 relative">
          <FaVideo className="text-4xl mb-4" />
          <span>Siz</span>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
            Videonuz
          </div>
        </div>
      </div>

      <div className="mb-6 max-h-64 overflow-y-auto space-y-2">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${
              message.sender === "hiribot" ? "assistant" : "user"
            }`}
          >
            {message.message}
          </div>
        ))}
      </div>

      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${
              isSpeaking && speakingStatus.includes("answer")
                ? "bg-hiri-purple animate-pulse-light"
                : "bg-hiri-blue"
            }`}
            style={{ width: `${speakingProgress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          {speakingStatus}
        </p>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Mülakatınız Tamamlandı!
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        HiriBot ile konuşmanız başarıyla sona erdi. Katılımınız için teşekkür
        ederiz.
      </p>

      {showForm ? (
        <Card className="text-left">
          <h3 className="text-xl font-semibold mb-4">Ek Bilgi Talebi</h3>
          <p className="text-gray-700 mb-6">
            Mülakatınızdan bazı alanları netleştirmek için lütfen bu kısa formu
            doldurun. Bu bilgiler değerlendirme sürecimize katkıda bulunacaktır.
          </p>
          <Button
            onClick={() => setCurrentStep("form")}
            variant="primary"
            rightIcon={<FaCheck />}
          >
            Formu Doldur
          </Button>
        </Card>
      ) : (
        <Button
          onClick={() => setCurrentStep("finished")}
          variant="secondary"
          rightIcon={<FaCheck />}
        >
          Süreci Tamamla
        </Button>
      )}
    </div>
  );

  const renderFormStep = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ek Bilgi Formu</h2>
      <p className="text-lg text-gray-600 mb-8">
        Başvurunuzu tamamlamak için lütfen aşağıdaki bilgileri doldurun.
      </p>

      <Card>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Haftada kaç gün ofise gelebilirsiniz? (Hibrit çalışma modelimiz
              var.)
            </label>
            <select
              value={formData.officeDays}
              onChange={(e) =>
                setFormData({ ...formData, officeDays: e.target.value })
              }
              className="hiri-input"
              required
            >
              <option value="">Seçiniz...</option>
              <option value="1">1 Gün</option>
              <option value="2">2 Gün</option>
              <option value="3">3 Gün</option>
              <option value="4">4 Gün</option>
              <option value="5">5 Gün (Tam zamanlı ofis)</option>
              <option value="remote">Tamamen Uzaktan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Herhangi bir seyahat kısıtınız var mı?
            </label>
            <div className="space-y-2">
              {[
                { value: "yes", label: "Evet" },
                { value: "no", label: "Hayır" },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="travelRestriction"
                    value={option.value}
                    checked={formData.travelRestriction === option.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        travelRestriction: e.target.value,
                      })
                    }
                    className="mr-2"
                    required
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kariyerinizde sizi en çok motive eden şey nedir ve bu pozisyonda
              nasıl bir gelişim bekliyorsunuz?
            </label>
            <textarea
              value={formData.careerMotivation}
              onChange={(e) =>
                setFormData({ ...formData, careerMotivation: e.target.value })
              }
              rows={4}
              className="hiri-input"
              placeholder="Düşüncelerinizi paylaşın..."
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            rightIcon={<FaCheck />}
          >
            Formu Gönder
          </Button>
        </form>
      </Card>
    </div>
  );

  const renderFinishedStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Başvuru Tamamlandı!
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Başvurunuz ve ek bilgileriniz başarıyla alındı. Değerlendirme sürecimiz
        devam ediyor.
      </p>
      <p className="text-lg text-gray-600 mb-8">
        En kısa sürede sonraki adımlar hakkında sizinle iletişime geçeceğiz.
        İlginiz için teşekkür ederiz.
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="secondary"
        leftIcon={<FaSyncAlt />}
      >
        Baştan Başla
      </Button>
    </div>
  );

  const steps = {
    email: renderEmailStep,
    welcome: renderWelcomeStep,
    "tech-check": renderTechCheckStep,
    interview: renderInterviewStep,
    complete: renderCompleteStep,
    form: renderFormStep,
    finished: renderFinishedStep,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="min-h-[600px] flex flex-col justify-center">
          {steps[currentStep]()}
        </Card>
      </div>
    </div>
  );
}
