import { Component } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {Subject} from "rxjs";
import {MenuItem} from "./classes/menu-item";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  // ,new MenuItem('MediaPipeFace','face', 'Examples of Mediapipe usage')
  title = 'TechTest';
  activeLink:MenuItem | undefined;
url$: Subject<string>;
  /***
   *
   * menu content bound to routing
   *
   *
   */
  menuItems: MenuItem[] =[
    new MenuItem('Form','form', 'Example of form with validation'),
    new MenuItem('ThreeJs Scene','threejs', 'Example of big data download with lazy loading.<br>' +
      '(objective: Ensure that your page is optimized for speed and scalability)')
    ,new MenuItem('MediaPipeFace','face', 'Examples of Mediapipe usage')
    ,new MenuItem('MediaPipeHand','video', 'Examples of Mediapipe usage')
    ];
constructor( private route: ActivatedRoute,
             private router: Router ) {
  this.url$=new Subject<string>();
  // @ts-ignore
  router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((u:NavigationStart) => {
//find active menuLink
    console.log(u.url);
    this.url$.next(u.url);
    if(u.url!='/') {

      this.menuItems.map(o => {
        o.active = false;
        return o
      }).find(r => r.link == u.url.replace('/', ''))!.active = true;
      this.activeLink = this.menuItems.find(o => o.active);
    }else{
     delete this.activeLink;
      this.menuItems.map(o => {
        o.active = false;
        return o;
      });
    }
    });

}
  nav(link:string) {
this.router.navigate([link]);
  }
}
