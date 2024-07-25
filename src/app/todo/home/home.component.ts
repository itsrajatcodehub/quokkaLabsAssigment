import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TodoDetailsComponent } from './todo-details/todo-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  taskList: any[] = [];
  constructor(public dialog: MatDialog,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getData();
  }

  filter: string = 'all';

  onFilterChange(event: any) {
    this.filter = event.target.value;
    this.getData();
  }

  getData() {
    console.log("get data fn");

    const sessionEmail = sessionStorage.getItem('userId');
    if (sessionEmail) {
      const userEmail = JSON.parse(sessionEmail);
      console.log("userEmail", userEmail);

      if (!userEmail) {
        console.error('No user is logged in.');
        return;
      }

      const storedUserArray = localStorage.getItem('userArray');
      let userArray: Array<any> = storedUserArray ? JSON.parse(storedUserArray) : [];
      console.log("userArray", userArray);

      const user = userArray.find(user => Object.keys(user)[0] == userEmail);
      console.log("user", user);

      if (user) {
        const userData = user[userEmail];
        console.log("userData", userData);

        let tasks = userData.tasks;
        console.log("User's Tasks:", tasks);

        if (this.filter !== 'all') {
          tasks = tasks.filter((task: any) => task.status.toLowerCase() === this.filter.toLowerCase());
        }

        this.taskList = tasks;
      } else {
        console.error('User not found.');
      }
    }
  }


  addNewTask() {
    const dialogRef = this.dialog.open(TodoDetailsComponent, {
      height: '90vh',
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

  edit(row: any) {
    console.log("selected row to edit", row);

    const dialogRef = this.dialog.open(TodoDetailsComponent, {
      data: { mode: 'edit', row },
      height: '90vh',
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

  delete(row: any) {
    const taskId = row._id;
    const confirmDelete = confirm('Are you sure you want to delete this task?');

    if (confirmDelete) {
      const sessionEmail = sessionStorage.getItem('userId');
      if (!sessionEmail) {
        // alert('No user is logged in.');
        this._snackBar.open('No user is logged In.','Ok', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 1500
        });
        return;
      }

      const userEmail = JSON.parse(sessionEmail);
      if (!userEmail) {
        // alert('No user found.');
        this._snackBar.open('No user found','Ok', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 1500
        });
        return;
      }

      const storedUserArray = localStorage.getItem('userArray');
      let userArray: Array<any> = storedUserArray ? JSON.parse(storedUserArray) : [];

      const userIndex = userArray.findIndex(user => Object.keys(user)[0] === userEmail);
      if (userIndex !== -1) {
        const user = userArray[userIndex];
        const userData = user[userEmail];

        if (userData.tasks) {
          userData.tasks = userData.tasks.filter((task: any) => task._id !== taskId);
          userArray[userIndex] = {
            [userEmail]: userData
          };

          localStorage.setItem('userArray', JSON.stringify(userArray));
          this.getData();
          // alert('Task deleted successfully!');
          this._snackBar.open('Task deleted successfully!','Ok', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 1500
          });
        } else {
          // alert('No tasks found for this user.');
          this._snackBar.open('No tasks found for this user.','Ok', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 1500
          });
        }
      } else {
        alert('User not found.');
        this._snackBar.open('User not found.','Ok', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 1500
        });

      }
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'priority-low';
      case 'Average':
        return 'priority-average';
      case 'High':
        return 'priority-high';
      default:
        return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  }

}
