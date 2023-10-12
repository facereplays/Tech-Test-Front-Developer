import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {map, Observable, startWith } from 'rxjs';
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
email=new FormControl('',Validators.email);
  addressString=new FormControl('');
  country:FormControl =new FormControl('');
addressGroup=this.fb.group({
  country:this.country,
  addressS: this.addressString,

});
  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    email:this.email,
    address: this.addressGroup
  });
  countries:string[] = environment.countries;
  filteredCountries: Observable<string[]>;
sanitized:Observable<string>;

constructor(private fb:FormBuilder) {
this.filteredCountries = new Observable<string[]>();
  this.sanitized = new Observable<string>();

}

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.countries.filter(country => this._normalizeValue(country).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
  }


  ngOnInit() {

    this.filteredCountries = this.country.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  /****
   *
   * Sanitizing input from dom
   *
   *
   *
   *
   *
   */
  sanitize(e: Event){
    const textAr = e.target as HTMLTextAreaElement;
    const current= textAr.value;

    textAr.value=current.replace(/[<|>]/,'');

  }
  onPaste($event: Event){
    console.log(this.profileForm.errors);
    $event.preventDefault();
    return false;

  }
}
