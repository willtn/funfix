import { CompositeError, Either, Failure, IllegalArgumentError, IllegalStateError, Left, None, NotImplementedError, Right, Some, Success, TimeoutError, Try, hashCodeOfString } from 'funfix-core/dist/es5';

var emptyIteratorRef = { next: function next() {
        return { done: true };
    } };

function iteratorOf(list) {
    if (!list) return emptyIteratorRef;
    if (Object.prototype.toString.call(list) !== "[object Array]") return list[Symbol.iterator]();
    var array = list;
    if (array.length === 0) return emptyIteratorRef;
    var cursor = 0;
    var next = function next() {
        var value = array[cursor++];
        var done = cursor >= array.length;
        return { done: done, value: value };
    };
    return { next: next };
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





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

var Eval = function () {
    function Eval() {
        classCallCheck(this, Eval);
    }

    createClass(Eval, [{
        key: "get",
        value: function get$$1() {
            return evalRunLoop(this);
        }
    }, {
        key: "map",
        value: function map(f) {
            return new FlatMap(this, function (a) {
                return Eval.now(f(a));
            });
        }
    }, {
        key: "flatMap",
        value: function flatMap(f) {
            return new FlatMap(this, f);
        }
    }, {
        key: "chain",
        value: function chain(f) {
            return this.flatMap(f);
        }
    }, {
        key: "memoize",
        value: function memoize() {
            var _this = this;

            switch (this._funADType) {
                case "now":
                case "once":
                    return this;
                case "always":
                    return new Once(this.get);
                default:
                    return new Once(function () {
                        return _this.get();
                    });
            }
        }
    }, {
        key: "forEachL",
        value: function forEachL(cb) {
            return this.map(cb);
        }
    }, {
        key: "forEach",
        value: function forEach(cb) {
            this.forEachL(cb).get();
        }
    }], [{
        key: "of",
        value: function of(thunk) {
            return Eval.always(thunk);
        }
    }, {
        key: "pure",
        value: function pure(value) {
            return Eval.now(value);
        }
    }, {
        key: "now",
        value: function now(value) {
            return new Now(value);
        }
    }, {
        key: "unit",
        value: function unit() {
            return evalUnitRef;
        }
    }, {
        key: "always",
        value: function always(thunk) {
            return new Always(thunk);
        }
    }, {
        key: "once",
        value: function once(thunk) {
            return new Once(thunk);
        }
    }, {
        key: "suspend",
        value: function suspend(thunk) {
            return new Suspend(thunk);
        }
    }, {
        key: "defer",
        value: function defer(thunk) {
            return Eval.suspend(thunk);
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            return f(a).flatMap(function (either) {
                if (either.isRight()) {
                    return Eval.now(either.get());
                } else {
                    return Eval.tailRecM(either.swap().get(), f);
                }
            });
        }
    }, {
        key: "sequence",
        value: function sequence(list) {
            return evalSequence(list);
        }
    }, {
        key: "map2",
        value: function map2(fa1, fa2, f) {
            var fl = Eval.sequence([fa1, fa2]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1]);
            });
        }
    }, {
        key: "map3",
        value: function map3(fa1, fa2, fa3, f) {
            var fl = Eval.sequence([fa1, fa2, fa3]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2]);
            });
        }
    }, {
        key: "map4",
        value: function map4(fa1, fa2, fa3, fa4, f) {
            var fl = Eval.sequence([fa1, fa2, fa3, fa4]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3]);
            });
        }
    }, {
        key: "map5",
        value: function map5(fa1, fa2, fa3, fa4, fa5, f) {
            var fl = Eval.sequence([fa1, fa2, fa3, fa4, fa5]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3], lst[4]);
            });
        }
    }, {
        key: "map6",
        value: function map6(fa1, fa2, fa3, fa4, fa5, fa6, f) {
            var fl = Eval.sequence([fa1, fa2, fa3, fa4, fa5, fa6]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3], lst[4], lst[5]);
            });
        }
    }]);
    return Eval;
}();

var Now = function (_Eval) {
    inherits(Now, _Eval);

    function Now(value) {
        classCallCheck(this, Now);

        var _this2 = possibleConstructorReturn(this, (Now.__proto__ || Object.getPrototypeOf(Now)).call(this));

        _this2.value = value;
        _this2._funADType = "now";
        return _this2;
    }

    createClass(Now, [{
        key: "get",
        value: function get$$1() {
            return this.value;
        }
    }, {
        key: "toString",
        value: function toString() {
            return "Eval.now(" + JSON.stringify(this.value) + ")";
        }
    }]);
    return Now;
}(Eval);

var evalUnitRef = new Now(undefined);

var Once = function (_Eval2) {
    inherits(Once, _Eval2);

    function Once(thunk) {
        classCallCheck(this, Once);

        var _this3 = possibleConstructorReturn(this, (Once.__proto__ || Object.getPrototypeOf(Once)).call(this));

        _this3._funADType = "once";
        _this3._thunk = thunk;
        return _this3;
    }

    createClass(Once, [{
        key: "get",
        value: function get$$1() {
            if (this._thunk) {
                try {
                    this._cache = this._thunk();
                    this._isError = false;
                } catch (e) {
                    this._cache = e;
                    this._isError = true;
                }

                delete this._thunk;
            }
            if (this._isError) throw this._cache;
            return this._cache;
        }
    }, {
        key: "toString",
        value: function toString() {
            return "Eval.once([thunk])";
        }
    }]);
    return Once;
}(Eval);

var Always = function (_Eval3) {
    inherits(Always, _Eval3);

    function Always(thunk) {
        classCallCheck(this, Always);

        var _this4 = possibleConstructorReturn(this, (Always.__proto__ || Object.getPrototypeOf(Always)).call(this));

        _this4._funADType = "always";
        _this4.get = thunk;
        return _this4;
    }

    createClass(Always, [{
        key: "toString",
        value: function toString() {
            return "Eval.always([thunk])";
        }
    }]);
    return Always;
}(Eval);

var Suspend = function (_Eval4) {
    inherits(Suspend, _Eval4);

    function Suspend(thunk) {
        classCallCheck(this, Suspend);

        var _this5 = possibleConstructorReturn(this, (Suspend.__proto__ || Object.getPrototypeOf(Suspend)).call(this));

        _this5.thunk = thunk;
        _this5._funADType = "suspend";
        return _this5;
    }

    createClass(Suspend, [{
        key: "toString",
        value: function toString() {
            return "Eval.suspend([thunk])";
        }
    }]);
    return Suspend;
}(Eval);

var FlatMap = function (_Eval5) {
    inherits(FlatMap, _Eval5);

    function FlatMap(source, f) {
        classCallCheck(this, FlatMap);

        var _this6 = possibleConstructorReturn(this, (FlatMap.__proto__ || Object.getPrototypeOf(FlatMap)).call(this));

        _this6.source = source;
        _this6.f = f;
        _this6._funADType = "flatMap";
        return _this6;
    }

    createClass(FlatMap, [{
        key: "toString",
        value: function toString() {
            return "Eval#FlatMap(" + String(this.source) + ", [function])";
        }
    }]);
    return FlatMap;
}(Eval);

function _popNextBind(bFirst, bRest) {
    if (bFirst) return bFirst;
    if (bRest && bRest.length > 0) return bRest.pop();
    return null;
}

function evalRunLoop(start) {
    var current = start;
    var bFirst = null;
    var bRest = null;
    while (true) {
        switch (current._funADType) {
            case "now":
                var now = current;
                var bind = _popNextBind(bFirst, bRest);
                if (!bind) return now.value;
                bFirst = null;
                current = bind(now.value);
                break;
            case "always":
            case "once":
                current = new Now(current.get());
                break;
            case "suspend":
                current = current.thunk();
                break;
            case "flatMap":
                if (bFirst) {
                    if (!bRest) bRest = [];
                    bRest.push(bFirst);
                }
                var fm = current;
                bFirst = fm.f;
                current = fm.source;
                break;
        }
    }
}

function evalSequence(list) {
    return Eval.of(function () {
        return iteratorOf(list);
    }).flatMap(function (cursor) {
        return evalSequenceLoop([], cursor);
    });
}

function evalSequenceLoop(acc, cursor) {
    var _loop = function _loop() {
        var elem = cursor.next();
        var isDone = elem.done;
        if (elem.value) {
            var io = elem.value;
            return {
                v: io.flatMap(function (a) {
                    acc.push(a);
                    if (isDone) return Eval.pure(acc);
                    return evalSequenceLoop(acc, cursor);
                })
            };
        } else {
            if (isDone) return {
                    v: Eval.pure(acc)
                };
        }
    };

    while (true) {
        var _ret = _loop();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    }
}

var Cancelable = function () {
    function Cancelable() {
        classCallCheck(this, Cancelable);
    }

    createClass(Cancelable, null, [{
        key: "of",
        value: function of(cb) {
            return new WrapFn(cb);
        }
    }, {
        key: "empty",
        value: function empty() {
            return Empty;
        }
    }, {
        key: "collection",
        value: function collection() {
            for (var _len = arguments.length, refs = Array(_len), _key = 0; _key < _len; _key++) {
                refs[_key] = arguments[_key];
            }

            return new CollectionCancelable(refs);
        }
    }, {
        key: "cancelAll",
        value: function cancelAll(refs) {
            var errors = null;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = refs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var c = _step.value;

                    try {
                        c.cancel();
                    } catch (e) {
                        if (!errors) errors = [e];else errors.push(e);
                    }
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

            if (!errors) return;else if (errors.length === 1) throw errors[0];else throw new CompositeError(errors);
        }
    }]);
    return Cancelable;
}();

var WrapFn = function (_Cancelable) {
    inherits(WrapFn, _Cancelable);

    function WrapFn(cb) {
        classCallCheck(this, WrapFn);

        var _this = possibleConstructorReturn(this, (WrapFn.__proto__ || Object.getPrototypeOf(WrapFn)).call(this));

        _this.thunk = cb;
        return _this;
    }

    createClass(WrapFn, [{
        key: "cancel",
        value: function cancel() {
            if (this.thunk !== null) {
                var ref = this.thunk;
                this.thunk = null;
                ref();
            }
        }
    }]);
    return WrapFn;
}(Cancelable);

var DummyCancelable = function () {
    function DummyCancelable() {
        classCallCheck(this, DummyCancelable);

        this._funIsDummy = true;
    }

    createClass(DummyCancelable, [{
        key: "cancel",
        value: function cancel() {}
    }]);
    return DummyCancelable;
}();

var Empty = new DummyCancelable();

var BoolCancelable = function () {
    function BoolCancelable() {
        classCallCheck(this, BoolCancelable);
    }

    createClass(BoolCancelable, null, [{
        key: "of",
        value: function of(cb) {
            return new BoolWrapFn(cb);
        }
    }, {
        key: "empty",
        value: function empty() {
            return new BoolEmpty();
        }
    }, {
        key: "alreadyCanceled",
        value: function alreadyCanceled() {
            return AlreadyCanceledRef;
        }
    }, {
        key: "collection",
        value: function collection() {
            for (var _len2 = arguments.length, refs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                refs[_key2] = arguments[_key2];
            }

            return new CollectionCancelable(refs);
        }
    }]);
    return BoolCancelable;
}();

var CollectionCancelable = function (_BoolCancelable) {
    inherits(CollectionCancelable, _BoolCancelable);

    function CollectionCancelable(refs) {
        classCallCheck(this, CollectionCancelable);

        var _this2 = possibleConstructorReturn(this, (CollectionCancelable.__proto__ || Object.getPrototypeOf(CollectionCancelable)).call(this));

        _this2._refs = refs;
        return _this2;
    }

    createClass(CollectionCancelable, [{
        key: "isCanceled",
        value: function isCanceled() {
            return !this._refs;
        }
    }, {
        key: "cancel",
        value: function cancel() {
            if (this._refs) try {
                Cancelable.cancelAll(this._refs);
            } finally {
                delete this._refs;
            }
        }
    }]);
    return CollectionCancelable;
}(BoolCancelable);

