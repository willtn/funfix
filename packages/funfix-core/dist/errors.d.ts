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
 * Type alias for errors that can be thrown.
 *
 * Since in JavaScript any object can be thrown, the standard
 * `Error` class (capital `E`) is not useful as a type in signatures,
 * the needed type being effectively `any`, but we still need a type
 * alias for documentation purposes.
 *
 * And since `any` represents an untyped object that bypasses the
 * type system, Funfix is using `Object` for TypeScript and `mixed`
 * for Flow to represent such throwables.
 */
export declare type Throwable = Error | Object;
/**
 * A composite error represents a list of errors that were caught
 * while executing logic which delays re-throwing of errors.
 */
export declare class CompositeError extends Error {
    private errorsRef;
    constructor(errors: Array<Throwable>);
    /**
     * Returns the full list of caught errors.
     */
    errors(): Array<Throwable>;
}
/**
 * A dummy error that can be used for testing purposes.
 */
export declare class DummyError extends Error {
    constructor(message?: string);
}
/**
 * Thrown by various accessor methods or partial functions to indicate
 * that the element being requested does not exist.
 */
export declare class NoSuchElementError extends Error {
    constructor(message?: string);
}
/**
 * Error throw in class constructors by implementations that
 * are sealed or final.
 */
export declare class IllegalInheritanceError extends Error {
    constructor(message?: string);
}
/**
 * Signals that a function has been invoked at an illegal
 * or inappropriate time.
 *
 * In other words, environment or application is not in an
 * appropriate state for the requested operation.
 */
export declare class IllegalStateError extends Error {
    constructor(message?: string);
}
/**
 * Signals that a function has been invoked with illegal
 * arguments.
 */
export declare class IllegalArgumentError extends Error {
    constructor(message?: string);
}
/**
 * Signals that a function or a method is missing an implementation,
 * which should be provided in the future.
 */
export declare class NotImplementedError extends Error {
    constructor(message?: string);
}
/**
 * Signals that completion of a procedure took longer than anticipated.
 */
export declare class TimeoutError extends Error {
    constructor(message?: string);
}
