import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FaceComponent} from "./face/face.component";

const routes: Routes = [

  { path: '',   component: FaceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacepipeRoutingModule { }
