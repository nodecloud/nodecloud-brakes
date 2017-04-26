import * as Brakes from './Brakes';
import ExternalException from './ExternalException'

/**
 * An proxy client with load balance and circuit.
 */
export default class BrakerClient {
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

    register(clientInterface, responseHandlers) {
        responseHandlers = responseHandlers || {};

        let exports = {};
        for (let key in clientInterface) {
            if (!clientInterface.hasOwnProperty(key)) {
                continue;
            }

            const func = clientInterface[key];
            const circuit = this.brake.slaveCircuit(async function (...params) {
                if (responseHandlers.preRequest) {
                    responseHandlers.preRequest(...params);
                }

                let response, err;
                try {
                    response = await func(...params);
                } catch (e) {
                    err = e;
                }

                if (responseHandlers.postRequest) {
                    return responseHandlers.postRequest(err, response);
                }

                throw err;
            }, this.fallback.bind(this));

            exports[key] = {
                id: '',
                circuit: circuit,
                exec: async (...params) => {
                    const response = await circuit.exec(...params);
                    if (responseHandlers.postCircuit) {
                        return responseHandlers.postCircuit(response);
                    }

                    return response;
                }
            }
        }

        return exports;
    }

    /**
     * Register the http api to this client.
     *
     * @param clientInterface
     * @param responseHandler
     * @return {*}
     */
    registerApi(clientInterface, responseHandler) {
        let exports = {};
        let wrappers = this.register(clientInterface, responseHandler);
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
        return Promise.reject(new ExternalException('', 'Cannot invoke downstream service. please try again soon.', err));
    }
}