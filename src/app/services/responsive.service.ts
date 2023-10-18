import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class ResponsiveService {
  wW:number;
  wH:number;
  constructor() {

    window.innerWidth>window.innerHeight ? this.wW=600 :  this.wW=400;
    window.innerWidth<window.innerHeight ? this.wH=600 :  this.wH=400;

  }
}
