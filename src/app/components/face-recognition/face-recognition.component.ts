import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ImageSegmenter, FilesetResolver, ImageSegmenterResult} from "@mediapipe/tasks-vision";

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.css']
})
export class FaceRecognitionComponent implements OnInit, AfterViewInit{
  videoHeight: string = "360px";
  videoWidth: string = "480px";
  runningMode: "IMAGE" | "VIDEO" = "IMAGE";
  resultWidthHeigth:number = 256;
  imageSegmenter?: ImageSegmenter;
  labels?: string[];
  canvasClick?: HTMLCanvasElement;
  webcamRunning: boolean = false;
  @ViewChild("myCanvas") myCanvas!: ElementRef;
  @ViewChild("myVideo") myVideo!: ElementRef;

/*
const webcamPredictions = document.getElementById("webcamPredictions");
const demosSection: HTMLElement = document.getElementById("demos");
let enableWebcamButton: HTMLButtonElement;

*/

 hasGetUserMedia = ()=> !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

 legendColors = [
  [255, 197, 0, 255], // Vivid Yellow
  [128, 62, 117, 255], // Strong Purple
  [255, 104, 0, 255], // Vivid Orange
  [166, 189, 215, 255], // Very Light Blue
  [193, 0, 32, 255], // Vivid Red
  [206, 162, 98, 255], // Grayish Yellow
  [129, 112, 102, 255], // Medium Gray
  [0, 125, 52, 255], // Vivid Green
  [246, 118, 142, 255], // Strong Purplish Pink
  [0, 83, 138, 255], // Strong Blue
  [255, 112, 92, 255], // Strong Yellowish Pink
  [83, 55, 112, 255], // Strong Violet
  [255, 142, 0, 255], // Vivid Orange Yellow
  [179, 40, 81, 255], // Strong Purplish Red
  [244, 200, 0, 255], // Vivid Greenish Yellow
  [127, 24, 13, 255], // Strong Reddish Brown
  [147, 170, 0, 255], // Vivid Yellowish Green
  [89, 51, 21, 255], // Deep Yellowish Brown
  [241, 58, 19, 255], // Vivid Reddish Orange
  [35, 44, 22, 255], // Dark Olive Green
  [0, 161, 194, 255] // Vivid Blue
];
  lastWebcamTime = -1;
 createImageSegmenter = async () => {
   const audio = await FilesetResolver.forVisionTasks(
     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
   );
   this.imageSegmenter = await ImageSegmenter.createFromOptions(audio, {
     baseOptions: {
       modelAssetPath:
         "https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite",
       delegate: "GPU"
     },
     runningMode: this.runningMode,
     outputCategoryMask: true,
     outputConfidenceMasks: false
   });
   this.labels = this.imageSegmenter.getLabels();
 }
  callback = (result: ImageSegmenterResult) => {
    const cxt = this.canvasClick!.getContext("2d");
    if(cxt &&  this.canvasClick)
    {


    // @ts-ignore
      const {width, height} = result.categoryMask;
    let imageData = cxt.getImageData(0, 0, width, height).data;
      this.canvasClick.width = width;
      this.canvasClick.height = height;
    let category: String = "";
    const mask = result.categoryMask!.getAsUint8Array() ;
mask.forEach((maski,i)=>{
      if (maski > 0) {
        category = this.labels![maski];
      }
      const legendColor = this.legendColors[maski % this.legendColors.length]

      imageData[i * 4] = (legendColor[0] + imageData[i * 4]) / 2;
      imageData[i * 4 + 1] = (legendColor[1] + imageData[i * 4 + 1]) / 2;
      imageData[i * 4 + 2] = (legendColor[2] + imageData[i * 4 + 2]) / 2;
      imageData[i * 4 + 3] = (legendColor[3] + imageData[i * 4 + 3]) / 2;
    })
    const uint8Array = new Uint8ClampedArray(imageData.buffer);
    const dataNew = new ImageData(uint8Array, width, height);
    cxt.putImageData(dataNew, 0, 0);
   /* const p: HTMLElement = event.target.parentNode.getElementsByClassName(
      "classification"
    )[0];
    p.classList.remove("removed");
    p.innerText = "Category: " + category;

    */
    }
  }

    predictWebcam =async () => {
//console.log(this.video);
    if (this.video.currentTime === this.lastWebcamTime) {
      if (this.webcamRunning === true) {

        window.requestAnimationFrame(this.predictWebcam);
      }
      return;
    }
    this.lastWebcamTime = this.video.currentTime;
    this.canvasCtx!.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    // Do not segmented if imageSegmenter hasn't loaded
    if (this.imageSegmenter === undefined) {
      return;
    }

    // if image mode is initialized, create a new segmented with video runningMode
    if (this.runningMode === "IMAGE") {
      this.runningMode = "VIDEO";
      await this.imageSegmenter.setOptions({
        runningMode: this.runningMode
      });
    }
    let startTimeMs = performance.now();
    //  console.log(this.lastWebcamTime,startTimeMs,this.runningMode);
      //Start segmenting the stream.
    this.imageSegmenter.segmentForVideo(this.video, startTimeMs, this.callbackForVideo);
  }



