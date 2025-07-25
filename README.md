# HiriBot - AI-Powered Interview Platform

A modern Next.js 14 application simulating an AI-powered video interview platform for HR professionals and candidates.

## 🚀 Features

### Admin Dashboard (`/dashboard`)

- **Authentication**: Secure login with NextAuth.js
- **HiriBot Chat Interface**: Interactive AI assistant for HR queries
- **Candidate Management**: View and manage job applicants
- **Position Management**: Create and manage job positions
- **Interview Scheduling**: Track upcoming interviews
- **Personal Notes**: Add and manage personal notes

### Candidate Interview Experience (`/interview`)

- **Email Invitation Flow**: Realistic email invitation simulation
- **Welcome & Tech Check**: Camera and microphone testing
- **Interactive Interview**: AI-powered conversation with HiriBot
- **Progress Tracking**: Real-time interview progress and timer
- **Form Completion**: Additional information collection
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Hiri design system
- **Authentication**: NextAuth.js v5 with credentials provider
- **Icons**: React Icons (Font Awesome)
- **Fonts**: Inter from Google Fonts

## 🎨 Design System

The application uses a custom design system inspired by the original HTML prototypes:

### Colors

- **Primary Purple**: `#7C3AED`
- **Purple Dark**: `#6D28D9`
- **Blue**: `#3B82F6`
- **Pink**: `#EC4899`
- **Light Purple**: `#F3E8FF`

### Components

- **Buttons**: Multiple variants (primary, secondary, outline, tertiary)
- **Cards**: Clean, modern cards with consistent styling
- **Inputs**: Focused states with purple accents
- **Chat**: Styled message bubbles for HiriBot conversations

## 🚦 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hiribot-interview
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

### Demo Credentials

- **Email**: `admin@hiribot.com`
- **Password**: `admin123`

The application uses NextAuth.js with a credentials provider for demonstration purposes. In production, this would be replaced with proper user management and authentication.

## 📱 Routes

### Public Routes

- `/login` - Authentication page
- `/interview` - Candidate interview experience
- `/api/auth/[...nextauth]` - NextAuth API routes

### Protected Routes (require authentication)

- `/` - Home page (redirects to dashboard)
- `/dashboard` - Main admin dashboard

## 🧩 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Admin dashboard
│   ├── interview/          # Candidate interview flow
│   ├── login/             # Authentication page
│   └── api/auth/          # NextAuth API routes
├── components/            # Reusable React components
│   ├── ui/                # Base UI components
│   └── dashboard/         # Dashboard-specific components
├── lib/                   # Utility functions and configurations
└── types/                 # TypeScript type definitions
```

## 🎯 Key Features Implemented

### 1. Modern Authentication Flow

- Secure login with NextAuth.js
- Route protection with middleware
- Session management

### 2. Interactive Dashboard

- Real-time HiriBot chat simulation
- Candidate and position management interfaces
- Personal notes functionality
- Upcoming interviews tracking

### 3. Candidate Interview Experience

- Multi-step interview flow
- Real-time timer and progress tracking
- Interactive chat with HiriBot
- Technical equipment checking
- Form completion workflow

### 4. Responsive Design

- Mobile-first approach
- Consistent design across all screen sizes
- Modern UI with smooth transitions

## 🔧 Customization

### Adding New UI Components

1. Create component in `src/components/ui/`
2. Follow the existing design patterns
3. Use Tailwind utility classes with Hiri color scheme

### Extending the Dashboard

1. Add new sections in `src/app/dashboard/page.tsx`
2. Create supporting components in `src/components/dashboard/`
3. Update navigation in the Header component

### Modifying the Interview Flow

1. Update steps in `src/app/interview/page.tsx`
2. Modify the `InterviewStep` type for new steps
3. Add corresponding render functions

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Heroku

## 📝 Notes

This is a demonstration project showcasing modern web development practices with Next.js 14. The AI functionality is simulated for demo purposes. In a production environment, you would integrate with actual AI services, user management systems, and databases.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for demonstration purposes. Please check the license file for more details.
