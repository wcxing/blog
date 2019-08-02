## Node模块

#### 0. 前言

commonjs是JavaScript的社区规范，目的是为了让JavaScript可以弥补JavaScript缺乏标准的缺陷。commonjs规范内容包括模块、二进制、buffer、字符集编码、io流、进程环境、文件系统、套接字、单元测试、包管理等。

Node借鉴commonjs的Modules规范实现了一套模块系统。

对于使用者来说，我们关注的是模块如何使用，即如何定义模块、如何引用模块。

而当涉及到了原理层面，我们希望知道Node模块的分类以及如何实现模块的引用

#### 1. 模块语法

- 模块定义 require
- 模块引用 exports.attr = ''; module.exports = {};
- 模块标识 字符串、相对路径、绝对路径

#### 2. 模块类型

- 核心模块 nodejs内置模块，如http、fs等，这些已经编译为二进制代码，加载速度最快
- 文件模块 用户自定义模块
	- 路径形式的文件模块 
	- 自定义模块 

#### 3. 模块引入步骤

首先，Node对加载过的模块都有缓存，二次加载时候会更快

1. 路径分析，首先根据模块类型（核心模块、路径形式的模块、自定义模块）确定引入方式
2. 文件定位，对于核心模块和路径形式的文件模块，比较容易定位，对于自定义模块，会查找这个模块对应的目录数组，然后逐个尝试各个路径，最终定位模块。如果最终没有定位到模块，会抛出异常
3. 模块编译，Node编译模块时候进行头尾包装，隔离作用域

#### 4. 兼容多种模块规范

```

;(function (name, definition) {
    // 检查上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function',
    // 检查上下文环境是否为Node
        hasExports = typeof module !== 'undefined' && module.exports;
    if (hasDefine) {
        define(definition);
    }
    else if (hasExports) {
        module.exports = definition();
    }
    else {
        this[name] = definition();
    }
})('hello', function () {
    var hello = function () {};
    return hello;
});

```
