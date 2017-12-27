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
import { Try, Option, Either, Throwable } from "funfix-core";
import { Eval, IO } from "funfix-effect";
import { Future } from "funfix-exec";
import { HK } from "./kinds";
import { Monad, MonadError } from "./monad";
import { Comonad, CoflatMap } from "./comonad";
import { Eq } from "./eq";
/**
 * Alias used for encoding higher-kinded types when implementing
 * type class instances.
 */
export declare type OptionK<A> = HK<Option<any>, A>;
/**
 * Type class instances provided by default for `Option`.
 */
export declare class OptionInstances implements Monad<Option<any>>, Eq<Option<any>>, CoflatMap<Option<any>> {
    private __unit;
    eqv(lh: Option<any>, rh: Option<any>): boolean;
    pure<A>(a: A): Option<A>;
    unit(): Option<void>;
    ap<A, B>(fa: OptionK<A>, ff: OptionK<(a: A) => B>): Option<B>;
    map<A, B>(fa: OptionK<A>, f: (a: A) => B): Option<B>;
    map2<A, B, Z>(fa: OptionK<A>, fb: OptionK<B>, f: (a: A, b: B) => Z): Option<Z>;
    product<A, B>(fa: OptionK<A>, fb: OptionK<B>): Option<[A, B]>;
    flatMap<A, B>(fa: OptionK<A>, f: (a: A) => OptionK<B>): Option<B>;
    tailRecM<A, B>(a: A, f: (a: A) => OptionK<Either<A, B>>): Option<B>;
    coflatMap<A, B>(fa: OptionK<A>, ff: (a: OptionK<A>) => B): Option<B>;
    coflatten<A>(fa: OptionK<A>): Option<Option<A>>;
    followedBy: <A, B>(fa: OptionK<A>, fb: OptionK<B>) => Option<B>;
    followedByL: <A, B>(fa: OptionK<A>, fb: () => OptionK<B>) => Option<B>;
    forEffect: <A, B>(fa: OptionK<A>, fb: OptionK<B>) => Option<A>;
    forEffectL: <A, B>(fa: OptionK<A>, fb: () => OptionK<B>) => Option<A>;
    static readonly global: OptionInstances;
}
/**
 * Alias used for encoding higher-kinded types when implementing
 * type class instances.
 */
export declare type TryK<A> = HK<Try<any>, A>;
/**
 * Type class instances provided by default for `Option`.
 */
export declare class TryInstances implements MonadError<Try<any>, Throwable>, Eq<Try<any>>, CoflatMap<Try<any>> {
    eqv(lh: Try<any>, rh: Try<any>): boolean;
    pure<A>(a: A): Try<A>;
    unit(): Try<void>;
    ap<A, B>(fa: TryK<A>, ff: TryK<(a: A) => B>): Try<B>;
    map<A, B>(fa: TryK<A>, f: (a: A) => B): Try<B>;
    map2<A, B, Z>(fa: TryK<A>, fb: TryK<B>, f: (a: A, b: B) => Z): Try<Z>;
    product<A, B>(fa: TryK<A>, fb: TryK<B>): Try<[A, B]>;
    flatMap<A, B>(fa: TryK<A>, f: (a: A) => TryK<B>): Try<B>;
    tailRecM<A, B>(a: A, f: (a: A) => TryK<Either<A, B>>): Try<B>;
    raise<A>(e: any): Try<A>;
    attempt<A>(fa: TryK<A>): Try<Either<Throwable, A>>;
    recoverWith<A>(fa: TryK<A>, f: (e: Throwable) => TryK<A>): Try<A>;
    recover<A>(fa: TryK<A>, f: (e: Throwable) => A): Try<A>;
    coflatMap<A, B>(fa: TryK<A>, ff: (a: TryK<A>) => B): Try<B>;
    coflatten<A>(fa: TryK<A>): Try<Try<A>>;
    followedBy: <A, B>(fa: TryK<A>, fb: TryK<B>) => Try<B>;
    followedByL: <A, B>(fa: TryK<A>, fb: () => TryK<B>) => Try<B>;
    forEffect: <A, B>(fa: TryK<A>, fb: TryK<B>) => Try<A>;
    forEffectL: <A, B>(fa: TryK<A>, fb: () => TryK<B>) => Try<A>;
    static global: TryInstances;
}
/**
 * Alias used for encoding higher-kinded types when implementing
 * type class instances.
 */