 handleClick =   async (event:any) => {
    // Do not segmented if imageSegmenter hasn't loaded
    if (this.imageSegmenter === undefined) {
      return;
    }
    this.canvasClick = event.target.parentElement.getElementsByTagName("canvas")[0];
   this.canvasClick!.classList.remove("removed");
   this.canvasClick!.width = event.target.naturalWidth;
   this.canvasClick!.height = event.target.naturalHeight;
    const cxt =  this.canvasClick!.getContext("2d");
    cxt!.clearRect(0, 0, this.canvasClick!.width, this.canvasClick!.height);
    cxt!.drawImage(event.target, 0, 0, this.canvasClick!.width, this.canvasClick!.height);
    event.target.style.opacity = 0;
    // if VIDEO mode is initialized, set runningMode to IMAGE
    if (this.runningMode === "VIDEO") {
      this.runningMode = "IMAGE";
      await this.imageSegmenter.setOptions({
        runningMode: this.runningMode
      });
    }

    // imageSegmenter.segment() when resolved will call the callback function.
    this.imageSegmenter.segment(event.target, this.callback);
  }

   callbackForVideo = (result: ImageSegmenterResult) => {
    let imageData = this.canvasCtx!.getImageData(
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    ).data;
    const mask: Float32Array = result.categoryMask!.getAsFloat32Array();
    let j = 0;
    for (let i = 0; i < mask.length; ++i) {
      const maskVal = Math.round(mask[i] * 255.0);
      const legendColor = this.legendColors[maskVal % this.legendColors.length];
      imageData[j] = (legendColor[0] + imageData[j]) / 2;
      imageData[j + 1] = (legendColor[1] + imageData[j + 1]) / 2;
      imageData[j + 2] = (legendColor[2] + imageData[j + 2]) / 2;
      imageData[j + 3] = (legendColor[3] + imageData[j + 3]) / 2;
      j += 4;
    }
    const uint8Array = new Uint8ClampedArray(imageData.buffer);
    const dataNew = new ImageData(
      uint8Array,
     this.video.videoWidth,
      this.video.videoHeight
    );
    this.canvasCtx!.putImageData(dataNew, 0, 0);
    if (this.webcamRunning === true) {
      window.requestAnimationFrame(this.predictWebcam);
    }
  }

enableCam =   async (event: any)=> {
    if (this.imageSegmenter === undefined) {
      return;
    }

    if (this.webcamRunning === true) {
      this.webcamRunning = false;
    //  enableWebcamButton.innerText = "ENABLE SEGMENTATION";
    } else {
      this.webcamRunning = true;
     // enableWebcamButton.innerText = "DISABLE SEGMENTATION";
    }

    // getUsermedia parameters.
    const constraints = {
      video: true
    };

    // Activate the webcam stream.
    this.video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
    this.video.addEventListener("loadeddata", this.predictWebcam);
  }
  private canvasElement?: HTMLCanvasElement;
  private canvasCtx?: CanvasRenderingContext2D | null;
  // @ts-ignore
  private video: HTMLVideoElement;




   ngAfterViewInit()
   {
     this.canvasElement = this.myCanvas.nativeElement as HTMLCanvasElement;
    this.canvasCtx = this.canvasElement.getContext("2d");

// Get DOM elements
     this.video = this.myVideo.nativeElement as HTMLVideoElement;
   }
   ngOnInit()
   {
/*

 */

     //demosSection.classList.remove("invisible");

   this.createImageSegmenter();

   const imageContainers: HTMLCollectionOf<Element> = document.getElementsByClassName(
     "segmentOnClick"
   );

// Add click event listeners for the img elements.
Array(imageContainers.length).fill(1).map((a,i)=>{
     imageContainers[i]
       .getElementsByTagName("img")[0]
       .addEventListener("click", this.handleClick);
   }
   )
     /**
    * Demo 1: Segmented images on click and display results.
    */








   /********************************************************************
    // Demo 2: Continuously grab image from webcam stream and segmented it.
    ********************************************************************/

// Check if webcam access is supported.


// Get segmentation from the webcam




// Enable the live webcam view and start imageSegmentation.


// If webcam supported, add event listener to button.
     /*
   if (this.hasGetUserMedia()) {
     enableWebcamButton = document.getElementById(
       "webcamButton"
     ) as HTMLButtonElement;
     enableWebcamButton.addEventListener("click", enableCam);
   } else {
     console.warn("getUserMedia() is not supported by your browser");
   }
*/

 }


}
