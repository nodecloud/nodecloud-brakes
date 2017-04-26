'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBrakes = getBrakes;

var _brakes = require('brakes');

var _brakes2 = _interopRequireDefault(_brakes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get a brakes.
 *
 * @param name
 * @param options
 * @return {*|Brakes}
 */
function getBrakes(name, options = {}) {
    return new _brakes2.default({
        name: name,
        statInterval: options.statInterval || 2500,
        threshold: options.threshold || 0.5,
        circuitDuration: options.circuitDuration || 15000,
        timeout: options.timeout || 10000
    });
}