var BoolWrapFn = function (_WrapFn) {
    inherits(BoolWrapFn, _WrapFn);

    function BoolWrapFn() {
        classCallCheck(this, BoolWrapFn);
        return possibleConstructorReturn(this, (BoolWrapFn.__proto__ || Object.getPrototypeOf(BoolWrapFn)).apply(this, arguments));
    }

    createClass(BoolWrapFn, [{
        key: "isCanceled",
        value: function isCanceled() {
            return this.thunk === null;
        }
    }]);
    return BoolWrapFn;
}(WrapFn);

var BoolEmpty = function (_BoolCancelable2) {
    inherits(BoolEmpty, _BoolCancelable2);

    function BoolEmpty() {
        classCallCheck(this, BoolEmpty);

        var _this4 = possibleConstructorReturn(this, (BoolEmpty.__proto__ || Object.getPrototypeOf(BoolEmpty)).apply(this, arguments));

        _this4.canceled = false;
        return _this4;
    }

    createClass(BoolEmpty, [{
        key: "isCanceled",
        value: function isCanceled() {
            return this.canceled;
        }
    }, {
        key: "cancel",
        value: function cancel() {
            this.canceled = true;
        }
    }]);
    return BoolEmpty;
}(BoolCancelable);

var AlreadyCanceledBoolCancelable = function (_DummyCancelable) {
    inherits(AlreadyCanceledBoolCancelable, _DummyCancelable);

    function AlreadyCanceledBoolCancelable() {
        classCallCheck(this, AlreadyCanceledBoolCancelable);
        return possibleConstructorReturn(this, (AlreadyCanceledBoolCancelable.__proto__ || Object.getPrototypeOf(AlreadyCanceledBoolCancelable)).apply(this, arguments));
    }

    createClass(AlreadyCanceledBoolCancelable, [{
        key: "isCanceled",
        value: function isCanceled() {
            return true;
        }
    }]);
    return AlreadyCanceledBoolCancelable;
}(DummyCancelable);

var AlreadyCanceledRef = new AlreadyCanceledBoolCancelable();

var AssignCancelable = function () {
    function AssignCancelable() {
        classCallCheck(this, AssignCancelable);
    }

    createClass(AssignCancelable, null, [{
        key: "alreadyCanceled",
        value: function alreadyCanceled() {
            return AlreadyCanceledAssignCancelableRef;
        }
    }, {
        key: "empty",
        value: function empty() {
            return MultiAssignCancelable.empty();
        }
    }, {
        key: "of",
        value: function of(cb) {
            return MultiAssignCancelable.of(cb);
        }
    }]);
    return AssignCancelable;
}();

var AlreadyCanceledAssignCancelable = function (_DummyCancelable2) {
    inherits(AlreadyCanceledAssignCancelable, _DummyCancelable2);

    function AlreadyCanceledAssignCancelable() {
        classCallCheck(this, AlreadyCanceledAssignCancelable);
        return possibleConstructorReturn(this, (AlreadyCanceledAssignCancelable.__proto__ || Object.getPrototypeOf(AlreadyCanceledAssignCancelable)).apply(this, arguments));
    }

    createClass(AlreadyCanceledAssignCancelable, [{
        key: "isCanceled",
        value: function isCanceled() {
            return true;
        }
    }, {
        key: "cancel",
        value: function cancel() {}
    }, {
        key: "update",
        value: function update(value) {
            value.cancel();
            return this;
        }
    }]);
    return AlreadyCanceledAssignCancelable;
}(DummyCancelable);

var AlreadyCanceledAssignCancelableRef = new AlreadyCanceledAssignCancelable();

var MultiAssignCancelable = function () {
    function MultiAssignCancelable(initial) {
        classCallCheck(this, MultiAssignCancelable);

        this._underlying = initial;
        this._canceled = false;
    }

    createClass(MultiAssignCancelable, [{
        key: "update",
        value: function update(value) {
            if (this._canceled) value.cancel();else this._underlying = value;
            return this;
        }
    }, {
        key: "isCanceled",
        value: function isCanceled() {
            return this._canceled;
        }
    }, {
        key: "cancel",
        value: function cancel() {
            if (!this._canceled) {
                this._canceled = true;
                if (this._underlying) {
                    this._underlying.cancel();
                    delete this._underlying;
                }
            }
        }
    }, {
        key: "collapse",
        value: function collapse() {
            if (this._underlying && this._underlying instanceof MultiAssignCancelable) {
                var ref = this._underlying;
                this._underlying = ref._underlying;
                this._canceled = ref._canceled;
            }
            return this;
        }
    }, {
        key: "clear",
        value: function clear() {
            if (!this._canceled) this._underlying = undefined;
            return this;
        }
    }], [{
        key: "empty",
        value: function empty() {
            return new MultiAssignCancelable();
        }
    }, {
        key: "of",
        value: function of(cb) {
            return new MultiAssignCancelable(Cancelable.of(cb));
        }
    }]);
    return MultiAssignCancelable;
}();

var SerialCancelable = function () {
    function SerialCancelable(initial) {
        classCallCheck(this, SerialCancelable);

        this._underlying = initial;
        this._canceled = false;
    }

    createClass(SerialCancelable, [{
        key: "update",
        value: function update(value) {
            if (this._canceled) value.cancel();else {
                if (this._underlying) this._underlying.cancel();
                this._underlying = value;
            }
            return this;
        }
    }, {
        key: "isCanceled",
        value: function isCanceled() {
            return this._canceled;
        }
    }, {
        key: "cancel",
        value: function cancel() {
            if (!this._canceled) {
                this._canceled = true;
                if (this._underlying) {
                    this._underlying.cancel();
                    delete this._underlying;
                }
            }
        }
    }], [{
        key: "empty",
        value: function empty() {
            return new SerialCancelable();
        }
    }, {
        key: "of",
        value: function of(cb) {
            return new SerialCancelable(Cancelable.of(cb));
        }
    }]);
    return SerialCancelable;
}();

var SingleAssignCancelable = function () {
    function SingleAssignCancelable() {
        classCallCheck(this, SingleAssignCancelable);

        this._canceled = false;
        this._wasAssigned = false;
    }

    createClass(SingleAssignCancelable, [{
        key: "update",
        value: function update(value) {
            if (this._wasAssigned) throw new IllegalStateError("SingleAssignCancelable#update multiple times");
            this._wasAssigned = true;
            if (this._canceled) value.cancel();else this._underlying = value;
            return this;
        }
    }, {
        key: "isCanceled",
        value: function isCanceled() {
            return this._canceled;
        }
    }, {
        key: "cancel",
        value: function cancel() {
            if (!this._canceled) {
                this._canceled = true;
                if (this._underlying) {
                    this._underlying.cancel();
                    delete this._underlying;
                }
            }
        }
    }], [{
        key: "empty",
        value: function empty() {
            return new SingleAssignCancelable();
        }
    }, {
        key: "of",
        value: function of(cb) {
            var ref = new SingleAssignCancelable();
            ref.update(Cancelable.of(cb));
            return ref;
        }
    }]);
    return SingleAssignCancelable;
}();

var StackedCancelable = function () {
    function StackedCancelable(initial) {
        classCallCheck(this, StackedCancelable);

        this._refs = initial ? initial.slice(0) : [];
    }

    createClass(StackedCancelable, [{
        key: "cancel",
        value: function cancel() {
            if (this._refs) try {
                Cancelable.cancelAll(this._refs);
            } finally {
                delete this._refs;
            }
        }
    }, {
        key: "isCanceled",
        value: function isCanceled() {
            return !this._refs;
        }
    }, {
        key: "push",
        value: function push(value) {
            if (this._refs) {
                this._refs.push(value);
            } else {
                value.cancel();
            }
            return this;
        }
    }, {
        key: "pop",
        value: function pop() {
            if (!this._refs) return Cancelable.empty();
            return this._refs.pop() || Cancelable.empty();
        }
    }], [{
        key: "empty",
        value: function empty() {
            return new StackedCancelable();
        }
    }, {
        key: "collection",
        value: function collection() {
            for (var _len3 = arguments.length, refs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                refs[_key3] = arguments[_key3];
            }

            return new StackedCancelable(refs);
        }
    }]);
    return StackedCancelable;
}();

var ChainedCancelable = function () {
    function ChainedCancelable(initial) {
        classCallCheck(this, ChainedCancelable);

        this._underlying = initial || Empty;
        this._chained = false;
    }

    createClass(ChainedCancelable, [{
        key: "update",
        value: function update(value) {
            if (!value) throw new IllegalArgumentError("cannot update to null value");

            if (!this._underlying) {
                value.cancel();
                return this;
            } else if (this._chained) {
                this._underlying.update(value);
                return this;
            } else {
                this._underlying = value;
                return this;
            }
        }
    }, {
        key: "cancel",
        value: function cancel() {
            if (this._underlying) {
                this._underlying.cancel();
                this._chained = false;
                delete this._underlying;
            }
        }
    }, {
        key: "clear",
        value: function clear() {
            if (this._underlying) {
                this._underlying = Empty;
                this._chained = false;
            }
        }
    }, {
        key: "isCanceled",
        value: function isCanceled() {
            return !this._underlying || this._chained && this._underlying.isCanceled();
        }
    }, {
        key: "chainTo",
        value: function chainTo(other) {
            if (!other) throw new IllegalArgumentError("cannot chain to null value");

            if (other === this) return this;
            if (!this._underlying) {
                other.cancel();
                return this;
            }

            var ref = other;
            var keepSearching = true;
            while (ref && keepSearching) {
                if (ref._chained) {
                    var ref2 = ref._underlying;

                    if (ref2 === this) return this;
                    ref = ref2;
                    keepSearching = !!ref2;
                } else {
                    if (!ref._underlying) ref = undefined;
                    keepSearching = false;
                }
            }

            if (!ref) {
                this.cancel();
            } else {
                var prev = this._underlying;
                this._underlying = ref;
                this._chained = true;
                if (!(prev instanceof DummyCancelable)) ref.update(prev);
            }
            return this;
        }
    }], [{
        key: "empty",
        value: function empty() {
            return new ChainedCancelable();
        }
    }]);
    return ChainedCancelable;
}();

var TimeUnit = function () {
    function TimeUnit() {
        classCallCheck(this, TimeUnit);
    }

    createClass(TimeUnit, [{
        key: "toString",
        value: function toString() {
            return this.label.toUpperCase();
        }
    }]);
    return TimeUnit;
}();
var C0 = 1;
var C1 = C0 * 1000;
var C2 = C1 * 1000;
var C3 = C2 * 1000;
var C4 = C3 * 60;
var C5 = C4 * 60;
var C6 = C5 * 24;
var MIN = -9007199254740992;
var MAX = 9007199254740992;

var trunc = Math.trunc || function (x) {
    if (isNaN(x)) return NaN;
    if (x > 0) return Math.floor(x);
    return Math.ceil(x);
};

function x(d, m, over) {
    if (d > over) return MAX;
    if (d < -over) return MIN;
    return d * m;
}

var Nanoseconds = function (_TimeUnit) {
    inherits(Nanoseconds, _TimeUnit);

    function Nanoseconds() {
        classCallCheck(this, Nanoseconds);

        var _this = possibleConstructorReturn(this, (Nanoseconds.__proto__ || Object.getPrototypeOf(Nanoseconds)).apply(this, arguments));

        _this.ord = 0;
        _this.label = "nanoseconds";
        return _this;
    }

    createClass(Nanoseconds, [{
        key: "convert",
        value: function convert(duration, unit) {
            return unit.toNanos(duration);
        }
    }, {
        key: "toNanos",
        value: function toNanos(d) {
            return d;
        }
    }, {
        key: "toMicros",
        value: function toMicros(d) {
            return trunc(d / (C1 / C0));
        }
    }, {
        key: "toMillis",
        value: function toMillis(d) {
            return trunc(d / (C2 / C0));
        }
    }, {
        key: "toSeconds",
        value: function toSeconds(d) {
            return trunc(d / (C3 / C0));
        }
    }, {
        key: "toMinutes",
        value: function toMinutes(d) {
            return trunc(d / (C4 / C0));
        }
    }, {
        key: "toHours",
        value: function toHours(d) {
            return trunc(d / (C5 / C0));
        }
    }, {
        key: "toDays",
        value: function toDays(d) {
            return trunc(d / (C6 / C0));
        }
    }]);
    return Nanoseconds;
}(TimeUnit);

