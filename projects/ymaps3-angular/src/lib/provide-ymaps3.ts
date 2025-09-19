import { Provider } from '@angular/core';
import { YMAPS3_LOADER_OPTIONS, YMaps3LoaderOptions } from './tokens';
export function provideYMaps3(opts: YMaps3LoaderOptions): Provider { return { provide: YMAPS3_LOADER_OPTIONS, useValue: opts }; }
