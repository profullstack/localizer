/**
 * Node.js example for @profullstack/localizer
 * 
 * This example demonstrates how to use the localizer in a Node.js environment.
 */

// In a real application, you would import from your package
// const { Localizer, _t } = require('@profullstack/localizer');

// For this example, we'll assume the package is built and available locally
const { Localizer, _t } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

// Create a new instance (not using the singleton for this example)
const localizer = new Localizer({
  defaultLanguage: 'en',
  fallbackLanguage: 'en'
});

// Function to load translations from JSON files
function loadTranslationsFromFile(language, filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(data);
    localizer.loadTranslations(language, translations);
    console.log(`Loaded translations for ${language}`);
  } catch (error) {
    console.error(`Error loading translations for ${language}:`, error.message);
  }
}

// Load translations
const i18nDir = path.join(__dirname, 'i18n');
loadTranslationsFromFile('en', path.join(i18nDir, 'en.json'));
loadTranslationsFromFile('fr', path.join(i18nDir, 'fr.json'));
loadTranslationsFromFile('de', path.join(i18nDir, 'de.json'));

// Function to demonstrate translations
function demonstrateTranslations(language) {
  console.log('\n' + '='.repeat(50));
  localizer.setLanguage(language);
  console.log(`Current language: ${localizer.getLanguage()} (${_t('language')})`);
  console.log('='.repeat(50));
  
  // Basic translations
  console.log('\nBasic Translations:');
  console.log(`_t('hello') => ${_t('hello')}`);
  console.log(`_t('welcome') => ${_t('welcome')}`);
  
  // Interpolation
  console.log('\nInterpolation:');
  console.log(`_t('greeting', { name: 'John' }) => ${_t('greeting', { name: 'John' })}`);
  console.log(`_t('order_total', { total: '$42.99' }) => ${_t('order_total', { total: '$42.99' })}`);
  
  // Pluralization
  console.log('\nPluralization:');
  console.log(`_t('items', { count: 0 }) => ${_t('items', { count: 0 })}`);
  console.log(`_t('items', { count: 1 }) => ${_t('items', { count: 1 })}`);
  console.log(`_t('items', { count: 5 }) => ${_t('items', { count: 5 })}`);
  
  // Form elements
  console.log('\nForm Elements:');
  console.log(`_t('username') => ${_t('username')}`);
  console.log(`_t('password') => ${_t('password')}`);
  console.log(`_t('submit') => ${_t('submit')}`);
  console.log(`_t('cancel') => ${_t('cancel')}`);
}

// Demonstrate translations for each language
console.log('LOCALIZER NODE.JS EXAMPLE');
console.log('========================\n');

demonstrateTranslations('en');
demonstrateTranslations('fr');
demonstrateTranslations('de');

// Example of fallback behavior
console.log('\n' + '='.repeat(50));
console.log('Fallback Behavior:');
console.log('='.repeat(50));

// Try to set a language that doesn't exist
localizer.setLanguage('es');
console.log(`After setting to 'es', current language: ${localizer.getLanguage()}`);
console.log(`_t('hello') => ${_t('hello')}`);

// Try a key that doesn't exist
console.log(`_t('non_existent_key') => ${_t('non_existent_key')}`);