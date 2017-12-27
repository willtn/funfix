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
 * Given a sorted array, searches for an insert position for a given search
 * element such that, if inserted in the array at the returned position,
 * the array would remain sorted.
 *
 * @Hidden
 */
export declare function arrayBSearchInsertPos<A>(array: Array<A>, f: (a: A) => number): ((search: number) => number);
/**
 * Internal utility that builds an iterator out of an `Iterable` or an `Array`.
 *
 * @hidden
 */
export declare function iterableToArray<A>(values: Iterable<A>): A[];
/**
 * Natural log of 2.
 * @hidden
 */
export declare const lnOf2: number;
/**
 * Calculates the base 2 logarithm of the given argument.
 *
 * @hidden
 * @return a number such that 2^nr^ is equal to our argument.
 */
export declare function log2(x: number): number;
/**
 * The maximum number that can be returned by {@link nextPowerOf2}.
 * @hidden
 */
export declare const maxPowerOf2: number;
/**
 * Given a positive integer, returns the next power of 2 that is bigger
 * than our argument, or the maximum that this function can
 * return which is 2^30^ (or 1,073,741,824).
 *
 * @return an integer that is a power of 2, that is bigger or
 *        equal with our argument and that is "closest" to it.
 *
 * @hidden
 */
export declare function nextPowerOf2(nr: number): number;
