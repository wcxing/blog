## Node 网络编程

#### 0. 前言

Node提供了网络编程的能力。让开发者可以实现网络收发的功能。利用Node提供的模块，我们可以很轻松地实现发起网络请求和接受请求并返回响应（server）的功能。

Node提供了3个主要的用于网络编程的模块：net、dgram和http。其中，net用来实现TCP数据传输；dgram用来实现UDP数据传输；http则用来实现http协议的数据传输。每个模块都提供了API用来发送请求和接受请求并响应。

对于网络请求的发送，我们关注的API是

- 如何发送请求
- 如何接受响应

而对于server的实现，我们关注的API是

- 如何监听端口
- 如何接受请求
- 如何返回响应

下面我们通过代码示例来看下我们关注的API

#### 1. net

```

// server.js

var net = require('net');

var PORT = 3000;
var HOST = '127.0.0.1';

// tcp服务端
var server = net.createServer(function(socket) {
    console.log('客户端已连接');

    socket.on('data', function(data) {
        console.log('服务端：收到客户端数据，内容为{'+ data +'}');

        // 给客户端返回数据
        socket.write('你好，我是服务端');
    });
});

server.listen(PORT, HOST, function() {
    console.log('服务端：开始监听来自客户端的请求');
});

// client.js

const net = require('net');
const client = net.createConnection({ port: 8124 }, () => {
  //'connect' listener
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});

```

我们可以看到使用net模块需要调用其方法创建client或者server

client.write()用来发送请求；client.on('data')用来接收响应

server.listen用来监听端口；创建server的回调中的socket实例可以用来接受请求数据（```socket.on('data')```）；socket.write()用来返回响应

#### 2. dgram

```

server.js

// 例子：UDP服务端
var PORT = 33333;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
});

server.bind(PORT, HOST);
然后，创建UDP socket，向端口33333发送请求。

client.js

// 例子：UDP客户端
var PORT = 33333;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var message = Buffer.from('My KungFu is Good!');

var client = dgram.createSocket('udp4');

client.send(message, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
    client.close();
});

```

diagram.createSocket()用来创建一个client或者serve

client.send()用来发送请求

server.bind()用来监听端口；server.on('message')用来接受请求

#### 3. http

```

var http = require('http');

// http server 例子
var server = http.createServer(function(serverReq, serverRes){
    var url = serverReq.url;
    serverRes.end( '您访问的地址是：' + url );
});

server.listen(3000);

// http client 例子
var client = http.get('http://127.0.0.1:3000', function(clientRes){
    clientRes.pipe(process.stdout);
});

```

http.get()方法直接发送请求，http.createServer()用来创建一个server（回调中的req和res都是Stream类型的实例，使用Stream相关的接口可以处理数据）

http.get()方法用来发送请求；回调参数clientRes用来接收响应

server.listen()用来监听端口；createServer创建server的回调中的req参数用来接受请求（```req.url```）；res.end()方法用来返回响应

我们web server最常用的是http模块。目前主流的Node web server 框架express和koa就是对http模块的封装。这些框架的封装主要屏蔽了请求解析的细节，比如通常我们使用的路由功能，都是框架对请求的url进行解析，然后找到使用框架的开发者注册的路由对应的响应方法调用，就实现了相应的功能

#### 4. https

https用法与http很像

https客户端：

```
var https = require('https');

https.get('https://www.baidu.com', function(res){

    res.on('data', function(data){
        process.stdout.write(data);
    });
});

```

可以看到，https客户端用法与http类似。需要考虑的问题是，如果访问的网站安全证书不受信任，https模块会报错。有两中方法可以访问证书不受信任的网站

代码执行方式是：

```https.get(options, callback)```

options中包括访问的url和其他配置信息信息

1. options中配置忽略安全警告
2. options中配置证书（需要提前下载）

https server端：

创建https server需要证书，执行如下：

```https.createServer(options, callback) ```

options中配置了私钥和证书文件路径。证书和私钥可以通过购买或者使用```openssl```工具生成。