var NANOSECONDS = new Nanoseconds();

var Microseconds = function (_TimeUnit2) {
    inherits(Microseconds, _TimeUnit2);

    function Microseconds() {
        classCallCheck(this, Microseconds);

        var _this2 = possibleConstructorReturn(this, (Microseconds.__proto__ || Object.getPrototypeOf(Microseconds)).apply(this, arguments));

        _this2.ord = 1;
        _this2.label = "microseconds";
        return _this2;
    }

    createClass(Microseconds, [{
        key: "convert",
        value: function convert(duration, unit) {
            return unit.toMicros(duration);
        }
    }, {
        key: "toNanos",
        value: function toNanos(d) {
            return x(d, C1 / C0, trunc(MAX / (C1 / C0)));
        }
    }, {
        key: "toMicros",
        value: function toMicros(d) {
            return d;
        }
    }, {
        key: "toMillis",
        value: function toMillis(d) {
            return trunc(d / (C2 / C1));
        }
    }, {
        key: "toSeconds",
        value: function toSeconds(d) {
            return trunc(d / (C3 / C1));
        }
    }, {
        key: "toMinutes",
        value: function toMinutes(d) {
            return trunc(d / (C4 / C1));
        }
    }, {
        key: "toHours",
        value: function toHours(d) {
            return trunc(d / (C5 / C1));
        }
    }, {
        key: "toDays",
        value: function toDays(d) {
            return trunc(d / (C6 / C1));
        }
    }]);
    return Microseconds;
}(TimeUnit);

var MICROSECONDS = new Microseconds();

var Milliseconds = function (_TimeUnit3) {
    inherits(Milliseconds, _TimeUnit3);

    function Milliseconds() {
        classCallCheck(this, Milliseconds);

        var _this3 = possibleConstructorReturn(this, (Milliseconds.__proto__ || Object.getPrototypeOf(Milliseconds)).apply(this, arguments));

        _this3.ord = 2;
        _this3.label = "milliseconds";
        return _this3;
    }

    createClass(Milliseconds, [{
        key: "convert",
        value: function convert(duration, unit) {
            return unit.toMillis(duration);
        }
    }, {
        key: "toNanos",
        value: function toNanos(d) {
            return x(d, C2 / C0, trunc(MAX / (C2 / C0)));
        }
    }, {
        key: "toMicros",
        value: function toMicros(d) {
            return x(d, C2 / C1, trunc(MAX / (C2 / C1)));
        }
    }, {
        key: "toMillis",
        value: function toMillis(d) {
            return d;
        }
    }, {
        key: "toSeconds",
        value: function toSeconds(d) {
            return trunc(d / (C3 / C2));
        }
    }, {
        key: "toMinutes",
        value: function toMinutes(d) {
            return trunc(d / (C4 / C2));
        }
    }, {
        key: "toHours",
        value: function toHours(d) {
            return trunc(d / (C5 / C2));
        }
    }, {
        key: "toDays",
        value: function toDays(d) {
            return trunc(d / (C6 / C2));
        }
    }]);
    return Milliseconds;
}(TimeUnit);

var MILLISECONDS = new Milliseconds();

var Seconds = function (_TimeUnit4) {
    inherits(Seconds, _TimeUnit4);

    function Seconds() {
        classCallCheck(this, Seconds);

        var _this4 = possibleConstructorReturn(this, (Seconds.__proto__ || Object.getPrototypeOf(Seconds)).apply(this, arguments));

        _this4.ord = 3;
        _this4.label = "seconds";
        return _this4;
    }

    createClass(Seconds, [{
        key: "convert",
        value: function convert(duration, unit) {
            return unit.toSeconds(duration);
        }
    }, {
        key: "toNanos",
        value: function toNanos(d) {
            return x(d, C3 / C0, trunc(MAX / (C3 / C0)));
        }
    }, {
        key: "toMicros",
        value: function toMicros(d) {
            return x(d, C3 / C1, trunc(MAX / (C3 / C1)));
        }
    }, {
        key: "toMillis",
        value: function toMillis(d) {
            return x(d, C3 / C2, trunc(MAX / (C3 / C2)));
        }
    }, {
        key: "toSeconds",
        value: function toSeconds(d) {
            return d;
        }
    }, {
        key: "toMinutes",
        value: function toMinutes(d) {
            return trunc(d / (C4 / C3));
        }
    }, {
        key: "toHours",
        value: function toHours(d) {
            return trunc(d / (C5 / C3));
        }
    }, {
        key: "toDays",
        value: function toDays(d) {
            return trunc(d / (C6 / C3));
        }
    }]);
    return Seconds;
}(TimeUnit);

var SECONDS = new Seconds();

var Minutes = function (_TimeUnit5) {
    inherits(Minutes, _TimeUnit5);

    function Minutes() {
        classCallCheck(this, Minutes);

        var _this5 = possibleConstructorReturn(this, (Minutes.__proto__ || Object.getPrototypeOf(Minutes)).apply(this, arguments));

        _this5.ord = 4;
        _this5.label = "minutes";
        return _this5;
    }

    createClass(Minutes, [{
        key: "convert",
        value: function convert(duration, unit) {
            return unit.toMinutes(duration);
        }
    }, {
        key: "toNanos",
        value: function toNanos(d) {
            return x(d, C4 / C0, trunc(MAX / (C4 / C0)));
        }
    }, {
        key: "toMicros",
        value: function toMicros(d) {
            return x(d, C4 / C1, trunc(MAX / (C4 / C1)));
        }
    }, {
        key: "toMillis",
        value: function toMillis(d) {
            return x(d, C4 / C2, trunc(MAX / (C4 / C2)));
        }
    }, {
        key: "toSeconds",
        value: function toSeconds(d) {
            return x(d, C4 / C3, trunc(MAX / (C4 / C3)));
        }
    }, {
        key: "toMinutes",
        value: function toMinutes(d) {
            return d;
        }
    }, {
        key: "toHours",
        value: function toHours(d) {
            return trunc(d / (C5 / C4));
        }
    }, {
        key: "toDays",
        value: function toDays(d) {
            return trunc(d / (C6 / C4));
        }
    }]);
    return Minutes;
}(TimeUnit);

var MINUTES = new Minutes();

var Hours = function (_TimeUnit6) {
    inherits(Hours, _TimeUnit6);

    function Hours() {
        classCallCheck(this, Hours);

        var _this6 = possibleConstructorReturn(this, (Hours.__proto__ || Object.getPrototypeOf(Hours)).apply(this, arguments));

        _this6.ord = 5;
        _this6.label = "hours";
        return _this6;
    }

    createClass(Hours, [{
        key: "convert",
        value: function convert(duration, unit) {
            return unit.toHours(duration);
        }
    }, {
        key: "toNanos",
        value: function toNanos(d) {
            return x(d, C5 / C0, trunc(MAX / (C5 / C0)));
        }
    }, {
        key: "toMicros",
        value: function toMicros(d) {
            return x(d, C5 / C1, trunc(MAX / (C5 / C1)));
        }
    }, {
        key: "toMillis",
        value: function toMillis(d) {
            return x(d, C5 / C2, trunc(MAX / (C5 / C2)));
        }
    }, {
        key: "toSeconds",
        value: function toSeconds(d) {
            return x(d, C5 / C3, trunc(MAX / (C5 / C3)));
        }
    }, {
        key: "toMinutes",
        value: function toMinutes(d) {
            return x(d, C5 / C4, trunc(MAX / (C5 / C4)));
        }
    }, {
        key: "toHours",
        value: function toHours(d) {
            return d;
        }
    }, {
        key: "toDays",
        value: function toDays(d) {
            return trunc(d / (C6 / C5));
        }
    }]);
    return Hours;
}(TimeUnit);

var HOURS = new Hours();

var Days = function (_TimeUnit7) {
    inherits(Days, _TimeUnit7);

    function Days() {
        classCallCheck(this, Days);

        var _this7 = possibleConstructorReturn(this, (Days.__proto__ || Object.getPrototypeOf(Days)).apply(this, arguments));

        _this7.ord = 6;
        _this7.label = "days";
        return _this7;
    }

    createClass(Days, [{
        key: "convert",
        value: function convert(duration, unit) {
            return unit.toDays(duration);
        }
    }, {
        key: "toNanos",
        value: function toNanos(d) {
            return x(d, C6 / C0, trunc(MAX / (C6 / C0)));
        }
    }, {
        key: "toMicros",
        value: function toMicros(d) {
            return x(d, C6 / C1, trunc(MAX / (C6 / C1)));
        }
    }, {
        key: "toMillis",
        value: function toMillis(d) {
            return x(d, C6 / C2, trunc(MAX / (C6 / C2)));
        }
    }, {
        key: "toSeconds",
        value: function toSeconds(d) {
            return x(d, C6 / C3, trunc(MAX / (C6 / C3)));
        }
    }, {
        key: "toMinutes",
        value: function toMinutes(d) {
            return x(d, C6 / C4, trunc(MAX / (C6 / C4)));
        }
    }, {
        key: "toHours",
        value: function toHours(d) {
            return x(d, C6 / C5, trunc(MAX / (C6 / C5)));
        }
    }, {
        key: "toDays",
        value: function toDays(d) {
            return d;
        }
    }]);
    return Days;
}(TimeUnit);

var DAYS = new Days();

var Duration = function () {
    function Duration(duration, unit) {
        classCallCheck(this, Duration);

        if (isNaN(duration)) {
            throw new IllegalArgumentError("NaN is not supported for a Duration");
        }

        this.duration = trunc(duration);
        this.unit = unit;
    }

    createClass(Duration, [{
        key: "isFinite",
        value: function (_isFinite) {
            function isFinite() {
                return _isFinite.apply(this, arguments);
            }

            isFinite.toString = function () {
                return _isFinite.toString();
            };

            return isFinite;
        }(function () {
            return isFinite(this.duration);
        })
    }, {
        key: "toNanos",
        value: function toNanos() {
            return NANOSECONDS.convert(this.duration, this.unit);
        }
    }, {
        key: "toMicros",
        value: function toMicros() {
            return MICROSECONDS.convert(this.duration, this.unit);
        }
    }, {
        key: "toMillis",
        value: function toMillis() {
            return MILLISECONDS.convert(this.duration, this.unit);
        }
    }, {
        key: "toSeconds",
        value: function toSeconds() {
            return SECONDS.convert(this.duration, this.unit);
        }
    }, {
        key: "toMinutes",
        value: function toMinutes() {
            return MINUTES.convert(this.duration, this.unit);
        }
    }, {
        key: "toHours",
        value: function toHours() {
            return HOURS.convert(this.duration, this.unit);
        }
    }, {
        key: "toDays",
        value: function toDays() {
            return DAYS.convert(this.duration, this.unit);
        }
    }, {
        key: "convertTo",
        value: function convertTo(unit) {
            return new Duration(unit.convert(this.duration, this.unit), unit);
        }
    }, {
        key: "negate",
        value: function negate() {
            switch (this.duration) {
                case Infinity:
                    return Duration.negInf();
                case -Infinity:
                    return Duration.inf();
                default:
                    return new Duration(-this.duration, this.unit);
            }
        }
    }, {
        key: "plus",
        value: function plus(other) {
            if (!isFinite(this.duration)) {
                if (!isFinite(other.duration) && this.duration !== other.duration) {
                    throw new IllegalArgumentError("cannot deal with two infinities with different signs, " + "as that would be a NaN");
                }
                return this;
            } else if (other.duration === 0) {
                return this;
            } else if (this.duration === 0) {
                return other;
            }
            if (!isFinite(other.duration)) return other;
            var d1 = this;
            var d2 = other;
            if (d2.unit.ord < d1.unit.ord) {
                d1 = other;
                d2 = this;
            }
            d2 = d2.convertTo(d1.unit);
            return new Duration(d1.duration + d2.duration, d1.unit);
        }
    }, {
        key: "minus",
        value: function minus(other) {
            return this.plus(other.negate());
        }
    }, {
        key: "equals",
        value: function equals(other) {
            function cmp(s, o) {
                var n = s.unit.convert(o.duration, o.unit);
                return n === s.duration;
            }
            if (!isFinite(this.duration)) {
                return !isFinite(other.duration) && this.duration === other.duration;
            }
            return this.unit.ord <= other.unit.ord ? cmp(this, other) : cmp(other, this);
        }
    }, {
        key: "hashCode",
        value: function hashCode() {
            if (this.isFinite()) {
                return this.toNanos();
            } else if (this.duration === Infinity) {
                return 7540833725118015;
            } else {
                return 422082410550358;
            }
        }
    }, {
        key: "toString",
        value: function toString() {
            if (this.isFinite()) return this.duration + " " + this.unit.label;else if (this.duration >= 0) return "[end of time]";else return "[beginning of time]";
        }
    }], [{
        key: "of",
        value: function of(value) {
            return typeof value === "number" ? Duration.millis(value) : value;
        }
    }, {
        key: "zero",
        value: function zero() {
            return new Duration(0, DAYS);
        }
    }, {
        key: "inf",
        value: function inf() {
            return new Duration(Infinity, DAYS);
        }
    }, {
        key: "negInf",
        value: function negInf() {
            return new Duration(-Infinity, DAYS);
        }
    }, {
        key: "nanos",
        value: function nanos(d) {
            return new Duration(d, NANOSECONDS);
        }
    }, {
        key: "micros",
        value: function micros(d) {
            return new Duration(d, MICROSECONDS);
        }
    }, {
        key: "millis",
        value: function millis(d) {
            return new Duration(d, MILLISECONDS);
        }
    }, {
        key: "seconds",
        value: function seconds(d) {
            return new Duration(d, SECONDS);
        }
    }, {
        key: "minutes",
        value: function minutes(d) {
            return new Duration(d, MINUTES);
        }
    }, {
        key: "hours",
        value: function hours(d) {
            return new Duration(d, HOURS);
        }
    }, {
        key: "days",
        value: function days(d) {
            return new Duration(d, DAYS);
        }
    }]);
    return Duration;
}();

