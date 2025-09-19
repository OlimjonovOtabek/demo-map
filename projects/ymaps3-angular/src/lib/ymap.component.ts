import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, EventEmitter, Input, OnChanges, Output, Provider, SimpleChanges, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { YMaps3LoaderService } from './loader.service';
import { YMAP_REF } from './map-ref';

export type YMapLocation = { center: [number, number]; zoom: number; rotation?: number; tilt?: number };

@Component({
  selector: 'ymap',
  standalone: true,
  template: `<div class="ymap__host" style="width:100%;height:100%"></div><ng-content />`,
  styles: [`.ymap__host{display:block;position:relative;width:100%;height:100%}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: YMAP_REF,
    useFactory: () => {
      const self = inject(YMapComponent);
      return { get map(){ return self._map!; }, addChild: (n:any)=> self._map?.addChild(n), removeChild: (n:any)=> self._map?.removeChild(n) } satisfies import('./map-ref').YMapRef;
    }
  } as Provider]
})
export class YMapComponent implements AfterViewInit, OnChanges {
  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private loader = inject(YMaps3LoaderService);
  private destroyRef = inject(DestroyRef);

  @Input({ required: true }) location!: YMapLocation;
  @Output() ready = new EventEmitter<ymaps3.YMap>();

  _map?: ymaps3.YMap;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const ym = await this.loader.load();
    const host = this.el.nativeElement.querySelector('.ymap__host') as HTMLElement;
    const m = new ym.YMap(host, { location: this.location });
    this._map = m; this.ready.emit(m);
    this.destroyRef.onDestroy(()=>{ try{ m.destroy(); }catch{} this._map=undefined; });
  }

  // (Optional) controlled camera updates could be handled here when YMap exposes setters.
  ngOnChanges(_: SimpleChanges) {}
}
