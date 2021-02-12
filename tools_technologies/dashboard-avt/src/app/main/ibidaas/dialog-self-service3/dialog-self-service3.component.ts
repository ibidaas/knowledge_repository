import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { MatDialog} from '@angular/material';

@Component({
  selector: 'app-dialog-self-service3',
  templateUrl: './dialog-self-service3.component.html',
  styleUrls: ['./dialog-self-service3.component.scss']
})
export class DialogSelfService3Component implements OnInit {

  constructor(public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogSelfService3Component>,) { }
  
  ngOnInit() {
  }

  close() {
    //this.dialogRef.close();
    this.dialogRef.close();
  }

}
