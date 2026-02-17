# Mark. - Smart Bookmark Manager

A premium, high-contrast dark glassmorphic bookmark manager built with **Next.js**, **Supabase**, and **Tailwind CSS**.

![App Screenshot](https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png) *(Placeholder for your preview)*

## ✨ Features

- **Google OAuth**: Secure authentication powered by Supabase Auth.
- **Real-time Synchronization**: Instant updates across all devices using Supabase Realtime.
- **Glassmorphic UI**: High-end aesthetic with frosted glass effects and motion-blur backgrounds.
- **Collections Management**:
  - Add, Delete, and Search bookmarks.
  - Mark favorites with a single click.
  - Sort by Newest or Favorites.
- **Responsive Design**: Flawless experience across mobile, tablet, and desktop.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+ 
- A Supabase project

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
Run the SQL script found in `supabase_schema.sql` in your Supabase SQL Editor to create the necessary tables and RLS policies.

### 4. Installation
```bash
npm install
npm run dev
```

## 🔒 Security
- **Row Level Security (RLS)** is enabled on all tables.
- Users can ONLY see and manage their own bookmarks.
- Authentication is handled server-side via Middleware for maximum security.

## 🎨 UI Aesthetics
The app uses a dedicated **Night Mode** (Dark Theme) featuring:
- `backdrop-blur` for frosted glass components.
- Adaptive radial gradients for a cinematic background.
- Spring-based animations for a tactile feel.

---
Built with ❤️ by [Your Name/Antigravity]
# Bookmark-app
