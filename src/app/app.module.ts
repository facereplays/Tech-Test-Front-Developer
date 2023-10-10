import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { FaceRecognitionComponent } from './components/face-recognition/face-recognition.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {CdkMenuTrigger} from "@angular/cdk/menu";

@NgModule({schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  declarations: [
    AppComponent,
    FaceRecognitionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSlideToggleModule,
    MatGridListModule,
    CdkMenuTrigger
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
