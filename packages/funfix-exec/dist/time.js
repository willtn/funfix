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
import { IllegalArgumentError } from "funfix-core";
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
export class TimeUnit {
    /** Override for `Object.toString`. */
    toString() {
        return this.label.toUpperCase();
    }
}
/** @hidden */ const C0 = 1;
/** @hidden */ const C1 = C0 * 1000;
/** @hidden */ const C2 = C1 * 1000;
/** @hidden */ const C3 = C2 * 1000;
/** @hidden */ const C4 = C3 * 60;
/** @hidden */ const C5 = C4 * 60;
/** @hidden */ const C6 = C5 * 24;
/** @hidden */ const MIN = -9007199254740992;
/** @hidden */ const MAX = 9007199254740992;
/** @hidden */
const trunc = Math.trunc ||
    /* istanbul ignore next */
    function (x) {
        if (isNaN(x))
            return NaN;
        if (x > 0)
            return Math.floor(x);
        return Math.ceil(x);
    };
/** @hidden */
function x(d, m, over) {
    if (d > over)
        return MAX;
    if (d < -over)
        return MIN;
    return d * m;
}
/** @hidden */
class Nanoseconds extends TimeUnit {
    constructor() {
        super(...arguments);
        this.ord = 0;
        this.label = "nanoseconds";
    }
    convert(duration, unit) { return unit.toNanos(duration); }
    toNanos(d) { return d; }
    toMicros(d) { return trunc(d / (C1 / C0)); }
    toMillis(d) { return trunc(d / (C2 / C0)); }
    toSeconds(d) { return trunc(d / (C3 / C0)); }
    toMinutes(d) { return trunc(d / (C4 / C0)); }
    toHours(d) { return trunc(d / (C5 / C0)); }
    toDays(d) { return trunc(d / (C6 / C0)); }
}
/**
 * Time unit for representing nanoseconds, where 1 nanosecond is
 * one thousandth of a microsecond.
 */
export const NANOSECONDS = new Nanoseconds();
/** @hidden */
class Microseconds extends TimeUnit {
    constructor() {
        super(...arguments);
        this.ord = 1;
        this.label = "microseconds";
    }
    convert(duration, unit) { return unit.toMicros(duration); }
    toNanos(d) { return x(d, C1 / C0, trunc(MAX / (C1 / C0))); }
    toMicros(d) { return d; }
    toMillis(d) { return trunc(d / (C2 / C1)); }
    toSeconds(d) { return trunc(d / (C3 / C1)); }
    toMinutes(d) { return trunc(d / (C4 / C1)); }
    toHours(d) { return trunc(d / (C5 / C1)); }
    toDays(d) { return trunc(d / (C6 / C1)); }
}
/**
 * Time unit for representing microseconds, where 1 microsecond is
 * one thousandth of a millisecond.
 */
export const MICROSECONDS = new Microseconds();
/** @hidden */
class Milliseconds extends TimeUnit {
    constructor() {
        super(...arguments);
        this.ord = 2;
        this.label = "milliseconds";
    }
    convert(duration, unit) { return unit.toMillis(duration); }
    toNanos(d) { return x(d, C2 / C0, trunc(MAX / (C2 / C0))); }
    toMicros(d) { return x(d, C2 / C1, trunc(MAX / (C2 / C1))); }
    toMillis(d) { return d; }
    toSeconds(d) { return trunc(d / (C3 / C2)); }
    toMinutes(d) { return trunc(d / (C4 / C2)); }
    toHours(d) { return trunc(d / (C5 / C2)); }
    toDays(d) { return trunc(d / (C6 / C2)); }
}
/**
 * Time unit for representing milliseconds, where 1 millisecond is
 * one thousandth of a second.
 */
export const MILLISECONDS = new Milliseconds();
/** @hidden */
class Seconds extends TimeUnit {
    constructor() {
        super(...arguments);
        this.ord = 3;
        this.label = "seconds";
    }
    convert(duration, unit) { return unit.toSeconds(duration); }
    toNanos(d) { return x(d, C3 / C0, trunc(MAX / (C3 / C0))); }
    toMicros(d) { return x(d, C3 / C1, trunc(MAX / (C3 / C1))); }
    toMillis(d) { return x(d, C3 / C2, trunc(MAX / (C3 / C2))); }
    toSeconds(d) { return d; }
    toMinutes(d) { return trunc(d / (C4 / C3)); }
    toHours(d) { return trunc(d / (C5 / C3)); }
    toDays(d) { return trunc(d / (C6 / C3)); }
}
/**
 * Time unit for representing seconds.
 */
