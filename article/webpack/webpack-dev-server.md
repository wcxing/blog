## 概述

webpack-dev-server是一个工具，用于webpack打包的项目中进行本地开发

它会在项目中启动一个服务器，用来运行前端项目，让开发者可以方便地调试和开发，它会在运行后自动地执行打包过程，并且serve输出的打包文件，使之可以在本地被访问到

webpack-dev-server功能很强大，它将项目打包并存储到内存中，并且监听文件改动，及时地构建更新内存中的打包文件。由于是将打包的项目存储到内存中，因此打包速度很快。

webpack-dev-server还支持hot reload模式，每次重新打包，可以自动刷新页面，提高了开发体验

webpack-dev-server还支持模块热重载，在文件更新后，不需要刷新页面即可更新页面内容

## 细节

### ```--content-base```参数

webpack-dev-server启动服务器后，同时server打包后的文件和实际目录中的文件，当访问资源时候，webpack-dev-server优先从内存中的打包文件中寻找资源进行响应，如果找不到，再从实际启动服务器的目录中寻找

webpack-dev-server启动的命令为```webpack-dev-server```，它可以加一些参数来指定执行特性，比如```webpack-dev-server --config ./webpack.dev.config.js```用于指定打包配置文件

```--content-base```参数则用于指定webpack-dev-server启动的目录，webpack-dev-server默认启动的目录是命令行执行的目录，即项目的根目录

通常当我们的入口html中有对本地某目录下的静态资源的访问（真正打包构建的时候这些资源会被复制到输出目录中），那么我们可以将```--content-base```参数设置为那个目录，这样这些静态资源就可以正常访问了

### ```output.publicPath```及```devServer.publicPath```参数

```output.publicPath```属性表示静态资源实际部署路径，最终打包后，入口页面引用静态资源时候，会加上这个路径前缀

如果配置了```output.publicPath```，在访问的时候，需要在服务器里配置路由指向，否则无法访问

```devServer.publicPath```属性表示webpack-dev-server启动服务器时候的打包资源请求路由，如果配置了这个属性，则本地访问需要加这个路由才能正常访问入口页面和打包的静态资源

如果配置了```output.publicPath```，则需要配置```devServer.publicPath```才能正常访问打包资源，否则无法访问

### url相对路径规则

url的相对路径规则与文件系统中的相对路径规则类似

我们访问```http://localhost:8080/coco```实际是访问```http://localhost:8080/coco/index.html```

如果index.html中有个静态资源的引用

```
<!DOCTYPE html>
<html>
<head>
    <title>root directory</title>
</head>
<body>
<div id="app"></div>
</body>
<script src="./coco/test.js"></script>
</html>
```

为了研究页面中静态资源的引用路径的性质，我们考察地址栏里访问不同的地址，script标签里使用不同的路径时，对应的浏览器发出的实际的http请求是什么样的呢？见下表

| 访问地址/静态资源引用路径 | ```./coco/test.js``` | ```/coco/test.js``` |
| :-: | :-: | :-: |
| ```http://localhost:8080/coco``` | ```http://localhost:8080/coco/test.js``` | ```http://localhost:8080/coco/test.js``` |
| ```http://localhost:8080/coco/index.html``` | ```http://localhost:8080/coco/coco/test.js``` | ```http://localhost:8080/coco/test.js``` |

### 最佳实践

在实际应用中，webpack-dev-server启动时候，不需要配置output，不需要配置html-webpack-plugin的filename参数