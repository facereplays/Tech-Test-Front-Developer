import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FaceRecognitionComponent} from "./components/face-recognition/face-recognition.component";
import {FormComponent} from "./components/form/form.component";


const routes: Routes = [ { path: 'video',   component: FaceRecognitionComponent },
  { path: 'form',   component: FormComponent },
  { path: 'list', loadChildren: () => import('./three/three.module').then(m => m.ThreeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
