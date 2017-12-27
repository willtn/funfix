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
 * `ICancelable` represents a one-time idempotent action that can be
 * used to cancel async computations, or to release resources that
 * active data sources are holding.
 *
 * It is similar in spirit to `java.io.Closeable`, but without the I/O
 * focus, or to `IDisposable` in Microsoft .NET.
 *
 * ```typescript
 * // Scheduling execution with a 10 seconds delay
 * const ref = setTimeout(() => console.log("Hello1"), 10000)
 * const task = Cancelable.of(() => clearTimeout(ref))
 *
 * // If we change our mind
 * task.cancel()
 * ```
 *
 * In case some API requires the return of an `ICancelable` reference,
 * but there isn't anything that can be canceled, then
 * {@link Cancelable.empty} can be used to return a reusable reference
 * that doesn't do anything when canceled.
 *
 * ```typescript
 * const task = Cancelable.empty()
 *
 * // It's a no-op, doesn't do anything
 * task.cancel()
 * ```
 *
 * Implementation sample:
 *
 * ```typescript
 * class MyCancelable implements ICancelable {
 *   // Idempotency guard
 *   private _isCanceled: boolean = false
 *
 *   cancel() {
 *     // We need an idempotency guarantee, any side-effects
 *     // need to happen only once
 *     if (!this._isCanceled) {
 *       this._isCanceled = true
 *       console.log("Was canceled!")
 *     }
 *   }
 * }
 * ```
 */
export interface ICancelable {
    cancel(): void;
}
/**
 * `Cancelable` is an {@link ICancelable} class providing useful
 * builders for simple cancelable references.
 */
export declare abstract class Cancelable implements ICancelable {
    abstract cancel(): void;
    /**
     * Lifts any callback into a `Cancelable` reference.
     *
     * ```typescript
     * const task = Cancelable.of(() => {
     *   console.log("I was canceled!")
     * })
     *
     * task.cancel()
     * //=> I was canceled!
     * ```
     *
     * The returned reference has guaranteed idempotence, so
     * calling it multiple times will trigger the given
     * callback only once.
     */
    static of(cb: () => void): Cancelable;
    /**
     * Returns a reusable `Cancelable` reference that doesn't
     * do anything on `cancel`.
     */
    static empty(): Cancelable;
    /**
     * Returns a [[Cancelable]] implementation that represents an
     * immutable list of [[Cancelable]] references which can be canceled
     * as a group.
     *
     * ```typescript
     * const list = Cancelable.collection(
     *   Cancelable.of(() => console.log("Cancelled #1")),
     *   Cancelable.of(() => console.log("Cancelled #2")),
     *   Cancelable.of(() => console.log("Cancelled #3"))
     * )
     *
     * list.cancel()
     * //=> Cancelled #1
     * //=> Cancelled #2
     * //=> Cancelled #3
     * ```
     *
     * @param refs is the array of references to cancel when
     *        cancellation is triggered
     */
    static collection(...refs: Array<ICancelable>): Cancelable;
    /**
     * Utility that cancels a list of cancelable references, delaying
     * any thrown exceptions until all references have been cancelled.
     *
     * In case multiple exceptions are caught, then the thrown exception
     * is going to be a `CompositeError`.
     */
    static cancelAll(refs: Cancelable[]): void;
}
/**
 * A `DummyCancelable` is for {@link ICancelable} references that
 * don't do anything on `cancel()` and thus can be ignored.
 *
 * The common supertype of {@link Cancelable.empty} and
 * {@link BoolCancelable.alreadyCanceled}.
 */
export declare class DummyCancelable implements ICancelable {
    protected readonly _funIsDummy: boolean;
    cancel(): void;
}
/**
 * `IBoolCancelable` represents a {@link ICancelable} that can be queried
 * for the canceled status.
 */
