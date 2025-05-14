function patch(n1, n2) {
  if (n1.type != n2.type) {
    const elParent = n1.el.parentElement;
    elParent.removeChild(n1.el);
    mount(n2, elParent);
  } else {
    const el = (n2.el = n1.el);
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        if (key.startsWith("on")) {
          el.addEventListener(key.slice(2).toLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }
    for (const key in oldProps) {
      const oldValue = oldProps[key];
      if (key.startsWith("on")) {
        el.removeEventListener(key.slice(2).toLowerCase(), oldValue);
      }
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }

    const oldChildren = n1.children || [];
    const newChildren = n2.children || [];
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (newChildren !== oldChildren) {
          el.textContent = newChildren;
        }
      } else {
        el.textContent = newChildren;
      }
    } else {
      if (typeof oldChildren === "string") {
        el.innerHTML = "";
        newChildren.forEach((item) => mount(item, el));
      } else {
        //如果newChildren和oldChildren都为数组
        const minLength = Math.min(newChildren.length, oldChildren.length);
        for (let i = 0; i < minLength; i++) {
          patch(oldChildren[i], newChildren[i]);
        }

        if (newChildren.length < oldChildren.length) {
          oldChildren
            .slice(newChildren.length)
            .forEach((item) => el.removeChild(item.el));
        }

        if (newChildren.length > oldChildren.length) {
          newChildren
            .slice(oldChildren.length)
            .forEach((item) => mount(item, el));
        }
      }
    }
  }
}

export { patch };
