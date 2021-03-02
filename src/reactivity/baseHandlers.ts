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
} from '../utils';

// const get = /*#__PURE__*/ createGetter()
// NOTE: When will get's receiver be used??
function get(target: Target, key: string | symbol, receiver: object) {
    // SKIP = '__v_skip',
    // IS_REACTIVE = '__v_isReactive',
    // IS_READONLY = '__v_isReadonly',
    // RAW = '__v_raw'

    // TODO: `IS_XXX` is a short for private properties of Target
    //* these if statements check special cases

    // if (key === ReactiveFlags.IS_REACTIVE) {
    //   return !isReadonly
    // }
    // else if (key === ReactiveFlags.IS_READONLY) {
    //   return isReadonly
    // }
    // else if (
    //   key === ReactiveFlags.RAW &&
    //   receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)
    // ) {
    //   return target
    // }

    // TODO: target is array

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
        reactive(res);
    }
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
    // value = toRaw(value);
    // if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
    //     oldValue.value = value;
    //     return true;
    // }
    // } else {
    // in shallow mode, objects are set as-is regardless of reactive or not
    // }

    const result = Reflect.set(target, key, value, receiver);
    // check key exists or not(modify or add)
    const hadKey =
        isArray(target) && isIntegerKey(key)
            ? Number(key) < target.length
            : hasOwn(target, key);
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

export const mutableHandlers: ProxyHandler<object> = {
    get,
    set,
    // deleteProperty,
    // has,
    // ownKeys,
};
