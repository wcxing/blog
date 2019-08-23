## 简介

本文介绍typescript使用的基本思路，细节和高级特性请参考官方文档。

#### 为什么要用typescript

在研究一项技术或者一个工具时候，首先要思考的问题是这个东西解决了什么问题。下面解释下typescript解决了什么问题，或者说typescript给我们带来了什么好处。

typescript的出现是为了解决JavaScript和ES6弱类型的缺陷。typescript要求所有的变量都有类型。所以，typescript的关键字是“强类型”。

使用typescript能给我们带来什么好处呢？它要求开发者在编写程序时候给每个变量以确定的类型，如果代码中出现类型不匹配，会报错。这样，typescript帮助开发者降低了低级错误溜到线上的可能性，减少了一些特定类型（比如“Cannot read property 'xxx' of undefined”等）。

另外如果对象有确定类型，那么它有哪些属性都是确定的，我们在开发时候会有属性提示，这样也提高了我们的开发体验。

总结一下，typescript是强类型语言。它在开发阶段帮助我们进行类型检查以降低代码出现bug的可能性；给我们进行属性提示，提高开发体验。这就是我们使用typescript的原因。

typescript的定位是一个“工具”。因为使用typescript开发前端项目时候，typescript代码最终会被转换为浏览器可执行的JavaScript代码，所以typescript并没有最终运行在语言的解释器上，在运行上也并没有任何优化或性能损失。typescript只是在开发时候帮助我们约束类型。它不是JavaScript的标准。

使用typescript开发前端项目的流程是：

首先配置typescript环境，包括编辑器插件、语法转译支持

然后开始使用typescript开发，编辑器会实时提示不符合typescript语法或者类型检查方面的错误

开发完成后开始进行构建编译，这时候如果上一步忽略编辑器提示的错误强行构建，转译的插件会报错导致构建失败

转译完成后，代码就可以在浏览器运行了。

#### JavaScript、ES6和typescript的关系

这里的JavaScript指ES5，是JavaScript经历一段时期的演变后形成的一个稳定版本。

ES6在JavaScript基础上进行了一系列增强，让JavaScript能够更好地承担起构建大型前端应用的任务，ES6是JavaScript的超集。主要有以下方面的增强

- 作用域绑定（箭头函数和let、const） 提供了ES5里this指向混乱的问题的解决方案
- 模块规范（export、import） 更好地模块化开发方式
- class语法 更合理的类语法，用以替代ES5别扭的的function类
- async 简洁的异步语法糖

其它特性自行探索

typescript语法是ES6的超集，增加了强类型约束，包括ES6的基本类型和增加的void、never、any、enum、tuple还有类和方法的类型定义。另外对类的语法也有扩展，更贴近其他主流的Java、c++的类语法

#### 基本语法

下面介绍下typescript的基本语法

使用typescript，我们主要关注两个问题：

1. 如何给变量指定类型？
2. 如何自定义一个类型？

先来回答第一个问题，如何给变量指定类型。答案是使用类型注解。即声明变量时候在变量后面加一个冒号，后面接这个变量的类型。

```
// 给变量a指定类型number，并赋值1
let a: number = 1;

// 给变量a指定类型为{b: string}（即a是一个对象，有个属性为b，b类型时string）
// 并赋值为{b: '1'}
let a: {b: string} = {b: '1'};

// 给变量a指定函数类型（函数签名）为(x: number, y: number) => number
// 并为之赋值
let a: (x: number, y: number) => number =
	function(x: number, y: number): number {return x + y;};

// 定义类A，有属性b为string类型，有方法c签名为(param: string) => void
// 实例化一个对象a
// 为什么这个a不需要指定类型呢？因为这个a实例化自类A，因此这个对象的成员结构是确定的
class A {
	b: string,
	c(param: string): void {
		console.log(param);
	}
}
const a = new A();
a.b = '1';
a.c(a.b);
```

从上面例子可以看出来类型有3中，基本类型，函数和对象。函数的签名包括参数列表和返回值，对象类型定义是其成员结构的定义。

指定了变量类型后，如果后面代码中对变量的操作（如赋值、对象的成员属性赋值或方法调用等）不符合其类型（比如给一个number变量赋一个字符串值，或者调用对象不存在的方法，或者函数执行时传入的参数与其参数列表不匹配），typescript就会报错。


如果开发者不告诉编辑器变量的类型，默认就是any，即任何类型的值都可以赋给这个变量

```
// a默认是any类型
let a;
a = 1;
a = '1';
console.log(a);
```

```
// a被推断为number类型
let a = 1;
a = '1'; // error，a是number，无法将字符串赋给它
console.log(a);
```

另一个问题，如何自定义类型？

自定义类型包括定义函数的签名、定义对象结构。有两种定义方法：interface和类型别名

interface关键字用于声明一个类型

```
// 声明了一个名为Log的函数签名
// 注意接口推荐开头大写
interface Log {
	(a: string): void
}
// 实现了一个名为log，签名为Log的方法
const log: Log = a => console.log(a);

// 声明了一个名为A的接口
interface A {
	b: string,
	c: number
}
// 定义了一个变量a，实现了接口A
const a = {b: '1', c: 1};
```

类型别名用type关键字为一个类型定义别名

```
// 定义了一个名为Log的函数签名
type Log = {
	(a: string): void
}
// 实现了一个名为log，签名为Log的方法
const log: Log = a => console.log(a);

// 定义了一个名为A的类型，用于约束对象结构
type A = {
	b: string,
	c: number
}
// 定义了一个变量a，实现了类型A
const a = {b: '1', c: 1};

// 注意type也可以将基本类型赋予别名
type myString = string;
const a: myString = '1';
```

