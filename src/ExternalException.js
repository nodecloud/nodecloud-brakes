import Exception from './Exception';

export default class ExternalException extends Exception {
    constructor(id, message, exception) {
        super(id, message, exception);
        this.code = 500;
    }
}