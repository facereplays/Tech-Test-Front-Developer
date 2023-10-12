import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
//import * as dat from '../dat.gui/dat.gui.module.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {AfterViewInit, Component, OnInit} from "@angular/core";
import {ShadersService} from "./shaders.service";
// @ts-ignore
import {Particles} from './particles/particles'
import CameraControls from "camera-controls";
// @ts-ignore
import diffuseFragment from "./shaders/diffuseFragment.glsl"
// @ts-ignore
import InteractiveControls from '../controls/InteractiveControls.js';
// dimensions
// const width = window.innerWidth / 2
// const height = window.innerHeight / 2

@Component({
  selector: 'app-three',
  templateUrl: './full__.component.html',
  styleUrls: ['./three.component.css']
})
export class Full__Component implements OnInit, AfterViewInit {
  private composer!: EffectComposer;
  private cube!: THREE.Mesh;
  private scene?: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer:any;
  private clock!: THREE.Clock;
  private renderPass!: RenderPass;
  private copyPass!: any;
  private intensityImage!: THREE.WebGLRenderTarget;
  private material!: THREE.MeshBasicMaterial;
  private diffuseImage!: THREE.WebGLRenderTarget;
  private diffuseMaterial!: THREE.ShaderMaterial;
  private specularImage!: THREE.WebGLRenderTarget;
  private specularMaterial!: THREE.ShaderMaterial;
  private addSpecularPass!: ShaderPass;
  private addDiffusePass!: ShaderPass;
  private verticalBlurPass!: ShaderPass;
  private edgeModPass!: ShaderPass;
  private stepPass!: ShaderPass;
  private horizontalBlurPass!: ShaderPass;
  private edgeDarkenPass!: ShaderPass;
  private paperPass!: ShaderPass;
  private controls!: OrbitControls;
  private testPass!: ShaderPass;
  private cube1!: THREE.Mesh;
  private materialD!: THREE.MeshBasicMaterial;
  private addDiffuseShader!: any;
  private po: number[];
  private particles!: Particles;
  private currSample!: number;
  private samples: any[];
  private interactive: any;
  private fovHeight!: number;
  private testShader!: any;
constructor(private shaderService:ShadersService) {
  this.po=[];
  this.samples = [
    'assets/images/samples/sample-01.png',
    'assets/images/samples/sample-02.png',
    'assets/images/samples/sample-03.png',
    'assets/images/samples/sample-04.png',
    'assets/images/samples/sample-05.png',
  ];
}
    ngOnInit(): void {
      this.clock = new THREE.Clock();
 }
    ngAfterViewInit(): void {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );

      this.particles = new Particles(this);
      console.log(this.particles.container);
      this.scene.add(this.particles.container);

// create renderer
this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
      this.renderer.setSize( width, height );
// @ts-ignore
      document.getElementById("ff").appendChild( this.renderer.domElement );
      this.renderer.setClearColor( 0xeeeeee);


// set up camera
const canvas = this.renderer.domElement;

      this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.camera.position.z = 300;



      this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
// mouse controls
//const controls;
this.mouseControls();

// generate intensity image
const parameters = { type:THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false }
this.intensityImage = new THREE.WebGLRenderTarget( width, height, parameters )
let tempImage = new THREE.WebGLRenderTarget( width, height, parameters )
this.diffuseImage = new THREE.WebGLRenderTarget( width, height, parameters )
      this.specularImage = new THREE.WebGLRenderTarget( width, height, parameters )
      this.specularImage.texture.generateMipmaps = false;



