# @profullstack/localizer

A simple and lightweight internationalization (i18n) and localization (l10n) library for JavaScript applications.

## Features

- Simple API for translating text
- Support for multiple languages
- Fallback to default language when a translation is missing
- Interpolation of variables in translations
- Support for pluralization
- Works in both browser and Node.js environments
- No dependencies
- Tiny footprint (~2KB minified and gzipped)

## Installation

```bash
# Using npm
npm install @profullstack/localizer

# Using yarn
yarn add @profullstack/localizer

# Using pnpm
pnpm add @profullstack/localizer
```

## Usage

### Basic Usage

```javascript
import { localizer, _t } from '@profullstack/localizer';

// Load translations
localizer.loadTranslations('en', {
  'greeting': 'Hello',
  'farewell': 'Goodbye'
});

localizer.loadTranslations('fr', {
  'greeting': 'Bonjour',
  'farewell': 'Au revoir'
});

// Set the current language
localizer.setLanguage('en');

// Translate text
console.log(_t('greeting')); // Output: Hello

// Change language
localizer.setLanguage('fr');
console.log(_t('greeting')); // Output: Bonjour
```

### Nested Translations

The library supports nested translation objects, but they need to be flattened before loading:

```javascript
// Nested translations
const enTranslations = {
  'navigation': {
    'home': 'Home',
    'about': 'About',
    'contact': 'Contact'
  },
  'errors': {
    'not_found': 'Page not found'
  }
};

// Flatten the translations
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    
    return acc;
  }, {});
}

// Load the flattened translations
localizer.loadTranslations('en', flattenObject(enTranslations));

// Use the flattened keys
console.log(_t('navigation.home')); // Output: Home
console.log(_t('errors.not_found')); // Output: Page not found
```

### Interpolation

You can include variables in your translations using the `${variable}` syntax:

```javascript
// Load translations with variables
localizer.loadTranslations('en', {
  'welcome': 'Welcome, ${name}!',
  'items_count': 'You have ${count} items in your cart.'
});

// Translate with variables
console.log(_t('welcome', { name: 'John' })); // Output: Welcome, John!
console.log(_t('items_count', { count: 5 })); // Output: You have 5 items in your cart.
```

### Pluralization

You can handle pluralization by using the `count` parameter and defining separate translations for singular and plural forms:

```javascript
// Load translations with pluralization
localizer.loadTranslations('en', {
  'items_one': 'You have ${count} item in your cart.',
  'items_other': 'You have ${count} items in your cart.'
});

// Translate with pluralization
console.log(_t('items', { count: 1 })); // Output: You have 1 item in your cart.
console.log(_t('items', { count: 5 })); // Output: You have 5 items in your cart.
```

### Loading Translations from JSON Files

In a browser environment, you can load translations from JSON files:

```javascript
// Load translations from JSON files
async function initI18n() {
  await localizer.loadTranslationsFromUrl('en', '/i18n/en.json');
  await localizer.loadTranslationsFromUrl('fr', '/i18n/fr.json');
  
  // Set initial language based on browser preference
  const browserLang = navigator.language.split('-')[0];
  if (['en', 'fr'].includes(browserLang)) {
    localizer.setLanguage(browserLang);
  } else {
    localizer.setLanguage('en'); // Default language
  }
}

// Initialize i18n
initI18n();
```

### HTML Integration

You can use data attributes to translate HTML elements:

```html
<span data-i18n="greeting"></span>
<span data-i18n="welcome" data-i18n-params='{"name":"John"}'></span>
```

```javascript
// Translate all elements with data-i18n attribute
function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    
    // Check for params
    const paramsAttr = element.getAttribute('data-i18n-params');
    if (paramsAttr) {
      const params = JSON.parse(paramsAttr);
      element.textContent = _t(key, params);
    } else {
      element.textContent = _t(key);
    }
  });
}

// Call translatePage() after loading translations and when language changes
```

## API Reference

### localizer

The main object that provides the localization functionality.

#### Methods

- `loadTranslations(language, translations)`: Load translations for a language
- `loadTranslationsFromUrl(language, url)`: Load translations from a JSON file (browser only)
- `setLanguage(language)`: Set the current language
- `getLanguage()`: Get the current language
- `getAvailableLanguages()`: Get an array of available languages
- `translate(key, options)`: Translate a key with options

### _t(key, options)

A shorthand function for `localizer.translate(key, options)`.

#### Parameters

- `key`: The translation key
- `options`: An object with options:
  - `count`: For pluralization
  - `language`: Override the current language
  - Any other variables for interpolation

## License

MIT