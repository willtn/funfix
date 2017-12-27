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
import { IEquals, Throwable } from "funfix-core";
import { Duration } from "./time";
import { ICancelable } from "./cancelable";
import { DynamicRef } from "./ref";
/**
 * A `Scheduler` is an execution context that can execute units of
 * work asynchronously, with a delay or periodically.
 *
 * It replaces Javascript's `setTimeout`, which is desirable due to
 * the provided utilities and because special behavior might be needed
 * in certain specialized contexts (e.g. tests), even if the
 * [[Scheduler.global]] reference is implemented with `setTimeout`.
 */
export declare abstract class Scheduler {
    /**
     *  The {@link ExecutionModel} is a specification of how run-loops
     * and producers should behave in regards to executing tasks
     * either synchronously or asynchronously.
     */
    readonly executionModel: ExecutionModel;
    /**
     * Index of the current cycle, incremented automatically (modulo
     * the batch size) when doing execution by means of
     * {@link Scheduler.executeBatched} and the `Scheduler` is
     * configured with {@link ExecutionModel.batched}.
     *
     * When observed as being zero, it means an async boundary just
     * happened.
     */
    batchIndex: number;
    /**
     * @param em the {@link ExecutionModel} to use for
     *        {@link Scheduler.executionModel}, should default to
     *        {@link ExecutionModel.global}
     */
    protected constructor(em: ExecutionModel);
    /**
     * Executes tasks in batches, according to the rules set by the
     * given {@link ExecutionModel}.
     *
     * The rules, depending on the chosen `ExecutionModel`:
     *
     * - if `synchronous`, then all tasks are executed with
     *   {@link Scheduler.trampoline}
     * - if `asynchronous`, then all tasks are executed with
     *   {@link Scheduler.executeAsync}
     * - if `batched(n)`, then `n` tasks will be executed
     *   with `Scheduler.trampoline` and then the next execution
     *   will force an asynchronous boundary by means of
     *   `Scheduler.executeAsync`
     *
     * Thus, in case of batched execution, an internal counter gets
     * incremented to keep track of how many tasks where executed
     * immediately (trampolined), a counter that's reset when reaching
     * the threshold or when an `executeAsync` happens.
     */
    readonly executeBatched: (runnable: () => void) => void;
    /**
     * Schedules the given `command` for async execution.
     *
     * In [[GlobalScheduler]] this method uses
     * [setImmediate]{@link https://developer.mozilla.org/en/docs/Web/API/Window/setImmediate}
     * when available. But given that `setImmediate` is a very
     * non-standard operation that is currently implemented only by
     * IExplorer and Node.js, on non-supporting environments we fallback
     * on `setTimeout`. See
     * [the W3C proposal]{@link https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html}.
     *
     * @param runnable is the thunk to execute asynchronously
     */
    abstract executeAsync(runnable: () => void): void;
    /**
     * Execute the given `runnable` on the current call stack by means
     * of a "trampoline", preserving stack safety.
     *
     * This is an alternative to {@link executeAsync} for triggering
     * light asynchronous boundaries.
     */
    abstract trampoline(runnable: () => void): void;
    /** Reports that an asynchronous computation failed. */
    abstract reportFailure(e: Throwable): void;
    /**
     * Returns the current time in milliseconds.  Note that while the
     * unit of time of the return value is a millisecond, the
     * granularity of the value depends on the underlying operating
     * system and may be larger.  For example, many operating systems
     * measure time in units of tens of milliseconds.
     *
     * It's the equivalent of `Date.now()`. When wanting to measure
     * time, do not use `Date.now()` directly, prefer this method
     * instead, because then it can be mocked for testing purposes,
     * or overridden for better precision.
     */
    abstract currentTimeMillis(): number;
    /**
     * Schedules a task to run in the future, after `delay`.
     *
     * For example the following schedules a message to be printed to
     * standard output after 5 minutes:
     *
     * ```typescript
     * const task =
     *   scheduler.scheduleOnce(Duration.minutes(5), () => {
     *     console.log("Hello, world!")
     *   })
     *
     * // later if you change your mind ... task.cancel()
     * ```
     *
     * @param delay is the time to wait until the execution happens; if
     *        specified as a `number`, then it's interpreted as milliseconds;
     *        for readability, prefer passing [[Duration]] values
     * @param runnable is the callback to be executed
     *
     * @return a [[Cancelable]] that can be used to cancel the created
     *         task before execution.
     */
    abstract scheduleOnce(delay: number | Duration, runnable: () => void): ICancelable;
    /**
     * Given a function that will receive the underlying
     * {@link ExecutionModel}, returns a new {@link Scheduler}
     * reference, based on the source that exposes the new
     * `ExecutionModel` value when queried by means of the
     * {@link Scheduler.executionModel} property.
     *
     * This method enables reusing global scheduler references in
     * a local scope, but with a modified execution model to inject.
     *
     * The contract of this method (things you can rely on):
     *
     *  1. the source `Scheduler` must not be modified in any way
     *  2. the implementation should wrap the source efficiently, such
     *     that the result mirrors the implementation of the source
     *     `Scheduler` in every way except for the execution model
     *
     * Sample:
     *
     * ```typescript
     * import { Scheduler, ExecutionModel } from "funfix"
     *
     * const scheduler = Schedule.global()
     *   .withExecutionModel(ExecutionModel.trampolined())
     * ```
     */
    abstract withExecutionModel(em: ExecutionModel): Scheduler;
    /**
     * Schedules for execution a periodic task that is first executed
     * after the given initial delay and subsequently with the given
     * delay between the termination of one execution and the
     * commencement of the next.
     *
     * For example the following schedules a message to be printed to
     * standard output every 10 seconds with an initial delay of 5
     * seconds:
     *
     * ```typescript
     * const task =
     *   s.scheduleWithFixedDelay(Duration.seconds(5), Duration.seconds(10), () => {
     *     console.log("repeated message")
     *   })
     *
     * // later if you change your mind ...
     * task.cancel()
     * ```
     *
     * @param initialDelay is the time to wait until the first execution happens
     * @param delay is the time to wait between 2 successive executions of the task
     * @param runnable is the thunk to be executed
     * @return a cancelable that can be used to cancel the execution of
     *         this repeated task at any time.
     */
    scheduleWithFixedDelay(initialDelay: number | Duration, delay: number | Duration, runnable: () => void): ICancelable;
    /**
     * Schedules a periodic task that becomes enabled first after the given
     * initial delay, and subsequently with the given period. Executions will
     * commence after `initialDelay` then `initialDelay + period`, then
     * `initialDelay + 2 * period` and so on.
     *
     * If any execution of the task encounters an exception, subsequent executions
     * are suppressed. Otherwise, the task will only terminate via cancellation or
     * termination of the scheduler. If any execution of this task takes longer
     * than its period, then subsequent executions may start late, but will not
     * concurrently execute.
     *
     * For example the following schedules a message to be printed to standard
     * output approximately every 10 seconds with an initial delay of 5 seconds:
     *
     * ```typescript
     * const task =
     *   s.scheduleAtFixedRate(Duration.seconds(5), Duration.seconds(10), () => {
     *     console.log("repeated message")
     *   })
     *
     *   // later if you change your mind ...
     *   task.cancel()
     * ```
     *
     * @param initialDelay is the time to wait until the first execution happens
     * @param period is the time to wait between 2 successive executions of the task
     * @param runnable is the thunk to be executed
     * @return a cancelable that can be used to cancel the execution of
     *         this repeated task at any time.
     */
    scheduleAtFixedRate(initialDelay: number | Duration, period: number | Duration, runnable: () => void): ICancelable;
    /**
     * Exposes a reusable [[GlobalScheduler]] reference by means of a
     * {@link DynamicRef}, which allows for lexically scoped bindings to happen.
     *
     * ```typescript
     * const myScheduler = new GlobalScheduler(false)
     *
     * Scheduler.global.bind(myScheduler, () => {
     *   Scheduler.global.get() // myScheduler
     * })
     *
     * Scheduler.global.get() // default instance
     * ```
     */
    static readonly global: DynamicRef<Scheduler>;
}
/**
 * The `ExecutionModel` is a specification for how potentially asynchronous
 * run-loops should execute, imposed by the `Scheduler`.
 *
 * When executing tasks, a run-loop can always execute tasks
 * asynchronously (by forking logical threads), or it can always
 * execute them synchronously (same thread and call-stack, by
 * using an internal trampoline), or it can do a mixed mode
 * that executes tasks in batches before forking.
 *
 * The specification is considered a recommendation for how
 * run loops should behave, but ultimately it's up to the client
 * to choose the best execution model. This can be related to
 * recursive loops or to events pushed into consumers.
 */
