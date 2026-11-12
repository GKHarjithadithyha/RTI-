import { tx } from "../i18n";
import { ChevronDown, Languages } from 'lucide-react';
import { useStore } from '../context';
import { languageOptions } from '../i18n';
export default function LanguageSelector() {
  const {
    language,
    setLanguage
  } = useStore();
  return <label className="language-control"><Languages size={17} /><select aria-label={tx("Choose language")} value={language} onChange={event => setLanguage(event.target.value as typeof language)}>{languageOptions.map(item => <option key={item.code} value={item.code}>{item.nativeName}</option>)}</select><ChevronDown size={14} /></label>;
}
