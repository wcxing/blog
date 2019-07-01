## redux

每个应用或者交互单元都可以被看做是一个状态机，用状态机的模型去实现一个应用可以让思路更清晰，代码组织更清晰，可维护性更高，因为用固定范式，也在一定程度上降低了开发成本

redux就是基于状态机模型的一个状态管理工具，它提供了一种编程范式，让开发者可以以这种范式去将一个应用按照状态机的模式来实现

编程范式：状态机的声明（reducers）和状态机的使用（dispatch(action)、subscribe）

redux的思想是对状态管理的一种抽象。如果我们按照状态机的模式实现每个应用，其实状态管理相关的逻辑都是共通的，redux将这些共通的部分抽象出来，让开发者只需要关注状态机中实际的业务那部分

其实像前端框架也是对开发中某些共通的东西的一种抽象。前端框架首先确定一种模型（如MVC，MVVM），然后抽象出来通用部分，然后确定编程范式并具体实现框架，让开发者只需要关心业务相关部分即可

### 编程关键点

- **createStore**
- **reducer**
- **getState()**
- **subscribe**
- actions
- reducer分离

## react-redux

### 编程关键点

- **createStore**
- **connect**
- actions
- provider

## 细节

### reducer拆分

使用redux时候，开发者需要实现reducer函数处理触发某个action时候的state变化。

在实际开发中，一个web app对应的状态可能比较多，并且状态间可能没有什么关联，这时候，我们应该将状态分为不同的块，这样状态的维护会变得更加清晰合理。

如果将web app的状态划分为不同的块，使用redux时就应该将不同块的状态交给不同的reducer去处理。这时候需要我们对reducer进行拆分。

实际上，如果对reducer拆分，state也按字段进行了相应的拆分

拆分reducer是如何工作的呢？

#### 从开发者的角度

拆分reducer，开发者需要做的工作包括

- 实现不同的reducer
- 使用redux提供的```combineReducers```方法将不同的reducer合并，生成一个最终的reducer用于提供给```createStore```作为参数
- 在使用state时候，也要进行相应的划分

#### 从redux的角度

reducer函数本身所做的工作就是接收参数```state```和```action```，然后根据action将当前state处理然后返回处理后的结果

如果不使用```combineReducers```，用户提供的reducer将用来在dispatch action时候处理state

使用了```combineReducers ```后，redux将会使用生成的reducer（我们暂时称之为```combination```）根据action处理state，并返回生成的结果。combination会遍历所有的参与合并的reducer，分别对state进行处理，并将不同的reducer结果赋值到相应的state的key上面，然后返回最终的state

对于reducer拆分和不拆分，其实就是对state的管理区别，拆分的话，就是对把state分成几个部分，每部分对应state下的一个属性，每个属性用相应的reducer处理

// TODO: 示例代码

### 异步action

在状态机中，action是一个动作的抽象，我们可能做一个同步的操作，也可能做一个异步的操作，同步的操作的话，我们触发一个普通action即可，reducer会进行相关处理。如果希望触发一个异步动作，那就需要我们在action中做一些操作

比如我们希望触发一个```request```的动作，然后根据返回的结果进行其他操作，那就需要我们在这个动作里

1. 先触发一个普通action操作，表明开始触发请求的动作
2. 开始发送请求
3. 请求返回结果后，我们根据结果再触发一个普通的action，表明请求完成

上述3步是一个完整的动作，这就需要我们实现一个方法作为action

#### 开发者需要做的工作

- 使用```redux-thunk```中间件将dispatch方法改造成既能接受一个对象作为参数也能接受一个函数作为参数
- 实现action creater，action creater可以返回一个函数，这个函数接受getState和dispatch作为参数，我们可以在这个函数中根据state做一些异步操作并在异步操作过程中触发某些同步动作

redux的中间件是用来改造dispatch的，通过更改dispatch，我们在使用redux时候可以做更多事情

我们使用redux提供的api ```applyMiddleware```来使用中间件，```applyMiddleware```方法接受一系列中间件作为参数，返回一个createStore方法，返回的createStore方法返回的store对象中的dispatch是被参数中间件改造过的

// TODO: 示例代码

### dispatch事件