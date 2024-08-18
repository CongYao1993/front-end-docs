## 1. 路由的 hash 和 history 模式

Vue Router 有两种模式：hash 模式和 history 模式。

两种模式均是客户端路由的实现方式。当路径发生变化时，不会向服务器发送请求，JS 监测到路径的变化，根据不同的地址渲染不同的内容。

### 1.1 hash 模式

hash 模式的 URL 带着一个#，#及其后面的部分是 hash 值，常作锚点在页面内进行导航。例如：www.abc.com/#/login，它的hash值就是#/login。

- 优点：改变 URL 中的 hash 部分不会引起页面刷新，不向后端发送请求；兼容性好, 浏览器都能支持
- 缺点：hash 值前面需要加#，不符合 url 规范，也不美观

hash 模式的主要原理是 `hashchange` 事件，触发情况如下：

- JavaScript 修改 url，例：通过 location.href、location.hash 修改 url
- 通过 `<a>` 标签改变 URL
- 浏览器前进后退，例：前进后退按钮、history.go、history.back、history.forward
- 在浏览器输入框修改 url

页面第一次加载时，不会触发 hashchange。

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <ul>
      <!-- 定义路由 -->
      <li><a href="#/home">home</a></li>
      <li><a href="#/about">about</a></li>

      <!-- 渲染路由对应的 UI -->
      <div id="routeView"></div>
    </ul>
  </body>
  <script>
    let routerView = document.getElementById("routeView");

    // 页面初次加载完不会触发 hashchange，在 DOMContentLoaded 事件获取 hash 值，再将视图渲染成对应的内容。
    document.addEventListener("DOMContentLoaded", funcRef);

    // 监听 hashchange
    window.addEventListener("hashchange", funcRef, false);
    // 或 window.onhashchange = funcRef;

    function funcRef(event) {
      console.log("hashchange", location.hash);

      let hash = location.hash;
      // 改变router-view组件的内容
      routerView.innerHTML = hash;
    }
  </script>
</html>
```

### 1.2 history 模式

history 模式是传统的路由分发模式，即用户输入一个 URL，服务器会接收这个请求并解析这个 URL，然后作出相应的逻辑处理。 例如：abc.com/user/id。

- 优点：相比 hash 模式更加好看，没有#。
- 缺点：刷新页面时需要后台配置支持，如果后台没有正确配置，刷新页面时会返回 404。可以在服务器上添加一个简单的回退路由，如果 URL 不匹配任何静态资源，返回 index.html。

nginx 配置中，try_files 用于指定文件的查找规则，可以配置多个规则，会按顺序执行查找规则，若找到文件则中断查找并返回文件，若找不到则返回 404 响应。

```nginx
location / {
  try_files $uri $uri/ /index.html; # 先从 $uri 查找，再从 $uri/ 目录中查找，最后查找 /index.html。
}
```

history 模式的主要原理是 `popstate` 事件，在同一文档的两个历史记录条目之间导航会触发该事件。触发 popstate 事件：

- 浏览器前进后退会触发 popstate 事件，例：前进后退按钮、history.go、history.back、history.forward

对于不会触发 popstate 事件的情况，需要特殊处理。不会触发 popstate 事件：

- 调用 history.pushState() 或者 history.replaceState()
  - history 的 pushState 和 replaceState 方法，只会改变浏览器地址栏的地址，添加或修改当前浏览器会话的历史堆栈中的状态（state），不会引起页面刷新，不会立即向服务器发送请求。
- 通过 `<a>` 标签改变 URL
- 页面第一次加载时
- 在浏览器输入框修改 url，或通过 JavaScript 修改 url（location.href 等），页面会刷新，重新加载页面
- 该事件只针对同一个文档，如果浏览历史的切换，导致加载不同的文档，该事件也不会触发

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <ul>
      <!-- 定义路由 -->
      <li><a href="/home">home</a></li>
      <li><a href="/about">about</a></li>

      <!-- 渲染路由对应的 UI -->
      <div id="routeView"></div>
    </ul>
  </body>
  <script>
    let routerView = document.getElementById("routeView");

    window.addEventListener("DOMContentLoaded", () => {
      // 页面初次加载完或者刷新后不会触发 popstate，在 DOMContentLoaded 事件获取 URL，再将视图渲染成对应的内容。
      routerView.innerHTML = location.pathname;

      // 处理 <a> 标签的 click 事件
      var linkList = document.querySelectorAll("a[href]");
      linkList.forEach((el) =>
        el.addEventListener("click", function (e) {
          e.preventDefault();
          history.pushState(null, "", el.getAttribute("href"));
          routerView.innerHTML = location.pathname;
        })
      );
    });

    // 监听 popstate
    window.addEventListener("popstate", () => {
      routerView.innerHTML = location.pathname;
    });
  </script>
</html>
```

