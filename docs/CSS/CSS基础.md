## 1. 盒模型

盒模型包括内容区域、padding 内边距、border 边框、margin 外边距。

![image.png](./images/box-model.png)

- `box-sizing: content-box`：是默认值，设置 width 和 height 指设置内容区域的大小。
- `box-sizing: border-box`：设置 width 和 height 指设置 content + padding + border 的大小。

## 2. 伪类和伪元素

伪类是选择器的一种，用于选择处于特定状态的元素，为其添加样式，比如某类型的第一个元素，或当鼠标指针悬浮在元素上面时。

<img src="./images/pseudo-classes.png" width="50%" />

伪元素用于创建一些不在文档树中的元素，并为其添加样式。

<img src="./images/pseudo-elements.png" width="50%" />

## 3. display / visibility / opacity 的区别

|            | display                       | visibility                      | opacity                                     |
| ---------- | ----------------------------- | ------------------------------- | ------------------------------------------- |
| 页面中     | 创建 DOM 时，该元素不会被创建 | 隐藏元素，但是不改变文档布局    | 设置透明度为 0                              |
| 子元素     | 不可显示                      | 可设置可见`visibility: visible` | 不可显示                                    |
| 绑定的事件 | 不能触发                      | 不能触发                        | 可触发                                      |
| 回流       | 会                            | 不会                            | 不会                                        |
| 重绘       | 会                            | 会                              | 不一定，如果利用 animation 修改，只触发合成 |
| transition | 不支持                        | 支持                            | 支持                                        |

## 4. position 的相对定位

- **relative**：相对于其**正常位置**进行定位，但不影响周围元素的位置。

- **absolute**：相对于**最近的非 static 定位的祖先元素**进行定位。

- **fixed**：相对于**浏览器视窗**或者带有 transform、perspective、filter 或 backdrop-filter 属性非 none 的祖先元素进行定位。

- **sticky**：相对于**最近滚动祖先**进行定位。
  - 粘性布局，初始情况下表现为 relative，在正常文档流中；页面滚动到目标位置时，表现为 fixed。
  - 父元素不产生滚动时，粘性布局会失效。

## 5. flex 布局

flex 布局是一种弹性盒子布局。在弹性容器中，子元素可以在水平或垂直方向上排布，也可以“弹性伸缩”其尺寸。

flex 容器设置：

- `flex-direction: row|row-reverse|column|column-reverse`：设置主轴的方向
- `flex-wrap: nowrap|wrap|wrap-reverse`：如果子元素太大，是否换行
- `flex-flow`：flex-direction 和 flex-wrap 的缩写
- 元素间的对齐和空间分配：
  - `order`：flex 子元素在布局时的顺序，默认是 0。order 是相对值，不是绝对位置。
  - `justify-content`：设置主轴方向上元素之间的对齐方式
  - `align-items`：设置辅轴方向上元素之间的对齐方式
  - `align-content`：对于多行元素，设置辅轴方向上行之间的对齐方式

flex 元素上的属性：

- `flex-basis`：设置元素在主轴上的初始宽/高，默认为元素内容宽度
- `flex-grow`：先按照设置的宽度分配空间，如果有多余空间，将多余空间按比例分配给设置 flex-grow 的元素
- `flex-shrink`：按比例分配超出的负的剩余空间。默认值是 1，超出会平均分配。如果均设为 0，则不分配，超出。
- `flex`：flex-grow、flex-shrink、flex-basis 的缩写，默认值 0 1 auto。`flex: 1` 是 `flex: 1 1 auto;` 的缩写。
- `align-self`：设置单个元素在辅轴上的对齐方式。

## 6. BFC

块格式化上下文（Block Formatting Context，BFC）是页面中的一块渲染区域，有一套渲染规则，决定了子元素如何布局，以及和其他元素的关系和相互作⽤。

创建 BFC：

- 根元素：`<html>`；
- 浮动元素：float 不是 none；
- 定位元素：position 为 absolute 或 fixed；
- display 值为：inline-block、flex、inline-flex、grid、table-cell、table-caption 等；
- overflow 值为：hidden、auto、scroll，不为 visible。

BFC 的特点：

- BFC 是独立的容器，容器内部元素不会影响外部元素；
- 内部元素在垂直方向上，自上而下排列，和文档流的排列方式一致；
- 内部相邻元素的 margin 会重叠；
- 计算 BFC 的高度时，浮动子元素也参与计算
- BFC 区域不会与外部浮动的容器发生重叠

BFC 的应用：

1. 清除浮动，解决高度塌陷的问题

```html
<div style="border: 1px solid #000; overflow: hidden;">
  <div
    style="width: 100px; height: 100px; background: grey; float: left;"
  ></div>
</div>
```

![image.png](./images/BFC-1.png)

2. 解决元素被浮动元素覆盖；创建左边固定、右边自适应布局

```html
<div style="height: 100px; width: 100px; float: left; background: lightblue;">
  我是一个左浮动的元素
</div>
<div style="width: 200px; height: 200px; background: grey; overflow: hidden;">
  我是一个没有设置浮动, 也没有触发 BFC 元素, width: 200px; height:200px;
  background: grey;
</div>
```

![image.png](./images/BFC-2.png)

3. 阻止外边距塌陷

```html
<div class="blue"></div>
<div class="red-outer">
  <div class="red-inner"></div>
</div>
```

```css
.blue,
.red-inner {
  height: 50px;
  margin: 10px 0;
}
.blue {
  background: lightblue;
}
.red-inner {
  background: red;
}
.red-outer {
  overflow: hidden;
}
```

![image.png](./images/BFC-3.png)
