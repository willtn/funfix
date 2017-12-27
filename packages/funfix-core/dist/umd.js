(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.funfixCore = {})));
}(this, (function (exports) { 'use strict';

function isValueObject(ref) {
    return !!(ref && typeof ref.equals === "function" && typeof ref.hashCode === "function");
}

function is(lh, rh) {
    if (lh === rh || lh !== lh && rh !== rh) {
        return true;
    }
    if (!lh || !rh) {
        return false;
    }

    if (typeof lh.valueOf === "function" && typeof rh.valueOf === "function") {
        var lh2 = lh.valueOf();
        var rh2 = rh.valueOf();
        if (lh2 === rh2 || lh2 !== lh2 && rh2 !== rh2) {
            return true;
        }
        if (!lh2 || !rh2) {
            return false;
        }
    }

    return !!(isValueObject(lh) && lh.equals(rh));
}

function equals(lh, rh) {
    return is(lh, rh);
}

function hashCode(ref) {
    if (typeof ref === "number") {
        return ref & ref;
    }

    if (typeof ref.valueOf === "function") {
        var v = ref.valueOf();
        if (v !== ref) return hashCode(v);
    }
    if (isValueObject(ref)) {
        return ref.hashCode();
    }
    return hashCodeOfString(String(ref));
}

function hashCodeOfString(str) {
    var hash = 0;

    if (str == null || str.length === 0) return hash;
    for (var i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = (hash << 5) - hash + character;
        hash = hash & hash;
    }
    return hash;
}

function id(a) {
    return a;
}

function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            if (!derivedCtor.prototype[name]) derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





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









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var CompositeError = function (_Error) {
    inherits(CompositeError, _Error);

    function CompositeError(errors) {
        classCallCheck(this, CompositeError);

        var reasons = "";
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = errors.slice(0, 2)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var e = _step.value;

                var message = "";
                if (e instanceof Error) {
                    message = e.name + "(" + e.message + ")";
                } else {
                    message = "" + e;
                }
                reasons += ", " + message;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        reasons = reasons.slice(2);
        if (errors.length > 2) reasons = reasons + ", ...";

        var _this = possibleConstructorReturn(this, (CompositeError.__proto__ || Object.getPrototypeOf(CompositeError)).call(this, reasons));

        _this.name = "CompositeError";
        _this.errorsRef = errors;

        var self = _this;
        self.constructor = CompositeError;
        self.__proto__ = CompositeError.prototype;
        return _this;
    }

    createClass(CompositeError, [{
        key: "errors",
        value: function errors() {
            return this.errorsRef.slice();
        }
    }]);
    return CompositeError;
}(Error);

var DummyError = function (_Error2) {
    inherits(DummyError, _Error2);

    function DummyError(message) {
        classCallCheck(this, DummyError);

        var _this2 = possibleConstructorReturn(this, (DummyError.__proto__ || Object.getPrototypeOf(DummyError)).call(this, message));

        _this2.name = "DummyError";

        var self = _this2;
        self.constructor = DummyError;
        self.__proto__ = DummyError.prototype;
        return _this2;
    }

    return DummyError;
}(Error);

var NoSuchElementError = function (_Error3) {
    inherits(NoSuchElementError, _Error3);

    function NoSuchElementError(message) {
        classCallCheck(this, NoSuchElementError);

        var _this3 = possibleConstructorReturn(this, (NoSuchElementError.__proto__ || Object.getPrototypeOf(NoSuchElementError)).call(this, message));

        _this3.name = "NoSuchElementError";

        var self = _this3;
        self.constructor = NoSuchElementError;
        self.__proto__ = NoSuchElementError.prototype;
        return _this3;
    }

    return NoSuchElementError;
}(Error);

var IllegalInheritanceError = function (_Error4) {
    inherits(IllegalInheritanceError, _Error4);

    function IllegalInheritanceError(message) {
        classCallCheck(this, IllegalInheritanceError);

        var _this4 = possibleConstructorReturn(this, (IllegalInheritanceError.__proto__ || Object.getPrototypeOf(IllegalInheritanceError)).call(this, message));

        _this4.name = "IllegalInheritanceError";

        var self = _this4;
        self.constructor = IllegalInheritanceError;
        self.__proto__ = IllegalInheritanceError.prototype;
        return _this4;
    }

    return IllegalInheritanceError;
}(Error);

var IllegalStateError = function (_Error5) {
    inherits(IllegalStateError, _Error5);

    function IllegalStateError(message) {
        classCallCheck(this, IllegalStateError);

        var _this5 = possibleConstructorReturn(this, (IllegalStateError.__proto__ || Object.getPrototypeOf(IllegalStateError)).call(this, message));

        _this5.name = "IllegalStateError";

        var self = _this5;
        self.constructor = IllegalStateError;
        self.__proto__ = IllegalStateError.prototype;
        return _this5;
    }

    return IllegalStateError;
}(Error);

var IllegalArgumentError = function (_Error6) {
    inherits(IllegalArgumentError, _Error6);

    function IllegalArgumentError(message) {
        classCallCheck(this, IllegalArgumentError);

        var _this6 = possibleConstructorReturn(this, (IllegalArgumentError.__proto__ || Object.getPrototypeOf(IllegalArgumentError)).call(this, message));

        _this6.name = "IllegalArgumentError";

        var self = _this6;
        self.constructor = IllegalArgumentError;
        self.__proto__ = IllegalArgumentError.prototype;
        return _this6;
    }

    return IllegalArgumentError;
}(Error);

var NotImplementedError = function (_Error7) {
    inherits(NotImplementedError, _Error7);

    function NotImplementedError(message) {
        classCallCheck(this, NotImplementedError);

        var _this7 = possibleConstructorReturn(this, (NotImplementedError.__proto__ || Object.getPrototypeOf(NotImplementedError)).call(this, message));

        _this7.name = "NotImplementedError";

        var self = _this7;
        self.constructor = NotImplementedError;
        self.__proto__ = NotImplementedError.prototype;
        return _this7;
    }

    return NotImplementedError;
}(Error);

var TimeoutError = function (_Error8) {
    inherits(TimeoutError, _Error8);

    function TimeoutError(message) {
        classCallCheck(this, TimeoutError);

        var _this8 = possibleConstructorReturn(this, (TimeoutError.__proto__ || Object.getPrototypeOf(TimeoutError)).call(this, message));

        _this8.name = "TimeoutError";

        var self = _this8;
        self.constructor = TimeoutError;
        self.__proto__ = TimeoutError.prototype;
        return _this8;
    }

    return TimeoutError;
}(Error);

var Either = function () {
    function Either(_leftRef, _rightRef, _isRight) {
        classCallCheck(this, Either);

        this._isRight = _isRight;
        if (_isRight) this._rightRef = _rightRef;else this._leftRef = _leftRef;
    }

    createClass(Either, [{
        key: "isLeft",
        value: function isLeft() {
            return !this._isRight;
        }
    }, {
        key: "isRight",
        value: function isRight() {
            return this._isRight;
        }
    }, {
        key: "contains",
        value: function contains(elem) {
            return this._isRight && is(this._rightRef, elem);
        }
    }, {
        key: "exists",
        value: function exists(p) {
            return this._isRight && p(this._rightRef);
        }
    }, {
        key: "filterOrElse",
        value: function filterOrElse(p, zero) {
            return this._isRight ? p(this._rightRef) ? this : Left(zero()) : this;
        }
    }, {
        key: "flatMap",
        value: function flatMap(f) {
            return this._isRight ? f(this._rightRef) : this;
        }
    }, {
        key: "fold",
        value: function fold(left, right) {
            return this._isRight ? right(this._rightRef) : left(this._leftRef);
        }
    }, {
        key: "forAll",
        value: function forAll(p) {
            return !this._isRight || p(this._rightRef);
        }
    }, {
        key: "get",
        value: function get$$1() {
            if (this._isRight) return this._rightRef;
            throw new NoSuchElementError("left.get()");
        }
    }, {
        key: "getOrElse",
        value: function getOrElse(fallback) {
            return this._isRight ? this._rightRef : fallback;
        }
    }, {
        key: "getOrElseL",
        value: function getOrElseL(thunk) {
            return this._isRight ? this._rightRef : thunk();
        }
    }, {
        key: "map",
        value: function map(f) {
            return this._isRight ? Right(f(this._rightRef)) : this;
        }
    }, {
        key: "forEach",
        value: function forEach(cb) {
            if (this._isRight) cb(this._rightRef);
        }
    }, {
        key: "swap",
        value: function swap() {
            return this._isRight ? Left(this._rightRef) : Right(this._leftRef);
        }
    }, {
        key: "toOption",
        value: function toOption() {
            return this._isRight ? Option.some(this._rightRef) : Option.none();
        }
    }, {
        key: "equals",
        value: function equals$$1(other) {
            if (other == null) return false;
            if (this._isRight) return is(this._rightRef, other._rightRef);
            return is(this._leftRef, other._leftRef);
        }
    }, {
        key: "hashCode",
        value: function hashCode$$1() {
            return this._isRight ? hashCode(this._rightRef) << 2 : hashCode(this._leftRef) << 3;
        }
    }], [{
        key: "left",
        value: function left(value) {
            return Left(value);
        }
    }, {
        key: "right",
        value: function right(value) {
            return Right(value);
        }
    }, {
        key: "map2",
        value: function map2(fa1, fa2, f) {
            if (fa1.isLeft()) return fa1;
            if (fa2.isLeft()) return fa2;
            return Right(f(fa1._rightRef, fa2._rightRef));
        }
    }, {
        key: "map3",
        value: function map3(fa1, fa2, fa3, f) {
            if (fa1.isLeft()) return fa1;
            if (fa2.isLeft()) return fa2;
            if (fa3.isLeft()) return fa3;
            return Right(f(fa1._rightRef, fa2._rightRef, fa3._rightRef));
        }
    }, {
        key: "map4",
        value: function map4(fa1, fa2, fa3, fa4, f) {
            if (fa1.isLeft()) return fa1;
            if (fa2.isLeft()) return fa2;
            if (fa3.isLeft()) return fa3;
            if (fa4.isLeft()) return fa4;
            return Right(f(fa1._rightRef, fa2._rightRef, fa3._rightRef, fa4._rightRef));
        }
    }, {
        key: "map5",
        value: function map5(fa1, fa2, fa3, fa4, fa5, f) {
            if (fa1.isLeft()) return fa1;
            if (fa2.isLeft()) return fa2;
            if (fa3.isLeft()) return fa3;
            if (fa4.isLeft()) return fa4;
            if (fa5.isLeft()) return fa5;
            return Right(f(fa1._rightRef, fa2._rightRef, fa3._rightRef, fa4._rightRef, fa5._rightRef));
        }
    }, {
        key: "map6",
        value: function map6(fa1, fa2, fa3, fa4, fa5, fa6, f) {
            if (fa1.isLeft()) return fa1;
            if (fa2.isLeft()) return fa2;
            if (fa3.isLeft()) return fa3;
            if (fa4.isLeft()) return fa4;
            if (fa5.isLeft()) return fa5;
            if (fa6.isLeft()) return fa6;
            return Right(f(fa1._rightRef, fa2._rightRef, fa3._rightRef, fa4._rightRef, fa5._rightRef, fa6._rightRef));
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            var cursor = a;
            while (true) {
                var result = f(cursor);
                if (result.isLeft()) return result;
                var some = result.get();
                if (some.isRight()) return Right(some.get());
                cursor = some.swap().get();
            }
        }
    }]);
    return Either;
}();

function Left(value) {
    return new Either(value, null, false);
}

function Right(value) {
    return new Either(null, value, true);
}

var Option = function () {
    function Option(ref, isEmpty) {
        classCallCheck(this, Option);

        this._isEmpty = isEmpty != null ? isEmpty : ref === null || ref === undefined;
        this._ref = ref;
    }

    createClass(Option, [{
        key: "get",
        value: function get$$1() {
            if (!this._isEmpty) return this._ref;else throw new NoSuchElementError("Option.get");
        }
    }, {
        key: "getOrElse",
        value: function getOrElse(fallback) {
            if (!this._isEmpty) return this._ref;else return fallback;
        }
    }, {
        key: "orNull",
        value: function orNull() {
            return !this._isEmpty ? this._ref : null;
        }
    }, {
        key: "orUndefined",
        value: function orUndefined() {
            return !this._isEmpty ? this._ref : undefined;
        }
    }, {
        key: "getOrElseL",
        value: function getOrElseL(thunk) {
            if (!this._isEmpty) return this._ref;else return thunk();
        }
    }, {
        key: "orElse",
        value: function orElse(fallback) {
            if (!this._isEmpty) return this;else return fallback;
        }
    }, {
        key: "orElseL",
        value: function orElseL(thunk) {
            if (!this._isEmpty) return this;else return thunk();
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this._isEmpty;
        }
    }, {
        key: "nonEmpty",
        value: function nonEmpty() {
            return !this._isEmpty;
        }
    }, {
        key: "map",
        value: function map(f) {
            return this._isEmpty ? None : Some(f(this._ref));
        }
    }, {
        key: "mapN",
        value: function mapN(f) {
            return this._isEmpty ? None : Option.of(f(this._ref));
        }
    }, {
        key: "flatMap",
        value: function flatMap(f) {
            if (this._isEmpty) return None;else return f(this._ref);
        }
    }, {
        key: "chain",
        value: function chain(f) {
            return this.flatMap(f);
        }
    }, {
        key: "filter",
        value: function filter(p) {
            if (this._isEmpty || !p(this._ref)) return None;else return this;
        }
    }, {
        key: "fold",
        value: function fold(fallback, f) {
            if (this._isEmpty) return fallback();else return f(this._ref);
        }
    }, {
        key: "contains",
        value: function contains(elem) {
            return !this._isEmpty && is(this._ref, elem);
        }
    }, {
        key: "exists",
        value: function exists(p) {
            return !this._isEmpty && p(this._ref);
        }
    }, {
        key: "forAll",
        value: function forAll(p) {
            return this._isEmpty || p(this._ref);
        }
    }, {
        key: "forEach",
        value: function forEach(cb) {
            if (!this._isEmpty) cb(this._ref);
        }
    }, {
        key: "equals",
        value: function equals$$1(that) {
            if (that == null) return false;
            if (this.nonEmpty() && that.nonEmpty()) {
                var l = this.get();
                var r = that.get();
                return is(l, r);
            }
            return this.isEmpty() && that.isEmpty();
        }
    }, {
        key: "hashCode",
        value: function hashCode$$1() {
            if (this._isEmpty) return 2433880;else if (this._ref == null) return 2433881 << 2;else return hashCode(this._ref) << 2;
        }
    }], [{
        key: "of",
        value: function of(value) {
            return value != null ? Some(value) : None;
        }
    }, {
        key: "some",
        value: function some(value) {
            return new Option(value, false);
        }
    }, {
        key: "none",
        value: function none() {
            return None;
        }
    }, {
        key: "empty",
        value: function empty() {
            return None;
        }
    }, {
        key: "pure",
        value: function pure(value) {
            return Some(value);
        }
    }, {
        key: "map2",
        value: function map2(fa1, fa2, f) {
            return fa1.nonEmpty() && fa2.nonEmpty() ? Some(f(fa1.get(), fa2.get())) : None;
        }
    }, {
        key: "map3",
        value: function map3(fa1, fa2, fa3, f) {
            return fa1.nonEmpty() && fa2.nonEmpty() && fa3.nonEmpty() ? Some(f(fa1.get(), fa2.get(), fa3.get())) : None;
        }
    }, {
        key: "map4",
        value: function map4(fa1, fa2, fa3, fa4, f) {
            return fa1.nonEmpty() && fa2.nonEmpty() && fa3.nonEmpty() && fa4.nonEmpty() ? Some(f(fa1.get(), fa2.get(), fa3.get(), fa4.get())) : None;
        }
    }, {
        key: "map5",
        value: function map5(fa1, fa2, fa3, fa4, fa5, f) {
            return fa1.nonEmpty() && fa2.nonEmpty() && fa3.nonEmpty() && fa4.nonEmpty() && fa5.nonEmpty() ? Some(f(fa1.get(), fa2.get(), fa3.get(), fa4.get(), fa5.get())) : None;
        }
    }, {
        key: "map6",
        value: function map6(fa1, fa2, fa3, fa4, fa5, fa6, f) {
            return fa1.nonEmpty() && fa2.nonEmpty() && fa3.nonEmpty() && fa4.nonEmpty() && fa5.nonEmpty() && fa6.nonEmpty() ? Some(f(fa1.get(), fa2.get(), fa3.get(), fa4.get(), fa5.get(), fa6.get())) : None;
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            var cursor = a;
            while (true) {
                var result = f(cursor);
                if (result.isEmpty()) return None;
                var some = result.get();
                if (some.isRight()) return Some(some.get());
                cursor = some.swap().get();
            }
        }
    }]);
    return Option;
}();

function Some(value) {
    return new Option(value, false);
}

function emptyOptionRef() {
    var F = Option;
    return new F(null, true);
}

var None = emptyOptionRef();

var Try = function () {
    function Try(_success, _failure, _isSuccess) {
        classCallCheck(this, Try);

        this._isSuccess = _isSuccess;
        if (_isSuccess) this._successRef = _success;else this._failureRef = _failure;
    }

    createClass(Try, [{
        key: "isSuccess",
        value: function isSuccess() {
            return this._isSuccess;
        }
    }, {
        key: "isFailure",
        value: function isFailure() {
            return !this._isSuccess;
        }
    }, {
        key: "get",
        value: function get$$1() {
            if (!this._isSuccess) throw this._failureRef;
            return this._successRef;
        }
    }, {
        key: "getOrElse",
        value: function getOrElse(fallback) {
            return this._isSuccess ? this._successRef : fallback;
        }
    }, {
        key: "getOrElseL",
        value: function getOrElseL(thunk) {
            return this._isSuccess ? this._successRef : thunk();
        }
    }, {
        key: "orNull",
        value: function orNull() {
            return this._isSuccess ? this._successRef : null;
        }
    }, {
        key: "orUndefined",
        value: function orUndefined() {
            return this._isSuccess ? this._successRef : undefined;
        }
    }, {
        key: "orElse",
        value: function orElse(fallback) {
            if (this._isSuccess) return this;
            return fallback;
        }
    }, {
        key: "orElseL",
        value: function orElseL(thunk) {
            if (this._isSuccess) return this;
            return thunk();
        }
    }, {
        key: "failed",
        value: function failed() {
            return this._isSuccess ? Failure(new NoSuchElementError("try.failed()")) : Success(this._failureRef);
        }
    }, {
        key: "fold",
        value: function fold(failure, success) {
            return this._isSuccess ? success(this._successRef) : failure(this._failureRef);
        }
    }, {
        key: "filter",
        value: function filter(p) {
            if (!this._isSuccess) return this;
            try {
                if (p(this._successRef)) return this;
                return Failure(new NoSuchElementError("Predicate does not hold for " + this._successRef));
            } catch (e) {
                return Failure(e);
            }
        }
    }, {
        key: "flatMap",
        value: function flatMap(f) {
            if (!this._isSuccess) return this;
            try {
                return f(this._successRef);
            } catch (e) {
                return Failure(e);
            }
        }
    }, {
        key: "chain",
        value: function chain(f) {
            return this.flatMap(f);
        }
    }, {
        key: "map",
        value: function map(f) {
            var _this = this;

            return this._isSuccess ? Try.of(function () {
                return f(_this._successRef);
            }) : this;
        }
    }, {
        key: "forEach",
        value: function forEach(cb) {
            if (this._isSuccess) cb(this._successRef);
        }
    }, {
        key: "recover",
        value: function recover(f) {
            var _this2 = this;

            return this._isSuccess ? this : Try.of(function () {
                return f(_this2._failureRef);
            });
        }
    }, {
        key: "recoverWith",
        value: function recoverWith(f) {
            try {
                return this._isSuccess ? this : f(this._failureRef);
            } catch (e) {
                return Failure(e);
            }
        }
    }, {
        key: "toOption",
        value: function toOption() {
            return this._isSuccess ? Some(this._successRef) : None;
        }
    }, {
        key: "toEither",
        value: function toEither() {
            return this._isSuccess ? Right(this._successRef) : Left(this._failureRef);
        }
    }, {
        key: "equals",
        value: function equals$$1(that) {
            if (that == null) return false;
            return this._isSuccess ? that._isSuccess && is(this._successRef, that._successRef) : !that._isSuccess && is(this._failureRef, that._failureRef);
        }
    }, {
        key: "hashCode",
        value: function hashCode$$1() {
            return this._isSuccess ? hashCode(this._successRef) : hashCode(this._failureRef);
        }
    }], [{
        key: "of",
        value: function of(thunk) {
            try {
                return Success(thunk());
            } catch (e) {
                return Failure(e);
            }
        }
    }, {
        key: "pure",
        value: function pure(value) {
            return Try.success(value);
        }
    }, {
        key: "unit",
        value: function unit() {
            return tryUnitRef;
        }
    }, {
        key: "success",
        value: function success(value) {
            return Success(value);
        }
    }, {
        key: "failure",
        value: function failure(e) {
            return Failure(e);
        }
    }, {
        key: "raise",
        value: function raise(e) {
            return Failure(e);
        }
    }, {
        key: "map2",
        value: function map2(fa1, fa2, f) {
            if (fa1.isFailure()) return fa1;
            if (fa2.isFailure()) return fa2;
            try {
                return Success(f(fa1._successRef, fa2._successRef));
            } catch (e) {
                return Failure(e);
            }
        }
    }, {
        key: "map3",
        value: function map3(fa1, fa2, fa3, f) {
            if (fa1.isFailure()) return fa1;
            if (fa2.isFailure()) return fa2;
            if (fa3.isFailure()) return fa3;
            try {
                return Success(f(fa1._successRef, fa2._successRef, fa3._successRef));
            } catch (e) {
                return Failure(e);
            }
        }
    }, {
        key: "map4",
        value: function map4(fa1, fa2, fa3, fa4, f) {
            if (fa1.isFailure()) return fa1;
            if (fa2.isFailure()) return fa2;
            if (fa3.isFailure()) return fa3;
            if (fa4.isFailure()) return fa4;
            try {
                return Success(f(fa1._successRef, fa2._successRef, fa3._successRef, fa4._successRef));
            } catch (e) {
                return Failure(e);
            }
        }
    }, {
        key: "map5",
        value: function map5(fa1, fa2, fa3, fa4, fa5, f) {
            if (fa1.isFailure()) return fa1;
            if (fa2.isFailure()) return fa2;
            if (fa3.isFailure()) return fa3;
            if (fa4.isFailure()) return fa4;
            if (fa5.isFailure()) return fa5;
            try {
                return Success(f(fa1._successRef, fa2._successRef, fa3._successRef, fa4._successRef, fa5._successRef));
            } catch (e) {
                return Failure(e);
            }
        }
    }, {
        key: "map6",
        value: function map6(fa1, fa2, fa3, fa4, fa5, fa6, f) {
            if (fa1.isFailure()) return fa1;
            if (fa2.isFailure()) return fa2;
            if (fa3.isFailure()) return fa3;
            if (fa4.isFailure()) return fa4;
            if (fa5.isFailure()) return fa5;
            if (fa6.isFailure()) return fa6;
            try {
                return Success(f(fa1._successRef, fa2._successRef, fa3._successRef, fa4._successRef, fa5._successRef, fa6._successRef));
            } catch (e) {
                return Failure(e);
            }
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            var cursor = a;
            while (true) {
                try {
                    var result = f(cursor);
                    if (result.isFailure()) return result;
                    var some = result.get();
                    if (some.isRight()) return Success(some.get());
                    cursor = some.swap().get();
                } catch (e) {
                    return Failure(e);
                }
            }
        }
    }]);
    return Try;
}();

function Success(value) {
    return new Try(value, null, true);
}

function Failure(e) {
    return new Try(null, e, false);
}

var tryUnitRef = Success(undefined);

exports.isValueObject = isValueObject;
exports.is = is;
exports.equals = equals;
exports.hashCode = hashCode;
exports.hashCodeOfString = hashCodeOfString;
exports.id = id;
exports.applyMixins = applyMixins;
exports.CompositeError = CompositeError;
exports.DummyError = DummyError;
exports.NoSuchElementError = NoSuchElementError;
exports.IllegalInheritanceError = IllegalInheritanceError;
exports.IllegalStateError = IllegalStateError;
exports.IllegalArgumentError = IllegalArgumentError;
exports.NotImplementedError = NotImplementedError;
exports.TimeoutError = TimeoutError;
exports.Either = Either;
exports.Left = Left;
exports.Right = Right;
exports.Option = Option;
exports.Some = Some;
exports.None = None;
exports.Try = Try;
exports.Success = Success;
exports.Failure = Failure;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=umd.js.map
