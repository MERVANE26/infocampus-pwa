# InfoCampus PWA - Implementation Guide

## ✅ Completed Improvements

### 1. **Internationalization (i18n) - English & French Translation**
- **Files Created:**
  - `/src/i18n.js` - i18n configuration file
  - `/src/locales/en.json` - English translations
  - `/src/locales/fr.json` - French translations
  - `/src/composants/LanguageSwitcher.jsx` - Language switcher component
  - `/src/composants/LanguageSwitcher.module.css` - Language switcher styles

- **Dependencies Added:** `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- **Usage:** Import `useTranslation()` hook in components and use `t('key')` for translations
- **Features:** 
  - Automatic language detection based on browser language
  - Manual language switching via dropdown in navbar
  - Persistent language preference in localStorage

### 2. **Role-Based Access Control**
- **Implementation:** Modified `App.jsx` to add `RoleRestrictedRoute` component
- **Publication Page:** Now restricted to teachers and admins only
- **Access Denied Page:** Created `/src/pages/AccessDenied.jsx` for unauthorized access
- **User Model Reference:** Based on provided User schema with roles validation

### 3. **Auto-Refresh Data for Comments & Reactions**
- **Files Created:**
  - `/src/hooks/useAutoRefresh.js` - Custom hook for auto-refreshing data
  - Includes `useAutoRefresh` and `useOptimisticUpdate` hooks

- **Features:**
  - Auto-refresh publications every 30 seconds
  - Auto-refresh comments every 3 seconds when expanded
  - Optimistic UI updates for instant feedback
  - Configurable intervals and dependencies

### 4. **Publication Page Refactoring**
- **Modern Social Media Design:**
  - Facebook/Twitter-like layout
  - Clean card-based design with hover effects
  - Pagination and filtering system
  - Search functionality
  - Real-time engagement stats

- **Features:**
  - Reaction buttons (like/dislike) with optimistic updates
  - Comment system with auto-refresh
  - Attachment display
  - User profile sidebar
  - Responsive grid layout

- **Mobile-First Design:**
  - Responsive breakpoints: 1200px, 992px, 768px, 480px
  - Touch-friendly interface
  - Optimized spacing and typography for mobile

### 5. **Login Page Refactoring**
- **Modern Design:**
  - Side-by-side layout (features on left, form on right)
  - Glassmorphism effects
  - Smooth animations
  - Professional gradient background

- **Features:**
  - Email field with icon
  - Password field with show/hide toggle
  - Remember me checkbox
  - Form validation
  - Error handling with i18n messages
  - Responsive design for all screen sizes

### 6. **Enhanced Navigation Bar**
- **Updates:**
  - Language switcher integrated
  - i18n support for all menu items
  - Improved responsive design
  - User profile dropdown with avatar initials
  - Smooth transitions and hover effects

### 7. **Enhanced Authentication Context**
- **Features:**
  - Centralized auth state management
  - Role checking methods (`hasRole`, `isTeacherOrAdmin`)
  - Token validation
  - Automatic logout on token expiry
  - User data persistence in localStorage

---

## 📦 Installation Instructions

### 1. Install New Dependencies
```bash
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```

### 2. Environment Setup
Make sure your `.env` or `vite.config.js` has:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Update `index.js`
The i18n is now automatically imported in `index.js`. No additional setup needed.

---

## 🎨 Styling & Design

### Color Scheme (Preserved Old Colors)
- **Primary:** `#667eea` (Purple-blue)
- **Secondary:** `#764ba2` (Deep purple)
- **Background:** Gradients using these colors
- **Text:** `#1e293b` (Dark), `#64748b` (Gray)

### Key CSS Features
- **Mobile-First Approach:** Base styles for mobile, then media queries for larger screens
- **Responsive Breakpoints:**
  - `max-width: 480px` - Mobile
  - `max-width: 768px` - Tablet
  - `max-width: 992px` - Small Desktop
  - `max-width: 1200px` - Desktop

### Custom Scrollbars
Modern scrollbar styling applied across the application (webkit-scrollbar)

---

## 🔄 Auto-Refresh Behavior

### Publication Feed
- Refreshes every 30 seconds
- Triggered only when component is mounted
- Can be disabled by setting `enabled` prop to false

### Comments Section
- Refreshes every 3 seconds when expanded
- Only active when a publication is expanded
- Stops refreshing when section is collapsed
- Shows loading spinner while fetching

