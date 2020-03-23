start.js的操作

1. 引入环境变量
2. 检查依赖树
3. 检查必需的文件（项目目录下的`public/index.html`和`src/index.js`）
4. 检查package.json文件中的browserList字段是否有效
5. 选择一个端口，如果默认的端口号被占用，则递增端口号，直到找到一个未被占用的端口
6. 调用`webpack`，根据配置文件（`webpackDevServer.config.js`）生成compiler
7. 计算serverConfig
8. 根据compiler和serverConfig，调用`webpack-dev-server`创建dev-server实例，并监听相应端口，启动本地服务。