## 1. interface 与 type

- interface（接口）：用于定义对象的形状，描述对象应该具有的属性及其类型。
- type (类型别名)：给类型起一个新名字。可以定义一个集合，可以包含各种类型的属性和值，以用来描述对象、函数、联合类型、交叉类型等。

有的团队规范约定：用 interface 定义一个对象类型，用 type 组合不同类型。

相同点：

### 1.1 都可以定义一个对象或一个函数

```javascript
interface Person {
  name: string;
  age: number;
}

type Person = {
  name: string,
  age: number,
};

// 测试
const person: Person = {
  name: "lin",
  age: 18,
};
```

```javascript
interface addType {
  (num1: number, num2: number): number;
}

type addType = (num1: number, num2: number) => number;

// 测试
const add: addType = (num1, num2) => {
  return num1 + num2;
};
```

### 1.2 都允许继承

interface 使用 extends 实现继承， type 使用交叉类型实现继承。

```javascript
// 1. interface 的继承
interface Person {
  name: string;
}
interface Student extends Person {
  grade: number;
}

// 2. type 的继承
type Person = {
  name: string,
};

type Student = Person & { grade: number }; // 用交叉类型

// 3. interface 继承 type
type Person = {
  name: string,
};

interface Student extends Person {
  grade: number;
}

// 4. type 继承 interface

interface Person {
  name: string;
}

type Student = Person & { grade: number };

// 测试
const person: Student = {
  name: "lin",
  grade: 100,
};
```

不同点：

### 1.3 interface 可以合并重复声明，type 重复声明会报错

```javascript
// 1. interface 可以合并重复声明
interface Person {
  name: string;
}

interface Person {
  age: number;
}

const person: Person = {
  name: "lin",
  age: 18,
};

// 2. type 重复声明会报错
type Person = {
  name: string,
};

// Duplicate identifier 'Person'
type Person = {
  age: number,
};
```

### 1.4 type 可以声明基本类型、联合类型、交叉类型、元组，interface 不可以

```javascript
type Name = string; // 基本类型

type arrItem = number | string; // 联合类型

type Person = {
  name: Name,
};

type Student = Person & { grade: number }; // 交叉类型

type Teacher = Person & { major: string };

type StudentAndTeacherList = [Student, Teacher]; // 元组类型

const list: StudentAndTeacherList = [
  { name: "lin", grade: 100 },
  { name: "liu", major: "Chinese" },
];
```

## 2. any 和 unknown 的区别

any 用来表示允许赋值为任意类型，表示不再对某个值进行类型检查。

- 可以访问任意属性和方法。
- 会污染其他变量。它可以赋值给其他任何类型的变量，导致其它变量丢失类型检查。
- 变量如果在声明的时候，未指定其类型，那么它会被识别为 any 类型。
- 对于开发者没有指定类型、TS 会自己推断类型，如果无法推断出类型，就会认为该变量的类型是 any。

unknown 表示类型不确定，可能是任意类型，但是它的使用有一些限制，可以视为严格版的 any。

- 不能直接调用 unknown 类型变量的方法和属性，需要经过类型缩小才能使用。
- unknown 类型的变量，不能直接赋值给其他类型的变量（除了 any 类型和 unknown 类型）。

## 3. never 和 void 的区别

never 表示该类型为空，永远不存在的值。

- 不可能赋给它任何值，否则都会报错。 即使 any 也不可以赋值给 never。
- 一个函数因为报错或者死循环等原因，一直执行不到最后，此时函数返回值是 never。
- 如果一个变量为联合类型，通常需要处理每一种类型。这时，处理所有可能的类型之后，剩余的情况就属于 never 类型。

```javascript
function fail(msg: string): never {
  throw new Error(msg);
}

function fn(x: string | number) {
  if (typeof x === "string") {
    // ...
  } else if (typeof x === "number") {
    // ...
  } else {
    x; // never 类型
  }
}
```

void 类型表示没有任何类型。

- 没有返回值的函数，其返回值类型为 void。
- void 类型的变量，只能赋予 undefined。

## 4. 泛型及其应用场景

泛型为类型提供变量。

- 泛型函数：通常会编写一个函数，其中输入的类型与输出的类型相关，或者两个输入的类型以某种方式相关。
- 在 interface 或 type 上使用泛型
- 数组泛型

```javascript
// 恒等函数
function identity<Type>(arg: Type): Type {
  return arg;
}
let myIdentity: <Type>(arg: Type) => Type = identity;
let myIdentity: { <Type>(arg: Type): Type } = identity;

// 泛型接口
```

## 5. keyof 和 typeof 类型运算符

keyof 运算符采用对象类型并生成其键的字符串或数字字面联合。

```javascript
type Point = { x: number; y: number };
type P = keyof Point;
// 等同于 type P = "x" | "y"
```

typeof 运算符，获取变量或属性的类型。

```javascript
let s = "hello";
let n: typeof s;

function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
// 等同于 type P = { x: number; y: number;}
```

## 6. 工具类型

[TypeScript 官网-工具类型](https://ts.nodejs.cn/docs/handbook/utility-types.html)

从一个类型构造新类型：

- `Partial<Type>`：构造一个将 Type 的所有属性设置为可选的类型。
  - 应用：更新部分属性值
- `Required<Type>`：构造一个将 Type 的所有属性设置为 required 的类型。与 Partial 相反。
- `Readonly<Type>`：构造一个将 Type 的所有属性设置为 readonly 的类型。只是浅层不可修改。
- `Record<Keys, Type>`：构造一个对象类型，其属性键为 Keys，其属性值为 Type。
- `Pick<Type, Keys>`：从 Type 中选取一组属性 Keys 来构造一个类型。如果选择的属性值不存在，会报错。
- `Omit<Type, Keys>`：从 Type 中选择所有属性然后删除 Keys 来构造一个类型。与 Pick 相反。
  - Pick / Omit 的 Keys 必须是字符串或字符串的并集。
- `Exclude<UnionType, ExcludedMembers>`：通过从 UnionType 中排除所有可分配给 ExcludedMembers 的联合成员来构造一个类型。
- `Extract<Type, Union>`：通过从 Type 中提取所有可分配给 Union 的联合成员来构造一个类型。
  - Exclude / Extract 的第二个参数很灵活，可以是描述成员特征的任意类型。
- `NonNullable<Type>`：。通过从 Type 中排除 null 和 undefined 来构造一个类型。

从函数构造类型：

- `Parameters<Type>`：从函数的参数构造元组类型。
- `ConstructorParameters<Type>`：从构造函数的参数构造元组或数组类型。
- `ReturnType<Type>`：构造一个由函数的返回类型组成的类型。
- `InstanceType<Type>`：构造一个由构造函数的实例类型组成的类型。
