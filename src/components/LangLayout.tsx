import * as React from 'react';
import { Outlet, useParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS } from '../i18n/index';
import type { Lang } from '../i18n/index';

/**
 * Route layout that:
 *  1. Validates the :lang URL param.
 *  2. Syncs i18next to the URL language.
 *  3. Sets the <html lang> attribute via Helmet.
 *  4. Redirects invalid lang codes to /en/…
 */
export default function LangLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const validLang = (lang && (SUPPORTED_LANGS as readonly string[]).includes(lang))
    ? (lang as Lang)
    : null;

  React.useEffect(() => {
    if (!validLang) {
      // Redirect invalid lang prefix to /en/…
      const withoutLang = location.pathname.replace(/^\/[^/]*/, '');
      navigate(`/en${withoutLang || '/'}`, { replace: true });
      return;
    }
    if (i18n.language !== validLang) {
      i18n.changeLanguage(validLang);
    }
  }, [validLang, location.pathname]);

  // Prevent flash while the redirect effect runs
  if (!validLang) return null;

  return (
    <>
      <Helmet htmlAttributes={{ lang: validLang }} />
      <Outlet />
    </>
  );
}
