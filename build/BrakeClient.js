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
     * @return {function(*=)}
     */
    circuit(client, fallback, options = {}) {
        var _this = this;

        return (() => {
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

                return yield circuit.exec(request);
            });

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        })();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcmFrZUNsaWVudC5qcyJdLCJuYW1lcyI6WyJCcmFrZXMiLCJCcmFrZUNsaWVudCIsImNvbnN0cnVjdG9yIiwic2VydmljZU5hbWUiLCJvcHRpb25zIiwiaGFuZGxlciIsImJyYWtlcyIsImdldEJyYWtlcyIsImNpcmN1aXQiLCJjbGllbnQiLCJmYWxsYmFjayIsInJlcXVlc3QiLCJzbGF2ZUNpcmN1aXQiLCJwcmVIYW5kbGUiLCJlcnIiLCJyZXNwb25zZSIsInNlbmQiLCJlIiwicG9zdEhhbmRsZSIsImV4ZWMiLCJjYWxsYmFjayIsImhlYWx0aENoZWNrIiwib24iLCJldmVudE5hbWUiLCJpc09wZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7SUFBWUEsTTs7Ozs7O0lBRVNDLFcsR0FBTixNQUFNQSxXQUFOLENBQWtCO0FBQzdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQUMsZ0JBQVlDLFdBQVosRUFBeUJDLFVBQVUsRUFBbkMsRUFBdUM7QUFDbkMsYUFBS0QsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxhQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxhQUFLQyxPQUFMLEdBQWVELFFBQVFDLE9BQXZCO0FBQ0EsYUFBS0MsTUFBTCxHQUFjTixPQUFPTyxTQUFQLENBQWlCLEtBQUtKLFdBQXRCLEVBQW1DLEtBQUtDLE9BQXhDLENBQWQ7QUFDSDs7QUFFRDs7Ozs7Ozs7OztBQVVBSSxZQUFRQyxNQUFSLEVBQWdCQyxRQUFoQixFQUEwQk4sVUFBVSxFQUFwQyxFQUF3QztBQUFBOztBQUNwQztBQUFBLHlDQUFPLFdBQU1PLE9BQU4sRUFBaUI7QUFDcEIsc0JBQU1OLFVBQVVELFFBQVFDLE9BQVIsSUFBbUIsTUFBS0EsT0FBeEM7QUFDQSxzQkFBTUcsVUFBVSxNQUFLRixNQUFMLENBQVlNLFlBQVo7QUFBQSxrREFBeUIsV0FBTUQsT0FBTixFQUFpQjtBQUN0RDtBQUNBLDRCQUFJTixXQUFXQSxRQUFRUSxTQUF2QixFQUFrQztBQUM5QkYsc0NBQVVOLFFBQVFRLFNBQVIsQ0FBa0JGLE9BQWxCLEtBQThCQSxPQUF4QztBQUNIOztBQUVELDRCQUFJRyxHQUFKLEVBQVNDLFFBQVQ7QUFDQSw0QkFBSTtBQUNBQSx1Q0FBVyxNQUFNTixPQUFPTyxJQUFQLENBQVlMLE9BQVosQ0FBakI7QUFDSCx5QkFGRCxDQUVFLE9BQU9NLENBQVAsRUFBVTtBQUNSSCxrQ0FBTUcsQ0FBTjtBQUNIOztBQUVEO0FBQ0EsNEJBQUlaLFdBQVdBLFFBQVFhLFVBQXZCLEVBQW1DO0FBQy9CSCx1Q0FBV1YsUUFBUWEsVUFBUixDQUFtQkosR0FBbkIsRUFBd0JDLFFBQXhCLEtBQXFDQSxRQUFoRDtBQUNIOztBQUVELCtCQUFPQSxRQUFQO0FBQ0gscUJBbkJlOztBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQW1CYkwsUUFuQmEsRUFtQkhOLE9BbkJHLENBQWhCOztBQXFCQSx1QkFBTyxNQUFNSSxRQUFRVyxJQUFSLENBQWFSLE9BQWIsQ0FBYjtBQUNILGFBeEJEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBeUJIOztBQUVERCxhQUFTVSxRQUFULEVBQW1CO0FBQ2YsZUFBTyxLQUFLZCxNQUFMLENBQVlJLFFBQVosQ0FBcUJVLFFBQXJCLENBQVA7QUFDSDs7QUFFREMsZ0JBQVlELFFBQVosRUFBc0I7QUFDbEIsZUFBTyxLQUFLZCxNQUFMLENBQVllLFdBQVosQ0FBd0JELFFBQXhCLENBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7QUFjQUUsT0FBR0MsU0FBSCxFQUFjSCxRQUFkLEVBQXdCO0FBQ3BCLGVBQU8sS0FBS2QsTUFBTCxDQUFZZ0IsRUFBWixDQUFlQyxTQUFmLEVBQTBCSCxRQUExQixDQUFQO0FBQ0g7O0FBRURJLGFBQVM7QUFDTCxlQUFPLEtBQUtsQixNQUFMLENBQVlrQixNQUFaLEVBQVA7QUFDSDtBQWpHNEIsQztrQkFBWnZCLFciLCJmaWxlIjoiQnJha2VDbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCcmFrZXMgZnJvbSAnLi9CcmFrZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmFrZUNsaWVudCB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VydmljZU5hbWU6ICAgICAgICAgICAgICAgICBzdHJpbmcgdG8gdXNlIGZvciBuYW1lIG9mIGNpcmN1aXQuIFRoaXMgaXMgbW9zdGx5IHVzZWQgZm9yIHJlcG9ydGluZyBvbiBzdGF0cy5cbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oYW5kbGVyLnByZUhhbmRsZVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXIucG9zdEhhbmRsZVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmdyb3VwOiAgICAgICAgICAgICAgIHN0cmluZyB0byB1c2UgZm9yIGdyb3VwIG9mIGNpcmN1aXQuIFRoaXMgaXMgbW9zdGx5IHVzZWQgZm9yIHJlcG9ydGluZyBvbiBzdGF0cy5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5idWNrZXRTcGFuOiAgICAgICAgICB0aW1lIGluIG1zIHRoYXQgYSBzcGVjaWZpYyBidWNrZXQgc2hvdWxkIHJlbWFpbiBhY3RpdmVcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5zdGF0SW50ZXJ2YWw6ICAgICAgICBpbnRlcnZhbCBpbiBtcyB0aGF0IGJyYWtlcyBzaG91bGQgZW1pdCBhIHNuYXBzaG90IGV2ZW50XG4gICAgICogQHBhcmFtIG9wdGlvbnMucGVyY2VudGlsZXM6ICAgICAgICAgYXJyYXk8bnVtYmVyPiB0aGF0IGRlZmluZXMgdGhlIHBlcmNlbnRpbGUgbGV2ZWxzIHRoYXQgc2hvdWxkIGJlIGNhbGN1bGF0ZWQgb24gdGhlIHN0YXRzIG9iamVjdCAoaS5lLiAwLjkgZm9yIDkwdGggcGVyY2VudGlsZSlcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5idWNrZXROdW06ICAgICAgICAgICAjIG9mIGJ1Y2tldHMgdG8gcmV0YWluIGluIGEgcm9sbGluZyB3aW5kb3dcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5jaXJjdWl0RHVyYXRpb246ICAgICB0aW1lIGluIG1zIHRoYXQgYSBjaXJjdWl0IHNob3VsZCByZW1haW4gYnJva2VuXG4gICAgICogQHBhcmFtIG9wdGlvbnMud2FpdFRocmVzaG9sZDogICAgICAgbnVtYmVyIG9mIHJlcXVlc3RzIHRvIHdhaXQgYmVmb3JlIHRlc3RpbmcgY2lyY3VpdCBoZWFsdGhcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50aHJlc2hvbGQ6ICAgICAgICAgICAlIHRocmVzaG9sZCBmb3Igc3VjY2Vzc2Z1bCBjYWxscy4gSWYgdGhlICUgb2Ygc3VjY2Vzc2Z1bCBjYWxscyBkaXBzIGJlbG93IHRoaXMgdGhyZXNob2xkIHRoZSBjaXJjdWl0IHdpbGwgYnJlYWtcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy50aW1lb3V0OiAgICAgICAgICAgICB0aW1lIGluIG1zIGJlZm9yZSBhIHNlcnZpY2UgY2FsbCB3aWxsIHRpbWVvdXRcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5pc0ZhaWx1cmU6ICAgICAgICAgICBmdW5jdGlvbiB0aGF0IHJldHVybnMgdHJ1ZSBpZiBhbiBlcnJvciBzaG91bGQgYmUgY29uc2lkZXJlZCBhIGZhaWx1cmUgKHJlY2VpdmVzIHRoZSBlcnJvciBvYmplY3QgcmV0dXJuZWQgYnkgeW91ciBjb21tYW5kLikgVGhpcyBhbGxvd3MgZm9yIG5vbi1jcml0aWNhbCBlcnJvcnMgdG8gYmUgaWdub3JlZCBieSB0aGUgY2lyY3VpdCBicmVha2VyXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGVhbHRoQ2hlY2tJbnRlcnZhbDogdGltZSBpbiBtcyBpbnRlcnZhbCBiZXR3ZWVuIGVhY2ggZXhlY3V0aW9uIG9mIGhlYWx0aCBjaGVjayBmdW5jdGlvblxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhlYWx0aENoZWNrOiAgICAgICAgIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIHRoZSBoZWFsdGggY2hlY2sgKGNhbiBiZSBkZWZpbmVkIGFsc28gd2l0aCBjYWxsaW5nIGhlYWx0aENoZWNrIGZ1bmN0aW9uKVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmZhbGxiYWNrOiAgICAgICAgICAgIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGZhbGxiYWNrIChjYW4gYmUgZGVmaW5lZCBhbHNvIHdpdGggY2FsbGluZyBmYWxsYmFjayBmdW5jdGlvbilcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5pc1Byb21pc2U6ICAgICAgICAgICBib29sZWFuIHRvIG9wdCBvdXQgb2YgY2hlY2sgZm9yIGNhbGxiYWNrIGluIGZ1bmN0aW9uLiBUaGlzIGFmZmVjdHMgdGhlIHBhc3NlZCBpbiBmdW5jdGlvbiwgaGVhbHRoIGNoZWNrIGFuZCBmYWxsYmFja1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmlzRnVuY3Rpb246ICAgICAgICAgIGJvb2xlYW4gdG8gb3B0IG91dCBvZiBjaGVjayBmb3IgY2FsbGJhY2ssIGFsd2F5cyBwcm9taXNpZnlpbmcgaW4gZnVuY3Rpb24uIFRoaXMgYWZmZWN0cyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uLCBoZWFsdGggY2hlY2sgYW5kIGZhbGxiYWNrXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2VydmljZU5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLnNlcnZpY2VOYW1lID0gc2VydmljZU5hbWU7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuaGFuZGxlciA9IG9wdGlvbnMuaGFuZGxlcjtcbiAgICAgICAgdGhpcy5icmFrZXMgPSBCcmFrZXMuZ2V0QnJha2VzKHRoaXMuc2VydmljZU5hbWUsIHRoaXMub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2xpZW50XG4gICAgICogQHBhcmFtIGZhbGxiYWNrXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oYW5kbGVyXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlci5wcmVIYW5kbGVcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oYW5kbGVyLnBvc3RIYW5kbGVcbiAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbigqPSl9XG4gICAgICovXG4gICAgY2lyY3VpdChjbGllbnQsIGZhbGxiYWNrLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIHJlcXVlc3QgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG9wdGlvbnMuaGFuZGxlciB8fCB0aGlzLmhhbmRsZXI7XG4gICAgICAgICAgICBjb25zdCBjaXJjdWl0ID0gdGhpcy5icmFrZXMuc2xhdmVDaXJjdWl0KGFzeW5jIHJlcXVlc3QgPT4ge1xuICAgICAgICAgICAgICAgIC8vcHJlIGhhbmRsZSByZXF1ZXN0XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIgJiYgaGFuZGxlci5wcmVIYW5kbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdCA9IGhhbmRsZXIucHJlSGFuZGxlKHJlcXVlc3QpIHx8IHJlcXVlc3Q7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGVyciwgcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjbGllbnQuc2VuZChyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVyciA9IGU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9wb3N0IGhhbmRsZSByZXNwb25zZVxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVyICYmIGhhbmRsZXIucG9zdEhhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGhhbmRsZXIucG9zdEhhbmRsZShlcnIsIHJlc3BvbnNlKSB8fCByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9LCBmYWxsYmFjaywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBjaXJjdWl0LmV4ZWMocmVxdWVzdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5icmFrZXMuZmFsbGJhY2soY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGhlYWx0aENoZWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJyYWtlcy5oZWFsdGhDaGVjayhjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lXG4gICAgICogICAgICBleGVjOiAgICAgICAgICAgICAgRXZlbnQgb24gcmVxdWVzdCBzdGFydFxuICAgICAqICAgICAgZmFpbHVyZTogICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3QgZmFpbHVyZVxuICAgICAqICAgICAgc3VjY2VzczogICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3Qgc3VjY2Vzc1xuICAgICAqICAgICAgdGltZW91dDogICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3QgdGltZW91dFxuICAgICAqICAgICAgY2lyY3VpdENsb3NlZDogICAgIEV2ZW50IGZpcmVkIHdoZW4gY2lyY3VpdCBpcyBjbG9zZWRcbiAgICAgKiAgICAgIGNpcmN1aXRPcGVuOiAgICAgICBFdmVudCBmaXJlZCB3aGVuIGNpcmN1aXQgaXMgb3BlblxuICAgICAqICAgICAgc25hcHNob3Q6ICAgICAgICAgIEV2ZW50IGZpcmVkIG9uIHN0YXRzIHNuYXBzaG90XG4gICAgICogICAgICBoZWFsdGhDaGVja0ZhaWxlZDogRXZlbnQgZmlyZWQgb24gZmFpbHVyZSBvZiBlYWNoIGhlYWx0aCBjaGVjayBleGVjdXRpb25cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIG9uKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJha2VzLm9uKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGlzT3BlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJha2VzLmlzT3BlbigpO1xuICAgIH1cbn0iXX0=