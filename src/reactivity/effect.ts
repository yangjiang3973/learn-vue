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
    // onTrack?: (event: DebuggerEvent) => void;
    // onTrigger?: (event: DebuggerEvent) => void;
    // onStop?: () => void;
    allowRecurse?: boolean;
}

// export type DebuggerEvent = {
//     effect: ReactiveEffect;
//     target: object;
//     type: TrackOpTypes | TriggerOpTypes;
//     key: any;
// } & DebuggerEventExtraInfo;

// export interface DebuggerEventExtraInfo {
//     newValue?: any;
//     oldValue?: any;
//     oldTarget?: Map<any, any> | Set<any>;
// }

const effectStack: ReactiveEffect[] = [];
let activeEffect: ReactiveEffect | undefined;

//* IMO, should not call this function effect
export function effect<T = any>(
    fn: () => T,
    options: ReactiveEffectOptions
): ReactiveEffect<T> {
    // if (isEffect(fn)) {
    //     fn = fn.raw;
    // }
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
        // if (!effect.active) {
        //     return options.scheduler ? undefined : fn();
        // }
        if (!effectStack.includes(effect)) {
            // cleanup(effect);
            try {
                // enableTracking()
                effectStack.push(effect);
                activeEffect = effect;
                return fn();
            } finally {
                effectStack.pop();
                // resetTracking();
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

// let shouldTrack = true;
const targetMap = new WeakMap<any, KeyToDepMap>();
type KeyToDepMap = Map<any, Dep>;
type Dep = Set<ReactiveEffect>;

// {
//     target1: {
//         key1: [effect1, effect2];
//     }
// }

export function track(target: object, type: TrackOpTypes, key: unknown) {
    // if (!shouldTrack || activeEffect === undefined) {
    //     return;
    // }
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
        // if (__DEV__ && activeEffect.options.onTrack) {
        //     activeEffect.options.onTrack({
        //         effect: activeEffect,
        //         target,
        //         type,
        //         key,
        //     });
        // }
    }
}

// export const ITERATE_KEY = Symbol(__DEV__ ? 'iterate' : '');
// export const MAP_KEY_ITERATE_KEY = Symbol(__DEV__ ? 'Map key iterate' : '');

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

    // TODO: TriggerOpTypes.CLEAR

    // schedule runs for SET | ADD | DELETE
    //* I don't use void 0 here
    // if (key !== void 0) {
    if (key !== undefined) {
        // add(depsMap.get(key));
        const dep = depsMap.get(key);
        if (dep) {
            dep.forEach((effect) => {
                // TODO: why need this check?
                if (effect !== activeEffect || effect.allowRecurse) {
                    effectsToExe.add(effect);
                }
            });
        }
    }

    // TODO: also run for iteration key on ADD | DELETE | Map.SET

    // run
    effectsToExe.forEach((effect) => {
        // if (__DEV__ && effect.options.onTrigger) {
        //     effect.options.onTrigger({
        //       effect,
        //       target,
        //       key,
        //       type,
        //       newValue,
        //       oldValue,
        //       oldTarget
        //     })
        //   }
        // if (effect.options.scheduler) {
        //     effect.options.scheduler(effect);
        // } else {
        effect();
        // }
    });
}
