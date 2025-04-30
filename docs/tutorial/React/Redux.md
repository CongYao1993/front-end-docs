[Redux 官方文档](https://redux.js.org/)  
[Redux 中文官方文档](https://cn.redux.js.org/)

Redux 是 React 最常用的集中状态管理工具，类似于 Vue 中的 Pinia 或 Vuex。

**为什么要使用 Redux？**

- 独立于组件，可以跨组件层级通信
- 单项数据流清晰，易于定位 bug
- 调试工具配套良好，方便调试

## 1. 基础示例

```jsx
import { createStore } from "redux";

/**
 * reducer 函数
 * 根据不同的 action 对象，返回不同的新的 state
 * @param {object} state
 * @param {object} action 描述“发生了什么”
 * @return {object} 新的 state 值
 *
 * 不应该改变 state 对象，而是在 state 发生变化时返回一个新对象。
 */
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "counter/incremented":
      return { count: state.count + 1 };
    case "counter/decremented":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 创建一个包含应用程序 state 的 Redux store。
// 它的 API 有 { subscribe, dispatch, getState }
let store = createStore(counterReducer);

// 使用 store.subscribe() 订阅 state 的变化，通常会在 state 变化时更新 UI
store.subscribe(() => {
  console.log(store.getState());
  document.getElementById("count").innerText = store.getState().count;
});

// 使用 store.dispatch() 提交 action 更改状态
function clickIncrement() {
  store.dispatch({
    type: "counter/incremented",
  });
}

function clickDecrement() {
  store.dispatch({
    type: "counter/decremented",
  });
}

const App = () => {
  return (
    <>
      <button onClick={clickDecrement}>-</button>
      <span id="count">0</span>
      <button onClick={clickIncrement}>+</button>
    </>
  );
};
```

<img src="./images/redux-flux.png" width="70%" />

1. React 组件通过 `store.getState()` 从 store 获取状态；
2. 通过 `store.dispatch()` 发送 action 给 store，store 通知 reducer 修改 state；
3. reducer 将修改后的状态返回，通知 React 组件从 store 获取更新后的状态。

## 2. 术语

Redux 的三个核心部分是：Action Creators、Store、Reducers。

其中 Store 是单一的，而 Action Creators 和 Reducers 是多个。

### 2.1 Action 和 Action Creator

action 是一个具有 type 字段的普通 JavaScript 对象，可以理解为描述应用程序中发生了什么的事件名。

action 可以包含一些字段：

- type 字段：字符串，给 action 一个描述性的名字，通常写成「域/事件名称」，表示所属类别和具体操作。
- payload 字段：传给事件的参数。

```javascript
// action对象举例
const addAction = {
  type: "todos/add",
  payload: 10, // 表示加 10
};
```

action creator 是一个创建并返回一个 action 对象的函数。它的作用是让你不必每次都手动编写 action 对象。

```javascript
const addTodo = count => {
  type: "todos/add",
  payload: count,
}
```

### 2.2 Reducer

reducer 是一个负责修改状态，返回新状态的函数，`(state, action) => newState`。

- 参数只有两个，仅使用 state 和 action 参数计算新的状态值
- state 是不可变更新的（immutable updates），可以复制现有值生成新的 state
- 是同步的，禁止任何异步逻辑、依赖随机值或导致其他“副作用”的代码

```javascript
const initialState = { count: 0 };

function counterReducer(state = initialState, action) {
  // 检查 reducer 是否关心这个 action，如果是
  if (action.type === "counter/increment") {
    // state 的不可变性
    return {
      ...state,
      count: state.count + 1,
    };
  }
  // 否则返回原来的 state 不变
  return state;
}
```

### 2.3 Store

Store 是一个全局对象，用于操作 state。

```javascript
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: counterReducer });

console.log(store.getState()); // {value: 0}
```

## 3. 在 React 中使用 Redux

### 3.1 Redux Toolkit 和 React-Redux

- `Redux Toolkit（RTK）`是包含 Redux 核心、Redux Thunk、Reselect 等包的合集，简化了大多数 Redux 任务。
- `React-Redux` 有一组自定义 hooks，允许 React 组件与 Redux store 交互，即获取 Redux Store 中的 state、修改 state、修改后更新组件等。

```sh
npm install @reduxjs/toolkit # 包含 npm install redux
npm install react-redux # React 绑定
npm install --save-dev redux-devtools # 开发者工具
```

### 3.2 store 目录结构设计

```sh
# 将 Slice 放置在所属的业务模块中
src/
│
├── pages/
│ ├── counter/
│   ├── Counter.js # Counter 组件
│   └── counterSlice.js
│
├── store.js # 根 Store
├── App.js
└── index.js

# 也可以新建 store 文件夹，在 store/modules 下面放置多个模块的 Slice
src/
│
├── store/
│ ├── modules/
│ │ └── counterSlice.js
│ └── index.js # 根 Store
│
└── ...
```

### 3.3 创建 Redux Store

使用 `configureStore` 函数创建 Redux store，传入一个 reducer 参数，包含不同业务的 reducer。

当我们传入一个像 `{counter: counterReducer}` 这样的对象时，相当于挂载了 reducer。

- 可以从 Redux 状态中获取 state.counter
- dispatch action 时 counterReducer 函数负责决定是否以及如何更新 state.counter

```javascript
// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

### 3.4 创建 Slice Reducer 和 Action

`Redux Slice` 应用中单个功能的 Redux reducer 逻辑和 action 的集合。

createSlice 的函数，它负责生成 action 类型字符串、action creator 函数和 action 对象的工作。

- initialState 为 reducer 传入初始状态值，以便在第一次调用时就有一个 state
- name 选项和 reducer 函数的键名组成了 action 类型，例如 `{type: "counter/increment"}`
- 自动生成与编写的 reducer 函数同名的 action creator `counterSlice.actions.increment()`，调用该函数生成 action 类型字符串

```javascript
// src/pages/counter/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  // Slice 名称，独一无二
  name: "counter",
  // 初始数据
  initialState: {
    count: 0,
  },
  // 修改数据的同步方法
  reducers: {
    increment: (state) => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑
      // 并不是真正的改变 state 因为它使用了 immer 库
      // 当 immer 检测到 "draft state" 改变时，会基于这些改变去创建一个新的不可变的 state
      state.count++;
    },
    decrement: (state) => {
      state.count--;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 导出 reducer 函数
export default counterSlice.reducer;
```

### 3.5 用 Thunk 编写异步逻辑

thunk 是一种特定类型的 Redux 函数，可以包含异步逻辑。Thunk 是使用两个函数编写的：

- 一个外部创建者函数，它创建并返回 thunk 函数
- 一个内部 thunk 函数，它以 dispatch 和 getState 作为参数

```javascript
// src/pages/counter/counterSlice.js

// 下面这个函数就是一个 thunk ，它使我们可以执行异步逻辑
// 调用 thunk 时接受 `dispatch` 函数作为第一个参数
// 当异步代码执行完毕时，可以 dispatched actions
export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount));
  }, 1000);
};

