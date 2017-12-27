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
import { getTypeClassInstance } from "./kinds";
import { is } from "funfix-core";
/**
 * The `Eq` is a type class used to determine equality between 2
 * instances of the same type. Any 2 instances `x` and `y` are equal
 * if `eqv(x, y)` is `true`. Moreover, `eqv` should form an
 * equivalence relation.
 *
 * Example:
 *
 * ```typescript
 * const F = eqOf(Option)
 *
 * F.eqv(Some(1), Some(1)) // true
 * F.eqv(Some(1), None)    // false
 * ```
 *
 * MUST obey the laws defined in {@link EqLaws}.
 *
 * CREDITS: this type class is inspired by the equivalent in Haskell's
 * standard library and the implementation is inspired by the
 * [Typelevel Cats]{@link http://typelevel.org/cats/} project.
 */
export class Eq {
    /**
     * Tests equality for two values of type `A` by using the type's
     * registered `Eq` instance, falling back to the universal equality
     * defined by `is` and `IEquals` (in `funfix-core`) in case no such
     * `Eq<A>` is implemented.
     */
    static testEq(lh, rh) {
        if (!lh)
            return is(lh, rh);
        const types = lh.constructor["_funTypes"] || {};
        const instance = types[Eq._funTypeId];
        if (instance)
            return instance.eqv(lh, rh);
        // Fallback to IEquals or reference equality
        return is(lh, rh);
    }
}
// Implements TypeClass<F>
/** @hidden */
Eq._funTypeId = "eq";
/** @hidden */
Eq._funSupertypeIds = [];
/**
 * Type class laws defined for {@link Eq}.
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
export class EqLaws {
    /**
     * Equality is reflexive, i.e.
     * ```
     * a == a
     * ```
     */
    reflexive(a) {
        return this.F.eqv(a, a);
    }
    /**
     * Equality is symmetric, i.e.
     * ```
     * x == y <-> y == x
     * ```
     */
    symmetric(x, y) {
        return this.F.eqv(x, y) === this.F.eqv(y, x);
    }
    /**
     * Equality is transitive, i.e.
     * ```
     * x == y && y == z -> x == z
     * ```
     */
    transitive(x, y, z) {
        return !(this.F.eqv(x, y) && this.F.eqv(y, z)) || this.F.eqv(x, z);
    }
}
/**
 * Given a {@link Constructor} reference, returns its associated
 * {@link Eq} instance if it exists, or throws a `NotImplementedError`
 * in case there's no such association.
 *
 * ```typescript
 * import { Option, Eq, eqOf } from "funfix"
 *
 * const F: Eq<Option<any>> = eqOf(Option)
 * ```
 */
export const eqOf = getTypeClassInstance(Eq);
/**
 * Given an {@link Eq} instance, returns the {@link EqLaws}
 * associated with it.
 */
export function eqLawsOf(instance) {
    return new (class extends EqLaws {
        constructor() {
            super(...arguments);
            this.F = instance;
        }
    })();
}
//# sourceMappingURL=eq.js.map