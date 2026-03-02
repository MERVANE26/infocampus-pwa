#!/bin/bash
# Quick Setup Guide for InfoCampus PWA Refactoring

echo "🚀 InfoCampus PWA - Quick Setup"
echo "================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check for new i18n dependencies
echo ""
echo "📝 Installing i18n packages..."
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend

# List created files
echo ""
echo "📁 New Files & Directories:"
echo "  ✅ src/i18n.js"
echo "  ✅ src/locales/en.json"
echo "  ✅ src/locales/fr.json"
echo "  ✅ src/hooks/useAutoRefresh.js"
echo "  ✅ src/composants/LanguageSwitcher.jsx"
echo "  ✅ src/composants/LanguageSwitcher.module.css"
echo "  ✅ src/pages/AccessDenied.jsx"
echo "  ✅ src/pages/AccessDenied.module.css"

echo ""
echo "📝 Modified Files:"
echo "  ✅ src/App.jsx"
echo "  ✅ src/index.js"
echo "  ✅ src/pages/Connexion.jsx"
echo "  ✅ src/pages/Connexion.module.css"
echo "  ✅ src/pages/Publication.jsx"
echo "  ✅ src/pages/Publication.module.css"
echo "  ✅ src/context/AuthContext.jsx"
echo "  ✅ src/composants/AppNavbar.jsx"
echo "  ✅ package.json"

echo ""
echo "🎯 Next Steps:"
echo "1. npm install (if not already done)"
echo "2. npm start (start development server)"
echo "3. Test the app at http://localhost:3000"
echo ""
echo "🌐 Test Features:"
echo "  • Language switching (top right)"
echo "  • Login with credentials"
echo "  • Access publications page (teachers/admins only)"
echo "  • Check auto-refresh on publications"
echo "  • Test comments with real-time updates"
echo ""
echo "✨ All refactoring complete!"
