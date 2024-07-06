import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '前端入门和面试大全',
  description: 'Web前端基础，前端面试，html、CSS、JavaScript、TypeScript、Vue、React、Node.js、webpack、计算机网络、浏览器',
  theme: defaultTheme({
    navbar: [
        {
          text: '首页',
          link: '/',
        },
      ],
  }),
  bundler: viteBundler()
})