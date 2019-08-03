## React SSR工程搭建

#### 0. 前言

react框架本身提供了SSR的node层api支持，即一个将react组件渲染成html字符串的方法。那么我们如何搭建一个SSR的工程呢？

我们先来看一下SSR的整个流程

1. 首先浏览器向node server发出请求，请求页面
2. node server获取到模板和app
3. node server拿到app后，访问每个组件中需要获取的数据（如果有必要），发起异步请求并用返回的结果渲染app为html字符串，然后将字符串填充到模板上形成完整的页面html字符串，将之返回给浏览器
4. 浏览器拿到html字符串后，渲染形成首屏页面。然后浏览器向node server请求静态资源（如果静态资源和入口html在同一域名下而不放在cdn上的话），node server返给浏览器响应的静态资源
5. 浏览器拿到js资源，开始执行，给页面中元素添加事件并执行一系列业务逻辑，使整个app变成可响应的应用
6. 如果我们的web app是单页应用并且有多个路由，那么还需要考虑请求是不同路由的时候，返回相应路由的html

根据上面说明的SSR的流程，我们实现SSR功能需要解决的问题，即我们搭建一个SSR工程或脚手架需要实现的功能如下

1. **node server如何获取模板和app？这里模板指的是浏览器要访问的html中除了app外的其他部分，包括html整体框架和各种静态资源的引用标签**
2. **node server如何根据app实现数据预取，并渲染出正确的html？**
3. **node server如何serve静态资源？**
4. **如何让我们的应用执行以后，页面变成可响应的？（因为渲染出html后只是各个元素可见，但是没有执行js代码，所以这时候页面中元素还不是可以响应事件的）**
5. **node server如何根据路由渲染出正确的html？**

当然，我们还需要考虑的一个重要的问题，是本地开发环境如何搭建。我们希望本地开发环境满足

1. **可以实现模块热重载**
2. **可以实现当server代码修改时，自动重启服务器**

这样我们就可以方便地调试客户端代码和服务器代码了

下面详细说明上面提到的问题如何解决，功能如何实现

#### 1. node server如何获取模板和app

我们都知道，node server返回给浏览器的是根据数据渲染好的页面html字符串。那么node server是如何把页面html渲染出来的呢？

首先node server需要拿到模板，然后把app渲染成html字符串填充到模板中，就得到了最终的页面html

这里说的模板，指的是包含静态资源引用标签和和入口页面整体框架的html文件，它有个根节点用来挂载我们的web app（比如一个id为root的div标签）。如果是客户端渲染，会拿到这个元素后执行ReactDom.render方法，将我们的web app挂载到该节点下。如果是服务端渲染，拿到这个模板后，会将app渲染成html字符串，然后插到这个标签下面，最终生成完整的首屏html。

app指的是react app的组件树。react框架提供一个api来将组件树转换成对应的html。

那么node server如何拿到这个模板和app呢？

服务端渲染模板其实就是客户端渲染时候浏览器请求到的html文件，这个文件是通过webpack打包时候，将引用的静态资源链接注入到写死的html原始模板中得到的。

app是以我们的react根组件文件为入口打包，得到的js模块。

由上面描述可以看出来，进行服务端渲染，还需要入口html和app。这说明我们不仅需要进行客户端渲染的打包，还需要额外提供一个react组件树模块打包结果，这些打包结果都存放在构建输出目录中。

node server获取模板和app，可以通过访问输出目录得到，具体方式是node server通过node的文件api读取相应的文件，获取模板和app。

#### 2. node server如何根据app实现数据预取

node server获取模板和app之后，就会将app渲染成html字符串。这个过程是如何实现的呢？

我们先来了解一下一个工具```react-async-bootstrapper```

这个模块导出一个方法，它接收react组件作为参数，返回一个promise。它会执行以参数的组件为根组件的组件树中所有组件的```asyncBootrap```方法后resolve。

我们可以用这个工具实现数据预取功能。首先给组件加上```asyncBootstrap```的成员方法，然后执行```react-async-bootstrapper```方法，然后在返回的promise的resolve回调里执行服务端渲染逻辑。因为在resolve时候数据已经预取完毕，这时候进行服务端渲染就可以得到预期的结果了。

#### 3. node server如何serve静态资源

如果我们的静态资源不部署到cdn上，而是和node server部署到我们自己的域名下，当浏览器加载完html后，会发起静态资源的请求。这些静态资源的请求是会直接打到我们的node server上的。那么node server应该怎么处理才能让浏览器得到想要的静态资源呢？

我们可以在客户端渲染打包时候，将静态资源请求的publicPath固定（比如```asset```），然后node server接收到带有```asset```路由的请求时，转发到静态资源输出目录。

#### 4. 如何让我们的应用执行以后，页面变成可响应的

客户端渲染的react入口文件会调用```ReactDOM.render()```方法将组件挂载到根节点上去。在服务端渲染时候，浏览器拿到的是已经渲染后的html。这时候需要调用```ReactDOM.hydrate()```方法，```hydrate()```与 ```render()``` 相同，但用于混合容器，该容器的HTML内容是由 ReactDOMServer 渲染的。 React 将尝试将事件监听器附加到现有的标记。

需要注意的一个问题是如何保证服务端渲染的html结果和客户端渲染执行的结果保持一致。因为服务端渲染为了预取数据，会先执行异步方法```asyncBootrap ```。但是客户端渲染不会执行之，所以可能出现服务端渲染的html结果和客户端渲染的组件```state```不一致的情况，解决的思路是，将```asyncBootrap```异步执行后的数据挂在window下一个变量（```__INITIAL__STATE__```）上面，客户端渲染时候读取这个变量的值，用来渲染组件。

#### 5. node server如何根据路由渲染出正确的html

前端路由是由hash、history等浏览器api支持的，服务端渲染时候，没有这些api，所以需要一个“假的”```Router```组件来提供给```ReactDOM.renderToString()```渲染，这个“假的```Router```组件”暴露给子组件中的```Route```组件的```location```等的属性不是浏览器环境下js的属性。```react-router```提供了一个这种组件```StaticRouter```，这个组件接受两个参数：```location```和```context```。```location```是当前的url，```context```是路由的上下文，在渲染过程中，如果子组件改变了location，会反映到context上。

#### 6. 如何搭建我们的本地开发环境

搭建本地开发环境需要实现以下几个功能

1. 客户端渲染代码调试
2. 服务端渲染代码调试，这个需要实现服务端渲染代码更新后重启服务的功能，并且node server运行时候，也需要实现客户端渲染代码调试的一系列功能

客户端渲染代码调试需要启动一个本地服务器serve静态资源，并提供模块热重载、historyApiFallback等功能，可以使用webpack-dev-server实现

服务端渲染代码调试需要实现服务端渲染代码更新后重启服务的功能，并且node server运行时候，也需要实现客户端渲染代码调试的一系列功能

server代码更新后重启服务器可以通过一些工具（nodemon）实现，本地调试时候，node server获取的模板和app可以直接通过访问webpack-dev-server的资源（html、js、css等）实现，这样就实现了客户端渲染的所有功能

#### 7. 总结

生产环境

实现服务端渲染我们主要关注两点，一个是打包构建，另一个是node server逻辑

构建：客户端渲染打包 + app模块打包

node server：读取html和app模块文件，渲染首屏html；重定向静态资源访问

开发环境

客户端渲染使用webpack-dev-server；node server使用express，读取webpack-dev-server中的模板和app模块，并执行渲染逻辑；静态资源重定向到webpack-dev-server

