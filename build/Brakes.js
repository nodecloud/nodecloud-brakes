'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBrakes = getBrakes;

var _brakes = require('brakes');

var _brakes2 = _interopRequireDefault(_brakes);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get a brakes.
 *
 * @param name
 * @param options
 * @return {*|Brakes}
 */
function getBrakes(name, options = {}) {
    const logger = new _Logger2.default(options.logger);

    let brake = new _brakes2.default({
        name: name,
        statInterval: options.statInterval || 2500,
        threshold: options.threshold || 0.5,
        circuitDuration: options.circuitDuration || 15000,
        timeout: options.timeout || 10000
    });

    brake.on('circuitOpen', () => {
        logger.warn(`The service: ${name}'s circuit is opened.`);
    });

    brake.on('circuitClosed', () => {
        logger.info(`The service: ${name}'s circuit is closed.`);
    });

    return brake;
}