## 2. Vue Router 原理

Vue Router 是 Vue 的一个插件。

[手写 Vue Router 核心原理](https://juejin.cn/post/6854573222231605256)

### 2.1 路由注册

当执行 Vue.use 注册插件的时候，会执行 install 方法。

给每一个组件注入 beforeCreate 和 destoryed 钩子函数，在 beforeCreate 做一些私有属性定义和路由初始化工作。

```javascript
import View from "./components/view";
import Link from "./components/link";

export let _Vue;

export function install(Vue) {
  // 确保 install 只执行一次
  if (install.installed && _Vue === Vue) return;
  install.installed = true;

  _Vue = Vue;

  const isDef = (v) => v !== undefined;

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode;
    if (isDef(i) && isDef((i = i.data)) && isDef((i = i.registerRouteInstance))) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.router)) {
        // 根 Vue 实例
        // 对于子组件，this._routerRoot 始终指向离它最近的传入了 router 对象作为配置而实例化的父实例
        this._routerRoot = this;
        // router 实例，它是在 new Vue 的时候传入的
        this._router = this.$options.router;
        // 初始化 router
        this._router.init(this);
        // 把 this._route 变成响应式对象
        Vue.util.defineReactive(this, "_route", this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed() {
      registerInstance(this);
    },
  });

  // 给 Vue 原型上定义了 $router 的 get 方法
  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot._router;
    },
  });

  // 给 Vue 原型上定义了 $route 的 get 方法
  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._routerRoot._route;
    },
  });

  // 定义了全局的 <router-link> 和 <router-view> 组件
  Vue.component("RouterView", View);
  Vue.component("RouterLink", Link);

  // 定义了路由中的钩子函数的合并策略，和普通的钩子函数一样
  const strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}
```

### 2.2 VueRouter 类

实例化 VueRouter 后会返回它的实例 router，在 `new Vue` 时会把 router 作为配置项传入，混入的 beforeCreate 会执行 `this._router = this.$options.router` 和 `this._router.init(this)`。

```javascript
export default class VueRouter {
  static install: () => void;

  constructor(options: RouterOptions = {}) {
    if (process.env.NODE_ENV !== "production") {
      warn(this instanceof VueRouter, `Router must be called with the new operator.`);
    }
    this.app = null; // 根 Vue 实例
    this.apps = []; // 保存持有 $options.router 属性的 Vue 实例
    this.options = options; // 保存传入的路由配置
    this.beforeHooks = [];
    this.resolveHooks = [];
    this.afterHooks = [];
    this.matcher = createMatcher(options.routes || [], this); // 路由匹配器

    let mode = options.mode || "hash";
    // 在浏览器不支持 history.pushState 的情况下，根据传入的 fallback 配置参数，决定是否回退到 hash 模式
    this.fallback = mode === "history" && !supportsPushState && options.fallback !== false;
    if (this.fallback) {
      mode = "hash";
    }
    if (!inBrowser) {
      mode = "abstract";
    }
    // 表示路由创建的模式
    this.mode = mode;

    // this.history 表示路由历史的具体的实现实例，它是根据 this.mode 的不同实现不同，它有 History 基类，然后不同的 history 实现都是继承 History。
    switch (mode) {
      case "history":
        this.history = new HTML5History(this, options.base);
        break;
      case "hash":
        this.history = new HashHistory(this, options.base, this.fallback);
        break;
      case "abstract":
        this.history = new AbstractHistory(this, options.base);
        break;
      default:
        if (process.env.NODE_ENV !== "production") {
          assert(false, `invalid mode: ${mode}`);
        }
    }
  }

  match(raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom);
  }

  init(app: any /* Vue component instance，Vue 组件实例 */) {
    process.env.NODE_ENV !== "production" &&
      assert(
        install.installed,
        `not installed. Make sure to call \`Vue.use(VueRouter)\` ` + `before creating root instance.`
      );

    this.apps.push(app);

    if (this.app) {
      return;
    }

    this.app = app;

    const history = this.history;

    if (history instanceof HTML5History || history instanceof HashHistory) {
      const handleInitialScroll = (routeOrError) => {
        const from = history.current;
        const expectScroll = this.options.scrollBehavior;
        const supportsScroll = supportsPushState && expectScroll;

        if (supportsScroll && "fullPath" in routeOrError) {
          handleScroll(this, routeOrError, from, false);
        }
      };
      const setupListeners = (routeOrError) => {
        history.setupListeners();
        handleInitialScroll(routeOrError);
      };
      // route = this.router.match(location, this.current);
      history.transitionTo(history.getCurrentLocation(), setupListeners, setupListeners);
    }

    history.listen((route) => {
      this.apps.forEach((app) => {
        app._route = route;
      });
    });
  }
}
```
