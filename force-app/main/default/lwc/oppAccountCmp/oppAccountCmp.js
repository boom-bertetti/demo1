import { LightningElement, track, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const FIELDS = [
    'Opportunity.AccountId'
];

const ACCOUNT_FIELDS = [
    'Account.Name',
    'Account.Phone',
    'Account.AccountNumber'
];


export default class OppAccountCmp extends LightningElement {
    
    @api recordId;
    @api objectApiName;
    @api accountId;
    @track accountName;
    @track phone;
    @track accountNumber;

    @track errorMessage

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({error, data}) {
        if (error) {
            this.errorMessage = 'Unknown error';
            if (Array.isArray(error.body)) {
                this.errorMessage = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.errorMessage = error.body.message;
            }
            this.record = undefined;
        } else if (data) {
            this.accountId = data.fields.AccountId.value;
            this.objectApiName = 'Account';
            console.log('=====> opp accountId: ' + this.accountId);
        }
    }

    @wire(getRecord, { recordId: '$accountId', fields: ACCOUNT_FIELDS })
    wiredAccountRec({error, data}) {
        console.log('=====> getAccount: ');
        if (error) {
            this.errorMessage = 'Error Retrieving Account';
            if (Array.isArray(error.body)) {
                this.errorMessage = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.errorMessage = error.body.message;
            }
            this.record = undefined;
        } else if (data) {
            this.accountName = data.fields.Name.value;
            this.phone = data.fields.Phone.value;
            this.accountNumber = data.fields.AccountNumber.value;
        }
    }

    handleChange(event) {
        if (event.target.label === 'Company Name') {
            this.accountName = event.target.value;
        }
        if (event.target.label === 'Phone') {
            this.phone = event.target.value;
        }
        if (event.target.label === 'Account Number') {
            this.accountNumber = event.target.value;
        }
    }

    handleSave(event) {
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                        inputCmp.reportValidity();
                        return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            console.log('All input are valid');
            const fields = event.detail.fields;
            fields.Name = this.accountName;
            fields.Phone = this.phone;
            fields.AccountNumber = this.accountNumber;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
            const toastEvent = new ShowToastEvent({
                title: 'Success',
                message: 'Account has been saved!',
                variant: 'success',
                mode: 'dismissable',
                });

                this.dispatchEvent(toastEvent);

        }
    }
}