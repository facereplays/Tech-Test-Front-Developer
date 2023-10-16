import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  ImageSegmenter,
  FilesetResolver,


  FaceLandmarker, FaceLandmarkerResult, ImageSegmenterResult
} from "@mediapipe/tasks-vision";
import {environment} from "../../../environments/environment";
import {DrawService} from "../../services/draw.service";

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.css']
})
export class FaceRecognitionComponent implements OnInit, AfterViewInit {

  runningMode: "IMAGE" | "VIDEO" = "IMAGE";

  imageSegmenter?: ImageSegmenter;
  labels?: string[];
  canvasClick?: HTMLCanvasElement;
  webcamRunning: boolean = false
  mode?: string;
  @ViewChild("myCanvas") myCanvas!: ElementRef;
  @ViewChild("myVideo") myVideo!: ElementRef;

  legendColors = environment.legendColors;
  lastWebcamTime = -1;
  public results: FaceLandmarkerResult | undefined;
  test: boolean = false;
  public serving: boolean;
  private canvasElement?: HTMLCanvasElement;
  private canvasCtx?: CanvasRenderingContext2D | null;
  // @ts-ignore
  private video: HTMLVideoElement;

  private faceLandmarker?: FaceLandmarker;


  /***
   *
   *
   *
   * imagesegmenting
   * @param result
   */
  /***
   *
   * hand servuce results
   * @private
   */
  private faceLandResults: FaceLandmarkerResult | undefined;
  private marks: any[] = [];

  constructor(private drawService: DrawService) {
    this.serving = false;

  }

  /***
   *
   * check media if available
   */
  hasGetUserMedia = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);


  /*
  fpor image segmenter case


  */

segmentsFromVideo(result: ImageSegmenterResult) {


    let imageData = this.canvasCtx?.getImageData(
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    ).data;
    const  legendColors = [
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
    const mask: Float32Array | undefined = result.categoryMask?.getAsFloat32Array();
   if(imageData && mask) {

      let j = 0;
      for (let i = 0; i < mask.length; ++i) {
        const maskVal = Math.round(mask[i] * 255.0);
        const legendColor = legendColors[maskVal % legendColors.length];
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
      this.canvasCtx?.putImageData(dataNew, 0, 0);

    }

}

  /***
   * frame by frame service for reading
   *
   *
   */
  predictWebcam = async () => {

    if (this.video.currentTime === this.lastWebcamTime || !this.serving) {
      if (this.webcamRunning === true) {

        window.requestAnimationFrame(this.predictWebcam);
      }
      return;
    }
    this.lastWebcamTime = this.video.currentTime;
    /***
     * filling canvas with video
     * dull ing video with white
     *
     */
    this.canvasCtx?.clearRect(0, 0, this.canvasCtx?.canvas.width, this.canvasCtx?.canvas.height);
    this.canvasCtx!.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    this.canvasCtx!.fillStyle = "#ffffff99";
    this.canvasCtx!.fillRect(0, 0, this.video.videoWidth, this.video.videoHeight)
    //this.canvasCtx!.drawRecta(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    // Do not segmented if imageSegmenter hasn't loaded

    // if image mode is initialized, create a new segmented with video runningMode

    this.runningMode = "VIDEO";
    let startTimeMs = performance.now();
    /***
     *
     * get image segments
     *  this.imageSegmenter?.segmentForVideo(this.video, startTimeMs, this.segmentsFromVideo);
     */

    /***
     *
     * getting face landmarks
     *
     */
   this.results = this.faceLandmarker?.detectForVideo(this.video, startTimeMs);
// @ts-ignore
    //console.log(this.results.facialTransformationMatrixes);
    if (this.results && this.results!.faceLandmarks) {


        //  console.log(JSON.stringify(landmarks));
        /***
         *
         * sending canvas and handmarks to service to draw
         *
         */
        if( this.results!.faceLandmarks.length>0) {
        this.drawService.drawFConnectors(this.canvasCtx!, this.results!, environment.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5
        }, [this.video.videoWidth, this.video.videoHeight]);
    }

      if (this.webcamRunning === true) {
        window.requestAnimationFrame(this.predictWebcam);
      }
    }

  }


  enableCam = async (event: any) => {
    if (this.imageSegmenter === undefined) {
      // return;
    }
    this.serving = true;
    if (this.webcamRunning) {
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

  createFaceLandmarker = async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "GPU"
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1
    });

  }
  createImageSegmenter = async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    this.imageSegmenter = await ImageSegmenter.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite",
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    outputCategoryMask: true,
    outputConfidenceMasks: false
  });

  }
  draw: boolean = false;

  ngAfterViewInit() {
    this.canvasElement = this.myCanvas.nativeElement as HTMLCanvasElement;
    this.canvasCtx = this.canvasElement.getContext("2d");
    const canvasO= new OffscreenCanvas(400,400);
    const ctx=canvasO.getContext('2d');
    const gradient = ctx!.createRadialGradient(110, 90, 30, 100, 100, 70);

// Add three color stops
    gradient.addColorStop(0, "pink");
    gradient.addColorStop(0.9, "white");
    gradient.addColorStop(1, "green");

// Set the fill style and draw a rectangle
    ctx!.fillStyle = gradient;
    ctx!.fillRect(20, 20, 160, 160);


    this.video = this.myVideo.nativeElement as HTMLVideoElement;
//this.test=true;
    /***
     *
     * testing
     *
     */
    if (this.test) {
      this.marks = JSON.parse(environment.test);
// Get DOM elementsFace

      this.drawService.drawFConnectors(this.canvasCtx!, this.marks, environment.FACE_LANDMARKS_TESSELATION, {
        color: "#00FF00",
        lineWidth: 5,test:this.test,
      }, [this.canvasElement.width,this.canvasElement.height]);
    }else{
    /***
     *
     * end testing
     */




    }

    this.createFaceLandmarker();
   // this.createImageSegmenter();
  }

  ngOnInit() {


  }


  stop() {
    console.log(JSON.stringify(this.results));

    this.serving=false;
  }
}
