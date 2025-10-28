import React, { forwardRef } from 'react';
import { Checkbox, CheckboxProps } from '@/components/ui';
import { useTranslations } from '@/lib/i18n';

export interface ConsentCheckboxProps extends Omit<CheckboxProps, 'label'> {
  type: 'terms' | 'privacy' | 'marketing';
  termsUrl?: string;
  privacyUrl?: string;
}

const ConsentCheckbox = forwardRef<HTMLInputElement, ConsentCheckboxProps>(
  ({ type, termsUrl = '/terms', privacyUrl = '/privacy', ...props }, ref) => {
    const { t } = useTranslations('signup');
    
    const getLabel = () => {
      switch (type) {
        case 'terms':
          return (
            <>
              {t('form.consents.terms.label')}{' '}
              <a
                href={termsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              >
                {t('form.consents.terms.link')}
              </a>
            </>
          );
        case 'privacy':
          return (
            <>
              {t('form.consents.privacy.label')}{' '}
              <a
                href={privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              >
                {t('form.consents.privacy.link')}
              </a>
            </>
          );
        case 'marketing':
          return t('form.consents.marketing.label');
        default:
          return '';
      }
    };

    const description = type === 'marketing' ? t('form.consents.marketing.description') : undefined;
    const checkboxProps = {
      ref,
      label: getLabel(),
      required: type === 'terms' || type === 'privacy',
      ...props,
      ...(description && { description }),
    };

    return <Checkbox {...checkboxProps} />;
  }
);

ConsentCheckbox.displayName = 'ConsentCheckbox';

export { ConsentCheckbox };