export declare type EitherK<L, R> = HK<Either<L, any>, R>;
/**
 * Type class instances provided by default for `Either`.
 */
export declare class EitherInstances<L> implements Monad<Either<L, any>>, Eq<Either<L, any>>, CoflatMap<Either<L, any>> {
    private __unit;
    eqv(lh: Either<L, any>, rh: Either<L, any>): boolean;
    pure<A>(a: A): Either<L, A>;
    unit(): Either<L, void>;
    ap<A, B>(fa: EitherK<L, A>, ff: EitherK<L, (a: A) => B>): Either<L, B>;
    map<A, B>(fa: EitherK<L, A>, f: (a: A) => B): Either<L, B>;
    map2<A, B, Z>(fa: EitherK<L, A>, fb: EitherK<L, B>, f: (a: A, b: B) => Z): Either<L, Z>;
    product<A, B>(fa: EitherK<L, A>, fb: EitherK<L, B>): Either<L, [A, B]>;
    flatMap<A, B>(fa: HK<Either<L, any>, A>, f: (a: A) => HK<Either<L, any>, B>): HK<Either<L, any>, B>;
    tailRecM<A, B>(a: A, f: (a: A) => HK<Either<L, any>, Either<A, B>>): HK<Either<L, any>, B>;
    coflatMap<A, B>(fa: EitherK<L, A>, ff: (a: EitherK<L, A>) => B): Either<L, B>;
    coflatten<A>(fa: EitherK<L, A>): Either<L, Either<L, A>>;
    followedBy: <A, B>(fa: EitherK<L, A>, fb: EitherK<L, B>) => Either<L, B>;
    followedByL: <A, B>(fa: EitherK<L, A>, fb: () => EitherK<L, B>) => Either<L, B>;
    forEffect: <A, B>(fa: EitherK<L, A>, fb: EitherK<L, B>) => Either<L, A>;
    forEffectL: <A, B>(fa: EitherK<L, A>, fb: () => EitherK<L, B>) => Either<L, A>;
    static global: EitherInstances<any>;
}
/**
 * Alias used for encoding higher-kinded types when implementing
 * type class instances.
 */
export declare type EvalK<A> = HK<Eval<any>, A>;
/**
 * Type class instances provided by default for `Eval`.
 */
export declare class EvalInstances implements Monad<Eval<any>>, Comonad<Eval<any>> {
    pure<A>(a: A): Eval<A>;
    flatMap<A, B>(fa: EvalK<A>, f: (a: A) => EvalK<B>): Eval<B>;
    tailRecM<A, B>(a: A, f: (a: A) => EvalK<Either<A, B>>): Eval<B>;
    ap<A, B>(fa: EvalK<A>, ff: EvalK<(a: A) => B>): Eval<B>;
    map<A, B>(fa: EvalK<A>, f: (a: A) => B): Eval<B>;
    unit(): Eval<void>;
    coflatMap<A, B>(fa: EvalK<A>, ff: (a: EvalK<A>) => B): Eval<B>;
    coflatten<A>(fa: EvalK<A>): Eval<Eval<A>>;
    extract<A>(fa: EvalK<A>): A;
    map2: <A, B, Z>(fa: EvalK<A>, fb: EvalK<B>, f: (a: A, b: B) => Z) => Eval<Z>;
    product: <A, B>(fa: EvalK<A>, fb: EvalK<B>) => EvalK<[A, B]>;
    followedBy: <A, B>(fa: EvalK<A>, fb: EvalK<B>) => Eval<B>;
    followedByL: <A, B>(fa: EvalK<A>, fb: () => EvalK<B>) => Eval<B>;
    forEffect: <A, B>(fa: EvalK<A>, fb: EvalK<B>) => Eval<A>;
    forEffectL: <A, B>(fa: EvalK<A>, fb: () => EvalK<B>) => Eval<A>;
    static global: EvalInstances;
}
/**
 * Alias used for encoding higher-kinded types when implementing
 * type class instances.
 */
