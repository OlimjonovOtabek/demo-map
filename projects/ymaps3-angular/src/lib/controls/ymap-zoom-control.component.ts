import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, Input, inject } from '@angular/core';
import { YMAP_REF } from '../map-ref';
import { YMaps3LoaderService } from '../loader.service';
export type ControlPosition = 'left'|'right';
@Component({ selector:'ymap-zoom-control', standalone:true, template:``, changeDetection:ChangeDetectionStrategy.OnPush })
export class YMapZoomControlComponent implements AfterViewInit {
  private mapRef=inject(YMAP_REF); private loader=inject(YMaps3LoaderService); private destroyRef=inject(DestroyRef);
  @Input() position: ControlPosition='right'; @Input() margin: number | [number,number] | [number,number,number,number]=16;
  private node?: any;
  async ngAfterViewInit(){ await this.loader.load(); const { YMapZoomControl }=await (globalThis as any).ymaps3.import('@yandex/ymaps3-default-ui-theme'); this.node=new YMapZoomControl({ position:this.position, margin:this.margin as any }); this.mapRef.addChild(this.node); this.destroyRef.onDestroy(()=>{ if(this.node) this.mapRef.removeChild(this.node); }); }
}
