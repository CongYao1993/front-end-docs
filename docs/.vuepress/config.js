import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { resolve } from "node:path";
import { readdirSync } from "node:fs";

function sidebar(route) {
  const path = resolve(__dirname, `..${route}`);
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
        link: `${route}${dir.name}/README.md`,
        prefix: `${route}${dir.name}/`,
        children,
      };
    });
}

export default defineUserConfig({
  lang: "zh-CN",
  title: "姚聪的前端博客",
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
      "/interview/": sidebar("/interview/"),
      "/tutorial/": sidebar("/tutorial/"),
    },
  }),
  bundler: viteBundler(),
});
