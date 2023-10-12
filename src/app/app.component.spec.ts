import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {CdkMenu, CdkMenuItem,CdkMenuTrigger} from "@angular/cdk/menu";
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,MatButtonModule,MatMenuModule,CdkMenu, CdkMenuItem,CdkMenuTrigger
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'TechTest'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('TechTest');
  });


});
