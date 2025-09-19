import { InjectionToken } from '@angular/core';

export interface YMaps3LoaderOptions {
  apiKey?: string;           // If omitted, you must provide a custom cdnUrl or skipCdn=true
  lang?: string;             // 'ru_RU' | 'en_US' | 'uz_UZ' | etc.
  query?: string;            // extra query string
  skipCdn?: boolean;         // do not inject <script>; expect global ymaps3
  cdnUrl?: string;           // custom URL for the loader
}

export const YMAPS3_LOADER_OPTIONS = new InjectionToken<YMaps3LoaderOptions>('YMAPS3_LOADER_OPTIONS');
