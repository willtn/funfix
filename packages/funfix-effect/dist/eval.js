/*!
 * Copyright (c) 2017 by The Funfix Project Developers.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { iteratorOf } from "./internals";
/**
 * Eval is a monad which controls evaluation.
 *
 * This type wraps a value (or an expression that produces a value)
 * and can produce it on command via the {@link Eval.get get()}
 * method.
 *
 * There are three basic evaluation strategies:
 *
 *  - {@link Eval.now}: for describing strict values, evaluated
 *    immediately
 *  - {@link Eval.once}: evaluated only once when the value is needed,
 *    with the result memoized (cached) for subsequent evaluations
 *  - [[Eval.always]]: evaluated every time the value is needed,
 *    being equivalent to a function
 *
 * Eval supports stack-safe lazy computation via the {@link Eval.map .map}
 * and {@link Eval.flatMap .flatMap} methods, which use an internal
 * trampoline to avoid stack overflows. Computation done within `map`
 * and `flatMap` is always done lazily, even when applied to an
 * `Eval.now` instance.
 *
 * Use `map` and `flatMap` to chain computation, and use `get()` to
 * get the result when needed. It is also not good style to create
 * `Eval` instances whose computation involves calling `get()` on
 * another `Eval` instance -- this can defeat the trampolining and
 * lead to stack overflows.
 *
 * ```typescript
 * const rndInt = Eval.of(() => {
 *   const nr = Math.random() * 1000000
 *   return nr & nr
 * })
 *
 * const evenInt = () =>
 *   rndInt.flatMap(int => {
 *     if (i % 2 == 0)
 *       return Eval.now(i)
 *     else // Retry until we have an even number!
 *       return evenInt()
 *   })
 *
 * const cached = evenInt().memoize()
 *
 * // Nothing happens until now, this triggers the
 * // actual evaluation:
 * const n: number = cached.get()
 * ```
 *
 * ## Versus IO
 *
 * For dealing with lazy evaluation, the other alternative is
 * the {@link IO} data type.
 *
 * Differences between `Eval` and `IO`:
 *
 * 1. `IO` is capable of describing asynchronous computations as well
 * 2. `IO` is capable of error handling (it implements `MonadError`),
 *    whereas `Eval` does not provide error handling capabilities,
 *    being meant to be used for pure expressions (it implements
 *    `Comonad`, which is incompatible with `MonadError`)
 *
 * So if you need error handling capabilities
 * (i.e. `MonadError<Throwable, ?>`), or if you need to describe
 * asynchronous processes, then {@link IO} is for you. `Eval`
 * is a simpler data type with the sole purpose of controlling the
 * evaluation of expressions (i.e. strict versus lazy).
 *
 * ## Credits
 *
 * This type is inspired by `cats.Eval` from
 * {@link http://typelevel.org/cats/|Typelevel Cats}
 * and by `monix.eval.Coeval` from {@link https://monix.io|Monix}.
 *
 * @final
 */