var DynamicRef = function () {
    function DynamicRef(fn) {
        classCallCheck(this, DynamicRef);

        this._previous = [];
        this.get = fn;
    }

    createClass(DynamicRef, [{
        key: "set",
        value: function set$$1(value) {
            return this.setL(function () {
                return value;
            });
        }
    }, {
        key: "setL",
        value: function setL(thunk) {
            this._previous.push(this.get);
            this.get = thunk;
        }
    }, {
        key: "revert",
        value: function revert() {
            var thunk = this._previous.pop();
            if (thunk) this.get = thunk;
        }
    }, {
        key: "bind",
        value: function bind(value, thunk) {
            return this.bindL(function () {
                return value;
            }, thunk);
        }
    }, {
        key: "bindL",
        value: function bindL(value, thunk) {
            var oldFn = this.get;
            var oldPrev = this._previous.slice(0);
            var ta = this;
            try {
                ta.get = value;
                return thunk();
            } finally {
                ta.get = oldFn;
                ta._previous = oldPrev;
            }
        }
    }], [{
        key: "of",
        value: function of(fn) {
            return new DynamicRef(fn);
        }
    }]);
    return DynamicRef;
}();

function arrayBSearchInsertPos(array, f) {
    return function (search) {
        var minIndex = 0;
        var maxIndex = array.length - 1;
        while (minIndex <= maxIndex) {
            var index = (minIndex + maxIndex) / 2 | 0;
            var current = f(array[index]);
            var next = index + 1 <= maxIndex ? f(array[index + 1]) : undefined;
            if (current <= search && (next === undefined || search < next)) {
                return index + 1;
            } else if (current <= search) {
                minIndex = index + 1;
            } else {
                maxIndex = index - 1;
            }
        }
        return 0;
    };
}

function iterableToArray(values) {
    if (!values) return [];
    if (Object.prototype.toString.call(values) === "[object Array]") return values;
    var cursor = values[Symbol.iterator]();
    var arr = [];
    while (true) {
        var item = cursor.next();
        if (item.value) arr.push(item.value);
        if (item.done) return arr;
    }
}

var lnOf2 = Math.log(2);

function log2(x) {
    return Math.log(x) / lnOf2;
}

var maxPowerOf2 = 1 << 30;

function nextPowerOf2(nr) {
    if (nr < 0) throw new IllegalArgumentError("nr must be positive");
    var bit = Math.ceil(log2(nr));
    return 1 << (bit > 30 ? 30 : bit & bit);
}

var Scheduler = function () {
    function Scheduler(em) {
        var _this = this;

        classCallCheck(this, Scheduler);

        this.batchIndex = 0;
        this.executionModel = em;

        switch (em.type) {
            case "alwaysAsync":
                this.executeBatched = this.executeAsync;
                break;
            case "synchronous":
                this.executeBatched = this.trampoline;
                break;
            case "batched":
                var modulus = em.recommendedBatchSize - 1;
                this.executeBatched = function (r) {
                    var next = _this.batchIndex + 1 & modulus;
                    if (next) {
                        _this.batchIndex = next;
                        return _this.trampoline(r);
                    } else {
                        return _this.executeAsync(r);
                    }
                };
        }
    }

    createClass(Scheduler, [{
        key: "scheduleWithFixedDelay",
        value: function scheduleWithFixedDelay(initialDelay, delay, runnable) {
            var loop = function loop(self, ref, delayNow) {
                return ref.update(self.scheduleOnce(delayNow, function () {
                    runnable();
                    loop(self, ref, delay);
                }));
            };
            var task = MultiAssignCancelable.empty();
            return loop(this, task, initialDelay);
        }
    }, {
        key: "scheduleAtFixedRate",
        value: function scheduleAtFixedRate(initialDelay, period, runnable) {
            var loop = function loop(self, ref, delayNowMs, periodMs) {
                return ref.update(self.scheduleOnce(delayNowMs, function () {
                    var startAt = self.currentTimeMillis();
                    runnable();

                    var elapsedMs = self.currentTimeMillis() - startAt;
                    var nextDelayMs = Math.max(0, periodMs - elapsedMs);
                    loop(self, ref, periodMs, nextDelayMs);
                }));
            };
            var task = MultiAssignCancelable.empty();
            return loop(this, task, typeof initialDelay === "number" ? initialDelay : initialDelay.toMillis(), typeof period === "number" ? period : period.toMillis());
        }
    }]);
    return Scheduler;
}();

Scheduler.global = DynamicRef.of(function () {
    return globalSchedulerRef;
});

var ExecutionModel = function () {
    function ExecutionModel(type, batchSize) {
        classCallCheck(this, ExecutionModel);

        this.type = type;
        switch (type) {
            case "synchronous":
                this.recommendedBatchSize = maxPowerOf2;
                break;
            case "alwaysAsync":
                this.recommendedBatchSize = 1;
                break;
            case "batched":
                this.recommendedBatchSize = nextPowerOf2(batchSize || 128);
                break;
        }
    }

    createClass(ExecutionModel, [{
        key: "equals",
        value: function equals(other) {
            return this.type === other.type && this.recommendedBatchSize === other.recommendedBatchSize;
        }
    }, {
        key: "hashCode",
        value: function hashCode() {
            return hashCodeOfString(this.type) * 47 + this.recommendedBatchSize;
        }
    }], [{
        key: "synchronous",
        value: function synchronous() {
            return new ExecutionModel("synchronous");
        }
    }, {
        key: "alwaysAsync",
        value: function alwaysAsync() {
            return new ExecutionModel("alwaysAsync");
        }
    }, {
        key: "batched",
        value: function batched(recommendedBatchSize) {
            return new ExecutionModel("batched", recommendedBatchSize);
        }
    }]);
    return ExecutionModel;
}();

ExecutionModel.global = DynamicRef.of(function () {
    return ExecutionModel.batched();
});

var Trampoline = function () {
    function Trampoline(reporter) {
        classCallCheck(this, Trampoline);

        this._isActive = false;
        this._queue = [];
        this._reporter = reporter;
    }

    createClass(Trampoline, [{
        key: "execute",
        value: function execute(r) {
            if (!this._isActive) {
                this.runLoop(r);
            } else {
                this._queue.push(r);
            }
        }
    }, {
        key: "runLoop",
        value: function runLoop(r) {
            this._isActive = true;
            try {
                var cursor = r;
                while (cursor) {
                    try {
                        cursor();
                    } catch (e) {
                        this._reporter(e);
                    }
                    cursor = this._queue.pop();
                }
            } finally {
                this._isActive = false;
            }
        }
    }]);
    return Trampoline;
}();

var GlobalScheduler = function (_Scheduler) {
    inherits(GlobalScheduler, _Scheduler);

    function GlobalScheduler() {
        var canUseSetImmediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var em = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ExecutionModel.global.get();
        var reporter = arguments[2];
        classCallCheck(this, GlobalScheduler);

        var _this2 = possibleConstructorReturn(this, (GlobalScheduler.__proto__ || Object.getPrototypeOf(GlobalScheduler)).call(this, em));

        if (reporter) _this2.reportFailure = reporter;
        _this2._trampoline = new Trampoline(_this2.reportFailure);

        _this2._useSetImmediate = (canUseSetImmediate || false) && typeof setImmediate === "function";
        _this2.executeAsync = _this2._useSetImmediate ? function (r) {
            return setImmediate(safeRunnable(r, _this2.reportFailure));
        } : function (r) {
            return setTimeout(safeRunnable(r, _this2.reportFailure));
        };
        return _this2;
    }

    createClass(GlobalScheduler, [{
        key: "executeAsync",
        value: function executeAsync(runnable) {
            throw new NotImplementedError("Constructor of GlobalScheduler wasn't executed");
        }
    }, {
        key: "trampoline",
        value: function trampoline(runnable) {
            return this._trampoline.execute(runnable);
        }
    }, {
        key: "reportFailure",
        value: function reportFailure(e) {
            console.error(e);
        }
    }, {
        key: "currentTimeMillis",
        value: function currentTimeMillis() {
            return Date.now();
        }
    }, {
        key: "scheduleOnce",
        value: function scheduleOnce(delay, runnable) {
            var _this3 = this;

            var r = function r() {
                _this3.batchIndex = 0;
                try {
                    runnable();
                } catch (e) {
                    _this3.reportFailure(e);
                }
            };
            var ms = Math.max(0, Duration.of(delay).toMillis());
            var task = setTimeout(r, ms);
            return Cancelable.of(function () {
                return clearTimeout(task);
            });
        }
    }, {
        key: "withExecutionModel",
        value: function withExecutionModel(em) {
            return new GlobalScheduler(this._useSetImmediate, em);
        }
    }]);
    return GlobalScheduler;
}(Scheduler);

