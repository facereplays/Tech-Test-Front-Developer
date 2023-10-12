import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawService {

  constructor() { }


  drawConnectors(a:CanvasRenderingContext2D,marks:any[],c:any[],d:any,video:number[]){


a.save();
a.strokeStyle='#00000044';
    a.lineWidth = 10;
    a.lineCap = "round";
    a.fillStyle = "#00000044";
    a.font = "8px Arial";

   c.map((o,i)=>{
     const start=marks[o[0]];
     a.fillText(o[0].toString(), start.x*video[0]+5,start.y*video[1]-5);

     const end=marks[o[1]];
     a.fillText(o[1].toString(), end.x*video[0]+15,end.y*video[1]-5);

     i==0 || i>4 ?  a.beginPath() : null;
    i==0 || i>4 ? a.moveTo(start.x*video[0],start.y*video[1]) : null;
     a.lineTo(end.x*video[0],end.y*video[1]);
     i>4 ? a.stroke(): null;
     i==4 ? a.fill(): null;
   });
a.restore();
  }

}
