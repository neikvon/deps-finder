'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var acorn = _interopDefault(require('acorn'));
var estreeWalker = require('estree-walker');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Parser = function () {
  function Parser(source, options) {
    classCallCheck(this, Parser);

    this.dependencies = [];
    this.localDependencies = [];
    this.globalDependencies = [];
    this.options = merge({ sourceType: 'module' }, options || {});

    this.ast = acorn.parse(source, this.options);
  }

  createClass(Parser, [{
    key: 'getDeps',
    value: function getDeps() {
      var _this = this;

      estreeWalker.walk(this.ast, {
        enter: function enter(node, parent) {
          // import
          if (node.type === 'ImportDeclaration') {
            _this.dependencies.push(node.source.value);
          }

          // require
          if (node.type === 'CallExpression' && node.callee.name === 'require') {
            _this.dependencies.push(node.arguments[0].value);
          }
        }
      });

      return this.dependencies;
    }
  }, {
    key: 'splitDeps',
    value: function splitDeps() {
      var _this2 = this;

      if (!this.dependencies.length) {
        this.getDependencies();
      }

      this.dependencies.map(function (item) {
        if (/^\.?\.\//.test(item)) {
          // local
          _this2.localDependencies.push(item);
        } else {
          _this2.globalDependencies.push(item);
        }
      });

      return {
        local: this.localDependencies,
        thirdparty: this.globalDependencies
      };
    }
  }]);
  return Parser;
}();

function merge(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
    for (var p in source) {
      if (_typeof(source[p]) === 'object') {
        target[p] = target[p] || (Array.isArray(source[p]) ? [] : {});
        merge(target[p], source[p]);
      } else {
        target[p] = source[p];
      }
    }
  });
  return target;
}

module.exports = Parser;