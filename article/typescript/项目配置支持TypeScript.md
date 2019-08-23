# 搭建typescript项目

本文介绍如何搭建一个前端项目，支持以下功能

- 支持typescript
	- 支持ts编译和编辑器语法检查
	- 支持jsx语法
- 支持eslint
	- 支持各种文件的代码检查（.js、.jsx、.ts、.tsx）
	- 支持编译时代码检查和编辑器代码检查
	- 支持jsx语法

## 1. 支持typescript

#### 说明

和es6类似，项目中使用typescript的话，只需要增加一个转译器即可。例如如果使用webpack构建项目，引入ts-loader即可。但是有一些情况需要注意。

- 如何实现编辑器提示？
- 如何支持React？

编辑器提示可以通过引入插件来实现，vscode内置支持，不需要引入插件

关于如何支持React，typescript官网给出的方法是：1. 文件以.tsx为后缀 2. 启用选项（通过tsconfig.json文件中设置compilerOptions.jsx为'react'来实现）

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

## 2. 支持eslint代码检查

#### 说明

上面已经实现了在项目中支持typescript转译和检查。typescript最大的好处就是类型检查，除了类型检查，我们还需要进行代码风格的约束和检查（比如camelCase、有无分号等），这就需要用到eslint。

我们需要用eslint支持以下功能

- 不仅可以检查es6语法，还可以检查jsx和ts语法
- 不仅可以编译时候进行检查，还可以编辑时候检查

#### 依赖库

- eslint
- eslint-loader
- typescript-eslint-parser
- eslint-plugin-typescript

#### 步骤

1. 安装依赖
2. 修改webpack配置，是之支持eslint的编译时检查

```
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?/,
                loader: ['eslint-loader', 'ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                loader: 'eslint-loader',
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
3. 创建eslint配置文件.eslintrc.js并配置之

为了让eslint能够解析ts语法，我们需要安装typescript-eslint-parser。由于 typescript-eslint-parser 对一部分 ESLint 规则支持性不好，故我们需要安装 eslint-plugin-typescript，弥补一些支持性不好的规则。

另外，为了让eslint支持jsx语法，还需要配置一下解析选项

此外，eslint有些规则规定了允许jsx语法出现的文件后缀名，这个还需要配置一下（我们希望在.js、.jsx、.ts、.tsx中都允许jsx语法）

还有一点需要注意的是，我们需要让eslint解析模块导入时候，能够支持.ts、.tsx文件的导入(即，import test from './test'可以resolve出test.ts)

配置代码如下：

```
module.exports = {
    extends: ['standard'],
    // 配置eslint解析器为typescript-eslint-parser
    parser: 'typescript-eslint-parser',
    // 引入eslint-plugin-typescript，支持parser支持不好的规则
    // 可以省略eslint-plugin前缀
    plugins: ['typescript'],
    parserOptions: {
    	// 支持jsx的解析和检查
       "jsx": true,
       "useJSXTextNode": true
    },
    rules: {
    	// 配置规则，允许出现jsx语法的文件后缀为.tsx、.ts、.jsx、.js
    	// 除了这些后缀之外的文件如果出现jsx语法则会报错
       'react/jsx-filename-extension': [1, { "extensions": ['.ts', '.tsx', '.jsx', '.js'] }]
    },
    // 设置自动解析导入路径的后缀
    // 比如 import test from './test';或者import test from './test/index';
    'settings': {
        'import/resolver': {
            'node': {
                'extensions': [
                    '.js',
                    '.jsx',
                    '.ts',
                    '.tsx'
                ]
            }
        }
    }
};
```
4. 配置让vscode支持eslint的ts语法检查

配置完上述选项后，我们编译时候不符合规则的错误会报出来。但是编码时候则不会报错，如果希望我们编码时候也提示，则需要配置编辑器支持，对于vscode，我们配置如下选项：

在settings.json中配置：

```
"eslint.validate": [
	// 检查.js文件代码
   "javascript",
   // 检查.jsx文件的代码
   "javascriptreact",
   // 检查.ts文件代码
   "typescript",
   // 检查.tsx文件的代码
   "typescriptreact"
]
```
