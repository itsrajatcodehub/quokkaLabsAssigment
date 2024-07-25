import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss']
})
export class TodoDetailsComponent implements OnInit {
  addTaskForm: any;
  hidePassword = true;
  hideConfirmPassword = true;
  selectedStatus: any;
  public selectedAction: string = 'Add';
  tomorrow: Date = new Date();
  priorities = [
    { value: 'Low', viewValue: 'Low', color: 'green' },
    { value: 'Average', viewValue: 'Average', color: 'yellow' },
    { value: 'High', viewValue: 'High', color: 'red' }
  ];
  statuses = [
    { value: 'Pending', viewValue: 'Pending', color: 'orange' },
    { value: 'Completed', viewValue: 'Completed', color: 'green' },
  ]
  todoListarr: any = [];
  nextSno: number = 1;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TodoDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.addTaskForm = this.fb.group({
      title: ['', [Validators.required]],
      desc: [''],
      due_date: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['Pending'],
    });

    this.incomingDataToEdit(this.data);
  }

  onSubmit() {
    if (this.addTaskForm.valid) {
      let taskData = this.addTaskForm.value;

      let sessionEmail = sessionStorage.getItem('userId');
      let storedUserArray = localStorage.getItem('userArray');

      if (sessionEmail && storedUserArray) {
        let userEmail = JSON.parse(sessionEmail);
        let userArray = JSON.parse(storedUserArray);

        if (!userEmail) {
          this._snackBar.open('No user is logged in.', 'Ok', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 1500
          });
          return;
        }

        let userIndex = userArray.findIndex((user: any) => Object.keys(user)[0] === userEmail);

        if (userIndex !== -1) {
          let user = userArray[userIndex];
          let userData = user[userEmail];

          if (this.selectedAction === 'Edit' && this.data && this.data.mode === 'edit') {
            console.log("Editing task", this.data);

            let taskIndex = userData.tasks.findIndex((task: any) => task._id === this.data.row._id);
            if (taskIndex !== -1) {
              userData.tasks[taskIndex] = {
                ...userData.tasks[taskIndex],
                ...taskData
              };

              userArray[userIndex] = {
                [userEmail]: userData
              };

              localStorage.setItem('userArray', JSON.stringify(userArray));

              this._snackBar.open('Task updated successfully!', 'Ok', {
                horizontalPosition: 'end',
                verticalPosition: 'top',
                duration: 1500
              });
            } else {
              this._snackBar.open('Task not found.', 'Ok', {
                horizontalPosition: 'end',
                verticalPosition: 'top',
                duration: 1500
              });
            }
          } else {
            console.log("Adding new task");

            if (!userData.tasks) {
              userData.tasks = [];
            }

            let nextSno = userData.tasks.length > 0 ? Math.max(...userData.tasks.map((task: any) => task._id)) + 1 : 1;
            let newTask = {
              ...taskData,
              _id: nextSno
            };

            userData.tasks.push(newTask);
            userArray[userIndex] = {
              [userEmail]: userData
            };

            localStorage.setItem('userArray', JSON.stringify(userArray));
            this._snackBar.open('Task added successfully!','Ok', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 1500
            });
          }
          this.addTaskForm.reset();
          this.dialogRef.close();
        } else {
          this._snackBar.open('User not found','Ok', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 1500
          });
        }
      }
    }
  }


  incomingDataToEdit(selectedRow: any) {
    console.log("selected row for edit", selectedRow);

    if (selectedRow && selectedRow.mode == 'edit') {
      this.selectedAction = 'Edit';
      this.addTaskForm.patchValue({
        title: selectedRow.row.title,
        desc: selectedRow.row.desc,
        due_date: new Date(selectedRow.row.due_date),
        priority: selectedRow.row.priority,
        status: selectedRow.row.status,
      });
    }
  }


}
