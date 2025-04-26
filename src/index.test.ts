/**
 * Tests for the @profullstack/localizer package
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { localizer, _t, Localizer } from './index';

describe('Localizer', () => {
  // Reset localizer before each test
  beforeEach(() => {
    // Create a new instance to reset state
    const newLocalizer = new Localizer();
    Object.assign(localizer, newLocalizer);
  });

  describe('loadTranslations', () => {
    it('should load translations for a language', () => {
      localizer.loadTranslations('en', {
        'greeting': 'Hello',
        'farewell': 'Goodbye'
      });

      expect(localizer.getAvailableLanguages()).toContain('en');
      expect(_t('greeting')).toBe('Hello');
    });

    it('should merge translations for the same language', () => {
      localizer.loadTranslations('en', { 'greeting': 'Hello' });
      localizer.loadTranslations('en', { 'farewell': 'Goodbye' });

      expect(_t('greeting')).toBe('Hello');
      expect(_t('farewell')).toBe('Goodbye');
    });

    it('should override existing translations for the same key', () => {
      localizer.loadTranslations('en', { 'greeting': 'Hello' });
      localizer.loadTranslations('en', { 'greeting': 'Hi' });

      expect(_t('greeting')).toBe('Hi');
    });
  });

  describe('setLanguage', () => {
    beforeEach(() => {
      localizer.loadTranslations('en', {
        'greeting': 'Hello',
        'farewell': 'Goodbye'
      });
      
      localizer.loadTranslations('fr', {
        'greeting': 'Bonjour',
        'farewell': 'Au revoir'
      });
    });

    it('should set the current language', () => {
      localizer.setLanguage('fr');
      expect(localizer.getLanguage()).toBe('fr');
      expect(_t('greeting')).toBe('Bonjour');
    });

    it('should use fallback language if the language is not available', () => {
      localizer.setLanguage('de');
      expect(localizer.getLanguage()).toBe('en'); // Default fallback
      expect(_t('greeting')).toBe('Hello');
    });
  });

  describe('translate', () => {
    beforeEach(() => {
      localizer.loadTranslations('en', {
        'greeting': 'Hello',
        'welcome': 'Welcome, ${name}!',
        'items_one': 'You have ${count} item.',
        'items_other': 'You have ${count} items.',
        'nested.key': 'Nested key'
      });
      
      localizer.loadTranslations('fr', {
        'greeting': 'Bonjour',
        'welcome': 'Bienvenue, ${name}!',
        'items_one': 'Vous avez ${count} article.',
        'items_other': 'Vous avez ${count} articles.',
        'nested.key': 'Clé imbriquée'
      });
      
      localizer.setLanguage('en');
    });

    it('should translate a simple key', () => {
      expect(_t('greeting')).toBe('Hello');
    });

    it('should handle interpolation', () => {
      expect(_t('welcome', { name: 'John' })).toBe('Welcome, John!');
    });

    it('should handle pluralization', () => {
      expect(_t('items', { count: 1 })).toBe('You have 1 item.');
      expect(_t('items', { count: 5 })).toBe('You have 5 items.');
    });

    it('should handle nested keys', () => {
      expect(_t('nested.key')).toBe('Nested key');
    });

    it('should fall back to the key if translation is not found', () => {
      expect(_t('missing.key')).toBe('missing.key');
    });

    it('should allow overriding the language', () => {
      expect(_t('greeting', { language: 'fr' })).toBe('Bonjour');
    });
  });

  describe('getAvailableLanguages', () => {
    it('should return an array of available languages', () => {
      localizer.loadTranslations('en', { 'greeting': 'Hello' });
      localizer.loadTranslations('fr', { 'greeting': 'Bonjour' });
      localizer.loadTranslations('de', { 'greeting': 'Hallo' });

      const languages = localizer.getAvailableLanguages();
      expect(languages).toContain('en');
      expect(languages).toContain('fr');
      expect(languages).toContain('de');
      expect(languages.length).toBe(3);
    });
  });

  describe('custom options', () => {
    it('should allow custom interpolation delimiters', () => {
      const customLocalizer = new Localizer({
        interpolationStart: '{{',
        interpolationEnd: '}}'
      });

      customLocalizer.loadTranslations('en', {
        'welcome': 'Welcome, {{name}}!'
      });

      customLocalizer.setLanguage('en');
      expect(customLocalizer.translate('welcome', { name: 'John' })).toBe('Welcome, John!');
    });

    it('should allow custom default and fallback languages', () => {
      const customLocalizer = new Localizer({
        defaultLanguage: 'fr',
        fallbackLanguage: 'fr'
      });

      customLocalizer.loadTranslations('fr', {
        'greeting': 'Bonjour'
      });

      expect(customLocalizer.getLanguage()).toBe('fr');
      expect(customLocalizer.translate('greeting')).toBe('Bonjour');
    });
  });
});