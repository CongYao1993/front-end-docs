## 1. new Vue() 实例挂载的过程

Vue 是一个构造函数，只能通过 new 关键字初始化，然后会调用 `this._init` 方法。

options 是用户传递过来的配置项，如 data、methods、props、computed、watch 等。

```javascript
// src/core/instance/index.js

function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}
```

`this._init`会执行一系列的初始化步骤，从创建到挂载 Vue 实例。

1. **合并选项**：Vue 会将传入的选项对象与默认选项进行合并。这包括 data、methods、computed、watch 等配置项。
2. **初始化生命周期**：设置一些内部变量和标志，为后续的生命周期钩子做准备。
3. **初始化事件**：处理父组件传入的事件监听器，将它们存储在实例上。
4. **初始化渲染函数**：如果有 render 函数，则直接使用；否则，将 template 编译成 render 函数。
5. `beforeCreate`：此时数据观测和事件还未初始化。
6. **初始化 inject**：解析 inject 选项，得到注入的属性。
7. **初始化状态**：依次处理 props、methods、data 并将其转换为响应式、computed 和 watch。
8. **初始化 provide**：解析 provide 选项，使得子组件可以注入。
9. `created`：此时，响应式数据、计算属性、方法和侦听器都已经设置好了。
10. **开始挂载阶段**：如果有 el 选项，则自动开始挂载过程。
11. `beforeMount 钩子`：在挂载开始之前被调用。
12. **挂载**：创建 Vue 实例的 \$el 并用其替换 "el" 选项对应的元素。
13. `mounted 钩子`：此时，Vue 实例已经挂载到 DOM 上，可以访问到 \$el。

```javascript
// src/core/instance/init.js

Vue.prototype._init = function (options?: Object) {
  const vm: Component = this;
  // a uid
  vm._uid = uid++;
  let startTag, endTag;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    startTag = `vue-perf-start:${vm._uid}`;
    endTag = `vue-perf-end:${vm._uid}`;
    mark(startTag);
  }

  // a flag to avoid this being observed
  vm._isVue = true;
  // merge options
  // 合并属性，判断初始化的是否是组件，这里合并主要是 mixins 或 extends 的方法
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options);
  } else {
    // 合并 vue 属性
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    );
  }
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== "production") {
    // 初始化 proxy 拦截器
    initProxy(vm);
  } else {
    vm._renderProxy = vm;
  }
  // expose real self
  vm._self = vm;
  // 初始化组件生命周期标志位
  initLifecycle(vm);
  // 初始化组件事件侦听
  initEvents(vm);
  // 初始化渲染方法
  initRender(vm);
  callHook(vm, "beforeCreate");
  // resolve injections before data/props
  initInjections(vm);
  // 初始化 props/methods/data/computed/watch
  initState(vm);
  // resolve provide after data/props
  initProvide(vm);
  callHook(vm, "created");

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== "production" && config.performance && mark) {
    vm._name = formatComponentName(vm, false);
    mark(endTag);
    measure(`vue ${vm._name} init`, startTag, endTag);
  }
  // 挂载元素
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```

## 2. Vue 响应式原理

Vue 的响应式使用了观察者模式，没有事件中心。

- Dep 是目标、发布者
  - subs 数组：存储所有的观察者
  - addSub()：添加观察者，将其保存到 subs 数组中
  - notify()：当事件发生后，调用所有观察者的 update() 方法。
- Watcher 是观察者、订阅者
  - update(): 当事件发生时，具体要做的事情。

### 2.1 实现一个基本的响应式框架：

