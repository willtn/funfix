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
import { Right, Left, applyMixins } from "funfix-core";
import { Equiv, getTypeClassInstance } from "./kinds";
import { ApplyLaws, Applicative, ApplicativeLaws, ApplicativeError, ApplicativeErrorLaws } from "./applicative";
/**
 * The `FlatMap` type class is a lightweight {@link Monad}.
 *
 * It exposes [flatMap]{@link FlatMap.flatMap}, which allows to have a
 * value in a context (`F<A>`) and then feed that into a function that
 * takes a normal value and returns a value in a context
 * (`A => F<B>`).
 *
 * One motivation for separating this out from `Monad` is that there are
 * situations where we can implement `flatMap` but not `pure`. For example,
 * we can implement `map` or `flatMap` that transforms the values of a
 * `Map<K, ?>` type, but we can't implement `pure` (because we wouldn't
 * know what key to use when instantiating the new `Map`).
 *
 * Must obey the laws defined in {@link FlatMapLaws}.
 *
 * Note that having an `Monad` instance implies
 * {@link Functor} and {@link Apply} implementations are also available,
 * as `FlatMap` is a subtype of these.
 *
 * ## Implementation notes
 *
 * Even though in TypeScript the Funfix library is using `abstract class` to
 * express type classes, when implementing this type class it is recommended
 * that you implement it as a mixin using "`implements`", instead of extending
 * it directly with "`extends`". See
 * [TypeScript: Mixins]{@link https://www.typescriptlang.org/docs/handbook/mixins.html}
 * for details and note that we already have `applyMixins` defined.
 *
 * Implementation example:
 *
 * ```typescript
 * import {
 *   HK, FlatMap, Either,
 *   registerTypeClassInstance,
 *   applyMixins
 * } from "../src/funfix"
 *
 * // Type alias defined for readability.
 * // HK is our encoding for higher-kinded types.
 * type BoxK<T> = HK<Box<any>, T>
 *
 * class Box<T> implements HK<Box<any>, T> {
 *   constructor(public value: T) {}
 *
 *   // Implements HK<Box<any>, A>, not really needed, but useful in order
 *   // to avoid type casts. Note they can and should be undefined:
 *   readonly _funKindF: Box<any>
 *   readonly _funKindA: T
 * }
 *
 * class BoxFlatMap implements FlatMap<Box<any>> {
 *   map<A, B>(fa: BoxK<A>, f: (a: A) => B): Box<B> {
 *     return new Box(f((fa as Box<A>).value))
 *   }
 *
 *   flatMap<A, B>(fa: BoxK<A>, f: (a: A) => BoxK<B>): Box<B> {
 *     return f((fa as Box<A>).value) as Box<B>
 *   }
 *
 *   tailRecM<A, B>(a: A, f: (a: A) => BoxK<Either<A, B>>): Box<B> {
 *     let cursor = a
 *     while (true) {
 *       const box = f(cursor) as Box<Either<A, B>>
 *       const v = box.value
 *       if (v.isRight()) return new Box(v.get())
 *       cursor = v.swap().get()
 *     }
 *   }
 *
 *   // Mixed-in, as these have default implementations
 *   map2: <A, B, Z>(fa: BoxK<A>, fb: BoxK<B>, f: (a: A, b: B) => Z) => Box<Z>
 *   ap: <A, B>(fa: BoxK<A>, ff: BoxK<(a: A) => B>) => Box<B>
 *   product: <A, B> (fa: BoxK<A>, fb: BoxK<B>) => Box<[A, B]>
 *   unit: () => Box<void>
 *   followedBy: <A, B>(fa: BoxK<A>, fb: BoxK<B>) => Box<B>
 *   followedByL: <A, B>(fa: BoxK<A>, fb: () => BoxK<B>) => Box<B>
 *   forEffect: <A, B>(fa: BoxK<A>, fb: BoxK<B>) => Box<A>
 *   forEffectL: <A, B>(fa: BoxK<A>, fb: () => BoxK<B>) => Box<A>
 * }
 *
 * // Call needed in order to implement `map`, `map2`, `product`, etc.
 * // using the default implementations defined by `FlatMap`, because
 * // we are using `implements` instead of `extends` above and
 * // because in this sample we want the default implementations,
 * // but note that you can always provide your own
 * applyMixins(BoxFlatMap, [FlatMap])
 *
 * // Registering global Functor instance for Box, needed in order
 * // for the `functorOf(Box)`, `applyOf(Box)`, `applicativeOf(Box)`
 * // and `flatMapOf(Box)` calls to work
 * registerTypeClassInstance(FlatMap)(Box, new BoxFunctor())
 * ```
 *
 * We are using `implements` in order to support multiple inheritance and to
 * avoid inheriting any `static` members. In the Flow definitions (e.g.
 * `.js.flow` files) for Funfix these type classes are defined with
 * "`interface`", as they are meant to be interfaces that sometimes have
 * default implementations and not classes.
 *
 * ## Credits
 *
 * This type class is inspired by the equivalent in Haskell's
 * standard library and the implementation is inspired by the
 * [Typelevel Cats]{@link http://typelevel.org/cats/} project.
 */
