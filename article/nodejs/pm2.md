# pm2使用

## 守护进程管理

我们运行node程序时候，希望以守护进程方式运行，这样就不会每个程序占用一个终端窗口并且终端窗口终止后我们的程序也会停止运行。

pm2是一个守护进程管理工具，它可以让我们的程序以守护进程方式运行，并且提供了很多很强大的功能来保证我们的程序稳定运行。

## pm2的使用

#### 1. 运行方式：命令行和配置文件

使用pm2运行node程序有两种方式：命令行和配置文件

我们可以使用pm2命令来管理进程，进行开启或者停止等操作

```
// 运行node程序
pm2 start app.js
// 运行其他程序
pm2 start bashscript.sh
pm2 start python-app.py --watch
pm2 start binary-file -- --port 1520
// 其他操作
pm2 restart <app_name|process_id>
pm2 reload  <app_name|process_id>
pm2 stop  <app_name|process_id>
pm2 delete  <app_name|process_id>
```

也可以使用配置文件：ecosystem file

生成配置文件模板 ```pm2 ecosystem```，这个命令会生成一个ecosystem.config.js:

接下来我们就可以通过配置文件操作我们的程序了

```pm2 [start|restart|stop|delete] ecosystem.config.js```

配置文件有两个主要字段：app和deploy

其中app中配置了程序运行相关参数，deploy配置了程序部署相关参数

#### 2. 进程管理

pm2提供了一些api来管理进程

- start，启动一个进程
- stop，停止一个进程
- delete，停止一个进程，并从pm2 list中删除
- restart，重启一个进程
- reload，0秒停机重载进程（主要用于网络进程），只在cluster模式下生效
- list，获取pm2管理的运行中的进程列表

#### 3. cluster负载均衡

使用pm2启动程序有两种模式：'cluster'和'fork'，默认为fork。

两者的区别在于，cluster模式使用node的cluster模块管理进程，子进程只能是node程序，提供了端口复用和负载均衡、集群稳定的一些机制；fork模式使用node的child_process的fork方法管理子进程，子进程可以是其他程序（如php、Python），需要开发者自己实现端口分配和负载均衡的子进程业务逻辑

#### 4. 扩展集群

```
// 指定子进程数量为2
pm2 scale app 2

// 增加3个子进程
pm2 scale app +3
```
#### 5. 日志

```pm2 logs```命令用来输出pm2的日志

也可以在ecosystem.config.js中配置log_file字段来指定日志输出

#### 6. 监控

我们可以通过```pm2 monitor```或者```PM2.io```监控应用程序，提进程运行情况的信息

```pm2 web```api则会启动一个叫pm2-http-interface的web sever，监听9615端口。我们访问相应主机上的端口即可获取CPU、内存运行情况等信息

#### 7. watch模式

--watch参数用来让pm2监控文件改动自动重启

```pm2 start app.js --watch```

```pm2 stop app.js --watch```
