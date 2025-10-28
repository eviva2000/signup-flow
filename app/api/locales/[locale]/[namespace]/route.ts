import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { isValidLocale, defaultLocale } from '@/lib/i18n/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string; namespace: string }> }
) {
  const { locale, namespace } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  // Validate namespace (basic security check)
  if (!/^[a-zA-Z0-9_-]+$/.test(namespace)) {
    return NextResponse.json({ error: 'Invalid namespace' }, { status: 400 });
  }

  try {
    // Try to read the requested translation file
    const filePath = join(process.cwd(), 'public', 'locales', locale, `${namespace}.json`);
    const content = await readFile(filePath, 'utf-8');
    const translations = JSON.parse(content);

    return NextResponse.json(translations, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.warn(`Failed to load translation file: ${locale}/${namespace}.json`);

    // If the requested locale is not the default, try to fallback to default locale
    if (locale !== defaultLocale) {
      try {
        const fallbackPath = join(process.cwd(), 'public', 'locales', defaultLocale, `${namespace}.json`);
        const fallbackContent = await readFile(fallbackPath, 'utf-8');
        const fallbackTranslations = JSON.parse(fallbackContent);

        return NextResponse.json(fallbackTranslations, {
          headers: {
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
            'Content-Type': 'application/json',
            'X-Fallback-Locale': defaultLocale,
          },
        });
      } catch (fallbackError) {
        console.error(`Failed to load fallback translation file: ${defaultLocale}/${namespace}.json`);
      }
    }

    return NextResponse.json({ error: 'Translation file not found' }, { status: 404 });
  }
}