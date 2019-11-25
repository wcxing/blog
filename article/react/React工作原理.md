## React工作原理

#### 0. 问题

1. 虚拟DOM是什么？
2. React是如何做diff的？
3. ReactDOM.render()和setState()执行后，React做了什么操作，导致最终视图的更新？
4. fiber架构是什么？
5. React如何做到跨平台？

#### 1. React框架中的组件

使用React开发应用，其实就是实现一个个的React组件。React中，一个组件就是一个交互单元。

通常前端开发者都根据视图划分模块，一块拥有独立功能和交互的视图就可以划分为一个模块，即一个组件。

React中有不同类型的组件：functional component、class component、portal等，常用的就是functional component和class component。

我们进行web前端开发，通常需要实现视图和业务逻辑两个方面。使用React进行开发时候，相应地、需要实现状态和ReactElement（JSX）来完成视图的逻辑，需要通过注册监听事件和实现一些副作用（如ajax、和其他端交互）来完成业务逻辑。

我们研究如何用好React就是研究如何写好React组件、研究React如何工作，就是研究React如何管理组件。

#### 2. React组件管理

我们写好React组件后，程序在运行时候，React一定会对我们的组件进行相应地管理，更具体地，React管理的其实是ReactElement，即JSX编译后的结果。对于functional component，ReactElement就是function 返回的结果，对于class component就是render返回的结果。ReactElement中也会保存有组件的类型的信息（ReactElement的type属性指向组件本身）。

为什么要有ReactElement这个东西呢？它是对不同类型的组件的一个通用逻辑提取。比如functionnal component和class component，它们都有props、ref、key prop等逻辑，创建组件时候的流程也都相似；但是也有很多不同，比如functional component没有状态和生命周期钩子等。因此ReactElement将不同组件的通用逻辑抽离管理。

React的组件更新后并不会直接进行DOM的更新。是因为React组件是对视图界面和交互的抽象，并不仅仅是对DOM的抽象，React的组件与具体的渲染逻辑无关。其他平台，如server、React Native也同样可以使用React来构建应用。在ReactFiberCommit.js中，React实现了对不同平台的接口统一处理。

#### 3. React fiber架构

为了防止React程序执行时间过长，长期占用CPU，导致渲染引擎挂起，影响渲染流畅度，React框架在React16中引入fiber架构。

通常情况下，30fps的帧率在人眼中看起来就是比较连续的了，因此浏览器执行渲染操作也尽量不要低于这个数值，即平均33ms渲染一次。此外，渲染应该尽量均匀，即最好每33ms可以给渲染引擎流出时间来执行渲染任务。React的策略是，每33ms中，最多22ms留给React执行js，剩余11ms是需要留给渲染引擎用的。

React的fiber架构其实就是将DOM挂载之前的任务划分时间片。若22ms没有完成，则挂起等待下次执行。而DOM挂载的任务都是连续的，不会挂起等待再执行。

React中的fiber是一种数据结构，每个组件都对应有一个fiber对象，它保存了每个组件的详细信息，如，组件的引用（type），class component实例和DOM元素（stateNode），state、props、更新状态及更新时间等等，用来给React调度判断执行优先级和具体更新操作。可以这么理解，fiber树就是虚拟DOM。

fiber树将组件组织成一棵树的结构。在触发更新后，就是遍历fiber树来实现组件树的更新的。

fiber树的结构有些特殊：

1. 这种树结构的每个节点有个指向第一个子节点的指针"child"
2. 如果子节点有多个，都是通过"sibling"指针连接
3. 每个节点有个指向父节点的指针"return"

React利用这种数据结构，遍历时候，就可以从头开始访问，然后通过child访问子节点，通过sibling遍历子节点，再通过return节点返回到父节点。这样React就可以通过循环（workLoop）来遍历整个树，并且随时知道下一次应该访问哪个节点，这样就很方便进行任务的暂停和继续。

具体实现：

1. requestanimationframe
2. requestIdleCallback

#### 4. React工作流程

1. 触发更新：React的ReactDOM.render()方法执行和class component的setState()方法执行后，会触发更新流程。
2. 调度：然后就进行调度过程，异步分时间片执行整个树的更新，更新state和props，并执行相关的生命周期钩子（class component）。
3. commit：真正进行DOM的操作

#### 5. 主要源码调用流程

1. 调和阶段

	beginWork() // ReactFiberBeginWork.js
	
	↓
	
	updateClassComponent() // （这里以class component为例） 这里会processUpdateQueue，处理update队列
	
	↓
	
	constructClassInstance() // 在这里实例化class component并赋值给fiber的stateNode属性
	
	mountClassInstance() // 这里会触发生命周期函数
	
	finishClassComponent() 
	
	↓
	
	reconcileChildren() // 调和子节点，这里做diff操作，挂载子fiber节点
	
	↓
	
	reconcileSinglElement()
	
	↓
	
	createFiberFromElement() 使用子组件示例创建fiber并挂载
	
	说明：这个过程通过workLoop()循环，构建或更新整个fiber树。虚拟DOM和fiber树上的stateNode结构对应
	
2. commit阶段

	completeRoot() // ReactFiberScheduler.js
	
	↓
	
	commitRoot()
	
	↓
	
	commitAllHostEffects() // 在这里进行DOM更新
	
	↓
	
	根据reconcile阶段标记的effectTag决定如何更新DOM
	
		1. commitPlacement
		2. commitWork
		3. commitDeletion