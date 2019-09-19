## 背景

使用React开发应用的过程中，可能会有获取子dom节点或者子组件实例引用的需求。React提供我们3种方式实现这个效果。

第一种方式是字符串ref

```
class Child extends React.Component {
	componentDidMount() {
		this.refs.input.focus();
	}
	render() {
		return (
			<input ref="input" />
		);
	}
}
```

第二种方式是回调refs

```
class Child extends React.Component {
	componentDidMount() {
		this.refs.input.focus();
	}
	
	onRef = element => {
		this.input = element;
	};
	
	render() {
		return (
			<input ref={this.onRef} />
		);
	}
}
```

第三种方式是使用React.createRef方法

```
class Child extends React.Component {
	constructor() {
		this.input = React.createRef();
	}
	
	componentDidMount() {
		this.input.current.focus();
	}
	
	render() {
		return (
			<input ref={this.input} />
		);
	}
}
```

比较推荐使用第三种方式实现子节点引用，原因可以参考官网，后面我们都使用这个方式进行讨论。

下面看下另一个需求：ref转发。开发应用时候，可能需要父组件获取子组件的子节点的引用。即一个组件需要获取自己的孙子组件实例的引用。

## ref转发的实现

使用React提供的createRef很容易实现ref转发

```
class Child extends React.Component {
	render() {
		const {forwardedRef} = this.props;
		return (
			<input ref={forwardedRef} />
		);
	}
}

class Parent extends React.Component {
	constructor() {
		this.input = React.createRef();
	}
	
	componentDidMount() {
		this.input.current.focus();
	}
	
	render() {
		return (
			<Child forwardedRef={this.input} />
		);
	}
}

```

当然上面的Child也可以实现为一个函数式组件。

我们还需要考虑另一个场景，就是如果我们提供一个高阶组件```wrap()```，对传入的组件```Comp```进行包装。我们使用包装后的组件```wrappedComp```的时候希望可以直接给```wrappedComp```传入ref属性就能获取到Comp的引用，而不会获取到外层组件的引用。通常我们开发组件库时候会有这种需求。这时候我们希望能有一种方法把传给某个组件的ref属性转发给子组件（而不是像上面的例子演示的，把传给某个组件的forwardedRef属性转发给子组件的ref上）。

这就需要我们使用React.forwardRef()方法了。

```
function wrap(Comp) {
	class Wrapper extends React.Component {
		componentDidMount() {
			console.log(this.props);
		}
		render() {
			const {forwardedRef, ...rest} = this.props;
			return (
				<Comp {...rest} ref={forwardedRef} />
			);
		};
	}
	return React.forwardRef((props, ref) => (
		<Wrapper {...props} forwardedRef={ref} />
	));
}
```

如果不用React.forwardRef()方法，组件是不可能获取到父组件传过来的ref属性的。因为ref属性是被React拦截了的。因此我们需要用到React.forwardRef()来在```Wrapper```组件外面包一层，可以让包裹后返回的组件可以获取到父组件传来的ref。这就实现了ref原样转发。