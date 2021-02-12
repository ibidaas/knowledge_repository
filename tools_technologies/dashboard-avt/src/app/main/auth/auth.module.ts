import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, 
    MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { LoginComponent } from 'app/main/auth/login/login.component';
import { RegisterComponent } from 'app/main/auth/register/register.component';
import { ForgotPasswordComponent } from 'app/main/auth/forgot-password/forgot-password.component';

import { AuthService } from './auth.service';

const routes = [
    {
        path     : '',
        component: LoginComponent
    },
    {
        path     : 'login',
        component: LoginComponent
    },
    {
        path     : 'register',
        component: RegisterComponent
    },
    {
        path     : 'forgot-password',
        component: ForgotPasswordComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,

        FuseSharedModule
    ],
    providers: [
        AuthService
    ]
})
export class AuthModule
{
}
