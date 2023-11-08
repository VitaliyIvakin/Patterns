// wait for 'typingTimeout' until the user inputs the next character,
// if the user enters the next character within 'typingTimeout' then it will start the timer again
// to wait for another 'typingTimeout' until the user stops typing.

import { LightningElement } from 'lwc';

export default class Bouncing extends LightningElement {
    typingTimeout = 900;
    typingTimeoutID;

    handleSearchChange(event) {
        clearTimeout(this.typingTimeoutID)

        const etv = event.target.value;  //we can`t directly use event.target.value inside setTimeOut()

        this.typingTimeoutID = setTimeout(() => {
            if (etv) {
                console.log('etv = ', etv)
            }
        }, this.typingTimeout);
    }
}
