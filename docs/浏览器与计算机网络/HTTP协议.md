## 1. HTTP 协议

HTTP（hypertext transport protocol）协议，即超文本传输协议，是一种基于 TCP/IP 的应用层通信协议，规定了浏览器和服务器之间互相通信的规则。
协议中主要规定了两个方面的内容：

- 客户端向服务器发送数据，称为请求报文
- 服务端向客户端返回数据，称为响应报文

### 1.1 请求报文

- 请求行：请求方法、请求 URL、HTTP 协议版本号
- 请求头：包含浏览器信息和请求正文的有用信息，格式：【头名: 头值】
- 空行
- 请求体：可以是空、字符串、JSON 等，比如 POST 方法的参数信息等。

| <div style="width:130px;">请求头</div> | 解释                                                        | 举例                                       |
| -------------------------------------- | ----------------------------------------------------------- | ------------------------------------------ |
| Host                                   | 主机名                                                      | www.baidu.com                              |
| Connection                             | 连接的设置；keep-alive 保持连接，close 关闭连接             | keep-alive                                 |
| Cache-Control                          | 缓存控制                                                    | max-age=0                                  |
| Upgrade-Insecure-Requests              | 将网页中的 http 请求转化为 https 请求（很少用，老网站升级） | 1                                          |
| User-Agent                             | 客户端字符串标识，比如可以区分 PC 端和手机端等              | Mozilla/5.0 (Macintosh; Intel Mac OS X ... |
| Accept                                 | 设置浏览器接收的数据类型                                    | text/html,application/xhtml+xml,...        |
| Accept-Encoding                        | 设置接收的压缩方式                                          | gzip, deflate, br, zstd                    |
| Accept-Language                        | 设置接收的语言，q 为喜好系数，满分为 1                      | zh-CN,zh;q=0.9                             |
| Cookie                                 | Cookie                                                      |                                            |

### 1.2 响应报文

- 响应行：HTTP 协议版本号、状态码、状态描述，例如 HTTP/1.1 200 OK
- 响应头
- 空行
- 响应体：响应体内容的类型是非常灵活的，常见的类型有 HTML、CSS、JS、图片、JSON

| 响应头         | 解释                                                                         | 举例                     |
| -------------- | ---------------------------------------------------------------------------- | ------------------------ |
| Cache-Control  | 缓存控制                                                                     | max-age=0                |
| Connection     | 连接的设置；keep-alive 保持连接，close 关闭连接                              | keep-alive               |
| Content-Type   | 设置响应体的数据类型以及字符集，浏览器会根据该字段决定如何显示响应体的内容。 | text/html; charset=utf-8 |
| Content-Length | 响应体的长度，单位为字节                                                     |                          |

### 1.3 HTTP 的特点

HTTP 优点：

- 简单：HTTP 基本的报文格式就是 header+body，头部信息也是 key-value 简单文本的形式；
- 灵活和易于扩展：
  - HTTP 协议里的各类请求方法、URI/URL、状态码、头字段等每个组成，都允许开发人员自定义和扩充；
  - HTTP 工作在应用层，它的下层可以随意变化，HTTPS 是在 HTTP 与 TCP 层之间增加了 SSL/TLS 安全传输层，HTTP/3 甚至把 TCP 层换成了基于 UDP 的 QUIC。
- 应用广泛和跨平台
  - 从台式机的浏览器到手机的各种 APP，从看新闻、刷贴吧到购物、理财、吃鸡，HTTP 的应用片地开花，同时天然具有跨平台的优越性。

HTTP 缺点：

- 无状态是双刃剑
  - 服务器不会去记忆 HTTP 的状态，减轻了服务器资源的消耗，能够把更多的 CPU 和内存用来对外提供服务。
  - 既然服务器没有记忆能力，它在完成有关联性的操作时会非常麻烦。可以通过 Cookie 等控制客户端状态。
- 明文传输是双刃剑
  - 明文传输，方便阅读和调试，但传输过程中容易被窃取。
  - 不安全：明文传输，内容可能会被窃听；不验证通信方的身份，因此有可能遭遇伪装；无法证明报文的完整性，内容可能被篡改。可以用 HTTPS 的方式解决。

## 2. HTTP 请求方法

- GET：从服务器获取资源
- POST：在服务器创建资源
- PUT：在服务器修改资源
- DELETE：在服务器删除资源
- OPTION：预检请求
- TRACE：用于显示调试信息
- CONNECT：代理相关

### 2.1 GET 和 POST 请求的区别

- 定义：
  - GET 方法的含义是请求从服务器获取资源，可以是静态的文本、页面、图片、视频等。
  - POST 方法的含义是向服务器提交数据。
- 参数：
  - GET 参数放在 URL 中，只能接收 ASCII 字符，有长度限制（浏览器对 URL 有长度限制），不安全（参数暴露且保存在历史操作中）；
  - POST 参数放在请求体中，支持多种数据类型，更适合传输敏感信息。
- 是否幂等：
  - GET 请求是一个幂等（执行多次操作结果都是相同的）的请求，一般不会修改服务器上的资源。
  - POST 请求不是一个幂等的请求，一般会修改服务器资源。
- 是否缓存：
  - 浏览器一般会对 GET 请求结果进行缓存，但很少对 POST 请求缓存。
- POST 可能会分成两个数据包
  - 从 TCP 的角度，GET 请求会把请求报文一次性发出去，而 POST 可能会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。

### 2.2 OPTIONS 预检请求

OPTIONS 请求是指，在复杂请求发送之前，先发送一次预检请求，根据请求结果来决定是否继续发送真实的请求到服务器。

预检请求头：

- Access-Control-Request-Method：告知服务器实际请求所使用的 HTTP 方法。
- Access-Control-Request-Headers：告知服务器实际请求所携带的自定义标头。
- Origin：浏览器会自行加上一个 Origin 请求地址。

预检响应头：

- Access-Control-Allow-Methods：服务器支持的 HTTP 请求方法
- Access-Control-Allow-Headers：服务器允许的请求头
- Access-Control-Allow-Origin：服务器允许跨域请求的域名，如果要允许所有域名则设置为 \*
- Access-Control-Max-Age：指定了预检请求的结果能够被缓存多久，在缓存有效期内，该资源的请求（URL 和 header 字段都相同的情况下）不会再触发预检。

**预检请求的触发条件：**

- 使用非简单请求方法：除了 GET、POST 和 HEAD 的请求。
- 使用自定义请求头：人为设置了以下集合之外的字段 Accept/Accept-Language/Content-Language/Content-Type/DPR/Downlink/Save-Data/Viewport-Width/Width
- 内容类型不为简单类型：当请求的 Content-Type 不是 text/plain、multipart/form-data、application/x-www-form-urlencoded 三种之一。
- 任何跨域请求

## 3. HTTP 状态码

1xx（信息型状态码）：

- 100 Continue：服务器已接收到请求的初始部分，客户端应该继续发送剩余部分。
- 101 Switching Protocols：服务器应客户端升级协议的请求（Upgrade 请求头）正在切换协议。

2xx（成功状态码）：

- 200 OK：请求已成功，服务器返回请求的内容。
- 201 Created：请求已成功，并在服务器上创建了新的资源。
- 204 No Content：服务器成功处理了请求，但没有返回任何内容。
- 206 Partial Content：请求已成功，返回的 body 数据只是资源的一部分。

3xx（重定向状态码）：

- 301 Moved Permanently：请求的资源已永久移动到新位置。
- 302 Found：请求的资源临时移动到新位置。浏览器会重定向到这个 URL。
  - 301 和 302 都是重定向，网络进程都会从响应头的 Location 字段读取重定向的地址，然后再发起新请求。
- 303 See Other：通常作为 PUT 或 POST 操作的返回结果，它表示重定向链接指向的不是新上传的资源，而是另外一个页面，比如消息确认页面或上传进度页面。
- 304 Not Modified：服务器内容没有更新，无需再次传输请求的内容，可以使用客户端缓存的内容。

4xx（客户端错误状态码）：

- 400 Bad Request：客户端请求参数错误，服务器无法理解客户端的请求。
- 401 Unauthorized：请求未经授权，请求需要用户身份认证。
- 403 Forbidden：指的是服务器端有能力处理该请求，但是拒绝授权访问。类似于 401，但进入 403 状态后即使重新验证也不会改变该状态。
- 404 Not Found：服务器无法找到所请求的资源。不清楚是否为永久或临时的丢失。
- 410 Gone：请求的目标资源在服务器上不存在了，并且是永久性的丢失。

5xx（服务器错误状态码）：

- 500 Internal Server Error：服务器错误。
- 501 Not Implemented：请求的方法不被服务器支持，因此无法被处理。
- 502 Bad Gateway：作为网关或代理服务器的服务器从上游服务器收到无效的响应。
- 503 Service Unavailable：服务器当前无法处理请求，可以一会再试。
- 504 Gateway Timeout：扮演网关或者代理的服务器无法在规定的时间内获得想要的响应。
