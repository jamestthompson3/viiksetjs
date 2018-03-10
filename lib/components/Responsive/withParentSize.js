'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral([''], ['']);

exports.default = withParentSize;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSizeme = require('react-sizeme');

var _reactSizeme2 = _interopRequireDefault(_reactSizeme);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Container = _styledComponents2.default.div.attrs({
  style: function style(_ref) {
    var x = _ref.x;
    return {
      width: '100%',
      height: '100%',
      position: x ? 'static' : 'relative'
    };
  }
})(_templateObject);
function withParentSize(BaseComponent) {
  var WrappedComponent = function (_React$PureComponent) {
    _inherits(WrappedComponent, _React$PureComponent);

    function WrappedComponent() {
      _classCallCheck(this, WrappedComponent);

      return _possibleConstructorReturn(this, (WrappedComponent.__proto__ || Object.getPrototypeOf(WrappedComponent)).apply(this, arguments));
    }

    _createClass(WrappedComponent, [{
      key: 'render',
      value: function render() {
        var _this2 = this;

        var x = this.props.x;

        return _react2.default.createElement(
          Container,
          {
            innerRef: function innerRef(ref) {
              _this2.container = ref;
            },
            x: x
          },
          _react2.default.createElement(BaseComponent, this.props)
        );
      }
    }]);

    return WrappedComponent;
  }(_react2.default.PureComponent);

  return (0, _reactSizeme2.default)({ monitorHeight: true, refreshMode: 'debounce', refreshRate: 100 })(WrappedComponent);
}