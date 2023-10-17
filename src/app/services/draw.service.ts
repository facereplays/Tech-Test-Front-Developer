import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import * as THREE from 'three';

interface dot {
  s:number;
  e:number;
}

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  RightEye: dot[] = environment.FACE_LANDMARKS_RIGHT_EYE;
  LeftEye: dot[] = environment.FACE_LANDMARKS_LEFT_EYE;
  constructor() {

  }
  drawFConnectors(a: CanvasRenderingContext2D, marks0: any, c: any[], d: any, video: number[]) {
    const tes = environment.FACE_LANDMARKS_TESSELATION;
    const marks:THREE.Vector3[] = marks0.faceLandmarks[0].map((u:any)=>new THREE.Vector3(u.x,u.y,0));


    const scale=new THREE.Vector3(video[0],video[1],1);
   // scale.multiplyScalar(3)


    const delta=new THREE.Vector3(0,0,0);
    a.save();

    a.lineWidth = 1;
    a.lineCap = "round";
    a.fillStyle = "#000000dd";
    a.font = "8px Arial";
   // console.log(marks);
    const ar:number[]=[];
    const helpers=environment.HELPER;
    const xDir=helpers.x;
    const zDir=helpers.z;
    const yDir=helpers.y;
    const startY = marks[yDir.dots[0]].clone().multiply(scale).add(delta);
    const endY =marks[yDir.dots[1]].clone().multiply(scale).add(delta);
    const startX = marks[xDir.dots[0]].clone().multiply(scale).add(delta);
    const endX =marks[xDir.dots[1]].clone().multiply(scale).add(delta);
    const midZ =marks[zDir.dots[0]].clone().multiply(scale).add(delta);
    const midX=startX.clone().add(endX).multiplyScalar(.5);
     const lenZ=midX.clone().sub(midZ).length();
    const lenY=startY.clone().sub(endY).length();
    const lenX=endX.clone().sub(startX).length();
    const yVect=startY.clone().sub(endY).normalize();
const zVect=midX.clone().sub(midZ).normalize();
    const xVect=startX.clone().sub(endX).normalize();
const hCenter=midX.clone().add(zVect.clone().multiplyScalar(lenZ*.3));
const fHead=helpers.fhead;
    const fHeadEnd =marks[fHead.dots[1]].clone().multiply(scale).add(delta);
    const fHeadStart = marks[fHead.dots[0]].clone().multiply(scale).add(delta);
    const fHeadDir= fHeadEnd.clone().sub(fHeadStart).normalize();
  /*
    a.strokeStyle = '#00000044';
    tes.map((o, i) => {


      const start = marks[o.s].clone();
      const end =marks[o.e].clone();
      start.multiply(scale).add(delta);
      end.multiply(scale).add(delta);
    //  console.log(o);
    // start && a.fillText(o.e.toString(), start.x + 5, start.y - 5);
      if(!ar.includes(o.s)) {
        ar.push(o.s);
   // a.fillText(o.s.toString(), start.x + 2, start.y - 2);
      }

      (start && end) &&  a.beginPath();
      (start && end) &&  a.moveTo(start.x, start.y) ;
      (start && end) &&  a.lineTo(end.x, end.y);
      (start && end) &&   a.stroke();

    });
    a.restore();
    a.save();
    */
    a.strokeStyle = "#00000044";
    environment.LINES.forEach((l:any)=>{
      const start = marks[l[0]].clone();    const end =marks[l[1]].clone();

      start.multiply(scale).add(delta);
      end.multiply(scale).add(delta);

     a.beginPath();
   a.moveTo(start.x, start.y) ;
     a.lineTo(end.x, end.y);
  a.stroke();


    });
    a.strokeStyle = '#00000044';
  /*  a.beginPath();
    a.moveTo(midZ.x, midZ.y) ;
    a.lineTo(midX.x, midX.y);
    a.stroke();
    a.beginPath();
    a.moveTo(startY.x, startY.y) ;
    a.lineTo(endY.x, endY.y);
    a.stroke();
*/
    a.beginPath();
    a.moveTo(hCenter.x-yVect.x*lenY*1.1,hCenter.y-yVect.y*lenY*1.1);


    a.bezierCurveTo(
      hCenter.x-yVect.x*lenY*1.1-zVect.x*lenZ*0.4,hCenter.y-yVect.y*lenY*1.1-zVect.y*lenZ*0.4,
      fHeadStart.x-fHeadDir.x*lenY*0.6,fHeadStart.y-fHeadDir.y*lenY*0.6,
      fHeadStart.x,fHeadStart.y);
    a.stroke();
    a.beginPath();
  a.moveTo(startX.x,startX.y);

    a.bezierCurveTo(startX.x-yVect.x*lenY*0.4,startX.y-yVect.y*lenY*0.4,
      hCenter.x-yVect.x*lenY*1.1+xVect.x*lenX*0.4,hCenter.y-yVect.y*lenY*1.1+xVect.y*lenX*0.4,
      hCenter.x-yVect.x*lenY*1.1,hCenter.y-yVect.y*lenY*1.1);



   a.bezierCurveTo(
     hCenter.x-yVect.x*lenY*1.1-xVect.x*lenX*0.4,hCenter.y-yVect.y*lenY*1.1-xVect.y*lenX*0.4,
     endX.x-yVect.x*lenY*0.4,endX.y-yVect.y*lenY*0.4,
     endX.x,endX.y)
    a.stroke();

    environment.FACE_LANDMARKS_LEFT_IRIS.forEach((u,i)=>{
      const start=marks[u.s].clone();
      const end = marks[u.e].clone();
      start.multiply(scale).add(delta);
      end.multiply(scale).add(delta);
      i==0 && a.beginPath();
      i==0  ? a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);
      i==environment.FACE_LANDMARKS_LEFT_IRIS.length-1 && a.lineTo(end.x, end.y);
      i==environment.FACE_LANDMARKS_LEFT_IRIS.length-1 && a.stroke();
    })
    environment.FACE_LANDMARKS_RIGHT_IRIS.forEach((u,i)=>{
      const start=marks[u.s].clone();
      const end =marks[u.e].clone();
      start.multiply(scale).add(delta);
      end.multiply(scale).add(delta);
      i==0 && a.beginPath();
      i==0  ? a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);
      i==environment.FACE_LANDMARKS_LEFT_IRIS.length-1 && a.lineTo(end.x, end.y);
      i==environment.FACE_LANDMARKS_LEFT_IRIS.length-1 && a.stroke();
    })
     /*   */

    a.restore();
  }
  drawConnectors(a: CanvasRenderingContext2D, marks: any[], c: any[], config: any, video: number[]) {

    a.save();
    a.strokeStyle = config.color;
    a.lineWidth = 10;
    a.lineCap = "round";
    a.fillStyle =  config.color;
    a.font = "12px Arial";
    c.map((o, i) => {
      const start = marks[o[0]];
    const stx=  start.x * video[0];
      const sty=  start.y * video[1];
      const gradient = a.createRadialGradient(stx, sty, 0, stx, sty, 20);

// Add three color stops
      gradient.addColorStop(0, config.color);
      gradient.addColorStop(1, config.color0);

// Set the fill style and draw a rectangle
     a.fillStyle = gradient;
      i > 4 &&   a.ellipse(stx, sty, 20, 20,0,0, 2 * Math.PI);

     a.fill();
      a.fillStyle =  config.color;


      a.fillText(o[0].toString(), start.x * video[0] + 5, start.y * video[1] - 5);
      const end = marks[o[1]];
      a.fillText(o[1].toString(), end.x * video[0] + 15, end.y * video[1] - 5);
      i == 0 || i > 4 ? a.beginPath() : null;
      i == 0 || i > 4 ? a.moveTo(start.x * video[0], start.y * video[1]) : null;
      a.lineTo(end.x * video[0], end.y * video[1]);
      i > 4 ? a.stroke() : null;


      i == 4 ? a.fill() : null;
    });
    a.restore();
  }
  abris(){


  }
  drawFaceConnectors(a: CanvasRenderingContext2D,
                     marks: any, anchors:any[],d:any,video:any){
    const scale=new THREE.Vector3(video[0],video[1],1);
 //   scale.multiplyScalar(2)
const indices:number[][] = [];

  const delta=new THREE.Vector3(0,0,0);
    const mtks:THREE.Vector3[] = marks.faceLandmarks[0].map((u:any)=>new THREE.Vector3(u.x,u.y,u.z));
    a.save();
    a.strokeStyle = '#00000044';
    a.lineWidth = 1;
    a.lineCap = "round";
    a.fillStyle = "#ffffff44";
    a.font = "8px Arial";
const ar:number[]=[];
let c=0;
const tes = environment.FACE_LANDMARKS_TESSELATION;

    environment.INDICES.forEach((uu,ii)=> {

      uu.forEach((ku,i)=>{


    const start=mtks[ku].clone();
      start.multiply(scale).add(delta);


 // !ar.find(p=>p==u.s) && a.fillText(i.toString(), start.x + 2, start.y+2);
 //    ar.push(u.s);

   i==0 &&    a.beginPath();
        i==0 ?  a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);

        i==2 && a.fill();
    /*    a.strokeStyle = '#ff000044';
        a.beginPath();
        a.moveTo(start.x, start.y); a.lineTo(end.x, end.y);
        a.stroke();
        */

      //  i==environment.FACE_LANDMARKS_LIPS.length-1 && a.fillText(u.s.toString(), end.x + 5, end.y+5);;
    })

  })

