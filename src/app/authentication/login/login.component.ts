import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
const SECRET_KEY = 'secretKey';

function decrypt(data: string): string {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: any;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      let formData = this.loginForm.value;
      let { email, password } = formData;
      let data: any = localStorage.getItem('userArray')
      let userArray = JSON.parse(data)
      let userFound = false;

      if (userArray) {
        for (const user of userArray) {
          const storedEmail = Object.keys(user)[0];
          const userData = user[storedEmail];

          if (storedEmail === email) {
            const decryptedPassword = decrypt(userData.password);

            if (decryptedPassword === password) {
              sessionStorage.setItem('userId', JSON.stringify(email));
              this._snackBar.open('User login successfully','Ok', {
                horizontalPosition: 'end',
                verticalPosition: 'top',
                duration: 2500
              });
              userFound = true;
              this.loginForm.reset();
              this.router.navigate(['/home']);
              break;
            }
          }
        }
      }


      if (!userFound) {
        this._snackBar.open('User not registered or incorrect password','Ok', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 2500
        });
      }
    }
  }

}
