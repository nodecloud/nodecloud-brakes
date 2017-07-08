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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcmFrZUNsaWVudC5qcyJdLCJuYW1lcyI6WyJCcmFrZXMiLCJCcmFrZUNsaWVudCIsImNvbnN0cnVjdG9yIiwic2VydmljZU5hbWUiLCJvcHRpb25zIiwiaGFuZGxlciIsImJyYWtlcyIsImdldEJyYWtlcyIsImNpcmN1aXQiLCJjbGllbnQiLCJmYWxsYmFjayIsInJlcXVlc3QiLCJzbGF2ZUNpcmN1aXQiLCJwcmVIYW5kbGUiLCJlcnIiLCJyZXNwb25zZSIsInNlbmQiLCJlIiwicG9zdEhhbmRsZSIsImV4ZWMiLCJoZWFsdGhDaGVjayIsImNhbGxiYWNrIiwib24iLCJldmVudE5hbWUiLCJpc09wZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7SUFBWUEsTTs7Ozs7O0lBRVNDLFcsR0FBTixNQUFNQSxXQUFOLENBQWtCO0FBQzdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQUMsZ0JBQVlDLFdBQVosRUFBeUJDLFVBQVUsRUFBbkMsRUFBdUM7QUFDbkMsYUFBS0QsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxhQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxhQUFLQyxPQUFMLEdBQWVELFFBQVFDLE9BQXZCO0FBQ0EsYUFBS0MsTUFBTCxHQUFjTixPQUFPTyxTQUFQLENBQWlCLEtBQUtKLFdBQXRCLEVBQW1DLEtBQUtDLE9BQXhDLENBQWQ7QUFDSDs7QUFFRDs7Ozs7Ozs7OztBQVVBSSxZQUFRQyxNQUFSLEVBQWdCQyxRQUFoQixFQUEwQk4sVUFBVSxFQUFwQyxFQUF3QztBQUFBOztBQUNwQztBQUFBLHlDQUFPLFdBQU1PLE9BQU4sRUFBaUI7QUFDcEIsc0JBQU1OLFVBQVVELFFBQVFDLE9BQVIsSUFBbUIsTUFBS0EsT0FBeEM7QUFDQSxzQkFBTUcsVUFBVSxNQUFLRixNQUFMLENBQVlNLFlBQVo7QUFBQSxrREFBeUIsV0FBTUQsT0FBTixFQUFpQjtBQUN0RDtBQUNBLDRCQUFJTixXQUFXQSxRQUFRUSxTQUF2QixFQUFrQztBQUM5QkYsc0NBQVVOLFFBQVFRLFNBQVIsQ0FBa0JGLE9BQWxCLEtBQThCQSxPQUF4QztBQUNIOztBQUVELDRCQUFJRyxHQUFKLEVBQVNDLFFBQVQ7QUFDQSw0QkFBSTtBQUNBQSx1Q0FBVyxNQUFNTixPQUFPTyxJQUFQLENBQVlMLE9BQVosQ0FBakI7QUFDSCx5QkFGRCxDQUVFLE9BQU9NLENBQVAsRUFBVTtBQUNSSCxrQ0FBTUcsQ0FBTjtBQUNIOztBQUVEO0FBQ0EsNEJBQUlaLFdBQVdBLFFBQVFhLFVBQXZCLEVBQW1DO0FBQy9CSCx1Q0FBV1YsUUFBUWEsVUFBUixDQUFtQkosR0FBbkIsRUFBd0JDLFFBQXhCLEtBQXFDQSxRQUFoRDtBQUNIOztBQUVELCtCQUFPQSxRQUFQO0FBQ0gscUJBbkJlOztBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQW1CYkwsUUFuQmEsRUFtQkhOLE9BbkJHLENBQWhCOztBQXFCQSx1QkFBTyxNQUFNSSxRQUFRVyxJQUFSLENBQWFSLE9BQWIsQ0FBYjtBQUNILGFBeEJEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBeUJIOztBQUVEUyxnQkFBWUMsUUFBWixFQUFzQjtBQUNsQixlQUFPLEtBQUtmLE1BQUwsQ0FBWWMsV0FBWixDQUF3QkMsUUFBeEIsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7OztBQWNBQyxPQUFHQyxTQUFILEVBQWNGLFFBQWQsRUFBd0I7QUFDcEIsZUFBTyxLQUFLZixNQUFMLENBQVlnQixFQUFaLENBQWVDLFNBQWYsRUFBMEJGLFFBQTFCLENBQVA7QUFDSDs7QUFFREcsYUFBUztBQUNMLGVBQU8sS0FBS2xCLE1BQUwsQ0FBWWtCLE1BQVosRUFBUDtBQUNIO0FBN0Y0QixDO2tCQUFadkIsVyIsImZpbGUiOiJCcmFrZUNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEJyYWtlcyBmcm9tICcuL0JyYWtlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyYWtlQ2xpZW50IHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZXJ2aWNlTmFtZTogICAgICAgICAgICAgICAgIHN0cmluZyB0byB1c2UgZm9yIG5hbWUgb2YgY2lyY3VpdC4gVGhpcyBpcyBtb3N0bHkgdXNlZCBmb3IgcmVwb3J0aW5nIG9uIHN0YXRzLlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlclxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXIucHJlSGFuZGxlXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGFuZGxlci5wb3N0SGFuZGxlXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZ3JvdXA6ICAgICAgICAgICAgICAgc3RyaW5nIHRvIHVzZSBmb3IgZ3JvdXAgb2YgY2lyY3VpdC4gVGhpcyBpcyBtb3N0bHkgdXNlZCBmb3IgcmVwb3J0aW5nIG9uIHN0YXRzLlxuICAgICAqIEBwYXJhbSBvcHRpb25zLmJ1Y2tldFNwYW46ICAgICAgICAgIHRpbWUgaW4gbXMgdGhhdCBhIHNwZWNpZmljIGJ1Y2tldCBzaG91bGQgcmVtYWluIGFjdGl2ZVxuICAgICAqIEBwYXJhbSBvcHRpb25zLnN0YXRJbnRlcnZhbDogICAgICAgIGludGVydmFsIGluIG1zIHRoYXQgYnJha2VzIHNob3VsZCBlbWl0IGEgc25hcHNob3QgZXZlbnRcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5wZXJjZW50aWxlczogICAgICAgICBhcnJheTxudW1iZXI+IHRoYXQgZGVmaW5lcyB0aGUgcGVyY2VudGlsZSBsZXZlbHMgdGhhdCBzaG91bGQgYmUgY2FsY3VsYXRlZCBvbiB0aGUgc3RhdHMgb2JqZWN0IChpLmUuIDAuOSBmb3IgOTB0aCBwZXJjZW50aWxlKVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmJ1Y2tldE51bTogICAgICAgICAgICMgb2YgYnVja2V0cyB0byByZXRhaW4gaW4gYSByb2xsaW5nIHdpbmRvd1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmNpcmN1aXREdXJhdGlvbjogICAgIHRpbWUgaW4gbXMgdGhhdCBhIGNpcmN1aXQgc2hvdWxkIHJlbWFpbiBicm9rZW5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucy53YWl0VGhyZXNob2xkOiAgICAgICBudW1iZXIgb2YgcmVxdWVzdHMgdG8gd2FpdCBiZWZvcmUgdGVzdGluZyBjaXJjdWl0IGhlYWx0aFxuICAgICAqIEBwYXJhbSBvcHRpb25zLnRocmVzaG9sZDogICAgICAgICAgICUgdGhyZXNob2xkIGZvciBzdWNjZXNzZnVsIGNhbGxzLiBJZiB0aGUgJSBvZiBzdWNjZXNzZnVsIGNhbGxzIGRpcHMgYmVsb3cgdGhpcyB0aHJlc2hvbGQgdGhlIGNpcmN1aXQgd2lsbCBicmVha1xuICAgICAqIEBwYXJhbSBvcHRpb25zLnRpbWVvdXQ6ICAgICAgICAgICAgIHRpbWUgaW4gbXMgYmVmb3JlIGEgc2VydmljZSBjYWxsIHdpbGwgdGltZW91dFxuICAgICAqIEBwYXJhbSBvcHRpb25zLmlzRmFpbHVyZTogICAgICAgICAgIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0cnVlIGlmIGFuIGVycm9yIHNob3VsZCBiZSBjb25zaWRlcmVkIGEgZmFpbHVyZSAocmVjZWl2ZXMgdGhlIGVycm9yIG9iamVjdCByZXR1cm5lZCBieSB5b3VyIGNvbW1hbmQuKSBUaGlzIGFsbG93cyBmb3Igbm9uLWNyaXRpY2FsIGVycm9ycyB0byBiZSBpZ25vcmVkIGJ5IHRoZSBjaXJjdWl0IGJyZWFrZXJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oZWFsdGhDaGVja0ludGVydmFsOiB0aW1lIGluIG1zIGludGVydmFsIGJldHdlZW4gZWFjaCBleGVjdXRpb24gb2YgaGVhbHRoIGNoZWNrIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaGVhbHRoQ2hlY2s6ICAgICAgICAgZnVuY3Rpb24gdG8gY2FsbCBmb3IgdGhlIGhlYWx0aCBjaGVjayAoY2FuIGJlIGRlZmluZWQgYWxzbyB3aXRoIGNhbGxpbmcgaGVhbHRoQ2hlY2sgZnVuY3Rpb24pXG4gICAgICogQHBhcmFtIG9wdGlvbnMuZmFsbGJhY2s6ICAgICAgICAgICAgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZmFsbGJhY2sgKGNhbiBiZSBkZWZpbmVkIGFsc28gd2l0aCBjYWxsaW5nIGZhbGxiYWNrIGZ1bmN0aW9uKVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmlzUHJvbWlzZTogICAgICAgICAgIGJvb2xlYW4gdG8gb3B0IG91dCBvZiBjaGVjayBmb3IgY2FsbGJhY2sgaW4gZnVuY3Rpb24uIFRoaXMgYWZmZWN0cyB0aGUgcGFzc2VkIGluIGZ1bmN0aW9uLCBoZWFsdGggY2hlY2sgYW5kIGZhbGxiYWNrXG4gICAgICogQHBhcmFtIG9wdGlvbnMuaXNGdW5jdGlvbjogICAgICAgICAgYm9vbGVhbiB0byBvcHQgb3V0IG9mIGNoZWNrIGZvciBjYWxsYmFjaywgYWx3YXlzIHByb21pc2lmeWluZyBpbiBmdW5jdGlvbi4gVGhpcyBhZmZlY3RzIHRoZSBwYXNzZWQgaW4gZnVuY3Rpb24sIGhlYWx0aCBjaGVjayBhbmQgZmFsbGJhY2tcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzZXJ2aWNlTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuc2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5oYW5kbGVyID0gb3B0aW9ucy5oYW5kbGVyO1xuICAgICAgICB0aGlzLmJyYWtlcyA9IEJyYWtlcy5nZXRCcmFrZXModGhpcy5zZXJ2aWNlTmFtZSwgdGhpcy5vcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbGllbnRcbiAgICAgKiBAcGFyYW0gZmFsbGJhY2tcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucy5oYW5kbGVyLnByZUhhbmRsZVxuICAgICAqIEBwYXJhbSBvcHRpb25zLmhhbmRsZXIucG9zdEhhbmRsZVxuICAgICAqIEByZXR1cm4ge2Z1bmN0aW9uKCo9KX1cbiAgICAgKi9cbiAgICBjaXJjdWl0KGNsaWVudCwgZmFsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gYXN5bmMgcmVxdWVzdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gb3B0aW9ucy5oYW5kbGVyIHx8IHRoaXMuaGFuZGxlcjtcbiAgICAgICAgICAgIGNvbnN0IGNpcmN1aXQgPSB0aGlzLmJyYWtlcy5zbGF2ZUNpcmN1aXQoYXN5bmMgcmVxdWVzdCA9PiB7XG4gICAgICAgICAgICAgICAgLy9wcmUgaGFuZGxlIHJlcXVlc3RcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlciAmJiBoYW5kbGVyLnByZUhhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ID0gaGFuZGxlci5wcmVIYW5kbGUocmVxdWVzdCkgfHwgcmVxdWVzdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgZXJyLCByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNsaWVudC5zZW5kKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyID0gZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL3Bvc3QgaGFuZGxlIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIgJiYgaGFuZGxlci5wb3N0SGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gaGFuZGxlci5wb3N0SGFuZGxlKGVyciwgcmVzcG9uc2UpIHx8IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0sIGZhbGxiYWNrLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGNpcmN1aXQuZXhlYyhyZXF1ZXN0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhlYWx0aENoZWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJyYWtlcy5oZWFsdGhDaGVjayhjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lXG4gICAgICogICAgICBleGVjOiAgICAgICAgICAgICAgRXZlbnQgb24gcmVxdWVzdCBzdGFydFxuICAgICAqICAgICAgZmFpbHVyZTogICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3QgZmFpbHVyZVxuICAgICAqICAgICAgc3VjY2VzczogICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3Qgc3VjY2Vzc1xuICAgICAqICAgICAgdGltZW91dDogICAgICAgICAgIEV2ZW50IG9uIHJlcXVlc3QgdGltZW91dFxuICAgICAqICAgICAgY2lyY3VpdENsb3NlZDogICAgIEV2ZW50IGZpcmVkIHdoZW4gY2lyY3VpdCBpcyBjbG9zZWRcbiAgICAgKiAgICAgIGNpcmN1aXRPcGVuOiAgICAgICBFdmVudCBmaXJlZCB3aGVuIGNpcmN1aXQgaXMgb3BlblxuICAgICAqICAgICAgc25hcHNob3Q6ICAgICAgICAgIEV2ZW50IGZpcmVkIG9uIHN0YXRzIHNuYXBzaG90XG4gICAgICogICAgICBoZWFsdGhDaGVja0ZhaWxlZDogRXZlbnQgZmlyZWQgb24gZmFpbHVyZSBvZiBlYWNoIGhlYWx0aCBjaGVjayBleGVjdXRpb25cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIG9uKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJha2VzLm9uKGV2ZW50TmFtZSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGlzT3BlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJha2VzLmlzT3BlbigpO1xuICAgIH1cbn0iXX0=