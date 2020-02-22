#### 0. 前言

create-react-app是用来创建React项目的脚手架工具，使用它可以迅速创建出一个React项目。它还支持我们自定义项目构建、本地服务和单测部分，并且支持自定义项目模板。另外它也支持我们创建项目完成后，修改项目的构建的实现。

create-react-app使用了React作为开发框架，使用webpack及一些插件、loader作为构建支持，使用jest提供单测的能力。

本文简单介绍create-react-app，包括

1. create-react-app的使用
2. cra项目结构
3. cra执行流程
4. 并介绍如何基于create-react-app做扩展，实现满足自己项目需求的脚手架或项目的初始架子
5. 开发过程中的一些实用细节
6. 新版本的变化

本文主要针对3.3.0及以上版本进行说明。

#### 1. create-react-app的使用

首先安装create-react-app到全局，然后就可以使用它创建项目脚手架了。如果不全局安装，也可以使用npx命令来执行。

注意老版本的create-react-app和新版本的react-scripts不兼容，因此如果本地安装过create-react-app，可以卸载重装最新版本或者用npx加`--ignore-existing`参数来使用。如果卸载不了，mac下可以用`which creact-react-app`命令找到其位置，`rm -rf <path-to-cra>`删除。

最初级的用法就是，使用create-react-app这个命令创建一个支持React的项目，同时这个项目提供start命令来进行本地调试、提供build命令进行构建、提供test命令支持单测的功能。

如果项目初始化好了之后，需要修改构建相关的功能（比如需要修改webpack配置以支持某些css预编译语言），可以通过eject命令来将构建和本地开发相关的代码“弹出”，这样就可以修改相关代码来满足自己项目的相关需求了。

如果需要定制自己的命令工具，比如希望定制自己的build的功能、定制start本地开发调试的功能和配置、定制test单测的功能，可以通过自己实现react-scripts，然后在使用create-react-app命令创建项目时候添加 --scripts-version <custom-react-scripts>来实现。定制自己的react-scripts时候，最好基于cra提供的react-scripts添加一些自己需要的支持，而不要自己单独实现一套，因为cra提供的react-scripts中包含了很多通用的支持和最佳实践，比如打包策略和开发环境的一些常用配置的最佳实践。

如果需要定制自己的项目模板，比如希望将React生态，包括redux、react-router整合到项目里，并且封装一些开发常用的工具，将这些代码作为一个更定制化也更完善的项目模板，可以通过自己实现一个template，然后在使用create-react-app命令创建项目时候添加 --template <custom-template>来实现。另外，也可以在自己实现react-scripts中的init命令中，指定模板下载并拷贝到我们的项目目录中。

我们接下来分析一下create-react-app的源码

#### 2. create-react-app的项目架构

严格地说，create-react-app是一个**脚手架生成工具**，它用可以来创建一个脚手架。

create-react-app项目可以分成3层

1. 创建脚手架层
2. 脚手架命令行层
3. 项目开发模板层

cra的设计为什么要分成3层呢？如果让我们自己设计一个简单的脚手架，就是先写一个项目模板，然后写一个命令行工具，执行命令后从远程将模板下载到本地。可以看出来，我们的这个设计扩展性很差，一个命令行只能下载对应的模板，而模板里已经把构建、本地开发等支持写死了，很难基于这样的架构做一些扩展。

cra这种架构设计可以提供非常大的扩展能力。

cra的架构设计基于以下考量

1. 一个React脚手架的基本能力，就是安装React相关的依赖，包括react，react-dom。这也是所有React脚手架的通用能力。
2. 不同的React脚手架提供的构建、本地开发等命令行支持可以根据项目需求自己定制。
3. 对于React脚手架，相同的构建、本地开发支持也可能对应不同的开发模板，即工具库、组件库、ajax、路由、状态管理等这些开发中需要的支持。

是以，cra分成3个层，第一层是create-react-app这个命令，它只提供基本的react，react-dom的依赖安装，并且使用可自定义的react-scripts来执行项目初始化工作，我们可以通过实现自己的react-scripts来定制自己的构建、本地开发、单测的命令行支持，这是第二层。第三层是项目的开发模板，可以通过在create-react-app命令的 --template参数中指定模板，这样一个命令行支持可能对应不同的开发模板。

对于第二层和第三层，cra都提供了默认的支持。即react-scripts和cra-template，可以满足大部分的项目的基本需求。当然处于通用性考虑，cra-template中并没有状态管理、路由等支持，而react-scripts里面也只有sass的支持而没有stylus和less和其他css模块化方案的支持，如果项目有相关需求，就需要自己定制了。

create-react-app项目使用lerna管理，它将多个库放在一个项目中管理，不同的库可以单独发布和进行git管理。核心代码都在/packages目录下

create-react-app的项目中，关键的目录有3个

