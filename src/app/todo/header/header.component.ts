import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  dropdownVisible = false;
  person: any;
  constructor(private router: Router, private _snackBar: MatSnackBar,){}

  ngOnInit(): void {
    this.getUserName();
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu && !dropdownMenu.contains(target)) {
      this.dropdownVisible = false;
    }
  }

  logout(){
    let confirmation = confirm('Are you sure want to logout ?');
    
    if(confirmation){
      this._snackBar.open('User logout successfully','Ok', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 2500
      });
      this.router.navigate(['/login']);
      sessionStorage.clear();
    }
  }

  getUserName(){
    let sessionEmail = sessionStorage.getItem('userId');
    let storedUserArray = localStorage.getItem('userArray');
    
    if (sessionEmail && storedUserArray) {
      let userEmail = JSON.parse(sessionEmail);
      let userArray = JSON.parse(storedUserArray);

      let userIndex = userArray.findIndex((user:any) => Object.keys(user)[0] == userEmail);
      this.person = userArray[userIndex][userEmail].name      
    }

  }
}
