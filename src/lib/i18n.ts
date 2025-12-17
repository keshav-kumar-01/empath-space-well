
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
      "chat.connecting": "Connecting to Chetna AI...",
      "chat.basicMode": "Using basic response mode",
      "chat.connecting.success": "Chetna_AI connected",
      "chat.connecting.successDescription": "Advanced mental health AI assistant is now active",
      "chat.connecting.fallback": "Using basic responses",
      "chat.connecting.fallbackDescription": "AI model couldn't be loaded, using fallback mode",
      "chat.connecting.error": "There was an issue with the AI model",
      "chat.cleared": "Chat cleared",
      "chat.clearedDescription": "Your chat session has been automatically cleared for privacy",
      "chat.status.aiActive": "✅ AI Active",
      "chat.autoPlayOn": "Auto-play on",
      "chat.autoPlayOff": "Auto-play off",
      "chat.autoPlayOnDesc": "Dr. Chetna will speak responses aloud",
      "chat.autoPlayOffDesc": "Responses will not be spoken automatically",
      // Chat Response Templates (fallback responses when AI is not available)
      "chat.responses.hello1": "Hello! I'm Chetna, your mental wellness companion. How are you feeling today?",
      "chat.responses.hello2": "Hi there! I'm here to listen and support you. How has your day been so far?",
      "chat.responses.hello3": "Hey! I'm Chetna. I'm here to chat whenever you need support. How are you doing right now?",
      "chat.responses.hello4": "Greetings! I'm so glad you reached out today. Would you like to share how you're feeling?",
      "chat.responses.hello5": "Hello! It's wonderful to connect with you. I'm here to provide a safe space for you to express yourself.",
      
      "chat.responses.sad1": "I'm sorry to hear you're feeling this way. Would you like to talk about what's making you feel sad?",
      "chat.responses.sad2": "It's okay to feel sad sometimes. I'm here to listen if you'd like to share what's on your mind.",
      "chat.responses.sad3": "I understand that feeling down can be really difficult. What do you think might have triggered these feelings?",
      "chat.responses.sad4": "Your feelings are valid, and it takes courage to acknowledge sadness. Would talking about specific situations help you process these emotions?",
      "chat.responses.sad5": "Sadness is a natural part of life, but you don't have to face it alone. I'm here with you through this difficult time.",
      "chat.responses.sad6": "When we feel sad, it can sometimes feel like a heavy weight on our shoulders. I'm here to help lighten that burden by listening.",
      
      "chat.responses.anxiety1": "Anxiety can be really challenging. Would it help to talk through what's making you feel anxious?",
      "chat.responses.anxiety2": "I understand that anxiety can feel overwhelming. Have you tried any breathing exercises today?",
      "chat.responses.anxiety3": "When anxiety takes hold, it can feel like you're losing control. Let's take a moment together - try taking a slow, deep breath.",
      "chat.responses.anxiety4": "Your feelings of anxiety are valid, and I'm here to support you. Sometimes naming what we're afraid of can reduce its power over us.",
      "chat.responses.anxiety5": "Anxiety often makes us focus on the future. Let's try to bring your attention gently back to the present moment. What can you see around you right now?",
      "chat.responses.anxiety6": "The physical sensations of anxiety can be frightening, but they will pass. You're stronger than you realize in this moment.",
      "chat.responses.anxiety7": "It's normal to feel stressed sometimes. Can you identify what specific things are causing you to feel this way?",
      
      "chat.responses.default1": "I'm here to listen. Could you tell me more about how you're feeling?",
      "chat.responses.default2": "Thank you for sharing. Would you like to explore this further?",
      "chat.responses.default3": "I appreciate you opening up. How long have you been feeling this way?",
      "chat.responses.default4": "I'm here to support you. What do you think might help in this situation?",
      "chat.responses.default5": "That's interesting. How does that make you feel?",
      "chat.responses.default6": "I notice you have a lot on your mind. Which aspect feels most important to discuss right now?",
      "chat.responses.default7": "Sometimes putting feelings into words can help us understand them better. Is there more you'd like to share?",
      "chat.responses.default8": "I'm here with you through whatever you're experiencing. Would you like to tell me more?",
      "chat.responses.default9": "Your experiences and feelings matter. What else would you like to talk about today?",
      "chat.responses.default10": "I'm listening attentively. Is there a specific aspect of this situation that's troubling you the most?",
      
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
      "chat.connecting": "चेतना AI से जुड़ रहे हैं...",
      "chat.basicMode": "बेसिक रिस्पॉन्स मोड का उपयोग कर रहे हैं",
      "chat.connecting.success": "चेतना_AI जुड़ गया",
      "chat.connecting.successDescription": "उन्नत मानसिक स्वास्थ्य AI सहायक अब सक्रिय है",
      "chat.connecting.fallback": "बेसिक रिस्पॉन्स का उपयोग कर रहे हैं",
      "chat.connecting.fallbackDescription": "AI मॉडल लोड नहीं हो सका, फॉलबैक मोड का उपयोग कर रहे हैं",
      "chat.connecting.error": "AI मॉडल के साथ समस्या थी",
      "chat.cleared": "चैट साफ़ किया गया",
      "chat.clearedDescription": "गोपनीयता के लिए आपका चैट सत्र स्वचालित रूप से साफ़ कर दिया गया है",
      "chat.status.aiActive": "✅ AI सक्रिय",
      "chat.autoPlayOn": "ऑटो-प्ले चालू",
      "chat.autoPlayOff": "ऑटो-प्ले बंद",
      "chat.autoPlayOnDesc": "डॉ. चेतना जवाब बोलेंगी",
      "chat.autoPlayOffDesc": "जवाब स्वचालित रूप से नहीं बोले जाएंगे",
      // Chat Response Templates (fallback responses when AI is not available)
      "chat.responses.hello1": "नमस्ते! मैं चेतना हूं, आपकी मानसिक कल्याण साथी। आज आप कैसा महसूस कर रहे हैं?",
      "chat.responses.hello2": "नमस्ते! मैं यहां सुनने और आपका समर्थन करने के लिए हूं। आपका दिन कैसा रहा है?",
      "chat.responses.hello3": "हे! मैं चेतना हूं। जब भी आपको सहायता की आवश्यकता हो, मैं यहां चैट करने के लिए हूं। अभी आप कैसा महसूस कर रहे हैं?",
      "chat.responses.hello4": "नमस्कार! मैं बहुत खुश हूं कि आपने आज संपर्क किया। क्या आप साझा करना चाहेंगे कि आप कैसा महसूस कर रहे हैं?",
      "chat.responses.hello5": "नमस्ते! आपके साथ जुड़ना बहुत अच्छा है। मैं यहां आपको अपनी भावनाओं को व्यक्त करने के लिए एक सुरक्षित स्थान प्रदान करने के लिए हूं।",
      
      "chat.responses.sad1": "मुझे खुशी है कि आप इस तरह महसूस कर रहे हैं। क्या आप इस बारे में बात करना चाहेंगे कि आपको क्या दुखी कर रहा है?",
      "chat.responses.sad2": "कभी-कभी दुखी महसूस करना ठीक है। अगर आप साझा करना चाहते हैं कि आपके मन में क्या है तो मैं यहां सुनने के लिए हूं।",
      "chat.responses.sad3": "मैं समझ सकता हूं कि निराश महसूस करना वास्तव में कठिन हो सकता है। आपको क्या लगता है कि इन भावनाओं को क्या ट्रिगर किया है?",
      "chat.responses.sad4": "आपकी भावनाएं मान्य हैं, और उदासी को स्वीकार करने में साहस लगता है। क्या विशिष्ट स्थितियों के बारे में बात करना आपको इन भावनाओं को संसाधित करने में मदद करेगा?",
      "chat.responses.sad5": "उदासी जीवन का एक प्राकृतिक हिस्सा है, लेकिन आपको इसका सामना अकेले नहीं करना है। मैं इस कठिन समय में आपके साथ हूं।",
      "chat.responses.sad6": "जब हम दुखी महसूस करते हैं, तो यह कभी-कभी हमारे कंधों पर एक भारी वजन की तरह महसूस हो सकता है। मैं सुनकर उस बोझ को हल्का करने में मदद करने के लिए यहां हूं।",
      
      "chat.responses.default1": "मैं यहां सुनने के लिए हूं। क्या आप मुझे और बता सकते हैं कि आप कैसा महसूस कर रहे हैं?",
      "chat.responses.default2": "साझा करने के लिए धन्यवाद। क्या आप इसे और जानना चाहते हैं?",
      "chat.responses.default3": "मैं आपके खुलने की सराहना करता हूं। आप कब से इस तरह महसूस कर रहे हैं?",
      "chat.responses.default4": "मैं आपका समर्थन करने के लिए यहां हूं। आपको क्या लगता है कि इस स्थिति में क्या मदद मिल सकती है?",
      "chat.responses.default5": "यह दिलचस्प है। इससे आपको कैसा लगता है?",
      
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
      "chat.connecting": "ચેતના AI સાથે જોડાઈ રહ્યા છીએ...",
      "chat.basicMode": "બેસિક રિસ્પોન્સ મોડનો ઉપયોગ કરી રહ્યા છીએ",
      "chat.connecting.success": "ચેતના_AI જોડાઈ ગયું",
      "chat.connecting.successDescription": "ઉન્નત માનસિક સ્વાસ્થ્ય AI સહાયક હવે સક્રિય છે",
      "chat.connecting.fallback": "બેસિક રિસ્પોન્સનો ઉપયોગ કરી રહ્યા છીએ",
      "chat.connecting.fallbackDescription": "AI મોડેલ લોડ થઈ શકતું નથી, ફોલબેક મોડનો ઉપયોગ કરી રહ્યા છીએ",
      "chat.connecting.error": "AI મોડેલ સાથે સમસ્યા હતી",
      "chat.cleared": "ચેટ સાફ થઈ ગઈ",
      "chat.clearedDescription": "ગોપનીયતા માટે તમારું ચેટ સત્ર આપમેળે સાફ કરવામાં આવ્યું છે",
      "chat.status.aiActive": "✅ AI સક્રિય",
      "chat.autoPlayOn": "ઓટો-પ્લે ચાલુ",
      "chat.autoPlayOff": "ઓટો-પ્લે બંધ",
      "chat.autoPlayOnDesc": "ડૉ. ચેતના જવાબો બોલશે",
      "chat.autoPlayOffDesc": "જવાબો આપોઆપ બોલાશે નહીં",
      // Chat Response Templates (fallback responses when AI is not available)
      "chat.responses.hello1": "નમસ્તે! હું ચેતના છું, તમારી માનસિક કલ્યાણ સાથી. આજે તમે કેવું અનુભવો છો?",
      "chat.responses.hello2": "નમસ્તે! હું અહીં સાંભળવા અને તમારો ટેકો આપવા માટે છું. તમારો દિવસ કેવો રહ્યો?",
      "chat.responses.hello3": "હે! હું ચેતના છું. જ્યારે પણ તમને ટેકાની જરૂર હોય ત્યારે હું અહીં ચેટ કરવા માટે છું. હમણાં તમે કેવું અનુભવો છો?",
      "chat.responses.hello4": "નમસ્કાર! હું ખૂબ ખુશ છું કે તમે આજે સંપર્ક કર્યો. શું તમે શેર કરવા માંગો છો કે તમે કેવું અનુભવો છો?",
      "chat.responses.hello5": "નમસ્તે! તમારી સાથે જોડાવું બહુ સરસ છે. હું અહીં તમને તમારી લાગણીઓ વ્યક્ત કરવા માટે સુરક્ષિત સ્થાન પ્રદાન કરવા માટે છું.",
      
      "chat.responses.sad1": "મને દુ:ખ છે કે તમે આ રીતે અનુભવો છો. શું તમે આ વિશે વાત કરવા માંગો છો કે તમને શું દુ:ખી બનાવે છે?",
      "chat.responses.sad2": "ક્યારેક દુ:ખી લાગવું એ ઠીક છે. જો તમે શેર કરવા માંગો છો કે તમારા મનમાં શું છે તો હું અહીં સાંભળવા માટે છું.",
      "chat.responses.sad3": "હું સમજી શકું છું કે નિરાશ લાગવું ખરેખર મુશ્કેલ હોઈ શકે છે. તમને શું લાગે છે કે આ લાગણીઓને શું ટ્રિગર કર્યું છે?",
      "chat.responses.sad4": "તમારી લાગણીઓ માન્ય છે, અને ઉદાસીને સ્વીકારવામાં હિંમત લાગે છે. શું ચોક્કસ પરિસ્થિતિઓ વિશે વાત કરવી તમને આ લાગણીઓને પ્રોસેસ કરવામાં મદદ કરશે?",
      "chat.responses.sad5": "ઉદાસી એ જીવનનો કુદરતી ભાગ છે, પરંતુ તમારે તેનો સામનો એકલા કરવાની જરૂર નથી. હું આ મુશ્કેલ સમયમાં તમારી સાથે છું.",
      "chat.responses.sad6": "જ્યારે આપણે દુ:ખી અનુભવીએ છીએ, ત્યારે તે કેટલીકવાર આપણા ખભા પર ભારે વજનની જેમ લાગે છે. હું સાંભળીને તે બોજ હળવો કરવામાં મદદ કરવા માટે અહીં છું.",
      
      "chat.responses.default1": "હું અહીં સાંભળવા માટે છું. શું તમે મને વધુ કહી શકો કે તમે કેવું અનુભવો છો?",
      "chat.responses.default2": "શેર કરવા બદલ આભાર. શું તમે આને વધુ જાણવા માંગો છો?",
      "chat.responses.default3": "હું તમારા ખુલ્લેપણાની પ્રશંસા કરું છું. તમે ક્યારથી આ રીતે અનુભવો છો?",
      "chat.responses.default4": "હું તમારો ટેકો આપવા માટે અહીં છું. તમને શું લાગે છે કે આ પરિસ્થિતિમાં શું મદદ મળી શકે છે?",
      "chat.responses.default5": "આ રસપ્રદ છે. આનાથી તમને કેવું લાગે છે?",
      
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
