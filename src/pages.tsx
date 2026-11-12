import { tx, languageOptions } from "./i18n";
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bell, Check, CheckCircle2, ChevronRight, Clock3, Download, FilePlus2, FileText, Headphones, Info, Search, ShieldCheck, Upload, Volume2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useStore } from './context';
import { authorities } from './data';
import type { Application } from './types';
import { Banner, Button, EmptyState, PageHeading, Status } from './components/UI';
export function Dashboard() {
  const {
    apps,
    notices
  } = useStore();
  const nav = useNavigate();
  return <div className="content"><div className="welcome-row"><div><h1>{tx("Good morning, Harjith")}</h1><p>{tx("Your RTI applications, appeals and updates — all in one place.")}</p></div><button className="notification-pill" onClick={() => nav('/notifications')}><Bell size={18} />{notices.filter(n => n.unread).length} {tx("new updates")}</button></div><div className="welcome-banner"><div className="welcome-symbol"><ShieldCheck /></div><div><b>{tx("One place to manage your right to information.")}</b><p>{tx("Start a request, follow its progress or take the next step on an existing application.")}</p></div><span className="banner-link">{tx("Your workspace")} <ArrowRight size={18} /></span></div><h2 className="section-title">{tx("What would you like to do today?")}</h2><div className="service-grid"><Service icon={<FilePlus2 />} title={tx("File an RTI Request")} text={tx("Request information from a Central Government public authority.")} action="Start a request" onClick={() => nav('/new-request')} /><Service icon={<Clock3 />} title={tx("Track an Application")} text={tx("Check progress, respond to requests and view decisions.")} action="Track application" onClick={() => nav('/track')} /><Service icon={<ArrowRight />} title={tx("File a First Appeal")} text={tx("Appeal when you have not received a satisfactory response.")} action="Start an appeal" onClick={() => nav('/appeal')} /></div><div className="dashboard-lower"><section><div className="section-head"><h2>{tx("Your applications")}</h2><Link to="/history" className="link">{tx("View all history")} <ArrowRight size={17} /></Link></div>{apps.length ? <div className="application-list">{apps.slice(0, 4).map(a => <article className="application-row" key={a.id} onClick={() => nav(`/application/${encodeURIComponent(a.id)}`)}><div className="app-row-icon"><FileText /></div><div className="app-main"><b>{a.id}</b><span>{a.subject}</span></div><div className="app-date"><small>{tx("Last updated")}</small><span>{a.updated}</span></div><Status value={a.status} /><ChevronRight className="row-chevron" /></article>)}</div> : <EmptyState title={tx("Your RTI journey starts here")} body={tx("You have not submitted any RTI requests or appeals yet.")} action={<Button onClick={() => nav('/new-request')}>{tx("Start an RTI request")}</Button>} />}</section><aside className="updates-card"><div className="section-head"><h2>{tx("Important updates")}</h2><Link to="/notifications" className="link">{tx("See all")}</Link></div>{notices.filter(n => n.unread).slice(0, 2).map(n => <div className="update-item" key={n.id}><span className="update-bar" /><div><b>{n.title}</b><p>{n.body}</p><button className="inline-link" onClick={() => nav(n.applicationId ? `/application/${encodeURIComponent(n.applicationId)}` : '/notifications')}>{tx("Review update")} <ArrowRight size={15} /></button></div></div>)}{!notices.some(n => n.unread) && <p className="muted">{tx("You are all caught up. No new updates.")}</p>}<p className="updates-footer">{tx("We will let you know when something changes.")}</p></aside></div><p className="demo-note"><Info size={16} /> {tx("Demonstration workspace · All applications, notifications and services use sample data.")}</p></div>;
}
function Service({
  icon,
  title,
  text,
  action,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  action: string;
  onClick: () => void;
}) {
  return <button className="service-card" onClick={onClick}><span className="service-icon">{icon}</span><span className="service-copy"><b>{title}</b><small>{text}</small><span className="service-action">{action} <ArrowRight size={17} /></span></span></button>;
}
export function Login() {
  const nav = useNavigate();
  const [contact, setContact] = useState('');
  const [mode, setMode] = useState<'otp' | 'password'>('otp');
  const [err, setErr] = useState('');
  const send = () => {
    if (!contact.trim()) {
      setErr(tx('Enter your email address or mobile number.'));
      return;
    }
    sessionStorage.setItem('rti-contact', contact);
    nav('/verify');
  };
  return <div className="auth-page"><div className="auth-intro"><PageHeading title={tx("Sign in to your RTI workspace")} subtitle={tx("Access your requests, appeals and saved applicant details in one secure place.")} /></div><div className="auth-card"><div className="auth-emblem">{tx("RTI")}</div><h2>{tx("Welcome back")}</h2><p>{tx("Sign in using your registered email or mobile number.")}</p><form onSubmit={e => {
        e.preventDefault();
        send();
      }}><label>{tx("Email address or mobile number")}<input autoComplete="username" value={contact} onChange={e => {
            setContact(e.target.value);
            setErr(tx(''));
          }} placeholder={tx("Enter email or mobile number")} /></label>{mode === 'password' && <label>{tx("Password")}<input type="password" placeholder={tx("Enter your password")} /></label>}{err && <small className="field-error">{err}</small>}<button className="link mode-toggle" type="button" onClick={() => setMode(mode === 'otp' ? 'password' : 'otp')}>{mode === 'otp' ? 'Use password instead' : 'Sign in with a one-time code'}</button><Button type="submit">{tx("Continue securely")} <ArrowRight size={17} /></Button></form><div className="auth-divider" /><b>{tx("Prefer not to create an account?")}</b><p>{tx("Use guest access with your registration number and verified contact details.")}</p><button className="inline-link" onClick={() => nav('/track')}>{tx("Continue as guest")} <ArrowRight size={16} /></button><div className="sim-note">{tx("Demo sign-in is simulated. Any email or mobile number works.")}</div></div><div className="auth-help">{tx("Need help?")} <Link to="/help">{tx("Visit the help centre")}</Link></div></div>;
}
export function OTP() {
  const nav = useNavigate();
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [secs, setSecs] = useState(30);
  useEffect(() => {
    if (secs <= 0) return;
    const timer = window.setTimeout(() => setSecs(v => v - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secs]);
  const contact = sessionStorage.getItem('rti-contact') || 'ha••••••@gmail.com';
  const masked = contact.includes('@') ? contact.replace(/^(.{2}).*(@.*)$/, '$1••••••$2') : contact.slice(0, 3) + '••••••' + contact.slice(-3);
  const change = (i: number, val: string) => {
    const v = [...digits];
    v[i] = val.replace(/\D/g, '').slice(-1);
    setDigits(v);
    setError(tx(''));
    if (v[i] && i < 5) (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
  };
  const verify = () => {
    if (digits.join('').length !== 6) {
      setError(tx('Enter all 6 digits to continue.'));
      return;
    }
    localStorage.setItem('rti-session', 'true');
    nav('/');
  };
  return <div className="auth-page"><div className="auth-intro"><PageHeading title={tx("Verify it is you")} subtitle={tx("Enter the one-time password sent to your registered email address or mobile number.")} /></div><div className="auth-card otp-card"><h2>{tx("Check your inbox")}</h2><p>{tx("We sent a verification code to")} <b>{masked}</b></p><label className="otp-label">{tx("Enter 6-digit code")}</label><div className="otp-inputs">{digits.map((d, i) => <input key={i} id={`otp-${i}`} aria-label={`Digit ${i + 1}`} inputMode="numeric" value={d} onChange={e => change(i, e.target.value)} onKeyDown={e => {
          if (e.key === 'Backspace' && !digits[i] && i > 0) (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus();
        }} />)}</div>{error && <p className="field-error">{error}</p>}<p className="resend-text">{secs ? `You can request a new code in 00:${String(secs).padStart(2, '0')}` : 'You can request a new code now.'}</p><button className="inline-link" disabled={secs > 0} onClick={() => setSecs(30)}>{tx("Resend code")}</button><Button onClick={verify}>{tx("Verify and continue")} <ArrowRight size={17} /></Button><button className="inline-link change-contact" onClick={() => nav('/login')}>{tx("Use a different email or mobile number")}</button><div className="sim-note">{tx("For this demo, enter any six digits.")}</div></div></div>;
}
const reqSteps = ['Public authority', 'Applicant details', 'Request information', 'Supporting documents', 'Review & submit'];
type ReqData = {
  ministry: string;
  authority: string;
  email: string;
  confirmEmail: string;
  phone: string;
  name: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  area: string;
  education: string;
  citizen: string;
  bpl: string;
  subject: string;
  description: string;
};
export function NewRequest() {
  const [draft] = useState(() => JSON.parse(localStorage.getItem('rti-request-draft') || 'null'));
  const [step, setStep] = useState<number>(draft?.step || 0);
  const [data, setData] = useState<ReqData>(draft?.data || {
    ministry: '',
    authority: '',
    email: '',
    confirmEmail: '',
    phone: '',
    name: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
    area: 'Urban',
    education: '',
    citizen: 'Indian',
    bpl: 'No',
    subject: '',
    description: ''
  });
  useEffect(() => localStorage.setItem('rti-request-draft', JSON.stringify({
    data,
    step
  })), [data, step]);
  const [file, setFile] = useState<File | null>(null);
  const [feePaid, setFeePaid] = useState(false);
  const [error, setError] = useState('');
  const {
    setApps,
    setNotices
  } = useStore();
  const nav = useNavigate();
  const set = (k: keyof ReqData, v: string) => setData(d => ({
    ...d,
    [k]: v
  }));
  const choices = authorities[data.ministry] || [];
  const next = () => {
    setError(tx(''));
    if (step === 0 && (!data.ministry || !data.authority)) {
      setError(tx('Choose a ministry and public authority to continue.'));
      return;
    }
    if (step === 1 && (!data.name || !data.email || data.email !== data.confirmEmail || !data.phone || !data.address || !data.city || !data.state || !data.pin)) {
      setError(tx('Complete the required fields. Check that both email addresses match.'));
      return;
    }
    if (step === 1 && !/^\S+@\S+\.\S+$/.test(data.email)) {
      setError(tx('Enter a valid email address.'));
      return;
    }
    if (step === 2 && (!data.subject || data.description.trim().length < 10)) {
      setError(tx('Enter a subject and at least 10 characters of request details.'));
      return;
    }
    setStep(Math.min(step + 1, 4));
  };
  const submit = () => {
    const id = `RTI/DS/A/2026/${String(Math.floor(1240 + Math.random() * 8000)).padStart(6, '0')}`;
    const a: Application = {
      id,
      type: 'RTI request',
      authority: data.authority,
      subject: data.subject,
      date: '12 Nov 2026',
      updated: '12 Nov 2026',
      status: 'Under process',
      description: data.description,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: `${data.address}, ${data.city}, ${data.state} ${data.pin}`,
      timeline: [{
        title: 'Application submitted',
        date: '12 Nov 2026',
        done: true
      }, {
        title: 'Payment confirmation',
        date: 'Awaiting confirmation',
        done: false
      }, {
        title: 'Received by public authority',
        date: 'Pending',
        done: false
      }, {
        title: 'Under process',
        date: 'Pending',
        done: false
      }, {
        title: 'Response issued',
        date: 'Pending',
        done: false
      }]
    };
    setApps(prev => [a, ...prev]);
    setNotices(n => [{
      id: `n-${Date.now()}`,
      title: 'RTI request submitted',
      body: `Your request ${id} was submitted successfully.`,
      date: '12 Nov 2026',
      kind: 'Application update',
      unread: true,
      applicationId: id
    }, ...n]);
    localStorage.setItem('rti-last-submission', JSON.stringify(a));
    localStorage.removeItem('rti-request-draft');
    nav('/success');
  };
  return <div className="content form-content"><PageHeading eyebrow={tx("NEW RTI REQUEST")} title={tx("Start a new request")} subtitle={tx("We will guide you through each step. Your progress is saved on this device.")} /><div className="stepper" aria-label={tx("Request steps")}>{reqSteps.map((x, i) => <button key={x} className={`step ${i === step ? 'current' : ''} ${i < step ? 'completed' : ''}`} onClick={() => {
        if (i < step) setStep(i);
      }}><span>{i < step ? <Check size={16} /> : i + 1}</span><small>{x}</small></button>)}</div><div className="form-card"><div className="form-card-head"><div><div className="eyebrow">{tx("STEP")} {step + 1} {tx("OF 5")}</div><h2>{reqSteps[step]}</h2></div><span className="save-state"><CheckCircle2 size={16} /> {tx("Saved on this device")}</span></div>{step === 0 && <div className="form-grid"><label className="full">{tx("Ministry / Department / Apex body")} <em>*</em><select value={data.ministry} onChange={e => {
            set('ministry', e.target.value);
            set('authority', '');
          }}><option value="">{tx("Choose a ministry or department")}</option>{Object.keys(authorities).map(m => <option key={m}>{m}</option>)}</select><small>{tx("Select the government body that holds the information you need.")}</small></label><label className="full">{tx("Public authority")} <em>*</em><select value={data.authority} disabled={!data.ministry} onChange={e => set('authority', e.target.value)}><option value="">{data.ministry ? 'Choose a public authority' : 'Select a ministry first'}</option>{choices.map(a => <option key={a}>{a}</option>)}</select><small>{tx("Choose the authority responsible for this information.")}</small></label><Banner title={tx("Not sure where to send your request?")}>{tx("Choose the ministry most closely related to the subject. The authority can transfer it if needed.")}</Banner></div>}{step === 1 && <div className="form-grid"><label>{tx("Email address")} <em>*</em><input type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder={tx("name@example.com")} /></label><label>{tx("Confirm email address")} <em>*</em><input type="email" value={data.confirmEmail} onChange={e => set('confirmEmail', e.target.value)} placeholder={tx("Enter your email again")} /></label><label>{tx("Mobile number")} <em>*</em><input value={data.phone} onChange={e => set('phone', e.target.value)} placeholder={tx("10-digit mobile number")} /></label><label>{tx("Full name")} <em>*</em><input value={data.name} onChange={e => set('name', e.target.value)} placeholder={tx("As shown on your ID")} /></label><label>{tx("Gender")}<select value={data.gender} onChange={e => set('gender', e.target.value)}><option value="">{tx("Select (optional)")}</option>{['Female', 'Male', 'Other', 'Prefer not to say'].map(x => <option>{x}</option>)}</select></label><label>{tx("Address")} <em>*</em><input value={data.address} onChange={e => set('address', e.target.value)} placeholder={tx("House number, street, locality")} /></label><label>{tx("City / Town")} <em>*</em><input value={data.city} onChange={e => set('city', e.target.value)} /></label><label>{tx("State / UT")} <em>*</em><select value={data.state} onChange={e => set('state', e.target.value)}><option value="">{tx("Choose state or union territory")}</option>{['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'].map(x => <option>{x}</option>)}</select></label><label>{tx("PIN code")} <em>*</em><input inputMode="numeric" maxLength={6} value={data.pin} onChange={e => set('pin', e.target.value.replace(/\D/g, ''))} /></label><label>{tx("Country")}<select value={data.country} onChange={e => set('country', e.target.value)}><option>{tx("India")}</option><option>{tx("Other")}</option></select></label><label>{tx("Area type")}<select value={data.area} onChange={e => set('area', e.target.value)}><option>{tx("Urban")}</option><option>{tx("Rural")}</option></select></label><label>{tx("Educational status")}<select value={data.education} onChange={e => set('education', e.target.value)}><option value="">{tx("Select")}</option>{['Literate', 'Not literate'].map(x => <option>{x}</option>)}</select></label><label>{tx("Citizenship status")}<select value={data.citizen} onChange={e => set('citizen', e.target.value)}><option>{tx("Indian")}</option><option>{tx("Other")}</option></select></label><label>{tx("Below Poverty Line status")}<select value={data.bpl} onChange={e => set('bpl', e.target.value)}><option>{tx("No")}</option><option>{tx("Yes")}</option></select></label><div className="full"><Banner title={tx("Your details are kept private")}>{tx("We use this information to process your application and send updates about it.")}</Banner></div></div>}{step === 2 && <div className="form-grid"><label className="full">{tx("RTI application subject")} <em>*</em><input maxLength={150} value={data.subject} onChange={e => set('subject', e.target.value)} placeholder={tx("A short title for your request")} /><small>{data.subject.length}{tx("/150 characters")}</small></label><label className="full">{tx("Information you are requesting")} <em>*</em><textarea rows={8} maxLength={3000} value={data.description} onChange={e => set('description', e.target.value)} placeholder={tx("Describe the records or information you are seeking. Keep your request clear and specific.")} /><small className="counter">{data.description.length}{tx("/3000 characters")}</small></label><div className="full"><Banner title={tx("What can you ask for?")}>{tx("You can ask for existing records, documents, reports, data or file inspections. Keep each request focused and avoid asking questions that require an opinion.")}</Banner><button className="inline-link audio-button" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(tx('You can ask for existing records, documents, reports, data or file inspections. Keep your request clear and specific.')))}><Volume2 size={18} /> {tx("Listen to these instructions")}</button></div></div>}{step === 3 && <div className="upload-area"><Upload size={28} /><h3>{tx("Add supporting documents (optional)")}</h3><p>{tx("Attach a PDF document to support your request. Maximum file size: 1 MB.")}</p><label className="upload-button">{tx("Choose a PDF file")}<input type="file" accept="application/pdf,.pdf" onChange={e => {
            const f = e.target.files?.[0];
            if (f && (f.type !== 'application/pdf' || f.size > 1024 * 1024)) {
              setError(tx('Choose a PDF file smaller than 1 MB.'));
              setFile(null);
            } else {
              setError(tx(''));
              setFile(f || null);
            }
          }} /></label>{file && <div className="uploaded-file"><FileText /><span>{file.name}<small>{(file.size / 1024).toFixed(0)} {tx("KB · Ready to attach")}</small></span><button onClick={() => setFile(null)}>{tx("Remove")}</button></div>}<div className="upload-warning"><Info size={17} /> {tx("Do not upload sensitive identity or financial documents unless they are required.")}</div></div>}{step === 4 && <div className="review-sections"><ReviewSection title={tx("Public authority")} edit={() => setStep(0)}><b>{data.ministry}</b><span>{data.authority}</span></ReviewSection><ReviewSection title={tx("Applicant details")} edit={() => setStep(1)}><b>{data.name}</b><span>{data.email} · {data.phone}</span><span>{data.address}, {data.city}, {data.state} {data.pin}</span></ReviewSection><ReviewSection title={tx("Request information")} edit={() => setStep(2)}><b>{data.subject}</b><span>{data.description}</span></ReviewSection><ReviewSection title={tx("Supporting documents")} edit={() => setStep(3)}><span>{file?.name || 'No documents attached'}</span></ReviewSection><label className="declaration"><input type="checkbox" id="declaration" /> {tx("I confirm that I am a citizen of India and the information provided is correct.")} <em>*</em></label><div className="payment-demo"><div><b>{tx("Application fee")}</b><small>{tx("₹10 · payment is simulated for this demonstration")}</small></div><Button kind={feePaid ? "secondary" : "primary"} type="button" onClick={() => setFeePaid(true)}>{feePaid ? "Fee marked paid (demo)" : "Pay ₹10 in demo"}</Button></div></div>}{error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions">{step > 0 ? <Button kind="secondary" onClick={() => {
          setError(tx(''));
          setStep(step - 1);
        }}><ArrowLeft size={17} /> {tx("Back")}</Button> : <button className="inline-link" onClick={() => nav('/')}>{tx("Save and exit")}</button>}{step < 4 ? <Button onClick={next}>{tx("Continue")} <ArrowRight size={17} /></Button> : <Button onClick={() => {
          if (!(document.getElementById('declaration') as HTMLInputElement)?.checked) {
            setError(tx('Please confirm the declaration before submitting.'));
            return;
          }
          submit();
        }}>{tx("Submit application")} <ArrowRight size={17} /></Button>}</div></div><div className="secure-caption"><ShieldCheck size={17} /> {tx("Your request is protected. You can review everything before submission.")}</div></div>;
}
function ReviewSection({
  title,
  edit,
  children
}: {
  title: string;
  edit: () => void;
  children: React.ReactNode;
}) {
  return <section className="review-section"><div><h3>{title}</h3><button className="inline-link" onClick={edit}>{tx("Edit")}</button></div><div className="review-values">{children}</div></section>;
}
export function Success() {
  const nav = useNavigate();
  const data = JSON.parse(localStorage.getItem('rti-last-submission') || '{}') as Application;
  const appeal = data.type === 'First appeal';
  return <div className="content success-page"><div className="success-card"><div className="success-icon"><Check size={38} /></div><div className="eyebrow">{appeal ? 'APPEAL SUBMITTED' : 'REQUEST SUBMITTED'}</div><h1>{appeal ? 'First appeal submitted successfully' : 'Application submitted successfully'}</h1><p>{appeal ? 'Your appeal has been sent to the First Appellate Authority. We will notify you when its status changes.' : 'Your request has been sent to the public authority. We will notify you when its status changes.'}</p><div className="registration-box"><small>{tx("Registration number")}</small><strong>{data.id || 'RTI/DS/A/2026/001234'}</strong><button className="copy-link" onClick={() => navigator.clipboard?.writeText(data.id || 'RTI/DS/A/2026/001234')}>{tx("Copy number")}</button></div><div className="success-facts"><div><small>{tx("Submission date")}</small><b>{data.date || '12 Nov 2026'}</b></div><div><small>{tx("Public authority")}</small><b>{data.authority || 'Central public authority'}</b></div></div><Banner kind="success" title={tx("Save this number")}>{tx("You will need it to track your")} {appeal ? 'appeal' : 'application'} {tx("and follow its progress.")}</Banner><div className="success-actions"><Button onClick={() => nav(`/application/${encodeURIComponent(data.id || 'RTI/DS/A/2026/001234')}`)}>{tx("View application")} <ArrowRight size={18} /></Button><Button kind="secondary" onClick={() => nav('/track')}>{tx("Track application")}</Button></div><button className="inline-link centered" onClick={() => nav('/')}>{tx("Return to dashboard")}</button></div></div>;
}
export function Track() {
  const {
    apps
  } = useStore();
  const [id, setId] = useState('');
  const [contact, setContact] = useState('');
  const [found, setFound] = useState<Application | null>(null);
  const [err, setErr] = useState('');
  const search = () => {
    const a = apps.find(x => x.id.toLowerCase() === id.trim().toLowerCase());
    if (a && contact.trim()) {
      setFound(a);
      setErr(tx(''));
    } else {
      setFound(null);
      setErr(a ? 'Enter the email address or mobile number linked to this application.' : 'We could not find that registration number. Check the number and try again.');
    }
  };
  return <div className="content"><PageHeading eyebrow={tx("APPLICATION STATUS")} title={tx("Track an application")} subtitle={tx("See where your request is and what happens next.")} /><div className="track-search card"><h2>{tx("Find your application")}</h2><p>{tx("Enter your registration number and the email or mobile number used on the application.")}</p><div className="form-grid"><label>{tx("Registration number")}<input value={id} onChange={e => setId(e.target.value)} placeholder={tx("e.g. RTI/DS/A/2026/001234")} /></label><label>{tx("Email or mobile number")}<input value={contact} onChange={e => setContact(e.target.value)} placeholder={tx("Enter verified contact details")} /></label></div>{err && <p className="form-error">{err}</p>}<Button onClick={search}><Search size={17} /> {tx("Search application")}</Button><small className="demo-hint">{tx("For this demo, any contact detail will work with a sample registration number.")}</small></div>{found && <div className="track-result"><div className="result-head"><div><div className="eyebrow">{tx("APPLICATION STATUS")}</div><h2>{found.id}</h2></div><Status value={found.status} /></div><div className="result-details"><div><small>{tx("Submitted")}</small><b>{found.date}</b></div><div><small>{tx("Public authority")}</small><b>{found.authority}</b></div><div><small>{tx("Last updated")}</small><b>{found.updated}</b></div></div><h3>{tx("Application progress")}</h3><Timeline items={found.timeline} /><Link className="inline-link" to={`/application/${encodeURIComponent(found.id)}`}>{tx("View full application details")} <ArrowRight size={16} /></Link></div>}</div>;
}
export function History() {
  const {
    apps
  } = useStore();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [type, setType] = useState('All types');
  const items = apps.filter(a => `${a.id} ${a.subject} ${a.authority}`.toLowerCase().includes(q.toLowerCase()) && (status === 'All statuses' || a.status === status) && (type === 'All types' || a.type === type));
  return <div className="content"><PageHeading eyebrow={tx("YOUR RECORDS")} title={tx("Application history")} subtitle={tx("Requests and appeals submitted from this workspace.")} /><div className="filters card"><label className="search-input"><Search /><input value={q} onChange={e => setQ(e.target.value)} placeholder={tx("Search by number, subject or authority")} /></label><label>{tx("Status")}<select value={status} onChange={e => setStatus(e.target.value)}>{['All statuses', 'Under process', 'Action required', 'Disposed'].map(x => <option>{x}</option>)}</select></label><label>{tx("Type")}<select value={type} onChange={e => setType(e.target.value)}>{['All types', 'RTI request', 'First appeal'].map(x => <option>{x}</option>)}</select></label><label>{tx("From date")}<input type="date" /></label></div>{items.length ? <div className="history-list">{items.map(a => <Link className="history-card" key={a.id} to={`/application/${encodeURIComponent(a.id)}`}><div className="history-top"><span className="app-type"><FileText size={17} />{a.type}</span><Status value={a.status} /></div><h3>{a.subject}</h3><p>{a.authority}</p><div className="history-meta"><span><small>{tx("Registration number")}</small><b>{a.id}</b></span><span><small>{tx("Submitted")}</small><b>{a.date}</b></span><span className="details-link">{tx("View details")} <ArrowRight size={16} /></span></div></Link>)}</div> : <EmptyState title={tx("No applications match")} body={apps.length ? 'Try changing your search or filters.' : 'Your workspace will show requests and appeals as soon as you submit your first application.'} action={<Link className="btn primary" to="/new-request">{tx("Start an RTI request")}</Link>} />}</div>;
}
export function Details() {
  const [params] = useSearchParams();
  const pathId = decodeURIComponent(location.pathname.split('/').pop() || '');
  const {
    apps,
    notices,
    setApps,
    setNotices
  } = useStore();
  const nav = useNavigate();
  const [responding, setResponding] = useState(false);
  const [responseText, setResponseText] = useState('');
  const app = apps.find(a => a.id === pathId) || apps[0];
  if (!app) return <div className="content"><EmptyState title={tx("Application not found")} body={tx("Check your registration number or return to your application history.")} action={<Link className="btn primary" to="/history">{tx("View history")}</Link>} /></div>;
  const related = notices.filter(n => n.applicationId === app.id);
  return <div className="content"><button className="back-link" onClick={() => nav('/history')}><ArrowLeft size={17} /> {tx("Application history")}</button><div className="detail-heading"><div><div className="eyebrow">{app.type.toUpperCase()}</div><h1>{app.id}</h1><p>{app.subject}</p></div><Status value={app.status} /></div>{app.status === 'Action required' && <div className="action-required"><Banner kind="warning" title={tx("Action needed: additional information requested")}>{tx("Please review the request from the public authority and respond by 20 Nov 2026.")}</Banner><Button onClick={() => setResponding(v => !v)}>{responding ? "Close response form" : "Respond to request"} <ArrowRight size={17} /></Button>{responding && <div className="response-form"><label>{tx("Your response to the public authority")}<textarea rows={4} value={responseText} onChange={e => setResponseText(e.target.value)} placeholder={tx("Add the information requested or a short response.")} /></label><Button onClick={() => {
          if (!responseText.trim()) return;
          setApps(all => all.map(item => item.id === app.id ? {
            ...item,
            status: "Under process",
            updated: "12 Nov 2026",
            timeline: [...item.timeline, {
              title: "Additional information submitted",
              date: "12 Nov 2026",
              done: true
            }]
          } : item));
          setNotices(all => [{
            id: `n-${Date.now()}`,
            title: "Additional information submitted",
            body: `Your response for ${app.id} was recorded in this demo.`,
            date: "12 Nov 2026",
            kind: "Application update",
            unread: true,
            applicationId: app.id
          }, ...all]);
          setResponding(false);
          setResponseText("");
        }}>{tx("Send response")} <ArrowRight size={17} /></Button></div>}</div>}<div className="detail-grid"><div className="detail-main"><section className="card detail-card"><h2>{tx("Application progress")}</h2><Timeline items={app.timeline} /></section><section className="card detail-card"><h2>{tx("Request information")}</h2><dl className="detail-list"><dt>{tx("Public authority")}</dt><dd>{app.authority}</dd><dt>{tx("Request subject")}</dt><dd>{app.subject}</dd><dt>{tx("Request description")}</dt><dd>{app.description}</dd><dt>{tx("Supporting documents")}</dt><dd>{tx("No documents attached")}</dd></dl></section><section className="card detail-card"><h2>{tx("Updates and notifications")}</h2>{related.length ? related.map(n => <div className="notice-row" key={n.id}><span className="notice-bullet" /><div><b>{n.title}</b><p>{n.body}</p><small>{n.date}</small></div></div>) : <p className="muted">{tx("No notifications for this application.")}</p>}</section></div><aside className="card detail-card"><h2>{tx("Application details")}</h2><dl className="detail-list compact"><dt>{tx("Submitted on")}</dt><dd>{app.date}</dd><dt>{tx("Applicant")}</dt><dd>{app.name}</dd><dt>{tx("Email")}</dt><dd>{app.email}</dd><dt>{tx("Mobile")}</dt><dd>{app.phone}</dd><dt>{tx("Address")}</dt><dd>{app.address}</dd></dl><button className="btn secondary full-width" onClick={() => {
          const blob = new Blob([`RTI Online acknowledgement\nRegistration number: ${app.id}\nSubmitted: ${app.date}\nPublic authority: ${app.authority}\nSubject: ${app.subject}`], {
            type: "text/plain"
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${app.id.replace(/\//g, "-")}-acknowledgement.txt`;
          link.click();
          URL.revokeObjectURL(url);
        }}><Download size={17} /> {tx("Download acknowledgement")}</button><button className="inline-link detail-appeal" onClick={() => nav(`/appeal?application=${encodeURIComponent(app.id)}`)}>{tx("File a first appeal")} <ArrowRight size={16} /></button></aside></div></div>;
}
export function Timeline({
  items
}: {
  items: Application['timeline'];
}) {
  return <ol className="timeline">{items.map((item, i) => <li className={item.done ? 'done' : ''} key={i}><span className="timeline-node">{item.done ? <Check size={13} /> : null}</span><div><b>{item.title}</b><small>{item.date}</small></div></li>)}</ol>;
}
const appealSteps = ['Original RTI application', 'Appeal details', 'Grounds for appeal', 'Supporting documents', 'Review & submit'];
export function Appeal() {
  const [step, setStep] = useState(0);
  const [params] = useSearchParams();
  const {
    apps,
    setApps,
    setNotices
  } = useStore();
  const nav = useNavigate();
  const [id, setId] = useState(params.get('application') || '');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState('No response received');
  const [file, setFile] = useState<File | null>(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');
  const original = apps.find(a => a.id === id && a.type === 'RTI request');
  const next = () => {
    setError(tx(''));
    if (step === 0 && !original) {
      setError(tx('Choose an original RTI application from your workspace.'));
      return;
    }
    if (step === 2 && (!reason || description.trim().length < 10)) {
      setError(tx('Choose a ground and describe why you are appealing.'));
      return;
    }
    setStep(Math.min(4, step + 1));
  };
  const submit = () => {
    if (!checked) {
      setError(tx('Please confirm the declaration before submitting.'));
      return;
    }
    const aid = `RTI/DS/A/2026/FP${String(Math.floor(Math.random() * 9000 + 1000))}`;
    const a: Application = {
      id: aid,
      type: 'First appeal',
      authority: original!.authority,
      subject: `First appeal: ${original!.subject}`,
      date: '12 Nov 2026',
      updated: '12 Nov 2026',
      status: 'Under process',
      description: `${reason}. ${description}`,
      name: original!.name,
      email: original!.email,
      phone: original!.phone,
      address: original!.address,
      timeline: [{
        title: 'Appeal submitted',
        date: '12 Nov 2026',
        done: true
      }, {
        title: 'Received by First Appellate Authority',
        date: 'Pending',
        done: false
      }, {
        title: 'Appeal under review',
        date: 'Pending',
        done: false
      }, {
        title: 'Decision issued',
        date: 'Pending',
        done: false
      }]
    };
    setApps(p => [a, ...p]);
    setNotices(n => [{
      id: `n-${Date.now()}`,
      title: 'First appeal submitted',
      body: `Your appeal ${aid} was submitted successfully.`,
      date: '12 Nov 2026',
      kind: 'Appeal update',
      unread: true,
      applicationId: aid
    }, ...n]);
    localStorage.setItem('rti-last-submission', JSON.stringify(a));
    nav('/success');
  };
  return <div className="content form-content"><PageHeading eyebrow={tx("FIRST APPEAL")} title={tx("Appeal a decision or delay")} subtitle={tx("Ask a senior officer to review your original RTI application.")} /><div className="stepper">{appealSteps.map((x, i) => <button key={x} className={`step ${i === step ? 'current' : ''} ${i < step ? 'completed' : ''}`} onClick={() => i < step && setStep(i)}><span>{i < step ? <Check size={16} /> : i + 1}</span><small>{x}</small></button>)}</div><div className="form-card"><div className="form-card-head"><div><div className="eyebrow">{tx("STEP")} {step + 1} {tx("OF 5")}</div><h2>{appealSteps[step]}</h2></div></div>{step === 0 && <div className="form-grid"><label className="full">{tx("Original RTI registration number")} <em>*</em><select value={id} onChange={e => setId(e.target.value)}><option value="">{tx("Select a submitted RTI request")}</option>{apps.filter(a => a.type === 'RTI request').map(a => <option key={a.id} value={a.id}>{a.id} — {a.subject}</option>)}</select></label>{original && <div className="review-values full"><b>{original.authority}</b><span>{tx("Submitted")} {original.date}</span><span>{tx("Current status:")} {original.status}</span></div>}</div>}{step === 1 && <div className="form-grid"><label className="full">{tx("Response status")}<select value={response} onChange={e => setResponse(e.target.value)}><option>{tx("No response received")}</option><option>{tx("Response received")}</option><option>{tx("Response received, not satisfactory")}</option></select></label><label>{tx("Date of response")}<input type="date" /></label><div className="full"><Banner title={tx("When can you file a first appeal?")}>{tx("You may appeal if no decision was received within the time limit, or if you are not satisfied with the response.")}</Banner></div></div>}{step === 2 && <div className="form-grid"><label className="full">{tx("Ground for appeal")} <em>*</em><select value={reason} onChange={e => setReason(e.target.value)}><option value="">{tx("Select a reason")}</option><option>{tx("No response received within the time limit")}</option><option>{tx("Information was incomplete")}</option><option>{tx("Request was wrongly rejected")}</option><option>{tx("Other reason")}</option></select></label><label className="full">{tx("Explain why you are appealing")} <em>*</em><textarea rows={7} maxLength={3000} value={description} onChange={e => setDescription(e.target.value)} placeholder={tx("Describe what happened and what you would like reviewed.")} /><small className="counter">{description.length}{tx("/3000 characters")}</small></label><button className="inline-link full" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(tx('Explain why you are appealing in simple, clear language.')))}><Volume2 size={17} /> {tx("Listen to instructions")}</button></div>}{step === 3 && <div className="upload-area"><Upload size={28} /><h3>{tx("Add supporting documents (optional)")}</h3><p>{tx("Attach a PDF document, such as the response you received. Maximum size 1 MB.")}</p><label className="upload-button">{tx("Choose a PDF file")}<input type="file" accept="application/pdf,.pdf" onChange={e => {
            const f = e.target.files?.[0];
            if (f && (f.type !== 'application/pdf' || f.size > 1024 * 1024)) {
              setError(tx('Choose a PDF file smaller than 1 MB.'));
            } else setFile(f || null);
          }} /></label>{file && <div className="uploaded-file"><FileText /><span>{file.name}<small>{tx("Ready to attach")}</small></span><button onClick={() => setFile(null)}>{tx("Remove")}</button></div>}</div>}{step === 4 && <div className="review-sections"><ReviewSection title={tx("Original RTI application")} edit={() => setStep(0)}><b>{original?.id}</b><span>{original?.authority} · {original?.date}</span></ReviewSection><ReviewSection title={tx("Response details")} edit={() => setStep(1)}><span>{response}</span></ReviewSection><ReviewSection title={tx("Grounds for appeal")} edit={() => setStep(2)}><b>{reason}</b><span>{description}</span></ReviewSection><ReviewSection title={tx("Supporting documents")} edit={() => setStep(3)}><span>{file?.name || 'No documents attached'}</span></ReviewSection><label className="declaration"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /> {tx("I confirm that the information in this appeal is correct.")} <em>*</em></label><Banner kind="warning" title={tx("Review before you submit")}>{tx("This is a demonstration. No official appeal will be filed.")}</Banner></div>}{error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions">{step > 0 ? <Button kind="secondary" onClick={() => setStep(step - 1)}><ArrowLeft size={17} /> {tx("Back")}</Button> : <Link className="inline-link" to="/">{tx("Save and exit")}</Link>}{step < 4 ? <Button onClick={next}>{tx("Continue")} <ArrowRight size={17} /></Button> : <Button onClick={submit}>{tx("Submit first appeal")} <ArrowRight size={17} /></Button>}</div></div></div>;
}
export function Notifications() {
  const {
    notices,
    setNotices
  } = useStore();
  const [filter, setFilter] = useState('All notifications');
  const filtered = notices.filter(n => filter === 'All notifications' || filter === 'Unread' && n.unread || n.kind.toLowerCase().includes(filter.toLowerCase()));
  const mark = (id: string) => setNotices(ns => ns.map(n => n.id === id ? {
    ...n,
    unread: false
  } : n));
  return <div className="content"><PageHeading eyebrow={tx("YOUR UPDATES")} title={tx("Notifications")} subtitle={tx("Stay informed about requests, appeals and actions to take.")} /><div className="notification-filters">{['All notifications', 'Unread', 'Application updates', 'Appeal updates', 'Action required', 'Payment updates'].map(x => <button className={filter === x ? 'selected' : ''} key={x} onClick={() => setFilter(x)}>{x}</button>)}</div><div className="notification-list">{filtered.map(n => <article className={`notification-card ${n.unread ? 'unread' : ''}`} key={n.id}><span className="notification-icon"><Bell size={19} /></span><div className="notification-copy"><div className="notification-title"><h3>{n.title}</h3>{n.unread && <span className="unread-tag">{tx("New")}</span>}</div><p>{n.body}</p><small>{n.date} · {n.kind}</small><div className="notification-actions">{n.applicationId && <Link className="inline-link" to={`/application/${encodeURIComponent(n.applicationId)}`}>{tx("View application")} <ArrowRight size={15} /></Link>}{n.unread && <button className="inline-link" onClick={() => mark(n.id)}>{tx("Mark as read")}</button>}</div></div></article>)}{!filtered.length && <EmptyState title={tx("You are all caught up")} body={tx("There are no notifications in this category.")} />}</div></div>;
}
export function Help() {
  return <div className="content"><PageHeading eyebrow={tx("HELP CENTRE")} title={tx("How can we help?")} subtitle={tx("Simple guides for every step of your RTI journey.")} /><div className="help-grid"><Link to="/new-request" className="help-card"><span className="service-icon"><FilePlus2 /></span><h2>{tx("Submit an RTI request")}</h2><p>{tx("Learn what you can ask for and how to submit your request.")}</p><span className="link">{tx("Read the guide")} <ArrowRight size={16} /></span></Link><Link to="/appeal" className="help-card"><span className="service-icon"><ArrowRight /></span><h2>{tx("File a first appeal")}</h2><p>{tx("What to do if you have not received a response or are not satisfied.")}</p><span className="link">{tx("Read the guide")} <ArrowRight size={16} /></span></Link><Link to="/track" className="help-card"><span className="service-icon"><Clock3 /></span><h2>{tx("Track applications")}</h2><p>{tx("Understand application statuses and follow progress.")}</p><span className="link">{tx("Read the guide")} <ArrowRight size={16} /></span></Link></div><section className="card faq-section"><h2>{tx("Frequently asked questions")}</h2>{[['What is the Right to Information Act?', 'The RTI Act helps citizens request information held by public authorities. This workspace supports requests to Central Government authorities.'], ['How long does it take to get a response?', 'Public authorities usually respond within 30 days. Some requests may have different time limits under the Act.'], ['What if I do not receive a response?', 'You can file a first appeal with the First Appellate Authority. Select the original application in the appeal form to get started.'], ['Can I save my application and finish later?', 'Your form progress is saved on this device while you work. Submitted applications are kept in your workspace.']].map(([q, a]) => <details key={q}><summary>{q}<ChevronRight /></summary><p>{a}</p></details>)}</section><section id="contact" className="card contact-card"><Headphones /><div><h2>{tx("Contact support")}</h2><p>{tx("Need help using the portal? Our support team can guide you through the process.")}</p><a href="mailto:support@rtionline.gov.in">{tx("support@rtionline.gov.in")}</a><span className="muted"> {tx("· Monday to Friday, 9:00 am–5:00 pm")}</span></div></section></div>;
}
export function AccessibilitySettings() {
  const {
    largeText,
    setLargeText,
    contrast,
    setContrast,
    language,
    setLanguage
  } = useStore();
  const [spoken, setSpoken] = useState(false);
  return <div className="content"><PageHeading eyebrow={tx("PERSONALISE YOUR WORKSPACE")} title={tx("Language & accessibility")} subtitle={tx("Adjust how information is displayed and choose your preferred language.")} /><div className="settings-layout"><section className="card settings-card"><h2>{tx("Reading preferences")}</h2><p>{tx("Choose the settings that make this workspace easier to use.")}</p><div className="setting-row"><div><b>{tx("Larger text")}</b><small>{tx("Increase the size of body text across the workspace.")}</small></div><button role="switch" aria-checked={largeText} className={`switch ${largeText ? 'on' : ''}`} onClick={() => setLargeText(!largeText)}><i /></button></div><div className="setting-row"><div><b>{tx("High contrast")}</b><small>{tx("Use stronger borders and darker text for visibility.")}</small></div><button role="switch" aria-checked={contrast} className={`switch ${contrast ? 'on' : ''}`} onClick={() => setContrast(!contrast)}><i /></button></div><label className="setting-select">{tx("Preferred language")}<select value={language} onChange={e => setLanguage(e.target.value)}>{languageOptions.map(option => <option key={option.code} value={option.code}>{option.nativeName}</option>)}</select><small>{tx("Your selection is saved on this device.")}</small></label><div className="setting-row"><div><b>{tx("Audio instructions")}</b><small>{tx("Listen to a short explanation of how RTI requests work.")}</small></div><button className="btn secondary" onClick={() => {
            setSpoken(true);
            window.speechSynthesis?.speak(new SpeechSynthesisUtterance(tx('An RTI request asks a public authority to share records or information. Choose the authority, describe what information you need, and review your request before submitting.')));
          }}><Volume2 size={17} /> {tx("Listen")}</button></div>{spoken && <p className="muted">{tx("Audio instructions started. You can pause them using your device controls.")}</p>}</section><aside className="card accessibility-preview"><div className="preview-label">{tx("PREVIEW")}</div><h2>{tx("Your request, all in one place")}</h2><p>{tx("This is how the page text appears with your selected settings.")}</p><div className="preview-status"><span className="secure-dot" /> {tx("Application under process")}</div><button className="btn primary">{tx("Continue")} <ArrowRight size={16} /></button></aside></div><Banner title={tx("Keyboard and screen reader support")}>{tx("Use Tab to move between controls and Enter or Space to select. Form errors and status updates are announced to assistive technology.")}</Banner></div>;
}
