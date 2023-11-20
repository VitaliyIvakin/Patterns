// Jest Apex wire adapter
import { createElement } from 'lwc';
import { setImmediate } from 'timers';
import jestDemoComponent from 'c/JestDemo';
import getAccountListForWire from '@salesforce/apex/AccountController.getAccountListForWire';
import getAccountListForImperative from '@salesforce/apex/AccountController.getAccountListForImperative';

const mockGetAccountList = require('./data/mockAccountList.json');   //contains array of objects [{"Id":"001", "Name": "Acc name"}, {}...]
const mockGetAccountListNoRecords = require('./data/mockAccountListNoRecords.json'); // contains empty array []

// Sample error for imperative Apex call
const APEX_CONTACTS_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

jest.mock('@salesforce/apex/AccountController.getAccountListForWire', () => {
    const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
    return {
        default: createApexTestWireAdapter(jest.fn())
    };
},
    { virtual: true }
);

jest.mock('@salesforce/apex/AccountController.getAccountListForImperative', () => ({
    default: jest.fn()
}),
    { virtual: true }
);

describe('testing jestDemoComponent suit', () => {

    beforeEach(() => {
        const testingComponent = createElement('c-jest-demo', {
            is: jestDemoComponent
        });
        document.body.appendChild(testingComponent);
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    test('positive with records', async () => {
        const testingComponent = document.querySelector('c-jest-demo');

        getAccountListForWire.emit(mockGetAccountList);    //using Apex wire adapter
        getAccountListForImperative.mockResolvedValue(mockGetAccountList);    // using imperative call

        // Wait for any asynchronous DOM updates
        await flushPromises();
        
        // or use
        // return new Promise(setImmediate).then(()=>{ 
        const divs = testingComponent.shadowRoot.querySelectorAll('.accountItem');
        const divsTextContextArrray = Array.from(divs).map(p => p.textContent);
        expect(divsTextContextArrray.length).toBe(4);
        expect(divsTextContextArrray).toEqual(['Test Name1', 'Test Name2', 'Test Name3', 'Test Name4']);

    });

    test('positive no items when no records are returned ', async () => {
        const testingComponent = document.querySelector('c-jest-demo');

        getAccountListForWire.emit(mockGetAccountListNoRecords);    //using Apex wire adapter
        getAccountListForImperative.mockResolvedValue(mockGetAccountListNoRecords);    // using imperative call
            
        // Wait for any asynchronous DOM updates
        await flushPromises();

        const accountElements = testingComponent.shadowRoot.querySelectorAll('.accountItem');
        expect(accountElements.length).toBe(mockGetAccountListNoRecords.length);

    });

    test('negative @wire error', async () => {
        const testingComponent = document.querySelector('c-jest-demo');

        getAccountListForWire.error();    //using Apex wire adapter
        getAccountListForImperative.mockRejectedValue(APEX_CONTACTS_ERROR);    // using imperative call
        
        // Wait for any asynchronous DOM updates
        await flushPromises();

        const errorElement = testingComponent.shadowRoot.querySelector('.errorElement');
        expect(errorElement).not.toBeNull();
        expect(errorElement.textContent).toBe('No accounts found.');
    });

})
