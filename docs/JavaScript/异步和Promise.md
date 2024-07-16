## 1. Promise 定义

```javascript
// 创建 Promise 实例
const promise = new Promise(function(resolve, reject) {
  // 立即执行代码

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

  // 指定 resolved 状态和 rejected 状态的回调函数
promise.then(function(value) {
  // resolved
}, function(error) {
  // rejected
});
```

Promise 是异步编程的一种解决方案。

- Promise 是一个类，类中包含一个会立即执行的`执行器`。
- Promise 对象有三种状态：`pending（进行中）`、`fulfilled（已成功）`和 `rejected（已失败）`。
- 初始时 Promise 是 pending 状态，使用 resolve 和 reject 两个函数来更改状态。
  - 如果调用 resolve 函数，返回成功的信息，绑定在成功事件上的回调（比如 then 函数的第一个函数）会得到这个消息，加入微任务队列。
  - 如果发生了错误，执行 reject 函数传递错误信息，将执行失败的回调函数加入微任务队列。
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。
  - Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected。

优点：

- Promise 对象将异步操作以同步操作的流程表达出来，将原本层层嵌套的回调函数，转化成“对象.then().then()...”的链式调用结构。
- 通过 Promise 重新获得了程序的控制权，而不是给第三方传递回调转移控制权。如果没有 Promise，必须谨慎编写涉及到异步的第三方库代码，必须自己解决状态跟踪，以及保证第三方库不会出问题。

缺点：

- 无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
- 当处于 pending 状态时，无法得知什么时候变为下一个状态。
- 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。

## 2. 手写 Promise

[Promises/A+ 规范](https://promisesaplus.com/) [翻译](https://www.ituring.com.cn/article/66566)

[手写一个 Promise/A+,完美通过官方 872 个测试用例](https://juejin.cn/post/6844904116913700877)

```javascript
// Promise状态
var PENDING = "pending";
var FULFILLED = "fulfilled";
var REJECTED = "rejected";

function MyPromise(fn) {
  this.status = PENDING; // 初始状态
  this.value = null; // resolve 的参数
  this.reason = null; // reject 的参数

  this.onFulfilledCbs = []; // 存储成功的回调
  this.onRejectedCds = []; // 存储失败的回调

  try {
    // 立即执行传进来的函数，将resolve和reject作为参数
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }

  var _this = this;

  function resolve(value) {
    if (_this.status === PENDING) {
      _this.status = FULFILLED;
      _this.value = value;
      _this.onFulfilledCbs.forEach((callback) => {
        // 执行所有成功的回调
        callback(_this.value);
      });
    }
  }

  function reject(reason) {
    if (_this.status === PENDING) {
      _this.status = REJECTED;
      _this.reason = reason;
      _this.onRejectedCds.forEach((callback) => {
        // 执行所有失败的回调
        callback(_this.reason);
      });
    }
  }
}
```

ToDo

```javascript
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 如果onFulfilled不是函数，给一个默认函数，返回value
  var realOnFulfilled = onFulfilled;
  if (typeof realOnFulfilled !== "function") {
    realOnFulfilled = function (value) {
      return value;
    };
  }

  // 如果onRejected不是函数，给一个默认函数，返回reason的Error
  var realOnRejected = onRejected;
  if (typeof realOnRejected !== "function") {
    realOnRejected = function (reason) {
      throw reason;
    };
  }

  if (this.status === FULFILLED) {
    onFulfilled(this.value);
  }

  if (this.status === REJECTED) {
    onRejected(this.reason);
  }

  if (this.status === PENDING) {
    this.onFulfilledCbs.push(onFulfilled);
    this.onRejectedCds.push(onRejected);
  }
};
```

```javascript
MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
```

## 3. Promise API

### 3.1 Promise.resolve() 和 Promise.reject()

Promise.resolve() 将现有对象转为 Promise 对象。

- 如果参数是 Promise 实例，那么 Promise.resolve 将不做任何修改、原封不动地返回这个实例。
- 如果参数是一个原始值，或者是一个不具有 then()方法的对象，则 Promise.resolve()方法返回一个新的 Promise 对象，状态为 resolved。

```javascript
Promise.resolve = function (val) {
  if (val instanceof Promise) {
    return val;
  }

  return new Promise(function (resolve) {
    resolve(val);
  });
};
```

```javascript
Promise.reject = function (reason) {
  return new Promise(function (resolve, reject) {
    reject(reason);
  });
};
```

### 3.2 Promise.all()

```javascript
const p = Promise.all([p1, p2, p3]);
```

Promise.all() 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

- 只有所有 Promise 的状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时每个 Promise 返回值组成一个数组，传递给 p 的回调函数。
- 只要其中一个 Promise 被 rejected，p 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给 p 的回调函数。

应用场景：
假设某个模块的界面需要同时调用 3 个服务端接口，并保证三个接口数据全部返回后，才能渲染页面。借助 Promise.all() 来实现同时调用接口。

```javascript
Promise.all = function (promiseList) {
  return new Promise(function (resolve, reject) {
    var count = 0;
    var result = [];
    var len = promiseList.length;

    if (len === 0) {
      return resolve(result);
    }

    promiseList.forEach(function (promise, index) {
      Promise.resolve(promise).then(
        function (value) {
          count++;
          result[index] = value;
          if (count === len) {
            resolve(result);
          }
        },
        function (reason) {
          reject(reason);
        }
      );
    });
  });
};
```

### 3.3 Promise.race()

Promise.race() 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

- 只要其中一个 Promise 率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值（无论 resolve 还是 reject），就传递给 p 的回调函数。

```javascript
Promise.race = function (promiseList) {
  var resolvedFlag = false;

  return new Promise(function (resolve, reject) {
    var len = promiseList.length;

    if (len === 0) {
      return resolve();
    }

    for (var i = 0; i < len; i++) {
      Promise.resolve(promiseList[i]).then(
        function (value) {
          if (!resolvedFlag) {
            resolvedFlag = true;
            return resolve(value);
          }
        },
        function (reason) {
          return reject(reason);
        }
      );
    }
  });
};
```

### 3.4 Promise.allSettled()

Promise.allSettled() 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

- 只有等到参数数组的所有 Promise 对象都发生状态变更（不管是 fulfilled 还是 rejected），返回的 Promise 对象才会发生状态变更。

```javascript
Promise.allSettled = function (promiseList) {
  return new Promise(function (resolve) {
    var len = promiseList.length;
    var result = [];
    var count = 0;

    if (len === 0) {
      return resolve(result);
    }

    promiseList.forEach(function (promise, index) {
      Promise.resolve(promise).then(
        function (value) {
          count++;
          result[i] = {
            status: "fulfilled",
            value: value,
          };
          if (count === len) {
            return resolve(result);
          }
        },
        function (reason) {
          count++;
          result[i] = {
            status: "rejected",
            reason: reason,
          };
          if (count === len) {
            return resolve(result);
          }
        }
      );
    });
  });
};
```

### 3.5 Promise.any()

Promise.any() 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

- 只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态；如果所有参数实例都变成 rejected 状态，包装实例就会变成 rejected 状态。

## 4. 手写题

### 4.1 手写请求重试 retry
