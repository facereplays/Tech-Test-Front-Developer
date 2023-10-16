import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// @ts-ignore
import { VRDisplay } from 'webvr-api';
// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// @ts-ignore
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import {Matrix4, Vector3} from 'three';
import CameraControls from 'camera-controls';

CameraControls.install( { THREE: THREE } );

import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.css']
})
export class ThreeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef?: ElementRef;

  //* Cube Properties


  @Input() public rotationSpeedX: number = 0.05;

  @Input() public rotationSpeedY: number = 0.01;

  @Input() public size: number = 200;

  @Input() public texture: string = '/assets/pat.png';


  //* Stage Properties

  @Input() public cameraZ: number = 100;

  @Input() public fieldOfView: number = 40;

  @Input('nearClipping') public nearClippingPlane: number = 1;

  @Input('farClipping') public farClippingPlane: number = 1000;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;
  private oLoader: any;
  private controls!: CameraControls;
  private verts: any[];
  private lines: any[] = [];
  private model?: THREE.Mesh;
  private group!: any;
  private frot: number = 0;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef!.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;
  loaded = false;
  loading = 0;
fRes= new Subject<any>();
  wid = window.innerWidth;
  hei = window.innerHeight;
  /**
   *Animate the cube
   *
   * @private
   * @memberof CubeComponent
   */
  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee)
   // this.scene.add(this.cube);
    //*Camera
    const stLoad = new STLLoader();
    let aspectRatio = this.getAspectRatio();
    console.log(aspectRatio);
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    const as = aspectRatio<1 ? 1 : 1.5;
    this.camera.position.z = this.cameraZ*as;
    this.camera.position.y = 10*as;
    this.camera.position.x = 120*as;
/*x
:
-103.90964321209808
y
:
19.733960169285737
z
:
305.4723504076461

 */
const ssc = 0.3;
      const vec = new THREE.Vector3(15.88,5.2,24.8);
    this.camera.position.z = vec.z*ssc;
    this.camera.position.y =vec.y*ssc;
    this.camera.position.x = vec.x*ssc;

  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   *
   * @private
   * @memberof CubeComponent
   */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    // @ts-ignore
    this.controls = new CameraControls( this.camera, this.canvas );
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    let component: ThreeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.group.rotation.z < component.frot ?   component.group.rotateZ(0.01) : null;
    component.controls.update(100);

   // console.log(component.camera.position);
    //  component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  constructor() {

    this.verts=[];
    this.fRes.subscribe(a=>{

this.loadFile(a[0] as string, a[1] as string);

    });
   // this.oLoader = new OBJLoader();
  }

  ngOnInit(): void {







  }

  ngAfterViewInit() {

    this.wid = window.innerWidth;
    this.hei = window.innerHeight;
//const david='https://vids.facereplays.com/david_h.obj';
    const david=environment.david;
    this.createScene();
this.loadFile(david,david);
this.loaded = true;
  }
