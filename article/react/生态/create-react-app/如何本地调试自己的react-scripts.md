#### 0. 前言

cra支持我们自定义react-scripts和template，来定制脚手架。

一般情况下，我们的react-scripts和template都是配套的，当然也可能一个react-scripts对应多个template。

我们开发好自己的react-scripts后，可以发布到git远程仓库或者发布到npm上，就可以使用create-react-app命令，用`--scripts-version`参数指定我们的react-scripts，就能生成一个我们自己的脚手架了。

下面介绍下如何本地调试我们自己的react-scripts

#### 1. 使用本地react-scripts创建脚手架步骤

1. 首先从create-react-app仓库中克隆一个react-scripts项目，放到本地，比如放到`/demo`目录下。（或者克隆一个create-react-app项目，然后把react-scripts目录复制出来）。修改目录名为`my-react-scripts`。
2. 在my-react-scripts中做一些改动，比如将`paths`目录中的构建目录改为`dist`（cra的react-scripts的目录是`build`）
3. 然后拼接出file协议下的本地my-react-scripts目录`file:///demo/my-react-scripts/`
4. 执行命令`npx create-react-app myapp --scripts-version file:///demo/my-react-scripts`

这样就可以生成一个由我们本地的my-react-scripts构建出来的项目了。

进入myapp目录，运行`npm run build`可以看到输出目录已经变成了`dist`。

#### 2. 开发react-scripts步骤

我们可以在myapp中进行打包和本地开发的调试，在node_modules中找到"my-react-scripts"在其中修改构建相关的代码，然后`npm run build`或者`npm start`查看效果。调试好之后，将改动的代码拷贝到my-react-scripts中。

我们也可以在myapp中进行模板的开发，比如添加状态管理、路由、工具库；指定目录结构等，然后myapp目录去掉node_modules目录后就可以作为template写到my-react-scripts中。再修改my-react-scripts中的init.js脚本，指定模板为我们自己的模板，这样就可以push到远端了。