this.RightEye.forEach((u,i)=>{

  const start=mtks[u.s].clone();
  const end = mtks[u.e].clone();

  start.multiply(scale).add(delta);
end.multiply(scale).add(delta);
 // a.fillText(u.s.toString(), start.x + 5, start.y - 5);

// a.fillText(u.e.toString(), end.x + 15, end.y - 15);
  i==0 && a.beginPath();
i==0  ? a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);
  i==this.RightEye.length-1 && a.lineTo(end.x, end.y);
  i==this.RightEye.length-1 && a.stroke();
})
    environment.FACE_LANDMARKS_LIPS.forEach((u,i)=>{
      const start=mtks[u.s].clone();
      const end = mtks[u.e].clone();
      start.multiply(scale).add(delta);
      end.multiply(scale).add(delta);
     // a.fillText(u.s.toString(), start.x + 5, start.y+5);
      i==0 && a.beginPath();
      i==0  ? a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);
      i==environment.FACE_LANDMARKS_LIPS.length-1 && a.lineTo(end.x, end.y);
      i==environment.FACE_LANDMARKS_LIPS.length-1 && a.stroke();
    //  i==environment.FACE_LANDMARKS_LIPS.length-1 && a.fillText(u.s.toString(), end.x + 5, end.y+5);;
    })
    environment.FACE_LANDMARKS_MOUTH.forEach((u,i)=>{
      const start=mtks[u.s].clone();
      const end = mtks[u.e].clone();
      start.multiply(scale).add(delta);
      end.multiply(scale).add(delta);
      a.fillStyle = "#00000088";
      // a.fillText(u.s.toString(), start.x + 5, start.y+5);
      i==0 && a.beginPath();
      i==0  ? a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);
      i==environment.FACE_LANDMARKS_LIPS.length-1 && a.lineTo(end.x, end.y);
      i==environment.FACE_LANDMARKS_LIPS.length-1 && a.fill();
      //  i==environment.FACE_LANDMARKS_LIPS.length-1 && a.fillText(u.s.toString(), end.x + 5, end.y+5);;
    })
    environment.FACE_LANDMARKS_RIGHT_EYEBROW.forEach((u,i)=>{
      const start=mtks[u.s].clone();
      const end = mtks[u.e].clone();
      start.multiply(scale).add(delta);
      end.multiply(scale).add(delta);
    //  a.fillText(u.s.toString(), start.x + 5, start.y - 5);
      i==0 && a.fillText(u.e.toString(), end.x + 5, end.y - 5);;
      i==0 && a.beginPath();
      i==0  ? a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);
      i==environment.FACE_LANDMARKS_RIGHT_EYEBROW.length-1 && a.lineTo(end.x, end.y);
      i==environment.FACE_LANDMARKS_RIGHT_EYEBROW.length-1 && a.stroke();
     // i==environment.FACE_LANDMARKS_RIGHT_EYEBROW.length-1 &&  a.fillText(u.s.toString(), end.x + 5, end.y - 5);;
    })
    environment.FACE_LANDMARKS_LEFT_IRIS.forEach((u,i)=>{
 const start=mtks[u.s].clone();
      const end = mtks[u.e].clone();
start.multiply(scale).add(delta);
      end.multiply(scale).add(delta);
      i==0 && a.beginPath();
      i==0  ? a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);
      i==environment.FACE_LANDMARKS_LEFT_IRIS.length-1 && a.lineTo(end.x, end.y);
      i==environment.FACE_LANDMARKS_LEFT_IRIS.length-1 && a.stroke();
    })
    environment.FACE_LANDMARKS_RIGHT_IRIS.forEach((u,i)=>{
      const start=mtks[u.s].clone();
      const end = mtks[u.e].clone();
      start.multiply(scale).add(delta);
      end.multiply(scale).add(delta);
      i==0 && a.beginPath();
      i==0  ? a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);
      i==environment.FACE_LANDMARKS_LEFT_IRIS.length-1 && a.lineTo(end.x, end.y);
      i==environment.FACE_LANDMARKS_LEFT_IRIS.length-1 && a.stroke();
    })

    this.LeftEye.forEach((u,i)=>{

      const start=mtks[u.s].clone();
      const end = mtks[u.e].clone();

     start.multiply(scale).add(delta);
     end.multiply(scale).add(delta);
   // a.fillText(u.s.toString(), start.x + 5, start.y - 5);

   //a.fillText(u.e.toString(), end.x + 15, end.y - 15);
      i==0 && a.beginPath();
      i==0  ? a.moveTo(start.x, start.y) : a.lineTo(start.x, start.y);
      i==this.LeftEye.length-1 && a.lineTo(end.x, end.y);
      i==this.LeftEye.length-1 && a.stroke();
    })

  }
}