var TestScheduler = function (_Scheduler2) {
    inherits(TestScheduler, _Scheduler2);

    function TestScheduler(reporter) {
        var em = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ExecutionModel.synchronous();
        classCallCheck(this, TestScheduler);

        var _this4 = possibleConstructorReturn(this, (TestScheduler.__proto__ || Object.getPrototypeOf(TestScheduler)).call(this, em));

        _this4._reporter = reporter || function (_) {};
        _this4._trampoline = new Trampoline(_this4.reportFailure.bind(_this4));
        return _this4;
    }

    createClass(TestScheduler, [{
        key: "_state",
        value: function _state() {
            if (!this._stateRef) {
                this._stateRef = new TestSchedulerState();
                this._stateRef.updateTasks([]);
            }
            return this._stateRef;
        }
    }, {
        key: "triggeredFailures",
        value: function triggeredFailures() {
            return this._state().triggeredFailures;
        }
    }, {
        key: "hasTasksLeft",
        value: function hasTasksLeft() {
            return this._state().tasks.length > 0;
        }
    }, {
        key: "executeAsync",
        value: function executeAsync(runnable) {
            this._state().tasks.push([this._state().clock, runnable]);
        }
    }, {
        key: "trampoline",
        value: function trampoline(runnable) {
            this._trampoline.execute(runnable);
        }
    }, {
        key: "reportFailure",
        value: function reportFailure(e) {
            this._state().triggeredFailures.push(e);
            this._reporter(e);
        }
    }, {
        key: "currentTimeMillis",
        value: function currentTimeMillis() {
            return this._state().clock;
        }
    }, {
        key: "scheduleOnce",
        value: function scheduleOnce(delay, runnable) {
            var d = Math.max(0, Duration.of(delay).toMillis());
            var state = this._state();
            var scheduleAt = state.clock + d;
            var insertAt = state.tasksSearch(-scheduleAt);
            var ref = [scheduleAt, runnable];
            state.tasks.splice(insertAt, 0, ref);
            return Cancelable.of(function () {
                var filtered = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = state.tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var e = _step.value;

                        if (e !== ref) filtered.push(e);
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

                state.updateTasks(filtered);
            });
        }
    }, {
        key: "withExecutionModel",
        value: function withExecutionModel(em) {
            var ec2 = new TestScheduler(this._reporter, em);
            ec2._stateRef = this._state();
            return ec2;
        }
    }, {
        key: "tick",
        value: function tick(duration) {
            var state = this._state();
            var toExecute = [];
            var jumpMs = Duration.of(duration || 0).toMillis();
            var executed = 0;
            while (true) {
                var peek = state.tasks.length > 0 ? state.tasks[state.tasks.length - 1] : undefined;
                if (peek && peek[0] <= state.clock) {
                    toExecute.push(state.tasks.pop());
                } else if (toExecute.length > 0) {
                    while (toExecute.length > 0) {
                        var index = Math.floor(Math.random() * toExecute.length);
                        var elem = toExecute[index];
                        try {
                            toExecute.splice(index, 1);
                            this.batchIndex = 0;
                            elem[1]();
                        } catch (e) {
                            this.reportFailure(e);
                        } finally {
                            executed += 1;
                        }
                    }
                } else if (jumpMs > 0) {
                    var nextTaskJump = peek && peek[0] - state.clock || jumpMs;
                    var add = Math.min(nextTaskJump, jumpMs);
                    state.clock += add;
                    jumpMs -= add;
                } else {
                    break;
                }
            }
            return executed;
        }
    }, {
        key: "tickOne",
        value: function tickOne() {
            var state = this._state();
            var peek = state.tasks.length > 0 ? state.tasks[state.tasks.length - 1] : undefined;
            if (!peek || peek[0] > state.clock) return false;
            this._state().tasks.pop();
            this.batchIndex = 0;
            try {
                peek[1]();
            } catch (e) {
                this.reportFailure(e);
            }
            return true;
        }
    }]);
    return TestScheduler;
}(Scheduler);

var TestSchedulerState = function () {
    function TestSchedulerState() {
        classCallCheck(this, TestSchedulerState);

        this.clock = 0;
        this.triggeredFailures = [];
        this.updateTasks([]);
    }

    createClass(TestSchedulerState, [{
        key: "updateTasks",
        value: function updateTasks(tasks) {
            this.tasks = tasks;
            this.tasksSearch = arrayBSearchInsertPos(this.tasks, function (e) {
                return -e[0];
            });
        }
    }]);
    return TestSchedulerState;
}();

var globalSchedulerRef = new GlobalScheduler(true);

function safeRunnable(r, reporter) {
    return function () {
        try {
            r();
        } catch (e) {
            reporter(e);
        }
    };
}

var Future = function () {
    function Future() {
        classCallCheck(this, Future);
    }

    createClass(Future, [{
        key: "transform",
        value: function transform(failure, success) {
            var _this = this;

            return this.transformWith(function (e) {
                return Future.pure(failure(e), _this._scheduler);
            }, function (a) {
                return Future.pure(success(a), _this._scheduler);
            });
        }
    }, {
        key: "attempt",
        value: function attempt() {
            return this.transform(Left, Right);
        }
    }, {
        key: "flatMap",
        value: function flatMap(f) {
            return this.transformWith(Future.raise, f);
        }
    }, {
        key: "map",
        value: function map(f) {
            var _this2 = this;

            return this.transformWith(Future.raise, function (a) {
                return Future.pure(f(a), _this2._scheduler);
            });
        }
    }, {
        key: "recoverWith",
        value: function recoverWith(f) {
            return this.transformWith(f, Future.pure);
        }
    }, {
        key: "recover",
        value: function recover(f) {
            var _this3 = this;

            return this.transformWith(function (e) {
                return Future.pure(f(e), _this3._scheduler);
            }, function (a) {
                return Future.pure(a, _this3._scheduler);
            });
        }
    }, {
        key: "then",
        value: function then(onFulfilled, onRejected) {
            if (!onFulfilled && !onRejected) return this;
            var ec = this._scheduler;
            return this.transformWith(promiseThen(onRejected, function (e) {
                return Future.raise(e, ec);
            }, ec), promiseThen(onFulfilled, function (a) {
                return Future.pure(a, ec);
            }, ec));
        }
    }, {
        key: "toPromise",
        value: function toPromise() {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                _this4.onComplete(function (_) {
                    return _.fold(reject, resolve);
                });
            });
        }
    }, {
        key: "delayResult",
        value: function delayResult(delay) {
            var _this5 = this;

            return this.transformWith(function (err) {
                return Future.delayedTick(delay, _this5._scheduler).flatMap(function (_) {
                    return Future.raise(err, _this5._scheduler);
                });
            }, function (a) {
                return Future.delayedTick(delay, _this5._scheduler).map(function (_) {
                    return a;
                });
            });
        }
    }, {
        key: "timeout",
        value: function timeout(after) {
            var fb = Future.raise(new TimeoutError(Duration.of(after).toString()), this._scheduler);
            return this.timeoutTo(after, function () {
                return fb;
            });
        }
    }, {
        key: "timeoutTo",
        value: function timeoutTo(after, fallback) {
            var other = Future.delayedTick(after, this._scheduler).flatMap(function (_) {
                return fallback();
            });
            var lst = [this, other];
            return Future.firstCompletedOf(lst, this._scheduler);
        }
    }], [{
        key: "of",
        value: function of(thunk) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            var ref = FutureMaker.empty(ec);
            ec.executeAsync(function () {
                return ref.tryComplete(Try.of(thunk));
            });
            return ref.future();
        }
    }, {
        key: "pure",
        value: function pure(a) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            return new PureFuture(Success(a), ec);
        }
    }, {
        key: "raise",
        value: function raise(e) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            return new PureFuture(Failure(e), ec);
        }
    }, {
        key: "create",
        value: function create(register) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            var ref = FutureMaker.empty(ec);
            try {
                var cRef = register(ref.complete);
                return ref.future(cRef || undefined);
            } catch (e) {
                return Future.raise(e, ec);
            }
        }
    }, {
        key: "unit",
        value: function unit() {
            var ec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Scheduler.global.get();

            var ecAny = ec;
            var ref = ecAny["_funCache"] && ecAny["_funCache"]["futureUnit"];
            if (!ref) {
                ref = new PureFuture(Success(undefined), ec);
                ecAny["_funCache"] = ecAny["_funCache"] || {};
                ecAny["_funCache"]["futureUnit"] = ref;
            }
            return ref;
        }
    }, {
        key: "delayedTick",
        value: function delayedTick(delay) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            return Future.create(function (cb) {
                return ec.scheduleOnce(delay, function () {
                    return cb(Success(undefined));
                });
            }, ec);
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            var ec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Scheduler.global.get();

            return f(a).flatMap(function (r) {
                if (r.isRight()) return Future.pure(r.get(), ec);
                return Future.tailRecM(r.swap().get(), f, ec);
            });
        }
    }, {
        key: "fromPromise",
        value: function fromPromise(ref) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            if (ref instanceof Future) return ref.withScheduler(ec);else return Future.create(function (cb) {
                ref.then(function (value) {
                    return cb(Success(value));
                }, function (err) {
                    return cb(Failure(err));
                });
            }, ec);
        }
    }, {
        key: "fromTry",
        value: function fromTry(value) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            return new PureFuture(value, ec);
        }
    }, {
        key: "firstCompletedOf",
        value: function firstCompletedOf(list) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            return futureFirstCompletedOf(list, ec);
        }
    }, {
        key: "traverse",
        value: function traverse(list) {
            var parallelism = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
            var ec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Scheduler.global.get();

            return function (f) {
                return futureTraverse(list, f, parallelism, ec);
            };
        }
    }, {
        key: "sequence",
        value: function sequence(list) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            return futureSequence(list, ec);
        }
    }, {
        key: "map2",
        value: function map2(fa1, fa2, f) {
            var ec = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Scheduler.global.get();

            var fl = Future.sequence([fa1, fa2], ec);
            return fl.map(function (lst) {
                return f(lst[0], lst[1]);
            });
        }
    }, {
        key: "map3",
        value: function map3(fa1, fa2, fa3, f) {
            var ec = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Scheduler.global.get();

            var fl = Future.sequence([fa1, fa2, fa3], ec);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2]);
            });
        }
    }, {
        key: "map4",
        value: function map4(fa1, fa2, fa3, fa4, f) {
            var ec = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Scheduler.global.get();

            var fl = Future.sequence([fa1, fa2, fa3, fa4], ec);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3]);
            });
        }
    }, {
        key: "map5",
        value: function map5(fa1, fa2, fa3, fa4, fa5, f) {
            var ec = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : Scheduler.global.get();

            var fl = Future.sequence([fa1, fa2, fa3, fa4, fa5], ec);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3], lst[4]);
            });
        }
    }, {
        key: "map6",
        value: function map6(fa1, fa2, fa3, fa4, fa5, fa6, f) {
            var ec = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : Scheduler.global.get();

            var fl = Future.sequence([fa1, fa2, fa3, fa4, fa5, fa6], ec);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3], lst[4], lst[5]);
            });
        }
    }]);
    return Future;
}();

var PureFuture = function (_Future) {
    inherits(PureFuture, _Future);

    function PureFuture(_value, _scheduler) {
        classCallCheck(this, PureFuture);

        var _this6 = possibleConstructorReturn(this, (PureFuture.__proto__ || Object.getPrototypeOf(PureFuture)).call(this));

        _this6._value = _value;
        _this6._scheduler = _scheduler;
        return _this6;
    }

    createClass(PureFuture, [{
        key: "cancel",
        value: function cancel() {}
    }, {
        key: "value",
        value: function value() {
            return Some(this._value);
        }
    }, {
        key: "withScheduler",
        value: function withScheduler(ec) {
            if (this._scheduler === ec) return this;
            return new PureFuture(this._value, ec);
        }
    }, {
        key: "onComplete",
        value: function onComplete(f) {
            var _this7 = this;

            this._scheduler.executeBatched(function () {
                return f(_this7._value);
            });
        }
    }, {
        key: "transformWith",
        value: function transformWith(failure, success) {
            return genericTransformWith(this, failure, success, this._scheduler);
        }
    }, {
        key: "toPromise",
        value: function toPromise() {
            return this._value.fold(function (e) {
                return Promise.reject(e);
            }, function (a) {
                return Promise.resolve(a);
            });
        }
    }]);
    return PureFuture;
}(Future);