export class Eval {
    /**
     * Evaluates the source `Eval` and returns the result.
     *
     * ```typescript
     * const ref = Eval.always(() => 100 * 2)
     *
     * ref.get() // 200
     * ```
     */
    get() { return evalRunLoop(this); }
    /**
     * Returns a new `Eval` that applies the mapping function to the
     * successful result emitted by the source.
     *
     * ```typescript
     * Eval.now(111).map(_ => _ * 2).get() // 222
     * ```
     */
    map(f) {
        return new FlatMap(this, (a) => Eval.now(f(a)));
    }
    /**
     * Creates a new `Eval` by applying a function to the successful
     * result of the source, and returns a new instance equivalent to
     * the result of the function.
     *
     * ```typescript
     * const rndInt = Eval.of(() => {
     *   const nr = Math.random() * 1000000
     *   return nr & nr
     * })
     *
     * const evenInt = () =>
     *   rndInt.flatMap(int => {
     *     if (i % 2 == 0)
     *       return Eval.now(i)
     *     else // Retry until we have an even number!
     *       return evenInt()
     *   })
     * ```
     */
    flatMap(f) {
        return new FlatMap(this, f);
    }
    /**
     * Alias for {@link Eval.flatMap .flatMap}.
     */
    chain(f) {
        return this.flatMap(f);
    }
    /**
     * Memoizes (caches) the result of the source on the first
     * evaluation and reuses it on subsequent invocations of `get()`.
     *
     * The resulting `Eval` will be idempotent, meaning that
     * evaluating it multiple times will have the same effect
     * as evaluating it once.
     */
    memoize() {
        switch (this._funADType) {
            case "now":
            case "once":
                return this;
            case "always":
                return new Once(this.get);
            default:
                return new Once(() => this.get());
        }
    }
    /**
     * Returns a new `Eval` that upon evaluation will execute the given
     * function for the generated element, transforming the source into
     * an `Eval<void>`.
     *
     * Similar in spirit with normal {@link Eval.forEach .forEach},
     * but lazy, as obviously nothing gets executed at this point.
     */
    forEachL(cb) {
        return this.map(cb);
    }
    /**
     * Triggers the evaluation of the source, executing the given
     * function for the generated element.
     *
     * The application of this function has strict behavior, as the
     * coeval is immediately executed.
     */
    forEach(cb) {
        this.forEachL(cb).get();
    }
    /**
     * Alias for {@link Eval.always}.
     */
    static of(thunk) {
        return Eval.always(thunk);
    }
    /**
     * Lifts a value into the `Eval` context.
     *
     * Alias for {@link Eval.now}.
     */
    static pure(value) { return Eval.now(value); }
    /**
     * Returns an `Eval` that on execution is always successful,
     * emitting the given strict value.
     */
    static now(value) { return new Now(value); }
    /**
     * Shorthand for `now(undefined as void)`, always returning
     * the same reference as optimization.
     */
    static unit() {
        return evalUnitRef;
    }
    /**
     * Promote a `thunk` function to an `Eval`, catching exceptions in
     * the process.
     *
     * Note that since `Eval` is not memoized by global, this will
     * recompute the value each time the `Eval` is executed.
     */
    static always(thunk) {
        return new Always(thunk);
    }
    /**
     * Promote a `thunk` function to a `Coeval` that is memoized on the
     * first evaluation, the result being then available on subsequent
     * evaluations.
     *
     * Note this is equivalent with:
     *
     * ```typescript
     * Eval.always(thunk).memoize()
     * ```
     */
    static once(thunk) {
        return new Once(thunk);
    }
    /**
     * Promote a `thunk` function generating `Eval` results to an `Eval`
     * of the same type.
     */
    static suspend(thunk) {
        return new Suspend(thunk);
    }
    /**
     * Promote a `thunk` function generating `Eval` results to an `Eval`
     * of the same type.
     *
     * Alias for {@link Eval.suspend}.
     */
    static defer(thunk) {
        return Eval.suspend(thunk);
    }
    /**
     * Keeps calling `f` until a `Right(b)` is returned.
     *
     * Based on Phil Freeman's
     * [Stack Safety for Free]{@link http://functorial.com/stack-safety-for-free/index.pdf}.
     *
     * Described in `FlatMap.tailRecM`.
     */
    static tailRecM(a, f) {
        return f(a).flatMap(either => {
            if (either.isRight()) {
                return Eval.now(either.get());
            }
            else {
                // Recursive call
                return Eval.tailRecM(either.swap().get(), f);
            }
        });
    }
    /**
     * Transforms a list of `Eval` values into an `Eval` of a list.
     *
     * Sample:
     *
     * ```typescript
     * const io1 = Eval.of(() => 1)
     * const io2 = Eval.of(() => 2)
     * const io3 = Eval.of(() => 3)
     *
     * // Yields [1, 2, 3]
     * const all: Eval<number[]> = Eval.sequence([f1, f2, f3])
     * ```
     */
    static sequence(list) {
        return evalSequence(list);
    }
    /**
     * Maps 2 `Eval` values by the mapping function, returning a new
     * `Eval` reference that completes with the result of mapping that
     * function to the successful values of the futures, or in failure in
     * case either of them fails.
     *
     * ```typescript
     * const fa1 = Eval.of(() => 1)
     * const fa2 = Eval.of(() => 2)
     *
     *
     * // Yields Success(3)
     * Eval.map2(fa1, fa2, (a, b) => a + b)
     * ```
     *
     * This operation is the `Applicative.map2`.
     */
    static map2(fa1, fa2, f) {
        const fl = Eval.sequence([fa1, fa2]);
        return fl.map(lst => f(lst[0], lst[1]));
    }
    /**
     * Maps 3 `Eval` values by the mapping function, returning a new
     * `Eval` reference that completes with the result of mapping that
     * function to the successful values of the futures, or in failure in
     * case either of them fails.
     *
     * ```typescript
     * const fa1 = Eval.of(() => 1)
     * const fa2 = Eval.of(() => 2)
     * const fa3 = Eval.of(() => 3)
     *
     *
     * // Yields Success(6)
     * Eval.map3(fa1, fa2, fa3, (a, b, c) => a + b + c)
     * ```
     */
    static map3(fa1, fa2, fa3, f) {
        const fl = Eval.sequence([fa1, fa2, fa3]);
        return fl.map(lst => f(lst[0], lst[1], lst[2]));
    }
    /**
     * Maps 4 `Eval` values by the mapping function, returning a new
     * `Eval` reference that completes with the result of mapping that
     * function to the successful values of the futures, or in failure in
     * case either of them fails.
     *
     * ```typescript
     * const fa1 = Eval.of(() => 1)
     * const fa2 = Eval.of(() => 2)
     * const fa3 = Eval.of(() => 3)
     * const fa4 = Eval.of(() => 4)
     *
     * // Yields Success(10)
     * Eval.map4(fa1, fa2, fa3, fa4, (a, b, c, d) => a + b + c + d)
     * ```
     */
    static map4(fa1, fa2, fa3, fa4, f) {
        const fl = Eval.sequence([fa1, fa2, fa3, fa4]);
        return fl.map(lst => f(lst[0], lst[1], lst[2], lst[3]));
    }
    /**
     * Maps 5 `Eval` values by the mapping function, returning a new
     * `Eval` reference that completes with the result of mapping that
     * function to the successful values of the futures, or in failure in
     * case either of them fails.
     *
     * ```typescript
     * const fa1 = Eval.of(() => 1)
     * const fa2 = Eval.of(() => 2)
     * const fa3 = Eval.of(() => 3)
     * const fa4 = Eval.of(() => 4)
     * const fa5 = Eval.of(() => 5)
     *
     * // Yields Success(15)
     * Eval.map5(fa1, fa2, fa3, fa4, fa5,
     *   (a, b, c, d, e) => a + b + c + d + e
     * )
     * ```
     */
    static map5(fa1, fa2, fa3, fa4, fa5, f) {
        const fl = Eval.sequence([fa1, fa2, fa3, fa4, fa5]);
        return fl.map(lst => f(lst[0], lst[1], lst[2], lst[3], lst[4]));
    }
    /**
     * Maps 6 `Eval` values by the mapping function, returning a new
     * `Eval` reference that completes with the result of mapping that
     * function to the successful values of the futures, or in failure in
     * case either of them fails.
     *
     * ```typescript
     * const fa1 = Eval.of(() => 1)
     * const fa2 = Eval.of(() => 2)
     * const fa3 = Eval.of(() => 3)
     * const fa4 = Eval.of(() => 4)
     * const fa5 = Eval.of(() => 5)
     * const fa6 = Eval.of(() => 6)
     *
     * // Yields Success(21)
     * Eval.map6(
     *   fa1, fa2, fa3, fa4, fa5, fa6,
     *   (a, b, c, d, e, f) => a + b + c + d + e + f
     * )
     * ```
     */
    static map6(fa1, fa2, fa3, fa4, fa5, fa6, f) {
        const fl = Eval.sequence([fa1, fa2, fa3, fa4, fa5, fa6]);
        return fl.map(lst => f(lst[0], lst[1], lst[2], lst[3], lst[4], lst[5]));
    }
}
/**
 * `Now` is an internal `Eval` state that wraps any strict
 * value in an `Eval` reference. Returned by [[Eval.now]].
 *
 * @private
 */
