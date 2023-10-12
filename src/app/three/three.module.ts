import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThreeRoutingModule } from './three-routing.module';
import { ThreeComponent } from './three.component';
import {NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";

import {FullComponent} from "./full.component";
import {MatCardModule} from "@angular/material/card";


@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  declarations: [
    ThreeComponent,FullComponent
  ],
    imports: [
        CommonModule,
        ThreeRoutingModule,
        NgbProgressbar,
        MatCardModule
    ],
  exports:[ MatCardModule]
})
export class ThreeModule { }
