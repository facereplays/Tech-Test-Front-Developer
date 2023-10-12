import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceRecognitionComponent } from './components/face-recognition/face-recognition.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {CdkMenu, CdkMenuItem,CdkMenuTrigger} from "@angular/cdk/menu";
import { FormComponent } from './components/form/form.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  declarations: [
    AppComponent,
    FaceRecognitionComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatGridListModule, ReactiveFormsModule,
    CdkMenuTrigger, CdkMenu, CdkMenuItem, MatIconModule,
    MatCardModule, MatButtonModule, MatAutocompleteModule, BrowserAnimationsModule, MatChipsModule, MatProgressSpinnerModule
  ],
 exports: [MatCardModule, MatButtonModule, MatAutocompleteModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
