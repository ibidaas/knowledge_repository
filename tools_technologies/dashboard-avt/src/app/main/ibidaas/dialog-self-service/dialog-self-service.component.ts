import { Component, OnInit, Input } from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { MatDialog} from '@angular/material';

@Component({
  selector: 'app-dialog-self-service',
  templateUrl: './dialog-self-service.component.html',
  styleUrls: ['./dialog-self-service.component.scss']
})
export class DialogSelfServiceComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private dialogRef: MatDialogRef<DialogSelfServiceComponent>,) { }
  
  
  ngOnInit() {
    
  }
 
  close() {
    //this.dialogRef.close();
    this.dialogRef.close();
  }

}
