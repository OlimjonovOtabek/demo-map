import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { YMAP_REF } from '../map-ref';
import { YMaps3LoaderService } from '../loader.service';

@Component({ selector: 'ymap-default-scheme-layer', standalone: true, template: `` })
export class YMapDefaultSchemeLayerComponent implements OnInit {
  private mapRef = inject(YMAP_REF); private loader = inject(YMaps3LoaderService); private destroyRef = inject(DestroyRef);
  private node?: ymaps3.YMapDefaultSchemeLayer;
  async ngOnInit(){ await this.loader.load(); this.node = new (globalThis as any).ymaps3.YMapDefaultSchemeLayer(); this.mapRef.addChild(this.node);
    this.destroyRef.onDestroy(()=>{ if(this.node) this.mapRef.removeChild(this.node); }); }
}
