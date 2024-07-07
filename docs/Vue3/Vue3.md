[https://cn.vuejs.org/guide/introduction.html](https://cn.vuejs.org/guide/introduction.html)

# 一、简介
一个好的设计者，会关注产品的边界在哪里。从 Vue 2 到 Vue 3，产品的边界发生变化：Vue 2 专注给用户提供一个完整的 MVVM（模型Model、视图View、视图模型View Model）框架，让数据和模型绑定；**Vue 3 是一个专注视图层（View）渲染的框架** ，服务范围在缩小。

Vue 3 不再是一个 MVVM 框架，并不是说设计程序不再使用 MVVM 架构，而是说 Vue 3 专注于渲染，服务范围在缩小，我们可以使用任何架构（MVVM、领域驱动开发等）。
<br />
<br />

**Vue 3 是根据数据渲染视图的函数，加上一些副作用。** 计算数据返回 DOM，是 Vue 的本质，从这个角度来说，是纯函数。但是前端必须有副作用（effect），用来跳转页面、修改浏览器历史、发起支付请求等。

```javascript
UI/view = f(data) with effect[]
```

- 用纯函数计算：页面元素、层级关系、属性样式……
- 用effect提供：网络请求、Cookie操作、window操作、绑定事件……
<br />
<br />

Vue 3 的优点：

- 更快（去掉 Time slice：[https://github.com/vuejs/rfcs/issues/89](https://github.com/vuejs/rfcs/issues/89)）
- 更小（Treeshakable）
- **更好用、更好维护**
   - Composition API && Reactivity
      - 简化状态设计，更符合人的直觉
      - 拥抱函数式
      - 简化API，让API更简单（setup，箭头函数），减少学习成本（不再推荐使用指令）
      - 更好的封装和最小的颗粒度复用（关注点分离原则）
   - JSX/Typescript
      - JSX 成为行业标准，webpack、Typescript 等原生支持 JSX
      - JSX 符合 W3C 标准，JSX 和 JS 混合使用，提高我们设计复杂组件的抽象能力，在 HTML 嵌套语法和 HTML 直接成为程序是两个概念
