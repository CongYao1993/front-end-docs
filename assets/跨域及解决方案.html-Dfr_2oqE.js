import{_ as l,c as o,a as s,d as n,b as p,w as e,e as t,r as i,o as c}from"./app-CCtMo5dT.js";const u="/front-end-docs/assets/node-proxy-CrLMjJ2R.png",r={},d=t(`<p><a href="https://segmentfault.com/a/1190000011145364" target="_blank" rel="noopener noreferrer">前端常见的跨域解决方案</a></p><p>跨域的解决方案思路分为两种：代理和 CORS。</p><ul><li>CORS 是真正的跨域解决方案，通过设置请求头和响应头，允许浏览器接收跨域请求结果；</li><li>nginx 反向代理，也是比较通用的解决方案，缺点增加了一定的服务器压力；</li><li>jsonp 使用较少，因为它只支持 GET 请求；</li><li>各种 iframe 方式可传递数据，但组织和控制代码逻辑太复杂。</li></ul><h2 id="_1-同源策略" tabindex="-1"><a class="header-anchor" href="#_1-同源策略"><span>1. 同源策略</span></a></h2><p>如果两个 URL 的协议、域名和端口都相同，我们就称这两个 URL 同源。即便两个不同的域名指向同一个 ip 地址，也非同源。</p><p>同源策略是浏览器的安全策略，只在浏览器才有跨域问题，可以预防 XSS、CSRF 等等攻击。</p><p>同源策略的限制：</p><ul><li>DOM 层面：无法跨域获取 DOM 对象和 JS；</li><li>数据层面：无法跨域读取 Cookie、localStorage、IndexDB 等数据。</li><li>网络层面：Ajax 请求不能跨域发送。</li></ul><h2 id="_2-jsonp" tabindex="-1"><a class="header-anchor" href="#_2-jsonp"><span>2. jsonp</span></a></h2><p><code>&lt;script&gt;</code>、<code>&lt;img&gt;</code> 等标签没有跨域限制，因为浏览器允许 HTML 页面从不同域名加载静态资源，减轻 Web 服务器的负载。</p><p>我们可以通过动态创建 <code>&lt;script&gt;</code>，设置其 src 属性，发送带有 callback 参数的 GET 请求，服务端返回 callback 函数的调用，callback 函数获取到返回的数据。</p><p>缺点：只能实现 GET 一种请求。</p><div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html" data-title="html"><pre class="language-html"><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line">  <span class="token keyword">var</span> script <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">&quot;script&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  script<span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token string">&quot;text/javascript&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 传参一个回调函数名给后端</span></span>
<span class="line">  script<span class="token punctuation">.</span>src <span class="token operator">=</span></span>
<span class="line">    <span class="token string">&quot;http://www.domain2.com:8080/login?user=admin&amp;callback=handleCallback&quot;</span><span class="token punctuation">;</span></span>
<span class="line">  document<span class="token punctuation">.</span>head<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>script<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 回调执行函数</span></span>
<span class="line">  <span class="token keyword">function</span> <span class="token function">handleCallback</span><span class="token punctuation">(</span><span class="token parameter">res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">alert</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line"><span class="token comment">// 服务端返回如下，返回时执行全局函数</span></span>
<span class="line"><span class="token function">handleCallback</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token literal-property property">user</span><span class="token operator">:</span> <span class="token string">&quot;admin&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line"><span class="token comment">// 服务端 node 代码</span></span>
<span class="line"><span class="token keyword">var</span> querystring <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;querystring&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">var</span> http <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;http&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">var</span> server <span class="token operator">=</span> http<span class="token punctuation">.</span><span class="token function">createServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">server<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&quot;request&quot;</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">var</span> params <span class="token operator">=</span> qs<span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>url<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&quot;?&quot;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">var</span> fn <span class="token operator">=</span> params<span class="token punctuation">.</span>callback<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// jsonp返回设置</span></span>
<span class="line">  res<span class="token punctuation">.</span><span class="token function">writeHead</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token string-property property">&quot;Content-Type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;text/javascript&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  res<span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span>fn <span class="token operator">+</span> <span class="token string">&quot;(&quot;</span> <span class="token operator">+</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>params<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;)&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  res<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">server<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token string">&quot;8080&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;Server is running at port 8080...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-跨域资源共享-cors" tabindex="-1"><a class="header-anchor" href="#_3-跨域资源共享-cors"><span>3. 跨域资源共享（CORS）</span></a></h2><p>跨源资源共享（CORS）是一种基于 HTTP 头的机制，该机制通过允许服务器标示除了它自己以外的其他源，使得浏览器允许这些源访问加载自己的资源。</p><p><strong>简单请求：</strong></p><ul><li>请求头 Origin 表明该请求来源于 http://foo.example；</li><li>响应头 Access-Control-Allow-Origin: https://foo.example 表明，该资源只能通过 https://foo.example 来访问。</li></ul><p><strong>非简单请求：</strong></p>`,20),k=s("li",null,"预检请求完成之后，发送实际请求",-1),v=t(`<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line"><span class="token comment">// 前端设置是否带 Cookie</span></span>
<span class="line">xhr<span class="token punctuation">.</span>withCredentials <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line"><span class="token comment">// 跨域后台设置</span></span>
<span class="line">res<span class="token punctuation">.</span><span class="token function">writeHead</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">,</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// 后端允许发送 Cookie</span></span>
<span class="line">  <span class="token string-property property">&quot;Access-Control-Allow-Credentials&quot;</span><span class="token operator">:</span> <span class="token string">&quot;true&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token comment">// 允许访问的域，启用 Credentials 后，该值不能为 *</span></span>
<span class="line">  <span class="token string-property property">&quot;Access-Control-Allow-Origin&quot;</span><span class="token operator">:</span> <span class="token string">&quot;http://www.domain1.com&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token comment">// 此处设置的 Cookie 还是 domain2 的而非 domain1，因为后端也不能跨域写 Cookie，</span></span>
<span class="line">  <span class="token comment">// 但只要 domain2 中写入一次 Cookie 认证，后面的跨域接口都能从 domain2 中获取 Cookie，从而实现所有的接口都能跨域访问</span></span>
<span class="line">  <span class="token string-property property">&quot;Set-Cookie&quot;</span><span class="token operator">:</span> <span class="token string">&quot;l=a123456; Path=/; Domain=www.domain2.com; HttpOnly&quot;</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-nginx-反向代理" tabindex="-1"><a class="header-anchor" href="#_4-nginx-反向代理"><span>4. nginx 反向代理</span></a></h2><p>nginx 代理跨域，实质和 CORS 跨域原理一样，通过配置文件设置请求响应头字段。</p><p><strong>nginx 配置解决 iconfont 跨域：</strong></p><p>浏览器支持跨域访问 js、css、img 等静态资源，但 iconfont 字体文件（eot|otf|ttf|woff|svg）例外，此时可在 nginx 的静态资源服务器中加入以下配置。</p><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx" data-title="nginx"><pre class="language-nginx"><code><span class="line"><span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token directive"><span class="token keyword">add_header</span> Access-Control-Allow-Origin \\*</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>nginx 反向代理接口跨域：</strong></p><p>通过 nginx 配置一个代理服务器（域名与 domain1 相同，端口不同）做跳板机，反向代理访问 domain2 接口，并且可以顺便修改 Cookie 中 domain 信息，方便当前域 Cookie 写入，实现跨域登录。</p><div class="language-nginx line-numbers-mode" data-highlighter="prismjs" data-ext="nginx" data-title="nginx"><pre class="language-nginx"><code><span class="line"><span class="token comment"># nginx 配置，proxy 服务器</span></span>
<span class="line"><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token directive"><span class="token keyword">listen</span>       <span class="token number">81</span></span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token directive"><span class="token keyword">server_name</span>  www.domain1.com</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">proxy_pass</span>   http://www.domain2.com:8080</span><span class="token punctuation">;</span>  <span class="token comment"># 反向代理</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">proxy_cookie_domain</span> www.domain2.com www.domain1.com</span><span class="token punctuation">;</span> <span class="token comment"># 修改 Cookie 里域名</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">index</span>  index.html index.htm</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 当用 webpack-dev-server 等中间件代理接口访问 nignx 时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">add_header</span> Access-Control-Allow-Origin http://www.domain1.com</span><span class="token punctuation">;</span>  <span class="token comment"># 当前端只跨域不带 Cookie 时，可为*</span></span>
<span class="line">    <span class="token directive"><span class="token keyword">add_header</span> Access-Control-Allow-Credentials true</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-node-js-中间件代理" tabindex="-1"><a class="header-anchor" href="#_5-node-js-中间件代理"><span>5. Node.js 中间件代理</span></a></h2><p>同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。</p><p>代理服务器将浏览器的请求进行转发，收到请求结果后再转发给浏览器。</p><img src="`+u+`" width="70%"><p>Node.js 中间件代理与 2. CORS 的区别在于，CORS 是后端直接设置响应头，中间件代理多了中间服务器，可以前端来实现。</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line"><span class="token comment">// 前端代码</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> xhr <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">XMLHttpRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 前端开关：浏览器是否读写cookie</span></span>
<span class="line">xhr<span class="token punctuation">.</span>withCredentials <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 访问 http-proxy-middleware 代理服务器</span></span>
<span class="line">xhr<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token string">&quot;get&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;http://www.domain1.com:3000/login?user=admin&quot;</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">xhr<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line"><span class="token comment">// 中间件服务器代码</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">var</span> express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;express&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">var</span> proxy <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;http-proxy-middleware&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">var</span> app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span></span>
<span class="line">  <span class="token string">&quot;/&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token function">proxy</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 代理跨域目标接口</span></span>
<span class="line">    <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token string">&quot;http://www.domain2.com:8080&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">changeOrigin</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 修改响应头信息，实现跨域并允许带 Cookie</span></span>
<span class="line">    <span class="token function-variable function">onProxyRes</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">proxyRes<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      res<span class="token punctuation">.</span><span class="token function">header</span><span class="token punctuation">(</span><span class="token string">&quot;Access-Control-Allow-Origin&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;http://www.domain1.com&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      res<span class="token punctuation">.</span><span class="token function">header</span><span class="token punctuation">(</span><span class="token string">&quot;Access-Control-Allow-Credentials&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;true&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// 修改响应信息中的 Cookie 域名</span></span>
<span class="line">    <span class="token literal-property property">cookieDomainRewrite</span><span class="token operator">:</span> <span class="token string">&quot;www.domain1.com&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 可以为false，表示不修改</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">app<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;Proxy server is listen at port 3000...&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>vue + webpack + webpack-dev-server 搭建的项目，跨域请求接口，直接修改 webpack.config.js 配置。<br> 在开发环境下，由于 vue 渲染服务和接口代理服务都是 webpack-dev-server 同一个，所以页面与代理接口之间不再跨域，无须设置 headers 跨域信息了。</p><p>webpack.config.js 部分配置：</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">entry</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token operator">...</span></span>
<span class="line">  <span class="token literal-property property">devServer</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">historyApiFallback</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">proxy</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">context</span><span class="token operator">:</span> <span class="token string">&quot;/login&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">target</span><span class="token operator">:</span> <span class="token string">&quot;http://www.domain2.com:8080&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 代理跨域目标接口</span></span>
<span class="line">        <span class="token literal-property property">changeOrigin</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">secure</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">// 当代理某些https服务报错时用</span></span>
<span class="line">        <span class="token literal-property property">cookieDomainRewrite</span><span class="token operator">:</span> <span class="token string">&quot;www.domain1.com&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 可以为false，表示不修改</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">noInfo</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-postmessage-跨域" tabindex="-1"><a class="header-anchor" href="#_6-postmessage-跨域"><span>6. postMessage 跨域</span></a></h2><p>postMessage 是 HTML5 的 API，是可以跨域操作的 window 属性之，它可用于解决以下方面的问题：</p><ul><li>页面和其打开的新窗口的数据传递</li><li>多窗口之间消息传递</li><li>页面与嵌套的 iframe 消息传递</li><li>上面三个场景的跨域数据传递</li></ul><p>postMessage(data, origin) 方法接受两个参数：</p><ul><li>data： HTML5 规范支持任意基本类型或可复制的对象，但部分浏览器只支持字符串，所以传参时最好用 JSON.stringify() 序列化。</li><li>origin： 协议+主机+端口号，也可以设置为&quot;*&quot;，表示可以传递给任意窗口，如果要指定和当前窗口同源的话设置为&quot;/&quot;。</li></ul><h2 id="_7-websocket" tabindex="-1"><a class="header-anchor" href="#_7-websocket"><span>7. WebSocket</span></a></h2>`,26);function m(b,g){const a=i("RouteLink");return c(),o("div",null,[d,s("ul",null,[s("li",null,[n("非简单请求会首先发起预检请求 "),p(a,{to:"/interview/%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8E%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/HTTP%E5%8D%8F%E8%AE%AE.html#22-options-%E9%A2%84%E6%A3%80%E8%AF%B7%E6%B1%82"},{default:e(()=>[n("options 请求")]),_:1})]),k]),v,s("p",null,[p(a,{to:"/interview/%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8E%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/WebSocket.html"},{default:e(()=>[n("WebSocket")]),_:1}),n(" 协议允许跨域通讯。")])])}const w=l(r,[["render",m],["__file","跨域及解决方案.html.vue"]]),y=JSON.parse('{"path":"/interview/%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8E%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E8%B7%A8%E5%9F%9F%E5%8F%8A%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.html","title":"","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"1. 同源策略","slug":"_1-同源策略","link":"#_1-同源策略","children":[]},{"level":2,"title":"2. jsonp","slug":"_2-jsonp","link":"#_2-jsonp","children":[]},{"level":2,"title":"3. 跨域资源共享（CORS）","slug":"_3-跨域资源共享-cors","link":"#_3-跨域资源共享-cors","children":[]},{"level":2,"title":"4. nginx 反向代理","slug":"_4-nginx-反向代理","link":"#_4-nginx-反向代理","children":[]},{"level":2,"title":"5. Node.js 中间件代理","slug":"_5-node-js-中间件代理","link":"#_5-node-js-中间件代理","children":[]},{"level":2,"title":"6. postMessage 跨域","slug":"_6-postmessage-跨域","link":"#_6-postmessage-跨域","children":[]},{"level":2,"title":"7. WebSocket","slug":"_7-websocket","link":"#_7-websocket","children":[]}],"git":{"updatedTime":1723989556000,"contributors":[{"name":"yaocong","email":"cong1207@qq.com","commits":1}]},"filePathRelative":"interview/浏览器与计算机网络/跨域及解决方案.md"}');export{w as comp,y as data};