- create-react-app
- react-scripts
- cra-template

其中create-react-app是创建脚手架的命令行实现；react-scripts是cra提供的默认的项目命令行支持，cra-template是cra提供的默认的项目开发模板。

下面看下cra的执行过程。

#### 3. create-react-app的执行流程

create-react-app命令中有几个关键的函数

- createApp（参数校验和处理）
- run（执行主流程）
- getInstallPackage（获取命令行支持（react-scripts）包名）
- getTemplateInstallPackage（获取自定义模板包信息包名）
- getPackageInfo（根据包名获取包信息）
- install（安装依赖）
- executeNodeScript（执行node命令）

create-react-app的执行过程可以描述如下

1. 执行createApp函数，进行参数校验和处理，然后调用run函数执行主流程，下面的流程都是在run函数中执行的。
2. run函数首先调用getInstallPackage和getTemplateInstallPackage，根据传参得到处理过的命令行支持包的包名和模板包名。
3. 然后调用getPackageInfo根据包名得到包的信息。
4. 然后调用install安装必要的依赖（包括react，react-dom和命令行支持包、模板包等）到我们指定的项目目录。
5. 安装依赖完成后，执行react-scripts包中的init.js文件，进行项目初始化。
6. react-scripts命令执行init.js方法，这个方法用来进行项目的内容的初始化，包括package.json、gitignore、README.md等文件的初始化，还会将模板从安装的目录中拷贝到我们指定的项目目录中，然后根据模板中package.json中的dependencies字段安装所需依赖，最后卸载掉这个模板。

由于init.js将模板拷贝到项目中后还进行了依赖安装，因此初始化项目完成后可以直接运行项目了。

以上就是我们执行create-react-app命令后的整个过程。

#### 4. 如何基于create-react-app做扩展

主要有3中方式，可以根据项目需求选择方式定制自己的项目脚手架。

1. 我们可以定制自己的react-scripts，然后执行create-react-app命令时候指定我们自己的react-scripts版本，`create-react-app --scripts-version @custom/react-scripts`，这样create-react-app会根据传入的 `--scripts-version`参数下载相应的包，然后执行包中的`/scripts/init.js`文件，并把相应的参数传进去，也就说，需要我们实现一个`init.js`，它导出一个方法，执行整个初始化流程。
2. 我们可以定制自己的template，然后执行create-react-app命令时候指定我们自己的template，`create-react-app --template my-template`。
3. 我们使用create-react-app命令初始化好项目后，执行`npm run eject`命令将构建和本地开发等命令行支持及配置“弹出”到项目里面，我们在项目里修改这些配置文件和脚本，即可满足我们自己的相关需求。

#### 5. 开发过程中的一些实用细节

1. 环境变量

	react-scripts支持我们配置一些环境变量来控制构建和本地调试过程。我们可以在项目根目录创建`.env`和`.env.development`文件，在其中加入一些环境变量配置，比如`PUBLIC_URL`用来控制webpack的发布地址、`SKIP_PREFLIGHT_CHECK`用来控制build之前是否需要进行依赖检查。
	
	实现的原理是，react-scripts使用`dotenv`这个库解析了根目录下的`.env`和`.env.development`文件（如果存在），解析成key-value形式，然后根据这些变量进行构建过程的处理（比如根据`PUBLIC_URL`设置webpack的output.publicPath值）。
	
	react-scripts解析环境变量后，不仅用于构建过程处理，还会将所有的env变量用`webpack.DefinePlugin`插件导入到项目运行时代码中，js通过`process.env.PUBLIC_URL`来访问，html中通过`%PUBLIC_URL%`来访问。所以我们可以自定义一些环境变量，用于实现某些业务逻辑。
	
2. react-scripts中的babelrc-loader设置的.babelrc为false，因此项目中配置的.babelrc不会生效。
3. 我们如果自定义模板，可以考虑在模板中添加.editorconfig配置文件，以实现多人开发时候的代码格式统一，然后在编辑器中安装editorconfig插件，编辑器就可以根据配置做一些操作（比如自动在尾部加空行、自动trim尾部空格、tab）。
4. react-scripts中的build.js在构建中，会将public目录下的文件拷贝到输出目录，因此线上都是通过根目录访问的。这些文件的访问要注意加参数去缓存。
5. react-scripts支持模块热重载（在webpack.config.js中的development环境中开启了HotModuleReplacementPlugin插件，并且devserver中配置hot为true）。对于stylus等样式预编译和style-loader，实现了HMR接口，因此改变stylus文件并保存后，可以不刷新浏览器就能看到结果，注意不能使用mini-css-extract-plugin。而对于React也实现了HMR接口，在导出组件时候，用相应的高阶组件hot包裹即可实现热重载功能。

	```
		import {hot} from "react-hot-loader/root";
		
		export default hot(() => <div id="app">hello, world</div>);
	```