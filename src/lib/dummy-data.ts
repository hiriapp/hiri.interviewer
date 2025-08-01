export const DUMMY_CANDIDATES = [
  {
    id: "aday1",
    name: "Bilal",
    surname: "Coşkun",
    email: "b.coskun@email.com",
    phone: "+90 555 123 4567",
    position: "Senior Software Developer - Kurum",
    source: { icon: 'fab fa-linkedin', color: 'text-blue-500', name: 'LinkedIn' },
    compatibilityScore: 88,
    compatibilityReasons: [
      "Veri görselleştirme kütüphaneleriyle (D3.js vb.) daha derinlemesine proje deneyimi faydalı olabilir.",
      "End-to-end test araçları (Cypress vb.) ile daha kapsamlı deneyim beklenebilir.",
      "Yapay zeka/makine öğrenmesi konseptlerine temel aşinalık belirtilmiş, daha fazla pratik uygulama fayda sağlayabilir."
    ],
    skills: {
      "Teknik": 9,
      "Problem Çözme": 8,
      "Liderlik": 8,
      "İletişim": 7,
      "Takım Çalışması": 9,
      "Öğrenme": 10
    },
    strengths: [
      "Derin React & TypeScript bilgisi",
      "Teknik liderlik ve mentorluk",
      "Performans optimizasyonu"
    ],
    weaknesses: [
      "Veri görselleştirme (D3.js) temel",
      "Kapsamlı E2E test deneyimi sınırlı"
    ],
    cvSummary: "Bilal Coşkun, React ve TypeScript odaklı 7+ yıl deneyime sahip kıdemli bir frontend geliştiricidir. Büyük ölçekli SaaS projelerinde çalışmış, performans optimizasyonu, UI/UX ve teknik liderlik konularında tecrübelidir. React Flow ve AI destekli geliştirme gibi modern teknolojilere hakimdir.",
    personalityInventorySummaryAI: "DISC analizine göre, aday 'Dominant' ve 'Conscientious' (Vicdanlı) profillerine yüksek yatkınlık göstermektedir. Sonuç odaklı, kararlı ve analitik bir yapıya sahiptir.",
          cvText: `BİLAL COŞKUN
b.coskun@email.com | +90 555 123 4567 | Istanbul

Senior Frontend Developer

ÖZET
React, TypeScript ve modern JavaScript framework'leri konusunda 7+ yıl deneyime sahip, kullanıcı odaklı, performanslı ve ölçeklenebilir web uygulamaları geliştirmeye tutkulu bir yazılım geliştiricisiyim. Karmaşık UI problemlerini çözme ve ekip içinde teknik liderlik yapma konusunda yetkinim. AI destekli geliştirme araçlarına ve veri görselleştirme kütüphanelerine ilgim bulunmaktadır.

DENEYİMLER
Tech Solutions Inc. - Senior Frontend Developer (Ocak 2018 - Günümüz)
- React ve Redux (daha sonra Zustand'a geçildi) kullanarak büyük ölçekli bir SaaS platformunun frontend mimarisini tasarladı ve geliştirdi.
- TypeScript ile %100 tip güvenliği sağlayarak kod kalitesini ve bakımını artırdı, hata oranlarını %30 azalttı.
- Performans optimizasyonları (lazy loading, code splitting, memoization) ile sayfa yükleme sürelerini ortalama %40 iyileştirdi.
- React Flow kullanarak dinamik ve interaktif iş akışı tasarım arayüzleri geliştirdi.
- Junior developerlara mentorluk yaptı ve kod inceleme süreçlerini yönetti.

Web Innovations Co. - Frontend Developer (Haziran 2016 - Aralık 2017)
- Çeşitli KOBİ müşterileri için modern ve duyarlı web siteleri ve PWA'lar geliştirdi.
- RESTful API entegrasyonları ve üçüncü parti servislerle (Stripe, Google Maps) çalıştı.

YETENEKLER
- Programlama Dilleri: JavaScript (ESNext), TypeScript, HTML5, CSS3 (Sass/LESS), Python (Temel), Java (17+)
- Framework/Kütüphaneler: React, Redux, Zustand, Next.js, React Testing Library, Jest, Cypress, Vite, Webpack, Tailwind CSS, Styled Components, React Flow, D3.js (Temel), Spring Boot (Temel)
- Araçlar: Git, Docker, Kubernetes (Temel), Jira, Figma, Storybook, AWS (Temel)
- Diğer: Agile/Scrum, CI/CD, UI/UX Prensipleri, AI-assisted development (GitHub Copilot)

EĞİTİM
Boğaziçi Üniversitesi - Bilgisayar Mühendisliği (Lisans) - 2016

PROJELER
- Açık Kaynak Katkısı: Popüler bir UI kütüphanesine performans iyileştirmeleri içeren bir PR (Pull Request) gönderdi (Kabul edildi).

SERTİFİKALAR
- Advanced React Patterns (Online Kurs)`,
    interviews: [
      {
        id: "int1_1",
        type: "HiriBot Teknik Mülakat",
        date: "2025-06-10",
        time: "10:00",
        status: "Planlandı",
        notes: "HiriBot tarafından kaydedilecek teknik mülakat. Adayın React, TypeScript ve problem çözme becerileri değerlendirilecek.",
        hasReport: true
      },
    ],
    notes: [
      {
        user: "Elif Kaya",
        timestamp: "10.06.2025 14:30",
        text: "Teknik mülakat performansı çok iyiydi.",
      },
      {
        user: "Tuna Can",
        timestamp: "09.06.2025 11:00",
        text: "Adayın GitHub profili incelendi, temiz kod yazıyor.",
      },
    ],
    logs: [
      {
        user: "Elif Kaya",
        timestamp: "10.06.2025 15:45",
        action: "Hakkında not eklendi.",
        icon: "fa-sticky-note",
        color: "bg-yellow-100 text-yellow-600",
      },
      {
        user: "Tuna Can",
        timestamp: "10.06.2025 11:20",
        action: "Kişilik envanteri yüklendi.",
        icon: "fa-file-import",
        color: "bg-teal-100 text-teal-600",
      },
      {
        user: "Sistem",
        timestamp: "08.06.2025 18:00",
        action: "Aday oluşturuldu.",
        icon: "fa-user-plus",
        color: "bg-blue-100 text-blue-600",
      },
    ]
  },
  {
    id: "aday2",  
    name: "Zeynep",
    surname: "Kaya",
    email: "zeynep.kaya@email.com",
    phone: "+90 555 987 6543",
    position: "Senior Software Developer - Kurum",
    source: { icon: 'fas fa-file-alt', color: 'text-gray-500', name: 'CV Yüklendi' },
    compatibilityScore: 82,
    compatibilityReasons: [
      "TypeScript konusunda daha derin pratik deneyim bekleniyor.",
      "Modern build araçları (Vite vb.) ve CI/CD süreçleri hakkında daha fazla bilgi faydalı olur.",
      "Karmaşık UI ve etkileşim problemlerini çözme konusunda daha fazla örnek sunması beklenebilir."
    ],
    skills: {
      "Teknik": 7,
      "Problem Çözme": 8,
      "Liderlik": 9,
      "İletişim": 10,
      "Takım Çalışması": 9,
      "Öğrenme": 8
    },
        strengths: [
      "Mükemmel iletişim becerileri",
      "UI/UX ve tasarım sistem uzmanlığı",
      "Proje yönetimi ve liderlik"
    ],
    weaknesses: [
      "Backend teknolojileri bilgisi sınırlı", 
      "Derin algoritma bilgisi geliştirilebilir"
    ],
    cvSummary: "Zeynep Kaya, 6 yıllık deneyime sahip, kullanıcı arayüzü ve deneyimi (UI/UX) konularına odaklanmış bir frontend geliştirici. Özellikle tasarım sistemleri kurma, yönetme ve iletişim becerileri çok güçlü. Proje yönetimi ve müşteri ilişkilerinde deneyimli.",
    personalityInventorySummaryAI: null, // Kişilik envanteri henüz yüklenmemiş
    cvText: `ÇAĞDAŞ OZAN PAMUK
cozanpamuk@example.com | Istanbul

Frontend Developer

ÖZET
React ve modern web teknolojileriyle 5 yıldır kullanıcı dostu arayüzler geliştiren bir frontend developerım. Özellikle state management (Redux) ve API entegrasyonları konusunda deneyimliyim. Takım çalışmasına yatkın ve yeni teknolojileri öğrenmeye hevesliyim. TypeScript konusunda kendimi geliştiriyorum.

DENEYİMLER
Creative Tech - Frontend Developer (Mart 2019 - Günümüz)
- React ve Redux kullanarak çeşitli web uygulamaları geliştirme.
- RESTful API'lerle backend entegrasyonu.
- Agile (Scrum) metodolojilerle çalışma.
- Temel UI/UX prensiplerine uygun tasarımlar yapma.

Stajyer Developer - Startup X (Haziran 2018 - Şubat 2019)
- HTML, CSS ve JavaScript ile basit web sayfaları oluşturma.
- Var olan projelere küçük çaplı özellik eklemeleri.

YETENEKLER
- Diller: JavaScript, HTML5, CSS3, TypeScript (Orta Seviye)
- Kütüphaneler: React, Redux, Material-UI, Jest, React Testing Library
- Araçlar: Git, npm, Webpack, Jira
- Diğer: Agile, Problem Çözme

EĞİTİM
İstanbul Teknik Üniversitesi - Yazılım Mühendisliği (Lisans) - 2019`,
    interviews: [
      {
        id: "int2_1",
        type: "Planlanmış HiriBot Mülakatı",
        date: "2025-06-12",
        time: "14:30",
        status: "Planlandı",
        notes: "İK ve Teknik değerlendirme.",
        hasReport: false
      }
    ],
    notes: [],
    logs: [
        {
          user: "Sistem",
          timestamp: "07.06.2025 11:00",
          action: "Aday oluşturuldu.",
          icon: "fa-user-plus",
          color: "bg-blue-100 text-blue-600",
        }
    ]
  },
  {
    id: "aday3",
    name: "Gamze Nur",
    surname: "Bayrak",
    email: "gamzenurb@example.com",
    phone: "0555 246 8135",
    position: "Junior Marketing Specialist - Hiri Inc.",
    source: { icon: 'fas fa-database', color: 'text-green-500', name: 'Aday Havuzu' },
    compatibilityScore: 92,
    compatibilityReasons: [
      "Profesyonel iş hayatında tam zamanlı deneyim henüz bulunmuyor (yeni mezun).",
      "Bazı spesifik pazarlama otomasyon araçları hakkında daha fazla pratik deneyim faydalı olabilir."
    ],
    skills: {
      "Teknik": 6,
      "Problem Çözme": 8,
      "Liderlik": 7,
      "İletişim": 10,
      "Takım Çalışması": 9,
      "Öğrenme": 9
    },
    strengths: [
      "Mükemmel iletişim becerileri",
      "Dijital pazarlama bilgisi",
      "Yüksek motivasyon ve öğrenme isteği"
    ],
    weaknesses: [
      "Sınırlı profesyonel deneyim",
      "Pazarlama otomasyon araçları temel",
      "Proje yönetimi deneyimi az"
    ],
    cvSummary: "Gamze Nur Bayrak, yeni mezun bir pazarlama adayıdır. Dijital pazarlama, içerik üretimi ve sosyal medya konularında staj deneyimi ve güçlü teorik bilgiye sahiptir. Öğrenmeye açık, motive ve iyi iletişim becerilerine sahip bir profili vardır.",
    personalityInventorySummaryAI: null, // Kişilik envanteri henüz yüklenmemiş
    cvText: `GAMZE NUR BAYRAK
gamzenurb@example.com | Ankara

Pazarlama Uzmanı Adayı

ÖZET
Yeni mezun, enerjik ve öğrenmeye açık bir pazarlama profesyoneliyim. Üniversite döneminde çeşitli pazarlama projelerinde ve stajlarda aktif rol aldım. Dijital pazarlama, içerik üretimi, sosyal medya yönetimi ve temel düzeyde grafik tasarım konularına özel ilgim var.

DENEYİMLER
Ajans Y - Pazarlama Stajyeri (Temmuz 2024 - Eylül 2024)
- Sosyal medya içerik takvimi oluşturma ve Instagram, LinkedIn için özgün içerikler (metin, görsel) hazırlama.
- Rakip analizi ve pazar trendleri araştırmalarına destek.
- Google Ads ve Facebook Ads kampanyalarının performansını izleme ve raporlama.
- E-posta pazarlama listelerinin segmentasyonu ve basit kampanya gönderimleri.

Üniversite Pazarlama Kulübü - Etkinlik Koordinatörü (Eylül 2023 - Haziran 2024)
- Kulüp etkinliklerinin planlanması, tanıtımı ve yürütülmesi.

YETENEKLER
- Dijital Pazarlama: SEO (Temel), SEM (Google Ads Temel), Sosyal Medya Yönetimi (Instagram, LinkedIn, Twitter, Facebook Business Suite), İçerik Pazarlaması
- Araçlar: Google Analytics (Temel), Canva, Mailchimp, Hootsuite (Temel), Microsoft Office (İleri Düzey Excel)
- Diller: İngilizce (İleri Düzey - C1)
- Diğer: Takım Çalışması, İletişim Becerileri, Zaman Yönetimi, Sunum Becerileri

EĞİTİM
Orta Doğu Teknik Üniversitesi - İşletme (Pazarlama Opsiyonu) (Lisans) - Haziran 2025 (Beklenen Mezuniyet)

İLGİ ALANLARI
Dijital trendler, tüketici davranışları, sürdürülebilir pazarlama, fotoğrafçılık.`,
    interviews: [
      {
        id: "int3_1",
        type: "Dış Kayıt (İK Görüşmesi Notu)",
        date: "2025-05-20",
        time: "14:00",
        status: "Tamamlandı",
        notes: "İK Yöneticisi Elif Hanım ile yapılan ilk tanışma ve yetkinlik bazlı görüşme notları.",
        hasReport: true
      }
    ],
    notes: [],
    logs: [
        {
          user: "Sistem",
          timestamp: "06.06.2025 17:00",
          action: "Aday oluşturuldu.",
          icon: "fa-user-plus",
          color: "bg-blue-100 text-blue-600",
        }
    ]
  }
];

