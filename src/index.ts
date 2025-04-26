/**
 * @profullstack/localizer
 * A simple localization and internationalization library
 */

// Types
export interface LocalizerOptions {
  defaultLanguage?: string;
  fallbackLanguage?: string;
  translations?: Record<string, Record<string, string>>;
  interpolationStart?: string;
  interpolationEnd?: string;
}

export interface TranslationOptions {
  [key: string]: any;
  count?: number;
  language?: string;
}

// Default options
const DEFAULT_OPTIONS: LocalizerOptions = {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  translations: {},
  interpolationStart: '${',
  interpolationEnd: '}'
};

class Localizer {
  private options: Required<LocalizerOptions>;
  private currentLanguage: string;
  
  constructor(options: LocalizerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options } as Required<LocalizerOptions>;
    this.currentLanguage = this.options.defaultLanguage;
  }

  /**
   * Load translations from a JSON object
   * @param language The language code
   * @param translations The translations object
   */
  public loadTranslations(language: string, translations: Record<string, string>): void {
    if (!this.options.translations[language]) {
      this.options.translations[language] = {};
    }
    
    this.options.translations[language] = {
      ...this.options.translations[language],
      ...translations
    };
  }

  /**
   * Set the current language
   * @param language The language code to set
   */
  public setLanguage(language: string): void {
    if (this.options.translations[language] || language === this.options.fallbackLanguage) {
      this.currentLanguage = language;
    } else {
      console.warn(`Language '${language}' not loaded, using fallback language '${this.options.fallbackLanguage}'`);
      this.currentLanguage = this.options.fallbackLanguage;
    }
  }

  /**
   * Get the current language
   * @returns The current language code
   */
  public getLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get available languages
   * @returns Array of available language codes
   */
  public getAvailableLanguages(): string[] {
    return Object.keys(this.options.translations);
  }

  /**
   * Translate a key
   * @param key The translation key
   * @param options Options for translation (interpolation values, count for pluralization, etc.)
   * @returns The translated string
   */
  public translate(key: string, options: TranslationOptions = {}): string {
    const language = options.language || this.currentLanguage;
    
    // Get translations for the current language
    const translations = this.options.translations[language] || {};
    
    // Try to get the translation
    let translation = translations[key];
    
    // If not found, try fallback language
    if (!translation && language !== this.options.fallbackLanguage) {
      const fallbackTranslations = this.options.translations[this.options.fallbackLanguage] || {};
      translation = fallbackTranslations[key];
    }
    
    // If still not found, return the key itself
    if (!translation) {
      console.warn(`Translation key '${key}' not found in '${language}' or fallback language`);
      return key;
    }
    
    // Handle pluralization if count is provided
    if (options.count !== undefined) {
      const pluralKey = `${key}_${options.count === 1 ? 'one' : 'other'}`;
      const pluralTranslation = translations[pluralKey] || 
                               (language !== this.options.fallbackLanguage ? 
                                 this.options.translations[this.options.fallbackLanguage]?.[pluralKey] : 
                                 undefined);
      
      if (pluralTranslation) {
        translation = pluralTranslation;
      }
    }
    
    // Handle interpolation
    return this.interpolate(translation, options);
  }

  /**
   * Replace interpolation placeholders with values
   * @param text The text with placeholders
   * @param values The values to interpolate
   * @returns The interpolated string
   */
  private interpolate(text: string, values: Record<string, any>): string {
    const { interpolationStart, interpolationEnd } = this.options;
    
    return text.replace(
      new RegExp(`${escapeRegExp(interpolationStart)}(\\w+)${escapeRegExp(interpolationEnd)}`, 'g'),
      (match, key) => {
        return values[key] !== undefined ? String(values[key]) : match;
      }
    );
  }

  /**
   * Load translations from a JSON file (browser environment)
   * @param language The language code
   * @param url The URL to the JSON file
   * @returns Promise that resolves when translations are loaded
   */
  public async loadTranslationsFromUrl(language: string, url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.statusText}`);
      }
      
      const translations = await response.json();
      this.loadTranslations(language, translations);
    } catch (error) {
      console.error(`Error loading translations for '${language}':`, error);
    }
  }
}

/**
 * Escape special characters in a string for use in a regular expression
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Create a singleton instance
const localizer = new Localizer();

/**
 * Translate function (shorthand for localizer.translate)
 */
export function _t(key: string, options: TranslationOptions = {}): string {
  return localizer.translate(key, options);
}

// Export the singleton and the class
export { localizer, Localizer };

// Default export for convenience
export default localizer;