# koa的使用

koa是一款基于Node的web server开发框架，特点是

- 中间件框架
- 使用async、await实现异步

## web server能力

要实现一个web server，从开发者角度，需要web server提供哪些功能来给我们进行应用的开发呢？

主要有两个方面

- 静态资源服务器
- API服务器

#### 静态资源服务器

静态资源服务器需要提供给开发者哪些能力呢？

- serve静态资源
- 压缩解压
- 缓存控制

#### API服务器

API服务器应该提供哪些能力呢？

- 解析url
	- 路由解析，解析请求中的路由，以便做出响应的处理
	- 参数解析，解析get请求、post请求的参数
	- 动态路由解析，解析动态路由的内容
- 返回响应，如何将查询或者计算好的结果返回给客户端
- 重定向，如何返回301、302类型的结果
- 错误处理，如何返回403、404类型的结果
- cookie、session，如何使用cookie和session做用户状态跟踪
- 模板引擎，实现服务端渲染
- 日志
- 跨域

## koa API设计

使用koa创建一个web 服务器的流程是

1. 首先创建一个koa实例
2. 为koa实例添加中间件
3. 实例监听端口，启动服务器

这里需要关注的是中间件的概念，koa中间件是一个函数，为koa实例添加一个中间件实际上是注册一个回调函数

```
// 官方文档的例子

const Koa = require('koa');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

这个函数接收ctx和next参数，ctx中包含了一个请求的上下文信息，包括request、response等等，每个请求都会创建一个ctx，next用于操作执行流程，执行next()将跳到下一个中间件中执行。由于每个中间件回调方法中执行next()实际是执行了下一个中间件，因此看起来是一个中间件嵌套另一个中间件，中间件模型形象地可以称为“洋葱模型”。

## koa的使用


#### 静态服务器

koa2-static、koa-send

这两个中间件用来提供静态服务器功能，koa2-static是对koa-send的一层封装

#### API服务器

为了提供API接口，开发者需要关注koa的以下能力

1. koa2路由

我们使用koa-router这个中间件实现路由功能，即根据请求路径确定实际操作

```

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', async ctx => {
    ctx.body = 'hello koa';
})

// 启动路由
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, err => {
    if (err) throw err;
    console.log('runing...')
})

```

2. 解析get请求参数和post请求参数

get请求参数可以直接通过ctx.query来获取

post请求参数可以通过koa-bodyparser中间件解析，然后通过ctx.request.body获取参数

```
var Koa = require('koa');
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');

var app = new Koa();
app.use(bodyParser());

router.post('/test', async ctx => {
    console.log(ctx.request.body);
    ctx.body = ctx.request.body;
})

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
```

3. 动态路由

使用koa处理动态路由需要关注两点

- 路由格式：冒号 + 路由变量名
- 路由解析：ctx.params

```
router.get('/product/:classId', async ctx => {
	// { classId: '123' } //获取动态路由的数据
	console.log(ctx.params);
	ctx.body='课程信息';
});
```

4. 错误处理

错误处理可以通过错误处理中间件实现

```
app.use(async (ctx, next) => {
    await next();
    if(ctx.status === 404) {
        ctx.body="404页面"
    }
});
```

错误处理可能会在其他中间件中进行，比如某个路由中间件处理发现请求not found，将ctx.status置为404，然后在上面的错误处理中间件中即可处理。

5. 模板引擎

为了提供服务端渲染功能，web server都有响应的模板引擎（如php的smarty）

js模板引擎有ejs、art-template等，其中art-template使用更多一点

6. cookie和session

cookie可以直接使用ctx.cookies.set和ctx.cookies.get设置和获取

session可以使用koa-session中间件进行处理

7. 公用数据

如果每次请求的多个中间件需要共享一些数据，可以将之挂到ctx.state上

```ctx.state.userinfo = {name: ''};```

8. 数据库、cache编程接口

如果web server需要连接数据库，需要下载Node驱动

例如如果需要使用mongo ```npm install mongodb --save```

使用mysql ```npm install mysql --save```

9. 日志

使用koa，也有第三方中间件提供日志能力，如koa-log4，当然我们也可以自定义中间件实现日志功能

10. 跨域

使用koa2-cors中间件可以实现跨域配置

```
const cors = require('koa2-cors')
app.use(cors())
```


