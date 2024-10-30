import{_ as n,c as s,o as a,e as t}from"./app-CCtMo5dT.js";const e="/front-end-docs/assets/event-loop-BgnhsJ23.jpg",p="/front-end-docs/assets/event-loop-CuN6YcLH.png",o={},i=t('<h2 id="_1-事件循环机制" tabindex="-1"><a class="header-anchor" href="#_1-事件循环机制"><span>1. 事件循环机制</span></a></h2><p><a href="https://github.com/aooy/blog/issues/5" target="_blank" rel="noopener noreferrer">从 event loop 规范探究 javaScript 异步及浏览器更新渲染时机</a></p><p>JavaScript 是单线程，一些高耗时操作会带来线程阻塞问题。为了解决这个问题，JavaScript 有两种任务的执行模式：同步模式和异步模式。</p><p><strong>宏任务和微任务：</strong> 异步任务分为<code>宏任务</code>与<code>微任务</code>两种，<code>宏任务</code>是由宿主（浏览器、Node）发起的，而<code>微任务</code>由 JavaScript 自身发起。</p><table><thead><tr><th>宏任务</th><th>微任务</th></tr></thead><tbody><tr><td>setTimeout</td><td>Promise.[ then/catch/finally ]</td></tr><tr><td>setInterval</td><td>MutationObserver（浏览器）</td></tr><tr><td>setImmediate（Node）</td><td>process.nextTick （Node）</td></tr><tr><td>I/O</td><td>Object.observe</td></tr><tr><td>DOM 渲染、DOM 事件（浏览器）</td><td>queueMicrotask</td></tr><tr><td>script 整体代码</td><td></td></tr><tr><td>requestAnimationFrame（浏览器）</td><td></td></tr><tr><td>网络请求、webSocket</td><td></td></tr></tbody></table><p><strong>任务队列：</strong> 事件循环通过<code>宏任务队列</code>和<code>微任务队列</code>来保存宏任务和微任务。任务队列符合<code>先进先出</code>的特点，即添加任务时，添加至队列尾部，取出任务时，从队列头部取。</p><p><strong>事件循环机制：</strong></p><ol><li>一段代码执行时，会先执行宏任务中的同步代码；</li><li>如果执行中遇到宏任务，且宏任务已经到了执行时间，就把这个宏任务推入<code>宏任务队列</code>中；</li><li>如果执行中遇到微任务，就把微任务推入到<code>当前宏任务的微任务队列</code>中;</li><li>在本轮宏任务的同步代码执行完成后，依次执行所有的微任务（此时可能产生新的微任务），直到微任务队列清空；</li><li>执行一些必要的渲染和绘制操作；</li><li>进入下一个循环，执行下一个宏任务。</li></ol><img src="'+e+'" width="50%"><img src="'+p+`" width="80%"><p><strong>为什么要设计宏任务和微任务两个队列：</strong> 宏任务难以满足对时间精度要求较高的任务，很难控制任务开始执行的时间。为每个宏任务增加了微任务队列后，微任务既不会影响当前宏任务的执行效率，也解决了实时性问题，在当前宏任务主要功能执行结束后去执行对应的微任务。</p><h2 id="_2-requestanimationframe" tabindex="-1"><a class="header-anchor" href="#_2-requestanimationframe"><span>2. requestAnimationFrame</span></a></h2><p>使用 setTimeout 设置的回调任务实时性并不是太好，所以很多场景并不适合使用 setTimeout。比如你要使用 JavaScript 来实现动画效果，函数 requestAnimationFrame 就是个很好的选择。</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line"><span class="token keyword">var</span> reqId <span class="token operator">=</span> <span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span>func<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">cancelAnimationFrame</span><span class="token punctuation">(</span>reqId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>requestAnimationFrame 只有一个参数，即回调函数，间隔时间由显示器的刷新频率控制，通常 1s 刷新 60 次。</p><p>requestAnimationFrame 属于宏任务，但是，它和那些平行级别的那些宏任务执行顺序是不确定的。</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line"><span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">res</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">// 3 2 1 4</span></span>
<span class="line"><span class="token comment">// 3 1 2 4</span></span>
<span class="line"><span class="token comment">// 先输出 3 是肯定的，因为是放在微任务里，1 肯定在 4 前面，因为都是宏任务那就按照一般顺序，但是 2 怎么判断位置。</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-settimeout、setinterval、requestanimationframe-的区别" tabindex="-1"><a class="header-anchor" href="#_3-settimeout、setinterval、requestanimationframe-的区别"><span>3. setTimeout、setInterval、requestAnimationFrame 的区别</span></a></h2><ul><li>引擎层面 <ul><li>setTimeout 属于 JS 引擎 ，存在事件轮询</li><li>requestAnimationFrame 属于 GUI 引擎</li><li>JS 引擎与 GUI 引擎是互斥的，也就是说 GUI 引擎在渲染时会阻塞 JS 引擎的计算，因为如果在 GUI 渲染的时候，JS 同时又改变了 dom，那么就会造成页面渲染不同步</li></ul></li><li>性能层面 <ul><li>当页面被隐藏或最小化时，定时器 setTimeout 仍会在后台执行动画任务</li><li>当页面处于未激活的状态下，该页面的屏幕刷新任务会被系统暂停，requestAnimationFrame 也会停止</li></ul></li></ul>`,19),c=[i];function l(u,r){return a(),s("div",null,c)}const m=n(o,[["render",l],["__file","事件循环机制EventLoop.html.vue"]]),k=JSON.parse('{"path":"/interview/JavaScript/%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6EventLoop.html","title":"","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"1. 事件循环机制","slug":"_1-事件循环机制","link":"#_1-事件循环机制","children":[]},{"level":2,"title":"2. requestAnimationFrame","slug":"_2-requestanimationframe","link":"#_2-requestanimationframe","children":[]},{"level":2,"title":"3. setTimeout、setInterval、requestAnimationFrame 的区别","slug":"_3-settimeout、setinterval、requestanimationframe-的区别","link":"#_3-settimeout、setinterval、requestanimationframe-的区别","children":[]}],"git":{"updatedTime":1723989556000,"contributors":[{"name":"yaocong","email":"cong1207@qq.com","commits":1}]},"filePathRelative":"interview/JavaScript/事件循环机制EventLoop.md"}');export{m as comp,k as data};
