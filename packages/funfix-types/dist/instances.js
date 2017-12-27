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
import { Try, Success, Option, Some, Either, Right, applyMixins } from "funfix-core";
import { Eval, IO } from "funfix-effect";
import { Future } from "funfix-exec";
import { registerTypeClassInstance } from "./kinds";
import { Monad, MonadError } from "./monad";
import { Comonad, CoflatMap } from "./comonad";
import { Eq } from "./eq";
/**
 * Type class instances provided by default for `Option`.
 */
export class OptionInstances {
    constructor() {
        // tslint:disable-next-line:variable-name
        this.__unit = Some(undefined);
    }
    eqv(lh, rh) {
        if (lh === rh)
            return true;
        if (lh.isEmpty())
            return rh.isEmpty();
        if (rh.isEmpty())
            return false;
        return Eq.testEq(lh.get(), rh.get());
    }
    pure(a) {
        return Some(a);
    }
    unit() {
        return this.__unit;
    }
    ap(fa, ff) {
        return Option.map2(fa, ff, (a, f) => f(a));
    }
    map(fa, f) {
        return fa.map(f);
    }
    map2(fa, fb, f) {
        return Option.map2(fa, fb, f);
    }
    product(fa, fb) {
        return Option.map2(fa, fb, (a, b) => [a, b]);
    }
    flatMap(fa, f) {
        return fa.flatMap(f);
    }
    tailRecM(a, f) {
        return Option.tailRecM(a, f);
    }
    coflatMap(fa, ff) {
        return Some(ff(fa));
    }
    coflatten(fa) {
        return Some(fa);
    }
}
OptionInstances.global = new OptionInstances();
// Mixins the default implementations
applyMixins(OptionInstances, [Monad]);
// Registering `OptionInstances` as global instances for Option
registerTypeClassInstance(Eq)(Option, OptionInstances.global);
registerTypeClassInstance(Monad)(Option, OptionInstances.global);
registerTypeClassInstance(CoflatMap)(Option, OptionInstances.global);
/**
 * Type class instances provided by default for `Option`.
 */
export class TryInstances {
    eqv(lh, rh) {
        if (lh === rh)
            return true;
        if (lh.isSuccess()) {
            if (rh.isFailure())
                return false;
            return Eq.testEq(lh.get(), rh.get());
        }
        else {
            if (rh.isSuccess())
                return false;
            return Eq.testEq(lh.failed().get(), rh.failed().get());
        }
    }
    pure(a) {
        return Success(a);
    }
    unit() {
        return Try.unit();
    }
    ap(fa, ff) {
        return Try.map2(fa, ff, (a, f) => f(a));
    }
    map(fa, f) {
        return fa.map(f);
    }
    map2(fa, fb, f) {
        return Try.map2(fa, fb, f);
    }
    product(fa, fb) {
        return Try.map2(fa, fb, (a, b) => [a, b]);
    }
    flatMap(fa, f) {
        return fa.flatMap(f);
    }
    tailRecM(a, f) {
        return Try.tailRecM(a, f);
    }
    raise(e) {
        return Try.failure(e);
    }
    attempt(fa) {
        return Try.success(fa.fold(e => Either.left(e), Either.right));
    }
    recoverWith(fa, f) {
        return fa.recoverWith(f);
    }
    recover(fa, f) {
        return fa.recover(f);
    }
    coflatMap(fa, ff) {
        return Success(ff(fa));
    }
    coflatten(fa) {
        return Success(fa);
    }
}
TryInstances.global = new TryInstances();
// Mixins the default implementations
applyMixins(TryInstances, [MonadError]);
// Registering `TryInstances` as global instances for Try
registerTypeClassInstance(Eq)(Try, TryInstances.global);
registerTypeClassInstance(MonadError)(Try, TryInstances.global);
registerTypeClassInstance(CoflatMap)(Try, TryInstances.global);
/**
 * Type class instances provided by default for `Either`.
 */
export class EitherInstances {
    constructor() {
        // tslint:disable-next-line:variable-name
        this.__unit = Right(undefined);
    }
    eqv(lh, rh) {
        if (lh === rh)
            return true;
        if (lh.isRight()) {
            if (rh.isLeft())
                return false;
            return Eq.testEq(lh.get(), rh.get());
        }
        else {
            if (rh.isRight())
                return false;
            return Eq.testEq(lh.swap().get(), rh.swap().get());
        }
    }
    pure(a) {
        return Right(a);
    }
    unit() {
        return this.__unit;
    }
    ap(fa, ff) {
        const faE = fa;
        const ffE = ff;
        return Either.map2(faE, ffE, (a, f) => f(a));
    }
    map(fa, f) {
        return fa.map(f);
    }
    map2(fa, fb, f) {
        return Either.map2(fa, fb, f);
    }
    product(fa, fb) {
        return Either.map2(fa, fb, (a, b) => [a, b]);
    }
    flatMap(fa, f) {
        return fa.flatMap(f);
    }
    tailRecM(a, f) {
        return Either.tailRecM(a, f);
    }
    coflatMap(fa, ff) {
        return Right(ff(fa));
    }
    coflatten(fa) {
        return Right(fa);
    }
}
EitherInstances.global = new EitherInstances();
// Mixins the default implementations
applyMixins(EitherInstances, [Monad]);
// Registering `TryInstances` as global instances for Try
registerTypeClassInstance(Eq)(Either, EitherInstances.global);
registerTypeClassInstance(Monad)(Either, EitherInstances.global);
registerTypeClassInstance(CoflatMap)(Either, EitherInstances.global);
/**
 * Type class instances provided by default for `Eval`.
 */
