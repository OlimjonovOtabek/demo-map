import { InjectionToken } from '@angular/core';

export interface YMapRef { map: ymaps3.YMap; addChild(node: any): void; removeChild(node: any): void; }
export const YMAP_REF = new InjectionToken<YMapRef>('YMAP_REF');
