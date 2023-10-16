import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FaceRecognitionComponent} from "./components/face-recognition/face-recognition.component";
import {FormComponent} from "./components/form/form.component";
import {HandRecognitionComponent} from "./components/hand-recognition/hand-recognition.component";


const routes: Routes = [{ path: 'face',   component: FaceRecognitionComponent },
  { path: 'video',   component: HandRecognitionComponent },
  { path: 'form',   component: FormComponent },
  { path: 'threejs', loadChildren: () => import('./three/three.module').then(m => m.ThreeModule) }
  ,
  { path: 'facepipe', loadChildren: () => import('./facepipe/facepipe.module').then(m => m.FacepipeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