export interface IBoolCancelable extends ICancelable {
    /**
     * Return `true` in case this cancelable hasn't been canceled,
     * or `false` otherwise.
     *
     * ```typescript
     * const ref = BoolCancelable.of()
     *
     * ref.isCanceled() // false
     * ref.cancel()
     * ref.isCanceled() // true
     * ```
     */
    isCanceled(): boolean;
}
/**
 * `BoolCancelable` is an {@link IBoolCancelable} class providing useful
 * builders for cancelable references that can be queried for their
 * canceled status.
 */
export declare abstract class BoolCancelable implements IBoolCancelable {
    /** Inherited from {@link IBoolCancelable.isCanceled}. */
    abstract isCanceled(): boolean;
    /** Inherited from {@link ICancelable.cancel}. */
    abstract cancel(): void;
    /**
     * Lifts any callback into a `BoolCancelable` reference.
     *
     * ```typescript
     * const task = BoolCancelable.of(() => {
     *   console.log("I was canceled!")
     * })
     *
     * task.isCanceled()
     * //=> false
     *
     * task.cancel()
     * //=> I was canceled!
     *
     * task.isCanceled()
     * //=> true
     * ```
     *
     * The returned reference has guaranteed idempotence, so
     * calling it multiple times will trigger the given
     * callback only once.
     */
    static of(cb: () => void): BoolCancelable;
    /**
     * Returns a [[BoolCancelable]] implementation that doesn't do
     * anything on `cancel` except for changing the status of `isCanceled`
     * from `false` to `true`.
     *
     * ```typescript
     * const task = BoolCancelable.empty()
     *
     * task.isCanceled()
     * //=> false
     *
     * task.cancel()
     * task.isCanceled()
     * //=> true
     * ```
     */
    static empty(): BoolCancelable;
    /**
     * Returns a [[BoolCancelable]] reference that is already canceled.
     *
     * ```typescript
     * const ref = BoolCancelable.alreadyCanceled()
     *
     * ref.isCanceled()
     * //=> true
     *
     * // Doesn't do anything, it's a no-op
     * ref.cancel()
     * ```
     *
     * The implementation returns the same reusable reference.
     */
    static alreadyCanceled(): BoolCancelable;
    /**
     * Returns a [[BoolCancelable]] implementation that represents an
     * immutable list of [[Cancelable]] references which can be
     * canceled as a group.
     *
     * ```typescript
     * const list = BoolCancelable.collection(
     *   Cancelable.of(() => console.log("Cancelled #1")),
     *   Cancelable.of(() => console.log("Cancelled #2")),
     *   Cancelable.of(() => console.log("Cancelled #3"))
     * )
     *
     * list.cancel()
     * //=> Cancelled #1
     * //=> Cancelled #2
     * //=> Cancelled #3
     * ```
     *
     * @param refs is the array of references to cancel when
     *        cancellation is triggered
     */
    static collection(...refs: Array<ICancelable>): BoolCancelable;
}
/**
 * Represents a type of [[ICancelable]] that can hold
 * an internal reference to another cancelable (and thus
 * has to support the `update` operation).
 *
 * On assignment, if this cancelable is already
 * canceled, then no assignment should happen and the update
 * reference should be canceled as well.
 */
export interface IAssignCancelable extends IBoolCancelable {
    /**
     * Updates the internal reference of this assignable cancelable
     * to the given value.
     *
     * If this cancelable is already canceled, then `value` is
     * going to be canceled on assignment as well.
     */
    update(value: ICancelable): this;
}
/**
 * `AssignCancelable` is an {@link IAssignCancelable} class providing
 * useful builders for cancelable references that can be assigned.
 */
