webpack 是一个 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会从一个或多个入口构建一个依赖图，将项目中所需的每一个模块编译组合成一个或多个 bundles 输出。

webpack 的作用：

- 编译浏览器不支持的语法：例如：ES6 等 JS 新语法、Less/Sass 等 CSS 预处理器、JSX 等
- 兼容性处理：CSS 前缀补全
- 压缩代码、图片等资源

```shell
mkdir webpack-demo
cd webpack-demo
npm init -y
npm install webpack webpack-cli --save-dev
```

## 1. webpack 配置项

webpack 默认配置文件为根目录下的 `webpack.config.js`，可以通过 `webpack --config` 指定配置文件。

`webpack.config.js`导出一些配置项，比如 entry、output、module、plugins 等

### 1.1 入口 entry

入口指定 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。

默认值是 `./src/index.js`，可以通过配置 `entry` 属性，来指定一个（或多个）不同的入口起点。

```javascript
module.exports = {
  entry: "./path/to/my/entry/file.js",
};
```

### 1.2 输出 output

输出告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。

主要输出文件的默认值是 `./dist/main.js`，其它生成文件默认放置在 `./dist` 文件夹中。

```javascript
const path = require("path");

module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // 输出文件的文件名
    clean: true, // 自动将上次打包目录资源清空，webpack5.20.0+
  },
};
```

### 1.3 loader 和内置的 Asset Modules

webpack 默认只支持 JavaScript 和 json 两种文件类型，通过 loader 或内置的 Asset Modules 支持其它类型的文件，把它们转化成有效的模块，添加到依赖图中。

加载 CSS：

- `style-loader`: 动态创建一个 `<style>` 标签，将 CSS 添加到 `<style>` 标签里
- `css-loader`: 允许将 CSS 文件通过 require 的方式引入，并返回 CSS 代码，支持 .css 文件的加载和解析
- `less-loader`: 将 less 转换为 CSS
- `sass-loader`: 将 sass 转换为 CSS
- `postcss-loader`: 用 postcss 来处理 CSS

加载图像和字体等资源：

- `file-loader`: 分发文件到 output 目录并返回相对路径，进行图片、字体等的打包
- `url-loader`: 和 file-loader 类似，但是当文件小于设定的 limit 时可以返回一个 Data Url

处理 JS：

- `babel-loader`: 转换 ES6 等 JS 新特性语法
- `ts-loader`: 将 TS 转换为 JS
- `raw-loader`: 将文件以字符串的形式导入
- `thread-loader`: 多进程打包 JS 和 CSS

#### OneOf

打包时每个文件都会经过所有 loader 处理，每个正则都要匹配一次。比较慢。

使用 OneOf 时，只要匹配上一个 loader, 剩下的就不匹配了。

```javascript
module.exports = {
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用来匹配 .css 结尾的文件
            test: /\.css$/,
            // use 数组里面 Loader 执行顺序是从右到左
            use: ["style-loader", "css-loader"],
          },
        ],
      },
    ],
  },
};
```

### 1.4 plugins

plugins 用于打包输出的 JS 文件的优化、资源管理和环境变量的注入，作用于整个构建过程。

- `html-webpack-plugin`：创建 html 文件去承载输出的 bundle
- `mini-css-extract-plugin`：将 CSS 从 bunlde 文件里提取成一个独立的 .css 文件
- `css-minimizer-webpack-plugin`：压缩 CSS

```javascript
module.exports = {
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
};
```

### 1.5 mode

mode 用来指定当前的构建环境是：`production`、`development` 还是 `none`。

设置 mode 参数，可以启用 webpack 内置在相应环境下的优化。

```javascript
module.exports = {
  mode: "production",
};
```

## 2. 处理 HTML

### 2.1 html-webpack-plugin

该插件将为你生成一个 HTML 文件或者以指定的 HTML 文件为模版，在 body 中使用 script 标签引入你所有 webpack 生成的 bundle。

