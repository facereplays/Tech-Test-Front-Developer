import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShadersService {

  constructor() { }

  edgeVertex() {
    return `
		varying vec2 vUv;


		void main() {
			vUv = uv;
			vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * modelViewPosition;
		}
	`
  }

  edgeFragment() {
    return `
    uniform sampler2D intensity;
    uniform sampler2D prev_out;
    uniform float k_omega;
    uniform float alpha;
    varying vec2 vUv;

    vec4 edge_darken(sampler2D rho, sampler2D lambda, vec2 uv) {
      vec4 lambda_xy = texture2D(lambda, uv);
      vec4 rho_xy = texture2D(rho, uv);
      lambda_xy.a = lambda_xy.a * (1.0 + k_omega * (1.0 - rho_xy.a));
      return lambda_xy;
    }

    void main() {
   gl_FragColor =   texture2D(prev_out, vUv);

    //  gl_FragColor = edge_darken(intensity, prev_out, vUv);
     // gl_FragColor.a *= alpha;
    }
  `
  }
  shadowVertex() {
    return `
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 v_uv;

    void main() {
      v_uv = uv;
      v_position = modelViewMatrix * vec4(position, 1.0);
      v_normal = vec4(normalize(vec3(modelViewMatrix*vec4(normal, 0.0))), 0.0);
      gl_Position = projectionMatrix * v_position;
    }
  `
  }
  texVertex() {
    return `
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 v_uv;

    void main() {
      v_uv = uv;
      v_position = modelViewMatrix * vec4(position, 1.0);
      v_normal = vec4(normalize(vec3(modelViewMatrix*vec4(normal, 0.0))), 0.0);
      gl_Position = projectionMatrix * v_position;
    }
  `
  }

  texFragment() {
    return `
    // uniforms from geometry
    uniform vec3 baseColor;
    uniform float k_ambient;
    uniform float k_diffuse;
    uniform float k_specular;
    uniform float p;
    // uniforms for camera and lights
    uniform vec3 cameraPos;
    uniform vec3 lightPos;
    uniform vec3 lightIntensity;
    uniform vec3 lightColor;
    // texture
    uniform sampler2D paper;
    // outputs from vertex shader
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 v_uv;

    void main() {
      float NdotL = dot(lightPos, v_normal.xyz);
      float r = length(lightPos - v_position.xyz); // radius
      vec3 h = (cameraPos + lightPos) / length(cameraPos + lightPos); // half-vector

      float specularSize = (NdotL > 3.55) ? 1. : 0.;
      vec3 specular = k_specular * (lightIntensity / (r * r)) * pow(max(0.0, dot(normalize(v_normal.xyz), normalize(h))), p);
      specular = specular * specularSize;
      // specular = lightColor * specular;
      specular = smoothstep(0.01, 0.03, specular) * 0.6;
      if (specular.r > 0.0) // makes specular region transparent
        discard;

      vec3 color = texture2D(paper, vec2(v_uv.x, v_uv.y)).rgb * baseColor;
      float alpha = (1. - (color.r*0.5 + color.g*0.2 + color.b*0.5)) * 2. + 0.2;
      gl_FragColor = vec4(color, alpha);

      // NOTE: if solid specular region wanted, uncomment this + lightColor and comment discard code
      // vec3 color = texture2D(paper, vec2(v_uv.x, v_uv.y)).rgb * baseColor;
      // float alpha = color.r*0.5 + color.g*0.2 + color.b*0.5;
      // vec3 spec_color = texture2D(paper, vec2(v_uv.x, v_uv.y)).rgb * specular;
      // gl_FragColor = vec4(color, alpha) + vec4(spec_color, alpha);
    }
  `
  }
  modVertex() {
    return `
		varying vec2 vUv;
 // uniform sampler2D diffuse;
     //uniform sampler2D face;
varying vec4 v_position;
		void main() {
			vUv = uv;
		v_position=modelViewMatrix * vec4(position, 1.0);
		gl_Position =  projectionMatrix * v_position;
			//	gl_Position =  vec4(position, 1.0);
		}
	`
  }

  modFragment() {
    return `
    uniform sampler2D diffuse;
      uniform sampler2D faceOut;
	 varying vec2 vUv;
//varying vec4 v_position;
    void main() {
	vec4 faceI = texture2D(faceOut, vUv);
			vec4 color = texture2D(diffuse, vUv);
  	//		gl_FragColor = color;
  gl_FragColor = faceI;
    }
  `
  }

  diffuseVertex() {
    return `
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 v_uv;

    void main() {
      v_uv = uv;
      v_position = modelViewMatrix * vec4(position, 1.0);
      v_normal = vec4(normalize(vec3(modelViewMatrix*vec4(normal, 0.0))), 0.0);
      gl_Position = projectionMatrix * v_position;
    }
  `
  }

  diffuseFragment_() {
    return `
    // uniforms from geometry
    uniform vec3 baseColor;
    uniform float k_ambient;
    uniform float k_diffuse;
    uniform float k_specular;
    uniform float p;
    // uniforms for camera and lights
    uniform vec3 cameraPos;
    uniform vec3 lightPos;
    uniform vec3 lightIntensity;
    uniform vec3 lightColor;
    // texture
    uniform sampler2D paper;
    // outputs from vertex shader
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 v_uv;

    void main() {
      float NdotL = dot(lightPos, v_normal.xyz);
      float r = length(lightPos - v_position.xyz); // radius
      vec3 h = (cameraPos + lightPos) / length(cameraPos + lightPos); // half-vector

      float specularSize = (NdotL > 3.55) ? 1. : 0.;
      vec3 specular = k_specular * (lightIntensity / (r * r)) * pow(max(0.0, dot(normalize(v_normal.xyz), normalize(h))), p);
      specular = specular * specularSize;
      // specular = lightColor * specular;
      specular = smoothstep(0.01, 0.03, specular) * 0.6;
      if (specular.r > 0.0) // makes specular region transparent
        discard;

      vec4 ambient = k_ambient * vec4(1.0, 1.0, 1.0, 1.0);
      vec4 diffuse = vec4(k_diffuse * (lightIntensity / (r * r)) * max(0.0, dot(normalize(v_normal.xyz), normalize(lightPos))), 1.0);

      vec3 color = texture2D(paper, vec2(v_uv.x, v_uv.y)).rgb * (ambient.rgb + diffuse.rgb) * baseColor;
      float alpha = (1. - (color.r*0.8 + color.g*0.1 + color.b*0.7)) * 0.9;
      gl_FragColor = vec4(color, alpha);
    }
  `
  }
  midtoneVertex() {
    return `
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 v_uv;

    void main() {
      v_uv = uv;
      v_position = modelViewMatrix * vec4(position, 1.0);
      v_normal = vec4(normalize(vec3(modelViewMatrix*vec4(normal, 0.0))), 0.0);
      gl_Position = projectionMatrix * v_position;
    }
  `
  }

  midtoneFragment() {
    return `
    // uniforms from geometry
    uniform vec3 baseColor;
    uniform float k_ambient;
    uniform float k_diffuse;
    uniform float k_specular;
    uniform float p;
    // uniforms for camera and lights
    uniform vec3 cameraPos;
    uniform vec3 lightPos;
    uniform vec3 lightIntensity;
    uniform vec3 lightColor;
    // texture
    uniform sampler2D paper;
    // outputs from vertex shader
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 v_uv;

    void main() {
      float NdotL = dot(lightPos, v_normal.xyz);
      float r = length(lightPos - v_position.xyz); // radius
      vec3 h = (cameraPos + lightPos) / length(cameraPos + lightPos); // half-vector

      float softToon = (NdotL > 1.8) ? 1. : 0.;
      softToon = smoothstep(1.8, 2., NdotL);
      if (softToon > 0.0)
        discard;

      vec3 color = texture2D(paper, vec2(v_uv.x, v_uv.y)).rgb * baseColor;
      float alpha = (1. - (color.r*0.8 + color.g*0.1 + color.b*0.7)) * 0.9;
      gl_FragColor = vec4(color, alpha);
    }
  `
  }

  paperFragment() {
    return `
    uniform sampler2D prev_out;
    uniform sampler2D paper;
    uniform float k_r;
     uniform vec2 upscale;
    varying vec2 vUv;

    void main() {

      vec3 color = texture2D(paper, vUv*upscale).rgb;
      float alpha = (1. - (color.r*0.5 + color.g*0.2 + color.b*0.5));
      gl_FragColor = texture2D(prev_out, vUv);
     gl_FragColor.a = k_r * alpha +  gl_FragColor.a;
    }
  `
  }

  shadowFragment() {
    return `
    // uniforms from geometry
    uniform vec3 baseColor;
    uniform float k_ambient;
    uniform float k_diffuse;
    uniform float k_specular;
    uniform float p;
    // uniforms for camera and lights
    uniform vec3 cameraPos;
    uniform vec3 lightPos;
    uniform vec3 lightIntensity;
    uniform vec3 lightColor;
    // texture
    uniform sampler2D paper;
    // outputs from vertex shader
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 v_uv;

    void main() {
      float NdotL = dot(lightPos, v_normal.xyz);
      float r = length(lightPos - v_position.xyz); // radius
      vec3 h = (cameraPos + lightPos) / length(cameraPos + lightPos); // half-vector

      float toon = (NdotL > 1.5) ? 1. : 0.;
      toon = smoothstep(1.5, 1.7, NdotL); // blurs the light and shadow edge
      vec4 toonLight = vec4(toon * (lightIntensity / (r * r)), 1.0);
      if (toonLight.r > 0.0)
        discard;

      vec3 color = texture2D(paper, vec2(v_uv.x, v_uv.y)).rgb * baseColor;
      float alpha = (1. - (color.r*0.8 + color.g*0.1 + color.b*0.7));
      gl_FragColor = vec4(color, alpha);
    }
  `
  }




  bpFragment() {
    return `
    // uniforms from geometry
    uniform vec3 baseColor;
    uniform float k_ambient;
    uniform float k_diffuse;
    uniform float k_specular;
    uniform float p;
    // uniforms for camera and lights
    uniform vec3 cameraPos;
    uniform vec3 lightPos;
    uniform vec3 lightIntensity;
    // outputs from vertex shader
    varying vec4 v_position;
    varying vec4 v_normal;
    void main() {
      // blinn-phong shader
      float r = length(lightPos - v_position.xyz); // radius
      vec3 h = (cameraPos + lightPos) / length(cameraPos + lightPos); // half-vector
      vec4 ambient = k_ambient * vec4(1.0, 1.0, 1.0, 1.0);
      vec4 diffuse = vec4(k_diffuse * (lightIntensity / (r * r)) * max(0.0, dot(normalize(v_normal.xyz), normalize(lightPos))), 1.0);
      vec4 specular = vec4(k_specular * (lightIntensity / (r * r)) * pow(max(0.0, dot(normalize(v_normal.xyz), normalize(h))), p), 1.0);
      gl_FragColor = ambient + diffuse + specular;
      gl_FragColor = gl_FragColor * vec4(baseColor, 1.0);
    }
  `
  }

  bpPassFragment() {
    return `
    // uniforms from geometry
    uniform sampler2D prev_out;
    uniform float k_ambient;
    uniform float k_diffuse;
    uniform float k_specular;
    uniform float p;
    // uniforms for camera and lights
    uniform vec3 cameraPos;
    uniform vec3 lightPos;
    uniform vec3 lightIntensity;
    // outputs from vertex shader
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 vUv;

    void main() {
      // blinn-phong shader
      float r = length(lightPos - v_position.xyz); // radius
      vec3 h = (cameraPos + lightPos) / length(cameraPos + lightPos); // half-vector
      vec4 ambient = k_ambient * vec4(1.0, 1.0, 1.0, 1.0);
      vec4 diffuse = vec4(k_diffuse * (lightIntensity / (r * r)) * max(0.0, dot(normalize(v_normal.xyz), normalize(lightPos))), 1.0);
      vec4 specular = vec4(k_specular * (lightIntensity / (r * r)) * pow(max(0.0, dot(normalize(v_normal.xyz), normalize(h))), p), 1.0);
      gl_FragColor = ambient + diffuse + specular;
      gl_FragColor = gl_FragColor * vec4(baseColor, 1.0);
    }
  `
  }



  diffuseFragment() {
    return `
    // uniforms from geometry
    uniform vec3 baseColor;
    uniform float k_diffuse;
    uniform float p;
    // uniforms for camera and lights
    uniform vec3 cameraPos;
    uniform vec3 lightPos;
    uniform vec3 lightIntensity;
    // outputs from vertex shader
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 vUv;

    void main() {
      // blinn-phong shader
      float r = length(lightPos - v_position.xyz); // radius
      vec3 h = (cameraPos + lightPos) / length(cameraPos + lightPos); // half-vector
      vec4 diffuse = vec4(k_diffuse * (lightIntensity / (r * r)) * max(0.0, dot(normalize(v_normal.xyz), normalize(lightPos))), 1.0);
      gl_FragColor = diffuse;
      gl_FragColor = gl_FragColor * vec4(baseColor, 1.0);
    }
  `
  }
  specularFragment() {
    return `
    // uniforms from geometry
    uniform vec3 baseColor;
    uniform float k_specular;
    uniform float p;
    // uniforms for camera and lights
    uniform vec3 cameraPos;
    uniform vec3 lightPos;
    uniform vec3 lightIntensity;
    // outputs from vertex shader
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec2 vUv;

    void main() {
      // blinn-phong shader
      float r = length(lightPos - v_position.xyz); // radius
      vec3 h = (cameraPos + lightPos) / length(cameraPos + lightPos); // half-vector
      vec4 specular = vec4(k_specular * (lightIntensity / (r * r)) * pow(max(0.0, dot(normalize(v_normal.xyz), normalize(h))), p), 1.0);
      gl_FragColor = specular;
      gl_FragColor = gl_FragColor * vec4(baseColor, 1.0);
    }
  `
  }

  addSpecularFragment() {
    return `
    uniform sampler2D intensity;
    uniform sampler2D specular;
    uniform float k_s;
    varying vec2 vUv;

    void main() {
      vec4 Ls_xy = texture2D(specular, vUv);
      vec4 prev_xy = texture2D(intensity, vUv);
      float result = prev_xy.a * (1.0 - step(k_s, Ls_xy.r));
      // float result = step(k_s, vec3(Ls_xy)).r * prev_xy.a;
      gl_FragColor = vec4(prev_xy.rgb, result);
    }
  `
  }
  mixTex() {
    return `
     uniform sampler2D t1;
    uniform sampler2D t2;

    varying vec2 vUv;
      void main() {
      vec4 L1 = texture2D(t1, vUv);
      vec4 L2 = texture2D(t2, vUv);

      gl_FragColor = (L1+L2)*0.5;
        gl_FragColor.a = L1.a+L2.a;
    }
    `
    }
  bpVertex() {
    return `
     uniform sampler2D intensity;
    uniform float time;
     uniform float stime;
     uniform vec2 myUvs;
uniform vec3 dif;
    varying vec4 v_position;
    varying vec4 v_normal;
    varying vec4 v_color;
    varying vec2 vUv;
     varying vec2 Uv;
 varying vec3 pos;
 attribute vec4 color;
    void main() {
    Uv=uv;
  vec4 prev_xy = texture2D(intensity, uv);
      vUv =uv; //uv;//uv
      v_color=color;
      v_position = modelViewMatrix * vec4(vec3(color.x*6.0 - 900.0,-color.y*6.0+900.0,color.z*4.0), 1.0);
      pos=vec3(v_position.x,v_position.y,v_position.z);
      v_normal = vec4(normalize(vec3(modelViewMatrix*vec4(normal, 0.0))), 0.0);
      gl_Position = projectionMatrix * v_position;
    }
  `
  }
  addDiffuseFragment() {
    return `
     uniform sampler2D intensity;
    uniform sampler2D diffuse;
    uniform vec3 color0;
    uniform vec3 color1;
    uniform vec3 dif;
    varying vec2 vUv;
varying vec2 Uv;
  varying vec4 v_color;
varying vec3 pos;

    vec3 CMYKtoRGB (vec4 cmyk) {
      float c = cmyk.x;
      float m = cmyk.y;
      float y = cmyk.z;
      float k = cmyk.w;

      float invK = 1.0 - k;
      float r = 1.0 - min(1.0, c * invK + k);
      float g = 1.0 - min(1.0, m * invK + k);
      float b = 1.0 - min(1.0, y * invK + k);
      return clamp(vec3(r, g, b), 0.0, 1.0);
    }

    vec4 RGBtoCMYK (vec3 rgb) {
      float r = rgb.r;
      float g = rgb.g;
      float b = rgb.b;
      float k = min(1.0 - r, min(1.0 - g, 1.0 - b));
      vec3 cmy = vec3(0.0);
      float invK = 1.0 - k;
      if (invK != 0.0) {
        cmy.x = (1.0 - r - k) / invK;
        cmy.y = (1.0 - g - k) / invK;
        cmy.z = (1.0 - b - k) / invK;
      }
      return clamp(vec4(cmy, k), 0.0, 1.0);
    }

    void main() {
         vec4 Ld_xy = texture2D(diffuse, vUv);
    vec2 nv=vec2(vUv.x+0.4*Ld_xy.r,vUv.y+0.4*Ld_xy.g);

      vec4 prev_xy = texture2D(intensity, vUv);
      float scale = (1. - (Ld_xy.r*0.5 + Ld_xy.g*0.2 + Ld_xy.b*0.5));
      vec4 color0_cmyk = RGBtoCMYK(color0);
      vec4 color1_cmyk = RGBtoCMYK(color1);
      vec4 interp_cmyk = (color1_cmyk * scale + color0_cmyk * (1. - scale));
        gl_FragColor = vec4(v_color.r / 255.0,v_color.g / 255.0,v_color.b / 255.0,1);
  // gl_FragColor = (prev_xy+Ld_xy)*0.5;
  // gl_FragColor = prev_xy;
     // gl_FragColor = vec4(CMYKtoRGB(interp_cmyk), prev_xy.a);
    }
  `
  }
  blurVert() {
 return ` varying vec2 vUv;
        void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`;
  }
blurFragment(){
    return `uniform sampler2D tDiffuse;
uniform vec2 center;
uniform float strength;
uniform vec2 resolution;
varying vec2 vUv;

float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}

void main(){
vec4 color=vec4(0.0);
float total=0.0;
vec2 toCenter=center-vUv*resolution;
float offset=random(vec3(12.9898,78.233,151.7182),0.0);
for(float t=0.0;t<=40.0;t++){
float percent=(t+offset)/40.0;
float weight=4.0*(percent-percent*percent);
vec4 samplev=texture2D(tDiffuse,vUv+toCenter*percent*strength/resolution);
samplev.rgb*=samplev.a;
color+=samplev*weight;
total+=weight;
}
gl_FragColor=color/total;
//gl_FragColor.rgb/=gl_FragColor.a+0.00001;
}`

}


  horizontalBlurVertex() {
    return [
      "varying vec2 vUv;",

      "void main() {",

      "	vUv = uv;",
      "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

      "}"

    ].join("\n")
  }




  horizontalBlurFragment() {
    return [

      "uniform sampler2D tDiffuse;",
      "uniform float h;",

      "varying vec2 vUv;",

      "void main() {",

      "	vec4 sum = vec4( 0.0 );",

      "	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;",

      "	gl_FragColor = sum;",

      "}"

    ].join("\n")
  }




  verticalBlurVertex() {
    return [

      "varying vec2 vUv;",

      "void main() {",

      "	vUv = uv;",
      "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

      "}"

    ].join("\n")
  }




  verticalBlurFragment() {
    return [

      "uniform sampler2D tDiffuse;",
      "uniform sampler2D pat;",
      "uniform float v;",

      "varying vec2 vUv;",

      "void main() {",
      "	vec4 pat4 = texture2D( pat, vUv);",
      "	vec4 dif4 = texture2D(tDiffuse, vUv);",
      "	vec4 sum = vec4( 0.0 );",

      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;",
      "	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;",

      "	gl_FragColor = sum; ",

      "}"

    ].join("\n")
  }




  public stepVertex() {
    return `
		varying vec2 vUv;


		void main() {
			vUv = uv;
			vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * modelViewPosition;
		}
	`
  }




  stepFragment() {
    return `
		uniform sampler2D prev_out;
		uniform float k_p;
		uniform float c_a;
		varying vec2 vUv;

		vec4 step_tex(sampler2D image, vec2 uv) {
			vec4 rho_xy = texture2D(image, uv);
			rho_xy.a = c_a * step(k_p, rho_xy.a);
			return rho_xy;
		}

		void main() {
			gl_FragColor = step_tex(prev_out, vUv);
		// gl_FragColor.a = 1.;step_tex
		}
	`
  }




  smoothStepVertex() {
    return `
		varying vec2 vUv;


		void main() {
			vUv = uv;
			vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * modelViewPosition;
		}
	`
  }




  smoothStepFragment() {
    return `
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		vec4 step_tex(sampler2D image, vec2 uv) {
			float kp = 0.3;
			float kd = .99;
			vec4 color = texture2D(image, vec2(uv.x, uv.y));
			color.a = 0.4 * smoothstep(kp - kd, kp + kd, color.a);
			return color;
		}

		void main() {
			gl_FragColor = step_tex(tDiffuse, vUv);
			// gl_FragColor.a = 1.;
		}
	`
  }










}
