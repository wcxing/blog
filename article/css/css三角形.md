---
layout: post
title:    css三角形
date:   2017-08-16 00:00:00 +0800
categories: CS
tag: css
---

## 原理

   我们都很熟悉盒模型，即内容区+内边距+边框+外边距，但是关于边框的一些特性可能不是特别了解。其实盒模型的边框的四个部分都是梯形的，当边框宽度（border-width）很小时，看上去只是一条线，但是当边框宽度变宽时，它的真实面貌才会显现出来。
   
![图片加载失败](https://raw.githubusercontent.com/KIDFUCKER/blogImages/master/2017081601.png)

基于边框的这个特性，我们想要构建一个三角形的话，需要把内容区域面积设置为0。就是下面这样的效果：

![图片加载失败](https://raw.githubusercontent.com/KIDFUCKER/blogImages/master/2017081602.png)


然后，我们可以保留四个边中的一个，其余的让它们颜色为背景色，一个三角形就出现了。

## 代码

根据上面的讨论，实现一个三角形的CSS代码为

```
<!DOCTYPE html>  
<html>  
<head>  
    <title>test</title>  
    <style type="text/css">  
        #triangle {  
            /*1.内容区面积为0*/  
            width: 0;  
            height: 0;  
            /*2.设置边框样式*/  
            border: 10px solid;  
            border-color: white white red white;  
        }  
    </style>  
</head>  
<body>  
    <div id="triangle"></div>  
</body>  
</html>  
```