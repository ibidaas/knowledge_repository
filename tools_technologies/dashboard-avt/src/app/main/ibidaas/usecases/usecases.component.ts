import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Router } from '@angular/router';
import { IbidaasService } from '../ibidaas.service';

import { locale as english } from '../../../i18n/en';
import { locale as greek } from '../../../i18n/el';

@Component({
  selector: 'app-usecases',
  templateUrl: './usecases.component.html',
  styleUrls: ['./usecases.component.scss']
})
export class UsecasesComponent implements OnInit {

  preconfiguredProjects: any[];
  iBiDaaSUseCases: any[];

  constructor(
      private _fuseTranslationLoaderService: FuseTranslationLoaderService,
      private _router: Router,
      private _IbidaasService: IbidaasService,
      
  )
  {
    //   if (!sessionStorage.getItem('user')) {
    //       this._router.navigateByUrl('/auth');
    //   }
      this._fuseTranslationLoaderService.loadTranslations(english, greek);
  }

  ngOnInit(): void {
   
      this._IbidaasService.getPreconfiguredProjects().then(res => {
          console.log(res);
          this.iBiDaaSUseCases = res.filter(c => c.id <= 9);
      })
  }

}