class Now extends Eval {
    /**
     * @param value is the value that's going to be returned
     * when `get()` is called.
     */
    constructor(value) {
        super();
        this.value = value;
        this._funADType = "now";
    }
    get() { return this.value; }
    toString() { return `Eval.now(${JSON.stringify(this.value)})`; }
}
/**
 * Reusable reference, to use in {@link Eval.unit}.
 *
 * @private
 */
const evalUnitRef = new Now(undefined);
/**
 * `Once` is an internal `Eval` state that executes the given `thunk`
 * only once, upon calling `get()` and then memoize its result for
 * subsequent invocations.
 *
 * Returned by [[Eval.once]].
 *
 * @private
 */
class Once extends Eval {
    constructor(thunk) {
        super();
        this._funADType = "once";
        this._thunk = thunk;
    }
    get() {
        if (this._thunk) {
            try {
                this._cache = this._thunk();
                this._isError = false;
            }
            catch (e) {
                this._cache = e;
                this._isError = true;
            }
            // GC purposes
            delete this._thunk;
        }
        if (this._isError)
            throw this._cache;
        return this._cache;
    }
    toString() { return `Eval.once([thunk])`; }
}
/**
 * `Always` is an internal `Eval` state that executes the given `thunk`
 * every time the call to `get()` happens. Returned by [[Eval.always]].
 *
 * @private
 */
