import {Injectable} from '@angular/core';
import {FaceLandmarker, FilesetResolver} from "@mediapipe/tasks-vision";

@Injectable({
  providedIn: 'root'
})
export class MediapipeService {
  private faceLandmarker?: FaceLandmarker;

  constructor() {
  }

  getFaceResults(video: HTMLVideoElement) {
    return this.faceLandmarker?.detectForVideo(video, Date.now());
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
}