      this.materialD = new THREE.MeshBasicMaterial();

//paper texture: pigment granulation
const paper = new THREE.TextureLoader().load('/assets/images/paper.jpg')
const paperTarget = new THREE.WebGLRenderTarget( width, height, parameters )
paperTarget.texture = paper
      this.materialD.map=paper;

this.cube = new THREE.Mesh(new THREE.BoxGeometry(2,2),this.materialD);
//this.scene.add(this.cube);


// create RenderPass

this.renderPass = new RenderPass(this.scene, this.camera)
this.renderPass.clear = true
this.renderPass.clearAlpha = 0
 /*
       */
//renderPass.clearColor = 1
     this.addDiffuseShader = {
        uniforms: {
          intensity: {value: null},
          diffuse: {value: this.diffuseImage},
          color0: {type: 'vec3', value: new THREE.Color(0x008ad0)},
          color1: {type: 'vec3', value: new THREE.Color(0x090074)}
        },
        transparent: true,
        vertexShader: this.shaderService.bpVertex(),
        fragmentShader: this.shaderService.addDiffuseFragment()
      }
    this.addDiffusePass = new ShaderPass(this.addDiffuseShader, "intensity")

// blur pass
const hShader = {
  uniforms: {
    tDiffuse: {value: null},
    pat:{value: this.diffuseImage},
    h: {type: 'f', value: 5.0 / 500.0}
  },
  vertexShader: this.shaderService.horizontalBlurVertex(),
  fragmentShader: this.shaderService.horizontalBlurFragment()
}
this.horizontalBlurPass = new ShaderPass(hShader)
const vShader = {
  uniforms: {
    tDiffuse: {value: null},
    v: {type: 'f', value: 5.0 / 500.0}
  },
  vertexShader: this.shaderService.verticalBlurVertex(),
  fragmentShader: this.shaderService.verticalBlurFragment()
}
this.verticalBlurPass = new ShaderPass(vShader)

const stepShader = {
  uniforms: {
    "prev_out": { value: this.intensityImage },
    "k_p": {type: 'f', value: 0.2},
    "c_a": {type: 'f', value: 0.1}
  },
  transparent: true,
  vertexShader: this.shaderService.stepVertex(),
  fragmentShader: this.shaderService.stepFragment()
};
this.stepPass = new ShaderPass(stepShader)

// edge modulation
const edgeModShader = {
  uniforms: {
    "prev_out": { value: null },
    k_delta: {type: 'f', value: 0.8},
    k_rho: {type: 'f', value: 0.3},
    k_theta: {type: 'f', value: 1.},
    paper: {type: 't', value: paperTarget},
  },
  vertexShader: this.shaderService.modVertex(),
  fragmentShader: this.shaderService.modFragment()
}
this.edgeModPass = new ShaderPass(edgeModShader, "prev_out")
  this.addDiffuseShader = {
        uniforms: {
          diffuse:{type:'sampler2D',value:this.diffuseImage},
          intensity: {value: 0.4},
          color0: { value: new THREE.Color(0x008ad0)},
          color1: { value: new THREE.Color(0x090074)}
        },
        transparent: true,
        vertexShader: this.shaderService.bpVertex(),
        fragmentShader: diffuseFragment
      }
// edge darkening
const edgeDarkenShader = {
  uniforms: {
    "intensity": {type:"t",value: this.intensityImage },
    "prev_out": { value: null },
    k_omega: {type: 'f', value: 5.}
  },
  vertexShader: this.shaderService.edgeVertex(),
  fragmentShader: this.shaderService.edgeFragment()
}
this.edgeDarkenPass = new ShaderPass(edgeDarkenShader, "prev_out")

// const paper = new THREE.TextureLoader().load('js/textures/paper.jpg')
// const paperTarget = composer.readBuffer.clone()
// paperTarget.texture = paper
    const paperShader = {
  uniforms: {
    prev_out: { value: null },
    paper: { value: paperTarget},
    k_r: {type: 'f', value: 0.1}
  },
  transparent: true,
  vertexShader: this.shaderService.stepVertex(),
  fragmentShader: this.shaderService.paperFragment()
}
paperShader.uniforms.paper.value.wrapS = paperShader.uniforms.paper.value.wrapT = THREE.RepeatWrapping
this.paperPass = new ShaderPass(paperShader, "prev_out")


function testFragment() {
  return `
 uniform sampler2D tDiffuse;
		uniform sampler2D test;
varying vec2 vUv;

void main() {
vec4 sum = texture2D(test,vUv);

gl_FragColor = sum;
}
	`
}
this.testShader = {
  uniforms: {
    po:{ value: this.po },
    test: { value: null },
    tDiffuse: { value: this.diffuseImage }
  },
  vertexShader: this.shaderService.bpVertex(),
  fragmentShader: testFragment()
}

this.testPass = new ShaderPass(this.testShader)

this.copyPass = new ShaderPass(CopyShader)
      this.copyPass.renderToScreen = false;

this.composer = new EffectComposer(this.renderer)
this.composer.setSize(canvas.width, canvas.height)

const reset = this.composer.renderTarget1.clone()
const reset1 = this.composer.renderTarget1.clone()

