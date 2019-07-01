---
layout: post
title:   nodejs学习笔记-2-mysql
date:   2017-07-14 00:00:00 +0800
categories: CS
tag: node
---
## 推荐文章

quote-1：《安装mysql》 如何安装mysql

quote-2：《卸载mysql》 安装mysql的过程中可能会遇到一些问题，这时可能需要卸载重装

quote-3：《workbench的使用》 workbench是一款mysql数据库的图形界面软件



## mac上mysql的安装

首先，安装mysql，mysql，一路回车，注意中间会弹个框告诉你密码，将其拷下来。

然后在系统偏好设置->MySQL里重启一下mysql服务。如果不重启，可能会导致后续操作不成功。

然后，命令行输入

```
alias mysql=/usr/local/mysql/bin/mysql  
alias mysqladmin=/usr/local/mysql/bin/mysqladmin  
```

然后再输入

```
mysqladmin -u root -p password [你的新密码]  
```

回车之后会要求你输入新密码，把之前拷下来的密码输入，然后回车，就可以了
然后输入

```
mysql -u root -p  
```

就可以运行了。
默认的用户名是root

## workbench的安装与使用

   workbench是mysql的一款图形化管理软件，安装很简单 workbench安装。本文主要介绍nodejs的mysql使用，对workbench的使用不详细介绍。使用方法网上有很多教程，请参见上面的推荐文章 quote-3

## nodejs使用mysql

   使用mysql首先要保证mysql是在运行中，查看 系统偏好设置->MySQL，如果显示绿色的 “running”，说明它正在运行。

   然后使用workbench，创建一个schema：test1，在其中创建一个表person，定义字段 name【主键】，age，job，格式都为varchar(50)。

   然后在query面板上输入sql语句 insert into test.person values('doomliu', '26', 'webdeveloper')。注意数据类型，如果值的类型不对，数据就不会插入到表中。

   接下来写nodejs文件，创建一个文件，sql-demo.js，代码如下：

```
var mysql = require('mysql');  
  
var connection = mysql.createConnection({  
    host: 'localhost',  
    user: 'root',  
    password: 'lxin41006011',  
    database: 'lxtest1'  
});  
  
connection.connect();  
  
connection.query('SELECT * FROM lxtest1.person', function (error, results, fields) {  
    if (error) {  
        throw error;  
    }  
    console.log(results)  
});  
```

可以看到，控制台上打印出了我们刚刚插入到表中的数据。