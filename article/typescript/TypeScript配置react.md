## 搭建typescript项目

#### 说明

本文介绍如何配置简单的typescript开发环境，支持使用React框架开发。

和es6类似，项目中使用typescript的话，只需要增加一个转译器即可。例如如果使用webpack构建项目，引入ts-loader即可。但是有一些情况需要注意。

- 如何实现编辑器提示？
- 如何支持React？

编辑器提示可以通过引入插件来实现，vscode内置支持，不需要引入插件

关于如何支持React，typescript官网给出的方法是：1. 文件以.tsx为后缀 2. 启用选项

#### 文件目录

```
.
├── index.html
├── package-lock.json
├── package.json
├── src
│   ├── App.tsx
│   ├── index.tsx
│   └── util
│       └── add.ts
├── tsconfig.json
└── webpack.config.js
```

#### 依赖库

- 构建相关
    - webpack
    - webpack-cli
    - webpack-dev-server
    - html-webpack-plugin

- typescript相关
    - typescript(全局)
    - typescript（本地）
    - ts-loader

- react相关
    - react
    - react-dom
    - @types/react
    - @types/react-dom


#### 搭建步骤

1. 安装依赖
2. 配置webpack.config.js

```
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins:[
        new HTMLPlugin({
            template: './index.html'
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};

```
3. 安装全局typescript，并执行```tsc --init```来创建tsconfig.json文件，可以仿照create-react-app的typescript版本来配置该文件

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "build/dist",
    "module": "esnext",
    "target": "es5",
    "lib": ["es6", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "jsx": "react",
    "moduleResolution": "node",
    // "rootDir": "src",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "importHelpers": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true
  },
  "exclude": [
    "node_modules
  ]
}

```

4. 创建 .ts文件和 .tsx文件，开始编译运行

#### 注意

- 如果文件中声明了React组件，必须开启jsx支持（文件.tsx后缀 + tsconfig.json中配置jsx选项为’react‘）。
- webpack.config.js中的resolve.extensions列表中不仅要包含'.tsx'、'.ts'，还要包含'.js'。否则有些index.js引用不到，本地调试时候就会报错
- 如果webpack中配置了路径别名（resolve.alias），则需要在tsconfig.json中也配置一下，否则tsc会报错找不到模块