var AsyncFutureState = function () {
    function AsyncFutureState() {
        classCallCheck(this, AsyncFutureState);

        this.id = null;
        this.ref = null;
    }

    createClass(AsyncFutureState, [{
        key: "compressedRoot",
        value: function compressedRoot() {
            var cursor = this;
            while (cursor.id === "chained") {
                cursor = cursor.ref;
                this.ref = cursor;
            }
            return cursor;
        }
    }, {
        key: "value",
        value: function value() {
            switch (this.id) {
                case null:
                    return None;
                case "complete":
                    return Some(this.ref);
                case "chained":
                    return this.compressedRoot().value();
            }
        }
    }, {
        key: "tryComplete",
        value: function tryComplete(r, ec) {
            var _this8 = this;

            var _ret = function () {
                switch (_this8.id) {
                    case null:
                        var xs = _this8.ref;
                        _this8.ref = r;
                        _this8.id = "complete";
                        if (xs) {
                            var _loop = function _loop(i) {
                                ec.executeBatched(function () {
                                    return xs[i](r);
                                });
                            };

                            for (var i = 0; i < xs.length; i++) {
                                _loop(i);
                            }
                        }
                        return {
                            v: true
                        };
                    case "complete":
                        return {
                            v: false
                        };
                    case "chained":
                        var ref = _this8.ref.compressedRoot();
                        var result = ref.tryComplete(r, ec);
                        _this8.id = "complete";
                        _this8.ref = result ? r : ref.value().get();
                        return {
                            v: result
                        };
                }
            }();

            if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
    }, {
        key: "chainTo",
        value: function chainTo(target, ec) {
            switch (this.id) {
                case null:
                    var xs = this.ref;
                    this.id = "chained";
                    this.ref = target.compressedRoot();
                    if (xs && xs.length > 0) {
                        for (var i = 0; i < xs.length; i++) {
                            target.onComplete(xs[i], ec);
                        }
                    }
                    break;
                case "chained":
                    this.compressedRoot().chainTo(target.compressedRoot(), ec);
                    break;
                case "complete":
                    target.tryComplete(this.ref, ec);
                    break;
            }
        }
    }, {
        key: "onComplete",
        value: function onComplete(f, ec) {
            var _this9 = this;

            switch (this.id) {
                case null:
                    if (!this.ref) this.ref = [];
                    this.ref.push(f);
                    break;
                case "complete":
                    ec.executeBatched(function () {
                        return f(_this9.ref);
                    });
                    break;
                case "chained":
                    this.ref.onComplete(f, ec);
                    break;
            }
        }
    }]);
    return AsyncFutureState;
}();

var AsyncFuture = function (_Future2) {
    inherits(AsyncFuture, _Future2);

    function AsyncFuture(state, cRef, ec) {
        classCallCheck(this, AsyncFuture);

        var _this10 = possibleConstructorReturn(this, (AsyncFuture.__proto__ || Object.getPrototypeOf(AsyncFuture)).call(this));

        _this10._state = state;
        _this10._scheduler = ec;
        if (cRef) _this10._cancelable = cRef;
        return _this10;
    }

    createClass(AsyncFuture, [{
        key: "value",
        value: function value() {
            return this._state.value();
        }
    }, {
        key: "onComplete",
        value: function onComplete(f) {
            return this._state.onComplete(f, this._scheduler);
        }
    }, {
        key: "cancel",
        value: function cancel() {
            if (this._cancelable) {
                try {
                    this._cancelable.cancel();
                } finally {
                    delete this._cancelable;
                }
            }
        }
    }, {
        key: "withScheduler",
        value: function withScheduler(ec) {
            if (this._scheduler === ec) return this;
            return new AsyncFuture(this._state, this._cancelable, ec);
        }
    }, {
        key: "transformWith",
        value: function transformWith(failure, success) {
            return genericTransformWith(this, failure, success, this._scheduler, this._cancelable);
        }
    }]);
    return AsyncFuture;
}(Future);

var FutureMaker = function () {
    function FutureMaker(state, ec) {
        var _this11 = this;

        classCallCheck(this, FutureMaker);

        this.tryComplete = function (r) {
            return _this11["_state"].tryComplete(r, _this11._scheduler);
        };

        this.complete = function (r) {
            if (!_this11.tryComplete(r)) throw new IllegalStateError("Cannot complete a FutureMaker twice!");
        };
        this["_state"] = state;
        this._scheduler = ec;
    }

    createClass(FutureMaker, [{
        key: "trySuccess",
        value: function trySuccess(value) {
            return this.tryComplete(Success(value));
        }
    }, {
        key: "success",
        value: function success(value) {
            return this.complete(Success(value));
        }
    }, {
        key: "tryFailure",
        value: function tryFailure(error) {
            return this.tryComplete(Failure(error));
        }
    }, {
        key: "failure",
        value: function failure(error) {
            return this.complete(Failure(error));
        }
    }, {
        key: "chainTo",
        value: function chainTo(target) {
            this["_state"].chainTo(target["_state"], this._scheduler);
        }
    }, {
        key: "future",
        value: function future(cancelable) {
            switch (this._state.id) {
                case "complete":
                    return new PureFuture(this["_state"].ref, this._scheduler);
                default:
                    return new AsyncFuture(this["_state"], cancelable, this._scheduler);
            }
        }
    }, {
        key: "withScheduler",
        value: function withScheduler(ec) {
            if (this._scheduler === ec) return this;
            return new FutureMaker(this._state, ec);
        }
    }], [{
        key: "empty",
        value: function empty() {
            var ec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Scheduler.global.get();

            return new FutureMaker(new AsyncFutureState(), ec);
        }
    }, {
        key: "completed",
        value: function completed(value) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            var state = new AsyncFutureState();
            state.id = "complete";
            state.ref = value;
            return new FutureMaker(state, ec);
        }
    }]);
    return FutureMaker;
}();

function genericTransformWith(self, failure, success, scheduler, cancelable) {
    var defer = FutureMaker.empty(scheduler);
    var cRef = new ChainedCancelable(cancelable);
    self.onComplete(function (tryA) {
        var fb = void 0;
        try {
            fb = tryA.fold(failure, success);
        } catch (e) {
            fb = Future.raise(e);
        }

        if (fb.value().isEmpty()) {
            var fbb = fb;
            var cNext = fbb._cancelable;
            if (cNext && cNext instanceof ChainedCancelable) {
                cNext.chainTo(cRef);
            } else if (cNext && !(cNext instanceof DummyCancelable)) {
                cRef.update(cNext);
            }
        } else {
            cRef.clear();
        }
        if (fb instanceof AsyncFuture) {
            fb._state.chainTo(defer["_state"], scheduler);
        } else {
            fb.onComplete(defer.tryComplete);
        }
    });
    return defer.future(cRef);
}

function promiseThen(f, alt, ec) {
    return function (value) {
        if (typeof f !== "function") return alt(value);
        var fb = f(value);
        if (!fb) return Future.pure(value, ec);
        if (typeof fb.then === "function") return Future.fromPromise(fb, ec);else return Future.pure(fb, ec);
    };
}

function futureCancelAll(list, ec) {
    var skip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;

    var errors = [];
    for (var i = 0; i < list.length; i++) {
        if (i !== skip) try {
            list[i].cancel();
        } catch (e) {
            errors.push(e);
        }
    }
    if (errors.length > 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var e = _step.value;

                ec.reportFailure(e);
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
    }
}

function futureIterableToArray(values, ec) {
    if (!values) return [];
    if (Object.prototype.toString.call(values) === "[object Array]") return values;
    var arr = [];
    try {
        var cursor = values[Symbol.iterator]();
        while (true) {
            var item = cursor.next();
            if (item.value) arr.push(item.value);
            if (item.done) break;
        }
        return arr;
    } catch (e) {
        futureCancelAll(arr, ec);
        throw e;
    }
}

function futureSequence(values, ec) {
    return Future.create(function (cb) {
        try {
            var _ret3 = function () {
                var futures = futureIterableToArray(values, ec);

                if (futures.length === 0) return {
                        v: cb(Success([]))
                    };
                var cRef = Cancelable.of(function () {
                    return futureCancelAll(futures, ec);
                });

                var isDone = false;
                var finishedCount = 0;
                var finalArray = [];

                var _loop2 = function _loop2(index) {
                    var fi = index;
                    var fa = futures[index];
                    fa.onComplete(function (result) {
                        finishedCount += 1;
                        if (result.isSuccess()) {
                            if (!isDone) {
                                finalArray[fi] = result.get();
                                isDone = finishedCount === futures.length;
                                if (isDone) cb(Success(finalArray));
                            }
                        } else {
                            if (!isDone) {
                                isDone = true;
                                cRef.cancel();
                                cb(result);
                            } else {
                                ec.reportFailure(result.failed().get());
                            }
                        }
                    });
                };

                for (var index = 0; index < futures.length; index++) {
                    _loop2(index);
                }
                return {
                    v: cRef
                };
            }();

            if ((typeof _ret3 === "undefined" ? "undefined" : _typeof(_ret3)) === "object") return _ret3.v;
        } catch (e) {
            cb(Failure(e));
        }
    }, ec);
}

function futureFirstCompletedOf(iterable, ec) {
    return Future.create(function (cb) {
        try {
            var _ret5 = function () {
                var futures = futureIterableToArray(iterable, ec);

                if (futures.length === 0) return {
                        v: cb(Failure(new IllegalArgumentError("empty list of futures")))
                    };

                var isDone = false;

                var _loop3 = function _loop3(index) {
                    var fi = index;
                    var fa = futures[index];
                    fa.onComplete(function (result) {
                        if (!isDone) {
                            isDone = true;
                            futureCancelAll(futures, ec, fi);
                            cb(result);
                        } else if (result.isFailure()) {
                            ec.reportFailure(result.failed().get());
                        }
                    });
                };

                for (var index = 0; index < futures.length; index++) {
                    _loop3(index);
                }
                return {
                    v: Cancelable.of(function () {
                        return futureCancelAll(futures, ec);
                    })
                };
            }();

            if ((typeof _ret5 === "undefined" ? "undefined" : _typeof(_ret5)) === "object") return _ret5.v;
        } catch (e) {
            cb(Failure(e));
        }
    }, ec);
}

function futureTraverse(list, f, parallelism, ec) {
    if (parallelism <= 0) {
        throw new IllegalArgumentError("parallelism <= 0");
    }
    return Future.of(function () {
        return iterableToArray(list);
    }, ec).flatMap(function (values) {
        return futureTraverseLoop(values, f, parallelism, ec, 0, []);
    });
}

function futureTraverseLoop(list, f, parallelism, ec, index, result) {
    if (index >= list.length) return Future.pure(result, ec);
    var batch = [];
    var length = 0;
    try {
        while (index < list.length && length < parallelism) {
            batch.push(f(list[index++]));
            length += 1;
        }
        var fa = Future.sequence(batch, ec).map(function (b) {
            for (var i = 0; i < b.length; i++) {
                result.push(b[i]);
            }
        });
        if (index >= list.length) {
            return fa.map(function (_) {
                return result;
            });
        } else {
            return fa.flatMap(function (_) {
                return futureTraverseLoop(list, f, parallelism, ec, index, result);
            });
        }
    } catch (e) {
        futureCancelAll(batch, ec);
        return Future.raise(e);
    }
}

