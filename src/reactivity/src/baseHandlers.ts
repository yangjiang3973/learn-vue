import {
    // reactive,
    // readonly,
    // toRaw,
    ReactiveFlags,
    Target,
    readonlyMap,
    reactiveMap,
    reactive,
    toRaw,
} from './reactive';
import { TrackOpTypes, TriggerOpTypes } from './operations';
import {
    track,
    trigger,
    // ITERATE_KEY,
    // pauseTracking,
    // resetTracking
} from './effect';
import {
    isObject,
    hasOwn,
    // isSymbol,
    hasChanged,
    isArray,
    isIntegerKey,
    // isIntegerKey,
    // extend,
    // makeMap
} from '../../utils';

// const raw = {};
// const arr = reactive([{}, {}]);
// arr.push(raw);
// expect(arr.indexOf(raw)).toBe(2);

const arrayInstrumentations: Record<string, Function> = {};

const ISM = ['includes', 'indexOf', 'lastIndexOf'];
ISM.forEach((methodName) => {
    const method = Array.prototype[methodName];
    arrayInstrumentations[methodName] = function (this, ...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
            track(arr, TrackOpTypes.GET, i + '');
        }
        // we run the method using the original args first (which may be reactive)
        const res = method.apply(arr, args);
        if (res === -1 || res === false) {
            // if that didn't work, run it again using raw values.
            return method.apply(arr, args.map(toRaw));
        } else {
            return res;
        }
    };
});

// NOTE: in vue3, sort and reverse are missing, only take care of length-altering methods
// TODO: do i need to add sort and reverse and test? no, because proxy is differnt then defineProperty
const LAM = ['push', 'pop', 'shift', 'unshift', 'splice'];

LAM.forEach((methodName) => {
    const method = Array.prototype[methodName] as any;
    arrayInstrumentations[methodName] = function (this, ...args) {
        // pauseTracking();
        const res = method.apply(this, args);
        // resetTracking();
        return res;
    };
});

// const get = /*#__PURE__*/ createGetter()
function get(target: Target, key: string | symbol, receiver: object) {
    // SKIP = '__v_skip',
    // IS_REACTIVE = '__v_isReactive',
    // IS_READONLY = '__v_isReadonly',
    // RAW = '__v_raw'

    // TODO: `IS_XXX` is a short for private properties of Target
    //* these if statements check special cases

    if (key === ReactiveFlags.IS_REACTIVE) {
        //   return !isReadonly
        return true;
    }
    // else if (key === ReactiveFlags.IS_READONLY) {
    //   return isReadonly
    // }
    else if (
        key === ReactiveFlags.RAW &&
        receiver === reactiveMap.get(target)
        //   receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)
    ) {
        return target;
    }

    // TODO: target is array
    const targetIsArray = isArray(target);
    // if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
    //   return Reflect.get(arrayInstrumentations, key, receiver)
    // }
    if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        // Array.push will return the definition, then push() to execute
        return Reflect.get(arrayInstrumentations, key, receiver);
    }

    const res = Reflect.get(target, key, receiver);

    // TODO: deal with res
    // if (
    //   isSymbol(key)
    //     ? builtInSymbols.has(key as symbol)
    //     : isNonTrackableKeys(key)
    // ) {
    //   return res
    // }

    // TODO: implement readonly
    // if (!isReadonly) {
    track(target, TrackOpTypes.GET, key);
    // }

    // if (shallow) {
    //   return res
    // }

    // if (isRef(res)) {
    //   // ref unwrapping - does not apply for Array + integer key.
    //   const shouldUnwrap = !targetIsArray || !isIntegerKey(key)
    //   return shouldUnwrap ? res.value : res
    // }

    // NOTE: why convert here? why not recursively convert at the reactive data stage?
    if (isObject(res)) {
        // Convert returned value into a proxy as well. we do the isObject check
        // here to avoid invalid value warning. Also need to lazy access readonly
        // and reactive here to avoid circular dependency.
        // TODO: implement readonly
        // return isReadonly ? readonly(res) : reactive(res)
        return reactive(res);
    }
    return res;
}

function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
): boolean {
    // const oldValue = (target as any)[key];
    const oldValue = target[key];
    // TODO: need to learn what shallow mode is
    // if (!shallow) {
    // TODO: what is toRaw()
    value = toRaw(value);
    // if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
    //     oldValue.value = value;
    //     return true;
    // }
    // } else {
    // // in shallow mode, objects are set as-is regardless of reactive or not
    // }

    // check key exists or not(modify or add)
    const hadKey =
        isArray(target) && isIntegerKey(key)
            ? // @ts-ignore
              Number(key) < target.length
            : hasOwn(target, key);
    // NOTE: check key before modify result! especially for array operations!
    const result = Reflect.set(target, key, value, receiver);

    //* don't trigger if target is something up in the prototype chain of original
    /* NOTE: process prototype issue: if an obj inherits from a parent proxy(prototype points to proxy)
    if update a prop that is not obj proxy's own prop, it will also invoke parent proxy set
    */
    if (target === toRaw(receiver)) {
        if (!hadKey) {
            trigger(target, TriggerOpTypes.ADD, key, value);
        } else if (hasChanged(value, oldValue)) {
            trigger(target, TriggerOpTypes.SET, key, value, oldValue);
        }
    }
    return result;
}

function deleteProperty(target: object, key: string | symbol): boolean {
    const hadKey = hasOwn(target, key);
    const oldValue = (target as any)[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
        trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue);
    }
    return result;
}

function has(target: object, key: string | symbol): boolean {
    const result = Reflect.has(target, key);
    // TODO:
    // if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, TrackOpTypes.HAS, key);
    // }
    return result;
}

function ownKeys(target: object): (string | number | symbol)[] {
    track(
        target,
        TrackOpTypes.ITERATE,
        // TODO:
        // isArray(target) ? 'length' : ITERATE_KEY
        'length'
    );
    return Reflect.ownKeys(target);
}
export const mutableHandlers: ProxyHandler<object> = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys,
};
