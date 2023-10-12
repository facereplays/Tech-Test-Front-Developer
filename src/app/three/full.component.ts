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
import diffuseFragment from "./shaders/diffuseFragment.glsl"

// dimensions
// const width = window.innerWidth / 2
// const height = window.innerHeight / 2

@Component({
  selector: 'app-three',
  templateUrl: './full__.component.html',
  styleUrls: ['./three.component.css']
})
export class FullComponent implements OnInit, AfterViewInit {
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
  private verticalBlurPass!: ShaderPass;
  private edgeModPass!: ShaderPass;
  private stepPass!: ShaderPass;
  private horizontalBlurPass!: ShaderPass;
  private edgeDarkenPass!: ShaderPass;
  private paperPass!: ShaderPass;
  private controls!: OrbitControls;
  private testPass!: ShaderPass;

  private materialD!: THREE.MeshBasicMaterial;
  private addDiffuseShader!: any;
constructor(private shaderService:ShadersService) {
}
    ngOnInit(): void {
      this.clock = new THREE.Clock();

        //throw new Error('Method not implemented.');
    }
    ngAfterViewInit(): void {
      const width = 600;
      const height = 600;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );



// set up scene and camera

// scene.background = new THREE.Color( 0x123456 )



// add lights
const pointLight = new THREE.PointLight(0xffffff, 7.0);
pointLight.position.set(0.65, 0.65, 0.9);
this.scene.add(pointLight);

// create geometry
// const geometry = new THREE.SphereBufferGeometry(2, 30, 30);
// const geometry = new THREE.BoxGeometry(2, 2, 2);
const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
this.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
this.cube = new THREE.Mesh( geometry, this.material );
this.scene.add(this.cube);

// create renderer
this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
      this.renderer.setSize( width, height );
// @ts-ignore
      document.getElementById("ff").appendChild( this.renderer.domElement );
      this.renderer.setClearColor( 0xffffff );


// set up camera
const canvas = this.renderer.domElement;
this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.camera.position.z = 5;

// mouse controls
//const controls;
this.mouseControls();

// generate intensity image
const parameters = { type:THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false }
this.intensityImage = new THREE.WebGLRenderTarget( width, height, parameters )
this.diffuseImage = new THREE.WebGLRenderTarget( width, height, parameters )
      this.specularImage = new THREE.WebGLRenderTarget( width, height, parameters )
      this.specularImage.texture.generateMipmaps = false;

this.diffuseMaterial = new THREE.ShaderMaterial({
  uniforms: {
    baseColor: { value: new THREE.Color(0xff00ff)},
    k_diffuse: { value: 3.},
    p: { value: 50.},
    cameraPosition: { value: this.camera.position},
    lightPos: { value: pointLight.position},
    lightIntensity: { value: new THREE.Vector3().addScalar(pointLight.intensity)}
  },
  vertexShader: this.shaderService.bpVertex(),
  fragmentShader: this.shaderService.diffuseFragment()
})

this.specularMaterial = new THREE.ShaderMaterial({
  uniforms: {
    baseColor: { value: new THREE.Color(0xffffff)},
    k_specular: { value: 5.},
    p: { value: 50.},
    cameraPosition: { value: this.camera.position},
    lightPos: { value: pointLight.position},
    lightIntensity: { value: new THREE.Vector3().addScalar(pointLight.intensity)}
  },
  vertexShader: this.shaderService.bpVertex(),
  fragmentShader: this.shaderService.specularFragment()
})

