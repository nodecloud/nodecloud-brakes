'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getBrakes = getBrakes;

var _brakes = require('brakes');

var _brakes2 = _interopRequireDefault(_brakes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get a brakes.
 *
 * @param name
 * @param options
 * @return {*|Brakes}
 */
function getBrakes(name, options = {}) {
    return new _brakes2.default(_extends({
        name: name
    }, options));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CcmFrZXMuanMiXSwibmFtZXMiOlsiZ2V0QnJha2VzIiwibmFtZSIsIm9wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBVWdCQSxTLEdBQUFBLFM7O0FBVmhCOzs7Ozs7QUFHQTs7Ozs7OztBQU9PLFNBQVNBLFNBQVQsQ0FBbUJDLElBQW5CLEVBQXlCQyxVQUFVLEVBQW5DLEVBQXVDO0FBQzFDLFdBQU87QUFDSEQsY0FBTUE7QUFESCxPQUVBQyxPQUZBLEVBQVA7QUFJSCIsImZpbGUiOiJCcmFrZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnJha2VzIGZyb20gJ2JyYWtlcyc7XG5cblxuLyoqXG4gKiBHZXQgYSBicmFrZXMuXG4gKlxuICogQHBhcmFtIG5hbWVcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcmV0dXJuIHsqfEJyYWtlc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEJyYWtlcyhuYW1lLCBvcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IEJyYWtlcyh7XG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIC4uLm9wdGlvbnNcbiAgICB9KTtcbn0iXX0=