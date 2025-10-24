import { useLanguage } from '../context/LanguageContext';

export const useTranslation = () => {
  const { language, translations } = useLanguage();

  const t = (key: string, options?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    
    // Find translation in current language
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) break; // Stop if key path doesn't exist
    }

    // Fallback to English if translation is missing in current language
    if (result === undefined && language !== 'en') {
        result = translations.en;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) break;
        }
    }
    
    // Use the key itself as the ultimate fallback
    let finalString = (result as string) || key;

    // Apply options if they exist
    if (options) {
      Object.keys(options).forEach(optKey => {
        finalString = finalString.replace(`{{${optKey}}}`, String(options[optKey]));
      });
    }

    return finalString;
  };

  return { t, currentLanguage: language };
};
