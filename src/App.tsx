import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { StoreProvider } from './context';
import TranslationObserver from './i18n/TranslationObserver';
import { AccessibilitySettings, Appeal, Dashboard, Details, Help, History, Login, NewRequest, Notifications, OTP, Success, Track } from './pages';

function Router(){return <><TranslationObserver/><Routes><Route element={<Layout/>}><Route index element={<Dashboard/>}/><Route path="login" element={<Login/>}/><Route path="verify" element={<OTP/>}/><Route path="new-request" element={<NewRequest/>}/><Route path="success" element={<Success/>}/><Route path="track" element={<Track/>}/><Route path="history" element={<History/>}/><Route path="application/:id" element={<Details/>}/><Route path="appeal" element={<Appeal/>}/><Route path="notifications" element={<Notifications/>}/><Route path="help" element={<Help/>}/><Route path="accessibility" element={<AccessibilitySettings/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes></>}
export default function App(){return <StoreProvider><Router/></StoreProvider>}
