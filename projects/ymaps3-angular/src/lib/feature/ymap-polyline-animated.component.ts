import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, Input, OnDestroy, inject } from '@angular/core';
import { YMAP_REF } from '../map-ref';
import { YMaps3LoaderService } from '../loader.service';

@Component({ selector:'ymap-polyline-animated', standalone:true, template:``, changeDetection:ChangeDetectionStrategy.OnPush })
export class YMapPolylineAnimatedComponent implements AfterViewInit, OnDestroy {
  private mapRef=inject(YMAP_REF); private loader=inject(YMaps3LoaderService); private destroyRef=inject(DestroyRef);
  @Input({required:true}) coordinates!: [number,number][]; // route points in order
  @Input() speed = 50; // meters per second (approx – linear lon/lat)
  @Input() loop = false;
  private marker?: ymaps3.YMapMarker; private frame?: number; private t=0; private total=0; private segLens: number[]=[];

  async ngAfterViewInit(){ await this.loader.load(); if(!this.coordinates || this.coordinates.length<2) return;
    const ym=(globalThis as any).ymaps3 as typeof ymaps3;
    // Precompute total pseudo-length (simple haversine approximation could be added; here linear)
    this.segLens=[]; this.total=0; for(let i=0;i<this.coordinates.length-1;i++){ const a=this.coordinates[i], b=this.coordinates[i+1]; const d=Math.hypot(b[0]-a[0], b[1]-a[1]); this.segLens.push(d); this.total+=d; }
    this.marker = new ym.YMapMarker({ coordinates: this.coordinates[0] }, (()=>{ const el=document.createElement('div'); el.textContent='▶'; el.style.transform='translate(-50%,-50%)'; el.style.fontSize='16px'; return el; })());
    this.mapRef.addChild(this.marker);
    let last = performance.now();
    const tick = (now:number)=>{
      const dt = (now-last)/1000; last=now; this.t += (this.speed/1000) * dt; // "speed" scaled down because coords are degrees
      const pos = this.sample(Math.min(this.t, 1)); if(this.marker) this.marker.setCoordinates(pos);
      if(this.t<1){ this.frame = requestAnimationFrame(tick); } else if(this.loop){ this.t=0; this.frame=requestAnimationFrame(tick); }
    };
    this.frame = requestAnimationFrame(tick);
    this.destroyRef.onDestroy(()=>this.cleanup());
  }

  private sample(t:number): [number,number]{ // map t∈[0,1] to polyline
    if(this.coordinates.length===2){ const a=this.coordinates[0], b=this.coordinates[1]; return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]; }
    let acc=0; const target=t*this.total;
    for(let i=0;i<this.segLens.length;i++){ const L=this.segLens[i]; if(acc+L>=target){ const a=this.coordinates[i], b=this.coordinates[i+1]; const r=(target-acc)/L; return [a[0]+(b[0]-a[0])*r, a[1]+(b[1]-a[1])*r]; } acc+=L; }
    return this.coordinates[this.coordinates.length-1];
  }

  ngOnDestroy(){ this.cleanup(); }
  private cleanup(){ if(this.frame) cancelAnimationFrame(this.frame); if(this.marker){ this.mapRef.removeChild(this.marker); this.marker=undefined; } }
}
