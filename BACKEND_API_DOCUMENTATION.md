# HiriBot Interview Platform - Backend API Dokümantasyonu

## 🔐 Authentication & Authorization

### Auth Endpoints

```http
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET /api/auth/me
```

### User Model

```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "admin" | "user",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Auth Flow

- NextAuth.js kullanımı
- JWT token tabanlı kimlik doğrulama
- Admin/User rol sistemi
- Session yönetimi

---

## 👥 Candidate Management (Aday Yönetimi)

### Candidate Endpoints

```http
GET    /api/candidates                    # Aday listesi
GET    /api/candidates/{id}               # Aday detayı
POST   /api/candidates                    # Yeni aday oluştur
PUT    /api/candidates/{id}               # Aday güncelle
DELETE /api/candidates/{id}               # Aday sil
POST   /api/candidates/{id}/cv-analysis   # CV yeniden analiz et
POST   /api/candidates/upload-cv          # CV yükleyerek aday oluştur
```

### Candidate Model

```json
{
  "id": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "phone": "string",
  "positionId": "string",
  "position": "string", // Position title for display
  "compatibilityScore": "number", // 0-100
  "compatibilityReasons": ["string"], // AI analiz nedenleri
  "cvSummary": "string", // AI tarafından oluşturulan özet
  "cvText": "string", // Ham CV metni
  "cvFileUrl": "string", // CV dosya URL'i (opsiyonel)
  "status": "active" | "inactive" | "archived",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "interviews": [
    {
      "id": "string",
      "type": "string", // "HiriBot Teknik Mülakat", "Video Mülakat", vb.
      "date": "string", // YYYY-MM-DD
      "time": "string", // HH:MM
      "status": "Planlandı" | "Tamamlandı" | "İptal",
      "notes": "string",
      "hasReport": "boolean",
      "interviewers": "string", // Dış mülakatlar için
      "files": {
        "notes": "string", // Dosya adı
        "video": "string"  // Video dosya adı
      }
    }
  ]
}
```

### CV Upload Flow

```json
// POST /api/candidates/upload-cv
{
  "positionId": "string",
  "cvFile": "File" // Multipart form data
}

