import { useTranslation } from 'react-i18next';

interface ChatResponse {
  trigger: string[];
  responses: string[];
}

// This function returns localized fallback responses
export const getTranslatedResponse = (message: string, t: (key: string) => string): string => {
  const lowercaseMessage = message.toLowerCase();
  
  // Define response categories with translation keys
  const responseCategories = [
    {
      trigger: ["hello", "hi", "hey", "greetings", "howdy", "hola", "नमस्ते", "હેલો"],
      responses: [
        "chat.responses.hello1",
        "chat.responses.hello2", 
        "chat.responses.hello3",
        "chat.responses.hello4",
        "chat.responses.hello5"
      ]
    },
    {
      trigger: ["sad", "unhappy", "depressed", "down", "blue", "heartbroken", "devastated", "miserable", "दुखी", "ઉદાસ"],
      responses: [
        "chat.responses.sad1",
        "chat.responses.sad2",
        "chat.responses.sad3",
        "chat.responses.sad4",
        "chat.responses.sad5",
        "chat.responses.sad6"
      ]
    },
    {
      trigger: ["anxious", "anxiety", "worried", "stress", "stressed", "panic", "overwhelming", "fear", "scared", "चिंता", "ચિંતા"],
      responses: [
        "chat.responses.anxiety1",
        "chat.responses.anxiety2",
        "chat.responses.anxiety3",
        "chat.responses.anxiety4",
        "chat.responses.anxiety5",
        "chat.responses.anxiety6",
        "chat.responses.anxiety7"
      ]
    },
    {
      trigger: ["angry", "mad", "frustrated", "furious", "irritated", "annoyed", "rage", "outraged", "गुस्सा", "ગુસ્સો"],
      responses: [
        "chat.responses.angry1",
        "chat.responses.angry2",
        "chat.responses.angry3",
        "chat.responses.angry4",
        "chat.responses.angry5",
        "chat.responses.angry6",
        "chat.responses.angry7"
      ]
    },
    {
      trigger: ["happy", "good", "great", "wonderful", "joy", "excited", "delighted", "content", "peaceful", "खुश", "ખુશ"],
      responses: [
        "chat.responses.happy1",
        "chat.responses.happy2",
        "chat.responses.happy3",
        "chat.responses.happy4",
        "chat.responses.happy5",
        "chat.responses.happy6",
        "chat.responses.happy7"
      ]
    },
    {
      trigger: ["tired", "exhausted", "fatigue", "sleep", "drained", "burnout", "worn out", "थका", "થાક્યો"],
      responses: [
        "chat.responses.tired1",
        "chat.responses.tired2",
        "chat.responses.tired3",
        "chat.responses.tired4",
        "chat.responses.tired5",
        "chat.responses.tired6",
        "chat.responses.tired7"
      ]
    },
    {
      trigger: ["thank", "thanks", "appreciate", "grateful", "धन्यवाद", "આભાર"],
      responses: [
        "chat.responses.thanks1",
        "chat.responses.thanks2",
        "chat.responses.thanks3",
        "chat.responses.thanks4",
        "chat.responses.thanks5",
        "chat.responses.thanks6"
      ]
    },
    {
      trigger: ["help", "support", "advice", "guidance", "lost", "confused", "uncertain", "मदद", "મદદ"],
      responses: [
        "chat.responses.help1",
        "chat.responses.help2",
        "chat.responses.help3",
        "chat.responses.help4",
        "chat.responses.help5",
        "chat.responses.help6",
        "chat.responses.help7"
      ]
    },
    {
      trigger: ["lonely", "alone", "isolated", "disconnected", "abandoned", "अकेला", "એકલો"],
      responses: [
        "chat.responses.lonely1",
        "chat.responses.lonely2",
        "chat.responses.lonely3",
        "chat.responses.lonely4",
        "chat.responses.lonely5",
        "chat.responses.lonely6"
      ]
    },
    {
      trigger: ["overwhelmed", "too much", "can't cope", "struggling", "drowning", "अभिभूत", "અભિભૂત"],
      responses: [
        "chat.responses.overwhelmed1",
        "chat.responses.overwhelmed2",
        "chat.responses.overwhelmed3",
        "chat.responses.overwhelmed4",
        "chat.responses.overwhelmed5",
        "chat.responses.overwhelmed6"
      ]
    },
    {
      trigger: ["worthless", "failure", "useless", "not good enough", "disappoint", "बेकार", "નકામો"],
      responses: [
        "chat.responses.worthless1",
        "chat.responses.worthless2",
        "chat.responses.worthless3",
        "chat.responses.worthless4",
        "chat.responses.worthless5",
        "chat.responses.worthless6"
      ]
    }
  ];
  
  // Find a matching response category
  for (const category of responseCategories) {
    if (category.trigger.some(trigger => lowercaseMessage.includes(trigger))) {
      const randomIndex = Math.floor(Math.random() * category.responses.length);
      return t(category.responses[randomIndex]);
    }
  }
  
  // Default responses if no match is found
  const defaultResponseKeys = [
    "chat.responses.default1",
    "chat.responses.default2", 
    "chat.responses.default3",
    "chat.responses.default4",
    "chat.responses.default5",
    "chat.responses.default6",
    "chat.responses.default7",
    "chat.responses.default8",
    "chat.responses.default9",
    "chat.responses.default10"
  ];
  
  const randomIndex = Math.floor(Math.random() * defaultResponseKeys.length);
  return t(defaultResponseKeys[randomIndex]);
};