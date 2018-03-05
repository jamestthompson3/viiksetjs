var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  width: 100%;\n  height: 100%;\n'], ['\n  width: 100%;\n  height: 100%;\n']);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import sizeMe from 'react-sizeme';
import styled from 'styled-components';

var Container = styled.div(_templateObject);

export default function withParentSize(BaseComponent) {
  var WrappedComponent = function (_React$Component) {
    _inherits(WrappedComponent, _React$Component);

    function WrappedComponent() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, WrappedComponent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WrappedComponent.__proto__ || Object.getPrototypeOf(WrappedComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        parentWidth: null,
        parentHeight: null
      }, _this.resize = function () {
        if (_this.container) {
          var boundingRect = _this.container.getBoundingClientRect();
          _this.setState({
            parentWidth: boundingRect.width,
            parentHeight: boundingRect.height
          });
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(WrappedComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.resize();
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps) {
        if (prevProps.size.width !== this.props.size.width || prevProps.size.height !== this.props.size.height) {
          this.resize();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _state = this.state,
            parentWidth = _state.parentWidth,
            parentHeight = _state.parentHeight;

        return React.createElement(
          Container,
          {
            innerRef: function innerRef(ref) {
              _this2.container = ref;
            }
          },
          parentWidth !== null && parentHeight !== null && React.createElement(BaseComponent, _extends({ size: { width: parentWidth, height: parentHeight } }, this.props))
        );
      }
    }]);

    return WrappedComponent;
  }(React.Component);

  return sizeMe({ monitorHeight: true, refreshMode: 'debounce' })(WrappedComponent);
}