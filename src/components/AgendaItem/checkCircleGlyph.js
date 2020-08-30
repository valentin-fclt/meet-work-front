/* eslint-disable */

const _react = _interopRequireDefault(require("react"));

const _Icon = _interopRequireDefault(
  require("@atlaskit/icon/cjs/components/Icon")
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

const CheckCircleIcon = function CheckCircleIcon(props) {
  return _react.default.createElement(_Icon.default, {
    dangerouslySetGlyph:
      '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill-rule="evenodd"><circle stroke="#DFE1E6" stroke-width="2" fill="currentColor" cx="12" cy="12" r="10"/><path d="M9.707 11.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z" fill="inherit"/></g></svg>',
    ...props,
  });
};

CheckCircleIcon.displayName = "CheckCircleIcon";
export default CheckCircleIcon;
