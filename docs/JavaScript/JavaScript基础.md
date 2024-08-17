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

### 1.3 如何判断一个数据是否是数组类型

`value instanceof Array`

- 对于一个网页，或者一个全局作用域而言，使用 instanceof 操作符就能得到满意的结果。
- 如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的 Array 构造函数。如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数，instanceof 就失效了。

`Array.isArray(value)`

- Array.isArray()方法，这个方法的目的是最终确定某个值到底是不是数组，而不管它是在哪个全局执行环境中创建的。

```javascript
// ES5 之前不支持此方法，做好兼容
if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}
```

### 1.4 堆和栈的区别

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

## 4. for...of 与 for...in 的区别

for...in 和 for...of 语句都用于迭代某个内容，它们之间的主要区别在于迭代的对象。

### 4.1 for...of

`for...of` 循环按顺序逐个处理从`可迭代对象`获取的值。

可迭代对象包括内置对象的实例，例如 Array、String、TypedArray、Map、Set、NodeList（以及其他 DOM 集合），还包括 arguments 对象、由生成器函数生成的生成器，以及用户定义的可迭代对象。

1. 首先调用可迭代对象的 `[Symbol.iterator]()` 方法，该方法返回一个迭代器；
2. 然后重复调用生成器的 `next()` 方法，以生成要分配给 variable 的值的序列；
3. 在迭代器完成时退出 for...of 循环（即迭代器的 next() 方法返回一个包含 `done: true` 的对象）。

```javascript
const arr = [1, 2, 3];
const it = arr[Symbol.iterator]();
it.next(); // {value: 1, done: false}
it.next(); // {value: 2, done: false}
it.next(); // {value: 3, done: false}
it.next(); // {value: undefined, done: true}
```

### 4.2 for...in

`for...in` 语句用于迭代`对象的可枚举字符串属性`，包括继承的可枚举属性，不包括 Symbol 属性。

遍历的顺序是一致且可预测的。在原型链的每个组件中，所有非负整数键（可以作为数组索引）将首先按值升序遍历，然后是其他字符串键按属性创建的先后顺序升序遍历。

1. 首先获取当前对象的所有自有的字符串键，其方式与 Object.getOwnPropertyNames() 非常相似。
2. 对于每一个键，如果没有访问过具有相同值的字符串，则获取属性描述符并只访问可枚举的属性。但是，即使该属性不可枚举，也会标记为已访问。
3. 然后，当前对象被替换为其原型，并重复上述过程。

### 4.3 获取对象本身的属性

如果只想迭代对象本身的属性，而不是它的原型，可以使用以下技术之一：

- `Object.keys()`：返回一个包含所有可枚举的自有字符串属性的数组。
- `Object.getOwnPropertyNames()`：包含所有属性，包括不可枚举的。

判断某个属性是不是对象自身的属性？

`Object.hasOwn()`：如果指定的对象自身有指定的属性，返回 true。如果属性是继承的或者不存在，返回 false。

建议使用此方法替代 `Object.prototype.hasOwnProperty()`，因为它适用于使用 Object.create(null) 创建的对象，以及重写了继承的 hasOwnProperty() 方法的对象。
