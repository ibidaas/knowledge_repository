import { DialogSelfServiceComponent } from './main/ibidaas/dialog-self-service/dialog-self-service.component';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from 'app/fake-db/fake-db.service';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { CustomDialogComponent } from '@fuse/dialog/custom-dialog.component';
import { CustomDialogUploaderComponent } from 'app/main/ibidaas/dialogs/custom-dialog-uploader.component';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { IbidaasModule } from 'app/main/ibidaas/ibidaas.module';
import { AppConfigServiceService } from 'app/app-config-service.service';
import { DialogSelfService2Component } from './main/ibidaas/dialog-self-service2/dialog-self-service2.component';
import { DialogSelfService3Component } from './main/ibidaas/dialog-self-service3/dialog-self-service3.component';
import { MatDialogModule, MatDialogRef } from "@angular/material";
import { DialogSelfService4Component } from './main/ibidaas/dialog-self-service4/dialog-self-service4.component';
import { DialogSelfService6Component } from './main/ibidaas/dialog-self-service6/dialog-self-service6.component';


const appRoutes: Routes = [
    // {
    //     path        : 'auth',
    //     loadChildren: './main/auth/auth.module#AuthModule'
    // },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        CustomDialogComponent,
        CustomDialogUploaderComponent,
        DialogSelfServiceComponent,
        DialogSelfService2Component,
        DialogSelfService3Component,
        DialogSelfService4Component,
        DialogSelfService6Component
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        MatDialogModule,


        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,

        IbidaasModule,

    ],
    providers: [
        {
            provide: MatDialogRef,
            useValue: {}
        },
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [AppConfigServiceService],
            useFactory: (appConfigService: AppConfigServiceService) => {
                return () => {
                    //Make sure to return a promise!
                    return appConfigService.loadAppConfig();
                };
            }
        }
    ],

    entryComponents: [CustomDialogComponent, CustomDialogUploaderComponent, DialogSelfServiceComponent, DialogSelfService2Component,
        DialogSelfService3Component, DialogSelfService4Component, DialogSelfService6Component],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