export class FlatMap {
    /**
     * Sequentially compose two actions, discarding any value produced
     * by the first.
     *
     * See [followedByL]{@link FlatMap.followedByL} for a lazy version.
     */
    followedBy(fa, fb) {
        return this.flatMap(fa, _ => fb);
    }
    /**
     * Sequentially compose two actions, discarding any value produced
     * by the first.
     *
     * See [followedBy]{@link FlatMap.followedBy} for the strict version.
     */
    followedByL(fa, fb) {
        return this.flatMap(fa, _ => fb());
    }
    /**
     * Sequentially compose two actions, discarding any value
     * produced by the second.
     *
     * See [forEffectL]{@link FlatMap.forEffectL} for the lazy version.
     */
    forEffect(fa, fb) {
        return this.flatMap(fa, a => this.map(fb, _ => a));
    }
    /**
     * Sequentially compose two actions, discarding any value
     * produced by the second.
     *
     * See [forEffect]{@link FlatMap.forEffect} for the strict version.
     */
    forEffectL(fa, fb) {
        return this.flatMap(fa, a => this.map(fb(), _ => a));
    }
    /** Inherited from {@link Apply.ap}. */
    ap(fa, ff) {
        return this.flatMap(fa, a => this.map(ff, f => f(a)));
    }
    /** Inherited from {@link Apply.map2}. */
    map2(fa, fb, f) {
        return this.flatMap(fa, a => this.map(fb, b => f(a, b)));
    }
    /** Inherited from {@link Apply.product}. */
    product(fa, fb) {
        return this.flatMap(fa, a => this.map(fb, b => [a, b]));
    }
}
// Implements TypeClass<F>
/** @hidden */
FlatMap._funTypeId = "flatMap";
/** @hidden */
FlatMap._funSupertypeIds = ["functor", "apply"];
/**
 * Type class laws defined for {@link FlatMap}.
 *
 * This is an abstract definition. In order to use it in unit testing,
 * the implementor must think of a strategy to evaluate the truthiness
 * of the returned `Equiv` values.
 *
 * Even though in TypeScript the Funfix library is using classes to
 * express these laws, when implementing this class it is recommended
 * that you implement it as a mixin using `implements`, instead of extending
 * it directly with `extends`. See
 * [TypeScript: Mixins]{@link https://www.typescriptlang.org/docs/handbook/mixins.html}
 * for details and note that we already have `applyMixins` defined.
 *
 * We are doing this in order to support multiple inheritance and to
 * avoid inheriting any `static` members. In the Flow definitions (e.g.
 * `.js.flow` files) for Funfix these classes are defined with
 * `interface`, as they are meant to be interfaces that sometimes have
 * default implementations and not classes.
 */
