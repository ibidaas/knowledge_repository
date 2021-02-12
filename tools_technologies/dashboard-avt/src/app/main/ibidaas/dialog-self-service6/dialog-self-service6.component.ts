import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { MatDialog} from '@angular/material';

@Component({
  selector: 'app-dialog-self-service6',
  templateUrl: './dialog-self-service6.component.html',
  styleUrls: ['./dialog-self-service6.component.scss']
})
export class DialogSelfService6Component implements OnInit {

  constructor(public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogSelfService6Component>,) { }

  ngOnInit() {
  }
  close() {
    
    this.dialogRef.close();
  }

}
