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
  this.addressString.registerOnChange((a:any) =>console.log('f'+a));
}

  /***
   * countries autofill values
   *
   *
   * @param value
   * @private
   */
  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.countries.filter(country => this._normalizeValue(country).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  /***
   *
   *
   *
   */
  onSubmit() {
     alert('form submitted');
    console.warn(this.profileForm.value);
  }


  ngOnInit() {
    /***
     * detecting changes in countries input to find similar
     *
     */
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
   */
  sanitize(e: Event){
    const textAr = e.target as HTMLTextAreaElement;
    const current= textAr.value;

    textAr.value=current.replace(/[<|>]/,'');

  }

  /***
   *
   * disabling paste code
   *
   * @param $event
   */
  onPaste($event: Event){

    $event.preventDefault();
    return false;

  }
}