export class FlatMapLaws {
    /**
     * ```typescript
     *  fa.flatMap(f).flatMap(g) <-> fa.flatMap(a => f(a).flatMap(g))
     *  ```
     */
    flatMapAssociativity(fa, f, g) {
        const F = this.F;
        return Equiv.of(F.flatMap(F.flatMap(fa, f), g), F.flatMap(fa, a => F.flatMap(f(a), g)));
    }
    /**
     * ```typescript
     * fab.ap(fa) <-> fab.flatMap(f => fa.map(f))
     * ```
     */
    flatMapConsistentApply(fa, fab) {
        const F = this.F;
        return Equiv.of(F.ap(fa, fab), F.flatMap(fab, f => F.map(fa, f)));
    }
    /**
     * ```typescript
     * fa.followedBy(fb) <-> fa.flatMap(_ => fb)
     * ```
     */
    followedByConsistency(fa, fb) {
        const F = this.F;
        return Equiv.of(F.followedBy(fa, fb), F.flatMap(fa, _ => fb));
    }
    /**
     * ```typescript
     * fa.followedBy(() => fb) <-> fa.flatMap(_ => fb)
     * ```
     */
    followedByLConsistency(fa, fb) {
        const F = this.F;
        return Equiv.of(F.followedByL(fa, () => fb), F.flatMap(fa, _ => fb));
    }
    /**
     * ```typescript
     * fa.forEffect(fb) <-> fa.flatMap(a => fb.map(_ => a))
     * ```
     */
    forEffectConsistency(fa, fb) {
        const F = this.F;
        return Equiv.of(F.forEffect(fa, fb), F.flatMap(fa, a => F.map(fb, _ => a)));
    }
    /**
     * ```typescript
     * fa.forEffectL(() => fb) <-> fa.flatMap(a => fb.map(_ => a))
     * ```
     */
    forEffectLConsistency(fa, fb) {
        const F = this.F;
        return Equiv.of(F.forEffectL(fa, () => fb), F.flatMap(fa, a => F.map(fb, _ => a)));
    }
    tailRecMConsistentFlatMap(a, f) {
        const F = this.F;
        const bounce = (n) => {
            return F.tailRecM([a, n], x => {
                const [a0, i] = x;
                return i > 0
                    ? F.map(f(a0), a1 => Left([a1, i - 1]))
                    : F.map(f(a0), Right);
            });
        };
        /*
         * The law is for n >= 1
         * bounce(n) == bounce(n - 1).flatMap(f)
         *
         * Many monads blow up if n gets too large here (for instance List, becomes
         * multiplicative, so the memory is exponential in n).
         */
        return Equiv.of(bounce(1), F.flatMap(bounce(0), f));
    }
}
applyMixins(FlatMapLaws, [ApplyLaws]);
/**
 * Given a {@link Constructor} reference, returns its associated
 * {@link FlatMap} instance if it exists, or throws a `NotImplementedError`
 * in case there's no such association.
 *
 * ```typescript
 * import { Option, FlatMap, flatMapOf } from "funfix"
 *
 * const F: FlatMap<Option<any>> = flatMapOf(Option)
 * ```
 */
export const flatMapOf = getTypeClassInstance(FlatMap);
/**
 * Given an {@link FlatMap} instance, returns the {@link FlatMapLaws}
 * associated with it.
 */