export const SECONDS = new Seconds();
/** @hidden */
class Minutes extends TimeUnit {
    constructor() {
        super(...arguments);
        this.ord = 4;
        this.label = "minutes";
    }
    convert(duration, unit) { return unit.toMinutes(duration); }
    toNanos(d) { return x(d, C4 / C0, trunc(MAX / (C4 / C0))); }
    toMicros(d) { return x(d, C4 / C1, trunc(MAX / (C4 / C1))); }
    toMillis(d) { return x(d, C4 / C2, trunc(MAX / (C4 / C2))); }
    toSeconds(d) { return x(d, C4 / C3, trunc(MAX / (C4 / C3))); }
    toMinutes(d) { return d; }
    toHours(d) { return trunc(d / (C5 / C4)); }
    toDays(d) { return trunc(d / (C6 / C4)); }
}
/**
 * Time unit for representing minutes.
 */
export const MINUTES = new Minutes();
/** @hidden */
class Hours extends TimeUnit {
    constructor() {
        super(...arguments);
        this.ord = 5;
        this.label = "hours";
    }
    convert(duration, unit) { return unit.toHours(duration); }
    toNanos(d) { return x(d, C5 / C0, trunc(MAX / (C5 / C0))); }
    toMicros(d) { return x(d, C5 / C1, trunc(MAX / (C5 / C1))); }
    toMillis(d) { return x(d, C5 / C2, trunc(MAX / (C5 / C2))); }
    toSeconds(d) { return x(d, C5 / C3, trunc(MAX / (C5 / C3))); }
    toMinutes(d) { return x(d, C5 / C4, trunc(MAX / (C5 / C4))); }
    toHours(d) { return d; }
    toDays(d) { return trunc(d / (C6 / C5)); }
}
/**
 * Time unit for representing hours.
 */
export const HOURS = new Hours();
/** @hidden */
class Days extends TimeUnit {
    constructor() {
        super(...arguments);
        this.ord = 6;
        this.label = "days";
    }
    convert(duration, unit) { return unit.toDays(duration); }
    toNanos(d) { return x(d, C6 / C0, trunc(MAX / (C6 / C0))); }
    toMicros(d) { return x(d, C6 / C1, trunc(MAX / (C6 / C1))); }
    toMillis(d) { return x(d, C6 / C2, trunc(MAX / (C6 / C2))); }
    toSeconds(d) { return x(d, C6 / C3, trunc(MAX / (C6 / C3))); }
    toMinutes(d) { return x(d, C6 / C4, trunc(MAX / (C6 / C4))); }
    toHours(d) { return x(d, C6 / C5, trunc(MAX / (C6 / C5))); }
    toDays(d) { return d; }
}
/**
 * Time unit for representing days.
 */
export const DAYS = new Days();
/**
 * A simple representation for time durations, based on [[TimeUnit]].
 */
