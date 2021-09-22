import { FormControl, ValidationErrors } from '@angular/forms';

export class Luv2ShopValidators {

  // whitspace validation

  static notOnlyWhitespace(control: FormControl): ValidationErrors {


    // Check for whitespace
    if ((control.value != null) && (control.value.trim().length === 0)) {

      //invalid, return error object
      return { 'notOnlyWhitespace': true };
    }
    else {
      //valid return null

      return null;
    }
  }
}
