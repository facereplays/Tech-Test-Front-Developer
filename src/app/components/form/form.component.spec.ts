import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import {MatButtonModule} from "@angular/material/button";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormComponent ],
      imports:[MatButtonModule,MatAutocompleteModule,ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
