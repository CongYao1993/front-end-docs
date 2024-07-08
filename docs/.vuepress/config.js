import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { resolve } from 'node:path'
import { readdirSync } from 'node:fs';

const docsDir = resolve(__dirname, '..')
const res = readdirSync(docsDir, { withFileTypes: true });
const sidebar = res
    .filter((item) => item.isDirectory() && !item.name.startsWith('.'))
    .map((item) => {
        const curDir = resolve(__dirname, '..', item.name)
        const files = readdirSync(curDir, { withFileTypes: true });
        const children = files
            .filter((file) => file.isFile() && file.name.endsWith('.md') && file.name!=='README.md')
            .map(file => {
                return {
                    text: file.name.split('.md')[0],
                    link: file.name
                }
            })
        return {
            text: item.name,
            link: `/${item.name}/README.md`,
            prefix: `/${item.name}/`,
            children
        }
    });

export default defineUserConfig({
    lang: 'zh-CN',
    title: '前端入门和面试大全',
    description: 'Web前端基础，前端面试，html、CSS、JavaScript、TypeScript、Vue、React、Node.js、webpack、计算机网络、浏览器',
    base: '/Front-End-Introduction-Interview/',
    theme: defaultTheme({
        navbar: [
            {
                text: '首页',
                link: '/',
            },
            {
                text: 'GitHub',
                link: 'https://github.com/CongYao1993/Front-End-Introduction-Interview'
            },
        ],
        sidebar
    }),
    bundler: viteBundler()
})