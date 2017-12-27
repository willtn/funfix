import { Either, IllegalArgumentError, Left, NotImplementedError, Option, Right, Some, Success, Try, applyMixins, id, is } from 'funfix-core/dist/es5';
import { Eval, IO } from 'funfix-effect/dist/es5';
import { Future } from 'funfix-exec/dist/es5';

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





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var Equiv = function () {
    function Equiv(lh, rh) {
        classCallCheck(this, Equiv);

        this.lh = lh;
        this.rh = rh;
    }

    createClass(Equiv, null, [{
        key: "of",
        value: function of(lh, rh) {
            return new Equiv(lh, rh);
        }
    }]);
    return Equiv;
}();

function registerTypeClassInstance(tc) {
    return function (c, instance) {
        var obj = c;
        var types = obj["_funTypes"] || {};
        obj["_funTypes"] = types;
        var existing = types[tc._funTypeId];
        if (existing) {
            if (existing === instance) return;

            var name = existing.constructor.name;
            throw new IllegalArgumentError("Type class coherence issue, " + (name + "<" + c.name + "> is already defined!"));
        }
        types[tc._funTypeId] = instance;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = tc._funSupertypeIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var id$$1 = _step.value;

                if (!types[id$$1]) types[id$$1] = instance;
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
    };
}

function getTypeClassInstance(tc) {
    return function (c) {
        var obj = c;
        var types = obj["_funTypes"] || {};
        var instance = types[tc._funTypeId];
        if (instance) return instance;
        throw new NotImplementedError(tc.name + "<" + obj.name + ">");
    };
}

var Eq = function () {
    function Eq() {
        classCallCheck(this, Eq);
    }

    createClass(Eq, null, [{
        key: "testEq",
        value: function testEq(lh, rh) {
            if (!lh) return is(lh, rh);
            var types = lh.constructor["_funTypes"] || {};
            var instance = types[Eq._funTypeId];
            if (instance) return instance.eqv(lh, rh);

            return is(lh, rh);
        }
    }]);
    return Eq;
}();

Eq._funTypeId = "eq";

Eq._funSupertypeIds = [];

var EqLaws = function () {
    function EqLaws() {
        classCallCheck(this, EqLaws);
    }

    createClass(EqLaws, [{
        key: "reflexive",
        value: function reflexive(a) {
            return this.F.eqv(a, a);
        }
    }, {
        key: "symmetric",
        value: function symmetric(x, y) {
            return this.F.eqv(x, y) === this.F.eqv(y, x);
        }
    }, {
        key: "transitive",
        value: function transitive(x, y, z) {
            return !(this.F.eqv(x, y) && this.F.eqv(y, z)) || this.F.eqv(x, z);
        }
    }]);
    return EqLaws;
}();

var eqOf = getTypeClassInstance(Eq);

function eqLawsOf(instance) {
    return new (function (_EqLaws) {
        inherits(_class, _EqLaws);

        function _class() {
            classCallCheck(this, _class);

            var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));

            _this.F = instance;
            return _this;
        }

        return _class;
    }(EqLaws))();
}

var Functor = function Functor() {
  classCallCheck(this, Functor);
};

Functor._funTypeId = "functor";

Functor._funSupertypeIds = [];

var FunctorLaws = function () {
  function FunctorLaws() {
    classCallCheck(this, FunctorLaws);
  }

  createClass(FunctorLaws, [{
    key: "covariantIdentity",
    value: function covariantIdentity(fa) {
      return Equiv.of(this.F.map(fa, id), fa);
    }
  }, {
    key: "covariantComposition",
    value: function covariantComposition(fa, f, g) {
      return Equiv.of(this.F.map(this.F.map(fa, f), g), this.F.map(fa, function (x) {
        return g(f(x));
      }));
    }
  }]);
  return FunctorLaws;
}();

var functorOf = getTypeClassInstance(Functor);

function functorLawsOf(instance) {
  return new (function (_FunctorLaws) {
    inherits(_class, _FunctorLaws);

    function _class() {
      classCallCheck(this, _class);

      var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));

      _this.F = instance;
      return _this;
    }

    return _class;
  }(FunctorLaws))();
}

var Apply = function () {
    function Apply() {
        classCallCheck(this, Apply);
    }

    createClass(Apply, [{
        key: "map2",
        value: function map2(fa, fb, f) {
            return this.ap(fb, this.map(fa, function (a) {
                return function (b) {
                    return f(a, b);
                };
            }));
        }
    }, {
        key: "product",
        value: function product(fa, fb) {
            return this.map2(fa, fb, function (a, b) {
                return [a, b];
            });
        }
    }]);
    return Apply;
}();

Apply._funTypeId = "apply";

Apply._funSupertypeIds = ["functor"];
applyMixins(Apply, [Functor]);

