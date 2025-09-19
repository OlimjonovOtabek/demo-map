import { Inject, Injectable, Optional, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { YMAPS3_LOADER_OPTIONS, YMaps3LoaderOptions } from './tokens';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ymaps3 {
    const ready: Promise<void>;
    class YMap {
      constructor(container: HTMLElement, options: any);
      addChild(child: any): void; removeChild(child: any): void; destroy(): void;
    }
    class YMapDefaultSchemeLayer { constructor(opts?: any); }
    class YMapDefaultFeaturesLayer { constructor(opts?: any); }
    class YMapMarker {
      constructor(opts: { coordinates: [number, number]; draggable?: boolean }, element?: HTMLElement);
      setCoordinates(c: [number, number]): void;
    }
    class YMapFeature { constructor(opts: { geometry: any; style?: any; properties?: any }); }
  }
}

@Injectable({ providedIn: 'root' })
export class YMaps3LoaderService {
  private _loading?: Promise<typeof ymaps3>;
  private platformId = inject(PLATFORM_ID);

  constructor(@Optional() @Inject(YMAPS3_LOADER_OPTIONS) private opts: YMaps3LoaderOptions | null) {}

  load(): Promise<typeof ymaps3> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject(new Error('[ymaps3-angular] Loader can only run in browser.'));
    }
    const g: any = (globalThis as any);
    if (g.ymaps3) return g.ymaps3.ready.then(() => g.ymaps3);
    if (this._loading) return this._loading;

    const { apiKey, lang = 'en_US', query = '', skipCdn = false, cdnUrl } = this.opts ?? {};

    if (skipCdn) {
      this._loading = new Promise((resolve, reject) => {
        const g2: any = (globalThis as any);
        if (g2.ymaps3) g2.ymaps3.ready.then(() => resolve(g2.ymaps3));
        else reject(new Error('[ymaps3-angular] skipCdn=true but global ymaps3 not found'));
      });
      return this._loading;
    }

    if (!apiKey && !cdnUrl) {
      return Promise.reject(new Error('[ymaps3-angular] Provide apiKey or cdnUrl in YMAPS3_LOADER_OPTIONS.'));
    }

    const src = cdnUrl ?? `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey!)}&lang=${encodeURIComponent(lang)}${query||''}`;

    this._loading = new Promise<typeof ymaps3>((resolve, reject) => {
      const s = document.createElement('script');
      s.async = true; s.src = src;
      s.onload = async () => { try { const g3:any = (globalThis as any); await g3.ymaps3.ready; resolve(g3.ymaps3); } catch(e){ reject(e);} };
      s.onerror = () => reject(new Error('[ymaps3-angular] Failed to load Yandex Maps v3 script.'));
      document.head.appendChild(s);
    });
    return this._loading;
  }
}
