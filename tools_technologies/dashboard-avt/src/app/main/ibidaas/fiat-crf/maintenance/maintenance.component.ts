import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConfigServiceService } from 'app/app-config-service.service';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {

  url: string = this.appConfigService.apiBaseUrl + "/crf";
  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer,
    private appConfigService: AppConfigServiceService) { }

  ngOnInit() {

    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

  }

}
