'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _Exception = require('./Exception');

var _Exception2 = _interopRequireDefault(_Exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ExternalException = class ExternalException extends _Exception2.default {
    constructor(id, message, exception) {
        super(id, message, exception);
        this.code = 500;
    }
};
exports.default = ExternalException;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeHRlcm5hbEV4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6WyJFeHRlcm5hbEV4Y2VwdGlvbiIsImNvbnN0cnVjdG9yIiwiaWQiLCJtZXNzYWdlIiwiZXhjZXB0aW9uIiwiY29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7SUFFcUJBLGlCLEdBQU4sTUFBTUEsaUJBQU4sNkJBQTBDO0FBQ3JEQyxnQkFBWUMsRUFBWixFQUFnQkMsT0FBaEIsRUFBeUJDLFNBQXpCLEVBQW9DO0FBQ2hDLGNBQU1GLEVBQU4sRUFBVUMsT0FBVixFQUFtQkMsU0FBbkI7QUFDQSxhQUFLQyxJQUFMLEdBQVksR0FBWjtBQUNIO0FBSm9ELEM7a0JBQXBDTCxpQiIsImZpbGUiOiJFeHRlcm5hbEV4Y2VwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi9FeGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHRlcm5hbEV4Y2VwdGlvbiBleHRlbmRzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoaWQsIG1lc3NhZ2UsIGV4Y2VwdGlvbikge1xuICAgICAgICBzdXBlcihpZCwgbWVzc2FnZSwgZXhjZXB0aW9uKTtcbiAgICAgICAgdGhpcy5jb2RlID0gNTAwO1xuICAgIH1cbn0iXX0=