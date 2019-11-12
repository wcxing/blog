## React.Fragment

#### 1. 什么是Fragment

Fragment是一个React内置的组件类型。它允许开发者在一个组件中返回多个元素。

#### 2. 为什么要用Fragment

React的组件要求返回的元素必须有一个根节点。但是实际开发中，组件可能是一系列的元素，所以我们需要一种方案可以让一个React组件可以返回多个元素，并且不用添加不必要的根节点。

这就是Fragment可以给我们提供的支持。

#### 3. 如何使用Fragment

```
render() {
	return (
		<React.Fragment>
			<ChildA />
			<ChildB />
			<ChildC />
		</React.Fragment>
	);
}
```

上面的组件渲染出ChildA、B、C三个组件，没有根节点。

也可以使用短语法实现同样的功能

```
render() {
	return (
		<>
			<ChildA />
			<ChildB />
			<ChildC />
		</>
	);
}
```