import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceRecognitionComponent } from './face-recognition.component';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";

describe('FaceRecognitionComponent', () => {
  let component: FaceRecognitionComponent;
  let fixture: ComponentFixture<FaceRecognitionComponent>;

  // @ts-ignore
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceRecognitionComponent ],
      imports: [
MatIconModule,
        MatCardModule, // any necessary modules
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
