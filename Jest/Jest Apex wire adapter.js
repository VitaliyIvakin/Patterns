// Jest Apex wire adapter
// to use stub, add line in jest.config.js to the property moduleNameMapper with path to your stub component (in ^...$ format). 
// Ex.1:
//moduleNameMapper: {
//     '^yourNamespaceName/componentName$': '<rootDir>/force-app/test/jest-mocks/yourNamespaceName/componentName',
// create '/force-app/test/jest-mocks' folder + basic component in '/force-app/test/jest-mocks/yourNamespaceName/componentName' folder
// Ex.2: (for the stun it the same namespace)
// moduleNameMapper: { '^c/displayPanel$': '<rootDir>/force-app/test/jest-mocks/c/displayPanel' }
// for created <c-display-panel> stub component in folder '/force-app/test/jest-mocks/c/displayPanel/ 

import { createElement } from 'lwc';
import { setImmediate } from 'timers';
import jestDemoComponent from 'c/JestDemo';
import getAccountListForWire from '@salesforce/apex/AccountController.getAccountListForWire';
import getAccountListForImperative from '@salesforce/apex/AccountController.getAccountListForImperative';

const mockGetAccountList = require('./data/mockAccountList.json');   //contains array of objects [{"Id":"001", "Name": "Acc name"}, {}...]
const mockGetAccountListNoRecords = [];

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
        getAccountListForImperative.mockResolvedValue(mockGetAccountList);  // if we call it in connectedcallback()
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

    test('positive with records', async () => {
        const testingComponent = document.querySelector('c-jest-demo');

        getAccountListForWire.emit(mockGetAccountList);    //using Apex wire adapter
        // or
        getAccountListForImperative.mockResolvedValue(mockGetAccountList);    // using imperative call

        return new Promise(setImmediate).then(() => {
            const divs = testingComponent.shadowRoot.querySelectorAll('.accountItem');
            const divsTextContextArrray = Array.from(divs).map(elem => elem.textContent);
            expect(divsTextContextArrray.length).toBe(4);
            expect(divsTextContextArrray).toEqual(['Test Name1', 'Test Name2', 'Test Name3', 'Test Name4']);
        });
    });

    test('positive no items when no records are returned ', async () => {
        const testingComponent = document.querySelector('c-jest-demo');

        getAccountListForWire.emit(mockGetAccountListNoRecords);    //using Apex wire adapter
        // or
        getAccountListForImperative.mockResolvedValue(mockGetAccountListNoRecords);    // using imperative call by event

        const button = testingComponent.shadowRoot.querySelector('lightning-button');
		button.dispatchEvent(new CustomEvent('click'));     //button.click()

        return new Promise(setImmediate).then(() => {
            const accountElements = testingComponent.shadowRoot.querySelectorAll('.accountItem');
            expect(accountElements.length).toBe(mockGetAccountListNoRecords.length);
        });
    });

    test('negative @wire error', async () => {
        const testingComponent = document.querySelector('c-jest-demo');

        getAccountListForWire.error();    //using Apex wire adapter
        // or
        getAccountListForImperative.mockRejectedValue(APEX_CONTACTS_ERROR);    // using imperative call

        return new Promise(setImmediate).then(() => {
            const errorElement = testingComponent.shadowRoot.querySelector('.errorElement');
            expect(errorElement).not.toBeNull();
            expect(errorElement.textContent).toBe('No accounts found.');
        });
    });

})
