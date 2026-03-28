import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to SmartGov Assist",
      "smartGovAssist": "SmartGov Assist",
      "tagline": "Your one-stop platform for AI-powered government scheme tracking and eligibility checking.",
      "find_schemes": "Find Schemes",
      "check_eligibility": "Check Eligibility",
      "dashboard": "Dashboard",
      "schemes": "Schemes",
      "profile": "Profile",
      "admin_panel": "Admin Panel",
      "search_placeholder": "Search schemes by name or keywords...",
      "hero_title": "Discover Your Benefits with AI",
      "hero_subtitle": "Empowering citizens to access government incentives seamlessly through intelligent matching and tracking.",
      "get_started": "Get Started",
      "learn_more": "Learn More"
    }
  },
  hi: {
    translation: {
      "welcome": "SmartGov Assist में आपका स्वागत है",
      "smartGovAssist": "स्मार्टगव असिस्ट",
      "tagline": "एआई-आधारित सरकारी योजना ट्रैकिंग और पात्रता जांच के लिए आपका वन-स्टॉप प्लेटफॉर्म।",
      "find_schemes": "योजनाएं खोजें",
      "check_eligibility": "पात्रता जांचें",
      "dashboard": "डैशबोर्ड",
      "schemes": "योजनाएं",
      "profile": "प्रोफ़ाइल",
      "admin_panel": "एडमिन पैनल",
      "search_placeholder": "नाम या कीवर्ड द्वारा योजनाएं खोजें...",
      "hero_title": "एआई के साथ अपने लाभ खोजें",
      "hero_subtitle": "बुद्धिमान मिलान और ट्रैकिंग के माध्यम से सरकारी प्रोत्साहन तक निर्बाध रूप से पहुंचने के लिए नागरिकों को सशक्त बनाना।",
      "get_started": "शुरू करें",
      "learn_more": "अधिक जानें"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