var ApplyLaws = function () {
    function ApplyLaws() {
        classCallCheck(this, ApplyLaws);
    }

    createClass(ApplyLaws, [{
        key: "applyComposition",
        value: function applyComposition(fa, fab, fbc) {
            var F = this.F;
            var compose = function compose(f) {
                return function (g) {
                    return function (a) {
                        return f(g(a));
                    };
                };
            };
            return Equiv.of(F.ap(F.ap(fa, fab), fbc), F.ap(fa, F.ap(fab, F.map(fbc, compose))));
        }
    }, {
        key: "applyProductConsistency",
        value: function applyProductConsistency(fa, f) {
            var F = this.F;
            return Equiv.of(F.ap(fa, f), F.map(F.product(f, fa), function (p) {
                var _p = slicedToArray(p, 2),
                    f = _p[0],
                    a = _p[1];

                return f(a);
            }));
        }
    }, {
        key: "applyMap2Consistency",
        value: function applyMap2Consistency(fa, f) {
            var F = this.F;
            return Equiv.of(F.ap(fa, f), F.map2(f, fa, function (f, a) {
                return f(a);
            }));
        }
    }]);
    return ApplyLaws;
}();
applyMixins(ApplyLaws, [FunctorLaws]);

var applyOf = getTypeClassInstance(Apply);

function applyLawsOf(instance) {
    return new (function (_ApplyLaws) {
        inherits(_class, _ApplyLaws);

        function _class() {
            classCallCheck(this, _class);

            var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));

            _this.F = instance;
            return _this;
        }

        return _class;
    }(ApplyLaws))();
}

var Applicative = function () {
    function Applicative() {
        classCallCheck(this, Applicative);
    }

    createClass(Applicative, [{
        key: "unit",
        value: function unit() {
            return this.pure(undefined);
        }
    }, {
        key: "map",
        value: function map(fa, f) {
            return this.ap(fa, this.pure(f));
        }
    }]);
    return Applicative;
}();

Applicative._funTypeId = "applicative";

Applicative._funSupertypeIds = ["functor", "apply"];
applyMixins(Applicative, [Apply]);

var ApplicativeLaws = function () {
    function ApplicativeLaws() {
        classCallCheck(this, ApplicativeLaws);
    }

    createClass(ApplicativeLaws, [{
        key: "applicativeIdentity",
        value: function applicativeIdentity(fa) {
            var F = this.F;
            return Equiv.of(F.ap(fa, F.pure(function (a) {
                return a;
            })), fa);
        }
    }, {
        key: "applicativeHomomorphism",
        value: function applicativeHomomorphism(a, f) {
            var F = this.F;
            return Equiv.of(F.ap(F.pure(a), F.pure(f)), F.pure(f(a)));
        }
    }, {
        key: "applicativeInterchange",
        value: function applicativeInterchange(a, ff) {
            var F = this.F;
            return Equiv.of(F.ap(F.pure(a), ff), F.ap(ff, F.pure(function (f) {
                return f(a);
            })));
        }
    }, {
        key: "applicativeMap",
        value: function applicativeMap(fa, f) {
            var F = this.F;
            return Equiv.of(F.map(fa, f), F.ap(fa, F.pure(f)));
        }
    }, {
        key: "applicativeComposition",
        value: function applicativeComposition(fa, fab, fbc) {
            var F = this.F;
            var compose = function compose(f) {
                return function (g) {
                    return function (a) {
                        return f(g(a));
                    };
                };
            };
            return Equiv.of(F.ap(fa, F.ap(fab, F.ap(fbc, F.pure(compose)))), F.ap(F.ap(fa, fab), fbc));
        }
    }, {
        key: "applicativeUnit",
        value: function applicativeUnit(a) {
            var F = this.F;
            return Equiv.of(F.map(F.unit(), function (_) {
                return a;
            }), F.pure(a));
        }
    }]);
    return ApplicativeLaws;
}();
applyMixins(ApplicativeLaws, [ApplyLaws]);

var applicativeOf = getTypeClassInstance(Applicative);

function applicativeLawsOf(instance) {
    return new (function (_ApplicativeLaws) {
        inherits(_class2, _ApplicativeLaws);

        function _class2() {
            classCallCheck(this, _class2);

            var _this2 = possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));

            _this2.F = instance;
            return _this2;
        }

        return _class2;
    }(ApplicativeLaws))();
}

var ApplicativeError = function () {
    function ApplicativeError() {
        classCallCheck(this, ApplicativeError);
    }

    createClass(ApplicativeError, [{
        key: "recover",
        value: function recover(fa, f) {
            var F = this;
            return F.recoverWith(fa, function (e) {
                return F.pure(f(e));
            });
        }
    }, {
        key: "attempt",
        value: function attempt(fa) {
            var F = this;
            return F.recover(F.map(fa, function (a) {
                return Either.right(a);
            }), Left);
        }
    }]);
    return ApplicativeError;
}();

