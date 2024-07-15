## 1. data 为什么是一个函数而不是对象

一个组件的 data 选项必须是一个函数，每个新创建的组件实例都可以维护一份被返回对象的独立的拷贝。

如果 data 是一个对象，则所有的实例将共享引用同一个数据对象，多个实例之间会互相影响。

```javascript
Vue.component("button-counter", {
  data: function () {
    return {
      count: 0,
    };
  },
  template:
    '<button v-on:click="count++">You clicked me {{ count }} times.</button>',
});
```

## 2. v-if 和 v-show 的区别

v-if 和 v-show 均是有条件地渲染内容。

v-if：

- v-if 是惰性的，如果初始条件为假，则什么也不做，条件为真时，才开始渲染条件块
- v-if 是真正的条件渲染，在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建
- v-if 有更高的切换开销，适合运行时条件很少改变的元素

v-show：

- v-show 是通过设置 CSS 样式的 display 属性进行切换
- 无论初始条件是什么，元素总会被渲染，只是简单的基于 CSS 切换
- v-show 有更高的初始渲染开销，适合频繁切换的元素

## 3. v-for 和 v-if 的优先级

当 v-if 和 v-for 同时存在于一个元素上的时候，

- Vue2 中，v-for 具有更高的优先级
- Vue3 中，v-if 会首先被执行

不推荐同时使用 v-if 和 v-for。

## 4. v-model 的实现原理

### 4.1 表单元素的 v-model

通过 v-bind 绑定数据，通过 v-on 来监听数据变化并修改 value。

不同元素绑定不同的属性，监听不同事件。

- `text` 和 `textarea`：使用 `value` 属性和 `input` 事件；
- `checkbox` 和 `radio`：使用 `checked` 属性和 `change` 事件；
- `select`：使用 `value` 属性和 `change` 事件。

```html
<input type="text" v-model="text" />
<!-- 约等于 -->
<input type="text" :value="text" @input="text = $event.target.value" />
```

- $event：当前触发的事件对象
- $event.target：当前触发的事件对象的 DOM
- $event.target.value：当前 DOM 的 value 值

### 4.2 自定义组件的 v-model

本质上是一个父子组件通信的语法糖，通过 `props` 和 `$emit` 实现。

## 5. computed 和 watch 的区别

**computed：** 通过对已有的属性值进行计算得到一个新值。

- computed 属性值会被缓存，只有它们的响应式依赖（data 或 props 中的数据）发生改变时才会重新计算。
- 如果 computed 需要消耗时间，会阻塞渲染，不建议执行开销较大的操作。
- 不支持异步，当 computed 中有异步操作时，无法监听数据的变化。

**watch：** 监听数据的变化做一些操作。

- 无缓存性，每当监听的数据变化时就会执行回调函数。
- 支持异步操作。
- 不应该使用箭头函数来定义 watcher 函数，箭头函数的 this 将不会指向 Vue 实例。

回调的对象可以有两个参数：

- immediate: true 组件加载立即触发回调函数
- deep：深度监听，发现数据内部的变化，否则只能观察对象地址的变化

watch 观察数组时，以下两种方式的修改监测不到：

- 当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
- 当你修改数组的长度时，例如：vm.items.length = newLength

## 6. Vue 的生命周期

Vue 实例的生命周期是指从开始创建、初始化数据、编译模版、挂载 DOM -> 渲染、更新 -> 渲染、卸载等⼀系列过程。

