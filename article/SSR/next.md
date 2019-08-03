## 0 前言

next.js是一个基于react的服务端渲染框架

所谓框架即一个程序库，对开发者屏蔽底层实现细节，要求开发者按照其支持的范式编写程序，即可实现开发者想要的效果

react框架对外屏蔽了dom操作细节及数据响应式的具体实现，要求开发者按照其提供的组件式、数据驱动式的程序编写方式，即可开发出各式各样的spa

next.js则在react的基础上增加了服务端渲染的功能，这个功能实现对开发者透明，开发者只要按照next要求的开发范式（比如实现组件的预取数据的钩子），即可让你的spa拥有服务端渲染的功能

除服务端渲染，next还提供了诸如静态化、自动生成路由、自动代码分割等功能和特性，并提供很多特性的定制化的支持

[next.js官方文档](https://nextjs.org/docs#setup)

下面介绍下，如何使用next.js构建一款服务端渲染应用

## 1 next.js的能力

### 1.1 spa的要素

通常我们构建一个spa，需要搭建一系列环境，考虑一系列要素，如

#### 开发

- 本地开发环境（本地server、live reload、HMR等）
- 入口html内容编辑（rm自适应方案设置html的font-size、第三方script引用等）
- 模块化（amd、cmd、commonjs、es6 module）
- css方案（内联、预编译等）
- static文件方案
- 路由方案（前端路由、link导航、api导航、error page）
- ajax方案

#### 打包构建及部署

- 构建打包（js转义压缩、css压缩、图片压缩）
- 按需加载
- 覆盖式部署、非覆盖式部署

#### 服务端渲染

如果spa使用ssr，还要考虑实现相关的技术

- node server渲染实现
- 同构代码支持
- 打包相关
- node server路由支持

#### 其他

- layout方案

### 1.2 next.js的能力

对于上述的和未提到的一系列要素，next.js提供了相关支持，它在底层做了很多工作，对外屏蔽了大量细节，使开发者很大程度上只需要关心业务逻辑的实现

#### 服务端渲染

next.js核心能力之一就是服务端渲染，它实现了代码同构支持、node server服务端渲染支持、ssr路由支持等

对于开发者，<u>只需要编写业务组件，实现数据预取的钩子，返回需要的数据即可</u>，其余的工作都由next.js完成

#### 路由

使用next.js构建单页应用，路由是通过文件目录配置的，next.js规定开发者要在项目根目录下的pages文件夹下编写路由组件，然后next.js会自动生成路由页面

#### 本地开发环境及构建打包

next.js提供了命令来启动本地服务器和构建打包

启动本地服务器

```
next
```

在服务器上构建并启动项目

```
next build
next start
```

#### css方案

next.js支持内置样式和预编译等方式供开发者写样式

内置样式写法

```
export default () =>
  <div>
    Hello world
    <p>scoped!</p>
    <style jsx>{`
      p {
        color: blue;
      }
      div {
        background: red;
      }
      @media (max-width: 600px) {
        div {
          background: blue;
        }
      }
    `}</style>
    <style global jsx>{`
      body {
        background: black;
      }
    `}</style>
  </div>
```

预编译css支持less、stylus等，需要设置next.js配置以提供编译支持

[next.js预编译css支持-stylus](https://github.com/zeit/next-plugins/tree/master/packages/next-stylus)

#### 自定义

next.js允许开发者自定义一些选项

- node server：开发者可以通过在项目根目录下添加server.js文件，并在项目package.json中修改script key实现

	```
		{
       	"scripts": {
		    "dev": "node server.js",
		    "build": "next build",
		    "start": "NODE_ENV=production node server.js"
		  }
		}
	```
- 入口html标签：开发者可以通过在pages目录下添加_document.js来覆盖默认的html
- app：开着可以通过在pages目录下添加_app.js来覆盖默认的应用元素设置
- 自定义配置：开发者可以通过在项目根目录下添加next.config.js来覆盖默认配置（如webpack配置、构建目录、是否使用服务端渲染等）
- babel配置：开发者可以通过在项目根目录下添加.babelrc来覆盖默认babel配置

#### 静态化

next.js提供方法将项目导出为静态项目，静态项目运行时，不依赖node server。

#### layout

在单页应用的开发中，可能会有这样的需求，在不同路由之间跳转时，界面某些元素是一直不变的（如一些logo、标题等）。next.js提供的实现这种需求的方法是使用组件实现不变的部分并引用之来包裹变化的部分。这中方式是react天然支持的的。

## 2 开发者工作

#### pages 

开发者在pages目录下创建文件，实现页面，nextjs会自动根据目录生成路由

#### ```getInitialProps``` 

在这个钩子中实现数据预取，用于首屏页面的服务端渲染和非首屏路由的数据获取

#### server

通常情况下开发者不需要自己实现node server，如果有特殊需求，如路由遮盖等，可以自己实现node server，利用nextjs提供的api完成服务端渲染，再加入一些中间件来完成定制化需求