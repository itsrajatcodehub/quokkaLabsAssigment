import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
const SECRET_KEY = 'secretKey';

function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  signupForm: any;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: any) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (confirmPassword.errors && !confirmPassword.errors.mustMatch) {
      return
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mustMatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      const encryptedPassword = encrypt(formData.password);
  
      const newUser = {
        [formData.email]: {
          name: formData.name,
          email: formData.email,
          password: encryptedPassword,
        },
      };
  
      let storedUserArray = localStorage.getItem('userArray');
      let userArray: Array<any> = storedUserArray ? JSON.parse(storedUserArray) : [];

      const emailExists = userArray && userArray.length > 0 &&
        userArray.some(user => Object.keys(user)[0] === formData.email);
  
      if (emailExists) {
        this._snackBar.open('User already registered with this email.','Ok', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 1500
        });
      } else {
        userArray.push(newUser);
        localStorage.setItem('userArray', JSON.stringify(userArray));
  
        this._snackBar.open('User Registered Successfully!','Ok', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 1500
        });

        this.signupForm.reset();
        this.router.navigate(['/login']);
      }
    }
  }
  

}