class Always extends Eval {
    constructor(thunk) {
        super();
        this._funADType = "always";
        this.get = thunk;
    }
    toString() { return `Eval.always([thunk])`; }
}
/**
 * `Suspend` is an internal `Eval` state that represents a factory of
 * `Eval` values. Returned by [[Eval.suspend]].
 *
 * @private
 */
class Suspend extends Eval {
    constructor(thunk) {
        super();
        this.thunk = thunk;
        this._funADType = "suspend";
    }
    toString() { return `Eval.suspend([thunk])`; }
}
/**
 * `FlatMap` is an internal `Eval` state that represents a
 * [[Eval.flatMap .flatMap]], [[Eval.map .map]], [[Eval.transform .transform]]
 * or a [[Eval.transformWith .transformWith]] operation, all of them
 * being expressed with this state.
 *
 * @private
 */
class FlatMap extends Eval {
    constructor(source, f) {
        super();
        this.source = source;
        this.f = f;
        this._funADType = "flatMap";
    }
    toString() {
        return `Eval#FlatMap(${String(this.source)}, [function])`;
    }
}
/** @hidden */
function _popNextBind(bFirst, bRest) {
    if (bFirst)
        return bFirst;
    if (bRest && bRest.length > 0)
        return bRest.pop();
    return null;
}
/** @hidden */
function evalRunLoop(start) {
    let current = start;
    let bFirst = null;
    let bRest = null;
    while (true) {
        switch (current._funADType) {
            case "now":
                const now = current;
                const bind = _popNextBind(bFirst, bRest);
                if (!bind)
                    return now.value;
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
                    if (!bRest)
                        bRest = [];
                    bRest.push(bFirst);
                }
                const fm = current;
                bFirst = fm.f;
                current = fm.source;
                break;
        }
    }
}
/**
 * Implementation for `Eval.sequence`.
 * @hidden
 */
function evalSequence(list) {
    return Eval.of(() => iteratorOf(list))
        .flatMap(cursor => evalSequenceLoop([], cursor));
}
/**
 * Recursive loop that goes through the given `cursor`, element by
 * element, gathering the results of all generated `Eval` elements.
 *
 * @hidden
 */
function evalSequenceLoop(acc, cursor) {
    while (true) {
        const elem = cursor.next();
        const isDone = elem.done;
        if (elem.value) {
            const io = elem.value;
            return io.flatMap(a => {
                acc.push(a);
                if (isDone)
                    return Eval.pure(acc);
                return evalSequenceLoop(acc, cursor);
            });
        }
        else {
            /* istanbul ignore else */
            if (isDone)
                return Eval.pure(acc);
        }
    }
}
//# sourceMappingURL=eval.js.map