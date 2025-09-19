import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { YMAP_REF } from '../map-ref';
import { YMaps3LoaderService } from '../loader.service';
export interface ClusterFeature { id?: string|number; geometry:{ type:'Point'; coordinates:[number,number] }; properties?: Record<string,any> }
@Component({ selector:'ymap-clusterer', standalone:true, template:``, changeDetection:ChangeDetectionStrategy.OnPush })
export class YMapClustererComponent implements AfterViewInit, OnChanges {
  private mapRef=inject(YMAP_REF); private loader=inject(YMaps3LoaderService); private destroyRef=inject(DestroyRef);
  @Input({required:true}) features!: ClusterFeature[]; @Input() gridSize=64;
  @Input() markerRenderer?: (f: ClusterFeature)=> any; @Input() clusterRenderer?: (center:[number,number], list: ClusterFeature[])=> any;
  private node?: any; // YMapClusterer
  private async build(ym: typeof ymaps3){ const { YMapClusterer, clusterByGrid } = await (globalThis as any).ymaps3.import('@yandex/ymaps3-clusterer');
    const method = clusterByGrid({ gridSize: this.gridSize });
    const marker = this.markerRenderer ? (f:any)=>this.markerRenderer!(f) : (f:any)=> new ym.YMapMarker({coordinates:f.geometry.coordinates}, (()=>{ const el=document.createElement('div'); el.textContent='•'; el.style.fontSize='18px'; el.style.transform='translate(-50%,-50%)'; return el; })());
    const cluster = this.clusterRenderer ? (c:any,l:any[])=>this.clusterRenderer!(c,l) : (c:[number,number], l:any[])=> new ym.YMapMarker({coordinates:c}, (()=>{ const el=document.createElement('div'); el.textContent=String(l.length); el.style.fontSize='12px'; el.style.padding='6px 8px'; el.style.borderRadius='999px'; el.style.background='#2563eb'; el.style.color='#fff'; el.style.transform='translate(-50%,-50%)'; el.style.boxShadow='0 2px 8px rgba(0,0,0,.2)'; return el; })());
    return new YMapClusterer({ method, features: this.features as any, marker, cluster }); }
  async ngAfterViewInit(){ const ym=await this.loader.load(); this.node=await this.build(ym); this.mapRef.addChild(this.node); this.destroyRef.onDestroy(()=>{ if(this.node) this.mapRef.removeChild(this.node); this.node=undefined;}); }
  async ngOnChanges(ch: SimpleChanges){ if(!this.node) return; if(ch['features']||ch['gridSize']){ this.mapRef.removeChild(this.node); const ym=(globalThis as any).ymaps3 as typeof ymaps3; this.node=await this.build(ym); this.mapRef.addChild(this.node);} }
}