      this.materialD = new THREE.MeshBasicMaterial();

//paper texture: pigment granulation
const paper = new THREE.TextureLoader().load('/assets/images/paper.jpg')
const paperTarget = new THREE.WebGLRenderTarget( width, height, parameters )
paperTarget.texture = paper
      this.materialD.map=paper;
// create RenderPass
this.renderPass = new RenderPass(this.scene, this.camera)
this.renderPass.clear = true
this.renderPass.clearAlpha = 0
//renderPass.clearColor = 1

const addSpecularShader = {
  uniforms: {
    "intensity": {value: 1},
    "specular": {type:'t', value: this.specularImage},
    "k_s": {value: 0.1}
  },
  transparent: true,
  vertexShader: this.shaderService.bpVertex(),
  fragmentShader: this.shaderService.addSpecularFragment()
}
this.addSpecularPass = new ShaderPass(addSpecularShader, "intensity")



// blur pass
const hShader = {
  uniforms: {
    tDiffuse: {value: null},
    h: {type: 'f', value: 1.0 / 500.0}
  },
  vertexShader: this.shaderService.horizontalBlurVertex(),
  fragmentShader: this.shaderService.horizontalBlurFragment()
}
this.horizontalBlurPass = new ShaderPass(hShader)
const vShader = {
  uniforms: {
    tDiffuse: {value: null},
    v: {type: 'f', value: 1.0 / 500.0}
  },
  vertexShader: this.shaderService.verticalBlurVertex(),
  fragmentShader: this.shaderService.verticalBlurFragment()
}
this.verticalBlurPass = new ShaderPass(vShader)

const stepShader = {
  uniforms: {
    "prev_out": { value: this.intensityImage },
    "k_p": {type: 'f', value: 0.7},
    "c_a": {type: 'f', value: 0.4}
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
    k_delta: {type: 'f', value: 0.1},
    k_rho: {type: 'f', value: 0.6},
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
    k_omega: {type: 'f', value: 1.}
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
    k_r: {type: 'f', value: 0.8},
    upscale: {type:'vec2', value: new THREE.Vector2(2,2) }
  },
  transparent: true,
  vertexShader: this.shaderService.stepVertex(),
  fragmentShader: this.shaderService.paperFragment()
}
paperShader.uniforms.paper.value.wrapS = paperShader.uniforms.paper.value.wrapT = THREE.RepeatWrapping
this.paperPass = new ShaderPass(paperShader, "prev_out")

//////////////////////////// GUI STUFF ////////////////////////////////////////////
// allows you to move the camera with the mouse


// creates the GUI
//
 /*
function initGui() {
  const gui = new dat.GUI({autoPlace: false});
  document.getElementById("full-pipeline_gui").appendChild( gui.domElement );
  // diffuse
  const diffuseColor = {
    diffuse_color0: '#008ad0',
    diffuse_color1: '#090074',
  };
  const folder_color = gui.addFolder('Color');
  folder_color.addColor(diffuseColor, 'diffuse_color0').name('Diffuse Color 0').onChange(function (value) {
    addDiffuseShader.uniforms.color0.value = new THREE.Color(value);
    addDiffusePass = new ShaderPass(addDiffuseShader, "intensity");
  });
  folder_color.addColor(diffuseColor, 'diffuse_color1').name('Diffuse Color 1').onChange(function (value) {
    addDiffuseShader.uniforms.color1.value = new THREE.Color(value);
    addDiffusePass = new ShaderPass(addDiffuseShader, "intensity");
  });
  // blurring
  const blurStrength = {
    blurh: 500,
    blurv: 500,
  };
  const folder_blur = gui.addFolder('Blur');
  folder_blur.add(blurStrength, 'blurh', 150, 600, 50).name('Horizontal Blur').onChange(function (value) {
    hShader.uniforms.h.value = Math.pow(value, -1);
    horizontalBlurPass = new ShaderPass(hShader);
  });
  folder_blur.add(blurStrength, 'blurv', 150, 600, 50).name('Vertical Blur').onChange(function (value) {
    vShader.uniforms.v.value = Math.pow(value, -1);
    verticalBlurPass = new ShaderPass(vShader);
  });
  // step
  const stepConstants = {
    k_p: 0.7,
  }
  const folder_step = gui.addFolder('Step');
  folder_step.add(stepConstants, 'k_p', 0.1, 0.9, 0.1).name('Step').onChange(function (value) {
    stepShader.uniforms.k_p.value = value;
    stepPass = new ShaderPass(stepShader);
  });
  // darkening
  const edgeDarkConstant = {
    k_omega: 1.,
  };
  const folder_edges = gui.addFolder('Edges');
  folder_edges.add(edgeDarkConstant, 'k_omega', 0.0, 5.).name('Edge Darkening').onChange(function (value) {
    edgeDarkenShader.uniforms.k_omega.value = value;
    edgeDarkenPass = new ShaderPass(edgeDarkenShader, "prev_out");
  });
  // edge modulation
  const edgeModConstant = {
    k_theta: 1.,
  };
  const folder_paper = gui.addFolder('Paper Texture');
  folder_paper.add(edgeModConstant, 'k_theta', 0.0, 3.).name('Edge Mod').onChange(function (value) {
    edgeModShader.uniforms.k_theta.value = value;
    edgeModPass = new ShaderPass(edgeModShader, "prev_out");
  });
  // pigment granulation
  const pigGranulationConst = {
    k_r: 1.,
  };
  folder_paper.add(pigGranulationConst, 'k_r', 0.0, 3.).name('Pigment').onChange(function (value) {
    paperShader.uniforms.k_r.value = value;
    paperPass = new ShaderPass(paperShader, "prev_out");
  });
}
//////////////////////////// GUI END ////////////////////////////////////////////
*/
function testFragment() {
  return `
		uniform sampler2D test;
		varying vec2 vUv;

		void main() {
			gl_FragColor = texture2D(test, vUv);
		}
	`
}

const testShader = {
  uniforms: {
    "test": { value: this.diffuseImage }
  },
  vertexShader: this.shaderService.edgeVertex(),
  fragmentShader: testFragment()
}

this.testPass = new ShaderPass(testShader)

this.copyPass = new ShaderPass(CopyShader)
      this.copyPass.renderToScreen = false;

this.composer = new EffectComposer(this.renderer)
this.composer.setSize(canvas.width, canvas.height)



this.startRenderingLoop();
}
  mouseControls() {
   this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    // controls.addEventListener( 'change', render );
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.1;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 2;
  }


  private startRenderingLoop() {

    let component: FullComponent = this;
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
      component.controls.update();

      const delta = component.clock.getDelta();
      //component.composer.reset();component.renderer.clear();
      //console.log(delta);
      //
    //
     //
      // composer.renderer.clear();

      component.cube.rotation.x += 0.01;
      component.cube.rotation.y += 0.01;
      const diffusePasses = [component.renderPass, component.copyPass]
      const specularPasses = [component.renderPass, component.copyPass]



           component.composer.passes = diffusePasses

           // @ts-igne
            component.cube.material = component.diffuseMaterial
               component.composer.readBuffer  = component.diffuseImage

               component.composer.render(delta)
         component.composer.passes = specularPasses

                                    component.cube.material = component.specularMaterial
                                    component.composer.readBuffer = component.specularImage
                                    component.composer.render(delta)
                          component.composer.reset()
      /*
             // console.log(component.diffuseImage.texture);component.addDiffusePass,
                component.addDiffusePass = new ShaderPass(component.addDiffuseShader, "intensity")

                const intensityPasses = [component.renderPass,component.addSpecularPass,component.addDiffusePass, component.horizontalBlurPass,component.verticalBlurPass,component.edgeModPass,
                  component.copyPass]

                              component.composer.passes = intensityPasses


                               component.cube.material = component.material
                               component.composer.writeBuffer = component.intensityImage
                               component.composer.render(delta)
                                    component.composer.reset()


                                        component.composer.passes = additionalPasses

                                          component.composer.render(delta);
                      */
              /*  component.renderer.render(component.scene, component.camera);*/
      requestAnimationFrame(animate);

    }());
  }
}