### Reactions
- Optimistic update (immediate UI change)
- API call sent in background
- Automatically reloads on error

---

## 📱 Mobile-First Features

### Responsive Design
- **Navbar:** Hamburger menu on mobile, full menu on desktop
- **Publication Card:** Stacked layout on mobile, boxed layout on desktop
- **Comments:** Scrollable list with responsive sizing
- **Action Buttons:** Full width on mobile, flex layout on desktop

### Touch Friendly
- Larger touch targets (min 48px)
- Optimized spacing for thumb navigation
- Optimized font sizes for readability

---

## 🌍 Translation Usage

### In Components
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  
  return <button>{t('common.save')}</button>;
};
```

### Adding New Translations
1. Add keys to `/src/locales/en.json`
2. Add translations to `/src/locales/fr.json`
3. Use `t('namespace.key')` in components

### Translation Namespaces
- `common` - Common UI elements
- `auth` - Authentication pages
- `publication` - Publication feed
- `profile` - User profiles
- `errors` - Error messages
- `nav` - Navigation items

---

## ⚠️ Important Notes

### User Model Validation
The User model includes:
- `roles []` - Array of roles (student, teacher, admin)
- `status` - User status (must match a role)
- Student: requires `studentUniversityId`
- Teacher: requires `teacherUniversityIds` array
- Validation: `roles` should always contain `status`

### Publication Page Access
- **Restricted to:** Teachers and Admins only
- **Students:** Will see `AccessDenied` page
- **API Endpoint:** `/posts/all` with filtering by role

### Authentication State
- Token stored in `localStorage.token`
- User data stored in `localStorage.user` (JSON string)
- Set `localStorage.rememberEmail` for remember-me feature

---

## 📝 Next Steps for Full Implementation

### Still to Implement
1. **Profile Pages:**
   - Fetch real backend data for student/teacher/admin profiles
   - Display user-specific academic information
   - Allow profile editing with backend sync
   - Auto-update with real-time data

2. **Registration Page:**
   - Similar refactor to Connexion page
   - Role-specific form fields
   - File upload for profile picture
   - University/Campus selection

3. **Additional Features:**
   - Search and filtering optimization
   - Pagination implementation
   - File upload for post attachments
   - Post editing and deletion
   - Comment deletion and editing
   - User notifications system

### API Integration Checklist
- [ ] Test `/auth/login` endpoint
- [ ] Test `/posts/all` endpoint with filters
- [ ] Test `/posts/{id}/comment` endpoint
- [ ] Test `/posts/{id}/react` endpoint
- [ ] Verify role-based filtering works
- [ ] Test offline mode with cached data

---

## 🔧 Troubleshooting

### Missing LanguageSwitcher
If you see `Module not found` for LanguageSwitcher, make sure:
- File exists: `/src/composants/LanguageSwitcher.jsx`
- Import statement is correct in `AppNavbar.jsx`

### Translations Not Appearing
1. Check i18n.js is imported in index.js
2. Verify JSON key paths match in en.json and fr.json
3. Clear browser localStorage and reload

### Comments Not Auto-Refreshing
1. Verify API endpoint returns comments in correct format
2. Check browser console for API errors
3. Ensure comment._id is set correctly

---

## 📞 Support

For issues with:
- **Translations:** Check `/src/locales/` files
- **Styling:** Check CSS modules in respective page files
- **Routing:** Check `App.jsx` for route definitions
- **API Integration:** Check `/src/lib/api.js` and console errors

---

## 📚 File Structure Summary

```
src/
├── App.jsx (updated with AuthProvider and RoleRestrictedRoute)
├── index.js (added i18n import)
├── i18n.js (new - i18n configuration)
├── composants/
│   ├── AppNavbar.jsx (updated with LanguageSwitcher)
│   ├── LanguageSwitcher.jsx (new)
│   └── LanguageSwitcher.module.css (new)
├── context/
│   └── AuthContext.jsx (updated)
├── hooks/
│   └── useAutoRefresh.js (new)
├── locales/
│   ├── en.json (new)
│   └── fr.json (new)
├── pages/
│   ├── AccessDenied.jsx (new)
│   ├── AccessDenied.module.css (new)
│   ├── Connexion.jsx (refactored)
│   ├── Connexion.module.css (refactored)
│   ├── Publication.jsx (refactored)
│   └── Publication.module.css (refactored)
└── lib/
    └── api.js (enhanced)
```

---

Generated: March 2026
Version: 2.0 - Modern Refactor
