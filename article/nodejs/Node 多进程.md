## 0. 单线程和多进程

多线程服务模型在很多web服务器上得到使用（如Apache），一个线程服务一个请求。这种模型带来的问题是较大的内存和上下文切换开销。

一些web服务器采用单线程、事件驱动的方式，如Nginx、node，减少了内存和上下文切换开销。

单线程的问题是，不能很好地利用多核cpu。因此node提供了多进程的能力，通过```child_process```模块管理子进程。

## 1. node进程和子进程

使用node执行一个脚本就会启动一个进程，脚本及其依赖的模块可以在```process```全局变量中访问进程相关信息

```child_process```模块用于操作子进程，比如```spawn()```、```exec()```、```execFile()```、```fork()```，每个方法对应不同参数。可以执行shell或启动一个可执行文件或者执行js脚本

使用多进程架构的node web服务器通常使用master-worker的主从架构，即一个主进程和受主进程管理的多个子进程。

## 2. 进程间通信

使用```send```和```on('message')```通信，示例如下

```

// parent.js

var child_process = require('child_process');

var child = child_process.fork('./child.js');

child.on('message', function(m){
    console.log('message from child: ' + JSON.stringify(m));
});

child.send({from: 'parent'});


// child.js

process.on('message', function(m){
    console.log('message from parent: ' + JSON.stringify(m));
});

process.send({from: 'child'});

```


## 3. 集群稳定

#### 进程其它操作

除了"message"，进程还有其它事件可以被监听：

- error
- exit
- close

```disconnect()```方法用于关闭IPC通道

```kill()```方法用来给进程发送一个SIGTERM信号，进程通过```process.on('SIGTERM', callback)```来监听

另外进程上还有```stdin```、```stdout```对象，标识进程的标准输入输出

#### 自动重启的最佳实践

1. 进程触发```exit```事件时，父进程将此进程从子进程集合中删除，并重新创建一个进程，加入到子进程集合中
2. 子进程监听到未被捕获的异常时候，停止接收新连接，等已有连接断开后退出进程，这样父进程监听到子进程退出就会自动重启了
3. “自杀信号”：基于第二步改进，子进程监听到未被捕获的异常时候，停止接收新连接，并发送一个“自杀信号”给父进程，父进程重新创建一个子进程，子进程等已有连接断开后退出进程
4. 断开连接的操作设置一个超时时间，超时强制退出
5. 限制单位时间重启的子进程个数

#### 负载均衡

负载均衡是服务器用于保证多个处理单元工作量公平的策略

负载均衡可以让服务对系统资源利用率更高

具体实现时master进程根据一定的策略将任务分配给worker进程

node提供了一种策略```Round-Robin```，轮叫调度，即任务依次分发。cluster中通过```cluster.schedulingPolicy```来进行设置

#### 状态共享

node不允许在多个进程间共享数据，因此需要一种方案来实现多进程间数据共享

多个进程之间共享数据的方式是用第三方数据存储，每个进程都可以对其进行访问。对第三方数据存储进行监听有不同方式

1. 每个进程定时轮询
2. 设置一个通知服务，定时轮询第三方存储，并实时通知各个子进程。当然子进程需要做一些工作：第一次启动时候读取一次第三方存储，然后将自己的信息注册到通知服务

## 4. cluster

cluster模块时child_process和net模块的组合应用。

#### 两种创建集群的方式

1. 每个子进程监听不同端口，主进程监听主端口（80）再由主进程向子进程分发请求
2. 主进程监听端口，并将请求转发给子进程，子进程监听同一端口

cluster使用第二种方式实现，cluster使用示例如下

```
// server.js
var cluster = require('cluster');
var cpuNums = require('os').cpus().length;
var http = require('http');

if(cluster.isMaster){
  for(var i = 0; i < cpuNums; i++){
    cluster.fork();
  }
}
else{
  http.createServer(function(req, res){
    res.end(`response from worker ${process.pid}`);
  }).listen(3000);

  console.log(`Worker ${process.pid} started`);
}

```

#### master和worker的通信

cluster.fork()方法是通过child_process.fork实现的，因此可以通过message实现进程间通信

#### 如何实现端口共享

通过上面示例代码可以看到，多个子进程监听了相同的端口。通常如果不同的进程监听相同的端口会报错。那么cluster是如何实现多个子进程监听相同端口的呢？

net模块中的listen会进行判断，如果是在主进程中，则监听相应端口，如果实在子进程中，则只是建立IPC管道，等待父进程传递socket句柄然后进行处理。父进程接收到请求后，会将socket句柄传递给子进程，由于子进程使用父进程传递的句柄，对应同样的文件描述符，因此不会有冲突

#### 如何实现请求转发

每当worker进程创建server实例来监听请求，都会通过IPC通道，在master上进行注册。当客户端请求到达，master会负责将请求转发给对应的worker。

## 参考

[Nodejs学习笔记](https://github.com/chyingp/nodejs-learning-guide)


