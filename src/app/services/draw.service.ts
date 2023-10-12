import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawService {

  constructor() { }


  drawConnectors(a:CanvasRenderingContext2D,marks:any[],c:any[],d:any,video:number[]){
const canvas= a.canvas;
console.log(canvas.height,video);
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
  drawLandmarks(a:any,b:any,c:any){


  }
}

/****
 *
 *
    /*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0

    'use strict';
    function h(a) {
      var c = 0;
      return function() {
        return c < a.length ? {
          done: !1,
          value: a[c++]
        } : {
          done: !0
        }
      }
    }
    var l = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, c, b) {
        if (a == Array.prototype || a == Object.prototype)
          return a;
        a[c] = b.value;
        return a
      }
    ;
    function m(a) {
      a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
      for (var c = 0; c < a.length; ++c) {
        var b = a[c];
        if (b && b.Math == Math)
          return b
      }
      throw Error("Cannot find global object");
    }
    var n = m(this);
    function p(a, c) {
      if (c)
        a: {
          var b = n;
          a = a.split(".");
          for (var d = 0; d < a.length - 1; d++) {
            var e = a[d];
            if (!(e in b))
              break a;
            b = b[e]
          }
          a = a[a.length - 1];
          d = b[a];
          c = c(d);
          c != d && null != c && l(b, a, {
            configurable: !0,
            writable: !0,
            value: c
          })
        }
    }
    function q(a) {
      var c = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
      return c ? c.call(a) : {
        next: h(a)
      }
    }
    var r = "function" == typeof Object.assign ? Object.assign : function(a, c) {
        for (var b = 1; b < arguments.length; b++) {
          var d = arguments[b];
          if (d)
            for (var e in d)
              Object.prototype.hasOwnProperty.call(d, e) && (a[e] = d[e])
        }
        return a
      }
    ;
    p("Object.assign", function(a) {
      return a || r
    });
    p("Array.prototype.fill", function(a) {
      return a ? a : function(c, b, d) {
        var e = this.length || 0;
        0 > b && (b = Math.max(0, e + b));
        if (null == d || d > e)
          d = e;
        d = Number(d);
        0 > d && (d = Math.max(0, e + d));
        for (b = Number(b || 0); b < d; b++)
          this[b] = c;
        return this
      }
    });
    function t(a) {
      return a ? a : Array.prototype.fill
    }
    p("Int8Array.prototype.fill", t);
    p("Uint8Array.prototype.fill", t);
    p("Uint8ClampedArray.prototype.fill", t);
    p("Int16Array.prototype.fill", t);
    p("Uint16Array.prototype.fill", t);
    p("Int32Array.prototype.fill", t);
    p("Uint32Array.prototype.fill", t);
    p("Float32Array.prototype.fill", t);
    p("Float64Array.prototype.fill", t);
    var u = this || self;
    function v(a, c) {
      a = a.split(".");
      var b = u;
      a[0]in b || "undefined" == typeof b.execScript || b.execScript("var " + a[0]);
      for (var d; a.length && (d = a.shift()); )
        a.length || void 0 === c ? b[d] && b[d] !== Object.prototype[d] ? b = b[d] : b = b[d] = {} : b[d] = c
    }
    ;var w = {
      color: "white",
      lineWidth: 4,
      radius: 6,
      visibilityMin: .5
    };
    function x(a) {
      a = a || {};
      return Object.assign({}, w, {
        fillColor: a.color
      }, a)
    }
    function y(a, c) {
      return a instanceof Function ? a(c) : a
    }
    function z(a, c, b) {
      return Math.max(Math.min(c, b), Math.min(Math.max(c, b), a))
    }
    v("clamp", z);
    v("drawLandmarks", function(a, c, b) {
      if (c) {
        b = x(b);
        a.save();
        var d = a.canvas
          , e = 0;
        c = q(c);
        for (var f = c.next(); !f.done; f = c.next())
          if (f = f.value,
          void 0 !== f && (void 0 === f.visibility || f.visibility > b.visibilityMin)) {
            a.fillStyle = y(b.fillColor, {
              index: e,
              from: f
            });
            a.strokeStyle = y(b.color, {
              index: e,
              from: f
            });
            a.lineWidth = y(b.lineWidth, {
              index: e,
              from: f
            });
            var g = new Path2D;
            g.arc(f.x * d.width, f.y * d.height, y(b.radius, {
              index: e,
              from: f
            }), 0, 2 * Math.PI);
            a.fill(g);
            a.stroke(g);
            ++e
          }
        a.restore()
      }
    });
    v("drawConnectors", function(a, c, b, d) {
      if (c && b) {
        d = x(d);
        a.save();
        var e = a.canvas
          , f = 0;
        b = q(b);
        for (var g = b.next(); !g.done; g = b.next()) {
          var k = g.value;
          a.beginPath();
          g = c[k[0]];
          k = c[k[1]];
          g && k && (void 0 === g.visibility || g.visibility > d.visibilityMin) && (void 0 === k.visibility || k.visibility > d.visibilityMin) && (a.strokeStyle = y(d.color, {
            index: f,
            from: g,
            to: k
          }),
            a.lineWidth = y(d.lineWidth, {
              index: f,
              from: g,
              to: k
            }),
            a.moveTo(g.x * e.width, g.y * e.height),
            a.lineTo(k.x * e.width, k.y * e.height));
          ++f;
          a.stroke()
        }
        a.restore()
      }
    });
    v("drawRectangle", function(a, c, b) {
      b = x(b);
      a.save();
      var d = a.canvas;
      a.beginPath();
      a.lineWidth = y(b.lineWidth, {});
      a.strokeStyle = y(b.color, {});
      a.fillStyle = y(b.fillColor, {});
      a.translate(c.xCenter * d.width, c.yCenter * d.height);
      a.rotate(c.rotation * Math.PI / 180);
      a.rect(-c.width / 2 * d.width, -c.height / 2 * d.height, c.width * d.width, c.height * d.height);
      a.translate(-c.xCenter * d.width, -c.yCenter * d.height);
      a.stroke();
      a.fill();
      a.restore()
    });
    v("lerp", function(a, c, b, d, e) {
      return z(d * (1 - (a - c) / (b - c)) + e * (1 - (b - a) / (b - c)), d, e)
    });
  }
).call(this);

 // Copyright 2023 The MediaPipe Authors.

 // Licensed under the Apache License, Version 2.0 (the "License");
 // you may not use this file except in compliance with the License.
 // You may obtain a copy of the License at

 //      http://www.apache.org/licenses/LICENSE-2.0

 // Unless required by applicable law or agreed to in writing, software
 // distributed under the License is distributed on an "AS IS" BASIS,
 // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 // See the License for the specific language governing permissions and
 // limitations under the License.

 import {
  HandLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

 const demosSection = document.getElementById("demos");

 let handLandmarker = undefined;
 let runningMode = "IMAGE";
 let enableWebcamButton: HTMLButtonElement;
 let webcamRunning: Boolean = false;

 // Before we can use HandLandmarker class we must wait for it to finish
 // loading. Machine Learning models can be large and take a moment to
 // get everything needed to run.
 const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: runningMode,
    numHands: 2
  });
  demosSection.classList.remove("invisible");
};
 createHandLandmarker();


// In this demo, we have put all our clickable images in divs with the
// CSS class 'detectionOnClick'. Lets get all the elements that have
// this class.
const imageContainers = document.getElementsByClassName("detectOnClick");

// Now let's go through all of these and add a click event listener.
for (let i = 0; i < imageContainers.length; i++) {
  // Add event listener to the child element whichis the img element.
  imageContainers[i].children[0].addEventListener("click", handleClick);
}

// When an image is clicked, let's detect it and display results!
async function handleClick(event) {
  if (!handLandmarker) {
    console.log("Wait for handLandmarker to load before clicking!");
    return;
  }

  if (runningMode === "VIDEO") {
    runningMode = "IMAGE";
    await handLandmarker.setOptions({ runningMode: "IMAGE" });
  }
  // Remove all landmarks drawed before
  const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
  for (var i = allCanvas.length - 1; i >= 0; i--) {
    const n = allCanvas[i];
    n.parentNode.removeChild(n);
  }

  // We can call handLandmarker.detect as many times as we like with
  // different image data each time. This returns a promise
  // which we wait to complete and then call a function to
  // print out the results of the prediction.
  const handLandmarkerResult = handLandmarker.detect(event.target);
  console.log(handLandmarkerResult.handednesses[0][0]);
  const canvas = document.createElement("canvas");
  canvas.setAttribute("class", "canvas");
  canvas.setAttribute("width", event.target.naturalWidth + "px");
  canvas.setAttribute("height", event.target.naturalHeight + "px");
  canvas.style =
    "left: 0px;" +
    "top: 0px;" +
    "width: " +
    event.target.width +
    "px;" +
    "height: " +
    event.target.height +
    "px;";

  event.target.parentNode.appendChild(canvas);
  const cxt = canvas.getContext("2d");
  for (const landmarks of handLandmarkerResult.landmarks) {
    drawConnectors(cxt, landmarks, HAND_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 5
    });
    drawLandmarks(cxt, landmarks, { color: "#FF0000", lineWidth: 1 });
  }
}



const video = document.getElementById("webcam") as HTMLVideoElement;
const canvasElement = document.getElementById(
  "output_canvas"
) as HTMLCanvasElement;
const canvasCtx = canvasElement.getContext("2d");

// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam(event) {
  if (!handLandmarker) {
    console.log("Wait! objectDetector not loaded yet.");
    return;
  }

  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "DISABLE PREDICTIONS";
  }

  // getUsermedia parameters.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
let results = undefined;
console.log(video);
async function predictWebcam() {
  canvasElement.style.width = video.videoWidth;;
  canvasElement.style.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvasElement.height = video.videoHeight;

  // Now let's start detecting the stream.
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await handLandmarker.setOptions({ runningMode: "VIDEO" });
  }
  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = handLandmarker.detectForVideo(video, startTimeMs);
  }
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5
      });
      drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
    }
  }
  canvasCtx.restore();

  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
}





*/
