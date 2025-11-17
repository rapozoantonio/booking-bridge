# 🏨 Booking Bridge

**The open-source link hub designed specifically for hospitality businesses.**

Connect your guests to all your booking platforms, social media, and services in one beautiful page. Perfect for Airbnbs, hotels, restaurants, cafes, and venues.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.6.0-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Features

### 🔗 **Unified Link Hub**
- Consolidate all your booking platforms (Airbnb, Booking.com, Vrbo, etc.)
- Add social media links (Instagram, Facebook, TikTok, etc.)
- Include support and experience links (tours, transportation, FAQs)
- Fully customizable sections with drag-and-drop ordering

### 🎨 **Beautiful Customization**
- Custom color schemes with gradient support
- Multiple link button styles (rounded, pill, square, outline)
- Font and text color customization
- Real-time preview of your changes
- Mobile-first responsive design

### 📊 **Analytics & Insights**
- Track link clicks in real-time
- Monitor performance per platform
- Understand guest engagement
- Export analytics data (coming soon)

### 🚀 **Production Ready**
- Fast loading with optimized performance
- SEO-friendly with meta tags
- Accessible with ARIA labels
- Cross-browser compatible
- Mobile responsive

### 🔒 **Secure & Reliable**
- Firebase Authentication
- Firestore database with security rules
- HTTPS by default
- Data privacy compliant

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Firebase project ([Create one here](https://console.firebase.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rapozoantonio/booking-bridge.git
   cd booking-bridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**

   Create a `.env` file in the root directory with your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

   See `.env.example` for a template.

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will automatically open in your browser at [http://localhost:5173](http://localhost:5173)

---

## 📖 Usage

### Creating Your First Place

1. **Sign up** for a free account
2. Click **"Add New Place"** from your dashboard
3. Fill in your business details:
   - Name, description, and location
   - Choose your color scheme
   - Add booking platform links
   - Add social media links
   - Customize button styles
4. **Save** and share your public link!

### Customization Options

#### Basic Information
- **Place Name**: Your business name
- **Bio**: Short description (160 characters)
- **Description**: Detailed information about your business
- **Location**: Address with optional Google Maps link

#### Style & Branding
- **Primary Color**: Main brand color
- **Background Color**: Page background
- **Font Color**: Text color throughout the page
- **Button Text Color**: Color for button text
- **Link Style**: Choose from rounded, pill, square, or outline

#### Link Management
- **Booking Links**: Airbnb, Booking.com, Vrbo, OpenTable, etc.
- **Social Links**: Instagram, Facebook, TikTok, YouTube, etc.
- **Support Links**: Tours, transportation, customer support, FAQs
- Toggle visibility for each section
- Custom display names for each link
- Show/hide icons per link

---

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with Vite 6.3.0
- **Routing**: React Router DOM 7.5.0
- **Styling**: Tailwind CSS 4.1.4
- **Icons**: Lucide React 0.507.0
- **Backend**: Firebase 11.6.0
  - Authentication (Email/Password)
  - Cloud Firestore (Database)
  - Cloud Storage (Future)
  - Analytics
- **Build Tool**: Vite for fast development and optimized production builds

---

## 📁 Project Structure

```
booking-bridge/
├── src/
│   ├── components/
│   │   ├── place-editor/       # Modular place editor components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── Footer.jsx          # Footer component
│   │   ├── PlaceCard.jsx       # Dashboard place card
│   │   └── ProtectedRoute.jsx  # Route authentication
│   ├── pages/
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── Dashboard.jsx       # User dashboard
│   │   ├── PlaceEditor.jsx     # Create/edit places
│   │   ├── ProfilePage.jsx     # Public profile view
│   │   ├── Login.jsx           # Authentication
│   │   ├── Register.jsx        # User registration
│   │   └── NotFound.jsx        # 404 page
│   ├── hooks/
│   │   └── useAuth.js          # Firebase auth hook
│   ├── firebase.js             # Firebase configuration
│   ├── App.jsx                 # Main app component
│   └── index.jsx               # Entry point
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── package.json                # Dependencies
└── vite.config.js              # Vite configuration
```

---

## 🌐 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

4. **Build your app**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy
   ```

### Deploy to Other Platforms

- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag and drop your `dist` folder or connect via Git
- **AWS Amplify**: Follow the Amplify hosting guide

---

## 🔐 Firebase Security

### Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Places collection
    match /places/{placeId} {
      // Anyone can read active places
      allow read: if resource.data.isActive == true || request.auth.uid == resource.data.userId;
      // Only the owner can write
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Keep components small and focused

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please [open an issue](https://github.com/rapozoantonio/booking-bridge/issues) with:

- **Bug reports**: Steps to reproduce, expected vs. actual behavior, screenshots
- **Feature requests**: Use case, proposed solution, alternatives considered

---

## 📝 Roadmap

### Current Version (v0.1.0)
- ✅ User authentication
- ✅ Place management (CRUD)
- ✅ Link customization
- ✅ Analytics tracking
- ✅ Modern UI/UX
- ✅ Mobile responsive

### v0.2.0 (Current)
- ✅ Analytics dashboard with charts
- ✅ QR code generation
- ✅ Advanced analytics tracking (subcollections)
- ✅ Bulk import/export
- ✅ Email collection widgets
- ✅ Error boundaries
- ✅ Input sanitization (XSS protection)
- ✅ URL validation
- ✅ Optimized bundle size (74% reduction)

### Future (v1.0.0)
- [ ] Custom domain support (full implementation)
- [ ] Image upload for places
- [ ] Multiple language support
- [ ] Team collaboration
- [ ] White-label option
- [ ] API access

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for the hospitality community
- Inspired by Linktree and Bento
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

## 📧 Contact

- **Project Link**: [https://github.com/rapozoantonio/booking-bridge](https://github.com/rapozoantonio/booking-bridge)
- **Issues**: [https://github.com/rapozoantonio/booking-bridge/issues](https://github.com/rapozoantonio/booking-bridge/issues)

---

## 💝 Support the Project

If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📢 Sharing with others in the hospitality industry
- 🤝 Contributing code

---

**Made with ❤️ for the hospitality community**

