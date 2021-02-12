import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { MatDialog} from '@angular/material';

@Component({
  selector: 'app-dialog-self-service4',
  templateUrl: './dialog-self-service4.component.html',
  styleUrls: ['./dialog-self-service4.component.scss']
})
export class DialogSelfService4Component implements OnInit {

  constructor(public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogSelfService4Component>,) { }

  ngOnInit() {
  }

  close() {
    //this.dialogRef.close();
    this.dialogRef.close();
  }

}
