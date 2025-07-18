import { useState } from 'react';
import { languages } from '@/models/languages';
import { AutoComplete } from './Autocomplete';
import { useTranslation } from 'react-i18next';

export function LanguageSelect({
  value,
  onChange,
  className,
}: {
  value?: string;
  onChange: (code: string) => void;
  className?: string;
}) {
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();
  return (
    <AutoComplete
      selectedValue={value || ''}
      className={className}
      items={languages
        .filter((l) =>
          [l.code, l.english, l.native, `${l.native} (${l.english})`].some((v) =>
            v.toLowerCase().includes(searchValue.toLowerCase()),
          ),
        )
        .map((l) => ({ value: l.code, label: `${l.native} (${l.english})` }))}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      onSelectedValueChange={onChange}
      placeholder={t('language.placeholder')}
    />
  );
}
