import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacepipeRoutingModule } from './facepipe-routing.module';
import { FaceComponent } from './face/face.component';


@NgModule({
  declarations: [
    FaceComponent
  ],
  imports: [
    CommonModule,
    FacepipeRoutingModule
  ]
})
export class FacepipeModule { }