// AI Karşılaştırma Analizleri
export const AI_COMPARISON_ANALYSES = {
  'aday1_aday2': "Analiz sonucunda; **Bilal Coşkun**'un teknik derinliği ve modern araçlara hakimiyeti, karmaşık ve performans odaklı projeler için daha uygun olduğunu göstermektedir. **Zeynep Kaya** ise güçlü iletişim becerileri, liderlik potansiyeli ve UI/UX vizyonu ile müşteri odaklı ve tasarım yönü ağır basan projelerde ekibe daha fazla değer katabilir. Seçim, projenin önceliklerine göre yapılmalıdır.",
  'aday1_aday3': "**Bilal Coşkun** teknik liderlik ve yazılım geliştirme konularında çok güçlü iken, **Gamze Nur Bayrak** pazarlama alanında yüksek potansiyel ve mükemmel iletişim becerileri sergiliyor. İki farklı uzmanlık alanı olduğu için doğrudan karşılaştırma yerine, pozisyon gereksinimlerine göre değerlendirme yapılmalıdır.",
  'aday2_aday3': "**Zeynep Kaya** frontend geliştirme ve UI/UX tasarımında deneyimli ve güçlü iletişim becerileri olan bir profil çizerken, **Gamze Nur Bayrak** pazarlama ve iletişim alanlarında üstün yetenekler gösteriyor. Her ikisi de mükemmel iletişim becerileri ve liderlik potansiyeli olan adaylar. Seçim tamamen pozisyon gereksinimlerine bağlıdır."
};