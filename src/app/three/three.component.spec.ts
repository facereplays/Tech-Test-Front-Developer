import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeComponent } from './three.component';
import {MatCardModule} from "@angular/material/card";
import {NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";

describe('ThreeComponent', () => {
  let component: ThreeComponent;
  let fixture: ComponentFixture<ThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeComponent ],imports:[MatCardModule,NgbProgressbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