export declare type FutureK<A> = HK<Future<any>, A>;
/**
 * Type class instances provided by default for `Future`.
 */
export declare class FutureInstances implements MonadError<Future<any>, Throwable>, CoflatMap<Future<any>> {
    pure<A>(a: A): Future<A>;
    flatMap<A, B>(fa: FutureK<A>, f: (a: A) => FutureK<B>): Future<B>;
    tailRecM<A, B>(a: A, f: (a: A) => FutureK<Either<A, B>>): Future<B>;
    ap<A, B>(fa: FutureK<A>, ff: FutureK<(a: A) => B>): Future<B>;
    map<A, B>(fa: FutureK<A>, f: (a: A) => B): Future<B>;
    unit(): Future<void>;
    raise<A>(e: Throwable): Future<A>;
    attempt<A>(fa: FutureK<A>): Future<Either<Throwable, A>>;
    recoverWith<A>(fa: FutureK<A>, f: (e: Throwable) => FutureK<A>): Future<A>;
    recover<A>(fa: FutureK<A>, f: (e: Throwable) => A): Future<A>;
    map2<A, B, Z>(fa: FutureK<A>, fb: FutureK<B>, f: (a: A, b: B) => Z): Future<Z>;
    coflatMap<A, B>(fa: FutureK<A>, ff: (a: FutureK<A>) => B): Future<B>;
    coflatten<A>(fa: FutureK<A>): Future<Future<A>>;
    product: <A, B>(fa: FutureK<A>, fb: FutureK<B>) => FutureK<[A, B]>;
    followedBy: <A, B>(fa: FutureK<A>, fb: FutureK<B>) => Future<B>;
    followedByL: <A, B>(fa: FutureK<A>, fb: () => FutureK<B>) => Future<B>;
    forEffect: <A, B>(fa: FutureK<A>, fb: FutureK<B>) => Future<A>;
    forEffectL: <A, B>(fa: FutureK<A>, fb: () => FutureK<B>) => Future<A>;
    static global: FutureInstances;
}
/**
 * Alias used for encoding higher-kinded types when implementing
 * type class instances.
 */
export declare type IOK<A> = HK<IO<any>, A>;
/**
 * Type class instances provided by default for `IO`.
 */
export declare class IOInstances implements MonadError<IO<any>, Throwable>, CoflatMap<IO<any>> {
    pure<A>(a: A): IO<A>;
    flatMap<A, B>(fa: IOK<A>, f: (a: A) => IOK<B>): IO<B>;
    tailRecM<A, B>(a: A, f: (a: A) => IOK<Either<A, B>>): IO<B>;
    ap<A, B>(fa: IOK<A>, ff: IOK<(a: A) => B>): IO<B>;
    map<A, B>(fa: IOK<A>, f: (a: A) => B): IO<B>;
    unit(): IO<void>;
    raise<A>(e: Throwable): IO<A>;
    attempt<A>(fa: IOK<A>): IO<Either<Throwable, A>>;
    recoverWith<A>(fa: IOK<A>, f: (e: Throwable) => IOK<A>): IO<A>;
    recover<A>(fa: IOK<A>, f: (e: Throwable) => A): IO<A>;
    map2<A, B, Z>(fa: IOK<A>, fb: IOK<B>, f: (a: A, b: B) => Z): IO<Z>;
    followedBy<A, B>(fa: IOK<A>, fb: IOK<B>): IO<B>;
    followedByL<A, B>(fa: IOK<A>, fb: () => IOK<B>): IO<B>;
    forEffect<A, B>(fa: IOK<A>, fb: IOK<B>): IO<A>;
    forEffectL<A, B>(fa: IOK<A>, fb: () => IOK<B>): IO<A>;
    product<A, B>(fa: IOK<A>, fb: IOK<B>): IO<[A, B]>;
    coflatMap<A, B>(fa: IOK<A>, ff: (a: IOK<A>) => B): IO<B>;
    coflatten<A>(fa: IOK<A>): IO<IO<A>>;
    static global: IOInstances;
}
