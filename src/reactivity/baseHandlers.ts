import {
  // reactive,
  // readonly,
  // toRaw,
  ReactiveFlags,
  Target,
  readonlyMap,
  reactiveMap 
} from './reactive';

  import {
    isObject,
    hasOwn,
    // isSymbol,
    // hasChanged,
    isArray,
    // isIntegerKey,
    // extend,
    // makeMap
  } from '../utils'

// const get = /*#__PURE__*/ createGetter()
// NOTE: When will get's receiver be used??
function get(target: Target, key: string | symbol, receiver: object) {
  // SKIP = '__v_skip',
  // IS_REACTIVE = '__v_isReactive',
  // IS_READONLY = '__v_isReadonly',
  // RAW = '__v_raw'

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


}

export const mutableHandlers: ProxyHandler<object> = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
  }