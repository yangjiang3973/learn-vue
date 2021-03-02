import { TrackOpTypes, TriggerOpTypes } from './operations';

export function track(target: object, type: TrackOpTypes, key: unknown) {}

export function trigger(
    target: object,
    type: TriggerOpTypes,
    key?: unknown,
    newValue?: unknown,
    oldValue?: unknown,
    oldTarget?: Map<unknown, unknown> | Set<unknown>
) {}
