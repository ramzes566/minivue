export class Depend {
  constructor() {
    this.reactiveFns = new Set();
  }
  addDep(fn) {
    if (fn) {
      this.reactiveFns.add(fn);
    }
  }
  notify() {
    this.reactiveFns.forEach((fn) => fn());
  }
}

//全局变量，用于存储当前的依赖函数
export let activeEffect = null;

export function watchFn(fn) {
  activeEffect = fn;

  fn();

  activeEffect = null;
}