export declare abstract class AssignCancelable implements IAssignCancelable {
    /** Inherited from {@link IAssignCancelable.update}. */
    abstract update(value: ICancelable): this;
    /** Inherited from {@link IBoolCancelable.isCanceled}. */
    abstract isCanceled(): boolean;
    /** Inherited from {@link ICancelable.cancel}. */
    abstract cancel(): void;
    /**
     * Returns an [[AssignCancelable]] reference that is already
     * canceled.
     *
     * ```typescript
     * const ref = AssignCancelable.alreadyCanceled()
     * ref.isCanceled() //=> true
     *
     * const c = BooleanCancelable.empty()
     * ref.update(c) // cancels c
     * c.isCanceled() // true
     * ```
     *
     * The implementation returns the same reusable reference.
     */
    static alreadyCanceled(): AssignCancelable;
    /**
     * Returns a new [[AssignCancelable]] that's empty.
     *
     * The returned reference is an instance of
     * [[MultiAssignCancelable]], but this is an implementation
     * detail that may change in the future.
     */
    static empty(): AssignCancelable;
    /**
     * Initiates an [[AssignCancelable]] reference and assigns it
     * a reference that wraps the given `cb` callback.
     *
     * So this code:
     *
     * ```typescript
     * AssignCancelable.of(() => console.log("cancelled"))
     * ```
     *
     * Is equivalent to this:
     *
     * ```typescript
     * const ref = AssignCancelable.empty()
     * ref.update(Cancelable.of(() => console.log("cancelled")))
     * ```
     */
    static of(cb: () => void): AssignCancelable;
}
/**
 * The `MultiAssignCancelable` is an {@link IAssignCancelable} whose
 * underlying cancelable reference can be swapped for another.
 *
 * Example:
 *
 * ```typescript
 * const ref = MultiAssignCancelable()
 * ref.update(c1) // sets the underlying cancelable to c1
 * ref.update(c2) // swaps the underlying cancelable to c2
 *
 * ref.cancel() // also cancels c2
 * ref := c3 // also cancels c3, because s is already canceled
 * ```
 *
 * Also see [[SerialCancelable]], which is similar, except that it
 * cancels the old cancelable upon assigning a new cancelable.
 */
export declare class MultiAssignCancelable implements IAssignCancelable {
    private _underlying?;
    private _canceled;
    constructor(initial?: ICancelable);
    /** @inheritdoc */
    update(value: ICancelable): this;
    /** @inheritdoc */
    isCanceled(): boolean;
    /** @inheritdoc */
    cancel(): void;
    /**
     * In case the underlying reference is also a `MultiAssignCancelable`, then
     * collapse its state into this one.
     *
     * ```typescript
     * const c = Cancelable.of(() => console.info("Cancelled!"))
     *
     * const mc1 = new MultiAssignCancelable()
     * mc1.update(c)
     *
     * const mc2 = new MultiAssignCancelable()
     * mc2.update(mc1)
     *
     * // After this the underlying reference of `mc2` becomes `c`
     * mc2.collapse()
     * ```
     */
    collapse(): this;
    /**
     * Sets the underlying cancelable reference to `undefined`,
     * useful for garbage-collecting purposes.
     */
    clear(): this;
    /**
     * Returns a new [[MultiAssignCancelable]] that's empty.
     */
    static empty(): MultiAssignCancelable;
    /**
     * Initiates an [[MultiAssignCancelable]] reference and assigns it
     * a reference that wraps the given `cb` callback.
     *
     * So this code:
     *
     * ```typescript
     * MultiAssignCancelable.of(() => console.log("cancelled"))
     * ```
     *
     * Is equivalent to this:
     *
     * ```typescript
     * const ref = MultiAssignCancelable.empty()
     * ref.update(Cancelable.of(() => console.log("cancelled")))
     * ```
     */
    static of(cb: () => void): MultiAssignCancelable;
}
/**
 * The `SerialCancelable` is an {@link IAssignCancelable} whose underlying
 * cancelable reference can be swapped for another and on each
 * swap the previous reference gets canceled.
 *
 * Example:
 *
 * ```typescript
 * const ref = SerialCancelable()
 * ref.update(c1) // sets the underlying cancelable to c1
 * ref.update(c2) // cancels c1, swaps the underlying cancelable to c2
 *
 * ref.cancel() // also cancels c2
 * ref := c3 // also cancels c3, because s is already canceled
 * ```
 *
 * Also see [[SerialCancelable]], which is similar, except that it
 * cancels the old cancelable upon assigning a new cancelable.
 */
