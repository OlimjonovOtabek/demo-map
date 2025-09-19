import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { YMAP_REF } from '../map-ref';
import { YMaps3LoaderService } from '../loader.service';
export type LinearRing = [number, number][];
@Component({ selector:'ymap-polygon', standalone:true, template:``, changeDetection:ChangeDetectionStrategy.OnPush })
export class YMapPolygonComponent implements AfterViewInit, OnChanges {
  private mapRef = inject(YMAP_REF); private loader = inject(YMaps3LoaderService); private destroyRef = inject(DestroyRef);
  @Input({required:true}) outer!: LinearRing; @Input() holes: LinearRing[] = [];
  @Input() fillColor='rgba(37,99,235,.15)'; @Input() fillOpacity=1; @Input() strokeColor='#2563eb'; @Input() strokeWidth=2; @Input() strokeOpacity=1; @Input() zIndex?: number;
  private node?: ymaps3.YMapFeature;
  private build(){ const geometry={ type:'Polygon', coordinates:[this.outer, ...this.holes] } as const; const style:any={ fillColor:this.fillColor, fillOpacity:this.fillOpacity, strokeColor:this.strokeColor, strokeWidth:this.strokeWidth, strokeOpacity:this.strokeOpacity, zIndex:this.zIndex}; return new (globalThis as any).ymaps3.YMapFeature({ geometry, style }); }
  async ngAfterViewInit(){ await this.loader.load(); this.node=this.build(); this.mapRef.addChild(this.node); this.destroyRef.onDestroy(()=>{ if(this.node) this.mapRef.removeChild(this.node); this.node=undefined;}); }
  ngOnChanges(_: SimpleChanges){ if(!this.node) return; this.mapRef.removeChild(this.node); this.node=this.build(); this.mapRef.addChild(this.node);} }
