// 从 renderer 导入
import { h as importedH } from "./src/renderer/h.js"; // 使用别名以确保如果内部也用 h，则不会冲突
import { mount } from "./src/renderer/mount.js"; // 小写 mount
import { patch } from "./src/renderer/patch.js";

// 从 reactivity 导入
import { reactive as importedReactive } from "./src/reactivity/reactivity.js"; // 使用别名
import { watchFn } from "./src/reactivity/depend.js"; // 导入 watchFn

// 导出供其他模块使用
export const h = importedH;
export const reactive = importedReactive;

export class Vue {
  // 导出 Vue 类
  static createApp(rootComponent) {
    return {
      mount(selector) {
        // 修改参数名为 selector，更符合通常用法
        const el = document.querySelector(selector); // 使用 selector
        let isMounted = false; // 修改变量名 isMount -> isMounted
        let oldVNodes = null;

        watchFn(function () {
          if (isMounted) {
            // 使用 isMounted
            const newVNodes = rootComponent.render();
            patch(oldVNodes, newVNodes);
            oldVNodes = newVNodes;
          } else {
            oldVNodes = rootComponent.render();
            // mount 函数来自于导入，并非 Vue 类的方法
            mount(oldVNodes, el); // 直接调用导入的 mount
            isMounted = true; // 使用 isMounted
          }
        });
      },
    };
  }
}

// 移除 window 挂载
// window.reactive = reactive;
// window.h = h;
// window.Vue = Vue;