export declare class SerialCancelable implements IAssignCancelable {
    private _underlying?;
    private _canceled;
    constructor(initial?: ICancelable);
    update(value: ICancelable): this;
    isCanceled(): boolean;
    cancel(): void;
    /**
     * Returns a new [[SerialCancelable]] that's empty.
     */
    static empty(): SerialCancelable;
    /**
     * Initiates an [[SerialCancelable]] reference and assigns it
     * a reference that wraps the given `cb` callback.
     *
     * So this code:
     *
     * ```typescript
     * SerialCancelable.of(() => console.log("cancelled"))
     * ```
     *
     * Is equivalent to this:
     *
     * ```typescript
     * const ref = SerialCancelable.empty()
     * ref.update(Cancelable.of(() => console.log("cancelled")))
     * ```
     */
    static of(cb: () => void): SerialCancelable;
}
/**
 * The `SingleAssignCancelable` is a [[Cancelable]] that can be
 * assigned only once to another cancelable reference.
 *
 * Example:
 *
 * ```typescript
 * const ref = SingleAssignCancelable()
 * ref.update(c1) // sets the underlying cancelable to c1
 *
 * ref.update(c2) // throws IllegalStateError
 * ```
 *
 * See [[MultiAssignCancelable]] for a similar type that can be
 * assigned multiple types.
 */
export declare class SingleAssignCancelable implements IAssignCancelable {
    private _wasAssigned;
    private _canceled;
    private _underlying?;
    constructor();
    /** @inheritdoc */
    update(value: ICancelable): this;
    /** @inheritdoc */
    isCanceled(): boolean;
    /** @inheritdoc */
    cancel(): void;
    /**
     * Returns a new [[SingleAssignCancelable]] that's empty.
     */
    static empty(): SingleAssignCancelable;
    /**
     * Initiates an [[SingleAssignCancelable]] reference and assigns it
     * a reference that wraps the given `cb` callback.
     *
     * So this code:
     *
     * ```typescript
     * SingleAssignCancelable.of(() => console.log("cancelled"))
     * ```
     *
     * Is equivalent to this:
     *
     * ```typescript
     * const ref = SingleAssignCancelable.empty()
     * ref.update(Cancelable.of(() => console.log("cancelled")))
     * ```
     */
    static of(cb: () => void): SingleAssignCancelable;
}
/**
 * Represents a composite of cancelable references that are stacked,
 * so you can push a new reference, or pop an existing one and when
 * it gets canceled, then the whole stack gets canceled.
 *
 * The references are pushed and popped in a FIFO order.
 *
 * Used in the implementation of `Task`.
 *
 * @final
 */
