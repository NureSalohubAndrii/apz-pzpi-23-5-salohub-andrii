import { useTranslation } from 'react-i18next';

export type Lang = 'en' | 'ua';

const LOCALE_MAP: Record<Lang, string> = {
  en: 'en-US',
  ua: 'uk-UA',
};

export const useLocale = () => {
  const { i18n } = useTranslation();
  const lang = (i18n.language ?? 'en') as Lang;
  const locale = LOCALE_MAP[lang] ?? 'en-US';

  const switchLang = (next: Lang) => {
    void i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
    document.documentElement.setAttribute('lang', locale);
    document.documentElement.setAttribute('dir', 'ltr');
  };

  const formatDate = (value: string | Date) =>
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));

  const formatDateTime = (value: string | Date) =>
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));

  const formatNumber = (value: number) => new Intl.NumberFormat(locale).format(value);

  const formatCurrency = (value: number, currency = 'USD') =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

  const sortStrings = <T>(arr: T[], key: keyof T): T[] =>
    [...arr].sort((a, b) =>
      String(a[key]).localeCompare(String(b[key]), locale, { sensitivity: 'base' })
    );

  return {
    lang,
    locale,
    switchLang,
    formatDate,
    formatDateTime,
    formatNumber,
    formatCurrency,
    sortStrings,
  };
};
