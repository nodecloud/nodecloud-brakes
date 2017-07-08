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
                    })(), fallback, options);

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
};
exports.default = BrakeClient;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcmFrZUNsaWVudC5qcyJdLCJuYW1lcyI6WyJCcmFrZXMiLCJCcmFrZUNsaWVudCIsImNvbnN0cnVjdG9yIiwic2VydmljZU5hbWUiLCJvcHRpb25zIiwiaGFuZGxlciIsImJyYWtlcyIsImdldEJyYWtlcyIsImNpcmN1aXQiLCJjbGllbnQiLCJmYWxsYmFjayIsInNlbmQiLCJyZXF1ZXN0Iiwic2xhdmVDaXJjdWl0IiwicHJlSGFuZGxlIiwiZXJyIiwicmVzcG9uc2UiLCJlIiwicG9zdEhhbmRsZSIsImV4ZWMiLCJwb3N0Q2lyY3VpdCIsImNhbGxiYWNrIiwiaGVhbHRoQ2hlY2siLCJvbiIsImV2ZW50TmFtZSIsImlzT3BlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztJQUFZQSxNOzs7Ozs7SUFFU0MsVyxHQUFOLE1BQU1BLFdBQU4sQ0FBa0I7QUFDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQUMsZ0JBQVlDLFdBQVosRUFBeUJDLFVBQVUsRUFBbkMsRUFBdUM7QUFDbkMsYUFBS0QsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxhQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxhQUFLQyxPQUFMLEdBQWVELFFBQVFDLE9BQXZCO0FBQ0EsYUFBS0MsTUFBTCxHQUFjTixPQUFPTyxTQUFQLENBQWlCLEtBQUtKLFdBQXRCLEVBQW1DLEtBQUtDLE9BQXhDLENBQWQ7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7QUFXQUksWUFBUUMsTUFBUixFQUFnQkMsUUFBaEIsRUFBMEJOLFVBQVUsRUFBcEMsRUFBd0M7QUFBQTs7QUFDcEMsZUFBTztBQUNITztBQUFBLDZDQUFNLFdBQU1DLE9BQU4sRUFBaUI7QUFDbkIsMEJBQU1QLFVBQVVELFFBQVFDLE9BQVIsSUFBbUIsTUFBS0EsT0FBeEM7QUFDQSwwQkFBTUcsVUFBVSxNQUFLRixNQUFMLENBQVlPLFlBQVo7QUFBQSxzREFBeUIsV0FBTUQsT0FBTixFQUFpQjtBQUN0RDtBQUNBLGdDQUFJUCxXQUFXQSxRQUFRUyxTQUF2QixFQUFrQztBQUM5QkYsMENBQVVQLFFBQVFTLFNBQVIsQ0FBa0JGLE9BQWxCLEtBQThCQSxPQUF4QztBQUNIOztBQUVELGdDQUFJRyxHQUFKLEVBQVNDLFFBQVQ7QUFDQSxnQ0FBSTtBQUNBQSwyQ0FBVyxNQUFNUCxPQUFPRSxJQUFQLENBQVlDLE9BQVosQ0FBakI7QUFDSCw2QkFGRCxDQUVFLE9BQU9LLENBQVAsRUFBVTtBQUNSRixzQ0FBTUUsQ0FBTjtBQUNIOztBQUVEO0FBQ0EsZ0NBQUlaLFdBQVdBLFFBQVFhLFVBQXZCLEVBQW1DO0FBQy9CRiwyQ0FBV1gsUUFBUWEsVUFBUixDQUFtQkgsR0FBbkIsRUFBd0JDLFFBQXhCLEtBQXFDQSxRQUFoRDtBQUNIOztBQUVELG1DQUFPQSxRQUFQO0FBQ0gseUJBbkJlOztBQUFBO0FBQUE7QUFBQTtBQUFBLDBCQW1CYk4sUUFuQmEsRUFtQkhOLE9BbkJHLENBQWhCOztBQXFCQSx3QkFBSVksV0FBVyxNQUFNUixRQUFRVyxJQUFSLENBQWFQLE9BQWIsQ0FBckI7O0FBRUEsd0JBQUlQLFdBQVdBLFFBQVFlLFdBQXZCLEVBQW9DO0FBQ2hDSixtQ0FBV1gsUUFBUWUsV0FBUixDQUFvQkosUUFBcEIsQ0FBWDtBQUNIOztBQUVELDJCQUFPQSxRQUFQO0FBQ0gsaUJBOUJEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREcsU0FBUDtBQWlDSDs7QUFFRE4sYUFBU1csUUFBVCxFQUFtQjtBQUNmLGVBQU8sS0FBS2YsTUFBTCxDQUFZSSxRQUFaLENBQXFCVyxRQUFyQixDQUFQO0FBQ0g7O0FBRURDLGdCQUFZRCxRQUFaLEVBQXNCO0FBQ2xCLGVBQU8sS0FBS2YsTUFBTCxDQUFZZ0IsV0FBWixDQUF3QkQsUUFBeEIsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7OztBQWNBRSxPQUFHQyxTQUFILEVBQWNILFFBQWQsRUFBd0I7QUFDcEIsZUFBTyxLQUFLZixNQUFMLENBQVlpQixFQUFaLENBQWVDLFNBQWYsRUFBMEJILFFBQTFCLENBQVA7QUFDSDs7QUFFREksYUFBUztBQUNMLGVBQU8sS0FBS25CLE1BQUwsQ0FBWW1CLE1BQVosRUFBUDtBQUNIO0FBM0c0QixDO2tCQUFaeEIsVyIsImZpbGUiOiJCcmFrZUNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEJyYWtlcyBmcm9tICcuL0JyYWtlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyYWtlQ2xpZW50IHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZXJ2aWNlTmFtZTogICAgICAgICAgICAgICAgIHN0cmluZyB0byB1c2UgZm9yIG5hbWUgb2YgY2lyY3VpdC4gVGhpcyBpcyBtb3N0bHkgdXNlZCBmb3IgcmVwb3J0aW5nIG9uIHN0YXRzLlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlclxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXIucHJlSGFuZGxlXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlci5wb3N0SGFuZGxlXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlci5wb3N0Q2lyY3VpdFxuICAgICAqIEBwYXJhbSBvcHRpb25zLmdyb3VwOiAgICAgICAgICAgICAgIHN0cmluZyB0byB1c2UgZm9yIGdyb3VwIG9mIGNpcmN1aXQuIFRoaXMgaXMgbW9zdGx5IHVzZWQgZm9yIHJlcG9ydGluZyBvbiBzdGF0cy5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5idWNrZXRTcGFuOiAgICAgICAgICB0aW1lIGluIG1zIHRoYXQgYSBzcGVjaWZpYyBidWNrZXQgc2hvdWxkIHJlbWFpbiBhY3RpdmVcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5zdGF0SW50ZXJ2YWw6ICAgICAgICBpbnRlcnZhbCBpbiBtcyB0aGF0IGJyYWtlcyBzaG91bGQgZW1pdCBhIHNuYXBzaG90IGV2ZW50XG4gICAgICogQHBhcmFtIG9wdGlvbnMucGVyY2VudGlsZXM6ICAgICAgICAgYXJyYXk8bnVtYmVyPiB0aGF0IGRlZmluZXMgdGhlIHBlcmNlbnRpbGUgbGV2ZWxzIHRoYXQgc2hvdWxkIGJlIGNhbGN1bGF0ZWQgb24gdGhlIHN0YXRzIG9iamVjdCAoaS5lLiAwLjkgZm9yIDkwdGggcGVyY2VudGlsZSlcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5idWNrZXROdW06ICAgICAgICAgICAjIG9mIGJ1Y2tldHMgdG8gcmV0YWluIGluIGEgcm9sbGluZyB3aW5kb3dcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5jaXJjdWl0RHVyYXRpb246ICAgICB0aW1lIGluIG1zIHRoYXQgYSBjaXJjdWl0IHNob3VsZCByZW1haW4gYnJva2VuXG4gICAgICogQHBhcmFtIG9wdGlvbnMud2FpdFRocmVzaG9sZDogICAgICAgbnVtYmVyIG9mIHJlcXVlc3RzIHRvIHdhaXQgYmVmb3JlIHRlc3RpbmcgY2lyY3VpdCBoZWFsdGhcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50aHJlc2hvbGQ6ICAgICAgICAgICAlIHRocmVzaG9sZCBmb3Igc3VjY2Vzc2Z1bCBjYWxscy4gSWYgdGhlICUgb2Ygc3VjY2Vzc2Z1bCBjYWxscyBkaXBzIGJlbG93IHRoaXMgdGhyZXNob2xkIHRoZSBjaXJjdWl0IHdpbGwgYnJlYWtcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50aW1lb3V0OiAgICAgICAgICAgICB0aW1lIGluIG1zIGJlZm9yZSBhIHNlcnZpY2UgY2FsbCB3aWxsIHRpbWVvdXRcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5pc0ZhaWx1cmU6ICAgICAgICAgICBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiBhbiBlcnJvciBzaG91bGQgYmUgY29uc2lkZXJlZCBhIGZhaWx1cmUgKHJlY2VpdmVzIHRoZSBlcnJvciBvYmplY3QgcmV0dXJuZWQgYnkgeW91ciBjb21tYW5kLikgVGhpcyBhbGxvd3MgZm9yIG5vbi1jcml0aWNhbCBlcnJvcnMgdG8gYmUgaWdub3JlZCBieSB0aGUgY2lyY3VpdCBicmVha2VyXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGVhbHRoQ2hlY2tJbnRlcnZhbDogdGltZSBpbiBtcyBpbnRlcnZhbCBiZXR3ZWVuIGVhY2ggZXhlY3V0aW9uIG9mIGhlYWx0aCBjaGVjayBmdW5jdGlvblxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhlYWx0aENoZWNrOiAgICAgICAgIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIHRoZSBoZWFsdGggY2hlY2sgKGNhbiBiZSBkZWZpbmVkIGFsc28gd2l0aCBjYWxsaW5nIGhlYWx0aENoZWNrIGZ1bmN0aW9uKVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmZhbGxiYWNrOiAgICAgICAgICAgIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGZhbGxiYWNrIChjYW4gYmUgZGVmaW5lZCBhbHNvIHdpdGggY2FsbGluZyBmYWxsYmFjayBmdW5jdGlvbilcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5pc1Byb21pc2U6ICAgICAgICAgICBib29sZWFuIHRvIG9wdCBvdXQgb2YgY2hlY2sgZm9yIGNhbGxiYWNrIGluIGZ1bmN0aW9uLiBUaGlzIGFmZmVjdHMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbiwgaGVhbHRoIGNoZWNrIGFuZCBmYWxsYmFja1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmlzRnVuY3Rpb246ICAgICAgICAgIGJvb2xlYW4gdG8gb3B0IG91dCBvZiBjaGVjayBmb3IgY2FsbGJhY2ssIGFsd2F5cyBwcm9taXNpZnlpbmcgaW4gZnVuY3Rpb24uIFRoaXMgYWZmZWN0cyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uLCBoZWFsdGggY2hlY2sgYW5kIGZhbGxiYWNrXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2VydmljZU5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLnNlcnZpY2VOYW1lID0gc2VydmljZU5hbWU7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuaGFuZGxlciA9IG9wdGlvbnMuaGFuZGxlcjtcbiAgICAgICAgdGhpcy5icmFrZXMgPSBCcmFrZXMuZ2V0QnJha2VzKHRoaXMuc2VydmljZU5hbWUsIHRoaXMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2xpZW50XG4gICAgICogQHBhcmFtIGZhbGxiYWNrXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oYW5kbGVyXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlci5wcmVIYW5kbGVcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oYW5kbGVyLnBvc3RIYW5kbGVcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oYW5kbGVyLnBvc3RDaXJjdWl0XG4gICAgICogQHJldHVybiB7e3NlbmQ6IGZ1bmN0aW9ufX1cbiAgICAgKi9cbiAgICBjaXJjdWl0KGNsaWVudCwgZmFsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2VuZDogYXN5bmMgcmVxdWVzdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG9wdGlvbnMuaGFuZGxlciB8fCB0aGlzLmhhbmRsZXI7XG4gICAgICAgICAgICAgICAgY29uc3QgY2lyY3VpdCA9IHRoaXMuYnJha2VzLnNsYXZlQ2lyY3VpdChhc3luYyByZXF1ZXN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9wcmUgaGFuZGxlIHJlcXVlc3RcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIgJiYgaGFuZGxlci5wcmVIYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QgPSBoYW5kbGVyLnByZUhhbmRsZShyZXF1ZXN0KSB8fCByZXF1ZXN0O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGVyciwgcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNsaWVudC5zZW5kKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9wb3N0IGhhbmRsZSByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFuZGxlciAmJiBoYW5kbGVyLnBvc3RIYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gaGFuZGxlci5wb3N0SGFuZGxlKGVyciwgcmVzcG9uc2UpIHx8IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIH0sIGZhbGxiYWNrLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGNpcmN1aXQuZXhlYyhyZXF1ZXN0KTtcblxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyICYmIGhhbmRsZXIucG9zdENpcmN1aXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBoYW5kbGVyLnBvc3RDaXJjdWl0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5icmFrZXMuZmFsbGJhY2soY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGhlYWx0aENoZWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJyYWtlcy5oZWFsdGhDaGVjayhjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lXG4gICAgICogICAgICBleGVjOiAgICAgICAgICAgICAgRXZlbnQgb24gcmVxdWVzdCBzdGFydFxuICAgICAqICAgICAgZmFpbHVyZTogICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3QgZmFpbHVyZVxuICAgICAqICAgICAgc3VjY2VzczogICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3Qgc3VjY2Vzc1xuICAgICAqICAgICAgdGltZW91dDogICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3QgdGltZW91dFxuICAgICAqICAgICAgY2lyY3VpdENsb3NlZDogICAgIEV2ZW50IGZpcmVkIHdoZW4gY2lyY3VpdCBpcyBjbG9zZWRcbiAgICAgKiAgICAgIGNpcmN1aXRPcGVuOiAgICAgICBFdmVudCBmaXJlZCB3aGVuIGNpcmN1aXQgaXMgb3BlblxuICAgICAqICAgICAgc25hcHNob3Q6ICAgICAgICAgIEV2ZW50IGZpcmVkIG9uIHN0YXRzIHNuYXBzaG90XG4gICAgICogICAgICBoZWFsdGhDaGVja0ZhaWxlZDogRXZlbnQgZmlyZWQgb24gZmFpbHVyZSBvZiBlYWNoIGhlYWx0aCBjaGVjayBleGVjdXRpb25cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIG9uKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJha2VzLm9uKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGlzT3BlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJha2VzLmlzT3BlbigpO1xuICAgIH1cbn0iXX0=