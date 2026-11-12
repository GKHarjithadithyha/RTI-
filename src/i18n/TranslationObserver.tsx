import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguage } from './index';

type SavedText = { source: string; rendered: string };
const textSource = new WeakMap<Text, SavedText>();
const attrSource = new WeakMap<Element, Map<string, SavedText>>();
const translatedAttrs = ['placeholder', 'aria-label', 'title'];

function recoverSource(value: string, code: string, instance: any) {
  const bundle = instance.getResourceBundle(code, 'translation') as Record<string, unknown> | undefined;
  if (bundle) {
    for (const [source, translated] of Object.entries(bundle)) {
      if (translated === value) return source;
    }
  }
  return value;
}

function localize(source: string, t: any, locale: string, scope?: Element | null) {
  const number = (value: string) => new Intl.NumberFormat(locale).format(Number(value));
  const step = source.match(/^STEP\s+(\d+)\s+OF\s+(\d+)$/i);
  if (step) return t('Step {{current}} of {{total}}', { current: number(step[1]), total: number(step[2]) });
  const updates = source.match(/^(\d+) new updates$/);
  if (updates) return `${number(updates[1])} ${t('new updates')}`;
  const count = source.match(/^(\d+)\s*\/(\d+) characters$/);
  if (count) return `${number(count[1])} /${number(count[2])} ${t('characters')}`;
  if (/^\d+$/.test(source) && scope?.closest('.notification-dot, .notification-pill, .counter')) return number(source);
  const lastUpdated = source.match(/^Last updated\s+(.*)$/);
  if (lastUpdated) return `${t('Last updated')} ${localizeDate(lastUpdated[1], locale)}`;
  if (/^\d{1,2} [A-Z][a-z]{2} 20\d{2}$/.test(source)) return localizeDate(source, locale);
  return t(source);
}

function localizeDate(value: string, locale: string) {
  const match = value.match(/^(\d{1,2}) ([A-Z][a-z]{2}) (20\d{2})$/);
  if (!match) return value;
  const date = new Date(`${match[2]} ${match[1]}, ${match[3]} 12:00:00`);
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function TranslationObserver() {
  const { t, i18n } = useTranslation();
  const previousLanguage = useRef(i18n.resolvedLanguage || i18n.language);
  useEffect(() => {
    const language = getLanguage(i18n.resolvedLanguage || i18n.language);
    const sourceLanguage = previousLanguage.current;
    document.documentElement.lang = language.locale;
    document.documentElement.dir = language.code === 'ur' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl-layout', language.code === 'ur');

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node as Text;
        const current = text.nodeValue || '';
        const trimmed = current.trim();
        if (!trimmed || /^(RTI\/|https?:)/.test(trimmed)) return;
        const saved = textSource.get(text);
        const source = saved && saved.rendered === current ? saved.source : recoverSource(trimmed, sourceLanguage, i18n);
        const leading = current.match(/^\s*/)?.[0] || '';
        const trailing = current.match(/\s*$/)?.[0] || '';
        const renderedText = localize(source, t, language.locale, text.parentElement);
        const rendered = `${leading}${renderedText}${trailing}`;
        textSource.set(text, { source, rendered });
        if (current !== rendered) text.nodeValue = rendered;
        return;
      }
      if (!(node instanceof Element) || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.tagName)) return;
      const attrs = attrSource.get(node) || new Map<string, SavedText>();
      for (const name of translatedAttrs) {
        const current = node.getAttribute(name);
        if (!current) continue;
        const saved = attrs.get(name);
        const source = saved && saved.rendered === current ? saved.source : recoverSource(current, sourceLanguage, i18n);
        const rendered = localize(source, t, language.locale);
        attrs.set(name, { source, rendered });
        if (current !== rendered) node.setAttribute(name, rendered);
      }
      attrSource.set(node, attrs);
      for (const child of Array.from(node.childNodes)) translateNode(child);
    };

    const translatePage = () => {
      const root = document.querySelector('#root');
      if (root) translateNode(root);
    };
    translatePage();
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData' && record.target.parentNode) translateNode(record.target);
        record.addedNodes.forEach(translateNode);
        if (record.type === 'attributes') translateNode(record.target);
      }
    });
    const root = document.querySelector('#root');
    if (root) observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: translatedAttrs });
    previousLanguage.current = language.code;
    return () => observer.disconnect();
  }, [i18n, i18n.language, t]);
  return null;
}
