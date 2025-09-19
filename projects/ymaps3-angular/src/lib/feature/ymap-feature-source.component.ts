import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { YMAP_REF } from '../map-ref';
import { YMaps3LoaderService } from '../loader.service';
export interface FeatureCollection { type:'FeatureCollection'; features: Array<{ geometry:any; style?:any; properties?:any }>; }
@Component({ selector:'ymap-feature-source', standalone:true, template:``, changeDetection:ChangeDetectionStrategy.OnPush })
export class YMapFeatureSourceComponent implements AfterViewInit, OnChanges {
  private mapRef=inject(YMAP_REF); private loader=inject(YMaps3LoaderService); private destroyRef=inject(DestroyRef);
  @Input({required:true}) collection!: FeatureCollection;
  private nodes: ymaps3.YMapFeature[] = [];
  async ngAfterViewInit(){ await this.loader.load(); this.render(); this.destroyRef.onDestroy(()=>{ this.clear(); }); }
  ngOnChanges(ch: SimpleChanges){ if(!this.nodes.length) return; if(ch['collection']){ this.clear(); this.render(); } }
  private render(){ const ym=(globalThis as any).ymaps3 as typeof ymaps3; for(const f of this.collection.features){ const node = new ym.YMapFeature({ geometry:f.geometry, style:f.style, properties:f.properties }); this.nodes.push(node); this.mapRef.addChild(node);} }
  private clear(){ for(const n of this.nodes){ this.mapRef.removeChild(n);} this.nodes=[]; }
}
