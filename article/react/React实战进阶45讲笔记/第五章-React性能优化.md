#### 42. 性能永远是第一需求：时刻考虑性能问题

**先找出性能瓶颈**

1. 了解常见性能问题的场景
	1. 键盘输入
	2. 鼠标移动
	3. 滚动元素
2. 时刻注意代码的潜在性能问题

	shoudComponentUpdate

	useMemo
3. 注重可重构的代码
	
	优化性能的时候，改动较小
4. 了解如何使用工具定位性能问题 dev-tool

#### 43. 网络性能优化：自动化按需加载

1. 动态import() (需要babel插件支持)
2. react-loadable、React.lazy

#### 44. 使用Reselect避免重复计算

创建自动缓存的数据

由于React提倡能计算得到的状态就不要单独存储，所以React组件中可能会有一些计算函数。render方法执行时候，用这些计算后的结果渲染。

由于计算时候依赖的状态可能没有变，因此这些计算可能是多余的。

reselect用来解决这种问题。它可以包裹这个计算函数，返回新的函数。新的函数会自动缓存计算结果，如果依赖的状态未变，则返回缓存结果而不会再调用计算方法了。

```
const getId = state => state.id;
const getName = state => state.name

// 调用getUser(this.props)时候，会缓存计算结果
// 如果id和name不变，则不会执行计算函数findUser
const getUser = createReselector(
	getId,
	getName,
	(id, name) => {
		// findUser中包含复杂的计算
		return findUser(id, name);
	}
);
```

#### 45. 下一代React：异步渲染

1. 时间分片（关注性能体验）concurrent mode
	
	DOM操作优先级低于浏览器原生行为（如键盘、鼠标）从而保证操作的流畅性
	
	1. diff分时间片进行
	2. unstable-defferredUpdates（表示此次setState优先级较低）
	3. requestIdleCallback（浏览器空闲回调）

2. 渲染挂起（关注交互体验）Suspense

#### 46. 使用Chrome DevTool进行性能调优

1. 使用React dev-tool找到多余渲染
2. 使用 chrome dev-tool定位性能瓶颈（performance）
	
connect包裹组件后会自动监听声明的store中的数据，数据变化时候自动渲染包裹的组件。如果组件不使用传入的数据，则不应该监听之。eslint规则可以校验这种问题。