## 0 前言

本文主要介绍ssr(server side rendering)的基本原理及 mvvm框架搭建ssr项目时会面临哪些问题、如何解决这些问题，需要框架提供哪些功能以支持ssr

这里mvvm框架我们定义为数据响应式的、用组件形式组织交互单元的前端框架，一个组件包含模板、样式、生命周期钩子这三个要素。

本文主要参考 [vue ssr 指南](https://ssr.vuejs.org/zh/)


## 1 什么是ssr

ssr，服务端渲染，是指用node作中间层，将首屏数据从api server获取并填充到给定模板中，生成完整的首屏页面返回给客户端的技术

一次包含服务端渲染的页面加载过程如下

1. 客户端向node server发起请求，请求页面
2. node server接到请求后，向api server发起请求，请求首屏数据
3. api server返回首屏数据
4. node server用首屏数据渲染指定模板，得到首屏页面html
5. node server将首屏页面html返回给客户端
6. 客户端拿到首屏页面html后，直接渲染到浏览器上

所以，构建最简单的ssr项目，前端只需要一个node server（用来响应client http request），一个模板（node server用来生成首屏html），和一个数据api接口

## 2 为什么需要ssr

与传统的spa相比，ssr主要有以下优势

1. 更好的 SEO，因为搜索引擎爬虫抓取工具可以直接查看完全渲染的页面
2. 更快的内容到达时间，因为客户端拿到的是渲染好的html，服务端做请求和数据填充的操作比客户端更快

## 3 mvvm框架的ssr

通常我们使用mvvm框架实现ssr技术时，会面临一些问题，下面详述这些问题及解决办法

### 3.1 前端路由

假定我们有一个用mvvm框架构建的单页应用 ```myspa```，项目使用前端路由控制页面

前端路由的基本原理是操作地址栏里的url并监听url改变以变化UI

在一般的mvvm框架中，前端路由地址栏url变化时，通过替换组件来实现“页面跳转”。服务器会将所有路由对应到同一个前端项目，由前端根据路由确定渲染哪个页面。

通常情况下，为了实现按需加载，代码会按路由进行切割，所以不同路由对应的组件都是异步的组件

这样，在 ```myspa``` 中做ssr的话，需要服务端的渲染逻辑保持和前端相同的路由。node server接到一个页面请求时，会解析url中的路由，和 ```myspa```中的路由进行匹配，如果匹配不上，就返回404页，匹配上的话，则将相应的异步组件页面渲染并返回给客户端

### 3.2 mvvm

smarty是用来进行服务端渲染的一种php模板语言，当页面请求到来时，php会根据url参数读取数据并根据指定模板渲染出html返回给客户端

node server ssr和smarty有两个主要区别，理论上讲，smarty的响应速度更快，因为node server ssr读取数据是从api接口里获取，肯定不如smarty从数据库里查更快。第二个主要区别是smarty的前后端分离程度不如node server ssr

还是以```myspa```为例，我们先来回顾一下ssr的基本加载过程，然后就可以看出实现ssr需要mvvm框架提供哪些支持

当请求到达node server时，node server先从api server获取数据，然后匹配url中的路由找到对应的异步组件进行渲染

从上面的过程中可以看出，实现ssr需要mvvm框架的组件提供一个预加载数据的钩子，在这个钩子里进行数据请求并异步返回结果。只有这样，node server才能在加载组件之前执行这个钩子从而渲染模板。另外还需要提供一个将组件转为html的方法。

vue中，组件预加载数据的生命周期钩子为```asyncData ```，而要使用 将组件渲染为html的方法需要引入vue ssr配套模块```vue vue-server-renderer```，基本用法如下

```
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8080)
```

mvvm框架实现ssr的另一个问题是，挂载应用程序之前，需要保证客户端数据和服务端渲染数据的一致。也就是说，服务端渲染后返回给客户端的不仅是渲染好的html，还要包括渲染所用的数据，否则客户端应用在执行时就会出现数据不一致的问题。这可以通过服务端在渲染html时，将序列化的数据挂到window下来实现。

还有一个问题。客户端应用执行时，其实是有两种方式的，一种是以服务端渲染方式，另一种是客户端渲染方式。区别是什么呢？如果客户端应用以客户端渲染方式执行，那就会创建dom并添加数据响应，建立一个组件树，以控制整个应用的业务逻辑；而以服务端渲染执行的话，由于已经有渲染好的html，所以不会再创建dom，而是为已经创建好的html添加数据响应，使其变为由 Vue 管理的动态 DOM ，这个过程也成为“客户端激活”。

那么，如何区分需要客户端渲染还是服务端渲染呢？vue提供的方法是服务端渲染时，在html中的根节点dom上添加一个属性 ```data-server-rendered="true"```。这样就可以区分是客户端渲染还是服务端渲染。

### 3.3 同构

由于mvvm使用组件的方式构建单页应用，组件本身就有模板的属性，因此通常情况下，mvvm框架实现ssr时，服务端渲染和客户端运行的应用是基于同一套业务网代码的。这称为 同构。但是服务端和客户端是不同的平台，运行同一套代码时有些需要注意的问题：

- 有些服务端的api在客户端不能用，因此写业务代码时要保证服务端的代码只在服务端环境中运行
- 有些客户端api在服务端不能用，因此要保证客户端代码只运行在客户端环境中
- 因为服务端只有渲染而没有动态更新，所以组件的某些生命周期钩子只在客户端调用。因此服务端逻辑不能写在这些生命周期钩子中，另外还需要注意避免在服务端渲染时产生有全局副作用的代码（比如在服务端和客户端都有的生命周期钩子中开启一个定时器，而只在客户端特有的生命周期钩子中停掉这个定时器，那么服务端执行时，永远不会停掉这个定时器）

## 4 mvvm框架ssr的基本过程

综上，mvvm框架ssr的基本过程如下：

1. 客户端向node server发起请求，请求页面
2. node server接到请求后，匹配路由，并执行路由对应的组件的数据预取钩子来请求预取数据
3. api server 返回预取数据
4. node server接收到数据后，用数据渲染相应的路由组件，并将数据序列化后挂载到window下
5. node server将渲染好的html返回给客户端
6. 客户端加载html并加载相应的js执行应用程序，从window上取出首屏数据同步到应用中，并激活客户端，使页面变为vue控制的数据响应式dom