export declare class ExecutionModel implements IEquals<ExecutionModel> {
    /**
     * Recommended batch size used for breaking synchronous loops in
     * asynchronous batches. When streaming value from a producer to
     * a synchronous consumer it's recommended to break the streaming
     * in batches as to not hold the current thread or run-loop
     * indefinitely.
     *
     * This is rounded to the next power of 2, because then for
     * applying the modulo operation we can just do:
     *
     * ```typescript
     * const modulus = recommendedBatchSize - 1
     * // ...
     * nr = (nr + 1) & modulus
     * ```
     */
    recommendedBatchSize: number;
    /**
     * The type of the execution model, which can be:
     *
     * - `batched`: the default, specifying an mixed execution
     *   mode under which tasks are executed synchronously in
     *   batches up to a maximum size; after a batch of
     *   {@link recommendedBatchSize} is executed, the next
     *   execution should be asynchronous.
     * - `synchronous`: specifies that execution should be
     *   synchronous (immediate / trampolined) for as long as
     *   possible.
     * - `alwaysAsync`: specifies a run-loop should always do
     *   async execution of tasks, triggering asynchronous
     *   boundaries on each step.
     */
    type: "batched" | "synchronous" | "alwaysAsync";
    private constructor();
    /** Implements `IEquals.equals`. */
    equals(other: ExecutionModel): boolean;
    /** Implements `IEquals.hashCode`. */
    hashCode(): number;
    /**
     * An {@link ExecutionModel} that specifies that execution should be
     * synchronous (immediate, trampolined) for as long as possible.
     */
    static synchronous(): ExecutionModel;
    /**
     * An {@link ExecutionModel} that specifies a run-loop should always do
     * async execution of tasks, thus triggering asynchronous boundaries on
     * each step.
     */
    static alwaysAsync(): ExecutionModel;
    /**
     * Returns an {@link ExecutionModel} that specifies a mixed execution
     * mode under which tasks are executed synchronously in batches up to
     * a maximum size, the `recommendedBatchSize`.
     *
     * After such a batch of {@link recommendedBatchSize} is executed, the
     * next execution should have a forced asynchronous boundary.
     */
    static batched(recommendedBatchSize?: number): ExecutionModel;
    /**
     * The default {@link ExecutionModel} that should be used whenever
     * an execution model isn't explicitly specified.
     */
    static readonly global: DynamicRef<ExecutionModel>;
}
/**
 * `GlobalScheduler` is a [[Scheduler]] implementation based on Javascript's
 * [setTimeout]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout}
 * and (if available and configured)
 * [setImmediate]{@link https://developer.mozilla.org/en/docs/Web/API/Window/setImmediate}.
 */