export class Duration {
    constructor(duration, unit) {
        if (isNaN(duration)) {
            throw new IllegalArgumentError("NaN is not supported for a Duration");
        }
        // Only integers allowed
        this.duration = trunc(duration);
        this.unit = unit;
    }
    /**
     * This method returns `true` if this duration is finite,
     * or `false otherwise.
     */
    isFinite() { return isFinite(this.duration); }
    /**
     * Calculates the nanoseconds described by the source [[Duration]].
     */
    toNanos() {
        return NANOSECONDS.convert(this.duration, this.unit);
    }
    /**
     * Calculates the microseconds described by the source [[Duration]].
     */
    toMicros() {
        return MICROSECONDS.convert(this.duration, this.unit);
    }
    /**
     * Calculates the milliseconds described by the source [[Duration]].
     */
    toMillis() {
        return MILLISECONDS.convert(this.duration, this.unit);
    }
    /**
     * Calculates the seconds described by the source [[Duration]].
     */
    toSeconds() {
        return SECONDS.convert(this.duration, this.unit);
    }
    /**
     * Calculates the minutes described by the source [[Duration]].
     */
    toMinutes() {
        return MINUTES.convert(this.duration, this.unit);
    }
    /**
     * Calculates the hours described by the source [[Duration]].
     */
    toHours() {
        return HOURS.convert(this.duration, this.unit);
    }
    /**
     * Calculates the days described by the source [[Duration]].
     */
    toDays() {
        return DAYS.convert(this.duration, this.unit);
    }
    /**
     * Returns a new `Duration` value that represents `this` converted
     * to use the given `unit`.
     *
     * Note that this may be a lossy conversion, e.g. when converting
     * 27 hours to 1 day, there's a loss of fidelity.
     */
    convertTo(unit) {
        return new Duration(unit.convert(this.duration, this.unit), unit);
    }
    /**
     * Negates `this` duration, by changing the sign.
     */
    negate() {
        switch (this.duration) {
            case Infinity: return Duration.negInf();
            case -Infinity: return Duration.inf();
            default:
                return new Duration(-this.duration, this.unit);
        }
    }
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
    plus(other) {
        if (!isFinite(this.duration)) {
            if (!isFinite(other.duration) && this.duration !== other.duration) {
                throw new IllegalArgumentError("cannot deal with two infinities with different signs, " +
                    "as that would be a NaN");
            }
            return this;
        }
        else if (other.duration === 0) {
            return this;
        }
        else if (this.duration === 0) {
            return other;
        }
        if (!isFinite(other.duration))
            return other;
        let d1 = this;
        let d2 = other;
        if (d2.unit.ord < d1.unit.ord) {
            d1 = other;
            d2 = this;
        }
        d2 = d2.convertTo(d1.unit);
        return new Duration(d1.duration + d2.duration, d1.unit);
    }
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
    minus(other) {
        return this.plus(other.negate());
    }
    /** @inheritdoc */
    equals(other) {
        function cmp(s, o) {
            const n = s.unit.convert(o.duration, o.unit);
            return n === s.duration;
        }
        if (!isFinite(this.duration)) {
            return !isFinite(other.duration) &&
                this.duration === other.duration;
        }
        return this.unit.ord <= other.unit.ord
            ? cmp(this, other) : cmp(other, this);
    }
    /** @inheritdoc */
    hashCode() {
        if (this.isFinite()) {
            return this.toNanos();
        }
        else if (this.duration === Infinity) {
            return 7540833725118015;
        }
        else {
            return 422082410550358;
        }
    }
    toString() {
        if (this.isFinite())
            return `${this.duration} ${this.unit.label}`;
        else if (this.duration >= 0)
            return "[end of time]";
        else
            return "[beginning of time]";
    }
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
    static of(value) {
        return typeof value === "number"
            ? Duration.millis(value)
            : value;
    }
    /** Returns a zero length duration. */
    static zero() {
        return new Duration(0, DAYS);
    }
    /** Returns a [[Duration]] representing positive infinite. */
    static inf() {
        return new Duration(Infinity, DAYS);
    }
    /** Returns a [[Duration]] representing negative infinite. */
    static negInf() {
        return new Duration(-Infinity, DAYS);
    }
    /**
     * Constructs a `Duration` instance out of a value representing
     * nanoseconds.
     */
    static nanos(d) {
        return new Duration(d, NANOSECONDS);
    }
    /**
     * Constructs a `Duration` instance out of a value representing
     * microseconds.
     */
    static micros(d) {
        return new Duration(d, MICROSECONDS);
    }
    /**
     * Constructs a `Duration` instance out of a value representing
     * milliseconds.
     */
    static millis(d) {
        return new Duration(d, MILLISECONDS);
    }
    /**
     * Constructs a `Duration` instance out of a value representing
     * seconds.
     */
    static seconds(d) {
        return new Duration(d, SECONDS);
    }
    /**
     * Constructs a `Duration` instance out of a value representing
     * minutes.
     */
    static minutes(d) {
        return new Duration(d, MINUTES);
    }
    /**
     * Constructs a `Duration` instance out of a value representing
     * hours.
     */
    static hours(d) {
        return new Duration(d, HOURS);
    }
    /**
     * Constructs a `Duration` instance out of a value representing
     * days.
     */
    static days(d) {
        return new Duration(d, DAYS);
    }
}
//# sourceMappingURL=time.js.map