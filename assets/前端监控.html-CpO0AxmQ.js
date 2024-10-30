import{_ as n,c as s,o as a,e}from"./app-CCtMo5dT.js";const t={},l=e(`<h2 id="_1-js-异常监控" tabindex="-1"><a class="header-anchor" href="#_1-js-异常监控"><span>1. JS 异常监控</span></a></h2><p>JS 异常监控是为了提高感知、定位、处理的效率。</p><ul><li>开发者迅速感知到 JS 异常发生</li><li>通过监控平台迅速定位问题</li><li>能够高效的处理问题，追踪问题的处理进度，并统计问题</li></ul><h3 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h3><h2 id="_2-错误采集方式" tabindex="-1"><a class="header-anchor" href="#_2-错误采集方式"><span>2. 错误采集方式</span></a></h2><h3 id="_2-1-try-catch" tabindex="-1"><a class="header-anchor" href="#_2-1-try-catch"><span>2.1 try/catch</span></a></h3><p>只能捕获代码常规的运行错误，不能捕获语法错误和异步错误</p><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="line"><span class="token comment">// 常规运行时错误，可以捕获 ✅</span></span>
<span class="line"> <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">   <span class="token keyword">let</span> a <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token keyword">if</span> <span class="token punctuation">(</span>a<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">     console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;111&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token punctuation">}</span></span>
<span class="line"> <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">   console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;捕获到异常：&#39;</span><span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 语法错误，不能捕获 ❌</span></span>
<span class="line"><span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">const</span> notdefined<span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span> <span class="token keyword">catch</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;捕获不到异常：&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Uncaught SyntaxError&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 异步错误，不能捕获 ❌</span></span>
<span class="line"><span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>notdefined<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span> <span class="token keyword">catch</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;捕获不到异常：&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Uncaught ReferenceError&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-window-onerror" tabindex="-1"><a class="header-anchor" href="#_2-2-window-onerror"><span>2.2 window.onerror</span></a></h3><h3 id="_2-3-window-addeventlistener" tabindex="-1"><a class="header-anchor" href="#_2-3-window-addeventlistener"><span>2.3 window.addEventListener</span></a></h3><h3 id="_2-4-promise-错误" tabindex="-1"><a class="header-anchor" href="#_2-4-promise-错误"><span>2.4 Promise 错误</span></a></h3><h3 id="_2-5-接口错误" tabindex="-1"><a class="header-anchor" href="#_2-5-接口错误"><span>2.5 接口错误</span></a></h3><h3 id="_2-6-跨域错误" tabindex="-1"><a class="header-anchor" href="#_2-6-跨域错误"><span>2.6 跨域错误</span></a></h3><h3 id="_2-7-vue-错误" tabindex="-1"><a class="header-anchor" href="#_2-7-vue-错误"><span>2.7 Vue 错误</span></a></h3><h3 id="_2-8-react-错误" tabindex="-1"><a class="header-anchor" href="#_2-8-react-错误"><span>2.8 React 错误</span></a></h3><h2 id="_3-白屏检测" tabindex="-1"><a class="header-anchor" href="#_3-白屏检测"><span>3. 白屏检测</span></a></h2><h2 id="_4-性能数据采集" tabindex="-1"><a class="header-anchor" href="#_4-性能数据采集"><span>4. 性能数据采集</span></a></h2><h2 id="_5-用户行为数据采集" tabindex="-1"><a class="header-anchor" href="#_5-用户行为数据采集"><span>5. 用户行为数据采集</span></a></h2>`,18),p=[l];function i(c,o){return a(),s("div",null,p)}const u=n(t,[["render",i],["__file","前端监控.html.vue"]]),d=JSON.parse('{"path":"/tutorial/%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7.html","title":"","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"1. JS 异常监控","slug":"_1-js-异常监控","link":"#_1-js-异常监控","children":[{"level":3,"title":"","slug":"","link":"#","children":[]}]},{"level":2,"title":"2. 错误采集方式","slug":"_2-错误采集方式","link":"#_2-错误采集方式","children":[{"level":3,"title":"2.1 try/catch","slug":"_2-1-try-catch","link":"#_2-1-try-catch","children":[]},{"level":3,"title":"2.2 window.onerror","slug":"_2-2-window-onerror","link":"#_2-2-window-onerror","children":[]},{"level":3,"title":"2.3 window.addEventListener","slug":"_2-3-window-addeventlistener","link":"#_2-3-window-addeventlistener","children":[]},{"level":3,"title":"2.4 Promise 错误","slug":"_2-4-promise-错误","link":"#_2-4-promise-错误","children":[]},{"level":3,"title":"2.5 接口错误","slug":"_2-5-接口错误","link":"#_2-5-接口错误","children":[]},{"level":3,"title":"2.6 跨域错误","slug":"_2-6-跨域错误","link":"#_2-6-跨域错误","children":[]},{"level":3,"title":"2.7 Vue 错误","slug":"_2-7-vue-错误","link":"#_2-7-vue-错误","children":[]},{"level":3,"title":"2.8 React 错误","slug":"_2-8-react-错误","link":"#_2-8-react-错误","children":[]}]},{"level":2,"title":"3. 白屏检测","slug":"_3-白屏检测","link":"#_3-白屏检测","children":[]},{"level":2,"title":"4. 性能数据采集","slug":"_4-性能数据采集","link":"#_4-性能数据采集","children":[]},{"level":2,"title":"5. 用户行为数据采集","slug":"_5-用户行为数据采集","link":"#_5-用户行为数据采集","children":[]}],"git":{"updatedTime":null,"contributors":[]},"filePathRelative":"tutorial/前端监控.md"}');export{u as comp,d as data};
