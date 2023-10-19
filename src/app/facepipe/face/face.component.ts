import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {environment} from "../../../environments/environment";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { OrthographicCamera,  Scene,  WebGLRenderer} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer.js";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass.js";
import {ShadersService} from "../../services/shaders.service";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass.js";
import {CopyShader} from "three/examples/jsm/shaders/CopyShader.js";

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.css']
})
export class FaceComponent implements OnInit{
  geometry: THREE.BufferGeometry;
  @ViewChild("cont") myscene!: ElementRef;
  @ViewChild("myVideo") myVideo!: ElementRef;
  // @ts-ignore
  private video: HTMLVideoElement;
  private renderer?: WebGLRenderer;
  private controls?: OrbitControls;
  private camera?:OrthographicCamera;
  private scene?: Scene;
  private imData?: string;
  private vidTex?: THREE.VideoTexture;
  private composer?: EffectComposer;
  private renderPass?: RenderPass;
  private clock?: THREE.Clock;
  private diffuseImage: THREE.WebGLRenderTarget;
  private addDiffuseShader: any;
  private mixPass: ShaderPass;
  private copyPass: ShaderPass;
  private topTex:  THREE.WebGLRenderTarget;
  timer=0;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private tLoader: THREE.TextureLoader;
  private materialA?: THREE.ShaderMaterial;
  constructor(private shaderService: ShadersService) {
    this.canvas = document.createElement("canvas");
 //   document.body.appendChild(this.canvas);
    this.tLoader=new THREE.TextureLoader();
    this.ctx=this.canvas.getContext('2d');
    this.geometry = new THREE.BufferGeometry();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const parameters = {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    }
    this.topTex = new THREE.WebGLRenderTarget(width, height, parameters)
    this.diffuseImage = new THREE.WebGLRenderTarget(width, height, parameters);
    this.addDiffuseShader = {
      uniforms: {
        myUvs:{type: 'vec2',value:environment.faceUvs},
        intensity: {value: this.topTex},
        diffuse: {value: this.diffuseImage},
        color0: {type: 'vec3', value: new THREE.Color(0x008ad0)},
        color1: {type: 'vec3', value: new THREE.Color(0x090074)}
      },
      transparent: true,
      vertexShader: this.shaderService.bpVertex(),
      fragmentShader: this.shaderService.addDiffuseFragment()
    }

    this.mixPass = new ShaderPass(this.addDiffuseShader)
    this.copyPass = new ShaderPass(CopyShader)
    this.copyPass.renderToScreen = false;
  }
redrawFace(delta: number | undefined){

   this.timer++;

   this.ctx?.clearRect(0,0,this.canvas.width,this.canvas.height)
  const gradient =
    this.ctx!.createRadialGradient(200+Math.cos(this.timer/30)*90, 200,
      30+Math.cos(this.timer/30)*25, 200, 200, 170);

// Add three color stops
  gradient.addColorStop(0, "pink");
  gradient.addColorStop(0.9, "white");
  gradient.addColorStop(1, "green");

// Set the fill style and draw a rectangle
  this.ctx!.fillStyle = gradient;
  this.ctx!.fillRect(0, 0, 400, 400);
  this.imData =   this.canvas.toDataURL();
this.tLoader.load( this.imData,(tex)=>{

  tex.needsUpdate=true;
  this.topTex.texture = tex;
  this.addDiffuseShader.uniforms['intensity'].value=this.topTex;

});


}
rend(){
    this.timer++;
  if(this.materialA)
  {
    this.materialA!.uniforms['stime'].value=Math.sin(this.timer/100)*5;
this.materialA!.uniforms['time'].value=Math.cos(this.timer/100)*5;
  }
  /*this.composer!.passes = [this.renderPass!,this.copyPass];
 // this.controls!.update();

  // @ts-ignore
  this.composer.readBuffer = this.diffuseImage;
  this.composer?.render(this.timer);
  this.composer?.reset();
  this.redrawFace(this.timer);
  this.addDiffuseShader.uniforms['intensity'].value=this.topTex;
  */

  this.composer!.passes = [this.mixPass!];

  this.composer?.render(this.timer);





 // this.renderer!.render( this.scene!, this.camera! );

}
  ngOnInit(): void {

  }
  letVideo = async ()=>{
    this.video.srcObject = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    const geometry = new THREE.PlaneGeometry(window.innerWidth,window.innerHeight);

const testB = environment.test.faceLandmarks[0].map(u=>new THREE.Vector3(u.x,u.y,u.z));
    const testA = environment.faceVerts.map(u=>new THREE.Vector3(u.x,u.y,u.z));






const dif=testA.map((y,i)=>y.sub(testB[i]));
const difV:number[][]=[];
dif.map(y=>{difV.push([y.x*1000,y.y*1000,y.z*10])});
 this.materialA = new THREE.ShaderMaterial(

  {
   side: THREE.DoubleSide,
    uniforms: {
      stime:{value: Math.sin(this.timer/10.0)*2 },
     time:{value: Math.cos(this.timer/10.0)*2 },
      // @ts-ignore
       dif:{type:'vec3',value:dif},
      myUvs:{value:environment.faceUvs},
      intensity: {value: this.topTex},
      diffuse: {value: this.diffuseImage},
      color0: { value: new THREE.Color(0x008ad0)},
      color1: { value: new THREE.Color(0x090074)}
    },
    transparent: true,
    vertexShader: this.shaderService.bpVertex(),
    fragmentShader: this.shaderService.addDiffuseFragment()

  }



);


    this.vidTex=new THREE.VideoTexture(this.video);

    const materialB = new THREE.MeshBasicMaterial( {map:this.vidTex, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh( this.geometry, this.materialA );
    //mesh.scale=10;
    const plane= new THREE.Mesh(geometry, materialB );
    plane.position.z = -2;
    plane.rotation.y = Math.PI;
   // this.scene!.add( plane );
   this.scene!.add( mesh );
  }
  ngAfterViewInit() {
const width = window.innerWidth;
    const height = window.innerHeight;

   //this.camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
    this.camera =new  THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000);

    this.camera.position.z = 64;
this.video = this.myVideo.nativeElement  as HTMLVideoElement;


    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xeeeeee );

    //

    const light = new THREE.HemisphereLight();
    light.intensity = 3;
    this.scene.add( light );
    const light1 = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add( light1 );


const res=environment.faceVerts;
    const testB = environment.test.faceLandmarks[0].map(u=>new THREE.Vector3(u.x,u.y,u.z));
    const uvs:any[] = [];
    const cols:any[] = [];
const vertices0:any[]  =[];
res.forEach((t,i)=>{
  const b=testB[i];
  cols.push(Math.max(0,b.x)*255,Math.max(0,b.y)*255,Math.max(0,b.z)*255,255);

  uvs.push(t.x+0.5,1-t.y-0.5); vertices0.push((t.x*4)*60,(-t.y*4)*60,t.z*10)});
console.log(cols);
//this.addDiffuseShader.uniforms['myUvs'].value=uvs;

const vertices = new Float32Array( vertices0 );

    const indices:any[] = [] ;
    const normals:any[] = [] ;

    environment.INDICES.forEach(y=>{indices.push(y[0],y[1],y[2]);
      normals.push(0,0,1)});
    this.geometry.setIndex( indices );
    this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    this.geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
  this.geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute(uvs, 2 ) );
    this.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute(cols, 4 ) );
 const material0 = new THREE.MeshBasicMaterial( {
      side: THREE.DoubleSide,color:0xff0000,wireframe:true

    } );

    function  diffuseVertex() {

      return `
    precision mediump float;
precision mediump int;

uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional

attribute vec3 position;
attribute vec4 color;

varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;
void main(){

vPosition = position;
vColor = color;

gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
  `
    }

    function testFragment() {
      return `
    precision mediump float;
precision mediump int;
uniform sampler2D test;
varying vec2 vUv;

void main(){
vec4 color1 = texture2D(test, vUv);
//vec4 color = vec4( vColor );
//color.r += sin( vPosition.x * 10.0 ) * 0.5;

gl_FragColor = vec4(color1.r,color1.g,color1.b,0.5);
//gl_FragColor = texture2D(test, vUv);
gl_FragColor.a = color1.a;
}
	`
    }




  //  this.geometry.u = true;

    this.letVideo();
    this.renderer = new THREE.WebGLRenderer( { antialias: true,alpha:true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( 0xeeeeee);
    this.myscene.nativeElement.appendChild( this.renderer.domElement );

    this.composer = new EffectComposer(this.renderer)
    this.composer.setSize(width, height)
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.renderPass.clear = true
    this.renderPass.clearAlpha = 0
    this.clock = new THREE.Clock();

    this.controls=new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.update();
    this.redrawFace(0);
    //this.composer.render(delta)
  this.renderer.render( this.scene, this.camera );
    let component: FaceComponent = this;
    (function render() {
      const delta = component.clock?.getDelta();
/*


 */
     //component.timer++;
      //component.addDiffuseShader.uniforms['time'].value=Math.cos(component.timer/100)*5;
    component.rend();
      requestAnimationFrame(render);
    }());


    //geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  }

}
