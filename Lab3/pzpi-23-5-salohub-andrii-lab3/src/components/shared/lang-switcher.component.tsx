import { useLocale, type Lang } from '@/hooks/use-locale.hook';

const LANGS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'ua', label: 'UA' },
];

const LangSwitcher = () => {
  const { lang, switchLang } = useLocale();

  return (
    <div className='flex items-center gap-1 border rounded-lg p-1'>
      {LANGS.map(language => (
        <button
          key={language.value}
          onClick={() => switchLang(language.value)}
          className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
            lang === language.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
};

export default LangSwitcher;
