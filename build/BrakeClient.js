'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Brakes = require('./Brakes');

var Brakes = _interopRequireWildcard(_Brakes);

var _ExternalException = require('./ExternalException');

var _ExternalException2 = _interopRequireDefault(_ExternalException);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * An proxy client with load balance and circuit.
 */
class BrakerClient {
    constructor(serviceName, options) {
        this.options = options = options || {};
        this.serviceName = serviceName;
        this.brake = Brakes.getBrakes(serviceName, options);
    }

    /**
     * Set the circuit's health check callback.
     *
     * @param fn
     */
    setHealthCheck(fn) {
        this.brake.healthCheck(fn);
    }

    on(eventName, callback) {
        this.brake.on(eventName, callback);
    }

    register(clientInterface, handlers) {
        handlers = handlers || {};

        let exports = {};
        for (let key in clientInterface) {
            if (!clientInterface.hasOwnProperty(key)) {
                continue;
            }

            const func = clientInterface[key];
            const circuit = this.brake.slaveCircuit((() => {
                var _ref = _asyncToGenerator(function* (...params) {
                    if (handlers.preRequest) {
                        yield handlers.preRequest(...params);
                    }

                    let response, err;
                    try {
                        response = yield func(...params);
                    } catch (e) {
                        err = e;
                    }

                    if (handlers.postRequest) {
                        return yield handlers.postRequest(err, response);
                    }

                    if (err) {
                        throw err;
                    }

                    return response;
                });

                return function () {
                    return _ref.apply(this, arguments);
                };
            })(), this.fallback.bind(this));

            exports[key] = {
                id: '',
                circuit: circuit,
                exec: (() => {
                    var _ref2 = _asyncToGenerator(function* (...params) {
                        const response = yield circuit.exec(...params);
                        if (handlers.postCircuit) {
                            return yield handlers.postCircuit(response);
                        }

                        return response;
                    });

                    return function exec() {
                        return _ref2.apply(this, arguments);
                    };
                })()
            };
        }

        return exports;
    }

    /**
     * Register the http api to this client.
     *
     * @param clientInterface
     * @param handlers
     * @return {*}
     */
    registerApi(clientInterface, handlers) {
        let exports = {};
        let wrappers = this.register(clientInterface, handlers);
        for (let key in wrappers) {
            if (!wrappers.hasOwnProperty(key)) {
                continue;
            }
            exports[key] = wrappers[key].exec;
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
        return Promise.reject(new _ExternalException2.default('', 'Cannot invoke downstream service. please try again soon.', err));
    }
}
exports.default = BrakerClient;