另外，class也可以通过implements关键字来约束其公有成员。

```
interface A {
	a: string
}

class B implements A {
	a: string,
	b: number
}
```

关于类的语法，类的声明、继承都是ES6语法，typescript对其进行了增强，增加了访问修饰符private、public、protect，并且可以用类型注解修饰属性等

#### 语法特性

语法特性自行探索

- 类型推断

- 类型兼容性

- 类的继承

- 泛型

#### 声明文件

typescript要求每个变量都有类型。如果项目中都是我们自己实现的模块，我们会在开发时候声明相应的类型，这完全没有任何问题，可以保证每个变量都有类型。可是由于前端项目中会引用第三方模块，包括script标签中引用的和npm引入的，这些模块可能不都是用typescript开发的。那么如何在这种情况下保证每个变量都有类型呢？

首先我们来看下关于变量类型，我们有哪些场景存在问题，然后针对这些场景来看下typescript提供的解决方案。

1. 宿主环境提供的API（比如浏览器的window、node的module、process、__dirname等）的类型和扩展类型

	比如，我们在代码中访问window.navigator，typescript并不知道window是什么类型，不知道它下面有navigator属性。因此需要一个全局的声明文件，还有document等。这些浏览器环境的全局变量的类型都在node_modules/typescript/lib/lib.dom.d.ts声明文件中声明。（typescript的声明文件以.d.ts结尾。）

	另一种场景是如果我们需要在浏览器window下扩展一些属性，（比如cefQuery）这时候我们调用时候会这样写代码```window.cefQuery()```，但是默认window下没有这个属性，typescript就会报错。解决方法是使用扩展全局变量的声明：
	
	```
	// /tyeps/global.d.ts
	declare global {
	    interface Window {
	        cefQuery: Function
	    }
	}
	
	export {};
	
	```
	注意即使此声明文件不需要导出任何东西，仍然需要导出一个空对象，用来告诉编译器这是一个模块的声明文件，而不是一个全局变量的声明文件。
	由于挂载到window下的方法可以直接调用```cefQuery()```，因此为了声明它的类型，也可以声明一个全局变量
	
	```
	// /types/cefQuery.d.ts
	declare function cefQuery(options: Object): any;
	```

2. script标签引入的第三方库使用全局变量的类型（如Jquery的$）

	这种情况我们自己可以声明一个.d.ts文件，直接声明一个全局变量即可
	
	```
	// /types/jQuery.d.ts
	declare function jQuery(selector: string): any;
	```
	也可以引入第三方的声明文件```npm install @types/jQuery```

3. npm包引入的模块（如axios、react）的类型和扩展（如引入插件后增加的成员）类型

	如果模块自带声明文件，那我们就不需要做任何处理（axios就自带typescript声明文件），如果没有，就需要开发者处理一下。通常也有两种方式
	
	引入第三方的声明文件```npm install @types/bar```
	如果没有第三方声明文件，需要自己声明模块类型
	
	```
	// /types/bar.d.ts
	declare module 'bar' {
	    export function foo(): string;
	}
	// index.ts
	import bar from 'bar';
	bar.foo();
	```
	npm 包的声明文件与全局变量的声明文件有很大区别。在 npm 包的声明文件中，使用 declare 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。只有在声明文件中使用 export 导出，然后在使用方 import 导入后，才会应用到这些类型声明。
	（我们自己除了在声明文件中声明module模块，也可以在一个index.d.ts文件中导出模块相关的所有变量声明。然后放在/types下与模块同名的目录下，并且配置tsconfig.json
	
	```
	{
	    "compilerOptions": {
	        "module": "commonjs",
	        "baseUrl": "./",
	        "paths": {
	            "*": ["types/*"]
	        }
	    }
	}
	```
	这样，通过 import 导入 bar 的时候，也会去 types 目录下寻找对应的模块的声明文件了。typescript检查第三方模块声明文件时候，应该是遵循node_modules模块根目录->@types目录->项目目录types的顺序（此顺序尚待验证）。
	）
	另一个场景是如果一个模块引入了插件，增强了其功能，需要我们自己编写声明文件
	
	```
	// types/moment-plugin/index.d.ts
	// 需要先引入原模块
	import * as moment from 'moment';
	
	declare module 'moment' {
	    export function foo(): moment.CalendarKey;
	}
	// src/index.ts
	import * as moment from 'moment';
	import 'moment-plugin';
	
	moment.foo();
	```

4. 全局类型，如果我们在多个模块中都需要使用某个类型，我们可以考虑把这个类型声明为一个全局类型

	```
	// /types/User.d.ts
	interface User {
		id: number,
		name: string
	}
	// /a.ts
	let u: User = {id: 1, name: 'Jim'};
	// /b.ts
	let u: User = {id: 2, name: 'Max'};
	```

总结一下

- 声明文件以.d.ts结尾

- 声明文件主要解决两个问题
	- 非自定义模块的变量声明（包括宿主API、第三方模块）
	- 声明全局接口

- 声明文件有4中形式
	- typescript模块自带的声明文件
	- @types中的第三方声明文件
	- npm包中的声明文件
	- 开发者自定义的声明文件

理想情况下，应该只需要typescript的宿主API声明文件和npm包中的声明文件，只是由于目前第三方模块还有很多不是用typescript开发的，因此有@types和自定义types的解决方案。

#### 工程化

工程化中typescript主要包含两个方面：代码转译和代码提示

代码转译就是配置相关构建工具的插件（如webpack的ts-loader），当然插件还需要typescript的支持，另外还需要编写配置文件tsconfig.json

代码提示主要有构建时编译提示和编辑时候的提示构建时提示由构建工具插件实现，编辑时提示由编辑器插件实现