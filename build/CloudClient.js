'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Brakes = require('./Brakes');

var Brakes = _interopRequireWildcard(_Brakes);

var _Exception = require('./Exception');

var _Exception2 = _interopRequireDefault(_Exception);

var _ExternalException = require('./ExternalException');

var _ExternalException2 = _interopRequireDefault(_ExternalException);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An proxy client with load balance and circuit.
 */
class CloudClient {
    constructor(serviceName, clientInterface, options) {
        this.options = options = options || {};
        this.logger = new _Logger2.default(options.logger);
        this.serviceName = serviceName;
        this.clientInterface = clientInterface;
        this.brake = Brakes.getBrakes(serviceName, options);
    }

    /**
     * Set the circuit's health check callback.
     *
     * @param fn
     */
    setHealthCheck(fn) {
        this.brake.healthCheck(() => {
            this.logger.info(`Check the service: '${this.serviceName}''s health status.`);
            return fn();
        });
    }

    /**
     * Register the http api to this client.
     *
     * @return {{}}
     */
    registerApi() {
        let exports = {};
        for (let key in this.clientInterface) {
            if (!this.clientInterface.hasOwnProperty(key)) {
                continue;
            }

            const func = this.clientInterface[key];
            const circuit = this.brake.slaveCircuit(func, this.fallback.bind(this));

            this.logger.info(`Register the http api '${key}' to feign client.`);

            exports[key] = async (...params) => {
                const response = await circuit.exec(...params);
                if (response.statusCode < 300) {
                    return response.body;
                } else {
                    let body = response.body || {};

                    // if body.message is exist, throw body.message or throw body.
                    throw new _Exception2.default(body.id, body.message || body, null, response.statusCode);
                }
            };
        }

        return exports;
    }

    /**
     * Circuit fallback method.
     *
     * @param err
     * @param params
     * @return {Promise.<*>}
     */
    fallback(err, ...params) {
        this.logger.error(`Invoke downstream service '${this.serviceName}' fail and fallback, the params is ${JSON.stringify(params)}`, err);
        return Promise.reject(new _ExternalException2.default('', 'Cannot invoke downstream service. please try again soon.', err));
    }
}
exports.default = CloudClient;
module.exports = exports['default'];