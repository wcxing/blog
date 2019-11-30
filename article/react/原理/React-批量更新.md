## React批量更新

#### 0. 背景

我们知道，React中有两种方式触发组件更新（另外新增的hook也可以触发更新），```ReactDOM.render()```和```setState()```。

其中```setState```会触发当前组件和所有子组件的更新流程，当然子组件可以通过```shouldComponentUpdate()```的方法来避免不必要的更新过程。

```setState```触发更新过程后，会有更新状态、调和、更新DOM的一系列操作，最终改变DOM为我们预期的结果。

#### 1. 批量更新的初衷

从上面描述可以知道，每次```setState```都会触发一个更新过程，最终更新DOM。如果我们setState调用太过频繁，可能会频繁触发更新流程，这样会导致性能较差。

因此，React的setState触发的实际更新，都是批量执行的，即多次连续的setState可能会合并到一次，这样只会触发一次整个更新流程。

#### 3. 批量更新的实现

```setState```执行会将这次更新先存入一个更新队列(updateQueue)中，然后进行任务调度。等待任务调度最终批量更新整个updateQueue。

React中有个```isBatchingUpdates```变量（ReactFiberScheduler.js），用来控制是否处于批量更新模式中。

```setState```执行后（ReactBaseClasses.js）后会执行ReactFiberClassComponent.js中的```enqueueSetState()```方法，然后执行ReactFiberScheduler.js中的```scheduleWork()```、```requestWork()```方法，在```requestWork()```方法中进行相关更新操作。这里判断了```isBatchingUpdates ```变量，如果为真，则进行异步的更新，否则直接更新。

React还提供了两个方法改变```isBatchingUpdates ```（ReactFiberScheduler.js）：```batchedUpdates()```（```unstabel_batchedUpdates()```）和```unbatchedUpdates()```（```unstable_unbatchedUpdates()```），这两个方法分别设置```isBatchingUpdates```为true和false。在```batchedUpdates()```的执行环境中，setState执行是批量的，在```unbatchedUpdates ()```的执行环境中，setState的执行时非批量的。

#### 4. 批量更新的实际场景

值得注意的是，并非每次setState都是异步更新的。

使用非批量更新的场景是首次渲染：在ReactDOM.js中的```legacyRenderSubtreeIntoContainer()```方法中，是非批量更新的。

使用批量更新的场景是，React事件回调中：在ReactDOMEventListener.js中的```dispatchEvent()```方法中，是批量更新的。因此，我们注册的React事件中如果是连续多次触发setState，实际是批量更新的。例如：

```
state = {
	count: 0
};

handleClick = () => {
	this.setState({count: 1});
	console.log(this.state.count); // 0
	this.setState({count: 2});
	console.log(this.state.count); // 0
	this.setState({count: 3});
	console.log(this.state.count); // 0
};

```

而如果我们加个定时器，则不会批量更新：

```
state = {
	count: 0
};

handleClick = () => {
	setTimeout(() => {
		this.setState({count: 1});
		console.log(this.state.count); // 1
		this.setState({count: 2});
		console.log(this.state.count); // 2
		this.setState({count: 3});
		console.log(this.state.count); // 3
	});
};

```
这是因为，定时器方法```setTimeout()```方法是在```batchedUpdates()```执行环境中执行的，但是```setTimeout()```中的回调则不是，因此回调执行时候，```isBatchingUpdates```是false，不会进行批量更新。

#### 5. 批量更新的注意事项

由于React中的setState可能进行批量更新。因此，setState的结果如果依赖于上一个state值的话，可能会计算错误。所以对于这种情况，setState应该传入一个方法。

```
setState(({count}) => ({count: count + 1}));
```