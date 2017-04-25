import Logger from './Logger';
import * as Brakes from './Brakes';
import Exception from './Exception';
import ExternalException from './ExternalException'

/**
 * An proxy client with load balance and circuit.
 */
export default class BrakerClient {
    constructor(serviceName, options) {
        this.options = options = options || {};
        this.logger = new Logger(options.logger);
        this.serviceName = serviceName;
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

    register(clientInterface) {
        let exports = {};
        for (let key in clientInterface) {
            if (!clientInterface.hasOwnProperty(key)) {
                continue;
            }

            const func = clientInterface[key];
            const circuit = this.brake.slaveCircuit(func, this.fallback.bind(this));

            this.logger.info(`Register the http api '${key}' to cloud client.`);

            exports[key] = {
                id: '',
                circuit: circuit,
                exec: async (...params) => {
                    const response = await circuit.exec(...params);
                    if (response.statusCode < 300) {
                        return response.body;
                    } else {
                        let body = response.body || {};

                        //If body.message is exist, throw body.message or throw body.
                        throw new Exception(body.id, body.message || body, null, response.statusCode);
                    }
                }
            }
        }

        return exports;
    }

    /**
     * Register the http api to this client.
     *
     * @return {*}
     */
    registerApi(clientInterface) {
        let exports = {};
        let wrappers = this.register(clientInterface);
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
        this.logger.error(`Invoke downstream service '${this.serviceName}' fail and fallback, the params is ${JSON.stringify(params)}`, err);
        return Promise.reject(new ExternalException('', 'Cannot invoke downstream service. please try again soon.', err));
    }
}