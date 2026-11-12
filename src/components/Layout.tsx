import { tx } from "../i18n";
import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Accessibility, Bell, BookOpen, CircleHelp, FilePlus2, FileText, Home, Languages, Menu, X, Clock3, ArrowUpRight } from 'lucide-react';
import { useStore } from '../context';
import LanguageSelector from './LanguageSelector';
const primary = [['/', 'Overview', Home], ['/new-request', 'New RTI Request', FilePlus2], ['/appeal', 'First Appeal', ArrowUpRight], ['/track', 'Track Application', Clock3], ['/history', 'Application History', FileText]] as const;
const support = [['/help', 'How RTI works', BookOpen], ['/accessibility', 'Language & reading', Languages], ['/help#contact', 'Contact support', CircleHelp]] as const;
export function Brand({
  small = false
}: {
  small?: boolean;
}) {
  return <div className="brand"><span className="brand-mark">{tx("RT")}</span><span><b>{tx("RTI Online")}</b>{!small && <small>{tx("Government of India · Citizen services")}</small>}</span></div>;
}
export default function Layout() {
  const [open, setOpen] = useState(false);
  const {
    language,
    setLanguage,
    notices,
    largeText,
    contrast
  } = useStore();
  const nav = useNavigate();
  const loc = useLocation();
  return <div className={`app-shell ${largeText ? 'large-text' : ''} ${contrast ? 'high-contrast' : ''} ${['/login', '/verify'].includes(loc.pathname) ? 'auth-mode' : ''}`}>
  <header className="site-header">
   <div className="gov-banner"><button className="brand-link" aria-label={tx("RTI Online home")} onClick={() => nav('/')}><span className="emblem-crop" aria-hidden="true"><img src="/rti-government-banner.png" alt="" /></span><span className="gov-identity-copy"><b>{tx("RTI Online")}</b><strong>{tx("Right to Information Portal")}</strong><small>{tx("An Initiative of Department of Personnel & Training, Government of India")}</small></span></button></div>
   <nav className="topbar" aria-label={tx("Portal controls")}><button className="icon-btn mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><div className="header-actions"><LanguageSelector /><button className="text-action" onClick={() => nav('/accessibility')}><Accessibility size={18} /> {tx("Accessibility")}</button><button className="icon-btn notice-button" aria-label={tx("Notifications")} onClick={() => nav('/notifications')}><Bell /><span className="notification-dot">{notices.filter(n => n.unread).length}</span></button><button className="avatar" aria-label={tx("Sign in")} onClick={() => nav('/login')}>H</button></div></nav>
  </header>
  <div className="workspace"><aside className={`sidebar ${open ? 'sidebar-open' : ''}`}><nav aria-label={tx("Main navigation")}>{primary.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({
            isActive
          }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={20} /><span>{tx(label)}</span></NavLink>)}</nav><div className="side-divider" /><p className="side-caption">{tx("HELP & ACCESSIBILITY")}</p><nav aria-label={tx("Help and accessibility")}>{support.map(([to, label, Icon]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({
            isActive
          }) => `nav-link subtle ${isActive ? 'active' : ''}`}><Icon size={19} /><span>{tx(label)}</span></NavLink>)}</nav><div className="side-note"><span className="secure-dot" /> {tx("Your information stays private")}</div></aside>
   {open && <button className="scrim" aria-label={tx("Close navigation")} onClick={() => setOpen(false)} />}
   <main className="main-area" key={loc.pathname}><Outlet /></main>
  </div>
  <nav className="bottom-nav" aria-label={tx("Quick navigation")}>{[['/', 'Home'], ['/new-request', 'New'], ['/track', 'Track'], ['/history', 'History']].map(([to, label]) => <button key={to} className={loc.pathname === to ? 'selected' : ''} onClick={() => nav(to)}>{tx(label)}</button>)}</nav>
 </div>;
}
