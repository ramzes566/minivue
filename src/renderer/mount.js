function mount(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.type));
  if (vnode.props) {
    for (const key in vnode.props) {
      if (key.startsWith("on")) {
        el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
      } else {
        el.setAttribute(key, vnode.props[key]);
      }
    }
  }

  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach((item) => {
        mount(item, el);
      });
    }
  }

  container.appendChild(el);
}

export { mount };
