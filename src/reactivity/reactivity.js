import { Depend, activeEffect } from "./depend.js";

const targetMap = new WeakMap();

function getDepend(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Depend();
    depsMap.set(key, dep);
  }

  return dep;
}

export function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);

      if (activeEffect) {
        const dep = getDepend(target, key);
        dep.addDep(activeEffect);
      }

      return res;
    },
    set(target, key, newValue, receiver) {
      const result = Reflect.set(target, key, newValue, receiver);

      const dep = getDepend(target, key);
      dep.notify();

      return result;
    },
  });
}
