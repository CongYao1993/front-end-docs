## 1. Vuex 简介

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式 + 库**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

- state：定义状态。状态是响应式的。
- getter：定义从 state 中派生的状态。getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
- mutation：唯一更改 state 的方法，且必须是同步函数。由 `commit` 触发。
- action：用于提交 mutation，而不是直接变更状态；可以包含任意异步操作。由 `dispatch` 触发。
- module：将 store 分割成模块，每个模块拥有自己的 state、getter、mutation、action，甚至是嵌套子模块。

```javascript
// 一个简单的 Store
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});
```

Vuex 的数据传输流程：

1.  通过 new Vuex.Store()创建一个仓库；
2.  state 是公共的状态，在组件内部可以调用 state 渲染页面；
3.  当组件需要修改数据的时候，调用 dispatch action 提交 mutation 修改 state， 或 commit mutation 修改 state；
4.  state 改变后，触发组件重新渲染。

<img src="./images/vuex.jpg" width="60%" />

Vuex 优点：

- Vuex 把全局共享的状态进行抽离，通过单项数据流进行修改，可以跟踪每一个状态的变化，代码变得结构化且可维护。
- 解决了兄弟组件传参问题。
- Vuex 数据是响应式的，如果是单纯的全局对象，是非响应式的。

Vuex 缺点：

- Vuex 保存在内存中，页面刷新会丢失。

## 2. Vuex 原理

Vuex 的本质是 Vue 的一个插件。

Vue 插件应该暴露一个 install 方法。Vuex 的 install 方法调用 applyMixin 方法，该方法通过 mixin，在所有组件的 beforeCreate 设置 this.$store 对象。

```javascript
export function install(_Vue) {
  if (Vue && _Vue === Vue) {
    if (__DEV__) {
      console.error("[vuex] already installed. Vue.use(Vuex) should be called only once.");
    }
    return;
  }
  Vue = _Vue;
  applyMixin(Vue);
}
```

```javascript
// applyMixin 函数

export default function (Vue) {
  const version = Number(Vue.version.split(".")[0]);
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  }

  function vuexInit() {
    const options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === "function" ? options.store() : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
}
```

Store 的构造函数：初始化状态和模块；安装模块；初始化 `store._vm`

```javascript
export class Store {
  constructor(options = {}) {
    const { plugins = [], strict = false } = options;

    // store internal state
    this._committing = false;
    this._actions = Object.create(null);
    this._actionSubscribers = [];
    this._mutations = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = Object.create(null);
    this._subscribers = [];
    this._watcherVM = new Vue();
    this._makeLocalGettersCache = Object.create(null);

    // strict mode
    this.strict = strict;

    const state = this._modules.root.state;

    // 安装 root 模块，递归安装子模块
    installModule(this, state, [], this._modules.root);

    // 初始化 store._vm，设置响应式数据
    resetStoreVM(this, state);

    // apply plugins
    plugins.forEach((plugin) => plugin(this));
  }
}
```

store.\_vm 本质上是一个没有 template 模板的隐藏式的 Vue 组件。

- Vuex 的 state 作为该组件的 data，`store._vm.$data.$$state === store.state`，定义在 state 的变量都是响应式的；
- Vuex 的 getter 注册为该组件的 computed 属性；
- 当页面中使用了 state 或 getter 中的数据，就是依赖收集的过程；当 state 或 getter 中的数据发生变化，通过调用对应属性的 dep 对象的 notify 方法，去修改视图变化。

```javascript
function resetStoreVM(store, state, hot) {
  const oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null);
  const wrappedGetters = store._wrappedGetters;
  const computed = {};
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure environment.
    computed[key] = partial(fn, store);
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true, // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(() => oldVm.$destroy());
  }
}
```

## 3. Vuex 为什么要区分 actions 和 mutations

Vuex 中所有的状态更新的唯一途径都是 mutation，异步操作通过 action 来提交 mutation 实现。

”在 mutations 中混合异步调用会导致你的程序很难调试。例如，当你能调用了两个包含异步回调的 mutations 来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这两个概念。在 Vuex 中，我们将全部的改变都用同步方式实现。我们将全部的异步操作都放在 Actions 中。”这是 Vuex 官方的解释，但是如果同时发出了两个异步 actions，state 的更新还是存在竞态的。

区分 actions 和 mutations 并不是为了解决竞态问题，而是为了能用 devtools 追踪状态变化。

actions 只是一个架构性的概念，并不是必须的，说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutations 就行。异步竞态怎么处理那是用户自己的事情。vuex 真正限制你的只有 mutations 必须是同步的这一点。

同步的意义在于这样每一个 mutations 执行完成后都可以对应到一个新的状态，这样 devtools 就可以打个 snapshot 存下来，然后就可以随便 time-travel 了。果 mutation 支持异步操作，就没有办法知道状态是何时更新的，无法很好的进行状态的追踪，给调试带来困难。