      const rnd = ~~(Math.random() * this.samples.length);
      this.goto(rnd);
this.startRenderingLoop();
}
  mouseControls() {
    /* this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      // controls.addEventListener( 'change', render );
      this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      this.controls.dampingFactor = 0.1;
      this.controls.screenSpacePanning = true;
      this.controls.minDistance = 1;
      this.controls.maxDistance = 10;
      this.controls.maxPolarAngle = Math.PI / 2;
      */

  }


  private startRenderingLoop() {

    let component: Full__Component = this;
    (function animate() {

      /***
       *
       *   var diffusePasses = [renderPass, copyPass]
       *   var specularPasses = [renderPass, copyPass]
       *   var intensityPasses = [renderPass, addSpecularPass, addDiffusePass, horizontalBlurPass, verticalBlurPass, edgeModPass, copyPass]
       *   var additionalPasses = [stepPass, edgeDarkenPass, paperPass]
       *
       *
       */
      /*    component.controls.update();

          const delta = component.clock.getDelta();
          component.composer.reset();
          component.renderer.clear();



          const intensityPasses_ = [component.renderPass,component.addSpecularPass,component.addDiffusePass, component.horizontalBlurPass,component.verticalBlurPass,component.edgeModPass,
            component.copyPass]
          const intensityPasses = [component.testPass,component.copyPass]
                        component.composer.passes = intensityPasses



                    */
      const delta = component.clock.getDelta();
component.particles? component.particles.update(delta) : null;

      component.composer.reset();
      component.renderer.clear();
      // composer.renderer.clear();

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      const diffusePasses = [component.renderPass, component.copyPass]
      const specularPasses = [component.renderPass, component.copyPass]
      const intensityPasses = [component.renderPass, component.addDiffusePass,
        component.edgeModPass, component.copyPass]
      const additionalPasses = [component.stepPass, component.edgeDarkenPass,component.paperPass]



      component.composer.passes = diffusePasses

      //component.cube.material = component.diffuseMaterial component.horizontalBlurPass, component.verticalBlurPass,
      //component.composer.readBuffer  = component.diffuseImage, component.paperPass
      component.composer.render(delta)
      component.composer.reset()


                        component.composer.passes = specularPasses

                  component.cube.material = component.specularMaterial
                  component.composer.readBuffer = component.specularImage
                  component.composer.render(delta)
                  component.composer.reset()

                        component.composer.passes = intensityPasses

                        component.cube.material = component.material
                        component.composer.writeBuffer = component.intensityImage
                        component.composer.render(delta)	// reset render target
                        component.composer.reset()


                        component.composer.passes = additionalPasses
                        // composer.passes = [testPass]
                        component.composer.render(delta);  /*  */
      requestAnimationFrame( animate );


    }());
  }
  goto(index:number) {
    // init next
    if (this.currSample == null) this.particles.init(this.samples[index]);
    // hide curr then init next
    else {
      this.particles.hide(true).then(() => {
        this.particles.init(this.samples[index]);
      });
    }

    this.currSample = index;
  }
  cl($event: MouseEvent) {
    console.log($event);
    this.po=[$event.offsetX,$event.offsetY]
  }

  un() {
    this.po=[]
  }
}