ApplicativeError._funTypeId = "applicativeError";

ApplicativeError._funSupertypeIds = ["functor", "apply", "applicative"];
applyMixins(ApplicativeError, [Applicative]);

var ApplicativeErrorLaws = function () {
    function ApplicativeErrorLaws() {
        classCallCheck(this, ApplicativeErrorLaws);
    }

    createClass(ApplicativeErrorLaws, [{
        key: "applicativeErrorRecoverWith",
        value: function applicativeErrorRecoverWith(e, f) {
            var F = this.F;
            return Equiv.of(F.recoverWith(F.raise(e), f), f(e));
        }
    }, {
        key: "applicativeErrorRecover",
        value: function applicativeErrorRecover(e, f) {
            var F = this.F;
            return Equiv.of(F.recover(F.raise(e), f), F.pure(f(e)));
        }
    }, {
        key: "recoverWithPure",
        value: function recoverWithPure(a, f) {
            var F = this.F;
            return Equiv.of(F.recoverWith(F.pure(a), f), F.pure(a));
        }
    }, {
        key: "recoverPure",
        value: function recoverPure(a, f) {
            var F = this.F;
            return Equiv.of(F.recover(F.pure(a), f), F.pure(a));
        }
    }, {
        key: "raiseErrorAttempt",
        value: function raiseErrorAttempt(e) {
            var F = this.F;
            return Equiv.of(F.attempt(F.raise(e)), F.pure(Left(e)));
        }
    }, {
        key: "pureAttempt",
        value: function pureAttempt(a) {
            var F = this.F;
            return Equiv.of(F.attempt(F.pure(a)), F.pure(Right(a)));
        }
    }]);
    return ApplicativeErrorLaws;
}();
applyMixins(ApplicativeErrorLaws, [ApplicativeLaws]);

var applicativeErrorOf = getTypeClassInstance(ApplicativeError);

function applicativeErrorLawsOf(instance) {
    return new (function (_ApplicativeErrorLaws) {
        inherits(_class3, _ApplicativeErrorLaws);

        function _class3() {
            classCallCheck(this, _class3);

            var _this3 = possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).apply(this, arguments));

            _this3.F = instance;
            return _this3;
        }

        return _class3;
    }(ApplicativeErrorLaws))();
}

var FlatMap = function () {
    function FlatMap() {
        classCallCheck(this, FlatMap);
    }

    createClass(FlatMap, [{
        key: "followedBy",
        value: function followedBy(fa, fb) {
            return this.flatMap(fa, function (_) {
                return fb;
            });
        }
    }, {
        key: "followedByL",
        value: function followedByL(fa, fb) {
            return this.flatMap(fa, function (_) {
                return fb();
            });
        }
    }, {
        key: "forEffect",
        value: function forEffect(fa, fb) {
            var _this = this;

            return this.flatMap(fa, function (a) {
                return _this.map(fb, function (_) {
                    return a;
                });
            });
        }
    }, {
        key: "forEffectL",
        value: function forEffectL(fa, fb) {
            var _this2 = this;

            return this.flatMap(fa, function (a) {
                return _this2.map(fb(), function (_) {
                    return a;
                });
            });
        }
    }, {
        key: "ap",
        value: function ap(fa, ff) {
            var _this3 = this;

            return this.flatMap(fa, function (a) {
                return _this3.map(ff, function (f) {
                    return f(a);
                });
            });
        }
    }, {
        key: "map2",
        value: function map2(fa, fb, f) {
            var _this4 = this;

            return this.flatMap(fa, function (a) {
                return _this4.map(fb, function (b) {
                    return f(a, b);
                });
            });
        }
    }, {
        key: "product",
        value: function product(fa, fb) {
            var _this5 = this;

            return this.flatMap(fa, function (a) {
                return _this5.map(fb, function (b) {
                    return [a, b];
                });
            });
        }
    }]);
    return FlatMap;
}();

FlatMap._funTypeId = "flatMap";

FlatMap._funSupertypeIds = ["functor", "apply"];