export function flatMapLawsOf(instance) {
    return new (class extends FlatMapLaws {
        constructor() {
            super(...arguments);
            this.F = instance;
        }
    })();
}
/**
 * The `Monad` type class.
 *
 * Allows composition of dependent effectful functions.
 *
 * A `Monad` instance is defined by two operations:
 *
 * - `pure` from {@link Applicative}, which lifts an `A` value
 *    in the `F<A>` context
 * - `flatMap`, which allows us to have a value in a context (`F<A>`)
 *    and then feed that into a function that takes a normal value and
 *    returns a value in a context (`A => F<B>`)
 *
 * See [Monads for functional programming]{@link http://homepages.inf.ed.ac.uk/wadler/papers/marktoberdorf/baastad.pdf},
 * by Philip Wadler.
 *
 * Must obey the laws defined in {@link MonadLaws}.
 *
 * Note that having an `Applicative` instance implies
 * {@link Functor}, {@link Apply}, {@link Applicative} and {@link FlatMap}
 * implementations are also available, as `Monad` is a subtype
 * of these type classes.
 *
 * ## Implementation notes
 *
 * Even though in TypeScript the Funfix library is using `abstract class` to
 * express type classes, when implementing this type class it is recommended
 * that you implement it as a mixin using "`implements`", instead of extending
 * it directly with "`extends`". See
 * [TypeScript: Mixins]{@link https://www.typescriptlang.org/docs/handbook/mixins.html}
 * for details and note that we already have `applyMixins` defined.
 *
 * Implementation example:
 *
 * ```typescript
 * import {
 *   HK, Monad, Either,
 *   registerTypeClassInstance,
 *   applyMixins
 * } from "../src/funfix"
 *
 * // Type alias defined for readability.
 * // HK is our encoding for higher-kinded types.
 * type BoxK<T> = HK<Box<any>, T>
 *
 * class Box<T> implements HK<Box<any>, T> {
 *   constructor(public value: T) {}
 *
 *   // Implements HK<Box<any>, A>, not really needed, but useful in order
 *   // to avoid type casts. Note they can and should be undefined:
 *   readonly _funKindF: Box<any>
 *   readonly _funKindA: T
 * }
 *
 * class BoxMonad implements Monad<Box<any>> {
 *   pure<A>(a: A): Box<A> { return new Box(a) }
 *
 *   flatMap<A, B>(fa: BoxK<A>, f: (a: A) => BoxK<B>): Box<B> {
 *     return f((fa as Box<A>).value) as Box<B>
 *   }
 *
 *   tailRecM<A, B>(a: A, f: (a: A) => BoxK<Either<A, B>>): Box<B> {
 *     let cursor = a
 *     while (true) {
 *       const box = f(cursor) as Box<Either<A, B>>
 *       const v = box.value
 *       if (v.isRight()) return new Box(v.get())
 *       cursor = v.swap().get()
 *     }
 *   }
 *
 *   // Mixed-in, as these have default implementations
 *   map: <A, B>(fa: BoxK<A>, f: (a: A) => B) => Box<B>
 *   map2: <A, B, Z>(fa: BoxK<A>, fb: BoxK<B>, f: (a: A, b: B) => Z) => Box<Z>
 *   ap: <A, B>(fa: BoxK<A>, ff: BoxK<(a: A) => B>) => Box<B>
 *   product: <A, B> (fa: BoxK<A>, fb: BoxK<B>) => Box<[A, B]>
 *   unit: () => Box<void>
 *   followedBy: <A, B>(fa: BoxK<A>, fb: BoxK<B>) => Box<B>
 *   followedByL: <A, B>(fa: BoxK<A>, fb: () => BoxK<B>) => Box<B>
 *   forEffect: <A, B>(fa: BoxK<A>, fb: BoxK<B>) => Box<A>
 *   forEffectL: <A, B>(fa: BoxK<A>, fb: () => BoxK<B>) => Box<A>
 * }
 *
 * // Call needed in order to implement `map`, `map2`, `product`, etc.
 * // using the default implementations defined by `Monad`, because
 * // we are using `implements` instead of `extends` above and
 * // because in this sample we want the default implementations,
 * // but note that you can always provide your own
 * applyMixins(BoxMonad, [Monad])
 *
 * // Registering global Monad instance for Box, needed in order
 * // for the `functorOf(Box)`, `applyOf(Box)`, `applicativeOf(Box)`,
 * // `flatMapOf(Box)` and `monadOf(Box)` calls to work
 * registerTypeClassInstance(Monad)(Box, new BoxFunctor())
 * ```
 *
 * We are using `implements` in order to support multiple inheritance and to
 * avoid inheriting any `static` members. In the Flow definitions (e.g.
 * `.js.flow` files) for Funfix these type classes are defined with
 * "`interface`", as they are meant to be interfaces that sometimes have
 * default implementations and not classes.
 *
 * ## Credits
 *
 * This type class is inspired by the equivalent in Haskell's
 * standard library and the implementation is inspired by the
 * [Typelevel Cats]{@link http://typelevel.org/cats/} project.
 */
export class Monad {
    /** Inherited from {@link Apply.ap}. */
    ap(fa, ff) {
        return this.flatMap(fa, a => this.map(ff, f => f(a)));
    }
    /** Inherited from {@link Functor.map}. */
    map(fa, f) {
        return this.flatMap(fa, a => this.pure(f(a)));
    }
    /** Inherited from {@link Apply.map2}. */
    map2(fa, fb, f) {
        const F = this;
        return F.flatMap(fa, a => F.map(fb, b => f(a, b)));
    }
    /** Inherited from {@link Apply.product}. */
    product(fa, fb) {
        const F = this;
        return F.flatMap(fa, a => F.map(fb, b => [a, b]));
    }
}
// Implements TypeClass<F>
/** @hidden */
Monad._funTypeId = "monad";
/** @hidden */
Monad._funSupertypeIds = ["functor", "apply", "applicative", "flatMap"];
applyMixins(Monad, [Applicative, FlatMap]);
/**
 * Type class laws defined for {@link Monad}.
 *
 * This is an abstract definition. In order to use it in unit testing,
 * the implementor must think of a strategy to evaluate the truthiness
 * of the returned `Equiv` values.
 *
 * Even though in TypeScript the Funfix library is using classes to
 * express these laws, when implementing this class it is recommended
 * that you implement it as a mixin using `implements`, instead of extending
 * it directly with `extends`. See
 * [TypeScript: Mixins]{@link https://www.typescriptlang.org/docs/handbook/mixins.html}
 * for details and note that we already have `applyMixins` defined.
 *
 * We are doing this in order to support multiple inheritance and to
 * avoid inheriting any `static` members. In the Flow definitions (e.g.
 * `.js.flow` files) for Funfix these classes are defined with
 * `interface`, as they are meant to be interfaces that sometimes have
 * default implementations and not classes.
 */
