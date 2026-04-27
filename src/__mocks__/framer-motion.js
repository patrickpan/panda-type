const React = require('react');

const motion = new Proxy(
  {},
  {
    get: (_, tag) =>
      ({ children, initial, animate, exit, transition, whileHover, whileTap, ...rest }) =>
        React.createElement(tag, rest, children),
  }
);

const AnimatePresence = ({ children }) =>
  React.createElement(React.Fragment, null, children ?? null);

module.exports = { motion, AnimatePresence };
