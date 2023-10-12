import * as THREE from 'three';

import TouchTexture from './touchTexture';

// @ts-ignore
//import particleVe from "./shaders/particleVe.glsl"
// @ts-ignore
//import particleFe from "./shaders/particleFe.glsl"

// @ts-ignore
import TweenLite from "gsap/gsap-core";
// @ts-ignore
import Quad from "gsap/all";
export  class Particles {
 public container: THREE.Object3D;
  private texture!: THREE.Texture;
  private width!: number;
  private height!: number;
  private numPoints!: number;
  private webgl: any;
  private hitArea!: THREE.Mesh;
  public touch: any;
  private object3D!: THREE.Mesh;
  private handlerInteractiveMove: any;
  private material!: THREE.RawShaderMaterial;
  private originalColors: any;
  private mat: THREE.MeshBasicMaterial;
  private down: boolean = false;

	constructor(webgl: any) {
		this.webgl = webgl;
		this.container = new THREE.Object3D();
    this.mat =new THREE.MeshBasicMaterial( );
	}

	init(src:any) {
		const loader = new THREE.TextureLoader();

		loader.load(src, (texture) => {
			this.texture = texture;
			this.texture.minFilter = THREE.LinearFilter;
			this.texture.magFilter = THREE.LinearFilter;
			this.texture.format = THREE.RGBAFormat;

			this.width = texture.image.width;
			this.height = texture.image.height;

			this.initPoints(true);
			this.initHitArea();
			this.initTouch();
			this.resize();
			this.show();
		});
	}

