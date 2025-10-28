import React, { forwardRef } from 'react';
import { Select, SelectProps } from '@/components/ui';
import { COUNTRIES, getCountriesForLocale } from '@/lib/utils';
import { useTranslations } from '@/lib/i18n';

export interface CountrySelectProps extends Omit<SelectProps, 'options'> {
  locale?: 'da-DK' | 'en-GB';
}

const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(
  ({ locale, placeholder, ...props }, ref) => {
    const { t } = useTranslations('signup');
    
    const countries = getCountriesForLocale(locale);
    const options = countries.map(country => ({
      value: country.code,
      label: country.name,
    }));

    return (
      <Select
        ref={ref}
        options={options}
        placeholder={placeholder || t('form.country.placeholder')}
        {...props}
      />
    );
  }
);

CountrySelect.displayName = 'CountrySelect';

export { CountrySelect };