'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Exception
 */
let Exception = class Exception {
    constructor(id, message = '', exception, code) {
        this.code = code || 400;
        this.id = id;
        if (exception && exception.message) {
            this.message = message + ' The exception message is ' + exception.message;
        } else {
            this.message = message;
        }
        this.exception = exception;
    }
};
exports.default = Exception;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeGNlcHRpb24uanMiXSwibmFtZXMiOlsiRXhjZXB0aW9uIiwiY29uc3RydWN0b3IiLCJpZCIsIm1lc3NhZ2UiLCJleGNlcHRpb24iLCJjb2RlIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7SUFHcUJBLFMsR0FBTixNQUFNQSxTQUFOLENBQWdCO0FBQzNCQyxnQkFBWUMsRUFBWixFQUFnQkMsVUFBVSxFQUExQixFQUE4QkMsU0FBOUIsRUFBeUNDLElBQXpDLEVBQStDO0FBQzNDLGFBQUtBLElBQUwsR0FBWUEsUUFBUSxHQUFwQjtBQUNBLGFBQUtILEVBQUwsR0FBVUEsRUFBVjtBQUNBLFlBQUlFLGFBQWFBLFVBQVVELE9BQTNCLEVBQW9DO0FBQ2hDLGlCQUFLQSxPQUFMLEdBQWVBLFVBQVUsNEJBQVYsR0FBeUNDLFVBQVVELE9BQWxFO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUNIO0FBQ0QsYUFBS0MsU0FBTCxHQUFpQkEsU0FBakI7QUFDSDtBQVYwQixDO2tCQUFWSixTIiwiZmlsZSI6IkV4Y2VwdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRXhjZXB0aW9uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4Y2VwdGlvbiB7XG4gICAgY29uc3RydWN0b3IoaWQsIG1lc3NhZ2UgPSAnJywgZXhjZXB0aW9uLCBjb2RlKSB7XG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGUgfHwgNDAwO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIGlmIChleGNlcHRpb24gJiYgZXhjZXB0aW9uLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgKyAnIFRoZSBleGNlcHRpb24gbWVzc2FnZSBpcyAnICsgZXhjZXB0aW9uLm1lc3NhZ2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXhjZXB0aW9uID0gZXhjZXB0aW9uO1xuICAgIH1cbn0iXX0=