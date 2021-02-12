import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { AuthService } from '../auth.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

const Users: any [] = [
    {"id":1,"code":"USR001","lastname":"Admin","firstname":"Administrator","email":"admin@mail.com","phone":null,"mobile":null,"fax":null,"address":null,"username":"admin","password":"admin","roleFk":1,"regdate":null,"lastupdate":"2018-02-07T21:12:57+00:00","active":1,"orders":[],"providers":[],"settings":[],"usersMeta":[]},
    {"id":2,"code":"USR002","lastname":"Hudson","firstname":"Derrick","email":"hudson@mail.com","phone":null,"mobile":null,"fax":null,"address":null,"username":"hudson","password":"hudson","roleFk":1,"regdate":null,"lastupdate":"2018-02-07T21:12:57+00:00","active":1,"orders":[],"providers":[],"settings":[],"usersMeta":[]},
    {"id":3,"code":"USR003","lastname":"Arnold","firstname":"Warren","email":"arnold@mail.com","phone":null,"mobile":null,"fax":null,"address":null,"username":"arnold","password":"arnold","roleFk":1,"regdate":null,"lastupdate":"2018-02-07T21:12:57+00:00","active":1,"orders":[],"providers":[],"settings":[],"usersMeta":[]},
    {"id":4,"code":"USR004","lastname":"Diaz","firstname":"Miriam","email":"diaz@mail.com","phone":null,"mobile":null,"fax":null,"address":null,"username":"diaz","password":"diaz","roleFk":1,"regdate":null,"lastupdate":"2018-02-07T21:12:57+00:00","active":1,"orders":[],"providers":[],"settings":[],"usersMeta":[]}
];

@Component({
    selector     : 'auth-login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    isNotAuthenticated: boolean = false;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _authService: AuthService,
        private _matSnackBar: MatSnackBar,
        private _FuseNavigationService: FuseNavigationService
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        if (sessionStorage.getItem('user')) {
            this._router.navigateByUrl('/dashboard');
        }

        this.loginForm = this._formBuilder.group({
            // email   : ['', [Validators.required, Validators.email]],
            email   : ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    login(): void 
    {
        // const formData = this.loginForm.value;
        // this._authService.login(formData.email, formData.password).then(res => {
        //     if (res.email != null) {
        //         sessionStorage.setItem('user', JSON.stringify(res));
        //         this._router.navigateByUrl('/apps/holidaytool');
        //     } else {
        //         this._matSnackBar.open(res, 'OK', {
        //             horizontalPosition: 'right',
        //             verticalPosition: 'bottom',
        //             duration        : 3000
        //         });
        //     }
        // });

         const formData = this.loginForm.value;
         const user = Users.find(u => u.username === formData.email.toLowerCase());
         if(user){
             const isAuthenticated = user.password === formData.password.toLowerCase() ? true : false;
             if(isAuthenticated){
                const res = user;
                this.isNotAuthenticated = false;
                sessionStorage.setItem('user', JSON.stringify(res));
                this._router.navigateByUrl('/dashboard');
             } 

             this.isNotAuthenticated = true;
         } 
         
         this.isNotAuthenticated = true;
    }
}