export declare class GlobalScheduler extends Scheduler {
    /**
     * If `true`, then `setImmediate` is used in `execute`.
     */
    private readonly _useSetImmediate;
    /**
     * {@link Trampoline} used for immediate execution in
     * {@link Scheduler.trampoline}.
     */
    private readonly _trampoline;
    /**
     * @param canUseSetImmediate is a boolean informing the
     *        `GlobalScheduler` implementation that it can use the
     *        nonstandard `setImmediate` for scheduling asynchronous
     *        tasks without extra delays.
     *
     * @param em the {@link ExecutionModel} to use for
     *        {@link Scheduler.executionModel}, should default to
     *        {@link ExecutionModel.global}
     *
     * @param reporter is the reporter to use for reporting uncaught
     *        errors, defaults to `console.error`
     */
    constructor(canUseSetImmediate?: boolean, em?: ExecutionModel, reporter?: (e: Throwable) => void);
    executeAsync(runnable: () => void): void;
    trampoline(runnable: () => void): void;
    reportFailure(e: Throwable): void;
    currentTimeMillis(): number;
    scheduleOnce(delay: number | Duration, runnable: () => void): ICancelable;
    withExecutionModel(em: ExecutionModel): GlobalScheduler;
}
/**
 * The `TestScheduler` is a {@link Scheduler} type meant for testing purposes,
 * being capable of simulating asynchronous execution and the passage of time.
 *
 * Example:
 *
 * ```typescript
 * const s = new TestScheduler()
 *
 * s.execute(() => { console.log("Hello, world!") })
 *
 * // Triggers actual execution
 * s.tick()
 *
 * // Simulating delayed execution
 * const task = s.scheduleOnce(Duration.seconds(10), () => {
 *   console.log("Hello, delayed!")
 * })
 *
 * // We can cancel a delayed task if we want
 * task.cancel()
 *
 * // Or we can execute it by moving the internal clock forward in time
 * s.tick(Duration.seconds(10))
 * ```
 */
