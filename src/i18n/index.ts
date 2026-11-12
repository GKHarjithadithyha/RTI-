import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import ml from './locales/ml.json';
import bn from './locales/bn.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import ur from './locales/ur.json';

export const languageOptions = [
  { code: 'en', nativeName: 'English', locale: 'en-IN' },
  { code: 'hi', nativeName: 'हिन्दी', locale: 'hi-IN' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', locale: 'kn-IN' },
  { code: 'ta', nativeName: 'தமிழ்', locale: 'ta-IN' },
  { code: 'te', nativeName: 'తెలుగు', locale: 'te-IN' },
  { code: 'ml', nativeName: 'മലയാളം', locale: 'ml-IN' },
  { code: 'bn', nativeName: 'বাংলা', locale: 'bn-IN' },
  { code: 'mr', nativeName: 'मराठी', locale: 'mr-IN' },
  { code: 'gu', nativeName: 'ગુજરાતી', locale: 'gu-IN' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', locale: 'pa-IN' },
  { code: 'or', nativeName: 'ଓଡ଼ିଆ', locale: 'or-IN' },
  { code: 'ur', nativeName: 'اردو', locale: 'ur-IN' },
] as const;
export type LanguageCode = typeof languageOptions[number]['code'];

const stored = localStorage.getItem('rti-language') || 'en';
const legacyCodes: Record<string, LanguageCode> = { English: 'en', Hindi: 'hi', Kannada: 'kn', Tamil: 'ta', Telugu: 'te', Malayalam: 'ml', Bengali: 'bn', Marathi: 'mr', Gujarati: 'gu', Punjabi: 'pa', Odia: 'or', Urdu: 'ur' };
const candidateLanguage = legacyCodes[stored] || stored;
const initialLanguage: LanguageCode = languageOptions.some(option => option.code === candidateLanguage) ? candidateLanguage as LanguageCode : 'en';

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi }, kn: { translation: kn }, ta: { translation: ta }, te: { translation: te }, ml: { translation: ml }, bn: { translation: bn }, mr: { translation: mr }, gu: { translation: gu }, pa: { translation: pa }, or: { translation: or }, ur: { translation: ur } },
  lng: initialLanguage,
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function getLanguage(code: string) {
  return languageOptions.find(item => item.code === code) || languageOptions[0];
}

export function tx(source: string) {
  return i18n.t(source, { ns: 'translation' });
}

export default i18n;
