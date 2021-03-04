import { reactive, isReactive } from './reactivity/src/reactive';

class CustomMap extends Map {}
const cmap = reactive(new CustomMap());
console.log('🚀 ~ file: main.js ~ line 5 ~ cmap', cmap);
console.log('🚀 ~ file: main.js ~ line 5 ~ cmap', cmap instanceof Map);
console.log(isReactive(cmap));
