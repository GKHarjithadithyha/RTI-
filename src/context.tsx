import { createContext, useContext, useEffect, useState } from 'react';
import { seedApplications, seedNotices } from './data';
import type { Application, Notice } from './types';
import i18n, { languageOptions } from './i18n';
type Store = { apps: Application[]; setApps: React.Dispatch<React.SetStateAction<Application[]>>; notices: Notice[]; setNotices: React.Dispatch<React.SetStateAction<Notice[]>>; largeText: boolean; setLargeText: React.Dispatch<React.SetStateAction<boolean>>; contrast: boolean; setContrast: React.Dispatch<React.SetStateAction<boolean>>; language: string; setLanguage: React.Dispatch<React.SetStateAction<string>>; signedIn: boolean; setSignedIn: React.Dispatch<React.SetStateAction<boolean>> };
const C = createContext<Store | null>(null);
export function StoreProvider({children}:{children:React.ReactNode}) {
 const [apps,setApps]=useState<Application[]>(()=>JSON.parse(localStorage.getItem('rti-apps')||'null')||seedApplications);
 const [notices,setNotices]=useState<Notice[]>(()=>JSON.parse(localStorage.getItem('rti-notices')||'null')||seedNotices);
 const [largeText,setLargeText]=useState(()=>localStorage.getItem('rti-large')==='true');
 const [contrast,setContrast]=useState(()=>localStorage.getItem('rti-contrast')==='true');
 const [language,setLanguage]=useState(()=>{const saved=localStorage.getItem('rti-language')||'en';const legacy:Record<string,string>={English:'en',Hindi:'hi',Kannada:'kn',Tamil:'ta',Telugu:'te',Malayalam:'ml',Bengali:'bn',Marathi:'mr',Gujarati:'gu',Punjabi:'pa',Odia:'or',Urdu:'ur'};const code=legacy[saved]||saved;return languageOptions.some(option=>option.code===code)?code:'en'});
 const [signedIn,setSignedIn]=useState(()=>localStorage.getItem('rti-session')==='true');
 useEffect(()=>localStorage.setItem('rti-apps',JSON.stringify(apps)),[apps]); useEffect(()=>localStorage.setItem('rti-notices',JSON.stringify(notices)),[notices]);
 useEffect(()=>localStorage.setItem('rti-large',String(largeText)),[largeText]); useEffect(()=>localStorage.setItem('rti-contrast',String(contrast)),[contrast]); useEffect(()=>{localStorage.setItem('rti-language',language);void i18n.changeLanguage(language)},[language]); useEffect(()=>localStorage.setItem('rti-session',String(signedIn)),[signedIn]);
 return <C.Provider value={{apps,setApps,notices,setNotices,largeText,setLargeText,contrast,setContrast,language,setLanguage,signedIn,setSignedIn}}>{children}</C.Provider>;
}
export function useStore(){const v=useContext(C);if(!v)throw new Error('StoreProvider missing');return v;}
