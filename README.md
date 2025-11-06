# Stylish Steps Collection Collection PWA

A full-stack Progressive Web App for premium clothing and accessories e-commerce.

## Features

- 🛍️ Product browsing and management
- 📏 AI-powered body measurement capture
- 💬 Multi-platform contact (WhatsApp, Snapchat, Instagram)
- 👤 User authentication and profiles
- 🎨 Admin dashboard for store management
- 🌓 Dark/Light theme support
- 📱 Fully responsive PWA
- ⚡ Optimized performance
- 🔒 Secure authentication

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui, Radix UI
- **PWA**: Service Workers, Manifest

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stylish-style-pwa
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- MongoDB connection string
- NextAuth secret (generate with: `openssl rand -base64 32`)
- Contact information

4. Seed the database (optional):
```bash
npm run seed
```

5. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables

Set these in your deployment platform:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+233XXXXXXXXX
NEXT_PUBLIC_SNAPCHAT_USERNAME=your_username
NEXT_PUBLIC_INSTAGRAM_USERNAME=your_username
```

## Project Structure
```
stylish-style-pwa/
├── src/
│   ├── app/                 # Next.js 14 app directory
│   │   ├── (auth)/         # Auth pages
│   │   ├── (main)/         # Main app pages
│   │   ├── admin/          # Admin dashboard
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── admin/         # Admin components
│   │   ├── products/      # Product components
│   │   └── shared/        # Shared components
│   ├── lib/               # Utility functions
│   ├── models/            # Mongoose models
│   └── types/             # TypeScript types
├── public/                # Static assets
│   ├── icons/            # PWA icons
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
└── scripts/              # Utility scripts
```

## Features by Session

### Session 1: Authentication
- User registration and login
- Session management with NextAuth
- Protected routes

### Session 2: Products
- Product listing with filters
- Product details
- Category browsing
- Search functionality

### Session 3: Admin Dashboard
- Product management (CRUD)
- Order management
- User management
- Analytics

### Session 4: Measurements
- Camera capture
- Manual entry
- Measurement history

### Session 5: Contact & Profile
- Multi-platform contact
- Profile management
- Order history

### Session 6: PWA & Polish
- PWA configuration
- Offline support
- Loading states
- Error handling

## Admin Access

Create an admin user by:
1. Register a new account
2. Update the user's role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## License

MIT

## Support

For support, email support@stylishstyle.com