import { tx } from "../i18n";
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight, Check, CircleAlert, Info, XCircle } from 'lucide-react';
export function Button({
  children,
  kind = 'primary',
  ...p
}: {
  children: ReactNode;
  kind?: 'primary' | 'secondary' | 'text' | 'danger';
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`btn ${kind}`} {...p}>{children}</button>;
}
export function PageHeading({
  title,
  subtitle,
  eyebrow
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return <div className="page-heading">{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>;
}
export function Status({
  value
}: {
  value: string;
}) {
  let cls = value === 'Disposed' ? 'success' : value === 'Action required' ? 'warning' : value === 'Under process' ? 'info' : 'neutral';
  return <span className={`status ${cls}`}><i />{value}</span>;
}
export function Banner({
  kind = 'info',
  title,
  children
}: {
  kind?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  children: ReactNode;
}) {
  const Icon = kind === 'success' ? Check : kind === 'error' ? XCircle : kind === 'warning' ? CircleAlert : Info;
  return <div role={kind === 'error' ? 'alert' : 'status'} className={`banner ${kind}`}><Icon size={21} /><div><b>{title}</b><div>{children}</div></div></div>;
}
export function EmptyState({
  title,
  body,
  action
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return <div className="empty-state"><div className="empty-icon"><ArrowRight /></div><h3>{title}</h3><p>{body}</p>{action}</div>;
}
