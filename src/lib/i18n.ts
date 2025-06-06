
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
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
      
      // Chat Interface
      "chat.title": "Chat with Chetna",
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
      
      // Chat Interface
      "chat.title": "चेतना से चैट करें",
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
      
      // Chat Interface
      "chat.title": "ચેતના સાથે ચેટ કરો",
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
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
