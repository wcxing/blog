## eggjs简述

#### 0. 说明

koa是一个node server框架，封装了http模块。使用koa开发node server，其实是实现一系列的中间件，框架接收到请求经过一系列中间件处理，最终输出响应。

eggjs是一个企业级web server开发框架，它封装了koa，增强了koa开发体验，并提供了应用开发的一些约定和支持和工程化支持。

使用eggjs开发有以下特点：

- 工程化支持完善，开发环境、代码检查、部署等
- 面向未来，扩展方便：支持自定义或使用第三方中间件、插件
- 目录约定，多人开发时候模式统一，大型项目方便管理
- 将应用合理分层：router、controller、service、model，应用可维护、可读性有保证
- 提供定时任务支持
- 通过载入代码-自动挂载代码到对象的方式解决了到处写import/require的问题, 不再需要手动维护模块之间的依赖关系

#### 1. 目录结构

```
├── app
|   ├── router.js // 路由
│   ├── controller // 控制器
│   |   └── home.js
│   ├── service (可选) // 服务层
│   |   └── user.js
│   ├── middleware (可选) // 中间件
│   |   └── response_time.js
│   ├── schedule (可选) // 定时任务
│   |   └── my_task.js
│   ├── public (可选) // 静态资源
│   |   └── reset.css
│   ├── view (可选) // 模板
│   |   └── home.nj
│   ├── model（可选）// 数据模型、表的映射
│   |   └── user.js
│   └── extend (可选) // 扩展
│       ├── helper.js (可选)
│       ├── request.js (可选)
│       ├── response.js (可选)
│       ├── context.js (可选)
│       ├── application.js (可选)
│       └── agent.js (可选)
```

请求的处理主要逻辑写在router、controller、service，而不需要像使用koa开发时候那样，通过实现路由中间件来实现请求处理。

基本处理流程是：请求->router->controller->service。

router负责转发路由，controller负责解析和处理请求参数，service负责具体的业务逻辑。

#### 2. 工程化

- 代码检查
- 部署多进程管理
- 本地开发与线上部署

#### 3. 开发步骤

可以使用egg-init命令行工具快速生成一个eggjs项目模板。

注意使用vscode的话，可以使用egg插件，这样输入egg时候可以根据提示快速生成代码模板。