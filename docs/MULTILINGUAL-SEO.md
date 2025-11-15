# Multilingual SEO Guide

This website is configured for multilingual support with Italian (IT) as the default language and English (EN) as an alternate language.

## Configuration

### Astro i18n Setup

In `astro.config.mjs`:

```javascript
i18n: {
  defaultLocale: 'it',
  locales: ['it', 'en'],
  routing: {
    prefixDefaultLocale: false, // Italian pages have no prefix (e.g., /)
  },
}
```

## SEO Features Implemented

### 1. **Canonical URLs**

Each page has a canonical URL to avoid duplicate content issues.

### 2. **Hreflang Tags**

Alternate language versions are specified using `hreflang` attributes:

- `hreflang="it"` - Italian version
- `hreflang="en"` - English version
- `hreflang="x-default"` - Default fallback (Italian)

### 3. **Open Graph Tags**

Social media sharing optimized with:

- `og:title`, `og:description`, `og:image`
- `og:locale` - Current page language
- `og:locale:alternate` - Available alternate languages

### 4. **Twitter Cards**

Optimized Twitter sharing with card meta tags.

### 5. **Additional SEO Meta Tags**

- Language specification
- Robots directives (index, follow)
- Author information

## URL Structure

### Italian (Default)

- Homepage: `/` or `/it`
- About: `/about` or `/it/about`

### English

- Homepage: `/en`
- About: `/en/about`

## Usage in Pages

When creating a multilingual page, specify the alternate URLs:

```astro
---
import Layout from '../layouts/Layout.astro';

const alternateUrls = {
  it: '/', // or '/it'
  en: '/en',
};
---

<Layout
  lang="it"
  title="Benvenuto"
  description="Descrizione in italiano"
  alternateUrls={alternateUrls}
  ogImage="/assets/custom-image.webp"
  Optional
  ogType="website"
  Optional
>
  <!-- Your content -->
</Layout>
```

## Layout Props

### Required Props

- `lang` - Language code ('it' or 'en')
- `alternateUrls` - Object mapping locales to URLs

### Optional Props

- `title` - Page title (appended with " | Davide Di Criscito")
- `description` - Page description for SEO
- `ogImage` - Open Graph image (defaults to '/assets/me/square.webp')
- `ogType` - Open Graph type (defaults to 'website')

## Best Practices

1. **Always provide alternate URLs** for each language version of a page
2. **Use consistent URL structures** across languages
3. **Translate all metadata** (title, description) for each language
4. **Keep the x-default** pointing to your primary language (Italian)
5. **Use absolute URLs** in alternateUrls when on different domains
6. **Maintain content parity** - all pages should exist in all languages when possible

## Cookie Consent Integration

The cookie consent is already configured for multilingual support in `astro.config.mjs` with:

- Default language: Italian
- Auto-detect: Browser language
- Translations for both IT and EN

## Testing SEO

### Google Search Console

- Submit both language versions of your sitemap
- Monitor indexing for each language

### Testing Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [hreflang Tags Testing Tool](https://technicalseo.com/tools/hreflang/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Future Enhancements

Consider adding:

1. **XML Sitemap** with language annotations
2. **JSON-LD structured data** for rich snippets
3. **Language switcher component** that maintains current page path
4. **Dynamic language detection** with redirect
5. **More languages** as needed
