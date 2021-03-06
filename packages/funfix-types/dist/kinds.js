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
import { IllegalArgumentError, NotImplementedError } from "funfix-core";
/**
 * Data type for expressing equivalence in type class laws.
 *
 * @final
 */
export class Equiv {
    constructor(lh, rh) {
        this.lh = lh;
        this.rh = rh;
    }
    static of(lh, rh) {
        return new Equiv(lh, rh);
    }
}
/**
 * Given a {@link TypeClass} definition in `tc`, register an `instance`
 * for the given {@link Constructor} specified by `c` that implements the
 * given type class.
 *
 * Example:
 *
 * ```typescript
 * registerTypeClassInstance(Functor)(Box, new BoxFunctorInstance())
 * ```
 *
 * Data types can have only one implementation for a given type class.
 * Multiple implementations are not allowed, therefore registration needs
 * to happen at most once. If registration happens multiple times for
 * instances of the same data type and type class, then an exception is
 * going to be raised:
 *
 * ```typescript
 * // Ok
 * registerTypeClassInstance(Functor)(Box, new FunctorInstance1())
 *
 * // IllegalArgumentError: Type class coherence issue,
 * // Functor<Box> is already defined!
 * registerTypeClassInstance(Functor)(Box, new FunctorInstance1())
 * ```
 *
 * Note that type classes can have super types. So for example registering
 * a `Monad` instance will also register a `Functor` instance, along with
 * `Applicative`. The registration of supertypes however does not trigger
 * coherence errors. In this example, if you try registering a `Monad`,
 * but a `Functor` was already registered, then that the given `Monad`
 * will simply not be registered as a `Functor` for that data type.
 *
 * This is legal:
 *
 * ```typescript
 * // Ok
 * registerTypeClassInstance(Functor)(Box, new FunctorInstance())
 *
 * // Ok, even though a Monad is also a Functor
 * registerTypeClassInstance(Functor)(Box, new MonadInstance())
 * ```
 *
 * @throws `IllegalArgumentError` in case such a type class instance
 * was already specified, thus leading to a coherence issue.
 */
export function registerTypeClassInstance(tc) {
    return (c, instance) => {
        const obj = c;
        const types = (obj["_funTypes"] || {});
        obj["_funTypes"] = types;
        const existing = types[tc._funTypeId];
        if (existing) {
            // If trying to register the same instance, then ignore
            if (existing === instance)
                return;
            // Coherence issue
            const name = existing.constructor.name;
            throw new IllegalArgumentError("Type class coherence issue, " +
                `${name}<${c.name}> is already defined!`);
        }
        types[tc._funTypeId] = instance;
        for (const id of tc._funSupertypeIds) {
            if (!types[id])
                types[id] = instance;
        }
    };
}
/**
 * Given a {@link TypeClass} instance and a {@link Constructor} reference,
 * returns its associated type class implementation if it exists, or throws
 * a `NotImplementedError` in case there's no such association.
 *
 * ```typescript
 * import { Option, Functor, getTypeClass } from "funfix"
 *
 * const F: Functor<Option<any>> = getTypeClass(Functor, Option)
 * ```
 */
export function getTypeClassInstance(tc) {
    return (c) => {
        const obj = c;
        const types = obj["_funTypes"] || {};
        const instance = types[tc._funTypeId];
        if (instance)
            return instance;
        throw new NotImplementedError(`${tc.name}<${obj.name}>`);
    };
}
//# sourceMappingURL=kinds.js.map