var IO = function () {
    function IO() {
        classCallCheck(this, IO);
    }

    createClass(IO, [{
        key: "run",
        value: function run() {
            var ec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Scheduler.global.get();

            return taskToFutureRunLoop(this, ec);
        }
    }, {
        key: "runOnComplete",
        value: function runOnComplete(cb) {
            var ec = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Scheduler.global.get();

            var ref = ioGenericRunLoop(this, ec, null, cb, null, null, null);
            return ref || Cancelable.empty();
        }
    }, {
        key: "attempt",
        value: function attempt() {
            return this.transform(function (_) {
                return Either.left(_);
            }, Either.right);
        }
    }, {
        key: "asyncBoundary",
        value: function asyncBoundary(ec) {
            return this.flatMap(function (a) {
                return IO.shift(ec).map(function (_) {
                    return a;
                });
            });
        }
    }, {
        key: "chain",
        value: function chain(f) {
            return this.flatMap(f);
        }
    }, {
        key: "delayExecution",
        value: function delayExecution(delay) {
            var _this = this;

            return IO.delayedTick(delay).flatMap(function (_) {
                return _this;
            });
        }
    }, {
        key: "delayResult",
        value: function delayResult(delay) {
            return this.transformWith(function (err) {
                return IO.delayedTick(delay).flatMap(function (_) {
                    return IO.raise(err);
                });
            }, function (a) {
                return IO.delayedTick(delay).map(function (_) {
                    return a;
                });
            });
        }
    }, {
        key: "doOnFinish",
        value: function doOnFinish(f) {
            return this.transformWith(function (e) {
                return f(Some(e)).flatMap(function (_) {
                    return IO.raise(e);
                });
            }, function (a) {
                return f(None).map(function (_) {
                    return a;
                });
            });
        }
    }, {
        key: "doOnCancel",
        value: function doOnCancel(callback) {
            var _this2 = this;

            return IO.asyncUnsafe(function (ctx, cb) {
                var ec = ctx.scheduler;
                ec.trampoline(function () {
                    var conn = ctx.connection;
                    conn.push(Cancelable.of(function () {
                        return callback.run(ec);
                    }));
                    IO.unsafeStart(_this2, ctx, ioSafeCallback(ec, conn, cb));
                });
            });
        }
    }, {
        key: "executeForked",
        value: function executeForked(ec) {
            return IO.fork(this, ec);
        }
    }, {
        key: "executeWithModel",
        value: function executeWithModel(em) {
            var _this3 = this;

            return IO.asyncUnsafe(function (ctx, cb) {
                var ec = ctx.scheduler.withExecutionModel(em);
                var ctx2 = new IOContext(ec, ctx.connection, ctx.options);
                ec.trampoline(function () {
                    return IO.unsafeStart(_this3, ctx2, cb);
                });
            });
        }
    }, {
        key: "executeWithOptions",
        value: function executeWithOptions(set$$1) {
            var _this4 = this;

            return IO.asyncUnsafe(function (ctx, cb) {
                var ec = ctx.scheduler;
                var ctx2 = new IOContext(ec, ctx.connection, set$$1);
                ec.trampoline(function () {
                    return IO.unsafeStart(_this4, ctx2, cb);
                });
            });
        }
    }, {
        key: "flatMap",
        value: function flatMap(f) {
            return new IOFlatMap(this, f);
        }
    }, {
        key: "followedBy",
        value: function followedBy(fb) {
            return this.flatMap(function (_) {
                return fb;
            });
        }
    }, {
        key: "forEach",
        value: function forEach(cb) {
            return this.map(cb);
        }
    }, {
        key: "forEffect",
        value: function forEffect(fb) {
            return this.flatMap(function (a) {
                return fb.map(function (_) {
                    return a;
                });
            });
        }
    }, {
        key: "map",
        value: function map(f) {
            return new IOFlatMap(this, function (a) {
                return IO.now(f(a));
            });
        }
    }, {
        key: "memoize",
        value: function memoize() {
            switch (this._funADType) {
                case "pure":
                    return this;
                case "always":
                    var always = this;
                    return new IOOnce(always.thunk, false);
                case "memoize":
                    var mem = this;
                    if (!mem.onlySuccess) return mem;
                    return new IOMemoize(this, false);
                default:
                    return new IOMemoize(this, false);
            }
        }
    }, {
        key: "memoizeOnSuccess",
        value: function memoizeOnSuccess() {
            switch (this._funADType) {
                case "pure":
                case "once":
                case "memoize":
                    return this;
                case "always":
                    var always = this;
                    return new IOOnce(always.thunk, true);
                default:
                    return new IOMemoize(this, true);
            }
        }
    }, {
        key: "recover",
        value: function recover(f) {
            return this.recoverWith(function (a) {
                return IO.now(f(a));
            });
        }
    }, {
        key: "recoverWith",
        value: function recoverWith(f) {
            return this.transformWith(f, IO.now);
        }
    }, {
        key: "timeout",
        value: function timeout(after) {
            var fb = IO.raise(new TimeoutError(Duration.of(after).toString()));
            return this.timeoutTo(after, fb);
        }
    }, {
        key: "timeoutTo",
        value: function timeoutTo(after, fallback) {
            var other = IO.delayedTick(after).flatMap(function (_) {
                return fallback;
            });
            var lst = [this, other];
            return IO.firstCompletedOf(lst);
        }
    }, {
        key: "transform",
        value: function transform(failure, success) {
            return this.transformWith(function (e) {
                return IO.now(failure(e));
            }, function (a) {
                return IO.now(success(a));
            });
        }
    }, {
        key: "transformWith",
        value: function transformWith(failure, success) {
            return new IOFlatMap(this, success, failure);
        }
    }], [{
        key: "always",
        value: function always(thunk) {
            return new IOAlways(thunk);
        }
    }, {
        key: "async",
        value: function async(register) {
            return IO.asyncUnsafe(function (ctx, cb) {
                var ec = ctx.scheduler;
                var conn = ctx.connection;

                ec.trampoline(function () {
                    var safe = ioSafeCallback(ec, conn, cb);
                    try {
                        var ref = register(ec, safe);

                        conn.push(ref || Cancelable.empty());
                    } catch (e) {
                        safe(Failure(e));
                    }
                });
            });
        }
    }, {
        key: "asyncUnsafe",
        value: function asyncUnsafe(register) {
            return new IOAsync(register);
        }
    }, {
        key: "defer",
        value: function defer(thunk) {
            return IO.unit().flatMap(function (_) {
                return thunk();
            });
        }
    }, {
        key: "deferAction",
        value: function deferAction(f) {
            return IO.asyncUnsafe(function (ctx, cb) {
                var ec = ctx.scheduler;
                var ioa = void 0;
                try {
                    ioa = f(ec);
                } catch (e) {
                    ioa = IO.raise(e);
                }
                ec.trampoline(function () {
                    return IO.unsafeStart(ioa, ctx, cb);
                });
            });
        }
    }, {
        key: "deferFuture",
        value: function deferFuture(thunk) {
            return IO.suspend(function () {
                return IO.fromFuture(thunk());
            });
        }
    }, {
        key: "deferFutureAction",
        value: function deferFutureAction(f) {
            return IO.deferAction(function (ec) {
                return IO.fromFuture(f(ec));
            });
        }
    }, {
        key: "delayedTick",
        value: function delayedTick(delay) {
            return IO.asyncUnsafe(function (ctx, cb) {
                var conn = ctx.connection;
                var task = ctx.scheduler.scheduleOnce(delay, function () {
                    conn.pop();
                    cb(Try.unit());
                });
                conn.push(task);
            });
        }
    }, {
        key: "firstCompletedOf",
        value: function firstCompletedOf(list) {
            return ioListToFutureProcess(list, Future.firstCompletedOf);
        }
    }, {
        key: "fromFuture",
        value: function fromFuture(fa) {
            if (!fa.value().isEmpty()) return IO.fromTry(fa.value().get());
            return IO.asyncUnsafe(function (ctx, cb) {
                ctx.connection.push(fa);
                fa.onComplete(function (result) {
                    ctx.connection.pop();
                    cb(result);
                });
            });
        }
    }, {
        key: "fromTry",
        value: function fromTry(a) {
            return new IOPure(a);
        }
    }, {
        key: "fork",
        value: function fork(fa, ec) {
            return IO.shift(ec).flatMap(function (_) {
                return fa;
            });
        }
    }, {
        key: "map2",
        value: function map2(fa1, fa2, f) {
            var fl = IO.sequence([fa1, fa2]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1]);
            });
        }
    }, {
        key: "map3",
        value: function map3(fa1, fa2, fa3, f) {
            var fl = IO.sequence([fa1, fa2, fa3]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2]);
            });
        }
    }, {
        key: "map4",
        value: function map4(fa1, fa2, fa3, fa4, f) {
            var fl = IO.sequence([fa1, fa2, fa3, fa4]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3]);
            });
        }
    }, {
        key: "map5",
        value: function map5(fa1, fa2, fa3, fa4, fa5, f) {
            var fl = IO.sequence([fa1, fa2, fa3, fa4, fa5]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3], lst[4]);
            });
        }
    }, {
        key: "map6",
        value: function map6(fa1, fa2, fa3, fa4, fa5, fa6, f) {
            var fl = IO.sequence([fa1, fa2, fa3, fa4, fa5, fa6]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3], lst[4], lst[5]);
            });
        }
    }, {
        key: "now",
        value: function now(value) {
            return new IOPure(Success(value));
        }
    }, {
        key: "of",
        value: function of(thunk) {
            return IO.always(thunk);
        }
    }, {
        key: "once",
        value: function once(thunk) {
            return new IOOnce(thunk, false);
        }
    }, {
        key: "parMap2",
        value: function parMap2(fa1, fa2, f) {
            var fl = IO.gather([fa1, fa2]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1]);
            });
        }
    }, {
        key: "parMap3",
        value: function parMap3(fa1, fa2, fa3, f) {
            var fl = IO.gather([fa1, fa2, fa3]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2]);
            });
        }
    }, {
        key: "parMap4",
        value: function parMap4(fa1, fa2, fa3, fa4, f) {
            var fl = IO.gather([fa1, fa2, fa3, fa4]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3]);
            });
        }
    }, {
        key: "parMap5",
        value: function parMap5(fa1, fa2, fa3, fa4, fa5, f) {
            var fl = IO.gather([fa1, fa2, fa3, fa4, fa5]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3], lst[4]);
            });
        }
    }, {
        key: "parMap6",
        value: function parMap6(fa1, fa2, fa3, fa4, fa5, fa6, f) {
            var fl = IO.gather([fa1, fa2, fa3, fa4, fa5, fa6]);
            return fl.map(function (lst) {
                return f(lst[0], lst[1], lst[2], lst[3], lst[4], lst[5]);
            });
        }
    }, {
        key: "pure",
        value: function pure(value) {
            return IO.now(value);
        }
    }, {
        key: "raise",
        value: function raise(e) {
            return new IOPure(Failure(e));
        }
    }, {
        key: "sequence",
        value: function sequence(list) {
            return ioSequence(list);
        }
    }, {
        key: "gather",
        value: function gather(list) {
            return ioListToFutureProcess(list, Future.sequence);
        }
    }, {
        key: "shift",
        value: function shift(ec) {
            if (!ec) return ioShiftDefaultRef;
            return ioShift(ec);
        }
    }, {
        key: "suspend",
        value: function suspend(thunk) {
            return IO.unit().flatMap(function (_) {
                return thunk();
            });
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            try {
                return f(a).flatMap(function (either) {
                    if (either.isRight()) {
                        return IO.now(either.get());
                    } else {
                        return IO.tailRecM(either.swap().get(), f);
                    }
                });
            } catch (e) {
                return IO.raise(e);
            }
        }
    }, {
        key: "unit",
        value: function unit() {
            return ioUnitRef;
        }
    }, {
        key: "unsafeStart",
        value: function unsafeStart(source, context, cb) {
            return ioGenericRunLoop(source, context.scheduler, context, cb, null, null, null);
        }
    }]);
    return IO;
}();

var IOPure = function (_IO) {
    inherits(IOPure, _IO);

    function IOPure(value) {
        classCallCheck(this, IOPure);

        var _this5 = possibleConstructorReturn(this, (IOPure.__proto__ || Object.getPrototypeOf(IOPure)).call(this));

        _this5.value = value;
        _this5._funADType = "pure";
        return _this5;
    }

    return IOPure;
}(IO);

var ioUnitRef = new IOPure(Try.unit());

var IOOnce = function (_IO2) {
    inherits(IOOnce, _IO2);

    function IOOnce(thunk, onlyOnSuccess) {
        classCallCheck(this, IOOnce);

        var _this6 = possibleConstructorReturn(this, (IOOnce.__proto__ || Object.getPrototypeOf(IOOnce)).call(this));

        _this6._funADType = "once";
        _this6._thunk = thunk;
        _this6.onlyOnSuccess = onlyOnSuccess;
        return _this6;
    }

    createClass(IOOnce, [{
        key: "memoize",
        value: function memoize() {
            if (this.onlyOnSuccess && this._thunk) return new IOOnce(this._thunk, false);else return this;
        }
    }, {
        key: "runTry",
        value: function runTry() {
            if (this._thunk) {
                var result = Try.of(this._thunk);
                if (result.isSuccess() || !this.onlyOnSuccess) {
                    delete this._thunk;
                    delete this.onlyOnSuccess;
                    this.cache = result;
                }
                return result;
            }
            return this.cache;
        }
    }]);
    return IOOnce;
}(IO);

