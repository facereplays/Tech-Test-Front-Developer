import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FaceRecognitionComponent} from "./components/face-recognition/face-recognition.component";


const routes: Routes = [ { path: 'video',   component: FaceRecognitionComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
