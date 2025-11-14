'use client';

import React from 'react';

import CookieConsent from 'vanilla-cookieconsent';

import 'vanilla-cookieconsent/dist/cookieconsent.css';
import './styles.css';

import { cookieConsentConfig } from './cookieconsent-config';

export function CookieConsentComponent() {
  React.useEffect(() => {
    // Initialize CookieConsent
    CookieConsent.run(cookieConsentConfig);

    // Add click event listener for data-cc attribute
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const ccAction = target.dataset.cc;

      if (ccAction === 'show-preferencesModal') {
        e.preventDefault();
        CookieConsent.showPreferences();
      } else if (ccAction === 'show-consentModal') {
        e.preventDefault();
        CookieConsent.show();
      }
    };

    document.addEventListener('click', handleClick);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // This component doesn't render anything visible
  // CookieConsent creates its own DOM elements
  return null;
}

// Export utility functions for use outside the component
export const cookieConsentUtils = {
  showPreferences: () => CookieConsent.showPreferences(),
  acceptCategory: (categories: string[]) =>
    CookieConsent.acceptCategory(categories),
  acceptedCategory: (category: string) =>
    CookieConsent.acceptedCategory(category),
  validCookie: (cookieName: string) => CookieConsent.validCookie(cookieName),
  eraseCookies: (cookies: string[]) => CookieConsent.eraseCookies(cookies),
  loadScript: (src: string, attrs?: Record<string, string>) =>
    CookieConsent.loadScript(src, attrs),
};
