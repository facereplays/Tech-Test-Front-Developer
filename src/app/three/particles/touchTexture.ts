import * as THREE from 'three';
import paper from 'paper';
// @ts-ignore
import { easeOutQuad, easeInOutQuad, easeOutSine, easeInOutSine } from '../../utils/easing.utils';

export default class TouchTexture {
  private parent: any;
  private size: number;
  private maxAge: number;
  private radius: number;
  private trail?: any[];
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private texture!: THREE.Texture;
  private trails: any[];
	constructor(parent:any) {
		this.parent = parent;
		this.size = 32;
		this.maxAge = 120;
		this.radius = 0.15;
	this.trails = [];
this.initTexture();
	}

	initTexture() {

		this.canvas = document.createElement('canvas');
		this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    paper.setup([this.canvas.width,this.canvas.height]);
		// @ts-ignore
    this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = 'white';
		//this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.texture = new THREE.Texture(this.canvas);

		this.canvas.id = 'touchTexture';
		this.canvas.style.width = this.canvas.style.height = `${this.canvas.width}px`;
	}

	update(delta: number) {
		this.clear();

		// age points
    this.trails.forEach((trail, ii) => {
      trail.forEach((point: any, i: number) => {
        point.age++;
        // remove old
        if (point.age > this.maxAge) {
        //  trail.splice(i, 1);
        }
      });
    });

    this.trails.forEach((trail, ii) => {
      if (trail) trail.forEach((point: any, i: number) => {
        // console.log(point);
        this.drawTouch(point, i, trail);
      });
    });
		this.texture.needsUpdate = true;
	}

	clear() {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	addTouch(point: any, force1: any) {

		let force = 0;

		const last = this.trail ? this.trail[this.trail.length - 1] : null;
		if (last) {
			const dx = last.x - point.x;
			const dy = last.y - point.y;
			const dd = dx * dx + dy * dy;
			force = force1.force==undefined ? Math.min(dd * 1000, 1) : force1.force;

		}
		this.trail!.push({ x: point.x, y: point.y, age: 0, force });
	}
  tUp(point: any, force1: any) {
   this.trail=[];
   const force =	(force1 && force1.force!==undefined)  ? force1.force : 0.1;
    this.trail.push({ x: point.x, y: point.y, age: 0, force:force });
this.trails.push(this.trail);
  }

	drawTouch(point: any,i:number, trail: any) {
		const pos = {
			x: point.x * this.canvas.width,
			y: (1 - point.y) * this.canvas.height
		};

		let intensity = 1;
		if (point.age < this.maxAge * 0.3) {
			intensity = easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
		} else {
			intensity = easeOutSine(1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
		}

		intensity *= point.force;

		const radius = this.size * this.radius * intensity*10;
if(radius>0){
		const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
		grd.addColorStop(0, `rgba(255,0, 255, 1)`);
		grd.addColorStop(1, 'rgba(255,0, 255, 1)');

		this.ctx.beginPath();
		this.ctx.fillStyle = grd;
		this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
		this.ctx.fill();
  }
    if(trail && trail.length>1 && i>0){






      const last = trail[i - 1];
if(last){
  const p2 = new THREE.Vector2(pos.x, pos.y);
  const p1=new THREE.Vector2(last.x * this.canvas.width, (1-last.y) * this.canvas.height);
  const p0=new THREE.Vector2(last.x * this.canvas.width, (1-last.y) * this.canvas.height);

 p1.sub(p2);

  if(p1.length() > radius){
  let intensity1 = 1;
  if (last.age < this.maxAge * 0.3) {
    intensity1 = easeOutSine(last.age / (this.maxAge * 0.3), 0, 1, 1);
  } else {
    intensity1 = easeOutSine(1 - (last.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
  }
  intensity1 *= last.force; intensity1+=0.1;
  const radius1 = this.size * this.radius * intensity1*10;
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white';
    this.ctx.moveTo(p2.x,p2.y);
    this.ctx.lineTo(p0.x,p0.y);
    this.ctx.stroke();

if(radius1>0 || radius>0){

// @ts-ignore
  const len = Math.floor(p1.length() / Math.max(radius1,radius))*2;

Array(len).fill(1).forEach((o,ix)=>{
  const c=ix/len;
  const rad=radius+(radius-radius1)*c;
if(rad>0){
const pl=new THREE.Vector2(p2.x+p1.x*c,p2.y+p1.y*c);
  const grd1 = this.ctx.createRadialGradient(pl.x, pl.y, rad * 0.25,pl.x, pl.y, rad);
  grd1.addColorStop(0, `rgba(255,255, 255,0.1)`);
  grd1.addColorStop(1, 'rgba(255,255, 255, 0.1)');
  this.ctx.beginPath();
  this.ctx.fillStyle = grd1;
  this.ctx.arc(pl.x, pl.y, rad, 0, Math.PI * 2);
  this.ctx.fill();
}
  })
}}}


    }
	}
}
