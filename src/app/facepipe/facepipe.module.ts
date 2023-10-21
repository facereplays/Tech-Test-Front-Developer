import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacepipeRoutingModule } from './facepipe-routing.module';
import { FaceComponent } from './face/face.component';
import { MaskComponent } from '../mask/mask.component';


@NgModule({
  declarations: [
    FaceComponent,
    MaskComponent
  ],
  imports: [
    CommonModule,
    FacepipeRoutingModule
  ]
})
export class FacepipeModule { }