export declare class TestScheduler extends Scheduler {
    private _reporter;
    private _trampoline;
    private _stateRef?;
    /**
     * @param reporter is an optional function that will be called
     *        whenever {@link Scheduler.reportFailure} is invoked.
     *
     * @param em the {@link ExecutionModel} to use for
     *        the {@link Scheduler.executionModel}, defaults to
     *        `"synchronous"` for `TestScheduler`
     */
    constructor(reporter?: (error: any) => void, em?: ExecutionModel);
    private _state();
    /**
     * Returns a list of triggered errors, if any happened during
     * the {@link tick} execution.
     */
    triggeredFailures(): Array<any>;
    /**
     * Returns `true` if there are any tasks left to execute, `false`
     * otherwise.
     */
    hasTasksLeft(): boolean;
    executeAsync(runnable: () => void): void;
    trampoline(runnable: () => void): void;
    reportFailure(e: Throwable): void;
    currentTimeMillis(): number;
    scheduleOnce(delay: number | Duration, runnable: () => void): ICancelable;
    withExecutionModel(em: ExecutionModel): TestScheduler;
    /**
     * Executes the current batch of tasks that are pending, relative
     * to [currentTimeMillis]{@link TestScheduler.currentTimeMillis}.
     *
     * ```typescript
     * const s = new TestScheduler()
     *
     * // Immediate execution
     * s.executeAsync(() => console.log("A"))
     * s.executeAsync(() => console.log("B"))
     * // Delay with 1 second from now
     * s.scheduleOnce(Duration.seconds(1), () => console.log("C"))
     * s.scheduleOnce(Duration.seconds(1), () => console.log("D"))
     * // Delay with 2 seconds from now
     * s.scheduleOnce(Duration.seconds(2), () => console.log("E"))
     * s.scheduleOnce(Duration.seconds(2), () => console.log("F"))
     *
     * // Actual execution...
     *
     * // Prints A, B
     * s.tick()
     * // Prints C, D
     * s.tick(Duration.seconds(1))
     * // Prints E, F
     * s.tick(Duration.seconds(1))
     * ```
     *
     * @param duration is an optional timespan to user for incrementing
     * [currentTimeMillis]{@link TestScheduler.currentTimeMillis}, thus allowing
     * the execution of tasks scheduled to execute with a delay.
     *
     * @return the number of executed tasks
     */
    tick(duration?: number | Duration): number;
    /**
     * Executes the task that's at the top of the stack, in case we
     * have a task to execute that doesn't require a jump in time.
     *
     * ```typescript
     * const ec = new TestScheduler()
     *
     * ec.execute(() => console.log("A"))
     * ec.execute(() => console.log("B"))
     *
     * // Prints B
     * ec.tickOne()
     * // Prints A
     * ec.tickOne()
     * ```
     */
    tickOne(): boolean;
}
