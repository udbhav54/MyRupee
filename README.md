# 💰 myRupee - Personal Finance Tracker

A modern, feature-rich personal finance tracker built with React 19, TypeScript, Firebase, and Tailwind CSS. Track your income, expenses, and visualize your financial data with beautiful charts.

![myRupee Dashboard](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Firebase](https://img.shields.io/badge/Firebase-12.9-orange) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

### 🔐 Authentication
- **Email/Password Sign Up & Login** with validation
- **Google OAuth** sign-in with popup
- Automatic user profile creation in Firestore
- Protected routes with auto-redirect

### 💵 Transaction Management
- **Add Income** with categories (Salary, Freelance, Investment)
- **Add Expense** with categories (Food, Education, Office)
- **Real-time sync** using Firestore onSnapshot
- **Search, Filter & Sort** transactions
- **CSV Import/Export** for bulk operations

### 📊 Data Visualization
- **Line Chart** - Monthly balance trends
- **Pie Chart** - Spending by category
- **Summary Cards** - Current Balance, Total Income, Total Expenses
- Indian Rupee (₹) formatting

### 🎨 User Experience
- **Dark/Light Theme Toggle** with localStorage persistence
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Toast Notifications** for all actions
- **Loading States** with elegant animations
- **Empty States** with helpful messages

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS 3.4, shadcn/ui |
| **State Management** | Zustand 5 |
| **Backend** | Firebase 12 (Auth, Firestore) |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts 3 |
| **Date Handling** | date-fns |
| **CSV Processing** | PapaParse |
| **Notifications** | Sonner |
| **Icons** | Lucide React |

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Firebase account ([Create one here](https://console.firebase.google.com/))

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd myrupee
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the template
cp .env.template .env.local

# Edit .env.local and add your Firebase credentials
```

4. **Install shadcn/ui components**
```bash
npx shadcn@latest add button dialog input label select radio-group card
```

5. **Start the development server**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

---

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (add your project's authorized domains)

### 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Select a location

### 4. Set Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Get Firebase Config

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" → Click **Web app** icon
3. Copy the configuration values
4. Paste them into `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📁 Project Structure
```
myrupee/
├── src/
│   ├── assets/              # Static assets (SVG images)
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AddExpenseModal.tsx
│   │   ├── AddIncomeModal.tsx
│   │   ├── Cards.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── Loader.tsx
│   │   ├── NoTransactions.tsx
│   │   ├── SignUpSignIn.tsx
│   │   └── TransactionSearch.tsx
│   ├── lib/                # Utilities
│   │   ├── firebase.ts     # Firebase configuration
│   │   └── utils.ts        # Helper functions
│   ├── stores/             # Zustand state management
│   │   ├── useAuthStore.ts
│   │   ├── useThemeStore.ts
│   │   └── useTransactionStore.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # TypeScript definitions
├── .env.template           # Environment variables template
├── .env.local             # Your Firebase credentials (gitignored)
├── components.json        # shadcn/ui configuration
├── index.html
├── package.json
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md
```

---

## 🚀 Available Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🎯 Usage Guide

### Sign Up / Login
1. Open the app at `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Or use "Continue with Google"

### Add Income
1. Click "Add Income" button on the dashboard
2. Fill in the form (Name, Amount, Date, Category)
3. Submit to add the transaction

### Add Expense
1. Click "Add Expense" button
2. Fill in the form (Name, Amount, Date, Category)
3. Submit to track the expense

### View Charts
- **Line Chart**: Shows monthly balance trends
- **Pie Chart**: Shows spending breakdown by category

### Search & Filter
- Use the search bar to find transactions by name
- Filter by type (Income/Expense)
- Sort by date or amount

### Export/Import CSV
- **Export**: Download all transactions as CSV
- **Import**: Upload CSV to bulk import transactions

CSV Format:
```csv
name,type,date,amount,tag
Salary,income,2024-01-15,50000,salary
Groceries,expense,2024-01-16,2500,food
```

### Theme Toggle
- Click the Sun/Moon icon in the header
- Theme preference is saved in localStorage

---

## 🐛 Troubleshooting

### TypeScript Errors

**Error**: `Cannot find module '@/components/ui/button'`

**Fix**:
```bash
# Install missing component
npx shadcn@latest add button

# Restart TS server in VSCode
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

**Error**: `Property 'env' does not exist on type 'ImportMeta'`

**Fix**: Create `src/vite-env.d.ts` with environment variable types (see above)

### Firebase Errors

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Fix**: Double-check your `.env.local` file has correct Firebase credentials

**Error**: `Missing or insufficient permissions`

**Fix**: Update Firestore Security Rules (see Firebase Setup section)

### Build Errors

**Error**: Module not found errors during build

**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🔒 Security Notes

- ⚠️ **Never commit** `.env.local` to version control
- ✅ `.env.local` is in `.gitignore` by default
- ✅ Use Firestore Security Rules to protect user data
- ✅ Firebase credentials in `.env.local` are safe for frontend use

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

If you have any questions or run into issues, please:
- Open an issue on GitHub
- Check the Troubleshooting section above

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

---

**Made with ❤️ by [Udbhav Kumar]**