| 阶段   | Vue2 生命周期 | Vue3 生命周期     | 说明                                                                                                | 应用                                 |
| ------ | ------------- | ----------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 创建前 | beforeCreate  | -                 | 初始化事件和生命周期钩子函数                                                                        | 可以处理加载的 Loading               |
| 创建后 | created       | -                 | 实例创建完成，可以访问 data、computed、watch、methods 上的数据方法                                  | 可以发起服务器请求                   |
| 挂载前 | beforeMount   | onBeforeMount()   | 说在挂载开始之前被调用，相关的 render 函数首次被调用                                                | -                                    |
| 挂载后 | mounted       | onMounted()       | Vue 实例已经挂载完毕，                                                                              | 可以操作 DOM                         |
| 更新前 | beforeUpdate  | onBeforeUpdate()  | 在数据发生改变后，DOM 被更新之前被调用                                                              | 比如移除手动添加的事件监听器         |
| 更新后 | updated       | onUpdated()       | 在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用                                               | 重新渲染后的打点、性能监测等         |
| 销毁前 | beforeDestory | onBeforeUnmount() | 实例销毁前调，此时实例仍然完全可用，this 仍能获取到实例用                                           | 清理事件、清理计时器、取消订阅操作等 |
| 销毁后 | destoryed     | onUnmounted()     | 说实例销毁后调用，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。 | -                                    |
| 激活时 | activated     | onActivated()     | 被 keep-alive 缓存的组件激活时调用                                                                  | 重新 observe DOM 等                  |
| 失活时 | deactivated   | onDeactivated()   | 被 keep-alive 缓存的组件失活时调用                                                                  | -                                    |

注意：

- 只有 beforeCreate 和 created 在 SSR 可用。
- 推荐在 created 中调用异步请求，一是能更快获取到服务端数据，二是 SSR 只支持 created。
- mounted 和 updated 不会保证所有的子组件也都被挂载或重新渲染完毕，可能根据异步数据生成 DOM，但是异步数据还没获取到，此时可以考虑 nextTick。
- 在大多数情况下，应该避免在 updated 更改数据，因为这可能会导致更新无限循环，可以用 watch 监测数据变化。
- 如果为一个组件包裹了 keep-alive，那么它会多出两个生命周期：activated、deactivated。同时，beforeDestroy 和 destroyed 就不会再被触发了，因为组件不会被真正销毁。

## 7. Vue 父子组件生命周期钩子函数的执行顺序

加载渲染过程：

1. 父组件 beforeCreate
2. 父组件 created
3. 父组件 beforeMount
4. 子组件 beforeCreate
5. 子组件 created
6. 子组件 beforeMount
7. 子组件 mounted
8. 父组件 mounted

更新过程：

1. 父组件 beforeUpdate
2. 子组件 beforeUpdate
3. 子组件 updated
4. 父组件 updated

销毁过程：

1. 父组件 beforeDestroy
2. 子组件 beforeDestroy
3. 子组件 destroyed
4. 父组件 destoryed

## 8. 混入 mixin 的生命周期

mixin 的钩子函数总是在当前组件之前执行。加载渲染过程如下：

1. 混入 beforeCreate
2. 组件 beforeCreate
3. 混入 created
4. 组件 created
5. 混入 beforeMount
6. 组件 beforeMount
7. 混入 mounted
8. 组件 mounted

## 9. Vue 组件通信

- `props` / `$emit`
  - 父组件通过 props 向子组件传递数据
  - 父组件在子组件上注册监听事件，子组件通过 emit 触发事件来向父组件发送数据
- `$refs` / `$root` / `$parent`
  - 父组件通过 $refs 获取子组件实例，可以访问子组件的数据和方法
  - 子组件通过 $root 获得根组件实例，可以访问根组件的数据和方法 - 子组件通过 $parent 获得父组件实例，可以访问父组件的数据和方法
- `provide` / `inject`
  - 在父组件中通过 provide 提供变量，在子组件中通过 inject 来将变量注入到组件中
    - 子组件层数很深的情况下，可以使用这种方法来进行传值，避免一层一层传递。
    - 在 Vue 2 中，provide / inject 不是响应式的，通常使用回调函数可以实现响应式，而在 Vue 3 中，默认是响应式的
- `$attrs` / `$listeners`
  - v-bind="$attrs" 传递父组件的属性
  - v-on="$listeners" 传递父组件的事件监听器和事件修饰符
  - 组件二次封装时使用
- `eventBus` 事件总线
  - 它的本质是通过创建一个空的 Vue 实例来作为事件中心，通信的组件通过在这个实例上发送事件 $emit 和接收事件 $on 来实现消息的传递。
  - 耦合性较强，如果业务逻辑复杂，后期维护困难。
- `vuex`
  - 将这一些公共的数据抽离出来，将它作为一个全局的变量来管理，然后其他组件就可以对这个公共数据进行读写操作，这样达到了解耦的目的。
