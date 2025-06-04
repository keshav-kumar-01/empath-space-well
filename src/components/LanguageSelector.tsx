
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: t('language.english'), nativeName: 'English' },
    { code: 'hi', name: t('language.hindi'), nativeName: 'हिन्दी' },
    { code: 'gu', name: t('language.gujarati'), nativeName: 'ગુજરાતી' },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto min-w-[120px] bg-white/50 dark:bg-chetna-darker/50 border-chetna-primary/30 hover:bg-chetna-primary/10 rounded-full transition-all duration-300">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-chetna-primary" />
          <SelectValue>
            <span className="text-sm font-medium">
              {currentLanguage.nativeName}
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white/95 dark:bg-chetna-darker/95 backdrop-blur-xl border-chetna-primary/20">
        {languages.map((language) => (
          <SelectItem 
            key={language.code} 
            value={language.code}
            className="hover:bg-chetna-primary/10 focus:bg-chetna-primary/10"
          >
            <span className="font-medium">{language.nativeName}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
