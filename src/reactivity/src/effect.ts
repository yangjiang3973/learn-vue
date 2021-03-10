import { isArray, isIntegerKey, isMap } from '../../utils';
import { TrackOpTypes, TriggerOpTypes } from './operations';

export interface ReactiveEffect<T = any> {
    (): T;
    _isEffect: true;
    id: number;
    active: boolean;
    raw: () => T;
    deps: Array<Dep>;
    options: ReactiveEffectOptions;
    allowRecurse: boolean;
}

export interface ReactiveEffectOptions {
    lazy?: boolean;
    scheduler?: (job: ReactiveEffect) => void;
    onTrack?: (event: DebuggerEvent) => void;
    onTrigger?: (event: DebuggerEvent) => void;
    onStop?: () => void;
    allowRecurse?: boolean;
}

export type DebuggerEvent = {
    effect: ReactiveEffect;
    target: object;
    type: TrackOpTypes | TriggerOpTypes;
    key: any;
} & DebuggerEventExtraInfo;

export interface DebuggerEventExtraInfo {
    newValue?: any;
    oldValue?: any;
    oldTarget?: Map<any, any> | Set<any>;
}

// TODO: what is this?
export const ITERATE_KEY = Symbol(__DEV__ ? 'iterate' : '');
export const MAP_KEY_ITERATE_KEY = Symbol(__DEV__ ? 'Map key iterate' : '');

const effectStack: ReactiveEffect[] = [];
let activeEffect: ReactiveEffect | undefined;

export function isEffect(fn: any): fn is ReactiveEffect {
    return fn && fn._isEffect === true;
}

let shouldTrack = true;
const trackStack: boolean[] = [];

export function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
}

export function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
}

export function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
}

export function stop(effect: ReactiveEffect) {
    if (effect.active) {
        cleanup(effect);
        if (effect.options.onStop) {
            effect.options.onStop();
        }
        effect.active = false;
    }
}

//* IMO, should not call this function effect, better to call it makeEffect
export function effect<T = any>(
    fn: () => T,
    options: ReactiveEffectOptions = {} //* vue use EMPTY_OBJ
): ReactiveEffect<T> {
    if (isEffect(fn)) {
        fn = fn.raw;
    }
    const effect = createReactiveEffect(fn, options);

    //* run effect immediately
    if (!options.lazy) {
        effect();
    }
    return effect;
}

let uid = 0;
function createReactiveEffect<T = any>(
    fn: () => T,
    options: ReactiveEffectOptions
): ReactiveEffect<T> {
    // define the effect now and will be called in effect function
    const effect = function reactiveEffect() {
        // test case: `stop with scheduler`
        if (!effect.active) {
            return options.scheduler ? undefined : fn();
        }
        // avoid infinite loop when set inside effect callback function
        if (!effectStack.includes(effect)) {
            // test case: `should not be triggered by mutating a property, which is used in an inactive branch`
            // cleanup dependencies of this effect and re-collect
            cleanup(effect);
            try {
                enableTracking();
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            } finally {
                effectStack.pop();
                resetTracking();
                activeEffect = effectStack[effectStack.length - 1];
            }
        }
    } as ReactiveEffect;
    effect.id = uid++;
    // effect.allowRecurse = !!options.allowRecurse;
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
}

function cleanup(effect: ReactiveEffect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}

const targetMap = new WeakMap<any, KeyToDepMap>();
type KeyToDepMap = Map<any, Dep>;
type Dep = Set<ReactiveEffect>;

// {
//     target1: {
//         key1: [effect1, effect2];
//     }
// }
export function track(target: object, type: TrackOpTypes, key: unknown) {
    if (!shouldTrack || activeEffect === undefined) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        // this for debugging
        if (__DEV__ && activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target,
                type,
                key,
            });
        }
    }
}

export function trigger(
    target: object,
    type: TriggerOpTypes,
    key?: unknown,
    newValue?: unknown,
    oldValue?: unknown,
    oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }

    const effectsToExe = new Set<ReactiveEffect>();
    const addEffects = (effectsToAdd) => {
        if (!effectsToAdd) return;
        effectsToAdd.forEach((effect) => {
            // TODO: why need this check?
            if (effect !== activeEffect || effect.allowRecurse) {
                effectsToExe.add(effect);
            }
        });
    };

    // TODO: TriggerOpTypes.CLEAR

    // schedule runs for SET | ADD | DELETE
    if (key !== undefined) {
        // if (key !== void 0) {
        //* I don't use void 0 here
        // add(depsMap.get(key));
        if (key === 'length') {
            depsMap.forEach((dep, key) => {
                if (key === 'length' || key >= (newValue as number)) {
                    // if (key === 'length' || key >= (newValue as number)) {
                    addEffects(dep);
                }
            });
        } else {
            const dep = depsMap.get(key);
            addEffects(dep);
        }
    }

    // IMO, the logic in Vue3 is not clean, maybe could refactor
    // TODO: also run for iteration key on ADD | DELETE | Map.SET
    if (type === TriggerOpTypes.ADD) {
        if (!isArray(target)) {
            addEffects(depsMap.get(ITERATE_KEY));
            // if (isMap(target)) addEffects(depsMap.get(MAP_KEY_ITERATE_KEY));
        } else if (isIntegerKey(key)) {
            addEffects(depsMap.get('length'));
        }
    }

    // run
    effectsToExe.forEach((effect) => {
        if (__DEV__ && effect.options.onTrigger) {
            effect.options.onTrigger({
                effect,
                target,
                key,
                type,
                newValue,
                oldValue,
                oldTarget,
            });
        }
        if (effect.options.scheduler) {
            effect.options.scheduler(effect);
        } else {
            effect();
        }
    });
}