var FlatMapLaws = function () {
    function FlatMapLaws() {
        classCallCheck(this, FlatMapLaws);
    }

    createClass(FlatMapLaws, [{
        key: "flatMapAssociativity",
        value: function flatMapAssociativity(fa, f, g) {
            var F = this.F;
            return Equiv.of(F.flatMap(F.flatMap(fa, f), g), F.flatMap(fa, function (a) {
                return F.flatMap(f(a), g);
            }));
        }
    }, {
        key: "flatMapConsistentApply",
        value: function flatMapConsistentApply(fa, fab) {
            var F = this.F;
            return Equiv.of(F.ap(fa, fab), F.flatMap(fab, function (f) {
                return F.map(fa, f);
            }));
        }
    }, {
        key: "followedByConsistency",
        value: function followedByConsistency(fa, fb) {
            var F = this.F;
            return Equiv.of(F.followedBy(fa, fb), F.flatMap(fa, function (_) {
                return fb;
            }));
        }
    }, {
        key: "followedByLConsistency",
        value: function followedByLConsistency(fa, fb) {
            var F = this.F;
            return Equiv.of(F.followedByL(fa, function () {
                return fb;
            }), F.flatMap(fa, function (_) {
                return fb;
            }));
        }
    }, {
        key: "forEffectConsistency",
        value: function forEffectConsistency(fa, fb) {
            var F = this.F;
            return Equiv.of(F.forEffect(fa, fb), F.flatMap(fa, function (a) {
                return F.map(fb, function (_) {
                    return a;
                });
            }));
        }
    }, {
        key: "forEffectLConsistency",
        value: function forEffectLConsistency(fa, fb) {
            var F = this.F;
            return Equiv.of(F.forEffectL(fa, function () {
                return fb;
            }), F.flatMap(fa, function (a) {
                return F.map(fb, function (_) {
                    return a;
                });
            }));
        }
    }, {
        key: "tailRecMConsistentFlatMap",
        value: function tailRecMConsistentFlatMap(a, f) {
            var F = this.F;
            var bounce = function bounce(n) {
                return F.tailRecM([a, n], function (x) {
                    var _x = slicedToArray(x, 2),
                        a0 = _x[0],
                        i = _x[1];

                    return i > 0 ? F.map(f(a0), function (a1) {
                        return Left([a1, i - 1]);
                    }) : F.map(f(a0), Right);
                });
            };

            return Equiv.of(bounce(1), F.flatMap(bounce(0), f));
        }
    }]);
    return FlatMapLaws;
}();
applyMixins(FlatMapLaws, [ApplyLaws]);

var flatMapOf = getTypeClassInstance(FlatMap);

function flatMapLawsOf(instance) {
    return new (function (_FlatMapLaws) {
        inherits(_class, _FlatMapLaws);

        function _class() {
            classCallCheck(this, _class);

            var _this6 = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));

            _this6.F = instance;
            return _this6;
        }

        return _class;
    }(FlatMapLaws))();
}

var Monad = function () {
    function Monad() {
        classCallCheck(this, Monad);
    }

    createClass(Monad, [{
        key: "ap",
        value: function ap(fa, ff) {
            var _this7 = this;

            return this.flatMap(fa, function (a) {
                return _this7.map(ff, function (f) {
                    return f(a);
                });
            });
        }
    }, {
        key: "map",
        value: function map(fa, f) {
            var _this8 = this;

            return this.flatMap(fa, function (a) {
                return _this8.pure(f(a));
            });
        }
    }, {
        key: "map2",
        value: function map2(fa, fb, f) {
            var F = this;
            return F.flatMap(fa, function (a) {
                return F.map(fb, function (b) {
                    return f(a, b);
                });
            });
        }
    }, {
        key: "product",
        value: function product(fa, fb) {
            var F = this;
            return F.flatMap(fa, function (a) {
                return F.map(fb, function (b) {
                    return [a, b];
                });
            });
        }
    }]);
    return Monad;
}();

Monad._funTypeId = "monad";

Monad._funSupertypeIds = ["functor", "apply", "applicative", "flatMap"];
applyMixins(Monad, [Applicative, FlatMap]);

var MonadLaws = function () {
    function MonadLaws() {
        classCallCheck(this, MonadLaws);
    }

    createClass(MonadLaws, [{
        key: "monadLeftIdentity",
        value: function monadLeftIdentity(a, f) {
            var F = this.F;
            return Equiv.of(F.flatMap(F.pure(a), f), f(a));
        }
    }, {
        key: "monadRightIdentity",
        value: function monadRightIdentity(fa) {
            var F = this.F;
            return Equiv.of(F.flatMap(fa, F.pure), fa);
        }
    }, {
        key: "mapFlatMapCoherence",
        value: function mapFlatMapCoherence(fa, f) {
            var F = this.F;
            return Equiv.of(F.flatMap(fa, function (a) {
                return F.pure(f(a));
            }), F.map(fa, f));
        }
    }, {
        key: "tailRecMStackSafety",
        value: function tailRecMStackSafety() {
            var F = this.F;
            var n = 10000;
            var res = F.tailRecM(0, function (i) {
                return F.pure(i < n ? Left(i + 1) : Right(i));
            });
            return Equiv.of(res, F.pure(n));
        }
    }]);
    return MonadLaws;
}();
applyMixins(MonadLaws, [ApplicativeLaws, FlatMapLaws]);

