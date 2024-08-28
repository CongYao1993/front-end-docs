[React 官方文档](https://react.docschina.org/learn)  
[React 生态](https://github.com/enaqx/awesome-react)

React，用于构建 Web 和原生交互界面的库。

创建 React 项目：[create-react-app](https://create-react-app.bootcss.com/docs/getting-started) [React 官方安装文档](https://react.docschina.org/learn/installation)

## 1. JSX

JavaScript XML（JSX）是 JavaScript 语法扩展，使用 XML 标记的方式直接声明界面，可以让你在 JavaScript 文件中书写类似 HTML 的标签。
优势：

- HTML 的声明式模版写法
- JS 的可编程能力

JSX 不是标准的 JavaScript 语法，它是 JavaScript 的语法扩展，浏览器本身不能识别，需要通过解析工具做解析之后才能在浏览器中运行。

```javascript
const message = 'World'

export default function HelloWorld() {
  return (
    <>
      <h1>Hello {message}!</h1>
    </>
  );
}

// https://www.babeljs.cn/
// Babel 将上述内容编译为普通的 JavaScript 对象
import { jsxs as _jsxs, Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
const message = 'World';
export default function HelloWorld() {
  return /*#__PURE__*/_jsx(_Fragment, {
    children: /*#__PURE__*/_jsxs("h1", {
      children: ["Hello ", message, "!"]
    })
  });
}
```

- **推荐在 JSX 代码的外面加 ()**，防止分号自动插入的 bug。如果你的标签和 return 关键字不在同一行，则必须把它包裹在一对括号中。
- **只能返回一个根元素**。如果想要在一个组件中包含多个元素，需要用一个父标签把它们包裹起来。如果你不想在标签中增加一个额外的 `<div>`，可以用 `<> </>` 来代替。
- **标签必须闭合**，需要在结尾处用/>。
- **使用驼峰式命名法给大部分属性命名**，而不是使用 HTML 的属性名称，如 class 对应 className，tabindex 对应 tabIndex，label 的 for 属性对应 htmlFor。
- **使用大括号 {} 编写 JavaScript 表达式**，比如字符串、变量、函数调用、三元运算符等。if 语句、switch 语句、变量声明不属于表达式，不能出现在 {} 中。
- 推荐使用 `/**/` 注释。

### 1.1 列表渲染

在 JSX 中可以使用 `Array.prototype.map()` 实现列表渲染。

```jsx
const list = [
  { id: 1001, name: "Vue" },
  { id: 1002, name: "React" },
  { id: 1003, name: "Angular" },
];

function App() {
  return (
    <ul>
      {list.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 1.2 条件渲染

- 可以通过运算符 && 或三元表达式实现基础的条件渲染；
- 可以通过「自定义函数 + 判断语句」实现条件渲染

```jsx
const flag = true;
const loading = false;

function App() {
  return (
    <>
      {flag && <span>完成</span>}
      {loading ? <span>loading...</span> : <span>加载完成</span>}
    </>
  );
}
```

```jsx
const type = 1;

function getArticleJSX() {
  if (type === 0) {
    return <div>无图模式模版</div>;
  } else if (type === 1) {
    return <div>单图模式模版</div>;
  } else if (type === 3) {
    return <div>三图模式模版</div>;
  }
}

function App() {
  return <>{getArticleJSX()}</>;
}
```

### 1.3 CSS

#### 1）className

```jsx
import "./index.css";

<h1 className="title">Hello World!</h1>;
```

```css
.title {
  font-size: 40px;
}

/* 相当于在style标签添加样式，是全局样式 */
/* <style type="text/css">
  .title {
    font-size: 40px;
  }
</style> */
```

#### 2）行内样式

```jsx
<h1 style={{ fontSize: 20, color: "red" }}>Hello World!</h1>
```

#### 3）classNames 库

[classnames](https://github.com/JedWatson/classnames)

classnames 是一个 JS 库，通过条件动态控制 class 类名，解决了通过字符串拼接动态设置类名不够直观、容易出错的问题。

```jsx
// className = {'foo bar'}
<div className={classNames("foo", { bar: true })}></div>
```

### 1.4 事件绑定

事件绑定通过 `on + 事件名称 = { 事件处理程序 }`，整体上遵循驼峰命名法。

传递给事件处理函数的函数应直接传递，而非调用。如果需要给事件处理函数传参，需要使用回调函数。

```jsx
function App() {
  const clickHandler = (name, e) => {
    console.log("button按钮点击了", name, e);
  };
  return (
    <button onClick={(e) => clickHandler("jack", e)}>click me</button>
    { /* 如果不用传参，可以直接写函数名称 */ }
    { /* <button onClick={clickHandler}>click me</button> */}
  );
}
```

## 2. useState

useState Hook 让你声明一个状态变量，状态变量一旦发生变化，组件的视图 UI 也会跟着变化（数据驱动视图）。

它接收初始状态并返回一对值：当前状态，以及一个让你更新状态的设置函数。

- `State 变量`：用于保存上次渲染的值；
- `State setter 函数`：更新 state 变量并触发 React 重新渲染组件。

```jsx
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
}
```

- 设置 state 会触发重新渲染。
- 当你调用 useState 时，React 会为你提供该次渲染 的一张 state 快照。
- 在 React 中，状态被认为是只读的，应该始终替换它而不是修改它，直接修改状态不能引发视图更新。

### 2.1 更新 state 中的对象

- 把所有存放在 state 中的 JavaScript 对象都视为只读的。
- 对于对象类型的状态变量，应该始终传给 set 方法一个全新的对象来进行修改。

```javascript
const [person, setPerson] = useState({
  firstName: "Barbara",
  lastName: "Hepworth",
});

setPerson({
  ...person, // 复制上一个 person 中的所有字段
  firstName: e.target.value, // 但是覆盖 firstName 字段
});
```

### 2.2 更新 state 中的数组

|          | 避免使用 (会改变原始数组) | 推荐使用 (会返回一个新数组） |
| -------- | ------------------------- | ---------------------------- |
| 添加元素 | push, unshift             | concat, [...arr] 拓展运算符  |
| 删除元素 | pop, shift, splice        | filter, slice                |
| 替换元素 | splice, arr[i] = ...      | map                          |
| 排序     | reverse，sort             | 先将数组复制一份             |

```javascript
let initialCounters = [0, 0, 0];

const nextCounters = counters.map((c, i) => {
  if (i === index) {
    // 递增被点击的计数器数值
    return c + 1;
  } else {
    // 其余部分不发生变化
    return c;
  }
});
setCounters(nextCounters);
```

### 2.3 双向数据绑定

- 将 state 绑定到 input 的 value 属性
- 把 input 最新的 value 值设置给 state

```javascript
const [value, setvalue] = useState("");

<input type="text" value={value} onChange={(e) => setValue(e.target.value)} />;
```
