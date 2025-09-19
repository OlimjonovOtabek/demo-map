# ymaps3-angular

Angular (standalone) wrapper for **Yandex Maps v3 (ymaps3)**.

## Install
```bash
npm i ymaps3-angular
```

Also install optional extras when used:
```bash
npm i @yandex/ymaps3-clusterer @yandex/ymaps3-default-ui-theme
```

## Provide API key
```ts
// app.config.ts
import { provideYMaps3 } from 'ymaps3-angular';
export const appConfig = {
  providers: [provideYMaps3({ apiKey: 'YOUR_KEY', lang: 'ru_RU' })]
};
```

## Basic usage
```html
<div class="map" style="height:480px">
  <ymap [location]="{ center: [69.24, 41.30], zoom: 11 }" (ready)="onMap($event)">
    <ymap-default-scheme-layer />
    <ymap-default-features-layer />

    <ymap-marker [coordinates]="[69.24, 41.30]"><div class="pin">📍 Tashkent</div></ymap-marker>
  </ymap>
</div>
```

## Features
- `<ymap>` host with SSR guard + CDN loader
- Layers: `<ymap-default-scheme-layer>`, `<ymap-default-features-layer>`
- `<ymap-marker>` (projects HTML)
- Geometry: `<ymap-polyline>`, `<ymap-polygon>`
- Bulk: `<ymap-feature-source>` (FeatureCollection)
- Clusterer: `<ymap-clusterer>` (uses `@yandex/ymaps3-clusterer`)
- Controls: `<ymap-zoom-control>`
- Animation: `<ymap-polyline-animated>` (requestAnimationFrame)

## SSR
The loader runs only in browser. For SSR apps, wrap usage under `isPlatformBrowser` or load on the client only.

## Publish
```bash
ng build ymaps3-angular
cd dist/ymaps3-angular
npm publish --access public
```

## License
MIT
