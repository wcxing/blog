## context

#### 1. 什么是context

context是React提供的多层组件传递数据的解决方案，它包括多个API。

- React.createContext
- context.Provider
- context.Consumer
- class.contextType

使用context，开发者需要关注几个点。

- 祖先组件如何将数据传递下去
- 子组件如何接收数据
	- class component如何接收数据
	- functional component如何接收数据
- 如何动态修改数据
	- 祖先组件如何修改数据
	- 子组件如何修改数据
- 如何接受多个context

#### 2. 为什么需要context

为了避免多层组件传递数据使用prop，导致传递数据的组件和使用数据的组件中间的组件需要处理不必要的数据，增加代码复杂度，影响组件复用性，我们可以使用context来满足多层组件传递数据的需求。

#### 3. 如何使用context

- 父组件提供context
	
	```
	// 默认值
	const ThemeContext = React.createContext('1');
	// 将theme数据传递下去
	const App = () => (
		<ThemeContext.Provider value={'1'}>
			<Pages />
		</ThemeContext.Provider>
	);
	
	```

- 子组件接受数据
	
	class component接受数据
	
	```
	class Pages extends React.Component {
		componentDidMount() {
			console.log(this.context);
		}
	}
	
	Pages.contextType = ThemeContext;
	```
	
	functional component接受数据
	
	```
		const WrappedPages = () => (
			<ThemeContext.Consumer>
				{
					theme => (
						<Pages theme={theme} />
					)
				}
			<ThemeContext.Consumer>
		);
	```
	
	注意，子组件接受的是最近Provider提供的值

- 如何动态修改数据
	- 祖先组件如何修改数据
	
	```
	
	// 创建context
	const ThemeContext = React.createContext('1');
	// 使用state可以动态修改context
	class App extends React.Component {
		state = {
			theme: '1'
		};
		
		componentDidMount() {
			this.setState({
				theme: '2'
			});
		}
		
		render() {
			return (
				<ThemeContext.Provider value={this.state.theme}>
					<Pages />
				</ThemeContext.Provider>
			);
		}
	};
	```
	
	- 子组件如何修改数据

	```
	
	// 创建context
	const ThemeContext = React.createContext('1');
	// 将修改theme的回调传递下去
	class App extends React.Component {
		state = {
			theme: '1'
		};
		
		changeTheme = theme => {
			this.setState({theme});
		};
		
		render() {
			return (
				<ThemeContext.Provider value={this.state.theme}>
					<Pages changeTheme={this.changeTheme} />
				</ThemeContext.Provider>
			);
		}
	};
	// 调用回调修改context
	const Pages = ({changeTheme}) => (
		<>
			<button
				onClick={() => {changeTheme('2')}}
			>
				切换主题
			</button>
			{
				// 根据theme渲染一些元素
			}
		</>
	);
	
	```

- 如何消费多个context
	
	```
	// 嵌套函数包裹子组件，将多个context传递给子组件
	const ThemeContext = React.createContext('1');
	const EnvContext = React.createContext('test');
	
	const App = () => (
		<ThemeContext.Consumer>
			{
				theme => (
					<EnvContext.Consumer>
						{
							env => (
								<Pages
									theme={theme}
									env={env}
								/>
							)
						}
					</EnvContext.Consumer>
				)
			}
		</ThemeContext.Consumer>
	);
	```

**可复用性的衡量指标**：模块独立性，模块对外界依赖越少，可复用性越强