// Response
{
  "candidateId": "string",
  "message": "CV başarıyla yüklendi ve aday oluşturuldu",
  "extractedData": {
    "name": "string",
    "surname": "string",
    "email": "string",
    "phone": "string",
    "cvText": "string",
    "cvSummary": "string"
  }
}
```

### Search & Filter Parameters

```http
GET /api/candidates?search=mehmet&position=pos1&status=active&page=1&limit=10
```

---

## 💼 Position Management (Pozisyon Yönetimi)

### Position Endpoints

```http
GET    /api/positions           # Pozisyon listesi
GET    /api/positions/{id}      # Pozisyon detayı
POST   /api/positions           # Yeni pozisyon oluştur
PUT    /api/positions/{id}      # Pozisyon güncelle
DELETE /api/positions/{id}      # Pozisyon sil
```

### Position Model

```json
{
  "id": "string",
  "title": "string", // "Senior Software Developer - Turkcell"
  "description": "string", // Detaylı açıklama
  "requirements": ["string"], // Gereksinimler listesi
  "responsibilities": ["string"], // Sorumluluklar listesi
  "status": "active" | "inactive" | "closed",
  "candidateCount": "number", // Bu pozisyon için başvuran sayısı
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## 🎯 Interview Management (Mülakat Yönetimi)

### Interview Endpoints

```http
GET    /api/interviews                           # Mülakat listesi
GET    /api/interviews/{id}                      # Mülakat detayı
POST   /api/interviews/on-demand                 # On-demand mülakat oluştur
POST   /api/interviews/instant                   # Anlık HiriBot daveti
POST   /api/interviews/scheduled                 # Planlı HiriBot mülakatı
POST   /api/interviews/external                  # Dış mülakat kaydı
GET    /api/interviews/{id}/report               # Mülakat raporu
POST   /api/interviews/{id}/chat                 # AI ile sohbet
```

### Interview Models

#### On-Demand Interview Request

```json
{
  "candidateId": "string",
  "type": "video" | "phone",
  "questions": [
    {
      "id": "string",
      "text": "string",
      "thinkTime": "number", // saniye
      "time": "number",      // saniye
      "retries": "number"
    }
  ],
  "settings": {
    "deadline": "datetime",
    "emailSubject": "string",
    "emailContent": "string",
    "welcomeVideoUrl": "string", // opsiyonel
    "fareewellVideoUrl": "string" // opsiyonel
  }
}
```

#### Instant Interview Request

```json
{
  "candidateId": "string",
  "meetingLink": "string" // Google Meet, Zoom vb.
}
```

#### Scheduled Interview Request

```json
{
  "candidateId": "string",
  "meetingLink": "string",
  "scheduledDate": "datetime",
  "scheduledTime": "string" // HH:MM
}
```

#### External Interview Request

```json
{
  "candidateId": "string",
  "date": "string", // YYYY-MM-DD
  "interviewers": "string",
  "notes": "string",
  "notesFile": "File", // opsiyonel
  "videoFile": "File" // opsiyonel
}
```

#### Interview Report Model

```json
{
  "id": "string",
  "interviewId": "string",
  "candidateId": "string",
  "introduction": "string",
  "strengths": ["string"],
  "areasForDevelopment": ["string"],
  "overallSummary": {
    "communication": "string",
    "level": "string",
    "conclusion": "string"
  },
  "generatedAt": "datetime"
}
```

---

## 📊 Dashboard & Analytics

### Dashboard Endpoints

```http
GET /api/dashboard/stats              # Genel istatistikler
GET /api/dashboard/upcoming-interviews # Yaklaşan mülakatlar
GET /api/dashboard/notes              # Kişisel notlar
POST /api/dashboard/notes             # Not oluştur
PUT /api/dashboard/notes/{id}         # Not güncelle
DELETE /api/dashboard/notes/{id}      # Not sil
```

### Dashboard Models

#### Stats Response

```json
{
  "totalCandidates": "number",
  "totalPositions": "number",
  "totalInterviews": "number",
  "upcomingInterviews": "number",
  "recentActivity": [
    {
      "type": "candidate_added" | "interview_completed" | "position_created",
      "description": "string",
      "timestamp": "datetime"
    }
  ]
}
```

#### Note Model

```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "category": "general" | "candidate" | "interview" | "reminder" | "task",
  "priority": "low" | "medium" | "high",
  "color": "string", // Hex color code
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## 🤖 AI Services (Yapay Zeka Servisleri)

### AI Endpoints

```http
POST /api/ai/cv-analysis              # CV analiz et
POST /api/ai/compatibility-score     # Uyumluluk skoru hesapla
POST /api/ai/interview-questions     # Mülakat soruları öner
POST /api/ai/interview-analysis      # Mülakat analizi
POST /api/ai/chat                    # AI sohbet
```

### AI Request/Response Models

#### CV Analysis Request

```json
{
  "cvText": "string",
  "positionId": "string"
}
```

#### CV Analysis Response

```json
{
  "summary": "string",
  "compatibilityScore": "number",
  "compatibilityReasons": ["string"],
  "extractedInfo": {
    "name": "string",
    "surname": "string",
    "email": "string",
    "phone": "string",
    "skills": ["string"],
    "experience": "string"
  }
}
```

#### Interview Questions Request

```json
{
  "candidateId": "string",
  "positionId": "string",
  "questionCount": "number",
  "technique": "STAR" // STAR tekniği
}
```

#### Interview Questions Response

```json
{
  "questions": [
    {
      "category": "string", // "Geçmiş Deneyimler ve Problem Çözme"
      "questions": ["string"]
    }
  ]
}
```

#### AI Chat Request

```json
{
  "message": "string",
  "context": {
    "type": "interview" | "general",
    "interviewId": "string", // opsiyonel
    "candidateId": "string"  // opsiyonel
  }
}
```

---

## 💬 HiriBot Chat Sessions (Konuşma Oturumları)

### Chat Session Endpoints

```http
GET    /api/chat/sessions                    # Kullanıcının chat oturumları
GET    /api/chat/sessions/{id}               # Belirli oturum detayı
POST   /api/chat/sessions                    # Yeni oturum oluştur
PUT    /api/chat/sessions/{id}               # Oturum güncelle (başlık, vb.)
DELETE /api/chat/sessions/{id}               # Oturum sil
POST   /api/chat/sessions/{id}/messages      # Oturuma mesaj ekle
GET    /api/chat/sessions/{id}/messages      # Oturum mesajları
DELETE /api/chat/sessions/{id}/messages/{msgId} # Mesaj sil
```

### Chat Session Models

#### Chat Session Model

```json
{
  "id": "string",
  "userId": "string", // Oturum sahibi
  "title": "string", // Oturum başlığı (ilk mesajdan otomatik oluşturulur)
  "messageCount": "number", // Toplam mesaj sayısı
  "lastMessageAt": "datetime", // Son mesaj zamanı
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "isActive": "boolean" // Aktif oturum kontrolü
}
```

#### Chat Message Model

```json
{
  "id": "string",
  "sessionId": "string",
  "type": "user" | "assistant",
  "content": "string",
  "metadata": {
    "tokens": "number", // opsiyonel, AI response için
    "processingTime": "number", // ms, AI response süresi
    "context": "object" // opsiyonel, chat context bilgisi
  },
  "timestamp": "datetime",
  "editedAt": "datetime", // opsiyonel, mesaj düzenlendiyse
  "isDeleted": "boolean"
}
```

#### Create Session Request

```json
{
  "title": "string", // opsiyonel, verilmezse ilk mesajdan oluşturulur
  "initialMessage": {
    "content": "string",
    "type": "user"
  } // opsiyonel
}
```

#### Create Session Response

```json
{
  "sessionId": "string",
  "title": "string",
  "createdAt": "datetime",
  "firstMessageId": "string" // eğer initialMessage varsa
}
```

#### Update Session Request

```json
{
  "title": "string", // Sadece başlık güncellenebilir
  "isActive": "boolean" // Oturum aktiflik durumu
}
```

#### Add Message Request

```json
{
  "content": "string",
  "type": "user" | "assistant",
  "context": {
    "candidateId": "string", // opsiyonel
    "interviewId": "string", // opsiyonel
    "analysisType": "string" // opsiyonel: "cv", "interview", "general"
  }
}
```

#### Add Message Response

```json
{
  "messageId": "string",
  "aiResponse": {
    "messageId": "string",
    "content": "string",
    "processingTime": "number",
    "timestamp": "datetime"
  } // user message ise AI response da döner
}
```

#### Session List Response

```json
{
  "sessions": [
    {
      "id": "string",
      "title": "string",
      "messageCount": "number",
      "lastMessageAt": "datetime",
      "createdAt": "datetime",
      "lastMessage": {
        "type": "user" | "assistant",
        "content": "string", // İlk 100 karakter
        "timestamp": "datetime"
      }
    }
  ],
  "totalCount": "number",
  "page": "number",
  "limit": "number"
}
```

### Chat Session Query Parameters

```http
# Session listesi için
GET /api/chat/sessions?page=1&limit=20&sortBy=lastMessageAt&order=desc

# Session mesajları için
GET /api/chat/sessions/{id}/messages?page=1&limit=50&before=messageId&after=messageId
```

---

## 🎬 HiriBot Integration

### HiriBot Endpoints

```http
POST /api/hiribot/create-session      # HiriBot oturumu oluştur
GET  /api/hiribot/session/{id}/status # Oturum durumu
POST /api/hiribot/invite-instant      # Anlık davet gönder
POST /api/hiribot/schedule            # Planlı mülakat oluştur
```

### HiriBot Models

#### Create Session Request

```json
{
  "candidateId": "string",
  "type": "video" | "phone",
  "questions": [
    {
      "text": "string",
      "duration": "number"
    }
  ]
}
```

#### Session Status Response

```json
{
  "sessionId": "string",
  "status": "pending" | "in_progress" | "completed" | "failed",
  "candidateJoined": "boolean",
  "startedAt": "datetime",
  "completedAt": "datetime",
  "transcript": "string", // mülakat tamamlandıysa
  "recording": "string"   // video URL'i
}
```

---

## 📁 File Management

### File Upload Endpoints

```http
POST /api/files/upload               # Dosya yükle
GET  /api/files/{id}                # Dosya indir
DELETE /api/files/{id}              # Dosya sil
```

### File Model

```json
{
  "id": "string",
  "filename": "string",
  "originalName": "string",
  "mimeType": "string",
  "size": "number",
  "url": "string",
  "uploadedBy": "string", // User ID
  "createdAt": "datetime"
}
```

---

## 🔍 Search & Filtering

### Global Search

```http
GET /api/search?q=mehmet&type=candidates,positions,sessions&limit=10
```

### Search Response

```json
{
  "candidates": [
    {
      "id": "string",
      "name": "string",
      "surname": "string",
      "position": "string",
      "relevanceScore": "number"
    }
  ],
  "positions": [
    {
      "id": "string",
      "title": "string",
      "relevanceScore": "number"
    }
  ],
  "chatSessions": [
    {
      "id": "string",
      "title": "string",
      "lastMessageAt": "datetime",
      "relevanceScore": "number"
    }
  ]
}
```

---

## 📋 Data Validation Rules

### Validation Constraints

#### Candidate

- `email`: Valid email format, unique
- `phone`: Valid phone number format (optional)
- `name`, `surname`: 2-50 characters
- `compatibilityScore`: 0-100 range

#### Position

- `title`: 5-200 characters, required
- `description`: 10-5000 characters
- `requirements`: Max 20 items, each 1-200 chars
- `responsibilities`: Max 20 items, each 1-200 chars

#### Interview

- `questions`: Max 20 questions per interview
- `question.text`: 10-1000 characters
- `question.time`: 30-600 seconds
- `question.thinkTime`: 0-120 seconds

#### Chat Session

- `title`: 1-200 characters
- `message.content`: 1-10000 characters
- Max 100 active sessions per user
- Max 1000 messages per session
- Auto-delete sessions after 90 days of inactivity

---

## 🚨 Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object", // opsiyonel
    "timestamp": "datetime"
  }
}
```

### Error Codes

- `VALIDATION_ERROR`: 400
- `UNAUTHORIZED`: 401
- `FORBIDDEN`: 403
- `NOT_FOUND`: 404
- `CONFLICT`: 409 (duplicate email, etc.)
- `FILE_TOO_LARGE`: 413
- `UNSUPPORTED_FILE_TYPE`: 415
- `RATE_LIMIT_EXCEEDED`: 429
- `SESSION_LIMIT_EXCEEDED`: 429 (too many active sessions)
- `MESSAGE_LIMIT_EXCEEDED`: 429 (too many messages in session)
- `INTERNAL_SERVER_ERROR`: 500
- `AI_SERVICE_UNAVAILABLE`: 503

---

## 📄 File Upload Specifications

### Supported File Types

- **CV Files**: PDF, DOCX, TXT
- **Images**: JPG, PNG (max 5MB)
- **Videos**: MP4, MOV, AVI (max 100MB)
- **Documents**: PDF, DOC, DOCX, TXT (max 10MB)

### Upload Constraints

- Max file size per upload: 100MB
- Max files per request: 5
- Supported encodings: UTF-8
- File naming: UUID-based with original extension

---

## 🔄 Real-time Features (WebSocket)

### WebSocket Events

```javascript
// Mülakat durumu güncellemeleri
ws.on("interview_status_update", {
  interviewId: "string",
  status: "string",
  timestamp: "datetime",
});

// HiriBot durum güncellemeleri
ws.on("hiribot_status", {
  sessionId: "string",
  status: "string",
  candidateJoined: "boolean",
});

// Yeni bildirimler
ws.on("notification", {
  type: "string",
  message: "string",
  data: "object",
});

// Chat session güncellemeleri
ws.on("chat_session_update", {
  sessionId: "string",
  type: "message_added" | "session_updated" | "session_deleted",
  data: "object",
  timestamp: "datetime",
});

// AI typing indicator
ws.on("ai_typing", {
  sessionId: "string",
  isTyping: "boolean",
});
```

---

## 🔧 Environment Variables

### Required Environment Variables

```bash
# Database
DATABASE_URL=
REDIS_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# AI Services
OPENAI_API_KEY=
AI_SERVICE_BASE_URL=

# File Storage
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# HiriBot Integration
HIRIBOT_API_KEY=
HIRIBOT_BASE_URL=

# Email Service
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Chat Configuration
CHAT_SESSION_LIMIT_PER_USER=100
CHAT_MESSAGE_LIMIT_PER_SESSION=1000
CHAT_SESSION_TTL_DAYS=90
```

---

## 📚 Additional Notes

### Performance Considerations

- CV analizi işlemleri asenkron olarak yapılmalı
- Chat sessions için pagination ve lazy loading
- AI responses için caching stratejisi
- Büyük dosya yüklemeleri için progress tracking
- Rate limiting: 100 requests/minute per user
- Database indexing: email, candidateId, positionId, createdAt, sessionId, userId

### Security Requirements

- JWT token expiration: 24 hours
- Chat session access kontrolü (sadece oturum sahibi erişebilir)
- Message content sanitization
- File upload virus scanning
- Input sanitization for all text fields
- CORS policy configuration
- API request logging
- Chat data encryption at rest

### Scalability

- Horizontal scaling ready API design
- Caching strategy for frequently accessed data
- Queue system for heavy AI operations
- CDN integration for file serving
- Chat message archiving strategy
- Session cleanup for inactive users

### Data Retention & Privacy

- Chat sessions auto-delete after 90 days of inactivity
- Message soft-delete with recovery option (7 days)
- User consent for AI training data usage
- GDPR compliance for EU users
- Data export functionality for user requests

---

**Bu dokümantasyon projenin mevcut frontend implementasyonuna dayanmaktadır. Backend geliştirme sırasında ek özellikler veya değişiklikler gerekebilir.**

**Yeni eklenen özellikler:** HiriBot Chat Sessions sistemi, konuşma geçmişi yönetimi, real-time chat güncellemeleri ve gelişmiş oturum yönetimi.