	initPoints(discard: boolean) {
		this.numPoints = this.width * this.height;

		let numVisible = this.numPoints;
		let threshold = 0;

		if (discard) {
			// discard pixels darker than threshold #22
			numVisible = 0;
			threshold = 54;

			const img = this.texture.image;
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			canvas.width = this.width;
			canvas.height = this.height;
			ctx!.scale(1, -1);
			ctx!.drawImage(img, 0, 0, this.width, this.height * -1);

			const imgData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
			this.originalColors = Float32Array.from(imgData.data);

			for (let i = 0; i < this.numPoints; i++) {
				if (this.originalColors[i * 4 + 0] > threshold) numVisible++;
			}


		}

		const uniforms = {
			uTime: { value: 0 },
			uRandom: { value: 1.0 },
			uDepth: { value: 2.0 },
			uSize: { value: 0.0 },
			uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
			uTexture: { value: this.texture },
			uTouch: { value: null },
		};
    function particlesFe(){

      return `uniform sampler2D uTexture;
precision highp float;
varying vec2 vPUv;
varying vec2 vUv;

void main() {
vec4 color = vec4(0.0);
vec2 uv = vUv;
vec2 puv = vPUv;

// pixel color
vec4 colA = texture2D(uTexture, puv);

// greyscale
float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
vec4 colB = vec4(0, 0, 0, 1.0);

// circle
float border = 0.3;
float radius = 0.5;
float dist = radius - distance(uv, vec2(0.5));
float t = smoothstep(0.0, border, dist);

// final color
color = colB;
color.a = t;

gl_FragColor = color;
}`
    }
    function particlesVe() {
      return `precision highp float;

    attribute float pindex;
    attribute vec3 position;
    attribute vec3 offset;
    attribute vec2 uv;
    attribute float angle;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    uniform float uTime;
    uniform float uRandom;
    uniform float uDepth;
    uniform float uSize;
    uniform vec2 uTextureSize;
    uniform sampler2D uTexture;
    uniform sampler2D uTouch;

    varying vec2 vPUv;
    varying vec2 vUv;
varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 v_uv;

    vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

    float random(float n) {
      return fract(sin(n) * 43758.5453123);
    }

    void main() {
      vUv = uv;

      // particle uv
      vec2 puv = offset.xy / uTextureSize;
      vPUv = puv;

      // pixel color
      vec4 colA = texture2D(uTexture, puv);
      float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

      // displacement
      vec3 displaced = offset;
      // randomise
      displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
      float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.1)));
      displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
      // center
      displaced.xy -= uTextureSize * 0.5;

      // touch
      float t = texture2D(uTouch, puv).r;
      displaced.z += t * 20.0 * rndz;
      displaced.x += cos(angle) * t * 20.0 * rndz;
      displaced.y += sin(angle) * t * 20.0 * rndz;

      // particle size
      float psize = (snoise(vec2(uTime, pindex) * 0.5) + 2.0);
      psize *= max(grey, 0.2);
      psize *= uSize;

      // final position
      vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
      mvPosition.xyz += position * psize;
      vec4 finalPosition = projectionMatrix * mvPosition;
   	vUv = uv;
			vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
		//	gl_Position = projectionMatrix * modelViewPosition;
      gl_Position = finalPosition;
    }`
    }

    this.material = new THREE.RawShaderMaterial({
			uniforms,
			vertexShader: particlesVe(),
			fragmentShader: particlesFe(),
			depthTest: false,
			transparent: true,
			// blending: THREE.AdditiveBlending
		});

		const geometry = new THREE.InstancedBufferGeometry();

		// positions
		const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
		positions.setXYZ(0, -0.5,  0.5,  0.0);
		positions.setXYZ(1,  0.5,  0.5,  0.0);
		positions.setXYZ(2, -0.5, -0.5,  0.0);
		positions.setXYZ(3,  0.5, -0.5,  0.0);
		geometry.addAttribute('position', positions);

		// uvs
		const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
		uvs.setXYZ(0,  0.0,  0.0,0);
		uvs.setXYZ(1,  1.0,  0.0,0);
		uvs.setXYZ(2,  0.0,  1.0,0);
		uvs.setXYZ(3,  1.0,  1.0,0);
		geometry.addAttribute('uv', uvs);

		// index
		geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1));

		const indices = new Uint16Array(numVisible);
		const offsets = new Float32Array(numVisible * 3);
		const angles = new Float32Array(numVisible);

		for (let i = 0, j = 0; i < this.numPoints; i++) {
			if (discard && this.originalColors[i * 4 + 0] <= threshold) continue;

			offsets[j * 3 + 0] = i % this.width;
			offsets[j * 3 + 1] = Math.floor(i / this.width);

			indices[j] = i;

			angles[j] = Math.random() * Math.PI;

			j++;
		}

		geometry.addAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
		geometry.addAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
		geometry.addAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));

		this.object3D = new THREE.Mesh(geometry,this.material);
    this.object3D.position.z = 0;
		//this.container.add(this.object3D);
    const co = this.width/this.height;
    const cu= new THREE.Mesh(new THREE.PlaneGeometry(this.width*2,this.height*2,1),this.mat);

   // this.container.add(cu);
    //cu.position.z=-100;
	}

	initTouch() {
		// create only once
		if (!this.touch) this.touch = new TouchTexture(this);
		this.material.uniforms['uTouch'].value = this.touch.texture;
    console.log(this.hitArea.material);
    // @ts-ignore
   this.hitArea.material.map=this.touch.texture;
    this.object3D.material=new THREE.MeshBasicMaterial({map:this.touch.texture});
	}

	initHitArea() {
		const geometry = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
		const material = new THREE.MeshBasicMaterial({ depthTest: false });

		this.hitArea = new THREE.Mesh(geometry, material);
this.hitArea.visible = true;
		this.container.add(this.hitArea);
	}

	addListeners() {
		this.handlerInteractiveMove = this.onInteractiveMove.bind(this);
    this.webgl.interactive.addListener('interactive-up',this.onInteractiveUp.bind(this));
    this.webgl.interactive.addListener('interactive-down',this.onInteractiveDown.bind(this));
		this.webgl.interactive.addListener('interactive-move', this.handlerInteractiveMove);
		this.webgl.interactive.objects.push(this.hitArea);
		this.webgl.interactive.enable();
	}

	removeListeners() {
		this.webgl.interactive.removeListener('interactive-move', this.handlerInteractiveMove);

		// @ts-ignore
    const index = this.webgl.interactive.objects.findIndex(obj => obj === this.hitArea);
		this.webgl.interactive.objects.splice(index, 1);
		this.webgl.interactive.disable();
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update(delta: number) {
		if (!this.object3D) return;
		if (this.touch) this.touch.update();

		this.material.uniforms['uTime'].value += delta;
	}

	show(time = 1.0) {
		// reset
		TweenLite.fromTo(this.material.uniforms['uSize'], time, { value: 0.5 }, { value: 1.5 });
		TweenLite.to(this.material.uniforms['uRandom'], time, { value: 2.0 });
		TweenLite.fromTo(this.material.uniforms['uDepth'], time * 1.5, { value: 40.0 }, { value: 4.0 });

		this.addListeners();
	}

	hide(_destroy: any, time = 0.8) {
		return new Promise((resolve, reject) => {
			TweenLite.to(this.material.uniforms['uRandom'], time, { value: 5.0, onComplete: () => {
				if (_destroy) this.destroy();
				resolve(this);
			} });
			TweenLite.to(this.material.uniforms['uDepth'], time, { value: -20.0, ease: Quad.easeIn });
			TweenLite.to(this.material.uniforms['uSize'], time * 0.8, { value: 0.0 });

			this.removeListeners();
		});
	}

	destroy() {
		if (!this.object3D) return;

		this.object3D.parent!.remove(this.object3D);
		this.object3D.geometry.dispose();
	//	this.object3D.material!.dispose();
		// @ts-ignore
    delete(this.object3D);

		if (!this.hitArea) return;

		this.hitArea.parent!.remove(this.hitArea);
		this.hitArea.geometry.dispose();
	//	this.hitArea.material!.dispose();
		// @ts-ignore
    delete(this.hitArea);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.object3D) return;

		const scale = this.webgl.fovHeight / this.height;

		this.object3D.scale.set(scale, scale, 1);
		this.hitArea.scale.set(scale, scale, 1);
	}

	onInteractiveMove(e: any) {
		const uv = e.intersectionData.uv;
    const force = e.touch;
		if (this.touch && this.down) this.touch.addTouch(uv,force);
	}
  onInteractiveUp(e: any) {
    this.down = false;

  }
  onInteractiveDown(e: any) {
    this.down = true;
    const uv = e.intersectionData.uv;
    const force = e.touch;
    if (this.touch) this.touch.tUp(uv,force);
  }
}