export class MonadLaws {
    monadLeftIdentity(a, f) {
        const F = this.F;
        return Equiv.of(F.flatMap(F.pure(a), f), f(a));
    }
    monadRightIdentity(fa) {
        const F = this.F;
        return Equiv.of(F.flatMap(fa, F.pure), fa);
    }
    mapFlatMapCoherence(fa, f) {
        const F = this.F;
        return Equiv.of(F.flatMap(fa, a => F.pure(f(a))), F.map(fa, f));
    }
    tailRecMStackSafety() {
        const F = this.F;
        const n = 10000;
        const res = F.tailRecM(0, i => F.pure(i < n ? Left(i + 1) : Right(i)));
        return Equiv.of(res, F.pure(n));
    }
}
applyMixins(MonadLaws, [ApplicativeLaws, FlatMapLaws]);
/**
 * Given a {@link Constructor} reference, returns its associated
 * {@link Monad} instance if it exists, or throws a `NotImplementedError`
 * in case there's no such association.
 *
 * ```typescript
 * import { Option, Monad, monadOf } from "funfix"
 *
 * const F: Monad<Option<any>> = monadOf(Option)
 * ```
 */
export const monadOf = getTypeClassInstance(Monad);
/**
 * Given an {@link Monad} instance, returns the {@link MonadLaws}
 * associated with it.
 */
export function monadLawsOf(instance) {
    return new (class extends MonadLaws {
        constructor() {
            super(...arguments);
            this.F = instance;
        }
    })();
}
/**
 * The `MonadError` type class is a {@link Applicative} that
 * also allows you to raise and or handle an error value.
 *
 * This type class allows one to abstract over error-handling
 * applicative types.
 *
 * MUST follow the law defined in {@link MonadErrorLaws}.
 *
 * ## Implementation notes
 *
 * Even though in TypeScript the Funfix library is using `abstract class` to
 * express type classes, when implementing this type class it is recommended
 * that you implement it as a mixin using "`implements`", instead of extending
 * it directly with "`extends`". See
 * [TypeScript: Mixins]{@link https://www.typescriptlang.org/docs/handbook/mixins.html}
 * for details and note that we already have `applyMixins` defined.
 *
 * Implementation example:
 *
 * ```typescript
 * import {
 *   HK,
 *   MonadError,
 *   registerTypeClassInstance,
 *   applyMixins,
 *   Try
 * } from "funfix"
 *
 * // Type alias defined for readability.
 * // HK is our encoding for higher-kinded types.
 * type BoxK<T> = HK<Box<any>, T>
 *
 * class Box<T> implements HK<Box<any>, T> {
 *   constructor(public value: Try<T>) {}
 *
 *   // Implements HK<Box<any>, A>, not really needed, but useful in order
 *   // to avoid type casts. Note they can and should be undefined:
 *   readonly _funKindF: Box<any>
 *   readonly _funKindA: T
 * }
 *
 * class BoxMonadError implements MonadError<Box<any>, any> {
 *   pure<A>(a: A): Box<A> { return new Box(Try.success(a)) }
 *
 *   flatMap<A, B>(fa: BoxK<A>, f: (a: A) => BoxK<B>): Box<B> {
 *     throw new NotImplementedError("Provide implementation")
 *   }
 *
 *   tailRecM<A, B>(a: A, f: (a: A) => BoxK<Either<A, B>>): Box<B> {
 *     throw new NotImplementedError("Provide implementation")
 *   }
 *
 *   raise<A>(e: any): HK<Box<any>, A> {
 *     return new Box(Try.failure(e))
 *   }
 *
 *   recoverWith<A>(fa: BoxK<A>, f: (e: any) => BoxK<A>): HK<Box<any>, A> {
 *     return new Box((fa as Box<A>).value.recoverWith(e => (f(e) as Box<A>).value))
 *   }
 *
 *   // Mixed in
 *   map: <A, B>(fa: BoxK<A>, f: (a: A) => B) => Box<B>
 *   map2: <A, B, Z>(fa: BoxK<A>, fb: BoxK<B>, f: (a: A, b: B) => Z) => Box<Z>
 *   ap: <A, B>(fa: BoxK<A>, ff: BoxK<(a: A) => B>) => Box<B>
 *   product: <A, B> (fa: BoxK<A>, fb: BoxK<B>) => Box<[A, B]>
 *   unit: () => Box<void>
 *   followedBy: <A, B>(fa: BoxK<A>, fb: BoxK<B>) => Box<B>
 *   followedByL: <A, B>(fa: BoxK<A>, fb: () => BoxK<B>) => Box<B>
 *   forEffect: <A, B>(fa: BoxK<A>, fb: BoxK<B>) => Box<A>
 *   forEffectL: <A, B>(fa: BoxK<A>, fb: () => BoxK<B>) => Box<A>
 *   recover: <A>(fa: HK<Box<any>, A>, f: (e: any) => A) => HK<Box<any>, A>
 *   attempt: <A>(fa: HK<Box<any>, A>) => HK<Box<any>, Either<any, A>>
 * }
 *
 * // Call needed in order to implement `map`, `map2`, `product`, etc.
 * // using the default implementations defined by `MonadError`,
 * // because we are using `implements` instead of `extends` above and
 * // because in this sample we want the default implementations,
 * // but note that you can always provide your own
 * applyMixins(BoxMonadError, [MonadError])
 *
 * // Registering global MonadError instance for Box, needed in order
 * // for the `functorOf(Box)`, `applyOf(Box)`, `applicativeOf(Box)`
 * // and `monadErrorOf(Box)` calls to work
 * registerTypeClassInstance(MonadError)(Box, new BoxMonadError())
 * ```
 *
 * We are using `implements` in order to support multiple inheritance and to
 * avoid inheriting any `static` members. In the Flow definitions (e.g.
 * `.js.flow` files) for Funfix these type classes are defined with
 * "`interface`", as they are meant to be interfaces that sometimes have
 * default implementations and not classes.
 *
 * ## Credits
 *
 * This type class is inspired by the equivalent in Haskell's
 * standard library and the implementation is inspired by the
 * [Typelevel Cats]{@link http://typelevel.org/cats/} project.
 */