loadFile (file:string, nm :string): void {
  const vertexShader = `
uniform float outline;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * outline, 1.0);
}
`;

  const fragmentShader = `
uniform vec3 color;
uniform float opacity;
void main() {
  gl_FragColor = vec4(color, opacity);
}
`;

nm.match(/\.stl/) ?  this.oLoader = new STLLoader() : null;
nm.match(/\.obj/) ? this.oLoader = new OBJLoader() : null;
  nm.match(/\.gl/) ? this.oLoader = new GLTFLoader() : null;
  this.oLoader.load(
    // resource URL
  file,
    // called when resource is loaded
    ( geometry: any ) =>{
      const outlineMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: {value: new THREE.Color("#000")},
          opacity: {value: 0.0},
          outline: {value: 0.2}
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide
      });
      this.scene.add(new THREE.AmbientLight(0x888888));
      this.loaded = true;
      let object;

      if(geometry instanceof  THREE.Group){

        object = geometry;
console.log(object);
        const material2 = new THREE.LineBasicMaterial( { color: 0x999999, opacity: 0.84 } );
        if(object.children[0] instanceof  THREE.Mesh) {
         const geom = object.children[0].geometry;
          this.model = object.children[0];
          this.model.castShadow = true;
          this.model.receiveShadow = true;
          const material = new THREE.MeshLambertMaterial( {

            color: 0xffffff,

          } );
          this.model.material = material;
         // object.children[0].material = outlineMaterial;
          geom.computeBoundingBox();
          const sc = 5 / geom.boundingBox.max.length();
         const vi = new THREE.Vector3(0,0,0);
const cen = geom.boundingBox.getCenter(vi);

          const mat = new Matrix4();

mat.makeTranslation(-cen.x*sc,-cen.y*sc,-cen.z*sc);


          if(geometry.up.y == 1) {
            mat.makeRotationX(-Math.PI / 2);
          } mat.scale(new Vector3(sc, sc, sc));
          object.applyMatrix4(mat);
        }
        object.children.forEach(f=>{
          if(f instanceof  THREE.LineSegments ){
            f.material =material2;
f.visible = false;
this.lines.push(f);
          }


        })
      }

      else  if(geometry.scene){
        const material = new THREE.MeshLambertMaterial({color: 0xffffff, flatShading: true, side: THREE.DoubleSide});
let mat;
        object = geometry.scene.children[0];
        object.children.forEach((s:any)=>{


          if(s.children){
            s.children.forEach((ss:any)=> {


              if(ss.geometry){
                ss.material = material;
                ss.geometry.computeBoundingBox();

               const sc = 25 / ss.geometry.boundingBox.max.length();

               mat = new Matrix4();
                mat.scale(new Vector3(sc, sc, sc));

              }
            })
          }

        });
        const mat1 = new Matrix4();
        mat1.makeRotationZ(Math.PI /10);
        object.applyMatrix4(mat1);
        object.applyMatrix4(mat);
        object.position.x=3;
        object.position.y=0;
        object.position.z=0.5;
      }

      else {

        //object.on
        /*object.material = this.material; //outlineMaterial;
        object.position.x=0;
        object.position.y=0;
        object.position.z=0;
       // object.scale = 0.1;
       */
        const vertices = new Float32Array([
          -1.0, -1.0, 1.0,
          1.0, -1.0, 1.0,
          1.0, 1.0, 1.0,

          1.0, 1.0, 1.0,
          -1.0, 1.0, 1.0,
          -1.0, -1.0, 1.0
        ]);

// itemSize = 3 because there are 3 values (components) per vertex
        //geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geometry.computeBoundingBox();

        geometry.computeVertexNormals();
        const sc = 5 / geometry.boundingBox.max.length();
        const material1 = new THREE.MeshBasicMaterial({color: 0xff00ff});
        const material = new THREE.MeshPhongMaterial({specular: 0xff66666, flatShading: true, side: THREE.DoubleSide});
        const mat1 = new Matrix4();
        mat1.makeRotationX(-Math.PI / 2).setPosition(new Vector3(0, -40, 0));
        geometry.applyMatrix4(mat1);

        const mat = new Matrix4();
        mat.scale(new Vector3(sc, sc, sc));

         object = new THREE.Mesh(geometry, material);
        object.applyMatrix4(mat);
        console.log(object);


        // const vnh = new VertexNormalsHelper( object, 5 );
        const index = geometry.getIndex();
        // console.log(index,geometry.attributes.position,geometry.attributes.normal);
        this.verts = [];
        for (let i = 0; i < geometry.attributes.position.array.length / 3; i += 3) {

          const a = geometry.attributes.position.array[i];
          const b = geometry.attributes.position.array[i + 1];
          const c = geometry.attributes.position.array[i + 2];
          this.verts.push([new Vector3(a, b, c)]);
        }

        this.verts.forEach((y, i) => {
          const a = geometry.attributes.normal.array[i];
          const b = geometry.attributes.normal.array[i + 1];
          const c = geometry.attributes.normal.array[i + 2];
          y.push(new Vector3(a, b, c));

        });


        /*
                 for ( let i = 0; i < geometry.attributes.position.array.length/3 -1; i += 3 ) {

                   const a = geometry.attributes.normal.array[i];
                   const b = geometry.attributes.normal.array[i + 1];
                   const c = geometry.attributes.normal.array[i + 2];
                   if(this.verts[i]) this.verts[i].push(new Vector3(a,b,c));
                 }
        */
        const verts: Vector3[][] = [];
        verts.concat(this.verts);
// @ts-ignore
        const xAr = verts.concat(this.verts).sort((a: Vector3[], b: Vector3[]) => a[0].y < b[0].y ? 1 : -1);

        const len = (xAr[0][0].y - xAr[xAr.length - 1][0].y) / 100;
        let po = xAr[0][0].y;
        let ii = 1;
        // console.log(xAr[0],this.verts[0]);
        xAr.forEach(u => {
          if (u[0].y > po - len * ii) {

            //   console.log(ii, u[0].y,   po + len*ii);
          } else {
            ii++;


          }


        });

      }

      // this.scene.add( vnh );
      const light = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
    //  light.position.set( this.camera.position.x+50, this.camera.position.y+60, this.camera.position.z );
      light.position.set(400, -800, 400);
      light.castShadow = true;
      light.shadow.mapSize.width = 512*4;
      light.shadow.mapSize.height =512*4;
  //    const gridHelper = new THREE.GridHelper( 10, 20, 0x888888, 0x444444 );
   //  this.scene.add( gridHelper );
     object.add(light);

      const light1 = new THREE.DirectionalLight( 0xaaaaFF, 0.2 );
      //  light.position.set( this.camera.position.x+50, this.camera.position.y+60, this.camera.position.z );
      //Vector3 {x: 187.92775246216416, y: -33.545392643659326, z: -260.8790265370182}

      //
      light1.position.set(  187.92775246216416,  133.545392643659326,  0);
    //  light1.castShadow = true;
     // light1.shadow.mapSize.width = 1024;
   //   light1.shadow.mapSize.height = 1024;
      object.add(light1);
     // const helper1 = new THREE.DirectionalLightHelper( light1, 100, '#00FF00' );
  // this.scene.add( helper1 );
      object.receiveShadow = true;
      object.castShadow = true;
      this.scene.add( object );
this.group=object;
this.frot = 1-Math.random();
      this.group.rotateZ(this.frot-0.5);



      this.startRenderingLoop();
    },
    // called when loading is in progresses
    ( xhr: any ) =>{
      this.loading = ( xhr.loaded / xhr.total * 100 );
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    ( error: any )=> {

      console.log( error );

    }
  );

}

  sen(files: any) {



    const reader = new FileReader();
const self = this;
    this.createScene();
   // this.loadFile(e.target!.result);
        reader.onload = function(e)
        {
          // console.log(e.target!.result, new File([e.target!.result as BlobPart],'d.stl'));
           const ty=e.target!.result;
self.fRes.next([ty,files.target.files[0].name]);
        };

        reader.readAsDataURL(files.target.files[0]);

  }

  sendCommand($event: any) {

if($event === 'hide' && this.model) { // @ts-ignore
this.model.material.transparent = true; this.model.material.opacity = 0.5; this.lines.forEach(t=>t.visible=true)} ;
    $event === 'show' && this.model ? this.model.visible = true : null;
    $event === 'rot' ? this.group.rotateZ(0.02) : null;
  }
}
