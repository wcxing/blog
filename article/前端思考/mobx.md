## 状态的概念

单页应用的出现及对复杂单页应用的需求催生出了一些可以提高代码维护性、提高开发效率的前端框架

react、vue、angular等框架设计思想中的一个关键点就是将模板与状态分离，他们看待组件的角度是：组件 = 模板 + 状态

模板是组件的生命周期中，视图中不变的部分，状态是视图中变化的部分的数据抽象

以react为例，react将组件分为模板和状态，对应render中的返回模板和state、props

模板与状态分离的好处

- 更容易看清一个组件的业务逻辑，即初始是什么状态，都有哪些状态，状态是如何变化的，提高了代码的可维护性及可读性

- 将业务逻辑和dom操作分离，这样dom操作可以托管给框架，开发者只需要关心业务逻辑，提高开发效率

## 状态管理的原理

### 从程序执行的角度看状态管理

状态管理 是状态管理器和视图之间的交互，是双向的交互

- 首先，用户触发交互，交互触发状态管理器修改状态
- 然后，状态管理器触发状态修改的事件，将修改后的数据返回给视图的状态修改监听器，触发视图更新

### 从状态管理器的角度看状态管理

状态管理器用来统一管理状态，由固定的数据结构存储数据并对外提供api修改状态及监听状态改变

状态管理器的使用

使用状态管理器包括两个主要步骤

- 创建状态管理器
- 调用状态管理器接口修改状态
- 调用状态管理器接口监听状态变化（一般用于更新视图）

## 为什么需要状态管理

- 业务逻辑主要是状态操作，将状态抽离视图层，即将业务与视图解耦。这样，视图层只负责触发状态改变的事件和根据状态渲染界面，状态管理器负责状态修改和响应监听，提高代码的可维护性和可读性
- 状态（即数据）的组件间共享


## mobx是怎么工作的

装饰器的概念：es6的装饰器是包装函数的简单写法

- 类装饰器，返回新的类，改变类创建出的实例的行为
- 属性装饰器，修改属性的行为

mobx改变变量的getter方法和setter方法拦截赋值和取值操作，从而进行对变量值改变的监听

在react项目中，mobx和mobx-react是结合使用的。

主要api如下

```
import {observable, computed, action, autorun} from 'mobx'
import {observer, Provider, inject} from 'mobx-react'

```

关于mobx的使用

```
// 创建状态管理器store
class Store {
    @observable count = 0; // 让count属性可观察，count的改变
    @computed get brother() {
    	return this.count + 1;
    }
    @action increase() {
        this.count++;
    }
}

const store = new Store();

// 首次执行并监听store.count的改变
autorun(() => { console.log(store.brother) });

// 触发状态改变，这时会auto run 监听函数
store.increase(); // store.count++也可以;

```

mobx与react结合使用

```
// store.js
class Store {
    @observable count = 0;
    @computed get brother() {
    	return this.count + 1;
    }
    @action increase() {
        this.count++;
    }
}

// index.js
import React from 'react';
import ReactDom from 'react-dom';
import App from './App.js';
import {Provider} from 'mobx-react';
import store from './store';

ReactDom.render(
    <Provider store={store}}> // Provider将store挂载到context上传递
        {component}
    </Provider>
    , document.getElementById('root')
);

// App.js

import React from 'react';
import {observer, inject} from 'mobx-react';

@inject('store') // inject是一个高阶组件，一个容器组件，用于将context中的store传递到组件中
@observer // 用autorun包装render，使得组件可以响应数据变化
class App extends React.Component {
    onIncreaseClick = () => {
        const {store} = this.props;
        demoStore.increase();
    };
    render() {
        return (
            <div className="demo-test-store-wrapper">
                <div>{this.props.store.count}</div>
                <div onClick={this.onIncreaseClick}>增加test</div>
            </div>
        );
    }
}
export default App;

```


## 引入mobx流程

1. 安装mobx及装饰器babel转换器

    ```
    npm install mobx mobx-react --save
    // 8.0以下babel-loader
    npm install babel-plugin-transform-decorators-legacy --save
    // 8.0以上babel-loader
    npm install @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties --save
    
    ```

2. 配置babel

    ```
    // 8.0以下babel-loader
    "plugins": ["transform-decorators-legacy"]
    // 8.0以上babel-loader
    "plugins": [
        ["@babel/plugin-proposal-decorators", {legacy: true}],
        ["@babel/plugin-proposal-class-properties", { "loose" : true }],
    ]
    
    ```

3. 设计store，并统一收录到stores中

    class AStore {
        @observable a = 0
        @action increaseA() { a++ }
    }
    
    class BStore {
        @observable b = 0
        @action decreaseB() { b-- }
    }
    
    const stores = {
        aStore: new AStore(),
        bStore: new BStore()
    }

4. 并从入口注入stores

    使用```mobx-react```提供的api ```Provider```将stores放到react组件context上
    
    ```
    <Provider {...stores}>
        <App />
    </Provider>
    
    ```

## 使用

使用```mobx-react```提供的api ```inject```生成容器组件并使相应store可用，并用```observer```使组件可以响应数据改动

```
@inject('aStore')
@observer
class Test extends React.Component {
    render() {
        return (
            <div>{this.props.aStore.a}</div>
        );
    }
}

```