var IOAlways = function (_IO3) {
    inherits(IOAlways, _IO3);

    function IOAlways(thunk) {
        classCallCheck(this, IOAlways);

        var _this7 = possibleConstructorReturn(this, (IOAlways.__proto__ || Object.getPrototypeOf(IOAlways)).call(this));

        _this7.thunk = thunk;
        _this7._funADType = "always";
        return _this7;
    }

    return IOAlways;
}(IO);

var IOFlatMap = function (_IO4) {
    inherits(IOFlatMap, _IO4);

    function IOFlatMap(source, f, g) {
        classCallCheck(this, IOFlatMap);

        var _this8 = possibleConstructorReturn(this, (IOFlatMap.__proto__ || Object.getPrototypeOf(IOFlatMap)).call(this));

        _this8.source = source;
        _this8.f = f;
        _this8.g = g;
        _this8._funADType = "flatMap";
        return _this8;
    }

    return IOFlatMap;
}(IO);

var IOAsync = function (_IO5) {
    inherits(IOAsync, _IO5);

    function IOAsync(register) {
        classCallCheck(this, IOAsync);

        var _this9 = possibleConstructorReturn(this, (IOAsync.__proto__ || Object.getPrototypeOf(IOAsync)).call(this));

        _this9.register = register;
        _this9._funADType = "async";
        return _this9;
    }

    return IOAsync;
}(IO);

var IOMemoize = function (_IO6) {
    inherits(IOMemoize, _IO6);

    function IOMemoize(source, onlySuccess) {
        classCallCheck(this, IOMemoize);

        var _this10 = possibleConstructorReturn(this, (IOMemoize.__proto__ || Object.getPrototypeOf(IOMemoize)).call(this));

        _this10._funADType = "memoize";
        _this10.source = source;
        _this10.result = null;
        _this10.onlySuccess = onlySuccess;
        return _this10;
    }

    return IOMemoize;
}(IO);

var IOContext = function () {
    function IOContext(scheduler) {
        var connection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new StackedCancelable();
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { autoCancelableRunLoops: false };
        classCallCheck(this, IOContext);

        this.scheduler = scheduler;
        this.options = options;
        this.connection = connection;

        if (options.autoCancelableRunLoops) this.shouldCancel = function () {
            return connection.isCanceled();
        };
    }

    createClass(IOContext, [{
        key: "markAsyncBoundary",
        value: function markAsyncBoundary() {
            this.scheduler.batchIndex = 0;
        }
    }, {
        key: "shouldCancel",
        value: function shouldCancel() {
            return false;
        }
    }]);
    return IOContext;
}();

function ioShift(ec) {
    return IO.asyncUnsafe(function (ctx, cb) {
        (ec || ctx.scheduler).executeAsync(function () {
            return cb(Try.unit());
        });
    });
}

var ioShiftDefaultRef = ioShift();

function _ioPopNextBind(bFirst, bRest) {
    var f = undefined;
    if (bFirst) f = bFirst;else if (bRest && bRest.length > 0) f = bRest.pop();
    if (f) return typeof f === "function" ? f : f[0];
    return null;
}

function _ioFindErrorHandler(bFirst, bRest) {
    var cursor = bFirst;
    do {
        if (cursor && typeof cursor !== "function") return cursor[1];
        cursor = bRest ? bRest.pop() : null;
    } while (cursor);
    return null;
}

var RestartCallback = function () {
    function RestartCallback(context, callback) {
        classCallCheck(this, RestartCallback);

        this.context = context;
        this.callback = callback;
        this.canCall = false;
        this.bFirst = null;
        this.bRest = null;
        this.asFunction = this.signal.bind(this);
    }

    createClass(RestartCallback, [{
        key: "prepare",
        value: function prepare(bFirst, bRest) {
            this.bFirst = bFirst;
            this.bRest = bRest;
            this.canCall = true;
        }
    }, {
        key: "signal",
        value: function signal(result) {
            if (this.canCall) {
                this.canCall = false;
                ioGenericRunLoop(new IOPure(result), this.context.scheduler, this.context, this.callback, this, this.bFirst, this.bRest);
            } else if (result.isFailure()) {
                this.context.scheduler.reportFailure(result.failed().get());
            }
        }
    }]);
    return RestartCallback;
}();

function ioExecuteAsync(register, context, cb, rcb, bFirst, bRest, frameIndex) {
    if (!context.shouldCancel()) {
        context.scheduler.batchIndex = frameIndex;
        var restart = rcb || new RestartCallback(context, cb);
        restart.prepare(bFirst, bRest);
        register(context, restart.asFunction);
    }
}

function ioRestartAsync(start, context, cb, rcb, bFirstInit, bRestInit) {
    if (!context.shouldCancel()) context.scheduler.executeAsync(function () {
        ioGenericRunLoop(start, context.scheduler, context, cb, rcb, bFirstInit, bRestInit);
    });
}

function ioGenericRunLoop(start, scheduler, context, cb, rcb, bFirstInit, bRestInit) {
    var current = start;
    var bFirst = bFirstInit;
    var bRest = bRestInit;
    var modulus = scheduler.executionModel.recommendedBatchSize - 1;
    var frameIndex = scheduler.batchIndex;
    while (true) {
        if (current instanceof Try) {
            if (current.isSuccess()) {
                var bind = _ioPopNextBind(bFirst, bRest);
                if (!bind) {
                    scheduler.batchIndex = frameIndex;
                    return cb(current);
                }
                try {
                    current = bind(current.get());
                } catch (e) {
                    current = Try.failure(e);
                }
            } else {
                var _bind = _ioFindErrorHandler(bFirst, bRest);
                if (!_bind) {
                    scheduler.batchIndex = frameIndex;
                    return cb(current);
                }
                try {
                    current = _bind(current.failed().get());
                } catch (e) {
                    current = Try.failure(e);
                }
            }
            bFirst = null;
            var nextIndex = frameIndex + 1 & modulus;

            if (nextIndex) {
                frameIndex = nextIndex;
            } else {
                var ctx = context || new IOContext(scheduler);

                var boxed = current instanceof Try ? new IOPure(current) : current;
                ioRestartAsync(boxed, ctx, cb, rcb, bFirst, bRest);
                return ctx.connection;
            }
        } else switch (current._funADType) {
            case "pure":
                current = current.value;
                break;
            case "always":
                current = Try.of(current.thunk);
                break;
            case "once":
                current = current.runTry();
                break;
            case "flatMap":
                var flatM = current;
                if (bFirst) {
                    if (!bRest) bRest = [];
                    bRest.push(bFirst);
                }
                bFirst = !flatM.g ? flatM.f : [flatM.f, flatM.g];
                current = flatM.source;
                break;
            case "async":
                var async = current;
                var _ctx = context || new IOContext(scheduler);
                ioExecuteAsync(async.register, _ctx, cb, rcb, bFirst, bRest, frameIndex);
                return _ctx.connection;
            case "memoize":
                var mem = current;
                return ioStartMemoize(mem, scheduler, context, cb, bFirst, bRest, frameIndex);
        }
    }
}

function ioToFutureGoAsync(start, scheduler, bFirst, bRest, forcedAsync) {
    return Future.create(function (cb) {
        var ctx = new IOContext(scheduler);
        if (forcedAsync) ioRestartAsync(start, ctx, cb, null, bFirst, bRest);else ioGenericRunLoop(start, scheduler, ctx, cb, null, bFirst, bRest);
        return ctx.connection;
    });
}

function taskToFutureRunLoop(start, scheduler) {
    var current = start;
    var bFirst = null;
    var bRest = null;
    var modulus = scheduler.executionModel.recommendedBatchSize - 1;
    var frameIndex = scheduler.batchIndex;
    while (true) {
        if (current instanceof Try) {
            if (current.isSuccess()) {
                var bind = _ioPopNextBind(bFirst, bRest);
                if (!bind) {
                    scheduler.batchIndex = frameIndex;
                    return Future.pure(current.get());
                }
                try {
                    current = bind(current.get());
                } catch (e) {
                    current = new IOPure(Try.failure(e));
                }
            } else {
                var err = current.failed().get();
                var _bind2 = _ioFindErrorHandler(bFirst, bRest);
                if (!_bind2) {
                    scheduler.batchIndex = frameIndex;
                    return Future.raise(err);
                }
                try {
                    current = _bind2(err);
                } catch (e) {
                    current = new IOPure(Try.failure(e));
                }
            }
            bFirst = null;
            var nextIndex = frameIndex + 1 & modulus;

            if (nextIndex) {
                frameIndex = nextIndex;
            } else {
                return ioToFutureGoAsync(current, scheduler, bFirst, bRest, true);
            }
        } else switch (current._funADType) {
            case "pure":
                current = current.value;
                break;
            case "always":
                current = Try.of(current.thunk);
                break;
            case "once":
                current = current.runTry();
                break;
            case "flatMap":
                var flatM = current;
                if (bFirst) {
                    if (!bRest) bRest = [];
                    bRest.push(bFirst);
                }
                bFirst = !flatM.g ? flatM.f : [flatM.f, flatM.g];
                current = flatM.source;
                break;
            case "async":
            case "memoize":
                return ioToFutureGoAsync(current, scheduler, bFirst, bRest, false);
        }
    }
}

function ioSafeCallback(ec, conn, cb) {
    var called = false;
    return function (r) {
        if (!called) {
            called = true;

            ec.trampoline(function () {
                conn.pop();
                cb(r);
            });
        } else if (r.isFailure()) {
            ec.reportFailure(r.failed().get());
        }
    };
}

function ioStartMemoize(fa, ec, context, cb, bFirstInit, bRestInit, frameIndex) {
    ec.batchIndex = frameIndex;

    var state = void 0;

    if (fa.result) {
        state = fa.result;
    } else {
        var f = ioToFutureGoAsync(fa.source, ec, null, null, false);
        if (f.value().isEmpty()) {
            fa.result = f;
            state = f;
            f.onComplete(function (r) {
                if (r.isSuccess() || !fa.onlySuccess) {
                    fa.result = r;

                    delete fa.source;
                } else {
                    fa.result = null;
                }
            });
        } else {
            state = f.value().get();

            if (state.isSuccess() || !fa.onlySuccess) fa.result = state;
        }
    }

    var io = state instanceof Try ? new IOPure(state) : IO.fromFuture(state);
    ioGenericRunLoop(io, ec, context, cb, null, bFirstInit, bRestInit);
}

function ioSequence(list) {
    return IO.of(function () {
        return iteratorOf(list);
    }).flatMap(function (cursor) {
        return ioSequenceLoop([], cursor);
    });
}

function ioSequenceLoop(acc, cursor) {
    var _loop = function _loop() {
        var elem = cursor.next();
        var isDone = elem.done;
        if (elem.value) {
            var io = elem.value;
            return {
                v: io.flatMap(function (a) {
                    acc.push(a);
                    if (isDone) return IO.pure(acc);
                    return ioSequenceLoop(acc, cursor);
                })
            };
        } else {
            if (isDone) return {
                    v: IO.pure(acc)
                };
        }
    };

    while (true) {
        var _ret = _loop();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    }
}

function ioListToFutureProcess(list, f) {
    return IO.asyncUnsafe(function (ctx, cb) {
        ctx.scheduler.trampoline(function () {
            var streamErrors = true;
            try {
                var futures = [];
                var array = iterableToArray(list);
                streamErrors = false;
                for (var i = 0; i < array.length; i++) {
                    var io = array[i];
                    var _f = io.run(ctx.scheduler);
                    futures.push(_f);
                }
                var all = f(futures, ctx.scheduler);
                ctx.connection.push(all);
                all.onComplete(ioSafeCallback(ctx.scheduler, ctx.connection, cb));
            } catch (e) {
                if (streamErrors) cb(Failure(e));else ctx.scheduler.reportFailure(e);
            }
        });
    });
}

export { Eval, IO, IOContext };
//# sourceMappingURL=es5.js.map
