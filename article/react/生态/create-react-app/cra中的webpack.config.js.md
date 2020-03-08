## webpack.config.js中的配置

cra的react-scripts中的webpack.config.js提供的不是一个webpack的配置对象，而是一个产生工厂方法，根据环境参数返回一个webpack的配置对象

cra的react-scripts中提供的webpack.config.js中的常用配置，包括

- mode // 设置构建的模式，取值决定一些插件的使用
- bail // 值为true的话，在第一个错误出现时候，抛出失败结果
- devtool // 控制source-map
- entry // 打包入口文件，这里是个数组，即把数组中的几个入口文件的依赖树打包成一个文件
- output // 输出的一些配置
- optimization // 优化的配置
- resolve // 配置模块如何解析
- resolveLoader // 配置webpack的loader的解析
- module // 决定如何处理项目中的模块
- plugins // webpack插件列表
- node // 提供nodejs的polyfill配置
- performance // 关于是否打印资源超过指定限制的配置

#### 1. mode

mode是根据传入的环境参数判断是生产环境还是开发环境。

#### 2. bail

#### 3. devtool

如果是生产环境，默认不使用source map，但是如果在.env文件中配置了GENERATE_SOURCEMAP的话，就会配置成source-map

对于开发环境，用cheap-module-source-map。【eval-cheap-module-source-map的重构建速度应该更快一点】

#### 4. entry

entry中引入了`react-dev-utils/webpackHotDevClient`这个模块，这个文件是用来展示错误信息的。它连接了WDS的websocket，并且在重编译时候的信息，包括报错等事件触发时候，做出展示相关错误的操作。错误提示是引入了`react-error-overlay`模块，这个模块创建了一个无src的iframe，并操作其中的元素来渲染错误信息。

`path.appIndexJs`是项目目录里面的index.js文件。

paths.js文件提供了几个必要的文件的绝对路径。路径的计算的方法是，通过fs.realPath(process.cwd())计算出命令执行时候的目录（即指定的初始化app的目录）的绝对路径 appDirectory，然后通过path.resolve，根据一些文件的相对app根目录的路径拼出一些文件的**绝对路径**。

#### 5. output

这里也有几个参数

