import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  ImageSegmenter,
  FilesetResolver,
  HandLandmarker,
  ImageSegmenterResult,
  FaceLandmarker, HandLandmarkerResult
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
  handLandmarkerResult?: HandLandmarkerResult;
  legendColors = environment.legendColors;
  lastWebcamTime = -1;
  public results: HandLandmarkerResult | undefined;
  test: boolean = false;
  public serving: boolean;
  private canvasElement?: HTMLCanvasElement;
  private canvasCtx?: CanvasRenderingContext2D | null;
  // @ts-ignore
  private video: HTMLVideoElement;
  private handLandmarker?: HandLandmarker;
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
  private handLandResults: HandLandmarkerResult | undefined;
  private marks: any[] = [];

  constructor(private drawService: DrawService) {
    this.serving = false;

  }

  /***
   *
   * check media if available
   */
  hasGetUserMedia = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );


    this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2
    });


    // demosSection.classList.remove("invisible");
  };

  /*
  fpor image segmenter case


  */
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
    if (cxt && this.canvasClick) {


      // @ts-ignore
      const {width, height} = result.categoryMask;
      let imageData = cxt.getImageData(0, 0, width, height).data;
      this.canvasClick.width = width;
      this.canvasClick.height = height;
      let category: String = "";
      const mask = result.categoryMask!.getAsUint8Array();
      mask.forEach((maski, i) => {
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
    this.canvasCtx!.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    this.canvasCtx!.fillStyle = "#ffffff99";
    this.canvasCtx!.fillRect(0, 0, this.video.videoWidth, this.video.videoHeight)
    //this.canvasCtx!.drawRecta(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    // Do not segmented if imageSegmenter hasn't loaded
    if (this.imageSegmenter === undefined) {
      //return;
    }

    // if image mode is initialized, create a new segmented with video runningMode

    this.runningMode = "VIDEO";
    let startTimeMs = performance.now();
    //  console.log(this.lastWebcamTime,startTimeMs,this.runningMode);
    /***
     *
     * getting hands landmarks
     *
     */
    this.results = this.handLandmarker?.detectForVideo(this.video, startTimeMs);

    if (this.results && this.results.landmarks) {

      for (const landmarks of this.results.landmarks) {
        //  console.log(JSON.stringify(landmarks));
        /***
         *
         * sending canvas and handmarks to service to draw
         *
         */
        this.drawService.drawConnectors(this.canvasCtx!, landmarks, environment.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5
        }, [this.video.videoWidth, this.video.videoHeight]);

      }
      if (this.webcamRunning === true) {
        window.requestAnimationFrame(this.predictWebcam);
      }
    }

    if (this.imageSegmenter) this.imageSegmenter.segmentForVideo(this.video, startTimeMs, this.callbackForVideo);
  }

  /***
   *
   *
   *
   * imagfe segmenter case
   * @param result
   */
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
      runningMode: this.runningMode,
      numFaces: 1
    });

  }

  ngAfterViewInit() {
    this.canvasElement = this.myCanvas.nativeElement as HTMLCanvasElement;
    this.canvasCtx = this.canvasElement.getContext("2d");
//this.test=true;
    /***
     *
     * testing
     *
     */
    if (this.test) {
      this.marks = JSON.parse('[{"x":0.4419788718223572,"y":0.9885884523391724,"z":-1.6559452831188537e-7},{"x":0.47772884368896484,"y":0.8524411916732788,"z":-0.02013668231666088},{"x":0.47463172674179077,"y":0.7098792195320129,"z":-0.030217472463846207},{"x":0.46790122985839844,"y":0.6086395382881165,"z":-0.0383816659450531},{"x":0.45867159962654114,"y":0.5593640804290771,"z":-0.04470393806695938},{"x":0.32611313462257385,"y":0.697811484336853,"z":-0.0019850439857691526},{"x":0.3783108592033386,"y":0.6746347546577454,"z":-0.021891487762331963},{"x":0.4129917323589325,"y":0.7202364206314087,"z":-0.04995590075850487},{"x":0.4171450138092041,"y":0.7597101926803589,"z":-0.07034149020910263},{"x":0.2923184931278229,"y":0.7551758289337158,"z":-0.0014537802198901772},{"x":0.3406887948513031,"y":0.7316475510597229,"z":-0.011543123982846737},{"x":0.37543851137161255,"y":0.7718098759651184,"z":-0.031710922718048096},{"x":0.3804970681667328,"y":0.8124983310699463,"z":-0.04908472299575806},{"x":0.27665817737579346,"y":0.8158678412437439,"z":-0.003018013434484601},{"x":0.30786821246147156,"y":0.7877399921417236,"z":-0.012737883254885674},{"x":0.341959148645401,"y":0.8199914693832397,"z":-0.01200360432267189},{"x":0.3522948622703552,"y":0.8536326289176941,"z":-0.012613429687917233},{"x":0.2702025771141052,"y":0.8762029409408569,"z":-0.006714301649481058},{"x":0.2892342805862427,"y":0.8445165753364563,"z":-0.010889739729464054},{"x":0.3187931776046753,"y":0.8701635599136353,"z":0.0017439138609915972},{"x":0.3319021463394165,"y":0.897994875907898,"z":0.01243297103792429}]');
// Get DOM elements

      this.drawService.drawConnectors(this.canvasCtx!, this.marks, environment.HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5
      }, [this.video.videoWidth, this.video.videoHeight]);
    }
    /***
     *
     * end testing
     */
    this.video = this.myVideo.nativeElement as HTMLVideoElement;


    this.createHandLandmarker();
  }

  ngOnInit() {
    /*

     */

    //demosSection.classList.remove("invisible");

    // this.createImageSegmenter();




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