1. 定义 observe 函数，遍历 data 中的所有属性，使用 Object.defineProperty 把所有属性转为 getter/setter ，每一个属性对应一个 dep 对象，用来存储对应的 watcher 观察者
2. 定义 compile 函数，模板编译，从 Vue 挂载的节点开始遍历 DOM，遇到双大括号{{key}}形式的文本，则替换成 data.key 对应的值，getter 将该 DOM 节点添加到对应 key 值的 dep 对象中
3. 当 data 的数据变化时，setter 调用 dep 对象的 notify 方法，更新所有观察者中的 dom 节点

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>vue的MVVM简单实现</title>
  </head>
  <body>
    <div id="app">
      <p>姓名: <span>{{name}}</span></p>
      <p>年龄: <span>{{age}}</span></p>
    </div>
    <script>
      window.onload = function () {
        // new 一个 Vue 实例
        const vue = new Vue({
          el: "#app",
          data: {
            name: "加载中",
            age: "18",
          },
        });
        // 2s 后更新页面的信息
        setTimeout(() => {
          // 修改vue中$data的name和age属性
          vue.$data.name = "小明";
          vue.$data.age = 20;
        }, 2000);
      };
      class Vue {
        constructor(options) {
          this.options = options;
          this.$data = options.data;
          this.observe(options.data);
          this.compile(document.querySelector(options.el));
        }
        // 监听 data 中属性的变化
        observe(data) {
          Object.keys(data).forEach((key) => {
            // 给 data 中的每一个属性添加一个 dep 对象（该对象用来存储对应的watcher观察者）
            let dep = new Dep();
            // 利用闭包，获取和设置属性的时候，操作的都是 value
            let value = data[key];
            Object.defineProperty(data, key, {
              get() {
                // 收集依赖：获取属性值时，向观察者对象中添加对应的 dom 节点
                Dep.target && dep.addSub(Dep.target);
                return value;
              },
              set(newValue) {
                if (value === newValue) {
                  return;
                }
                value = newValue;
                // 触发依赖：属性值变化时，更新观察者中所有节点
                dep.notify(newValue);
              },
            });
          });
        }
        compile(dom) {
          dom.childNodes.forEach((child) => {
            // nodeType 为 3 时为文本节点，并且该节点的内容包含双大括号{{}}
            if (
              child.nodeType === 3 &&
              /\{\{(.*)\}\}/.test(child.textContent)
            ) {
              // RegExp.$1 是正则表达式匹配的第一个字符串，这里对应的就是 data 中的 key 值
              let key = RegExp.$1.trim();
              // 将该节点添加到对应的观察者对象中，
              Dep.target = child;
              // 将{{ key }} 替换成 data 中对应的值，在 this.options.data[key] 中触发对应的 get 方法
              child.textContent = child.textContent.replace(
                `{{${key}}}`,
                this.options.data[key]
              );
              Dep.target = null;
            }
            // 递归遍历子节点
            if (child.childNodes.length) {
              this.compile(child);
            }
          });
        }
      }

      // dep 对象存储所有的观察者
      class Dep {
        constructor() {
          this.subs = [];
        }
        // 添加 watcher
        addSub(node) {
          this.subs.push(node);
        }
        // 更新 watcher
        notify(value) {
          this.subs.forEach((node) => {
            node.textContent = value;
          });
        }
      }
    </script>
  </body>
</html>
```

### 2.2 Vue2 数据劫持有什么缺点

Vue 不允许动态添加根级响应式 property，所以你必须在初始化实例前声明所有根级响应式 property。

使用 Object.defineProperty() 观察 data：

- 无法检测对象属性的添加或删除

```javascript
// 向对象添加响应式属性
Vue.set(this.someObject, "b", 2);
this.$set(this.someObject, "b", 2);

// 向已有对象添加新的多个属性
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 });
```

- 不能检测以下数组的变动：
  - 当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
  - 当你修改数组的长度时，例如：vm.items.length = newLength

Vue 重写了 Array 原型链上的方法 splice()、 push()、pop()、shift()、unshift()、sort()、reverse() ，调用这些方法会 observe 数据。

```javascript
// 修改数组中的某一项
this.items.splice(indexOfItem, 1, newValue);
Vue.set(this.items, indexOfItem, newValue);
this.$set(this.items, indexOfItem, newValue);

// 修改数组长度：newLength 必须小于当前长度，数组中新长度之后所有元素被删除
this.items.splice(newLength);
```

## 3. 虚拟 DOM 和 diff 算法

## 4. nextTick 原理

首先明确 Task -> MicroTask -> UI Render 顺序是一定的，Vue 中对于异步更新的运用主要是维护异步队列 dom 更新合并，以及 nextTick。

而 nextTick 的实质也是 MicroTask，只是它会在执行时立刻追加到异步队列后面，而当你依次执行队列时，UI 虽然没渲染，但是 DOM 其实已经更新了，注意：DOM 更新是及时的，但是更新是异步的。

## 5. keep-alive 原理