// 外部的 thunk creator 函数
const fetchUserById = (userId) => {
  // 内部的 thunk 函数
  return async (dispatch, getState) => {
    try {
      // thunk 内发起异步数据请求
      const user = await userAPI.fetchById(userId);
      // 但数据响应完成后 dispatch 一个 action
      dispatch(userLoaded(user));
    } catch (err) {
      // 如果过程出错，在这里处理
    }
  };
};
```

### 3.6 在组件中使用 Store

组件文件中不能引入 store，UI 不能直接与 store 进行交互。

React-Redux 库有一组自定义 hooks，允许你的 React 组件与 Redux store 交互。

#### 1）使用 useSelector 提取数据

useSelector 让组件从 Redux 的 store 状态树中提取它需要的任何数据。

如果 store 被更新，useSelector 将重新运行选择器函数。如果选择器返回的值与上次不同，将组件使用新值重新渲染。

```javascript
// src/pages/counter/counterSlice.js

// Selectors 也可以在使用的地方内联的方式定义，而不是仅仅只能在 slice 文件中。
// 例如 : `useSelector((state) => state.counter.value)`
export const selectCount = (state) => state.counter.value;
```

#### 2）使用 useDispatch 修改数据

使用 useDispatch 来 dispatch action。

dispatch 既可以执行同步逻辑，也可以执行异步逻辑。

```jsx
// src/pages/counter/Counter.js

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment, incrementByAmount, incrementAsync, selectCount } from "./counterSlice";

export function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(increment())}>+</button>
      <span>{count}</span>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}
```

### 3.7 Providing the Store

内置 Provider 组件 通过 store 参数把创建好的 store 实例注入到应用中。

```javascript
// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./app/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```
