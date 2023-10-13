import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandRecognitionComponent } from './hand-recognition.component';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";

describe('HandRecognitionComponent', () => {
  let component: HandRecognitionComponent;
  let fixture: ComponentFixture<HandRecognitionComponent>;

  // @ts-ignore
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandRecognitionComponent ],
      imports: [
MatIconModule,
        MatCardModule, // any necessary modules
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandRecognitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
