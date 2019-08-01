## Node 文件操作（fs）

#### 0. 前言

Node提供了文件操作的能力，具体是通过fs模块来提供的。通过对文件操作，前端可以实现很多功能。最常用的就是构建阶段的自动化，通过操作文件，我们可以对项目进行依赖分析、编译、压缩、图片等静态资源处理等等。

fs默认异步操作，通过回调获知操作后的结果，每个API都有对应的同步版本

#### 1. fs模块API

#### 1. 文件操作

1. readFile、createReadStream 读文件
2. writeFile、createWriteStream 写文件
3. unlink 删除文件
4. appendFile 文件追加内容
5. rename 重命名
6. access 判断文件权限、是否存在
7. stat 获取文件信息
8. watchFile 监听文件变化

#### 2. 目录操作

1. 创建目录 mkdir
2. 遍历目录 readdir 
3. 删除目录 rmdir