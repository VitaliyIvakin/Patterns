// Jest Apex wire adapter
import { createElement } from 'lwc';
import { setImmediate } from 'timers';
import jestDemoComponent from 'c/JestDemo';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';

const mockGetAccountList = require('./data/getAccountList.json');   //contains array of objects [{"Id":"001", "Name": "Acc name"}, {}...]
const mockGetAccountListNoRecords = require('./data/getAccountListNoRecords.json'); // contains empty array []

jest.mock('@salesforce/apex/AccountController.getAccountList', () => {
    const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
    return {
        default: createApexTestWireAdapter(jest.fn())
    };
},
    { virtual: true }
);

describe('getAccountList using Apex wire adapter', () => {

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

    test('positive with records', () => {
        const testingComponent = document.querySelector('c-jest-demo');

        getAccountList.emit(mockGetAccountList);

        return new Promise(setImmediate).then(() => {
            const divs = testingComponent.shadowRoot.querySelectorAll('.accountItem');
            const divsTextContextArrray = Array.from(divs).map(p => p.textContent);
            expect(divsTextContextArrray.length).toBe(4);
            expect(divsTextContextArrray).toEqual(['Test Name1', 'Test Name2', 'Test Name3', 'Test Name4']);
        });

    });

    test('positive no items when no records are returned ', () => {
        const testingComponent = document.querySelector('c-jest-demo');

        getAccountList.emit(mockGetAccountListNoRecords);

        return new Promise(setImmediate).then(() => {
            const accountElements = testingComponent.shadowRoot.querySelectorAll('.accountItem');
            expect(accountElements.length).toBe(mockGetAccountListNoRecords.length);
        });

    });

    test('negative @wire error', () => {
        const testingComponent = document.querySelector('c-jest-demo');

        getAccountList.error();

        return new Promise(setImmediate).then(() => {
            const errorElement = testingComponent.shadowRoot.querySelector('.errorElement');
            expect(errorElement).not.toBeNull();
            expect(errorElement.textContent).toBe('No accounts found.');
        });
    });

})
