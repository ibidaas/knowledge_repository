import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthService
{
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    { }

    login(username: string, password: string): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('https://api.holidaytool.gr/api/Auth/login', 
                { 
                    'username': username, 
                    'password': password 
                })
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
