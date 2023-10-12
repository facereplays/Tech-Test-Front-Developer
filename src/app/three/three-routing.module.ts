import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreeComponent } from './three.component';

import {FullComponent} from "./full.component";

const routes: Routes = [{ path: '', component: ThreeComponent },{ path: 'w', component: FullComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThreeRoutingModule { }
