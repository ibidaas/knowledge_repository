import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, pipe, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
declare var appSettings: any;

@Injectable({ providedIn: "root" })
export class XUploadService {
	
	private apiUrl: string = "test";
	
    constructor(private http: HttpClient) {	}
    
    public setHttpHeaders() {
        const myHeaders = new HttpHeaders()
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('Accept', 'application/json');
        return myHeaders;
    }

    upload(url, files) {
		return this.http.post(this.apiUrl + url, files, { })
			.pipe( 
				map(this.extractData), 
				catchError((err) => { 
					return this.handleError(err, 'upload'); 
				})
        	);
    }

    getImages(url: string, param: any): Observable<any> {
		return this.http.get(this.apiUrl + url, { params: this.buildParams(param), headers: this.setHttpHeaders() })
			.pipe( 
				map(this.extractData), 
				catchError(err => { 
					return this.handleError(err, 'get'); 
				})
			);
    }

    private buildParams(param: any) {
        let httpParams = new HttpParams();
            for (const key in param) {
                if (param.hasOwnProperty(key)) {
                    httpParams = httpParams.set(key, param[key]);
                }
            }
        return httpParams;
	}

	private handleError(error: Response, methodName: string) {
		if (error.status === 500) {
			console.log("A server error occurred. Please contact the administrator");
		} else {
			console.log("Error in method " + methodName + ": " + error);
		}
		return of(error);
	}

    private extractData(res: Response) {
        const body = res;
        return body || {};
    }
	
}