var monadOf = getTypeClassInstance(Monad);

function monadLawsOf(instance) {
    return new (function (_MonadLaws) {
        inherits(_class2, _MonadLaws);

        function _class2() {
            classCallCheck(this, _class2);

            var _this9 = possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));

            _this9.F = instance;
            return _this9;
        }

        return _class2;
    }(MonadLaws))();
}

var MonadError = function MonadError() {
    classCallCheck(this, MonadError);
};

MonadError._funTypeId = "monadError";

MonadError._funSupertypeIds = ["functor", "apply", "applicative", "monad", "applicativeError"];
applyMixins(MonadError, [Monad, ApplicativeError]);

var MonadErrorLaws = function () {
    function MonadErrorLaws() {
        classCallCheck(this, MonadErrorLaws);
    }

    createClass(MonadErrorLaws, [{
        key: "monadErrorLeftZero",
        value: function monadErrorLeftZero(e, f) {
            var F = this.F;
            return Equiv.of(F.flatMap(F.raise(e), f), F.raise(e));
        }
    }]);
    return MonadErrorLaws;
}();
applyMixins(MonadErrorLaws, [MonadLaws, ApplicativeErrorLaws]);

var monadErrorOf = getTypeClassInstance(MonadError);

function monadErrorLawsOf(instance) {
    return new (function (_MonadErrorLaws) {
        inherits(_class3, _MonadErrorLaws);

        function _class3() {
            classCallCheck(this, _class3);

            var _this10 = possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).apply(this, arguments));

            _this10.F = instance;
            return _this10;
        }

        return _class3;
    }(MonadErrorLaws))();
}

var CoflatMap = function CoflatMap() {
  classCallCheck(this, CoflatMap);
};

CoflatMap._funTypeId = "coflatMap";

CoflatMap._funSupertypeIds = ["functor"];
applyMixins(CoflatMap, [Functor]);

var CoflatMapLaws = function () {
  function CoflatMapLaws() {
    classCallCheck(this, CoflatMapLaws);
  }

  createClass(CoflatMapLaws, [{
    key: "coflatMapAssociativity",
    value: function coflatMapAssociativity(fa, f, g) {
      var F = this.F;
      return Equiv.of(F.coflatMap(F.coflatMap(fa, f), g), F.coflatMap(fa, function (a) {
        return g(F.coflatMap(a, f));
      }));
    }
  }, {
    key: "coflattenThroughMap",
    value: function coflattenThroughMap(fa) {
      var F = this.F;
      return Equiv.of(F.coflatten(F.coflatten(fa)), F.map(F.coflatten(fa), F.coflatten));
    }
  }, {
    key: "coflattenCoherence",
    value: function coflattenCoherence(fa, f) {
      var F = this.F;
      return Equiv.of(F.coflatMap(fa, f), F.map(F.coflatten(fa), f));
    }
  }, {
    key: "coflatMapIdentity",
    value: function coflatMapIdentity(fa) {
      var F = this.F;
      return Equiv.of(F.coflatten(fa), F.coflatMap(fa, id));
    }
  }]);
  return CoflatMapLaws;
}();
applyMixins(CoflatMapLaws, [FunctorLaws]);

var coflatMapOf = getTypeClassInstance(CoflatMap);

function coflatMapLawsOf(instance) {
  return new (function (_CoflatMapLaws) {
    inherits(_class, _CoflatMapLaws);

    function _class() {
      classCallCheck(this, _class);

      var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));

      _this.F = instance;
      return _this;
    }

    return _class;
  }(CoflatMapLaws))();
}

var Comonad = function Comonad() {
  classCallCheck(this, Comonad);
};

Comonad._funTypeId = "comonad";

Comonad._funSupertypeIds = ["functor", "coflatMap"];
applyMixins(Comonad, [CoflatMap]);

var ComonadLaws = function () {
  function ComonadLaws() {
    classCallCheck(this, ComonadLaws);
  }

  createClass(ComonadLaws, [{
    key: "extractCoflattenIdentity",
    value: function extractCoflattenIdentity(fa) {
      var F = this.F;
      return Equiv.of(F.extract(F.coflatten(fa)), fa);
    }
  }, {
    key: "mapCoflattenIdentity",
    value: function mapCoflattenIdentity(fa) {
      var F = this.F;
      return Equiv.of(F.map(F.coflatten(fa), F.extract), fa);
    }
  }, {
    key: "mapCoflatMapCoherence",
    value: function mapCoflatMapCoherence(fa, f) {
      var F = this.F;
      return Equiv.of(F.map(fa, f), F.coflatMap(fa, function (fa0) {
        return f(F.extract(fa0));
      }));
    }
  }, {
    key: "comonadLeftIdentity",
    value: function comonadLeftIdentity(fa) {
      var F = this.F;
      return Equiv.of(F.coflatMap(fa, F.extract), fa);
    }
  }, {
    key: "comonadRightIdentity",
    value: function comonadRightIdentity(fa, f) {
      var F = this.F;
      return Equiv.of(F.extract(F.coflatMap(fa, f)), f(fa));
    }
  }]);
  return ComonadLaws;
}();
applyMixins(ComonadLaws, [CoflatMapLaws]);

