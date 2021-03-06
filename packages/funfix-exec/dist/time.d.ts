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
import { IEquals } from "funfix-core";
/**
 * A `TimeUnit` represents time durations at a given unit of
 * granularity and provides utility methods to convert across units,
 * and to perform timing and delay operations in these units.
 *
 * A `TimeUnit` does not maintain time information, but only helps
 * organize and use time representations that may be maintained
 * separately across various contexts. A nanosecond is defined as one
 * thousandth of a microsecond, a microsecond as one thousandth of a
 * millisecond, a millisecond as one thousandth of a second, a minute
 * as sixty seconds, an hour as sixty minutes, and a day as twenty
 * four hours.
 *
 * `TimeUnit` is an enumeration and in usage the already defined
 * constants should be used:
 *
 *  - [[NANOSECONDS]]
 *  - [[MICROSECONDS]]
 *  - [[MILLISECONDS]]
 *  - [[SECONDS]]
 *  - [[MINUTES]]
 *  - [[HOURS]]
 *  - [[DAYS]]
 *
 * Example:
 *
 * ```typescript
 * // Converting 10 minutes to nanoseconds
 * MINUTES.toNanos(10)
 * // Equivalent with the above:
 * NANOSECONDS.convert(10, MINUTES)
 * ```
 */
export declare abstract class TimeUnit {
    /**
     * Converts the given time duration in the given unit to this unit.
     * Conversions from finer to coarser granularities truncate, so lose
     * precision. For example, converting `999` milliseconds to seconds
     * results in `0`. Conversions from coarser to finer granularities
     * with arguments that would numerically overflow saturate to
     * `Number.MAX_VALUE` if negative or `MAX_VALUE` if positive.
     *
     * For example, to convert 10 minutes to milliseconds, use:
     *
     * ```typescript
     * MILLISECONDS.convert(10, MINUTES)
     * // ... or ...
     * MINUTES.toMillis(10)
     * ```
     *
     * @param duration the time duration in the given `unit`
     * @param unit the unit of the `duration` argument
     *
     * @return the converted duration in this unit, or `Number.MIN_VALUE`
     * if conversion would negatively overflow, or `Number.MAX_VALUE`
     * if it would positively overflow
     */
    abstract convert(duration: number, unit: TimeUnit): number;
    /**
     * Converts the given `d` value to nanoseconds.
     *
     * Equivalent with `NANOSECONDS.convert(duration, this)`.
     *
     * @param d is the converted duration
     * @return the converted duration, or `Number.MAX_SAFE_INTEGER + 1`
     * (or `2^53`) if it overflows, or `Number.MIN_SAFE_INTEGER - 1` if it
     * underflows (or `-2^53`).
     */
    abstract toNanos(d: number): number;
    /**
     * Converts the given `d` value to microseconds.
     *
     * Equivalent with `MICROSECONDS.convert(duration, this)`.
     *
     * @param d is the converted duration
     * @return the converted duration, or `Number.MAX_SAFE_INTEGER + 1`
     * (or `2^53`) if it overflows, or `Number.MIN_SAFE_INTEGER - 1` if it
     * underflows (or `-2^53`).
     */
    abstract toMicros(d: number): number;
    /**
     * Converts the given `d` value to milliseconds.
     *
     * Equivalent with `MILLISECONDS.convert(duration, this)`.
     *
     * @param d is the converted duration
     * @return the converted duration, or `Number.MAX_SAFE_INTEGER + 1`
     * (or `2^53`) if it overflows, or `Number.MIN_SAFE_INTEGER - 1` if it
     * underflows (or `-2^53`).
     */
    abstract toMillis(d: number): number;
    /**
     * Converts the given `d` value to seconds.
     *
     * Equivalent with `SECONDS.convert(duration, this)`.
     *
     * @param d is the converted duration
     * @return the converted duration, or `Number.MAX_SAFE_INTEGER + 1`
     * (or `2^53`) if it overflows, or `Number.MIN_SAFE_INTEGER - 1` if it
     * underflows (or `-2^53`).
     */
    abstract toSeconds(d: number): number;
    /**
     * Converts the given `d` value to minutes.
     *
     * Equivalent with `MINUTES.convert(duration, this)`.
     *
     * @param d is the converted duration
     * @return the converted duration, or `Number.MAX_SAFE_INTEGER + 1`
     * (or `2^53`) if it overflows, or `Number.MIN_SAFE_INTEGER - 1` if it
     * underflows (or `-2^53`).
     */
    abstract toMinutes(d: number): number;
    /**
     * Converts the given `d` value to hours.
     *
     * Equivalent with `HOURS.convert(duration, this)`.
     *
     * @param d is the converted duration
     * @return the converted duration, or `Number.MAX_SAFE_INTEGER + 1`
     * (or `2^53`) if it overflows, or `Number.MIN_SAFE_INTEGER - 1` if it
     * underflows (or `-2^53`).
     */
    abstract toHours(d: number): number;
    /**
     * Converts the given `d` value to days.
     *
     * Equivalent with `DAYS.convert(duration, this)`.
     *
     * @param d is the converted duration
     * @return the converted duration, or `Number.MAX_SAFE_INTEGER + 1`
     * (or `2^53`) if it overflows, or `Number.MIN_SAFE_INTEGER - 1` if it
     * underflows (or `-2^53`).
     */
    abstract toDays(d: number): number;
    /**
     * A number representing the unit's ordering in the `TimeUnit`
     * enumeration, useful for doing comparisons to find out which unit
     * is more coarse grained.
     *
     * ```typescript
     * MINUTES.ord < DAYS.ord // true
     * SECONDS.ord > MICROSECONDS.org // true
     * ```
     */
    abstract ord: number;
    /**
     * A human readable label for this unit.
     */
    abstract label: string;
    /** Override for `Object.toString`. */
    toString(): string;
}
/**
 * Time unit for representing nanoseconds, where 1 nanosecond is
 * one thousandth of a microsecond.
 */