export class EvalInstances {
    pure(a) {
        return Eval.now(a);
    }
    flatMap(fa, f) {
        return fa.flatMap(f);
    }
    tailRecM(a, f) {
        return Eval.tailRecM(a, f);
    }
    ap(fa, ff) {
        return fa.flatMap(a => ff.map(f => f(a)));
    }
    map(fa, f) {
        return fa.map(f);
    }
    unit() {
        return Eval.unit();
    }
    coflatMap(fa, ff) {
        return Eval.now(ff(fa));
    }
    coflatten(fa) {
        return Eval.now(fa);
    }
    extract(fa) {
        return fa.get();
    }
}
EvalInstances.global = new EvalInstances();
// Mixins the default implementations
applyMixins(EvalInstances, [Monad, Comonad]);
// Registering `EvalInstances` as global instances for `Eval`
registerTypeClassInstance(Monad)(Eval, EvalInstances.global);
registerTypeClassInstance(Comonad)(Eval, EvalInstances.global);
/**
 * Type class instances provided by default for `Future`.
 */
export class FutureInstances {
    pure(a) {
        return Future.pure(a);
    }
    flatMap(fa, f) {
        return fa.flatMap(f);
    }
    tailRecM(a, f) {
        return Future.tailRecM(a, f);
    }
    ap(fa, ff) {
        return fa.flatMap(a => ff.map(f => f(a)));
    }
    map(fa, f) {
        return fa.map(f);
    }
    unit() {
        return Future.unit();
    }
    raise(e) {
        return Future.raise(e);
    }
    attempt(fa) {
        return fa.attempt();
    }
    recoverWith(fa, f) {
        return fa.recoverWith(f);
    }
    recover(fa, f) {
        return fa.recover(f);
    }
    map2(fa, fb, f) {
        return Future.map2(fa, fb, f);
    }
    coflatMap(fa, ff) {
        return Future.pure(ff(fa));
    }
    coflatten(fa) {
        return Future.pure(fa);
    }
}
FutureInstances.global = new FutureInstances();
// Mixins the default implementations
applyMixins(FutureInstances, [MonadError, CoflatMap]);
// Registering `FutureInstances` as global instances for `Future`
registerTypeClassInstance(MonadError)(Future, FutureInstances.global);
registerTypeClassInstance(CoflatMap)(Future, FutureInstances.global);
/**
 * Type class instances provided by default for `IO`.
 */
export class IOInstances {
    pure(a) {
        return IO.pure(a);
    }
    flatMap(fa, f) {
        return fa.flatMap(f);
    }
    tailRecM(a, f) {
        return IO.tailRecM(a, f);
    }
    ap(fa, ff) {
        return fa.flatMap(a => ff.map(f => f(a)));
    }
    map(fa, f) {
        return fa.map(f);
    }
    unit() {
        return IO.unit();
    }
    raise(e) {
        return IO.raise(e);
    }
    attempt(fa) {
        return fa.attempt();
    }
    recoverWith(fa, f) {
        return fa.recoverWith(f);
    }
    recover(fa, f) {
        return fa.recover(f);
    }
    map2(fa, fb, f) {
        return IO.map2(fa, fb, f);
    }
    followedBy(fa, fb) {
        return fa.followedBy(fb);
    }
    followedByL(fa, fb) {
        return fa.followedBy(IO.suspend(fb));
    }
    forEffect(fa, fb) {
        return fa.forEffect(fb);
    }
    forEffectL(fa, fb) {
        return fa.forEffect(IO.suspend(fb));
    }
    product(fa, fb) {
        return IO.map2(fa, fb, (a, b) => [a, b]);
    }
    coflatMap(fa, ff) {
        return IO.pure(ff(fa));
    }
    coflatten(fa) {
        return IO.pure(fa);
    }
}
IOInstances.global = new IOInstances();
// Mixins the default implementations
applyMixins(IOInstances, [MonadError, CoflatMap]);
// Registering `IOInstances` as global instances for `IO`
registerTypeClassInstance(MonadError)(IO, IOInstances.global);
registerTypeClassInstance(CoflatMap)(IO, IOInstances.global);
//# sourceMappingURL=instances.js.map