var comonadOf = getTypeClassInstance(Comonad);

function comonadLawsOf(instance) {
  return new (function (_ComonadLaws) {
    inherits(_class2, _ComonadLaws);

    function _class2() {
      classCallCheck(this, _class2);

      var _this2 = possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));

      _this2.F = instance;
      return _this2;
    }

    return _class2;
  }(ComonadLaws))();
}

var OptionInstances = function () {
    function OptionInstances() {
        classCallCheck(this, OptionInstances);

        this.__unit = Some(undefined);
    }

    createClass(OptionInstances, [{
        key: "eqv",
        value: function eqv(lh, rh) {
            if (lh === rh) return true;
            if (lh.isEmpty()) return rh.isEmpty();
            if (rh.isEmpty()) return false;
            return Eq.testEq(lh.get(), rh.get());
        }
    }, {
        key: "pure",
        value: function pure(a) {
            return Some(a);
        }
    }, {
        key: "unit",
        value: function unit() {
            return this.__unit;
        }
    }, {
        key: "ap",
        value: function ap(fa, ff) {
            return Option.map2(fa, ff, function (a, f) {
                return f(a);
            });
        }
    }, {
        key: "map",
        value: function map(fa, f) {
            return fa.map(f);
        }
    }, {
        key: "map2",
        value: function map2(fa, fb, f) {
            return Option.map2(fa, fb, f);
        }
    }, {
        key: "product",
        value: function product(fa, fb) {
            return Option.map2(fa, fb, function (a, b) {
                return [a, b];
            });
        }
    }, {
        key: "flatMap",
        value: function flatMap(fa, f) {
            return fa.flatMap(f);
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            return Option.tailRecM(a, f);
        }
    }, {
        key: "coflatMap",
        value: function coflatMap(fa, ff) {
            return Some(ff(fa));
        }
    }, {
        key: "coflatten",
        value: function coflatten(fa) {
            return Some(fa);
        }
    }]);
    return OptionInstances;
}();
OptionInstances.global = new OptionInstances();

applyMixins(OptionInstances, [Monad]);

registerTypeClassInstance(Eq)(Option, OptionInstances.global);
registerTypeClassInstance(Monad)(Option, OptionInstances.global);
registerTypeClassInstance(CoflatMap)(Option, OptionInstances.global);

var TryInstances = function () {
    function TryInstances() {
        classCallCheck(this, TryInstances);
    }

    createClass(TryInstances, [{
        key: "eqv",
        value: function eqv(lh, rh) {
            if (lh === rh) return true;
            if (lh.isSuccess()) {
                if (rh.isFailure()) return false;
                return Eq.testEq(lh.get(), rh.get());
            } else {
                if (rh.isSuccess()) return false;
                return Eq.testEq(lh.failed().get(), rh.failed().get());
            }
        }
    }, {
        key: "pure",
        value: function pure(a) {
            return Success(a);
        }
    }, {
        key: "unit",
        value: function unit() {
            return Try.unit();
        }
    }, {
        key: "ap",
        value: function ap(fa, ff) {
            return Try.map2(fa, ff, function (a, f) {
                return f(a);
            });
        }
    }, {
        key: "map",
        value: function map(fa, f) {
            return fa.map(f);
        }
    }, {
        key: "map2",
        value: function map2(fa, fb, f) {
            return Try.map2(fa, fb, f);
        }
    }, {
        key: "product",
        value: function product(fa, fb) {
            return Try.map2(fa, fb, function (a, b) {
                return [a, b];
            });
        }
    }, {
        key: "flatMap",
        value: function flatMap(fa, f) {
            return fa.flatMap(f);
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            return Try.tailRecM(a, f);
        }
    }, {
        key: "raise",
        value: function raise(e) {
            return Try.failure(e);
        }
    }, {
        key: "attempt",
        value: function attempt(fa) {
            return Try.success(fa.fold(function (e) {
                return Either.left(e);
            }, Either.right));
        }
    }, {
        key: "recoverWith",
        value: function recoverWith(fa, f) {
            return fa.recoverWith(f);
        }
    }, {
        key: "recover",
        value: function recover(fa, f) {
            return fa.recover(f);
        }
    }, {
        key: "coflatMap",
        value: function coflatMap(fa, ff) {
            return Success(ff(fa));
        }
    }, {
        key: "coflatten",
        value: function coflatten(fa) {
            return Success(fa);
        }
    }]);
    return TryInstances;
}();
TryInstances.global = new TryInstances();

