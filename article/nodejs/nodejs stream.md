## 流的概念

计算机处理数据时候，可能有不同的情况：可能拿到需要的全部数据进行处理，再输出结果；也可能拿到数据的一部分，然后处理这部分并输出结果，然后再取数据、处理、输出结果，直到处理完所有的数据。

对于第二种情况，有一些场景

比如，直播时候的流媒体，就是等到网络中的音视频数据传递过来时候存入buffer，然后不断播放buffer中的数据

比如，如果需要读取一个较大文件进行处理，就需要一点一点读入数据到内存，处理完后释放内存，否则内存无法容纳这么多的数据

计算机中流的概念就是对这种场景下这种数据操作方式的抽象

那么流这种抽象应该包含哪些接口呢？

因为读写流的具体操作对于不同应用（比如文件读写和网络收发等）都是不同的，因此流只是分块读入或者分块写入时候抛出一系列事件让应用层代码处理。比如读数据流ReadStream应该读入一块数据之后就抛出'data'事件，将读入的数据抛出；读入数据完成后抛出'end'事件等等

另外，可能有需求是将一个流里的数据导入另一个流中，Node中Stream通过pipe()方法定义这种操作

## Node stream

流是一个抽象接口，被Node中很多对象实现

- http模块的request、response
- process.stdin、process.stdout
- net模块的socket
- fs.createReadStream()
- zlib.createDeflate()

Node中有4中基本的流类型

- Readable：用来读取数据，比如 fs.createReadStream()
- Writable：用来写数据，比如 fs.createWriteStream()
- Duplex：可读+可写，比如 net.Socket()
- Transform：在读写的过程中，可以对数据进行修改，比如 zlib.createDeflate()（数据压缩/解压）

每种类都有自己相应的方法

所有的Stream对象都是EventEmitter的实例，常用事件有

- data 当有数据可读时触发。

- end 没有更多的数据可读时触发。

- error 在接收和写入过程中发生错误时触发。

- finish 所有数据已被写入到底层系统时触发。

常用的方法有

- read() 读入流
- write() 写入流
- on() 监听事件
- pipe() 输出到另一个流

下面是代码示例

```

// read()

const fs = require('fs');

var readable = fs.createReadStream('./test.js');

readable.setEncoding('UTF8');

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read(100))) {
    console.log(`接收到 ${chunk.length} 字节的数据`);
  }
});


```

```

// write()

const fs = require('fs');
const writeStram = fs.createWriteStream(./test.js);
writeStram.write('hello world');
writeStram.end();

```

```

// on()

const fs = require('fs');

const readStream = fs.createReadStream('./test.js');
const content = '';

readStream.setEncoding('utf8');

readStream.on('data', function(chunk){
	content += chunk;
});

readStream.on('end', function(chunk){
	// 文件读取完成
	console.log('文件读取完成，文件内容是 [%s]', content);
});

```

```

// pipe()

// 将input.txt内容复制到output.txt中
const fs = require('fs');

const readStream = fs.createReadStream('./input.txt');
const writeStream = fs.createWriteStream('./output.txt');

readStream.pipe(writeStream);

console.log('执行完毕');

// 压缩
const fs = require('fs');
const zlib = require('zlib');

fs.createReadStream('./input.txt')
	.pipe(zlib.createGzip())
	.pipe(fs.createWriteStream('input.txt.gz'));

console.log('执行完毕');
	
// 解压
const fs = require('fs');
const zlib = require('zlib');

fs.createReadStream('./input.txt.gz')
	.pipe(zlib.createGunzip())
	.pipe(fs.createWriteStream('input.txt'));

console.log('执行完毕');

```