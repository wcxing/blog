#### 0. 前言

在梳理这个配置之前需要先了解一些wds的一些主要的概念

1. `inline mode`和`iframe mode`

	在实时重载的场景下，使用inline模式或者iframe模式将会让wds在reload的提示展示和客户端运行时代码的打包位置这两个方面有所不同。
	
	在`inline mode`下：reload提示在控制台；客户端处理重载的代码将被打包到每个入口bundle中，即运行时代码将“内联”到每个bundle中（这样可能造成不必要的bundle体积增大）。
	
	在`iframe mode`下：reload通过iframe的形式展示在浏览器；客户端处理重载的运行时代码会被单独打包并加载。

2. proxy

	wds提供了代理的能力，它可以将请求到wds服务器的请求代理到其它指定的地址。这给开发者开发调试提供了极大的便利性。

了解了上面这些概念后，我们看下`webpackDevServer.config.js`这个文件

`webpackDevServer.config.js`对外暴露一个方法，这个方法接收两个参数，返回wds配置。

这两个参数分别是`proxy`和`allowedHost`。

下面详细分析`webpackDevServer.config.js`文件的内容

#### 1. `webpackDevServer.config.js`方法的两个参数

1. proxy

	这个参数是`start.js`调用方法时候传进来的，实参是通过app的package.json中的`proxy`字段进行处理（`/react-dev-utils/WebpackDevServerUtils.js` - `prepareProxy()`），处理得到的proxy配置直接传给wds配置。
	
	从这个proxy的处理方式来看，我们可以通过在app的package.json中配置proxy为一个字符串（cra要求这个开发者配置的proxy必须是字符串）来指定要代理到的服务器。
	
2. allowedHost

	这个参数最终被赋值给wds配置的public字段。

#### 2. wds配置项

1. `disableHostCheck`

	是否禁用host检查。
	
	处于安全考虑，wds默认检查请求的host，即如果打到wds的请求，会做host检查，目的是为了防止不安全的请求，比如，如果wds配置了代理，请求打到wds后可以请求到代理的服务器，比如一些后端接口，那么可能造成私密数据泄露。而如果没有配置代理，因为wds只serve了public中的静态文件（通过`contentBase`属性配置），就没有什么严重的安全问题，因此cra这里的配置值是`!proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true'`，即没有配置代理可以禁用host检查，另外还支持脚手架使用者通过环境变量来控制。
	
2. `compress`

	启用gzip压缩，这里配置为`true`。给所有静态资源开启gzip压缩

3. `clientLogLevel`

	客户端日志等级，cra认为wds自带的日志没什么卵用，所以配置了`none`。这个配置值不会影响编译警告和报错，这些信息依然会展示。

4. `contentBase`

	这个属性指定wds serve的目录。wds默认serve的内容包含两部分：内存中的构建产物和当前目录。cra认为，由于本地开发其实就是模拟生产环境的场景，即让生产环境和本地开发环境保持相同的效果。因为wds构建产物已经从内存中被serve，那么既然wds还额外serve了当前目录，由于本地和生产环境一致，所以生产环境也应该将当前目录的所有文件拷贝过去，但是，拷贝所有的当前目录文件会让一些隐秘的文件暴露。因此cra的选择是，配置`contentBase`为`public`目录，即一些不经过构建的文件。这样由于cra构建时候会将public目录下的文件都拷贝到输出目录，因此生成环境和本地环境都可以通过请求根路径直接访问到`public`下的文件。
	
5. `watchContentBase`

	默认对于`contentBase`下的文件改动，wds不会触发reload，因此cra配置这个选项为`true`，当`public`目录下的文件改动，也会触发重新编译和reload。

6. `hot`

	wds默认监听相关文件改动，进行自动刷新的。而如果想要开启模块热重载而不是使用wds简单的默认的自动reload功能，就需要配置这个属性为`true`，cra在此配置了`hot`为`true`。如果wds配置了这个属性，默认会引入`webpack.HotModuleReplacementPlugin`，这样就完全开启模块热重载功能了。
	
	cra在这里配置后，css已经可以做到模块热重载了，因为在`development`环境下，使用`style-loader`处理样式，将编译好的样式代码作为style元素插入到页面中，【可能是由于`sass-loader`和`style-loader`实现了wds的HMR接口】因此css已经有模块热重载的效果了，即改变sass代码后style标签上的样式也会相应变化。但是js还并没有模块热重载的效果，因为js代码变动后，`webpack`及`babel-loader`、`babel`插件等并不知道一次变化应该对应什么样的操作。所以我们需要在项目中加入react的热重载的代码（`react-hot-loader/root`），这样才能让文件变化后，react根据文件改动计算出变化后的组件和dom节点，然后进行dom替换。
	
7. `transportMode`

	这个属性用来控制wds的websocket模式，默认使用`sockjs`，这是一个提供全双工通信的js库，提供node端（`sockjs-node`）和客户端支持，cra在这里配置为`ws`，原因是cra在`development`环境下，引入了wds客户端代码以在浏览器上展示错误提示，这个wds客户端代码使用原生的websocket来连接服务器，因此要求wds提供的全双工通信也是websocket。
	
8. `injectClient`

	是否给打包后的代码中注入wds客户端代码，cra配置这个为`false`，是因为cra加载了自定义的客户端代码，因此不需要默认的客户端代码。

9. `sockHost sockPath sockPort`

	这3个用来自定义访问wds的websocket的host、path和port，都是根据环境变量配置的
	
	【不知道这个具体在什么场景下有用】
	
10. `publicPath`

	这个字段定义了wds支持的访问路径，默认是`"/"`。
	
	wds配置中的`publicPath`与`webpack.config.js`中的`output.publicPath`不同。wds的这个配置定义了wds serve资源的访问路径，而`webpack.config.js`中的配置会让webpack打包时候将静态资源的引用路径增加这个前缀。官网推荐`webpack.config.js`中的配置和wds中的这个配置保持一致。
	
11. `quiet`

	禁用wds默认日志，cra使用自己的日志
	
12. `watchOptions.ignored`

	排除监听一些目录下的文件，以减少cpu损耗
	
	cra忽略了`node_modules`，但是保留了appPath中src目录下的`node_modules`
	
13. `https`

	wds支持https，也支持使用默认的证书

	这个选项是使用https访问wds的配置项，cra配置的是根据环境变量的配置决定是否支持https，也可以根据环境变量提供自己的证书和秘钥文件
	
13. `host`

	host默认`0.0.0.0`，这样就支持外部使用ip访问。`host`也支持通过环境变量配置。

14. `overlay`

	错误或者警告时候，浏览器端全屏展示相关信息
	
	cra禁用了此功能（`overlay: false`），因为cra自己提供了相关的能力
	
15. `historyApiFallback`

	```
	{
		disableDotRule: true,
	   index: paths.publicUrlOrPath,
	}
	```
	
	`disableDotRule `为`true`支持dot路由，否则dot路由会访问失败
	`index`设置为发布路径，保证访问fallback时候wds能正确查找到入口html
	
16. `public`

	告诉内联模式的客户端代码连接地址。
	
	【不了解具体应用场景】

17. `proxy`

	参考上面说明的参数

18. `before`和`after`

	wds提供了这两个钩子注册dev-server的中间件，`before`是在需要在dev-server自带中间件之前注册的中间件，`after`是在之后的。
	
	这里需要注意的是，wds支持用户在项目src目录下的`setupProxy.js`中配置代理中间件，来进行代理的设置。
	
	【还有几个其他的中间件，暂时不了解作用】