applyMixins(TryInstances, [MonadError]);

registerTypeClassInstance(Eq)(Try, TryInstances.global);
registerTypeClassInstance(MonadError)(Try, TryInstances.global);
registerTypeClassInstance(CoflatMap)(Try, TryInstances.global);

var EitherInstances = function () {
    function EitherInstances() {
        classCallCheck(this, EitherInstances);

        this.__unit = Right(undefined);
    }

    createClass(EitherInstances, [{
        key: "eqv",
        value: function eqv(lh, rh) {
            if (lh === rh) return true;
            if (lh.isRight()) {
                if (rh.isLeft()) return false;
                return Eq.testEq(lh.get(), rh.get());
            } else {
                if (rh.isRight()) return false;
                return Eq.testEq(lh.swap().get(), rh.swap().get());
            }
        }
    }, {
        key: "pure",
        value: function pure(a) {
            return Right(a);
        }
    }, {
        key: "unit",
        value: function unit() {
            return this.__unit;
        }
    }, {
        key: "ap",
        value: function ap(fa, ff) {
            var faE = fa;
            var ffE = ff;
            return Either.map2(faE, ffE, function (a, f) {
                return f(a);
            });
        }
    }, {
        key: "map",
        value: function map(fa, f) {
            return fa.map(f);
        }
    }, {
        key: "map2",
        value: function map2(fa, fb, f) {
            return Either.map2(fa, fb, f);
        }
    }, {
        key: "product",
        value: function product(fa, fb) {
            return Either.map2(fa, fb, function (a, b) {
                return [a, b];
            });
        }
    }, {
        key: "flatMap",
        value: function flatMap(fa, f) {
            return fa.flatMap(f);
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            return Either.tailRecM(a, f);
        }
    }, {
        key: "coflatMap",
        value: function coflatMap(fa, ff) {
            return Right(ff(fa));
        }
    }, {
        key: "coflatten",
        value: function coflatten(fa) {
            return Right(fa);
        }
    }]);
    return EitherInstances;
}();
EitherInstances.global = new EitherInstances();

applyMixins(EitherInstances, [Monad]);

registerTypeClassInstance(Eq)(Either, EitherInstances.global);
registerTypeClassInstance(Monad)(Either, EitherInstances.global);
registerTypeClassInstance(CoflatMap)(Either, EitherInstances.global);

var EvalInstances = function () {
    function EvalInstances() {
        classCallCheck(this, EvalInstances);
    }

    createClass(EvalInstances, [{
        key: "pure",
        value: function pure(a) {
            return Eval.now(a);
        }
    }, {
        key: "flatMap",
        value: function flatMap(fa, f) {
            return fa.flatMap(f);
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            return Eval.tailRecM(a, f);
        }
    }, {
        key: "ap",
        value: function ap(fa, ff) {
            return fa.flatMap(function (a) {
                return ff.map(function (f) {
                    return f(a);
                });
            });
        }
    }, {
        key: "map",
        value: function map(fa, f) {
            return fa.map(f);
        }
    }, {
        key: "unit",
        value: function unit() {
            return Eval.unit();
        }
    }, {
        key: "coflatMap",
        value: function coflatMap(fa, ff) {
            return Eval.now(ff(fa));
        }
    }, {
        key: "coflatten",
        value: function coflatten(fa) {
            return Eval.now(fa);
        }
    }, {
        key: "extract",
        value: function extract(fa) {
            return fa.get();
        }
    }]);
    return EvalInstances;
}();
EvalInstances.global = new EvalInstances();

applyMixins(EvalInstances, [Monad, Comonad]);

registerTypeClassInstance(Monad)(Eval, EvalInstances.global);
registerTypeClassInstance(Comonad)(Eval, EvalInstances.global);

