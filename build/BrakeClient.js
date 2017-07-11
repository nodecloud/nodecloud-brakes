'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _Brakes = require('./Brakes');

var Brakes = _interopRequireWildcard(_Brakes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let BrakeClient = class BrakeClient {
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
        var _this = this;

        return {
            send: (() => {
                var _ref = _asyncToGenerator(function* (request) {
                    const handler = options.handler || _this.handler;
                    const circuit = _this.brakes.slaveCircuit((() => {
                        var _ref2 = _asyncToGenerator(function* (request) {
                            //pre handle request
                            if (handler && handler.preHandle) {
                                request = handler.preHandle(request) || request;
                            }

                            let err, response;
                            try {
                                response = yield client.send(request);
                            } catch (e) {
                                err = e;
                            }

                            //post handle response
                            if (handler && handler.postHandle) {
                                response = handler.postHandle(err, response) || response;
                            }

                            return response;
                        });

                        return function (_x2) {
                            return _ref2.apply(this, arguments);
                        };
                    })(), fallback ? function (...params) {
                        return fallback(...params);
                    } : undefined, options);

                    let response = yield circuit.exec(request);

                    if (handler && handler.postCircuit) {
                        response = handler.postCircuit(response);
                    }

                    return response;
                });

                return function send(_x) {
                    return _ref.apply(this, arguments);
                };
            })()
        };
    }

    fallback(callback) {
        return this.brakes.fallback(function (...params) {
            return callback(...params);
        });
    }

    healthCheck(callback) {
        return this.brakes.healthCheck(function (...params) {
            return callback(...params);
        });
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
};
exports.default = BrakeClient;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcmFrZUNsaWVudC5qcyJdLCJuYW1lcyI6WyJCcmFrZXMiLCJCcmFrZUNsaWVudCIsImNvbnN0cnVjdG9yIiwic2VydmljZU5hbWUiLCJvcHRpb25zIiwiaGFuZGxlciIsImJyYWtlcyIsImdldEJyYWtlcyIsImNpcmN1aXQiLCJjbGllbnQiLCJmYWxsYmFjayIsInNlbmQiLCJyZXF1ZXN0Iiwic2xhdmVDaXJjdWl0IiwicHJlSGFuZGxlIiwiZXJyIiwicmVzcG9uc2UiLCJlIiwicG9zdEhhbmRsZSIsInBhcmFtcyIsInVuZGVmaW5lZCIsImV4ZWMiLCJwb3N0Q2lyY3VpdCIsImNhbGxiYWNrIiwiaGVhbHRoQ2hlY2siLCJvbiIsImV2ZW50TmFtZSIsImlzT3BlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztJQUFZQSxNOzs7Ozs7SUFFU0MsVyxHQUFOLE1BQU1BLFdBQU4sQ0FBa0I7QUFDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQUMsZ0JBQVlDLFdBQVosRUFBeUJDLFVBQVUsRUFBbkMsRUFBdUM7QUFDbkMsYUFBS0QsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxhQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxhQUFLQyxPQUFMLEdBQWVELFFBQVFDLE9BQXZCO0FBQ0EsYUFBS0MsTUFBTCxHQUFjTixPQUFPTyxTQUFQLENBQWlCLEtBQUtKLFdBQXRCLEVBQW1DLEtBQUtDLE9BQXhDLENBQWQ7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7QUFXQUksWUFBUUMsTUFBUixFQUFnQkMsUUFBaEIsRUFBMEJOLFVBQVUsRUFBcEMsRUFBd0M7QUFBQTs7QUFDcEMsZUFBTztBQUNITztBQUFBLDZDQUFNLFdBQU1DLE9BQU4sRUFBaUI7QUFDbkIsMEJBQU1QLFVBQVVELFFBQVFDLE9BQVIsSUFBbUIsTUFBS0EsT0FBeEM7QUFDQSwwQkFBTUcsVUFBVSxNQUFLRixNQUFMLENBQVlPLFlBQVo7QUFBQSxzREFBeUIsV0FBTUQsT0FBTixFQUFpQjtBQUN0RDtBQUNBLGdDQUFJUCxXQUFXQSxRQUFRUyxTQUF2QixFQUFrQztBQUM5QkYsMENBQVVQLFFBQVFTLFNBQVIsQ0FBa0JGLE9BQWxCLEtBQThCQSxPQUF4QztBQUNIOztBQUVELGdDQUFJRyxHQUFKLEVBQVNDLFFBQVQ7QUFDQSxnQ0FBSTtBQUNBQSwyQ0FBVyxNQUFNUCxPQUFPRSxJQUFQLENBQVlDLE9BQVosQ0FBakI7QUFDSCw2QkFGRCxDQUVFLE9BQU9LLENBQVAsRUFBVTtBQUNSRixzQ0FBTUUsQ0FBTjtBQUNIOztBQUVEO0FBQ0EsZ0NBQUlaLFdBQVdBLFFBQVFhLFVBQXZCLEVBQW1DO0FBQy9CRiwyQ0FBV1gsUUFBUWEsVUFBUixDQUFtQkgsR0FBbkIsRUFBd0JDLFFBQXhCLEtBQXFDQSxRQUFoRDtBQUNIOztBQUVELG1DQUFPQSxRQUFQO0FBQ0gseUJBbkJlOztBQUFBO0FBQUE7QUFBQTtBQUFBLDBCQW1CYk4sV0FBVyxVQUFVLEdBQUdTLE1BQWIsRUFBcUI7QUFDL0IsK0JBQU9ULFNBQVMsR0FBR1MsTUFBWixDQUFQO0FBQ0gscUJBRkUsR0FFQ0MsU0FyQlksRUFxQkRoQixPQXJCQyxDQUFoQjs7QUF1QkEsd0JBQUlZLFdBQVcsTUFBTVIsUUFBUWEsSUFBUixDQUFhVCxPQUFiLENBQXJCOztBQUVBLHdCQUFJUCxXQUFXQSxRQUFRaUIsV0FBdkIsRUFBb0M7QUFDaENOLG1DQUFXWCxRQUFRaUIsV0FBUixDQUFvQk4sUUFBcEIsQ0FBWDtBQUNIOztBQUVELDJCQUFPQSxRQUFQO0FBQ0gsaUJBaENEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREcsU0FBUDtBQW1DSDs7QUFFRE4sYUFBU2EsUUFBVCxFQUFtQjtBQUNmLGVBQU8sS0FBS2pCLE1BQUwsQ0FBWUksUUFBWixDQUFxQixVQUFVLEdBQUdTLE1BQWIsRUFBcUI7QUFDN0MsbUJBQU9JLFNBQVMsR0FBR0osTUFBWixDQUFQO0FBQ0gsU0FGTSxDQUFQO0FBR0g7O0FBRURLLGdCQUFZRCxRQUFaLEVBQXNCO0FBQ2xCLGVBQU8sS0FBS2pCLE1BQUwsQ0FBWWtCLFdBQVosQ0FBd0IsVUFBVSxHQUFHTCxNQUFiLEVBQXFCO0FBQ2hELG1CQUFPSSxTQUFTLEdBQUdKLE1BQVosQ0FBUDtBQUNILFNBRk0sQ0FBUDtBQUdIOztBQUVEOzs7Ozs7Ozs7Ozs7OztBQWNBTSxPQUFHQyxTQUFILEVBQWNILFFBQWQsRUFBd0I7QUFDcEIsZUFBTyxLQUFLakIsTUFBTCxDQUFZbUIsRUFBWixDQUFlQyxTQUFmLEVBQTBCSCxRQUExQixDQUFQO0FBQ0g7O0FBRURJLGFBQVM7QUFDTCxlQUFPLEtBQUtyQixNQUFMLENBQVlxQixNQUFaLEVBQVA7QUFDSDtBQWpINEIsQztrQkFBWjFCLFciLCJmaWxlIjoiQnJha2VDbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCcmFrZXMgZnJvbSAnLi9CcmFrZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmFrZUNsaWVudCB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VydmljZU5hbWU6ICAgICAgICAgICAgICAgICBzdHJpbmcgdG8gdXNlIGZvciBuYW1lIG9mIGNpcmN1aXQuIFRoaXMgaXMgbW9zdGx5IHVzZWQgZm9yIHJlcG9ydGluZyBvbiBzdGF0cy5cbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oYW5kbGVyLnByZUhhbmRsZVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXIucG9zdEhhbmRsZVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXIucG9zdENpcmN1aXRcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5ncm91cDogICAgICAgICAgICAgICBzdHJpbmcgdG8gdXNlIGZvciBncm91cCBvZiBjaXJjdWl0LiBUaGlzIGlzIG1vc3RseSB1c2VkIGZvciByZXBvcnRpbmcgb24gc3RhdHMuXG4gICAgICogQHBhcmFtIG9wdGlvbnMuYnVja2V0U3BhbjogICAgICAgICAgdGltZSBpbiBtcyB0aGF0IGEgc3BlY2lmaWMgYnVja2V0IHNob3VsZCByZW1haW4gYWN0aXZlXG4gICAgICogQHBhcmFtIG9wdGlvbnMuc3RhdEludGVydmFsOiAgICAgICAgaW50ZXJ2YWwgaW4gbXMgdGhhdCBicmFrZXMgc2hvdWxkIGVtaXQgYSBzbmFwc2hvdCBldmVudFxuICAgICAqIEBwYXJhbSBvcHRpb25zLnBlcmNlbnRpbGVzOiAgICAgICAgIGFycmF5PG51bWJlcj4gdGhhdCBkZWZpbmVzIHRoZSBwZXJjZW50aWxlIGxldmVscyB0aGF0IHNob3VsZCBiZSBjYWxjdWxhdGVkIG9uIHRoZSBzdGF0cyBvYmplY3QgKGkuZS4gMC45IGZvciA5MHRoIHBlcmNlbnRpbGUpXG4gICAgICogQHBhcmFtIG9wdGlvbnMuYnVja2V0TnVtOiAgICAgICAgICAgIyBvZiBidWNrZXRzIHRvIHJldGFpbiBpbiBhIHJvbGxpbmcgd2luZG93XG4gICAgICogQHBhcmFtIG9wdGlvbnMuY2lyY3VpdER1cmF0aW9uOiAgICAgdGltZSBpbiBtcyB0aGF0IGEgY2lyY3VpdCBzaG91bGQgcmVtYWluIGJyb2tlblxuICAgICAqIEBwYXJhbSBvcHRpb25zLndhaXRUaHJlc2hvbGQ6ICAgICAgIG51bWJlciBvZiByZXF1ZXN0cyB0byB3YWl0IGJlZm9yZSB0ZXN0aW5nIGNpcmN1aXQgaGVhbHRoXG4gICAgICogQHBhcmFtIG9wdGlvbnMudGhyZXNob2xkOiAgICAgICAgICAgJSB0aHJlc2hvbGQgZm9yIHN1Y2Nlc3NmdWwgY2FsbHMuIElmIHRoZSAlIG9mIHN1Y2Nlc3NmdWwgY2FsbHMgZGlwcyBiZWxvdyB0aGlzIHRocmVzaG9sZCB0aGUgY2lyY3VpdCB3aWxsIGJyZWFrXG4gICAgICogQHBhcmFtIG9wdGlvbnMudGltZW91dDogICAgICAgICAgICAgdGltZSBpbiBtcyBiZWZvcmUgYSBzZXJ2aWNlIGNhbGwgd2lsbCB0aW1lb3V0XG4gICAgICogQHBhcmFtIG9wdGlvbnMuaXNGYWlsdXJlOiAgICAgICAgICAgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRydWUgaWYgYW4gZXJyb3Igc2hvdWxkIGJlIGNvbnNpZGVyZWQgYSBmYWlsdXJlIChyZWNlaXZlcyB0aGUgZXJyb3Igb2JqZWN0IHJldHVybmVkIGJ5IHlvdXIgY29tbWFuZC4pIFRoaXMgYWxsb3dzIGZvciBub24tY3JpdGljYWwgZXJyb3JzIHRvIGJlIGlnbm9yZWQgYnkgdGhlIGNpcmN1aXQgYnJlYWtlclxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhlYWx0aENoZWNrSW50ZXJ2YWw6IHRpbWUgaW4gbXMgaW50ZXJ2YWwgYmV0d2VlbiBlYWNoIGV4ZWN1dGlvbiBvZiBoZWFsdGggY2hlY2sgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oZWFsdGhDaGVjazogICAgICAgICBmdW5jdGlvbiB0byBjYWxsIGZvciB0aGUgaGVhbHRoIGNoZWNrIChjYW4gYmUgZGVmaW5lZCBhbHNvIHdpdGggY2FsbGluZyBoZWFsdGhDaGVjayBmdW5jdGlvbilcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5mYWxsYmFjazogICAgICAgICAgICBmdW5jdGlvbiB0byBjYWxsIGZvciBmYWxsYmFjayAoY2FuIGJlIGRlZmluZWQgYWxzbyB3aXRoIGNhbGxpbmcgZmFsbGJhY2sgZnVuY3Rpb24pXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaXNQcm9taXNlOiAgICAgICAgICAgYm9vbGVhbiB0byBvcHQgb3V0IG9mIGNoZWNrIGZvciBjYWxsYmFjayBpbiBmdW5jdGlvbi4gVGhpcyBhZmZlY3RzIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24sIGhlYWx0aCBjaGVjayBhbmQgZmFsbGJhY2tcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5pc0Z1bmN0aW9uOiAgICAgICAgICBib29sZWFuIHRvIG9wdCBvdXQgb2YgY2hlY2sgZm9yIGNhbGxiYWNrLCBhbHdheXMgcHJvbWlzaWZ5aW5nIGluIGZ1bmN0aW9uLiBUaGlzIGFmZmVjdHMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbiwgaGVhbHRoIGNoZWNrIGFuZCBmYWxsYmFja1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNlcnZpY2VOYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmhhbmRsZXIgPSBvcHRpb25zLmhhbmRsZXI7XG4gICAgICAgIHRoaXMuYnJha2VzID0gQnJha2VzLmdldEJyYWtlcyh0aGlzLnNlcnZpY2VOYW1lLCB0aGlzLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGNsaWVudFxuICAgICAqIEBwYXJhbSBmYWxsYmFja1xuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlclxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXIucHJlSGFuZGxlXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlci5wb3N0SGFuZGxlXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlci5wb3N0Q2lyY3VpdFxuICAgICAqIEByZXR1cm4ge3tzZW5kOiBmdW5jdGlvbn19XG4gICAgICovXG4gICAgY2lyY3VpdChjbGllbnQsIGZhbGxiYWNrLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNlbmQ6IGFzeW5jIHJlcXVlc3QgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBvcHRpb25zLmhhbmRsZXIgfHwgdGhpcy5oYW5kbGVyO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNpcmN1aXQgPSB0aGlzLmJyYWtlcy5zbGF2ZUNpcmN1aXQoYXN5bmMgcmVxdWVzdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vcHJlIGhhbmRsZSByZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyICYmIGhhbmRsZXIucHJlSGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ID0gaGFuZGxlci5wcmVIYW5kbGUocmVxdWVzdCkgfHwgcmVxdWVzdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnIsIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjbGllbnQuc2VuZChyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0gZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vcG9zdCBoYW5kbGUgcmVzcG9uc2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIgJiYgaGFuZGxlci5wb3N0SGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGhhbmRsZXIucG9zdEhhbmRsZShlcnIsIHJlc3BvbnNlKSB8fCByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB9LCBmYWxsYmFjayA/IGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbGxiYWNrKC4uLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgfSA6IHVuZGVmaW5lZCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBjaXJjdWl0LmV4ZWMocmVxdWVzdCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlciAmJiBoYW5kbGVyLnBvc3RDaXJjdWl0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gaGFuZGxlci5wb3N0Q2lyY3VpdChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmFsbGJhY2soY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJha2VzLmZhbGxiYWNrKGZ1bmN0aW9uICguLi5wYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayguLi5wYXJhbXMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoZWFsdGhDaGVjayhjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5icmFrZXMuaGVhbHRoQ2hlY2soZnVuY3Rpb24gKC4uLnBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKC4uLnBhcmFtcyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZVxuICAgICAqICAgICAgZXhlYzogICAgICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3Qgc3RhcnRcbiAgICAgKiAgICAgIGZhaWx1cmU6ICAgICAgICAgICBFdmVudCBvbiByZXF1ZXN0IGZhaWx1cmVcbiAgICAgKiAgICAgIHN1Y2Nlc3M6ICAgICAgICAgICBFdmVudCBvbiByZXF1ZXN0IHN1Y2Nlc3NcbiAgICAgKiAgICAgIHRpbWVvdXQ6ICAgICAgICAgICBFdmVudCBvbiByZXF1ZXN0IHRpbWVvdXRcbiAgICAgKiAgICAgIGNpcmN1aXRDbG9zZWQ6ICAgICBFdmVudCBmaXJlZCB3aGVuIGNpcmN1aXQgaXMgY2xvc2VkXG4gICAgICogICAgICBjaXJjdWl0T3BlbjogICAgICAgRXZlbnQgZmlyZWQgd2hlbiBjaXJjdWl0IGlzIG9wZW5cbiAgICAgKiAgICAgIHNuYXBzaG90OiAgICAgICAgICBFdmVudCBmaXJlZCBvbiBzdGF0cyBzbmFwc2hvdFxuICAgICAqICAgICAgaGVhbHRoQ2hlY2tGYWlsZWQ6IEV2ZW50IGZpcmVkIG9uIGZhaWx1cmUgb2YgZWFjaCBoZWFsdGggY2hlY2sgZXhlY3V0aW9uXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBvbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJyYWtlcy5vbihldmVudE5hbWUsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBpc09wZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJyYWtlcy5pc09wZW4oKTtcbiAgICB9XG59Il19