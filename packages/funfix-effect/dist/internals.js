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
 * Reusable empty `IteratorLike` reference.
 *
 * @hidden
 */
export const emptyIteratorRef = { next: () => ({ done: true }) };
/**
 * Given an array or an `Iterable`, returns a simple iterator type
 * that we can use to traverse the given list lazily.
 *
 * @hidden
 */
export function iteratorOf(list) {
    if (!list)
        return emptyIteratorRef;
    if (Object.prototype.toString.call(list) !== "[object Array]")
        return list[Symbol.iterator]();
    const array = list;
    if (array.length === 0)
        return emptyIteratorRef;
    let cursor = 0;
    const next = () => {
        const value = array[cursor++];
        const done = cursor >= array.length;
        return { done, value };
    };
    return { next };
}
//# sourceMappingURL=internals.js.map