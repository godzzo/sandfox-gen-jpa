import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar, MatTabGroup, MatDialog, MatDialogRef } from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { SzemCandidate } from './candidate.model';
import { SzemCandidateService } from './candidate.service';
import { SzemCandidateCodeFormComponent } from './code-form/code-form.component';

@Component({
    selector     : 'szem-candidate',
    templateUrl  : './candidate.component.html',
    styleUrls    : ['./candidate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SzemCandidateComponent implements OnInit, OnDestroy
{
    current: SzemCandidate;
    pageType: string;
	candidateForm: FormGroup;

	showHistory: boolean;
	showResult: boolean;
	@ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _service: SzemCandidateService,
        private _formBuilder: FormBuilder,
        private _location: Location,
		private _matSnackBar: MatSnackBar,
		private _matDialog: MatDialog
    )
    {
		this.showHistory = false;
		this.showResult = false;
        this.current = new SzemCandidate();
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void
    {
        this._service.onRecordChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(actor => {

                if ( actor )
                {
                    this.current = new SzemCandidate(actor);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.current = new SzemCandidate();
                }

                this.candidateForm = this.createForm();
            });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

	onShowHistory(event: any) {
		this._matSnackBar.open(
			'Belépési kódhoz tartozó történet megjelenítése',
			'OK',
			{verticalPosition: 'top', duration: 3000}
		);

		this.showHistory = true;
		this.tabGroup.selectedIndex = 2;
	}

	onShowResult() {
		this._matSnackBar.open(
			'Részletes eredménylap legenerálva',
			'OK',
			{verticalPosition: 'top', duration: 3000}
		);

		this.showResult = true;
		this.tabGroup.selectedIndex = 3;
	}

	onAddCode() {
		this.dialogRef = this._matDialog.open(SzemCandidateCodeFormComponent, {
			panelClass: 'event-form-dialog',
			data      : {}
		});
	}

    createForm(): FormGroup
    {
        return this._formBuilder.group({
            id : [this.current.id],
			name : [this.current.name],
			KID : [this.current.KID],
            motherName : [this.current.motherName],
			birthPlace : [this.current.birthPlace],
			birthDate : [this.current.birthDate]
        });
    }

    saveRecord(): void {
        const data = this.candidateForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.firstName);

        this._service.saveRecord(data)
            .then(() => {

                this._service.onRecordChanged.next(data);

                this._matSnackBar.open('Record saved', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            });
    }

    addRecord(): void {
        const data = this.candidateForm.getRawValue();

        this._service.addRecord(data)
            .then(() => {

                this._service.onRecordChanged.next(data);

                this._matSnackBar.open('Record added', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                this._location.go(this._service.rootUrl + this.current.id);
            });
    }
}
