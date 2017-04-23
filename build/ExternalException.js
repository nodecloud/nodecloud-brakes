'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Exception = require('./Exception');

var _Exception2 = _interopRequireDefault(_Exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ExternalException extends _Exception2.default {
    constructor(id, message, exception) {
        super(id, message, exception);
        this.code = 500;
    }
}
exports.default = ExternalException;
module.exports = exports['default'];