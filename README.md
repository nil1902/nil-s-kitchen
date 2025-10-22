# 🍽️ Bengal Bay Restaurant - Full Stack E-Commerce Platform

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-11.4.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A modern, feature-rich restaurant e-commerce platform with AI chatbot, payment integration, and real-time order management**

[Live Demo](https://nil-s-kitchen.vercel.app/) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Key Implementations](#-key-implementations)
- [Payment Integration](#-payment-integration)
- [AI Chatbot](#-ai-chatbot)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🛒 **E-Commerce Core**
- ✅ Dynamic menu with category filtering (Veg, Non-Veg, Biryani, Starters, Drinks, Desserts)
- ✅ Advanced search functionality with real-time filtering
- ✅ Shopping cart with quantity management
- ✅ Buy Now & Add to Cart options
- ✅ Favorites/Wishlist system
- ✅ Order history & tracking

### 💳 **Payment System**
- ✅ Razorpay integration (Cards, UPI, Net Banking, Wallets)
- ✅ Cash on Delivery (COD) with OTP verification
- ✅ Secure payment gateway with error handling
- ✅ Order receipt generation
- ✅ Email confirmation with billing details

### 🤖 **AI Chatbot**
- ✅ N8N-powered AI assistant
- ✅ Floating chat widget with modern UI
- ✅ Context-aware responses
- ✅ Auto-hide on checkout/cart pages
- ✅ Mobile-optimized interface

### 👤 **User Management**
- ✅ Firebase Authentication (Email/Password, Google)
- ✅ User profile management
- ✅ Order history tracking
- ✅ Booking history
- ✅ Address management with geolocation

### 📱 **Mobile Responsive**
- ✅ Fully responsive design (Mobile, Tablet, Desktop)
- ✅ Touch-optimized UI components
- ✅ Swipeable category tabs
- ✅ Mobile-friendly navigation
- ✅ Optimized performance for mobile browsers

### 📊 **Admin & Analytics**
- ✅ Google Sheets integration for order logging
- ✅ Real-time order management
- ✅ Menu management system
- ✅ Customer data tracking

### 🎨 **UI/UX Features**
- ✅ Modern gradient designs
- ✅ Smooth animations with Framer Motion
- ✅ Loading states & skeletons
- ✅ Error boundaries for crash prevention
- ✅ Toast notifications
- ✅ Image carousels
- ✅ Modal dialogs

---

## 🛠️ Tech Stack

### **Frontend**

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| TypeScript | 5.2.2 | Type Safety |
| Vite | 5.4.10 | Build Tool |
| Tailwind CSS | 3.4.17 | Styling |
| Framer Motion | 11.18.0 | Animations |
| React Router | 6.23.1 | Routing |
| Radix UI | Latest | UI Components |
| Lucide React | 0.394.0 | Icons |

### **Backend & Services**

| Service | Purpose |
|---------|---------|
| Firebase | Authentication & Database |
| Razorpay | Payment Gateway |
| N8N | AI Chatbot Platform |
| Google Sheets API | Order Logging |
| Express.js | Backend Server |
| Render | Backend Hosting |

### **State Management & Forms**

| Library | Purpose |
|---------|---------|
| React Context API | Global State |
| React Hook Form | Form Handling |
| Zod | Schema Validation |

### **Development Tools**

| Tool | Purpose |
|------|---------|
| ESLint | Code Linting |
| TypeScript ESLint | TS Linting |
| PostCSS | CSS Processing |
| Autoprefixer | CSS Compatibility |

---

## 📁 Project Structure

```
bengal-bay-restaurant/
├── src/
│   ├── components/
│   │   ├── about/          # About page components
│   │   ├── admin/          # Admin dashboard
│   │   ├── cart/           # Shopping cart
│   │   ├── chat/           # AI Chatbot
│   │   ├── checkout/       # Payment & checkout
│   │   ├── common/         # Reusable components
│   │   ├── gallery/        # Image gallery
│   │   ├── home/           # Homepage components
│   │   ├── layout/         # Navbar, Footer
│   │   ├── menu/           # Menu & dishes
│   │   └── user/           # User profile
│   ├── contexts/           # React Context providers
│   ├── lib/                # Utilities & configs
│   ├── pages/              # Page components
│   ├── utils/              # Helper functions
│   └── App.tsx             # Main app component
├── backend/
│   └── server/             # Express backend
├── public/                 # Static assets
└── dist/                   # Production build
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Razorpay account
- N8N account (for chatbot)
- Google Cloud account (for Sheets API)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bengal-bay-restaurant.git
cd bengal-bay-restaurant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your credentials (see [Environment Variables](#-environment-variables))

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

6. **Preview production build**
```bash
npm run preview
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
# Razorpay
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Backend
VITE_BACKEND_URL=your_backend_url

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Sheets
VITE_GOOGLE_SHEETS_PRIVATE_KEY=your_google_sheets_private_key
VITE_GOOGLE_SHEETS_CLIENT_EMAIL=your_google_sheets_client_email
VITE_GOOGLE_SHEET_ID=your_google_sheet_id

# N8N Chatbot
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

### Backend (backend/server/.env)
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=5000
FRONTEND_URL=*
GOOGLE_SHEETS_PRIVATE_KEY=your_google_sheets_private_key
GOOGLE_SHEETS_CLIENT_EMAIL=your_google_sheets_client_email
GOOGLE_SHEET_ID=your_google_sheet_id
```

---

## 🎯 Key Implementations

### 1. **AI Chatbot Integration**
- **Platform**: N8N Cloud
- **Features**: 
  - Floating widget with waving animation
  - Context-aware responses
  - Auto-hide on sensitive pages (checkout/cart)
  - Mobile-optimized interface
  - Session persistence
- **Implementation**: Custom React component with route-based visibility control

### 2. **Payment System**
- **Razorpay Integration**:
  - Multiple payment methods (Cards, UPI, Wallets, Net Banking)
  - Test & production mode support
  - Payment verification
  - Error handling & retry logic
  - Mobile-friendly payment flow

- **Cash on Delivery**:
  - 7-digit OTP generation
  - Email confirmation with OTP
  - Delivery verification system
  - Order tracking

### 3. **Mobile Crash Prevention**
- Implemented safe state management
- Added cleanup on component unmount
- Timeout-based state updates
- Error boundaries
- Graceful error handling without alerts
- Memory leak prevention

### 4. **Address Management**
- Real-time geolocation detection
- OpenStreetMap reverse geocoding
- Multi-address support
- Address type selection (Home/Work)
- Mobile-responsive forms with scrolling

### 5. **Order Management**
- Google Sheets integration for order logging
- Real-time order tracking
- Email notifications
- Order history
- Receipt generation

---

## 💳 Payment Integration

### Razorpay Setup
```typescript
// Payment initialization
const options = {
  key: RAZORPAY_KEY_ID,
  amount: amount * 100, // in paise
  currency: "INR",
  name: "Bengal Bay",
  description: "Food Order Payment",
  handler: function(response) {
    // Payment success handling
  },
  modal: {
    ondismiss: function() {
      // Handle modal close
    }
  }
};
```

### COD Implementation
- OTP generation for delivery verification
- Email confirmation with order details
- Google Sheets logging
- Order status tracking

---

## 🤖 AI Chatbot

### N8N Integration
```typescript
createChat({
  webhookUrl: 'your_n8n_webhook_url',
  mode: 'window',
  showWelcomeScreen: true,
  initialMessages: [
    'Hi there! 👋',
    'I\'m your AI assistant. How can I help you today?'
  ]
});
```

### Features
- ✅ Natural language processing
- ✅ Menu inquiries
- ✅ Order assistance
- ✅ Reservation help
- ✅ Context-aware responses
- ✅ Session management

---

## 📸 Screenshots

### 🌐 Live Demo
**[View Live Site →](https://nil-s-kitchen.vercel.app/)**

### Desktop View
![Desktop Homepage](https://nil-s-kitchen.vercel.app/)
![Menu Page](https://nil-s-kitchen.vercel.app/menu)
![Checkout Page](https://nil-s-kitchen.vercel.app/checkout)

### Mobile View
![Mobile Homepage](https://nil-s-kitchen.vercel.app/)
![Mobile Menu](https://nil-s-kitchen.vercel.app/menu)
![Mobile Cart](https://nil-s-kitchen.vercel.app/checkout)

### Admin Dashboard
![Admin Panel](https://nil-s-kitchen.vercel.app/admin)
![Order Management](https://nil-s-kitchen.vercel.app/admin/orders)

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🌟 Performance Optimizations

- ✅ Lazy loading of routes
- ✅ Image optimization
- ✅ Code splitting
- ✅ Memoization of expensive computations
- ✅ Debounced search
- ✅ Optimized re-renders
- ✅ Service worker for caching

---

## 🐛 Known Issues & Solutions

### Mobile Browser Crashes
**Solution**: Implemented safe state management with cleanup handlers and timeout-based updates

### Payment Modal Issues
**Solution**: Added error boundaries and graceful fallback mechanisms

### Geolocation Errors
**Solution**: Fallback to manual address entry with user-friendly error messages

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@Nilimesh](https://github.com/nil1902)
- LinkedIn: [My Linkedin](https://www.linkedin.com/in/nilimesh-pal-3882ab162/)
- Email: nilimeshpal15@gmail.com
- Portfolio: [My Portfolio](https://nilimesh-portfolio.vercel.app/)
---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Razorpay](https://razorpay.com/)
- [N8N](https://n8n.io/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Nilimesh, Soumik & Rohit]

</div>