export declare class StackedCancelable implements IBoolCancelable {
    private _refs?;
    constructor(initial?: ICancelable[]);
    cancel(): void;
    isCanceled(): boolean;
    /**
     * Pushes a cancelable reference on the stack, to be popped or
     * cancelled later in FIFO order.
     */
    push(value: ICancelable): this;
    /**
     * Removes a cancelable reference from the stack in FIFO order.
     *
     * @return the cancelable reference that was removed.
     */
    pop(): ICancelable;
    /**
     * Returns a new {@link StackedCancelable} that's empty.
     */
    static empty(): StackedCancelable;
    /**
     * Returns a {@link StackedCancelable} that's initialized with
     * the given list of cancelable references.
     *
     * ```typescript
     * const list = StackedCancelable.collection(
     *   Cancelable.of(() => console.log("Cancelled #1")),
     *   Cancelable.of(() => console.log("Cancelled #2")),
     *   Cancelable.of(() => console.log("Cancelled #3"))
     * )
     *
     * // Popping cancelable no. 3 from the stack
     * list.pop()
     *
     * list.cancel()
     * //=> Cancelled #1
     * //=> Cancelled #2
     * ```
     *
     * @param refs is the array of references to cancel when
     *        cancellation is triggered
     */
    static collection(...refs: Array<ICancelable>): StackedCancelable;
}
/**
 * Represents an {@link IAssignCancelable} whose underlying
 * cancelable reference can be swapped for another. It can
 * be "chained" to another `ChainedCancelable`, forwarding all
 * operations to it.
 *
 * For most purposes it works like a {@link MultiAssignCancelable}:
 *
 * ```typescript
 *   const s = ChainedCancelable.empty()
 *   s.update(c1) // sets the underlying cancelable to c1
 *   s.update(c2) // swaps the underlying cancelable to c2
 *
 *   s.cancel() // also cancels c2
 *   s.update(c3) // also cancels c3, because s is already canceled
 * ```
 *
 * However it can also be linked to another `ChainedCancelable`
 * reference, forwarding all requests to it:
 *
 * ```typescript
 *   const source = ChainedCancelable.empty()
 *   const child1 = ChainedCancelable.empty()
 *   const child2 = ChainedCancelable.empty()
 *
 *   // Hence forth forwards all operations on `child1` to `source`
 *   child1.chainTo(source)
 *
 *   // Also forwarding all `child2` operations to `source`.
 *   // This happens because `child1` was linked to `source` first
 *   // but order matters, as `child2` will be linked directly
 *   // to `source` and not to `child1`, in order for `child1` to
 *   // be garbage collected if it goes out of scope ;-)
 *   child2.chainTo(child1)
 *
 *   // Source will be updated with a new Cancelable ref
 *   child1.update(Cancelable.from(() => println("Cancelling (1)")))
 *
 *   // Source will be updated with another Cancelable ref
 *   child2.update(Cancelable.from(() => println("Cancelling (2)")))
 *
 *   source.cancel()
 *   //=> Cancelling (2)
 * ```
 *
 * This implementation is a special purpose {@link IAssignCancelable},
 * much like {@link StackedCancelable}, to be used in `flatMap`
 * implementations that need it.
 *
 * The problem that it solves in Funfix's codebase is that various
 * `flatMap` implementations need to be memory safe.
 * By "chaining" cancelable references, we allow the garbage collector
 * to get rid of references created in a `flatMap` loop, the goal
 * being to consume a constant amount of memory. Thus this
 * implementation is used for the {@link Future} implementation.
 *
 * If unsure about what to use, then you probably don't need
 * {@link ChainedCancelable}. Use {@link MultiAssignCancelable} or
 * {@link SingleAssignCancelable} for most purposes.
 */
export declare class ChainedCancelable implements IAssignCancelable {
    private _underlying?;
    private _chained;
    constructor(initial?: ICancelable);
    update(value: ICancelable): this;
    cancel(): void;
    /**
     * Clears the underlying reference, resetting it to a dummy
     * reference.
     *
     * To be used for garbage collecting purposes.
     */
    clear(): void;
    isCanceled(): boolean;
    /**
     * Chains this `ChainedCancelable` to another reference,
     * such that all operations are forwarded to `other`.
     *
     * ```typescript
     * const source = ChainedCancelable.empty()
     * const child1 = ChainedCancelable.empty()
     * const child2 = ChainedCancelable.empty()
     *
     * // Hence forth forwards all operations on `child1` to `source`
     * child1.chainTo(source)
     *
     * // Also forwarding all `child2` operations to `source`
     * // (this happens because `child1` was linked to `source` first
     * // but order matters ;-))
     * child2.chainTo(child1)
     *
     * // Source will be updated with a new Cancelable ref
     * child1.update( Cancelable.of(() => console.log("Cancelling (1)")) )
     *
     * // Source will be updated with another Cancelable ref
     * child2.update( Cancelable.of (() => console.log("Cancelling (2)")) )
     *
     * source.cancel()
     * //=> Cancelling (2)
     * ```
     */
    chainTo(other: ChainedCancelable): this;
    /**
     * Returns a new, empty [[ChainedCancelable]].
     */
    static empty(): ChainedCancelable;
}
