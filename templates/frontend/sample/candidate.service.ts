import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SzemCandidateService implements Resolve<any>
{
    routeParams: any;
    current: any;
	onRecordChanged: BehaviorSubject<any>;
	rootUrl: string;
	

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
		this.onRecordChanged = new BehaviorSubject({});
		this.rootUrl = 'api/szem-candidates/';
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getRecord()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get record
     *
     * @returns {Promise<any>}
     */
    getRecord(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.rootUrl + this.routeParams.id)
                .subscribe((response: any) => {
                    this.current = response;
                    this.onRecordChanged.next(this.current);
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Save record
     *
     * @param record
     * @returns {Promise<any>}
     */
    saveRecord(record): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.rootUrl + record.id, record)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add record
     *
     * @param record
     * @returns {Promise<any>}
     */
    addRecord(record): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.rootUrl, record)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