export class MonadError {
}
// Implements TypeClass<F>
/** @hidden */
MonadError._funTypeId = "monadError";
/** @hidden */
MonadError._funSupertypeIds = ["functor", "apply", "applicative", "monad", "applicativeError"];
applyMixins(MonadError, [Monad, ApplicativeError]);
/**
 * Type class laws defined for {@link MonadError}.
 *
 * This is an abstract definition. In order to use it in unit testing,
 * the implementor must think of a strategy to evaluate the truthiness
 * of the returned `Equiv` values.
 *
 * Even though in TypeScript the Funfix library is using classes to
 * express these laws, when implementing this class it is recommended
 * that you implement it as a mixin using `implements`, instead of extending
 * it directly with `extends`. See
 * [TypeScript: Mixins]{@link https://www.typescriptlang.org/docs/handbook/mixins.html}
 * for details and note that we already have `applyMixins` defined.
 *
 * We are doing this in order to support multiple inheritance and to
 * avoid inheriting any `static` members. In the Flow definitions (e.g.
 * `.js.flow` files) for Funfix these classes are defined with
 * `interface`, as they are meant to be interfaces that sometimes have
 * default implementations and not classes.
 */
export class MonadErrorLaws {
    monadErrorLeftZero(e, f) {
        const F = this.F;
        return Equiv.of(F.flatMap(F.raise(e), f), F.raise(e));
    }
}
applyMixins(MonadErrorLaws, [MonadLaws, ApplicativeErrorLaws]);
/**
 * Given a {@link Constructor} reference, returns its associated
 * {@link MonadError} instance if it exists, or throws a `NotImplementedError`
 * in case there's no such association.
 *
 * ```typescript
 * import { IO, MonadError, monadErrorOf } from "funfix"
 *
 * const F: MonadError<IO<any>> = monadErrorOf(IO)
 * ```
 */
export const monadErrorOf = getTypeClassInstance(MonadError);
/**
 * Given an {@link MonadError} instance, returns the
 * {@link MonadErrorLaws} associated with it.
 */
export function monadErrorLawsOf(instance) {
    return new (class extends MonadErrorLaws {
        constructor() {
            super(...arguments);
            this.F = instance;
        }
    })();
}
//# sourceMappingURL=monad.js.map