import {
    mutableHandlers,
    // readonlyHandlers,
    // shallowReactiveHandlers,
    // shallowReadonlyHandlers
} from './baseHandlers';
import {
    mutableCollectionHandlers,
    // readonlyCollectionHandlers,
    // shallowCollectionHandlers
} from './collectionHandlers';

import { isObject, toRawType } from '../utils';

export const enum ReactiveFlags {
    SKIP = '__v_skip',
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    RAW = '__v_raw',
}

export interface Target {
    [ReactiveFlags.SKIP]?: boolean;
    [ReactiveFlags.IS_REACTIVE]?: boolean;
    [ReactiveFlags.IS_READONLY]?: boolean;
    [ReactiveFlags.RAW]?: any;
}

export const reactiveMap = new WeakMap<Target, any>();
export const readonlyMap = new WeakMap<Target, any>();

const enum TargetType {
    INVALID = 0,
    COMMON = 1,
    COLLECTION = 2,
}

//* export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
        return target;
    }
    return createReactiveObject(
        target,
        false, // not read-only
        mutableHandlers,
        mutableCollectionHandlers
    );
}

function createReactiveObject(
    target: Target,
    isReadonly: boolean,
    baseHandlers: ProxyHandler<any>,
    collectionHandlers: ProxyHandler<any>
) {
    if (!isObject(target)) {
        //* TODO: warn()
        return target;
    }
    // target is already a proxy, return

    // check target if has a proxy
    const proxyMap = isReadonly ? readonlyMap : reactiveMap;
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    // check if proxy type is valid, and keep it for choosing handlers later
    // Collection: 'Map', 'Set', 'WeakMap', 'WeakSet'
    // Common: 'Object', 'Array'
    const targetType = getTargetType(target);
    if (targetType === TargetType.INVALID) {
        return target;
    }

    // NOTE: 2 kinds of handler, one is for collections
    const proxy = new Proxy(
        target,
        targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy); // keep new proxy in proxyMap
    return proxy;
}

function getTargetType(target: Target) {
    return target[ReactiveFlags.SKIP] || !Object.isExtensible(target)
        ? TargetType.INVALID
        : targetTypeMap(toRawType(target));
}

function targetTypeMap(rawType: string) {
    switch (rawType) {
        case 'Object':
        case 'Array':
            return TargetType.COMMON;
        case 'Map':
        case 'Set':
        case 'WeakMap':
        case 'WeakSet':
            return TargetType.COLLECTION;
        default:
            return TargetType.INVALID;
    }
}

export function toRaw<T>(observed: T): T {
    return (
        (observed && toRaw((observed as Target)[ReactiveFlags.RAW])) || observed
    );
}
