[MDN this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

this 是当前执行上下文（全局/函数/ eval 执行上下文）的一个属性，在定义 this 变量时不知道它真正的值，运行时才能确定 this 值。

## 1. 全局执行上下文的 this

无论是否在严格模式下，在全局执行上下文中，this 都指向全局对象，在浏览器中就是 window 对象。

```javascript
"use strict";

console.log(this === window); // true

this.a = 3;
console.log(window.a); // 3
console.log(a); // 3
```

## 2. 函数执行上下文的 this

在函数内部，this 的值取决于函数被调用的方式。

### 2.1 函数被全局调用时

函数被全局调用时：

- 非严格模式下，this 值默认指向全局对象，浏览器中全局对象为 window
- 严格模式下，this 为 undefined

```javascript
window.color = "red";

function sayColor() {
  console.log(this); // window 对象
  console.log(this.color); // "red"
}

sayColor();
```

```javascript
window.color = "red";

function sayColor() {
  "use strict";
  console.log(this); // undefined
  console.log(this.color); // 报错
}

sayColor();
```

### 2.2 函数作为对象里的方法被调用时

函数作为对象里的方法被调用时，this 被设置为调用该函数的对象。

```javascript
window.color = "red";
var obj = { color: "blue" };

function sayColor() {
  "use strict";
  console.log(this); // obj 对象
  console.log(this.color); // "blue"
}

obj.sayColor = sayColor;
obj.sayColor();
```

### 2.3 当函数作为构造函数

当函数作为构造函数，使用 new 关键字调用时，this 被绑定到构造的新对象上。

```javascript
function f() {
  this.a = 3;
}

var obj = new f();
console.log(obj.a); // 3
```

### 2.4 当函数被用作 DOM 事件处理函数

当函数被用作 DOM 事件处理函数时，this 指向当前监听事件的 DOM 元素 e.currentTarget。

```javascript
document.getElementById("btn").addEventListener("click", click);
function click(e) {
  console.log(this === e.currentTarget); // 总是 true
  console.log(this === e.target); // 当 currentTarget 和 target 是同一个对象时为 true
  this.style.backgroundColor = "#A5D9F3";
}
```

## 3. 箭头函数的 this

箭头函数的 this 是`声明时所在的执行上下文`的 this。在函数中 this 指向外层第一个普通函数的 this，在全局代码中 this 被设置为全局对象。

箭头函数没有 prototype 原型，所以箭头函数本身没有 this，当然也就不能用 call()、apply()、bind()这些方法去改变 this 的指向。

全局调用

```javascript
var foo = () => this;
console.log(foo() === window); // true
```

作为对象的方法调用

```javascript
var obj1 = { foo: () => this };
console.log(obj1.foo() === window); // true

var obj2 = {
  bar: function () {
    return () => this;
  },
};

var fn1 = obj2.bar();
console.log(fn1() === obj2); // true

var fn2 = obj2.bar;
console.log(fn2()() == window); // true
```

外部函数作为构造函数调用

```javascript
var m = 11;

function fn2() {
  this.m = 22;
  let b = () => {
    console.log(this.m);
  };
  b();
}

new fn2(); // 22
fn2(); // 22
```

```javascript
var m = 11;

function fn2() {
  let m = 33;
  let b = () => {
    console.log(this.m);
  };
  b();
}

fn2(); // 11
```

## 4. setTimeout 的 this

如果 setTimeout 的回调函数是某个对象的方法，那么该方法中的 this 关键字将指向全局环境，而不是定义时所在的那个对象。

```javascript
var name = 1;
var obj = {
  name: 2,
  showName: function () {
    console.log(this.name);
  },
};

setTimeout(obj.showName, 0); // 1
// 相当于
// var f=MyObj.showName
// f()

obj.showName(); // 2
```

如何解决这个问题？
第一种是将 obj.showName 放在匿名函数中执行。

```javascript
setTimeout(function () {
  obj.showName(); // 2
}, 0);
```

第二种是使用 bind 方法，将 showName 绑定在 MyObj 上面。

```javascript
setTimeout(obj.showName.bind(obj), 0);
```

## 5. 手写 call 和 apply

`Function.prototype.call()` 和 `Function.prototype.apply()` 方法都是以给定的 this 值和参数调用该函数，区别仅在于接收参数的方式不同。

- 第一个参数均是调用指定函数时的 this 值，如果函数不处于严格模式，则 null 和 undefined 会被替换为全局对象，原始值会被转换为对象。
- 对于 call() 方法，其余参数直接作为函数的参数；
- 对于 apply() 方法，第二个参数是数组（或类数组对象），作为函数的参数。

call() 和 apply() 的应用示例：

```javascript
var a = 1;
var b = 2;

var obj = { a: 3, b: 4 };

function add(c, d) {
  return this.a + this.b + c + d;
}

console.log(add.apply(this, [1, 2])); // 6

console.log(add.call(obj, 1, 2)); // 10
```

手写 call() 和 apply()，只是获取函数实参的方式不同

- 手写 call：const realArgs = args.slice(1);
- 手写 apply：const realArgs = args[1] || [];

```javascript
Function.prototype.myCall = function (...args) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new Error("Must call with a function");
  }

  // 判断传入上下文对象是否存在，如果不存在，则设置为 window
  const realThis = args[0] || window;

  // 处理传入的参数，截取第一个参数后的所有参数
  const realArgs = args.slice(1);
  // 手写 apply：const realArgs = args[1] || [];

  // 将函数作为上下文对象的一个属性
  const funcSymbol = Symbol("func");
  realThis[funcSymbol] = this; // this为函数本身

  // 使用上下文对象来调用这个方法，并保存返回结果
  let res = realThis[funcSymbol](...realArgs);

  // 删除新增的函数属性
  delete realThis[funcSymbol];

  return res;
};
```

## 6. 手写 bind

bind() 方法会返回一个新的函数。

- 第一个参数是为新函数指定的 this 值；
- 其余参数将作为新函数的参数，会插入到调用新函数时传入的参数的前面。

bind() 返回的函数也可以使用 new 运算符构造，提供的 this 值会被忽略，但前置参数仍会提供给模拟函数。

```javascript
color = "red";
var o = { color: "blue" };

function sayColor() {
  console.log(this.color);
}

var bindSayColor = sayColor.bind(o);
bindSayColor(); // blue
```

```javascript
function fn(a, b, c) {
  return a + b + c;
}

var _fn = fn.bind(null, 10);
var ans = _fn(20, 30); // 60
```

手写 bind()

```javascript
Function.prototype.myBind = function (...args) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new Error("Must call with a function");
  }

  // 判断传入上下文对象是否存在，如果不存在，则设置为 window
  const realThis = args[0] || window;

  // 处理传入的参数，截取第一个参数后的所有参数
  const realArgs = args.slice(1);

  // 调用 bind 的函数本身
  const _this = this;

  return function Fn() {
    // new Fn() 返回的对象 obj.__proto__ === Fn.prototype，obj 即是 this
    // 因此 this instanceof Fn 为 true 表示是 new Fn()
    return _this.apply(
      // new 调用 bind 返回的函数时，忽略 bind 提供的 this
      this instanceof Fn ? this : realThis,
      realArgs.concat(...arguments)
    );
  };
};
```