export declare const NANOSECONDS: TimeUnit;
/**
 * Time unit for representing microseconds, where 1 microsecond is
 * one thousandth of a millisecond.
 */
export declare const MICROSECONDS: TimeUnit;
/**
 * Time unit for representing milliseconds, where 1 millisecond is
 * one thousandth of a second.
 */
export declare const MILLISECONDS: TimeUnit;
/**
 * Time unit for representing seconds.
 */
export declare const SECONDS: TimeUnit;
/**
 * Time unit for representing minutes.
 */
export declare const MINUTES: TimeUnit;
/**
 * Time unit for representing hours.
 */
export declare const HOURS: TimeUnit;
/**
 * Time unit for representing days.
 */
export declare const DAYS: TimeUnit;
/**
 * A simple representation for time durations, based on [[TimeUnit]].
 */
export declare class Duration implements IEquals<Duration> {
    duration: number;
    unit: TimeUnit;
    constructor(duration: number, unit: TimeUnit);
    /**
     * This method returns `true` if this duration is finite,
     * or `false otherwise.
     */
    isFinite(): boolean;
    /**
     * Calculates the nanoseconds described by the source [[Duration]].
     */
    toNanos(): number;
    /**
     * Calculates the microseconds described by the source [[Duration]].
     */
    toMicros(): number;
    /**
     * Calculates the milliseconds described by the source [[Duration]].
     */
    toMillis(): number;
    /**
     * Calculates the seconds described by the source [[Duration]].
     */
    toSeconds(): number;
    /**
     * Calculates the minutes described by the source [[Duration]].
     */
    toMinutes(): number;
    /**
     * Calculates the hours described by the source [[Duration]].
     */
    toHours(): number;
    /**
     * Calculates the days described by the source [[Duration]].
     */
    toDays(): number;
    /**
     * Returns a new `Duration` value that represents `this` converted
     * to use the given `unit`.
     *
     * Note that this may be a lossy conversion, e.g. when converting
     * 27 hours to 1 day, there's a loss of fidelity.
     */
    convertTo(unit: TimeUnit): Duration;
    /**
     * Negates `this` duration, by changing the sign.
     */
    negate(): Duration;
    /**
     * Return the sum of `this` duration and `other`.
     *
     * Note that the `unit` used for the result will be the
     * more finer grained one out of the two.
     *
     * ```typescript
     * // Result will be 27 hours
     * Duration.days(1).plus(Duration.hours(3))
     * ```
     */
    plus(other: Duration): Duration;
    /**
     * Subtracts the `other` duration from `this`.
     *
     * Note that the `unit` used for the result will be the
     * more finer grained one out of the two:
     *
     * ```typescript
     * // Result will be 21 hours
     * Duration.days(1).minus(Duration.hours(3))
     * ```
     */
    minus(other: Duration): Duration;
    /** @inheritdoc */
    equals(other: Duration): boolean;
    /** @inheritdoc */
    hashCode(): number;
    toString(): string;
    /**
     * Wraps the argument in a `Duration.millis` reference, in case it's
     * a number, otherwise returns the argument as is.
     *
     * In Javascript code it is customary to express durations with
     * numbers representing milliseconds and in functions it's good
     * to still allow developers to do that because it's the standard
     * convention.
     *
     * Thus one can work with a union type like `number | Duration`.
     * And in case a `number` is given, then it is interpreted as
     * milliseconds.
     *
     * Usage:
     *
     * ```typescript
     * function delay(d: number | Duration, r: () => {}) {
     *   const millis = Duration.of(d).toMillis()
     *   return setTimeout(r, millis)
     * }
     * ```
     */
    static of(value: number | Duration): Duration;
    /** Returns a zero length duration. */
    static zero(): Duration;
    /** Returns a [[Duration]] representing positive infinite. */
    static inf(): Duration;
    /** Returns a [[Duration]] representing negative infinite. */
    static negInf(): Duration;
    /**
     * Constructs a `Duration` instance out of a value representing
     * nanoseconds.
     */
    static nanos(d: number): Duration;
    /**
     * Constructs a `Duration` instance out of a value representing
     * microseconds.
     */
    static micros(d: number): Duration;
    /**
     * Constructs a `Duration` instance out of a value representing
     * milliseconds.
     */
    static millis(d: number): Duration;
    /**
     * Constructs a `Duration` instance out of a value representing
     * seconds.
     */
    static seconds(d: number): Duration;
    /**
     * Constructs a `Duration` instance out of a value representing
     * minutes.
     */
    static minutes(d: number): Duration;
    /**
     * Constructs a `Duration` instance out of a value representing
     * hours.
     */
    static hours(d: number): Duration;
    /**
     * Constructs a `Duration` instance out of a value representing
     * days.
     */
    static days(d: number): Duration;
}
