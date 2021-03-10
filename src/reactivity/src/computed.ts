import { effect, ReactiveEffect, trigger, track } from './effect';
import { ReactiveFlags, toRaw } from './reactive';
import { TriggerOpTypes, TrackOpTypes } from './operations';
import { isFunction, NOOP } from '../../utils';
export type ComputedGetter<T> = (ctx?: any) => T;
export type ComputedSetter<T> = (v: T) => void;

export interface WritableComputedOptions<T> {
    get: ComputedGetter<T>;
    set: ComputedSetter<T>;
}

export function computed<T>(
    getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
    let getter: ComputedGetter<T>;
    let setter: ComputedSetter<T>;

    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        // setter = __DEV__
        //     ? () => {
        //           console.warn(
        //               'Write operation failed: computed value is readonly'
        //           );
        //       }
        //     : NOOP;
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }

    return new ComputedRefImpl(
        getter,
        setter,
        isFunction(getterOrOptions) || !getterOrOptions.set
    ) as any;
}

// TODO: what is <T>
// * need to read about typescript with class!!
class ComputedRefImpl<T> {
    private _value!: T;
    private _dirty = true;
    public readonly effect: ReactiveEffect<T>;

    constructor(
        getter: ComputedGetter<T>,
        private readonly _setter: ComputedSetter<T>,
        isReadonly: boolean
    ) {
        this.effect = effect(getter, {
            lazy: true,
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true;
                    trigger(toRaw(this), TriggerOpTypes.SET, 'value'); // for test case: `should trigger effect` if there is another effect depends on computed
                    // the source data changed, trigger this effect, and this effect has a scheduler will trigger again(like linkage)
                }
            },
        });

        // this[ReactiveFlags.IS_READONLY] = isReadonly
    }

    get value() {
        if (this._dirty) {
            this._value = this.effect();
            this._dirty = false;
        }
        track(toRaw(this), TrackOpTypes.GET, 'value'); // for test case: `should trigger effect`, call track like get handler in proxy for effect depends on computed instance
        // so no need to make a proxy on computed instance
        return this._value;
    }

    set value(newValue: T) {
        this._setter(newValue);
    }
}