1. path

	构建后资源的输出目录
	
	如果是生产环境，就是项目目录下的`build`目录，如果是生产环境，就是`undefined

2. pathinfo

	告诉webpack在bundle中引入所包含模块信息的相关注释，default: false
	
	生产环境false，开发环境true
	
3. filename

	这个选项控制每个bundle的命名
	
	生产环境用`static/js/[name].[contenthash:8].js`。注意，`hash`是构建相关的hash，`chunkhash`是每次构建
	
	关于hash、chunkhash和contenthash，有一篇文章写的比较详细
	
	> **hash**：在 webpack 一次构建中会产生一个 compilation 对象，该 hash 值是对 compilation 内所有的内容计算而来的。
	
	> **chunkhash**：每一个 chunk 都根据自身的内容计算而来。它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。

	> **contenthash**：根据文件内容计算而来。
	
	—— [webpack hash chunkhash contenthash浅析](https://segmentfault.com/a/1190000020104777)
	
	【cra的这项配置成contenthash，应该是考虑到可能有分包优化可能将一个入口打包成多个切片，这样只有使用contenthash才能保证输出的bundle的最佳缓存效果】
	
4. futureEmitAssets

	不知道干啥用的

5. chunkFilename

	非入口文件的bundle命名，比如动态import()引入的异步模块

6. publicPath

	这个选项配置输出的静态资源发布路径，webpack会在代码运行时静态资源的引用链接前拼接此参数，以便可以正确访问到资源
	
	cra的react-scripts中的webpack.config.js中的这个选项是在paths文件中，通过`getPublicUrlOrPath`方法计算得到的
	
	这个参数可以在.env文件中配置，也可以在项目模板中的package.json中配置，但是development环境中只使用pathname配置publicPath
	
7. devtoolModuleFilenameTemplate

	这个配置项用来控制source，map的访问路径，配置完之后，构建一下，可以在source map文件的sources数组中看到效果。
	
	比如项目需要把source map文件放到内网，防止代码被泄露，这时候可以通过配置该选项实现。这种需求除了需要配置这个属性外，还需要配置打包后的代码文件的末尾的source map指向`sourceMappingURL`，这个可以使用插件`SourceMapDevToolPlugin`来实现，这个插件用来更细粒度地配置devtool。
	
	[[FE] SourceMapDevToolPlugin 和 optimization.minimizer](https://www.jianshu.com/p/d9bb3a7336f6)
	
8. jsonpFunction

	这个选项用来防止多个webpack运行时运行在同一个页面上的时候可能会有冲突。
	
	webpack运行时是会在window上挂一个变量，用来进行异步模块加载。如果每个webpack打包的运行时文件的这个全局变量名都一样的话，那么可能会导致冲突。`jsonpFunction `这个选项定义了webpack运行时代码的异步加载全局变量名称。
	
	cra的react-scripts这里取值是`webpackJsonp${appPackageJson.name}`和当前包名关联，这样就在很大程度上避免了冲突。
	
9. globalObject

	当打包库文件为UMD规范时候，这个选项用来指定全局变量名称，默认是'window'。如果在nodejs环境而不是浏览器环境，应该配置为'this'。
	
	这里这个选项配置为'this'，对于打包项目没有影响，打包UMD库时候，则可以兼容浏览器环境和node环境。
	
	【webpack为什么默认不设置成'this'？】

#### 6. optimization

1. minimize

	告诉webpack压缩bundle，默认使用TerserPlugin进行压缩，也可以在minimizer选项中指定插件进行压缩。默认production环境为true
	
	这里配置的是生产环境为true。【是否有些多余？】
	
2. minimizer

	这个选项可以指定插件来进行代码压缩，或者指定TerserPlugin的一些配置。
	
	这里使用了两个插件：`TerserPlugin`用来压缩js代码，`OptimizeCSSAssetsPlugin`用来压缩css代码。
	
	首先看一下TerserPlugin，相对于uglifyjs，TerserPlugin支持es6的压缩。这里配置了几个TerserPlugin的选项
	
	1. terserOptions

		这是用来配置TerserPlugin压缩的几个选项
		
		- parse

			配置TerserPlugin的解析规则，这里配置了`ecma`为8，即支持解析es2017的语法
		- compress

			配置此选项以控制压缩过程的一些处理规则

			- ecma

				用来设置转换后的结果的语法标准，比如如果项目适配的浏览器都支持es6，那可以配置该选项为2015，这样压缩后的结果更小。这里设置的是5，即最终转换为es5语法。【默认是5，是不是多余？】
			
			- warnings

				是否展示压缩提示。当压缩过程中遇到警告（比如不可达代码、声明代码未使用）是否展示。这里配置为false。【默认也是false】
				
			- comparisons

				对比较运算符的优化，默认是true，这里配置的false。原因是terser有已知的bug，会导致正常的代码解析问题，进而导致压缩失败。
			
			- inline

				函数内联用来降低运行时计算开销，因为每次函数调用都会耗费计算资源，所以代码压缩过程中会考虑将简单函数进行内联
				
				比如
				
				```
				function square(x) {
				  return x * x;
				}
				 
				function f(x) {
				  var sum = 0;
				  for (var i = 0; i < x; i++) {
				    sum += square(i);
				  }
				  return sum;
				}
				```
				
				会被改造成
				
				```
				function f(x) {
				  var sum = 0;
				  for (var i = 0; i < x; i++) {
				    sum += i * i;
				  }
				  return sum;
				}
				```
				
				terset提供的这个选项支持配置内联函数级别
				
				`false`: 和`0`相同
				`0`: 不内联
				`1`: 内联无参函数
				`2`: 内联带参函数
				`3`: 内联带参数和变量的函数
				`true`: 和`3`相同
				
				这里配置了2，默认是true
				
		- mangle

			这个选项控制混淆相关的操作。它下面有几个配置项，这里只配置了`safari10 `
			
			- safari10
				
				这个选项用来让terser兼容safari10的一些bug，默认为false，这里配置`true`
				
		- keep_classnames

			这个选项用来防止class names被丢弃或压缩。这里的配置是在生产环境构建加上`--profile`参数时候为`true`，以便给devTools做性能分析用。

		- keep_fnames
		
			防止函数名被压缩，这个配置和`keep_classnames `一样
		
		- output

			代码美化的一些操作
			
			- ecma: 5

				output阶段不会进行语法转换，即不会将es6转换成es5。
				
				这个选项用来控制输出的语法规范，如果配置成es6，会将`{a:a}`转换成`{a}`。
				
				【不清楚和compress中的ecma有啥区别，可能compress和output是terser处理的不同阶段，所以需要两个配置项】
				
			- comments: false

				这个用来控制注释的压缩操作，false是删除所有注释。默认是"some"，保留JSDoc-style的注释（包括"@license"等）
			
			- ascii_only: true

				只处理ascii的字符串和正则表达式
				
				默认是false，会将emoji这种非ASCII字符压缩导致乱码
	
	2. sourceMap

		控制terser插件生成source map的操作
		
		这里判断了，只要生产环境未配置不用source map就生成source map
		
	然后看下`OptimizeCSSAssetsPlugin`插件配置
	
	这个插件使用`cssnano`css压缩工具，支持自定义处理器
	
	1. cssProcessorOptions

		- parser: safePostCssParser

			safePostCssParser 是一个postCss的容错解析器，可以发现并修复css语法

		- map

			控制source map文件的生成

	2. cssProcessorPluginOptions

		不知道干啥用的

3. splitChunks

	这里很简单地配置了一下，用了webpack的默认配置，因为webpack默认做了很多优化工作

	- chunks: 'all'

		入口和异步模块都进行分包处理

	- name: false

		不改变切片名称

4. runtimeChunk

	- name: ```entrypoint => `runtime-${entrypoint.name}````
	
		将运行时文件单独打包以充分利用缓存

#### 7. resolve

配置webpack解析模块相关的选项

1. modules

	这个选项控制webpack解析模块时候的fallback。这里添加'node_modules'、应用的'node_modules'目录和通过应用目录中的`.jsconfig.json`中的`compilerOptions.baseUrl`来指定。

2. extensins

	自动解析扩展，让用户引入文件时候不带后缀
	
	这里添加了.js，.json，.tx（根据是否支持ts来决定是否需要），.mjs等等

3. alias

	这个选项用来配置模块引入的路径别名。

	这里加了一个常用的路径，另外，还根据`jsconfig.json`文件中的`compilerOptions.baseUrl`选项判断，如果baseUrl和项目目录相同，就增加
	
	```
	{
		src: paths.appSrc // 应用项目目录下的src目录
	}
	```
	的配置
	
4. plugins

	配置一些解析模块的插件
	
	- PnpWebpackPlugin

		使用yarn pnp功能（主要解决node_modules模块加载机制带来的node运行开销过大的问题）时候需要引入此插件
		
	- ModuleScopePlugin

		这个是create-react-app项目中的`react-dev-utils`项目提供的一个插件，用来防止模块引用src目录外的模块（因为babel只处理src中的模块）。如果应用的项目中有引入src目录外的模块的情况，就会编译报错并给出提示。

#### 8. resolveLoader

这个配置项和resolve完全相同，只是它是用来解析loader用的

- plugins

	配置解析插件
	
	这里配置了yarn Plug'n'Play相关的插件`PnpWebpackPlugin.moduleLoader(module)`
	
	【看来使用pnp配置挺麻烦的】

#### 9. module
	
这个选项决定了如何处理项目中不同的模块

1. strictExportPresence

	配置这个选项让未导出模块报错而不是只给一个警告，即引入的路径的文件必须导出一个合法模块
	
2. rules

	创建模块时候，匹配请求的规则数组。这些规则可以指定对相应的模块应用哪种loader，或者更改解析器
	
	rule.test：这个是匹配模块的规则
	
	rule.enforce：这个是用来指定loader类型的。loader的类型有“前置”、“行内”、“普通”、“后置”，webpack应用loader时候就会按照这个顺序对模块进行解析。
	
	rule.use：指定loader
	
	rule.include：指定模块解析时候包含的目录，模块解析时候只解析include指定目录下的文件
	
	rule.options：传给loader的参数
	
	rule.exclude：指定模块解析时候不包含的目录
	
	rule.sideEffects：声明是否有副作用。什么是有副作用呢？比如如果某个模块A加载时候定义了一些全局变量挂在window下，或者定义了一些css样式，就是有副作用，即其他模块引入A时候，不直接调用A的方法也会影响到我们的项目。这个选项的作用是什么？就是用来告诉webpack是否可以放心摇树（比如sideEffects配置成false的话，就是声明没有副作用，webpack将把引入但未使用的模块抹除）。有些第三方包，可能在package.json中配置了`sideEffects`为`false`，这时候webpack会认为其没有副作用而放心大胆地摇树，但是可能包里面有副作用代码，导致摇树后表现不正常。尤其是css，如果第三方包中有css相关样式，但是包声明了`sideEffects`为`false`，由于引入这个第三方模块时候未调用其中的方法，可能这些样式就会被webpack摇掉。因此需要在loader中配置`sideEffects`为`true`，告诉webpack不要随便摇树。
	
	rule.oneOf：当规则匹配时候，只用第一个匹配到的规则，如果都没有匹配到，则使用最后一个loader
	
	下面看下cra中react-scripts的webpack.config.js的配置
	
	- `{parser: {requireEnsure: false}}`

		配置模块解析器禁用require.ensure语法，cra的解释是，因为require.ensure不是标准语法
		
	- `test: /\.(js|mjs|jsx|ts|tsx)$/  eslint-loader`

		首先配置eslint-loader解析相应模块，进行代码检查
		
		这里配置了enforce为"pre"，即先进行eslint检查
		
		options中配置了一堆相关的配置参数，注意其中有个`useEslintrc: false`，忽略掉eslintrc配置文件
		
		这里`include`配置为应用项目src目录
		
	- `oneOf`

		这里配置了一系列的loader，fallback是一个file-loader
		
		1. url-loader

			解析 `bmp`、`png`、`jpg`、`jpeg`、`gif`图。设置文件名为`static/media/[name].[hash:8].[ext]`，图片都放在static/media下面
		
		2. babel-loader

			这个配置用来解析应用中的js（注意include中配置了只解析应用中src目录下的文件），由于babel配置比较复杂，cra的react-scripts有个包专门处理babel配置：`babel-preset-react-app`。
			
		3. babel-loader

			这个配置用来处理应用之外的js（比如第三方包）解析，这个只处理标准的js，因为默认第三方包已经经过编译处理
		
		4. 下面有4个loader用来解析样式模块

			这几个处理样式的loader支持解析css、sass，并且支持css module
			
			第一个配置解析css，并且exclude了css module相关的模块
			
			第二个配置解析css的css module
			
			第三个配置解析sass，并且exclude了sass的css module相关模块
			
			第四个配置解析sass的css module
			
			loader的配置也比较负责，因此这里有个函数专门处理`getStyleLoaders`
			
			有这么几个loader：
			
			- style-loader

				用来开发环境将样式动态写到style标签中
	
			- css-loader

				解析css
			
			- sass-loader
				
				解析sass
			
			- postcss-loader

				后期处理，加prefix等等
			
			- resolve-url-loader
				
				这个是用来解析路径的，因为有预处理loader（这里是sass-loader）的话，如果一个.sass文件引用其他资源是用相对路径，那么其实是相对于根.sass的引用，这可能导致路径错误。这个`resolve-url-loadr`就是用来解决这个问题的。
				
				官方文档中给了具体的例子
				
				[官方文档](https://www.npmjs.com/package/resolve-url-loader)
			
			- MiniCssExtractPlugin.loader
				
				用来提取css
		5. file-loader

			用来加载其他未匹配到的资源
	
#### 10. plugins

1. HtmlWebpackPlugin
	用来处理html生成入口html
	
	注意这里使用的是4.0版本，这个版本的资源内联使用的是ejs的模板语法，之前的版本都是使用es6的字符串模板语法
	
2. InlineChunkHtmlPlugin

	这个是cra的`react-dev-utils`包中提供的插件，将webpack运行时代码内联到html中，用来减少http请求

3. InterpolateHtmlPlugin
	
	这个也是cra的`react-dev-utils`中提供的插件，使用该插件可以在html中使用环境变量，如“%PUBLIC_URL%”
	
4. ModuleNotFoundPlugin

	这个也是cra的`react-dev-utils`中提供的插件，用来在引入模块失败时候给出友好提示。

5. webpack.DefinePlugin

	这个用来定义一些项目中可用的变量，以供js使用，这里将环境变量都注入到了项目里面。
	
	原理是webpack打包时候会将这里定义的key都替换成相应的变量。

6. webpack.HotModuleReplacementPlugin
	
	开发环境使用这个插件，支持模块热重载
	
7. CaseSensitivePathsPlugin

	路径大小写敏感。mac操作系统查找文件路径时候，对大小写不敏感，这可能会导致目录和引入路径不匹配但是可以正常运行。这个插件强制要求路径大小写完全匹配，不匹配会报错。

8. WatchMissingNodeModulesPlugin

	这个插件也是`react-dev-utils`中提供的，它解决了如果开发者引入一个新包时候需要重启webpack-dev-server的问题。它会自动监听npm包引入情况，用户新引入npm包后install一下就可以了，不用重启本地服务。

9. MiniCssExtractPlugin

	用来提取css

10. ManifestPlugin

	这个插件控制webpack打包的manifest输出文件。
	
	【为什么这么配置还不清楚】
	
11. IgnorePlugin
	
	这个插件用来解析模块时候忽略指定的模块。这里的配置是为了给momentjs做优化，忽略了momentjs中的本地化部分。
	
12. WorkboxWebpackPlugin.GenerateSW

	用来产生service-worker，开发pwa时候用的

13. ForkTsCheckerWebpackPlugin

	这个插件在解析typescript时候开启独立进程，用来提高构建的性能

#### 11. node

这个选项模拟node环境，即可以在非node环境提供一些node api的polyfill，可以让原本为node写的代码可以运行在浏览器端。

这里的配置了一堆empty和mock，目的是考虑可能有第三方的模块引入了node模块但是没有在浏览器里使用，那么如果不增加空的polyfill，这些第三方模块由于引用node模块失败就会不能执行，这里配置了一些空的polyfill就可以让这些第三方的模块正常运行。

#### 12. performance

这里关闭了webpack提供的文件大小超限时候的警告。因为cra自己实现了一个`FileSizeReporter`用来做这件事，在build.js中使用`FileSizeReporter`来进行必要警告。

## webpack.config.js提供的能力

#### 1. 基本能力

- js解析，babel的完善配置可以让我们轻松使用esnext的各种语法
- sass及样式解析
- postcss
- css module
- css文件提取
- 图片解析
- 其他文件解析（file-loader）
- 优秀的压缩效果（Terser）
- 分包（利用webpack的默认配置）
- 模块热重载
- service-worker
- yarn pnp
- html编译注入静态资源引用
- typescript
- html和js中使用环境变量
- eslint代码检查

#### 2. 优化支持

- 友好的错误提示，包括路径大小写、编译错误的iframe展示、构建体积超限警告、未找到模块时候的友好提示等
- node polyfill，友好地支持可能引入node模块的第三方库
- 一些优化工作
	- webpack运行时代码打包
	- webpack运行时代码内联

#### 3. 自定义配置

- 支持配置图片最小打包体积
- 支持配置public_url
- 支持配置是否需要内联runtime chunk
- 支持配置是否产生source map文件
- 支持配置扩展eslint

- env配置环境变量
- jsconfig配置编译选项控制增加模块解析路径和目录别名（src）

## webpack.config.js欠缺的支持

- less、stylus
- css nib
- babel的包按需加载
- webpack的自定义配置
- optional chaining语法支持
- nullish-coalescing-operator的支持