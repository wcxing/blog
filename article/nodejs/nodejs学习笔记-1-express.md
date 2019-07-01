## 推荐文章：

quote-1：[《nodejs教程》](http://www.runoob.com/nodejs/nodejs-tutorial.html) 这是一个非常简单易懂的教程，通过这个教程读者一定可以入门nodejs

## nodejs简介

   本文简要介绍一下nodejs的概念特性和两个应用，对其特性细节不做详细解析。所有观点均是个人理解，由于只是初步接触了nodejs，在这里分享一下，不具有权威性，欢迎讨论和指点。

   nodejs是什么？它是一个运行环境，可以让JavaScript运行在上面，它会调用更底层的接口对开发人员提供一系列API，使用这些API，我们可以进行文件操作，前端项目打包构建，服务器搭建等等。它的特性是事件驱动机制，这也是充分利用了JavaScript的函数式编程特性。

   使用nodejs进行后端开发与其他服务器有什么区别？使用PHP等后端语言进行后端开发时，是调用web服务器提供的API进行应用开发。而使用nodejs写后端代码时，实际上是在搭建一个http服务器。

   当我们使用nodejs搭建服务器时，我们实际是在干什么？当我们使用nodejs搭建服务器时，实际上是在实现一个web应用，这个应用会监听某个端口，并定义对于某个请求的处理，必要时候会进行一些文件操作和数据库操作。

   下面介绍一下，如何使用node搭建一个简易的服务器（express）

## express

   express是nodejs提供的一个构建web应用的框架。使用express可以快速地搭建一个完整功能的网站。

   下面介绍一下express使用步骤

首先创建文件夹 node-demo

然后cd到该文件夹，初始化之

```
npm init  
```

然后安装必要的软件

安装nodejs  nodejs官网

安装express

```
npm install express --save  
```

然后安装几个辅助的模块

```
npm install body-parser --save  
npm install cookie-parser --save  
npm install multer --save  
```

这些模块用法参见 上面的推荐文章 quote-1
然后就可以开始写搭建服务器的代码了，创建一个文件 express-demo.js，和一个index.html文件，代码如下：

// index.html

```
<!DOCTYPE html>  
<html>  
<head>  
    <title>test</title>  
</head>  
<body>  
    <form action="http://127.0.0.1:8081/process_get" method="GET">  
        First Name: <input type="text" name="first_name">  
        Last Name: <input type="text" name="last_name">  
        <input type="submit" value="submit">  
    </form>  
</body>  
</html> 
```
 
// express-demo

```
var express = require('express');  
// 创建一个express应用  
var app = express();  
  
// 定义get请求的响应  
app.get('/', function (request, response) {  
    response.send('Hello, world');  
});  
  
//  /del_user 页面响应  
app.get('/del_user', function (req, res) {  
   console.log("/del_user 响应 DELETE 请求");  
   res.send('删除页面');  
})  
   
//  /list_user 页面 GET 请求  
app.get('/list_user', function (req, res) {  
   console.log("/list_user GET 请求");  
   res.send('用户列表页面');  
})  
  
app.get('/index.html', function (request, response) {  
    response.sendFile(__dirname + '/' + 'index.html');  
});  
  
app.get('/process_get', function (request, response) {  
  
    var res = {  
        firstName: request.query.first_name,  
        lastName: request.query.last_name  
    };  
  
    response.send(JSON.stringify(res));  
});  
  
var server = app.listen(8081, function () {  
  
    var host = server.address().address;  
    var port = server.address().port;  
  
    console.log(server.address())  
  
    console.log('应用访问地址： http://%s:%s', host, port)  
})  
```

在上面的例子中，我们使用express创建了一个web应用，监听8081端口，监听get和post请求，并对不同url路由返回不同的响应结果。
使用方法：

命令行输入

```
node express-demo.js  
```

我们的服务器就运行起来了，这时候，在浏览器里输入 
http://127.0.0.1:8081

http://127.0.0.1:8081/list_user

http://127.0.0.1:8081/del_user

http://127.0.0.1:8081/index.html

就可以看到运行效果了。

