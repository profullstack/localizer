import { describe, it, expect, beforeEach } from 'vitest';
import { Localizer, _t, localizer as defaultLocalizer } from './index';

describe('Localizer', () => {
  let localizer: Localizer;

  beforeEach(() => {
    // Create a fresh instance for each test
    localizer = new Localizer({
      defaultLanguage: 'en',
      fallbackLanguage: 'en'
    });

    // Load some test translations
    localizer.loadTranslations('en', {
      'hello': 'Hello',
      'welcome': 'Welcome to our application',
      'greeting': 'Hello, ${name}!',
      'items_zero': 'No items',
      'items_one': 'One item',
      'items_other': '${count} items',
      'order_total': 'Order total: ${total}'
    });

    localizer.loadTranslations('fr', {
      'hello': 'Bonjour',
      'welcome': 'Bienvenue dans notre application',
      'greeting': 'Bonjour, ${name} !',
      'items_zero': 'Aucun élément',
      'items_one': 'Un élément',
      'items_other': '${count} éléments',
      'order_total': 'Total de la commande : ${total}'
    });
  });

  describe('Basic functionality', () => {
    it('should set and get the current language', () => {
      localizer.setLanguage('fr');
      expect(localizer.getLanguage()).toBe('fr');
    });

    it('should return available languages', () => {
      expect(localizer.getAvailableLanguages()).toEqual(['en', 'fr']);
    });

    it('should translate basic strings', () => {
      localizer.setLanguage('en');
      expect(localizer.translate('hello')).toBe('Hello');
      expect(localizer.translate('welcome')).toBe('Welcome to our application');

      localizer.setLanguage('fr');
      expect(localizer.translate('hello')).toBe('Bonjour');
      expect(localizer.translate('welcome')).toBe('Bienvenue dans notre application');
    });

    it('should fall back to default language if translation not found', () => {
      localizer.setLanguage('fr');
      
      // Add a key only in English
      localizer.loadTranslations('en', {
        'english_only': 'This is only in English'
      });
      
      expect(localizer.translate('english_only')).toBe('This is only in English');
    });

    it('should return the key if no translation found', () => {
      expect(localizer.translate('non_existent_key')).toBe('non_existent_key');
    });
  });

  describe('Interpolation', () => {
    it('should interpolate values', () => {
      localizer.setLanguage('en');
      expect(localizer.translate('greeting', { name: 'John' })).toBe('Hello, John!');
      expect(localizer.translate('order_total', { total: '$42.99' })).toBe('Order total: $42.99');

      localizer.setLanguage('fr');
      expect(localizer.translate('greeting', { name: 'John' })).toBe('Bonjour, John !');
      expect(localizer.translate('order_total', { total: '$42.99' })).toBe('Total de la commande : $42.99');
    });

    it('should handle missing interpolation values', () => {
      localizer.setLanguage('en');
      expect(localizer.translate('greeting')).toBe('Hello, ${name}!');
    });

    it('should support custom interpolation delimiters', () => {
      const customLocalizer = new Localizer({
        interpolationStart: '{{',
        interpolationEnd: '}}'
      });

      customLocalizer.loadTranslations('en', {
        'custom_greeting': 'Hello, {{name}}!'
      });

      expect(customLocalizer.translate('custom_greeting', { name: 'John' })).toBe('Hello, John!');
    });
  });

  describe('Pluralization', () => {
    it('should handle pluralization based on count', () => {
      localizer.setLanguage('en');
      expect(localizer.translate('items', { count: 0 })).toBe('No items');
      expect(localizer.translate('items', { count: 1 })).toBe('One item');
      expect(localizer.translate('items', { count: 5 })).toBe('5 items');

      localizer.setLanguage('fr');
      expect(localizer.translate('items', { count: 0 })).toBe('Aucun élément');
      expect(localizer.translate('items', { count: 1 })).toBe('Un élément');
      expect(localizer.translate('items', { count: 5 })).toBe('5 éléments');
    });
  });

  describe('Default instance and _t function', () => {
    it('should provide a working default instance', () => {
      // Reset the default localizer
      defaultLocalizer.loadTranslations('en', {
        'test': 'Test'
      });
      defaultLocalizer.setLanguage('en');
      
      expect(_t('test')).toBe('Test');
    });
  });
});