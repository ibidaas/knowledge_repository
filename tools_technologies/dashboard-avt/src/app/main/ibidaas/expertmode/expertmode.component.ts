import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Router } from '@angular/router';
import { IbidaasService } from '../ibidaas.service';

import { MatDialog, MatDialogConfig } from "@angular/material";
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { locale as english } from '../../../i18n/en';
import { locale as greek } from '../../../i18n/el';

@Component({
  selector: 'app-expertmode',
  templateUrl: './expertmode.component.html',
  styleUrls: ['./expertmode.component.scss']
})
export class ExpertmodeComponent implements OnInit {

  

  customProjects: any [];
  //preconfiguredProjects: any[];
  //selfServiceProjects: any[];
  //iBiDaaSUseCases: any[];

  constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private _router: Router,
      private _IbidaasService: IbidaasService,
      private dialog: MatDialog
      
  )
  {
    //   if (!sessionStorage.getItem('user')) {
    //       this._router.navigateByUrl('/auth');
    //   }
      this._fuseTranslationLoaderService.loadTranslations(english, greek);
  }

  ngOnInit(): void {
      this._IbidaasService.getCustomProjects().then(res => {
          console.log(res);
          this.customProjects = res;
      })

  }
  removeCustomProject(id:any){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        Message: 'Are you sure you want to delete this project ?'
    };

    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        dialogResult =>{
            if(dialogResult){
                this._IbidaasService.removeCustomProject(id).then( res =>{
                    this._IbidaasService.getCustomProjects().then(res => {
                        this.customProjects = res;
                    })
                })
            }
        } 
    );
}
}
