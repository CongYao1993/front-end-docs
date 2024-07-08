## 1. JS 数据类型及数据类型的判断方式

### 1.1 JS 数据类型

JavaScript 共有 8 种数据类型，分别是 `undefined`、`Boolean`、`Number`、`String`、`Symbol`、`BigInt`、`null`、`Object`。前 7 种类型为基础类型，最后 1 种（Object）为引用类型。

引用数据类型（Object）有几种常见的类型：`Function`、`Array`、`RegExp`、`Date`、`Math`。

- Symbol：每个从 Symbol() 返回的 symbol 值都是唯一的，可以防止对象的属性名冲突。
- BigInt：可以表示任意大的整数，即使这个数已经超出了 Number 能够表示的安全整数范围（2^53 - 1）。

### 1.2 判断数据类型的方式

1. typeof

`typeof 变量名;`

可以识别标准类型（null 除外） ，不能识别具体的对象类型（Function 除外）。

```javascript
typeof undefined; // 'undefined'
typeof null; // 'object'，不能判断null
typeof true; // 'boolean'
typeof 1; // 'number'
typeof "abc"; // 'string'
typeof Symbol(); // 'symbol'
typeof 1n; // 'bigint'

typeof {}; // 'object'
typeof [1, 2]; // 'object'，不能识别具体的对象类型
typeof function () {}; // 'function'，可以识别function
```

2. instanceof

`变量名 instanceof 类型;`

判别内置对象类型、自定义对象类型，不能判别标准类型。给定引用类型的实例则返回 true，检测基本类型值返回 false。

如果该类型在该变量的原型链上，则为 true。

```javascript
function Foo(name) {
  this.name = name;
}
var foo = new Foo("bar");
foo instanceof Foo; // true
foo instanceof Object; // true

/\d/ instanceof RegExp; // true
/\d/ instanceof Object; // true

1 instanceof Number; // false
```

3. `Object.prototype.toString.call()`

toString() 是 Object 的原型方法。

调用该方法返回格式为 "[object Xxx]" 的字符串，其中 Xxx 就是对象的类型，第一个首字母要大写（注意：使用 typeof 返回的是小写）。

对于 Object 对象，直接调用 toString() 就能返回 [object Object]；而对于其他对象，则需要通过 call 来调用，才能返回正确的类型信息。

可以识别标准类型以及内置对象类型（函数、数组、Date、正则表达式等） ，不能识别自定义类型。

```javascript
const x = 10;
Object.prototype.toString.call(x) === "[object Number]"; // true

const arr = [1, 2, 3];
Object.prototype.toString.call(arr) === "[object Array]"; // true
Object.prototype.toString(arr) === "[object Object]"; // true

const reg = /^\d+$/;
Object.prototype.toString.call(reg) === "[object RegExp]"; // true
```

4. `constructor`

对象原型的属性，指向构造器本身。

识别标准类型（undefined、null 除外）、内置对象类型、自定义对象类型。

```javascript
"abc".constructor === String; // true
true.constructor === Boolean; // true
(123).constructor === Number; // true
({}).constructor == Object; // true
[].constructor == Array; // true
new Person("hsg").constructor == Person; // true
```

### 1.3 堆和栈的区别

- 原始数据类型存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据；
- 引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。

JavaScript 引擎需要用栈来维护程序执行期间上下文的状态，如果栈空间大了话，所有的数据都存放在栈空间里面，那么会影响到上下文切换的效率，进而又影响到整个程序的执行效率。

## 2. 浮点数计算问题，0.1 + 0.2 为什么不等于 0.3 ？

浮点数运算的精度问题导致等式左右的结果并不是严格相等，而是相差了个微小的值。

使用 JavaScript 提供的最小精度值判断浮点数是否近似相等：

```javascript
Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON;
```

JavaScript（以及所有现代编程语言）使用的 IEEE-754 浮点表示法是一种`二进制表示法`，只能精确表示如 1/2、1/8、5/8 等分数，无法精确表示哪怕 0.1 这么简单的数。

## 3. 箭头函数和普通函数的区别

- 箭头函数没有函数提升：箭头函数属于匿名函数，要通过赋值语句赋值给变量，这个赋值的过程是在代码执行阶段进行的，不是在声明阶段
- 箭头函数的 this 指向声明时所在的上下文，普通函数的 this 总是指向调用它的对象
- 箭头函数没有原型属性 prototype
- 箭头函数不绑定 arguments，可以用扩展运算符...接收参数
- 箭头函数不能用于构造函数：不能使用 new 命令，也不具有 new.target 和 super
- 不能使用 yield 关键字，因此箭头函数不能用作 Generator 函数
- 不能简单返回对象字面量，如果要直接返回对象时需要用小括号包起来，因为大括号被占用解释为代码块了