var FutureInstances = function () {
    function FutureInstances() {
        classCallCheck(this, FutureInstances);
    }

    createClass(FutureInstances, [{
        key: "pure",
        value: function pure(a) {
            return Future.pure(a);
        }
    }, {
        key: "flatMap",
        value: function flatMap(fa, f) {
            return fa.flatMap(f);
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            return Future.tailRecM(a, f);
        }
    }, {
        key: "ap",
        value: function ap(fa, ff) {
            return fa.flatMap(function (a) {
                return ff.map(function (f) {
                    return f(a);
                });
            });
        }
    }, {
        key: "map",
        value: function map(fa, f) {
            return fa.map(f);
        }
    }, {
        key: "unit",
        value: function unit() {
            return Future.unit();
        }
    }, {
        key: "raise",
        value: function raise(e) {
            return Future.raise(e);
        }
    }, {
        key: "attempt",
        value: function attempt(fa) {
            return fa.attempt();
        }
    }, {
        key: "recoverWith",
        value: function recoverWith(fa, f) {
            return fa.recoverWith(f);
        }
    }, {
        key: "recover",
        value: function recover(fa, f) {
            return fa.recover(f);
        }
    }, {
        key: "map2",
        value: function map2(fa, fb, f) {
            return Future.map2(fa, fb, f);
        }
    }, {
        key: "coflatMap",
        value: function coflatMap(fa, ff) {
            return Future.pure(ff(fa));
        }
    }, {
        key: "coflatten",
        value: function coflatten(fa) {
            return Future.pure(fa);
        }
    }]);
    return FutureInstances;
}();
FutureInstances.global = new FutureInstances();

applyMixins(FutureInstances, [MonadError, CoflatMap]);

registerTypeClassInstance(MonadError)(Future, FutureInstances.global);
registerTypeClassInstance(CoflatMap)(Future, FutureInstances.global);

var IOInstances = function () {
    function IOInstances() {
        classCallCheck(this, IOInstances);
    }

    createClass(IOInstances, [{
        key: "pure",
        value: function pure(a) {
            return IO.pure(a);
        }
    }, {
        key: "flatMap",
        value: function flatMap(fa, f) {
            return fa.flatMap(f);
        }
    }, {
        key: "tailRecM",
        value: function tailRecM(a, f) {
            return IO.tailRecM(a, f);
        }
    }, {
        key: "ap",
        value: function ap(fa, ff) {
            return fa.flatMap(function (a) {
                return ff.map(function (f) {
                    return f(a);
                });
            });
        }
    }, {
        key: "map",
        value: function map(fa, f) {
            return fa.map(f);
        }
    }, {
        key: "unit",
        value: function unit() {
            return IO.unit();
        }
    }, {
        key: "raise",
        value: function raise(e) {
            return IO.raise(e);
        }
    }, {
        key: "attempt",
        value: function attempt(fa) {
            return fa.attempt();
        }
    }, {
        key: "recoverWith",
        value: function recoverWith(fa, f) {
            return fa.recoverWith(f);
        }
    }, {
        key: "recover",
        value: function recover(fa, f) {
            return fa.recover(f);
        }
    }, {
        key: "map2",
        value: function map2(fa, fb, f) {
            return IO.map2(fa, fb, f);
        }
    }, {
        key: "followedBy",
        value: function followedBy(fa, fb) {
            return fa.followedBy(fb);
        }
    }, {
        key: "followedByL",
        value: function followedByL(fa, fb) {
            return fa.followedBy(IO.suspend(fb));
        }
    }, {
        key: "forEffect",
        value: function forEffect(fa, fb) {
            return fa.forEffect(fb);
        }
    }, {
        key: "forEffectL",
        value: function forEffectL(fa, fb) {
            return fa.forEffect(IO.suspend(fb));
        }
    }, {
        key: "product",
        value: function product(fa, fb) {
            return IO.map2(fa, fb, function (a, b) {
                return [a, b];
            });
        }
    }, {
        key: "coflatMap",
        value: function coflatMap(fa, ff) {
            return IO.pure(ff(fa));
        }
    }, {
        key: "coflatten",
        value: function coflatten(fa) {
            return IO.pure(fa);
        }
    }]);
    return IOInstances;
}();
IOInstances.global = new IOInstances();

applyMixins(IOInstances, [MonadError, CoflatMap]);

registerTypeClassInstance(MonadError)(IO, IOInstances.global);
registerTypeClassInstance(CoflatMap)(IO, IOInstances.global);

export { Equiv, registerTypeClassInstance, getTypeClassInstance, Eq, EqLaws, eqOf, eqLawsOf, Functor, FunctorLaws, functorOf, functorLawsOf, Apply, ApplyLaws, applyOf, applyLawsOf, Applicative, ApplicativeLaws, applicativeOf, applicativeLawsOf, ApplicativeError, ApplicativeErrorLaws, applicativeErrorOf, applicativeErrorLawsOf, FlatMap, FlatMapLaws, flatMapOf, flatMapLawsOf, Monad, MonadLaws, monadOf, monadLawsOf, MonadError, MonadErrorLaws, monadErrorOf, monadErrorLawsOf, CoflatMap, CoflatMapLaws, coflatMapOf, coflatMapLawsOf, Comonad, ComonadLaws, comonadOf, comonadLawsOf, OptionInstances, TryInstances, EitherInstances, EvalInstances, FutureInstances, IOInstances };
//# sourceMappingURL=es5.js.map
