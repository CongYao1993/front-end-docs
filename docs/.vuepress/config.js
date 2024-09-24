import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { resolve } from "node:path";
import { readdirSync } from "node:fs";

function interviewSidebar() {
  const path = resolve(__dirname, "../interview");
  const dirs = readdirSync(path, { withFileTypes: true });
  return dirs
    .filter((dir) => dir.isDirectory())
    .map((dir) => {
      const files = readdirSync(dir.path + "/" + dir.name, { withFileTypes: true });
      const children = files
        .filter((file) => file.isFile() && file.name.endsWith(".md") && file.name !== "README.md")
        .map((file) => {
          return {
            text: file.name.split(".md")[0],
            link: file.name,
          };
        });
      return {
        text: dir.name,
        link: `/interview/${dir.name}/README.md`,
        prefix: `/interview/${dir.name}/`,
        children,
      };
    });
}

function tutorialSidebar() {
  const path = resolve(__dirname, "../tutorial");
  return readdirSync(path)
    .filter((item) => item.endsWith(".md") && item !== "README.md")
    .map((item) => {
      return {
        text: item.split(".md")[0],
        link: `/tutorial/${item}`,
        prefix: `/tutorial/`,
      };
    });
}

export default defineUserConfig({
  lang: "zh-CN",
  title: "前端文档",
  description:
    "Web前端基础，前端面试，html、CSS、JavaScript、TypeScript、Vue、React、Node.js、webpack、计算机网络、浏览器",
  base: "/front-end-docs/",
  theme: defaultTheme({
    navbar: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "面试",
        link: "/interview/",
      },
      {
        text: "教程",
        link: "/tutorial/",
      },
      {
        text: "GitHub",
        link: "https://github.com/CongYao1993/front-end-docs",
      },
    ],
    sidebar: {
      "/interview/": interviewSidebar(),
      "/tutorial/": tutorialSidebar(),
    },
  }),
  bundler: viteBundler(),
});
