
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.community": "Community",
      "nav.blog": "Blog",
      "nav.tests": "Tests",
      "nav.feedback": "Feedback",
      "nav.about": "About",
      "nav.profile": "Profile",
      "nav.journal": "Journal",
      "nav.mySessions": "My Sessions",
      "nav.psychologistDashboard": "Psychologist Dashboard",
      
      // Auth
      "auth.signIn": "Sign In",
      "auth.signUp": "Sign Up",
      "auth.signOut": "Sign Out",
      
      // Header
      "header.home": "Home",
      "header.journal": "Journal", 
      "header.psychTests": "Psych Tests",
      "header.community": "Community",
      "header.blog": "Blog",
      "header.feedback": "Feedback",
      "header.about": "About",
      "header.profile": "Profile",
      "header.signOut": "Sign out",
      "header.signIn": "Sign in",
      "header.lightMode": "Light Mode",
      "header.darkMode": "Dark Mode",
      "header.menu": "Menu",
      
      // Features Section
      "features.title": "Comprehensive Mental Health Support",
      "features.subtitle": "Discover our range of AI-powered tools designed to support your mental wellness journey",
      "features.moodTracking.title": "Mood Tracking",
      "features.moodTracking.description": "Track your daily emotions and identify patterns in your mental health journey",
      "features.appointments.title": "Therapy Sessions",
      "features.appointments.description": "Book and manage appointments with qualified mental health professionals",
      "features.resources.title": "Resource Library",
      "features.resources.description": "Access a comprehensive collection of mental health resources and educational content",
      "features.community.title": "Community Support",
      "features.community.description": "Connect with others on similar journeys in a safe, supportive environment",
      "features.crisis.title": "Crisis Support",
      "features.crisis.description": "24/7 emergency support and resources for mental health crises",
      
      // Chat Interface
      "chat.title": "Chat with Chetna",
      "chat.subtitle": "Your AI companion for mental wellness support and guidance",
      "chat.clearChat": "Clear Chat",
      "chat.placeholder": "Type your message here...",
      "chat.placeholderTyping": "Chetna is typing...",
      "chat.placeholderSignup": "Sign up to continue chatting...",
      "chat.listening": "Listening...",
      "chat.speakClearly": "Speak clearly into your microphone",
      "chat.speechError": "Speech recognition error",
      "chat.welcomeMessage": "Hi there! I'm Chetna, your mental wellness companion. How are you feeling today?",
      "chat.personalizedWelcome": "Hi {{name}}! I'm Chetna, your mental wellness companion. I've reviewed your recent assessment results and I'm here to provide personalized support based on your mental health profile. How are you feeling today?",
      "chat.personalizedActive": "✨ Personalized Support Active",
      "chat.personalizedDescription": "Chetna is tailoring responses based on your {{count}} recent assessment",
      "chat.personalizedDescriptionPlural": "Chetna is tailoring responses based on your {{count}} recent assessments",
      "chat.messageLimit": "Message {{current}}/{{max}} - Sign up to continue chatting after limit is reached",
      "chat.limitReached": "You've reached the message limit",
      "chat.signupPrompt": "Please sign up to continue chatting with Chetna",
      "chat.signupNow": "Sign up now",
      
      // Intro Section
      "intro.chatWithChetna": "Chat with Chetna",
      "intro.community": "Community",
      "intro.chetnaQuest": "Chetna Quest",
      
      // Language Selector
      "language.english": "English",
      "language.hindi": "हिन्दी", 
      "language.gujarati": "ગુજરાતી",
      "language.select": "Language"
    }
  },
  hi: {
    translation: {
      // Navigation
      "nav.home": "होम",
      "nav.community": "समुदाय",
      "nav.blog": "ब्लॉग",
      "nav.tests": "परीक्षण",
      "nav.feedback": "फीडबैक",
      "nav.about": "हमारे बारे में",
      "nav.profile": "प्रोफाइल",
      "nav.journal": "जर्नल",
      "nav.mySessions": "मेरे सत्र",
      "nav.psychologistDashboard": "मनोवैज्ञानिक डैशबोर्ड",
      
      // Auth
      "auth.signIn": "साइन इन",
      "auth.signUp": "साइन अप",
      "auth.signOut": "साइन आउट",
      
      // Header
      "header.home": "होम",
      "header.journal": "जर्नल",
      "header.psychTests": "मानसिक परीक्षण",
      "header.community": "समुदाय",
      "header.blog": "ब्लॉग",
      "header.feedback": "फीडबैक",
      "header.about": "हमारे बारे में",
      "header.profile": "प्रोफाइल",
      "header.signOut": "साइन आउट",
      "header.signIn": "साइन इन",
      "header.lightMode": "लाइट मोड",
      "header.darkMode": "डार्क मोड",
      "header.menu": "मेन्यू",
      
      // Features Section
      "features.title": "व्यापक मानसिक स्वास्थ्य सहायता",
      "features.subtitle": "आपकी मानसिक कल्याण यात्रा का समर्थन करने के लिए डिज़ाइन किए गए हमारे AI-संचालित उपकरणों की खोज करें",
      "features.moodTracking.title": "मूड ट्रैकिंग",
      "features.moodTracking.description": "अपनी दैनिक भावनाओं को ट्रैक करें और अपनी मानसिक स्वास्थ्य यात्रा में पैटर्न की पहचान करें",
      "features.appointments.title": "थेरेपी सत्र",
      "features.appointments.description": "योग्य मानसिक स्वास्थ्य पेशेवरों के साथ अपॉइंटमेंट बुक करें और प्रबंधित करें",
      "features.resources.title": "संसाधन पुस्तकालय",
      "features.resources.description": "मानसिक स्वास्थ्य संसाधनों और शैक्षिक सामग्री के व्यापक संग्रह तक पहुंच प्राप्त करें",
      "features.community.title": "सामुदायिक सहायता",
      "features.community.description": "एक सुरक्षित, सहायक वातावरण में समान यात्राओं पर दूसरों से जुड़ें",
      "features.crisis.title": "संकट सहायता",
      "features.crisis.description": "मानसिक स्वास्थ्य संकटों के लिए 24/7 आपातकालीन सहायता और संसाधन",
      
      // Chat Interface
      "chat.title": "चेतना से चैट करें",
      "chat.subtitle": "मानसिक कल्याण सहायता और मार्गदर्शन के लिए आपकी AI साथी",
      "chat.clearChat": "चैट साफ़ करें",
      "chat.placeholder": "यहाँ अपना संदेश टाइप करें...",
      "chat.placeholderTyping": "चेतना टाइप कर रही है...",
      "chat.placeholderSignup": "चैटिंग जारी रखने के लिए साइन अप करें...",
      "chat.listening": "सुन रहा है...",
      "chat.speakClearly": "अपने माइक्रोफोन में स्पष्ट रूप से बोलें",
      "chat.speechError": "वाक् पहचान त्रुटि",
      "chat.welcomeMessage": "नमस्ते! मैं चेतना हूं, आपकी मानसिक कल्याण साथी। आज आप कैसा महसूस कर रहे हैं?",
      "chat.personalizedWelcome": "नमस्ते {{name}}! मैं चेतना हूं, आपकी मानसिक कल्याण साथी। मैंने आपके हाल के मूल्यांकन परिणामों की समीक्षा की है और आपकी मानसिक स्वास्थ्य प्रोफाइल के आधार पर व्यक्तिगत सहायता प्रदान करने के लिए यहां हूं। आज आप कैसा महसूस कर रहे हैं?",
      "chat.personalizedActive": "✨ व्यक्तिगत सहायता सक्रिय",
      "chat.personalizedDescription": "चेतना आपके {{count}} हाल के मूल्यांकन के आधार पर प्रतिक्रियाओं को अनुकूलित कर रही है",
      "chat.personalizedDescriptionPlural": "चेतना आपके {{count}} हाल के मूल्यांकनों के आधार पर प्रतिक्रियाओं को अनुकूलित कर रही है",
      "chat.messageLimit": "संदेश {{current}}/{{max}} - सीमा पूरी होने के बाद चैटिंग जारी रखने के लिए साइन अप करें",
      "chat.limitReached": "आपने संदेश सीमा पूरी कर ली है",
      "chat.signupPrompt": "कृपया चेतना के साथ चैटिंग जारी रखने के लिए साइन अप करें",
      "chat.signupNow": "अभी साइन अप करें",
      
      // Intro Section
      "intro.chatWithChetna": "चेतना से चैट करें",
      "intro.community": "समुदाय",
      "intro.chetnaQuest": "चेतना क्वेस्ट",
      
      // Language Selector
      "language.english": "English",
      "language.hindi": "हिन्दी",
      "language.gujarati": "ગુજરાતી", 
      "language.select": "भाषा"
    }
  },
  gu: {
    translation: {
      // Navigation
      "nav.home": "ઘર",
      "nav.community": "સમુદાય",
      "nav.blog": "બ્લોગ",
      "nav.tests": "પરીક્ષાઓ",
      "nav.feedback": "પ્રતિસાદ",
      "nav.about": "અમારા વિશે",
      "nav.profile": "પ્રોફાઇલ",
      "nav.journal": "જર્નલ",
      "nav.mySessions": "મારા સત્રો",
      "nav.psychologistDashboard": "મનોવૈજ્ઞાનિક ડેશબોર્ડ",
      
      // Auth
      "auth.signIn": "સાઇન ઇન",
      "auth.signUp": "સાઇન અપ",
      "auth.signOut": "સાઇન આઉટ",
      
      // Header
      "header.home": "ઘર",
      "header.journal": "જર્નલ",
      "header.psychTests": "માનસિક પરીક્ષાઓ",
      "header.community": "સમુદાય",
      "header.blog": "બ્લોગ",
      "header.feedback": "પ્રતિસાદ",
      "header.about": "અમારા વિશે",
      "header.profile": "પ્રોફાઇલ",
      "header.signOut": "સાઇન આઉટ",
      "header.signIn": "સાઇન ઇન",
      "header.lightMode": "લાઇટ મોડ",
      "header.darkMode": "ડાર્ક મોડ", 
      "header.menu": "મેન્યુ",
      
      // Features Section
      "features.title": "વ્યાપક માનસિક સ્વાસ્થ્ય સહાય",
      "features.subtitle": "તમારી માનસિક કલ્યાણ યાત્રાને સમર્થન આપવા માટે ડિઝાઇન કરેલા અમારા AI-સંચાલિત સાધનોની શોધ કરો",
      "features.moodTracking.title": "મૂડ ટ્રૅકિંગ",
      "features.moodTracking.description": "તમારી દૈનિક લાગણીઓને ટ્રૅક કરો અને તમારી માનસિક સ્વાસ્થ્ય યાત્રામાં પેટર્નની ઓળખ કરો",
      "features.appointments.title": "થેરાપી સત્રો",
      "features.appointments.description": "લાયક માનસિક સ્વાસ્થ્ય વ્યાવસાયિકો સાથે એપોઇન્ટમેન્ટ બુક કરો અને મેનેજ કરો",
      "features.resources.title": "સંસાધન લાઇબ્રેરી",
      "features.resources.description": "માનસિક સ્વાસ્થ્ય સંસાધનો અને શૈક્ષણિક સામગ્રીના વ્યાપક સંગ્રહને ઍક્સેસ કરો",
      "features.community.title": "સામુદાયિક સહાય",
      "features.community.description": "સુરક્ષિત, સહાયક વાતાવરણમાં સમાન યાત્રાઓ પર અન્ય લોકો સાથે જોડાઓ",
      "features.crisis.title": "કટોકટી સહાય",
      "features.crisis.description": "માનસિક સ્વાસ્થ્ય કટોકટી માટે 24/7 આપાતકાલીન સહાય અને સંસાધનો",
      
      // Chat Interface
      "chat.title": "ચેતના સાથે ચેટ કરો",
      "chat.subtitle": "માનસિક કલ્યાણ સહાય અને માર્ગદર્શન માટે તમારી AI સાથી",
      "chat.clearChat": "ચેટ સાફ કરો",
      "chat.placeholder": "અહીં તમારો સંદેશ ટાઇપ કરો...",
      "chat.placeholderTyping": "ચેતના ટાઇપ કરી રહી છે...",
      "chat.placeholderSignup": "ચેટિંગ ચાલુ રાખવા માટે સાઇન અપ કરો...",
      "chat.listening": "સાંભળી રહ્યું છે...",
      "chat.speakClearly": "તમારા માઇક્રોફોનમાં સ્પષ્ટ રીતે બોલો",
      "chat.speechError": "વાણી ઓળખ ભૂલ",
      "chat.welcomeMessage": "નમસ્તે! હું ચેતના છું, તમારી માનસિક કલ્યાણ સાથી. આજે તમે કેવું અનુભવો છો?",
      "chat.personalizedWelcome": "નમસ્તે {{name}}! હું ચેતના છું, તમારી માનસિક કલ્યાણ સાથી. મેં તમારા તાજેતરના મૂલ્યાંકન પરિણામોની સમીક્ષા કરી છે અને તમારી માનસિક સ્વાસ્થ્ય પ્રોફાઇલના આધારે વ્યક્તિગત સહાય પ્રદાન કરવા અહીં છું. આજે તમે કેવું અનુભવો છો?",
      "chat.personalizedActive": "✨ વ્યક્તિગત સહાય સક્રિય",
      "chat.personalizedDescription": "ચેતના તમારા {{count}} તાજેતરના મૂલ્યાંકનના આધારે પ્રતિસાદોને અનુકૂલિત કરી રહી છે",
      "chat.personalizedDescriptionPlural": "ચેતના તમારા {{count}} તાજેતરના મૂલ્યાંકનોના આધારે પ્રતિસાદોને અનુકૂલિત કરી રહી છે",
      "chat.messageLimit": "સંદેશ {{current}}/{{max}} - મર્યાદા પૂર્ણ થયા પછી ચેટિંગ ચાલુ રાખવા માટે સાઇન અપ કરો",
      "chat.limitReached": "તમે સંદેશ મર્યાદા પૂર્ણ કરી છે",
      "chat.signupPrompt": "કૃપા કરીને ચેતના સાથે ચેટિંગ ચાલુ રાખવા માટે સાઇન અપ કરો",
      "chat.signupNow": "હવે સાઇન અપ કરો",
      
      // Intro Section
      "intro.chatWithChetna": "ચેતના સાથે ચેટ કરો",
      "intro.community": "સમુદાય",
      "intro.chetnaQuest": "ચેતના ક્વેસ્ટ",
      
      // Language Selector
      "language.english": "English",
      "language.hindi": "हिन्दी",
      "language.gujarati": "ગુજરાતી",
      "language.select": "ભાષા"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
