---
layout: post
title:   webpack代码分割-使用require.ensure
date:   2017-09-04 00:00:00 +0800
categories: CS
tag: webpack
---
## 背景

   webpack是一款很好用的模块打包机，当我们开发单页应用时，很常见的需求是把一堆模块打包成一个文件，这时webpack就派上用场了。但是在一些场景下，我们可能有这样的需求：一方面需要把一系列的文件打包成一个文件，另一方面还有一些模块是需要按需加载的（比如一个网站有多个页面，可以一开始加载主页，然后根据用户的操作再请求相应的其他页面），这时候就需要用到webpack提供的代码分割的功能。

## 简介

   如果我们想要做到按需加载，那么就需要webpack按需分割。webpack需要做的工作有两方面：第一是要把各个需要按需加载的模块切片成不同的文件（每个模块存在一个文件里，这个文件叫做一个切片）而不是打包到一个文件里。第二是在我们需要时引入。这样，相应地，就需要我们做两方面工作：第一是告诉webpack切片文件存放的位置。第二就是告诉webpack什么时候引入切片。下面说明一下我们怎么进行这两方面的工作。

## 切片位置配置

   webpack的配置文件中，有一个module.exports对象，其中有一个属性output，我们在这个属性下配置切片放置位置，详情参见webpack文档

## 何时引入切片文件

   对于webpack来说，是何时引入切片文件，对于我们来说，是如何引入模块。我们通过require.ensure来进行模块的异步引用。语法为：

```
require.ensure(dependencies: String[], callback: function(require), chunkName: String)。
```

第一个参数是需要引入的模块所依赖的其他模块的列表，第二个参数是是加载完依赖模块后的回调函数，第三个参数是切片名字（这个切片的名字是干什么用的暂时还没搞明白）。
举例如下：
require.ensure(['./a.js'], function(require) {
    require('./b.js');
});

我们是在第二个参数，即加载依赖完成的回调函数中进行模块的异步加载的。上述示例代码直接就引入了b.js。我们当然也可以在适当的时机引入：

```
require.ensure(['./a.js'], function(require) {

    setTimeout(function () {

        require('./b.js');
    }, 1000);
});
```

## 说明

   webpack对于require.ensure是如何执行的呢？它会首先静态解析require.ensure语句，把其中回调函数中引入的模块连同它依赖的模块打包成一个切片文件。这样，当我们需要引入相应的模块时，就会使用jsonp引入这个切片文件。一种很常见的做法是在依赖完成回调函数中返回一个promise的工厂函数，这个promise会resolve我们想要的依赖模块，然后我们就可以在需要引入模块时resolve一下，就可以在promise成功的回调中进行相应的处理了。



```
// a.js  
window.a = 'a';  
  
// b.js  
window.b = 'b';  
  
var test = require.ensure(['./a.js'], function () {  
    return function () {  
        var promise = new Promise (function (resolve, reject) {  
            resolve(require('./b.js'));  
        });  
    }  
}, 'test');
// 开始异步加载  
test()  
.then(function (data) {  
    console.log(window.a); // 'a'  
    console.log(window.b); // 'b'  
});  
```
