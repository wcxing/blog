build.js的操作

1. 先检查包依赖树，检查版本匹配情况
2. 检查browserList是否正常设置
3. 计算构建前资源的大小
4. 清空构建目录，准备开始构建
5. 拷贝public目录到输出目录，这样public中的静态资源可以通过输出目录部署的url地址访问
6. 开始构建，使用webpack的node cli，加载`webpack.config.js`模块，传入`env = 'production'`生成构建用的webpack配置
7. 构建完后，打印相关信息