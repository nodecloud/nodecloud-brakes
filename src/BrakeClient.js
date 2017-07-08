import * as Brakes from './Brakes';

export default class BrakeClient {
    /**
     *
     * @param serviceName:                 string to use for name of circuit. This is mostly used for reporting on stats.
     * @param options
     * @param options.handler
     * @param options.handler.preHandle
     * @param options.handler.postHandle
     * @param options.handler.postCircuit
     * @param options.group:               string to use for group of circuit. This is mostly used for reporting on stats.
     * @param options.bucketSpan:          time in ms that a specific bucket should remain active
     * @param options.statInterval:        interval in ms that brakes should emit a snapshot event
     * @param options.percentiles:         array<number> that defines the percentile levels that should be calculated on the stats object (i.e. 0.9 for 90th percentile)
     * @param options.bucketNum:           # of buckets to retain in a rolling window
     * @param options.circuitDuration:     time in ms that a circuit should remain broken
     * @param options.waitThreshold:       number of requests to wait before testing circuit health
     * @param options.threshold:           % threshold for successful calls. If the % of successful calls dips below this threshold the circuit will break
     * @param options.timeout:             time in ms before a service call will timeout
     * @param options.isFailure:           function that returns true if an error should be considered a failure (receives the error object returned by your command.) This allows for non-critical errors to be ignored by the circuit breaker
     * @param options.healthCheckInterval: time in ms interval between each execution of health check function
     * @param options.healthCheck:         function to call for the health check (can be defined also with calling healthCheck function)
     * @param options.fallback:            function to call for fallback (can be defined also with calling fallback function)
     * @param options.isPromise:           boolean to opt out of check for callback in function. This affects the passed in function, health check and fallback
     * @param options.isFunction:          boolean to opt out of check for callback, always promisifying in function. This affects the passed in function, health check and fallback
     */
    constructor(serviceName, options = {}) {
        this.serviceName = serviceName;
        this.options = options;
        this.handler = options.handler;
        this.brakes = Brakes.getBrakes(this.serviceName, this.options);
    }

    /**
     *
     * @param client
     * @param fallback
     * @param options
     * @param options.handler
     * @param options.handler.preHandle
     * @param options.handler.postHandle
     * @param options.handler.postCircuit
     * @return {{send: function}}
     */
    circuit(client, fallback, options = {}) {
        return {
            send: async request => {
                const handler = options.handler || this.handler;
                const circuit = this.brakes.slaveCircuit(async request => {
                    //pre handle request
                    if (handler && handler.preHandle) {
                        request = handler.preHandle(request) || request;
                    }

                    let err, response;
                    try {
                        response = await client.send(request);
                    } catch (e) {
                        err = e;
                    }

                    //post handle response
                    if (handler && handler.postHandle) {
                        response = handler.postHandle(err, response) || response;
                    }

                    return response;
                }, fallback, options);

                let response = await circuit.exec(request);

                if (handler && handler.postCircuit) {
                    response = handler.postCircuit(response);
                }

                return response;
            }
        }
    }

    fallback(callback) {
        return this.brakes.fallback(callback);
    }

    healthCheck(callback) {
        return this.brakes.healthCheck(callback);
    }

    /**
     *
     * @param eventName
     *      exec:              Event on request start
     *      failure:           Event on request failure
     *      success:           Event on request success
     *      timeout:           Event on request timeout
     *      circuitClosed:     Event fired when circuit is closed
     *      circuitOpen:       Event fired when circuit is open
     *      snapshot:          Event fired on stats snapshot
     *      healthCheckFailed: Event fired on failure of each health check execution
     * @param callback
     * @return {*}
     */
    on(eventName, callback) {
        return this.brakes.on(eventName, callback);
    }

    isOpen() {
        return this.brakes.isOpen();
    }
}