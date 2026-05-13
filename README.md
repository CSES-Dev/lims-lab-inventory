# LIMS Lab Inventory

A Next.js-based Lab Inventory Management System (LIMS) with Google OAuth authentication and MongoDB database integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Google OAuth credentials

### 1. Clone & Install

```bash
git clone https://github.com/CSES-Dev/lims-lab-inventory.git
cd lims-lab-inventory
npm install
```

### 2. Set Up Environment Variables

Copy the example file and configure your settings:

```bash
cp .env.example .env.local
```

Fill in the required values (see [Environment Variables](#environment-variables) below).

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google+ API**
4. Create OAuth 2.0 credentials (Web Application):
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy **Client ID** and **Client Secret**

### 4. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Connection string:
# mongodb://localhost:27017/lims-inventory
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account & cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database-name`

### 5. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

Test authentication: http://localhost:3000/api/auth/signin

---

## 📋 Environment Variables

Create `.env.local` with these values:

```env
# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here

# NextAuth Configuration
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/lims-inventory
# OR for MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/lims-inventory
```

### Generating NEXTAUTH_SECRET

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint and Prettier checks |
| `npm run lint-fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm test` | Run E2E tests with Playwright |
| `npm run test:e2e` | Run Playwright tests |
| `npm run test:ci` | Run Jest tests (CI mode) |
| `npm run check-git-hooks` | Verify git hooks configuration |

---

## 🏗️ Project Structure

```
lims-lab-inventory/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── auth/[...nextauth]/   # NextAuth API routes
│   └── page.tsx                  # Homepage
├── components/                   # React components
├── lib/                          # Utility functions
├── models/                       # MongoDB schemas
├── services/                     # Business logic
├── tests/                        # Test files
├── public/                       # Static assets
├── auth.ts                       # NextAuth configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── jest.config.js                # Jest test config
├── playwright.config.ts          # Playwright E2E config
└── README.md                     # This file
```

---

## 🔐 Authentication

This app uses **NextAuth.js** with **Google OAuth** for authentication.

### How It Works

1. User clicks "Sign In"
2. Redirected to Google login
3. Google redirects back to `/api/auth/callback/google`
4. User session created with JWT
5. Access to protected routes

### Protected Routes

Wrap components with authentication:

```typescript
import { auth } from "@/auth";

export default async function ProtectedPage() {
    const session = await auth();
    
    if (!session) {
        redirect("/api/auth/signin");
    }
    
    return <div>Welcome, {session.user?.name}</div>;
}
```

---

## 🗄️ Database

### MongoDB Connection

The app uses **Mongoose** ODM for MongoDB:

- Development: Use local MongoDB or MongoDB Atlas
- Testing: In-memory MongoDB (mongodb-memory-server)

### Environment Setup

See [Environment Variables](#environment-variables) for connection string examples.

---

## 🧪 Testing

### E2E Tests (Playwright)

```bash
# Run all tests
npm test

# Run specific test
npx playwright test tests/auth.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# View test report
npx playwright show-report
```

### Unit Tests (Jest)

```bash
# Run Jest tests
npm run test:ci

# In CI environment with force exit
```

Test configuration uses in-memory MongoDB for isolation.

---

## 🐛 Troubleshooting

### "NEXTAUTH_SECRET is not set"
- Generate with: `openssl rand -base64 32`
- Add to `.env.local`

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `docker ps`
- Check connection string in `.env.local`
- Test with MongoDB Compass

### "Google OAuth fails"
- Verify Client ID & Secret in `.env.local`
- Check redirect URIs match Google Console settings
- Ensure domain is whitelisted

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001  # Use different port
```

### Build fails with TypeScript errors
```bash
npm run lint-fix  # Auto-fix issues
npm run build     # Try building again
```

---

## 📚 Tech Stack

- **Frontend:** React 19, Next.js 15, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** MongoDB, Mongoose
- **Authentication:** NextAuth.js 5, Google OAuth
- **Testing:** Playwright, Jest
- **Tools:** ESLint, Prettier, Husky

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

Ensure code passes linting before submitting:
```bash
npm run lint-check
```

---

## 📝 License

This project is part of the CSES organization.

---

## 🆘 Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting)
- Review [GitHub Issues](https://github.com/CSES-Dev/lims-lab-inventory/issues)
- Contact the CSES team

---

**Last Updated:** May 2026
