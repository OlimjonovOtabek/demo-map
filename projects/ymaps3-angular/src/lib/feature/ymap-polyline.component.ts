import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { YMAP_REF } from '../map-ref';
import { YMaps3LoaderService } from '../loader.service';
export type PolylineCoordinates = [number, number][];
@Component({ selector:'ymap-polyline', standalone:true, template:``, changeDetection:ChangeDetectionStrategy.OnPush })
export class YMapPolylineComponent implements AfterViewInit, OnChanges {
  private mapRef = inject(YMAP_REF); private loader = inject(YMaps3LoaderService); private destroyRef = inject(DestroyRef);
  @Input({required:true}) coordinates!: PolylineCoordinates; @Input() strokeColor='#2563eb'; @Input() strokeWidth=4; @Input() strokeOpacity=1; @Input() zIndex?: number;
  private node?: ymaps3.YMapFeature;
  private build(){ const geometry={ type:'LineString', coordinates:this.coordinates } as const; const style:any={ strokeColor:this.strokeColor, strokeWidth:this.strokeWidth, strokeOpacity:this.strokeOpacity, zIndex:this.zIndex}; return new (globalThis as any).ymaps3.YMapFeature({ geometry, style }); }
  async ngAfterViewInit(){ await this.loader.load(); this.node=this.build(); this.mapRef.addChild(this.node); this.destroyRef.onDestroy(()=>{ if(this.node) this.mapRef.removeChild(this.node); this.node=undefined;}); }
  ngOnChanges(ch: SimpleChanges){ if(!this.node) return; if(ch['coordinates']||ch['strokeColor']||ch['strokeWidth']||ch['strokeOpacity']||ch['zIndex']){ this.mapRef.removeChild(this.node); this.node=this.build(); this.mapRef.addChild(this.node);} }
}
