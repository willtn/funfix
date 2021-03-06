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
/**
 * Interface for testing the equality of value objects.
 */
export interface IEquals<A> {
    /**
     * Indicates whether some other object is "equal to" this one.
     *
     * Properties:
     *
     *  - reflexive: for any value, `x.equals(x) == true`
     *  - symmetric: for any values x and y, `x.equals(y) == y.equals(x)`
     *  - transitive: `x.equals(y) && y.equals(z) => x.equals(z)`
     *  - consistent: `x.equals(y)` always yields the same result
     *
     * Rule: equal objects MUST have equal hash codes!
     */
    equals(other: A): boolean;
    /**
     * Returns a hash code value for this value.
     *
     * This method is supported for the benefit of hash tables.
     *
     * Properties:
     *
     *  - consistent: multiple invocations always yield the same result
     *  - if `x.equals(y) == true` then `x.hashCode() == y.hashCode()`
     *  - if `x.equals(y) == false` it is NOT required for their hash codes
     *    to be equal, i.e. this function is not injective
     */
    hashCode(): number;
}
/**
 * Test if the given reference is a value object.
 *
 * Value objects are objects that implement the [[IEquals]]
 * interface.
 *
 * @param ref is the reference to test
 */
export declare function isValueObject(ref: any): boolean;
/**
 * Tests for universal equality.
 *
 * First attempting a reference check with `===`,
 * after which it tries to fallback on [[IEquals]], if the
 * left-hand side is implementing it.
 *
 * ```typescript
 * equals(10, 10) // true, because 10 === 10
 *
 * class Box implements IEquals<Box> {
 *   constructor(value: number) { this.value = value }
 *
 *   equals(other) { return this.value === other.value  }
 *   hashCode() { return this.value << 2 }
 * }
 *
 * // false, because they are not the same reference
 * new Box(10) === new Box(10)
 *
 * // true, because `Box#equals` gets called
 * equals(new Box(10), new Box(10))
 * ```
 */
export declare function is<A>(lh: A, rh: A): boolean;
/** Alias for [[is]]. */
export declare function equals<A>(lh: A, rh: A): boolean;
/**
 * Universal hash-code function.
 *
 * Depending on the given value, it calculates the hash-code like so:
 *
 *  1. if it's a `number`, then it gets truncated
 *     to an integer and returned
 *  2. if it's a "value object" (see [[isValueObject]]), then
 *     its `hashCode` is used
 *  3. if a `valueOf()` function is provided, then the
 *     `hashCode` gets recursively invoked on its result
 *  4. if all else fails, the value gets coerced to a `String`
 *     and a hash code is calculated using [[hashCodeOfString]]
 *
 * @param ref is the value to use for calculating a hash code
 * @return an integer with the aforementioned properties
 */
export declare function hashCode(ref: any): number;
/**
 * Calculates a hash code out of any string.
 */
export declare function hashCodeOfString(str: string): number;
/** The identity function. */
export declare function id<A>(a: A): A;
/**
 * Utility function for implementing mixins, based on the
 * [TypeScript Mixins]{@link https://www.typescriptlang.org/docs/handbook/mixins.html}
 * documentation.
 *
 * Sample:
 *
 * ```typescript
 * class Disposable { ... }
 * class Activatable { ... }
 * class SmartObject implements Disposable, Activatable { ... }
 *
 * applyMixins(SmartObject, [Disposable, Activatable]);
 * ```
 *
 * Using `implements` instead of `extends` for base classes
 * will make the type system treat them like interfaces instead of
 * classes. And by `applyMixins` we can also supply global
 * implementations for the non-abstract members.
 */
export declare function applyMixins(derivedCtor: {
    prototype: any;
}, baseCtors: {
    prototype: any;
}[]): void;
