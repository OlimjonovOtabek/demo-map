import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Input, OnChanges, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { YMAP_REF } from '../map-ref';
import { YMaps3LoaderService } from '../loader.service';

@Component({
  selector: 'ymap-marker', standalone: true,
  template: `<div class="ymap-marker"><ng-content /></div>`,
  styles: [`.ymap-marker{position:relative;transform:translate(-50%,-100%)}`],
  encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush
})
export class YMapMarkerComponent implements AfterViewInit, OnChanges {
  private mapRef = inject(YMAP_REF); private loader = inject(YMaps3LoaderService); private destroyRef = inject(DestroyRef); private host = inject(ElementRef<HTMLElement>);
  @Input({required:true}) coordinates!: [number, number]; @Input() draggable=false;
  private node?: ymaps3.YMapMarker;
  async ngAfterViewInit(){ await this.loader.load(); this.node = new (globalThis as any).ymaps3.YMapMarker({coordinates:this.coordinates, draggable:this.draggable}, this.host.nativeElement.firstElementChild as HTMLElement); this.mapRef.addChild(this.node);
    this.destroyRef.onDestroy(()=>{ if(this.node) this.mapRef.removeChild(this.node); this.node=undefined; }); }
  ngOnChanges(ch: SimpleChanges){ if(this.node && ch['coordinates'] && !ch['coordinates'].firstChange){ this.node.setCoordinates(this.coordinates);} }
}
