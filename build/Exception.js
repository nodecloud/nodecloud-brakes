/**
 * Exception
 */
export default class Exception {
    constructor(id, message = '', exception, code) {
        this.code = code || 400;
        this.id = id;
        if (exception && exception.message) {
            this.message = message + ' The exception message is ' + exception.message;
        } else {
            this.message = message;
        }
        this.exception = exception;
    }
}