```shell
npm install --save-dev html-webpack-plugin
```

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack App",
      // 以 public/index.html 为模板创建文件
      // 新的 html 文件有两个特点：内容和源文件一致；自动引入打包生成的 js 等资源
      template: path.resolve(__dirname, "public/index.html"),
      // mode: 'developmemt' 默认为true
      minify: true,
    }),
  ],
};
```

### 2.2 HTML 文件压缩

`mode: 'developmemt'`默认开启了 html 压缩。

## 3. 处理 CSS

```javascript
// 分离 CSS 文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩 CSS
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  //   [
                  //     "autoprefixer",
                  //     {
                  //       browsers: ["last 2 version", "> 1%", "not dead"],
                  //     },
                  //   ],
                  "postcss-preset-env", // 能解决大多数样式兼容性问题
                ],
              },
            },
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      // 仅在生产环境生效
      // 在 webpack@5 中，可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`）
      `...`,
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "static/css/main.css",
    }),
  ],
};
```

### 3.1 CSS Loader

- `style-loader`: 动态创建一个 `<style>` 标签，将 CSS 添加到 `<style>` 标签里
- `css-loader`: 对@import 和 url() 进行处理，就像 js 解析 import/require() 一样。
- `less-loader`: 将 less 转换为 CSS
- `sass-loader`: 将 sass 转换为 CSS
- `postcss-loader`: 用 postcss 来处理 CSS

loader 可以链式调用，逆序执行，前一个 loader 将其转换结果传递给下一个 loader，依此类推，最后的 loader 返回 JavaScript。

```shell
npm install --save-dev style-loader css-loader less-loader
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        // 处理顺序是从右往左
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
};
```

### 3.2 分离 CSS 文件

CSS 文件目前被打包到 js 文件中，当 js 文件加载时，会创建一个 style 标签来生成样式。会出现闪屏现象，用户体验不好。

应该将 CSS 提取为单独的 CSS 文件，通过 link 标签加载。

```shell
npm install --save-dev mini-css-extract-plugin
```

### 3.3 压缩 CSS

该插件使用 cssnano 优化和压缩 CSS。

```shell
npm install --save-dev css-minimizer-webpack-plugin
```

### 3.4 自动补齐 CSS 前缀

postcss 是一款使用 JS 插件转换样式的工具。这些插件可以对 CSS 进行 lint 处理，支持变量和混合，转换未来的 CSS 语法、内联图像等。

- `autoprefixer`：使用 Can I Use 补齐 CSS 前缀。
- `postcss-preset-env`：允许你使用最新的 CSS 特性，根据目标浏览器或配置，将现代 CSS 转换为兼容性更强的 CSS，自动添加所需的前缀。

postcss-preset-env 包括 autoprefixer，browsers 选项将自动传递给它。

```shell
npm install --save-dev postcss-loader postcss postcss-preset-env
```

所有浏览器都已支持不带浏览器引擎前缀的过渡。

### 3.5 px 自动转换 rem

CSS 媒体查询实现响应式布局时，需要写多套适配样式代码。

`px2rem-loader`：根据设计稿编写代码时，可以按照 px 单位写。编写完成后，使用 px2rem-loader，将 px 转换成 rem。

## 4. 加载图像、字体等资源

- `type: "asset/resource"` 或 `file-loader`, 将文件转化成 webpack 能识别的资源，其他不做处理
- `type: "asset"` 或 `url-loader`, 将文件转化成 webpack 能识别的资源，同时可以设置较小资源自动转化为 base64

如果设置较小资源自动转化为 base64：

- 优点：减少请求数量
- 缺点：体积变得更大

```shell
npm install --save-dev file-loader
```

```javascript
// webpack 5
rules: [
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: "asset",
    parser: {
      dataUrlCondition: {
        maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
      },
    },
    generator: {
      // 将图片文件输出到 static/imgs 目录中
      // 将图片文件命名 [hash:8][ext][query]
      // [hash:8]: hash值取8位
      // [ext]: 使用之前的文件扩展名
      // [query]: 添加之前的query参数
      filename: "static/imgs/[hash:8][ext][query]",
    },
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: "asset/resource",
  },
];

// webpack 4
rules: [
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: ["file-loader"],
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: ["file-loader"],
  },
];
```

## 5. 处理 JS

### 5.1 babel-loader

babel-loader 是 JavaScript 编译器，主要用于将 ES6 语法代码转换为向后兼容的 JavaScript 语法，以便能够运行在旧版本浏览器中。

```shell
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

#### Babel 配置文件

配置文件由很多种写法：

- `babel.config.js` 或 `babel.config.json`：新建文件，位于项目根目录
- `.babelrc`、`.babelrc.js` 或 `.babelrc.json`：新建文件，位于项目根目录
- `package.json` 中 `babel` 选项：不需要创建文件

Babel 会查找和自动读取它们，所以以上配置文件只需要存在一个即可。

```javascript
// babel.config.js
module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [],
};
```

presets 预设，就是一组 Babel 插件, 扩展 Babel 功能。

- `@babel/preset-env`：一个智能预设，允许您使用最新的 JavaScript。
- `@babel/preset-react`：一个用来编译 React jsx 语法的预设
- `@babel/preset-typescript`：一个用来编译 TypeScript 语法的预设

#### babel-loader

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules代码不编译
        // include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",
      },
    ],
  },
};
```

- `include` 包含：只处理 xxx 文件
- `exclude` 排除：除了 xxx 文件以外其他文件都处理

第三方的库或插件下载到 node_modules 中，这些文件是不需要编译可以直接使用的。所以对 js 文件处理时，要排除 node_modules 下面的文件，提高构建速度。

### 5.2 JS 压缩

`mode: 'developmemt'`默认开启了 js 压缩。
