# @profullstack/localizer

A simple and lightweight localization and internationalization library for JavaScript applications. Works in both browser and Node.js environments.

## Features

- 🌐 Simple API for translations
- 🔄 Support for multiple languages
- 📝 String interpolation
- 🔢 Pluralization support
- 🌍 Browser and Node.js compatibility
- 🚀 Zero dependencies
- 📦 Small bundle size
- 🔧 TypeScript support

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
  'hello': 'Hello',
  'welcome': 'Welcome to our application'
});

localizer.loadTranslations('fr', {
  'hello': 'Bonjour',
  'welcome': 'Bienvenue dans notre application'
});

// Set the current language
localizer.setLanguage('en');

// Translate strings
console.log(_t('hello')); // Output: Hello
console.log(_t('welcome')); // Output: Welcome to our application

// Change language
localizer.setLanguage('fr');
console.log(_t('hello')); // Output: Bonjour
```

### Loading Translations from JSON Files

#### Browser

```javascript
import { localizer, _t } from '@profullstack/localizer';

// Load translations from JSON files
async function loadTranslations() {
  await Promise.all([
    localizer.loadTranslationsFromUrl('en', '/i18n/en.json'),
    localizer.loadTranslationsFromUrl('fr', '/i18n/fr.json')
  ]);
  
  // Set initial language
  localizer.setLanguage('en');
}

loadTranslations();
```

#### Node.js

```javascript
const { localizer, _t } = require('@profullstack/localizer');
const fs = require('fs');
const path = require('path');

// Load translations from JSON files
function loadTranslationsFromFile(language, filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const translations = JSON.parse(data);
  localizer.loadTranslations(language, translations);
}

loadTranslationsFromFile('en', path.join(__dirname, 'i18n', 'en.json'));
loadTranslationsFromFile('fr', path.join(__dirname, 'i18n', 'fr.json'));

// Set the current language
localizer.setLanguage('en');
```

### String Interpolation

```javascript
import { _t } from '@profullstack/localizer';

// Translation definition
// en.json: { "greeting": "Hello, ${name}!" }

// Usage
console.log(_t('greeting', { name: 'John' })); // Output: Hello, John!
```

### Pluralization

```javascript
import { _t } from '@profullstack/localizer';

// Translation definitions
// en.json:
// {
//   "items_zero": "No items",
//   "items_one": "One item",
//   "items_other": "${count} items"
// }

// Usage
console.log(_t('items', { count: 0 })); // Output: No items
console.log(_t('items', { count: 1 })); // Output: One item
console.log(_t('items', { count: 5 })); // Output: 5 items
```

### Browser Detection

```javascript
import { localizer } from '@profullstack/localizer';

// Set language based on browser preference
const browserLang = navigator.language.split('-')[0];
if (['en', 'fr', 'de'].includes(browserLang)) {
  localizer.setLanguage(browserLang);
} else {
  localizer.setLanguage('en'); // Fallback
}
```

### Creating a New Instance

If you need multiple independent instances of the localizer (for different parts of your application):

```javascript
import { Localizer } from '@profullstack/localizer';

const myLocalizer = new Localizer({
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  interpolationStart: '{{',
  interpolationEnd: '}}'
});

// Now use myLocalizer instead of the default instance
myLocalizer.loadTranslations('en', { /* translations */ });
myLocalizer.setLanguage('en');

// Create a custom translation function
const translate = (key, options) => myLocalizer.translate(key, options);
```

## API Reference

### Localizer Class

#### Constructor

```typescript
constructor(options?: LocalizerOptions)
```

Options:
- `defaultLanguage`: The default language to use (default: 'en')
- `fallbackLanguage`: The fallback language to use when a translation is not found (default: 'en')
- `translations`: Initial translations object (default: {})
- `interpolationStart`: The start delimiter for interpolation (default: '${')
- `interpolationEnd`: The end delimiter for interpolation (default: '}')

#### Methods

- `loadTranslations(language: string, translations: Record<string, string>): void`
  Load translations for a language

- `loadTranslationsFromUrl(language: string, url: string): Promise<void>`
  Load translations from a JSON file (browser only)

- `setLanguage(language: string): void`
  Set the current language

- `getLanguage(): string`
  Get the current language

- `getAvailableLanguages(): string[]`
  Get a list of available languages

- `translate(key: string, options?: TranslationOptions): string`
  Translate a key with optional interpolation and pluralization

### Global Functions

- `_t(key: string, options?: TranslationOptions): string`
  Shorthand function for translating strings using the default localizer instance

## Examples

Check out the examples directory for complete examples:

- [Browser Example](./examples/browser-example.html)
- [Node.js Example](./examples/node-example.js)

## License

MIT