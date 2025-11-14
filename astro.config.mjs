// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cookieconsent from '@jop-software/astro-cookieconsent';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    cookieconsent({
      disablePageInteraction: true,
      guiOptions: {
        consentModal: {
          layout: 'box inline',
          position: 'bottom center',
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'bar',
          position: 'left',
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          readOnly: true,
        },
        functionality: {},
      },
      language: {
        default: 'it',
        autoDetect: 'browser',
        translations: {
          en: {
            consentModal: {
              title: "Hello traveller, it's cookie time!",
              description:
                'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept all", you consent to our use of cookies.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences',
              footer:
                '<a href="/privacy-policy">Privacy Policy</a>\n<a href="/terms">Terms and conditions</a>',
            },
            preferencesModal: {
              title: 'Consent Preferences Center',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close modal',
              serviceCounterLabel: 'Service|Services',
              sections: [
                {
                  title: 'Cookie Usage',
                  description:
                    'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.',
                },
                {
                  title:
                    'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
                  description:
                    'These cookies are essential for the proper functioning of the website and cannot be disabled.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Functionality Cookies',
                  description:
                    'These cookies allow the website to provide enhanced functionality and personalization. They may be set by us or by third party providers.',
                  linkedCategory: 'functionality',
                },
                {
                  title: 'More information',
                  description:
                    'For any query in relation to my policy on cookies and your choices, please <a class="cc__link" href="/contact">contact me</a>.',
                },
              ],
            },
          },
          it: {
            consentModal: {
              title: 'Ciao viaggiatore, è tempo di cookie!',
              description:
                "Utilizziamo i cookie per migliorare la tua esperienza di navigazione, fornire contenuti personalizzati e analizzare il nostro traffico. Cliccando su 'Accetta tutto', acconsenti all'uso dei cookie.",
              acceptAllBtn: 'Accetta tutto',
              acceptNecessaryBtn: 'Rifiuta tutto',
              showPreferencesBtn: 'Gestisci preferenze',
              footer:
                '<a href="/privacy-policy">Informativa sulla privacy</a>\n<a href="/terms">Termini e condizioni</a>',
            },
            preferencesModal: {
              title: 'Centro preferenze per il consenso',
              acceptAllBtn: 'Accetta tutto',
              acceptNecessaryBtn: 'Rifiuta tutto',
              savePreferencesBtn: 'Salva le preferenze',
              closeIconLabel: 'Chiudi la finestra',
              serviceCounterLabel: 'Servizi',
              sections: [
                {
                  title: 'Utilizzo dei Cookie',
                  description:
                    'Utilizziamo i cookie per migliorare la tua esperienza di navigazione, fornire contenuti personalizzati e analizzare il nostro traffico.',
                },
                {
                  title:
                    'Cookie Strettamente Necessari <span class="pm__badge">Sempre Attivati</span>',
                  description:
                    'Questi cookie sono essenziali per il corretto funzionamento del sito web e non possono essere disabilitati.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Cookie di Funzionalità',
                  description:
                    'Questi cookie consentono al sito web di fornire funzionalità avanzate e personalizzazione. Possono essere impostati da noi o da fornitori di terze parti.',
                  linkedCategory: 'functionality',
                },
                {
                  title: 'Ulteriori informazioni',
                  description:
                    'Per qualsiasi domanda relativa alla nostra politica sui cookie e alle tue scelte, per favore <a class="cc__link" href="/contact">contattami</a>.',
                },
              ],
            },
          },
        },
      },
    }),
  ],

  vite: {
    ssr: {
      external: ['@mui/material', '@emotion/react', '@emotion/styled'],
    },
  },
});
