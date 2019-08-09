"use strict";

require("babel-polyfill");

var _express = _interopRequireDefault(require("express"));

var fs = _interopRequireWildcard(require("fs"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _leaderboard = _interopRequireDefault(require("./leaderboard"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Create server
var app = (0, _express.default)(); // Specifically enable CORS for pre-flight options requests

app.options('*', (0, _cors.default)()); // Enable body parsers for reading POST data. We set up this app to 
// accept JSON bodies and x-www-form-urlencoded bodies. If you wanted to
// process other request tpes, like form-data or graphql, you would need
// to include the appropriate parser middlewares here.

app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  limit: '2mb',
  extended: true
})); // CORS allows these API routes to be requested directly by browsers

app.use((0, _cors.default)()); // Disable caching

app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}); // Enable routes we want to use

(0, _leaderboard.default)(app); // Start server

app.listen(process.env.PORT || 3333, null,
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(err) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (err) {
              console.log(err.message);
            }

            console.log('[koji] backend started');

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());