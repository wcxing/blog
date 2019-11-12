## 使用PropTypes进行类型检查

#### 1. 什么是PropTypes

PropTypes是React组件的属性检查器。我们可以使用它校验我们的组件props。如果组件接受的props未通过校验，就会报错或者警告。

#### 2. 为什么要用PropTypes

我们开发一个React组件时候，可能需要从父组件接受一些属性以控制当前组件的行为。在当前组件中，会使用父组件传入的props来做一些操作。如果这些props的数据类型与我们期望的不匹配，或者这些props不满足某些规则，那么我们依赖这些props所做的操作就会有问题。因此，我们需简单的方案对props进行校验。

使用propTypes来校验props，同时也声明了本组件的使用规范，即应该传递什么参数、参数的类型等。

```prop-types```这个工具提供了相关支持。

#### 3. 如何使用PropTypes

简单使用示例：

```
class Test extends React.Component {
	static props = {
		a: PropTypes.number.isRequired,
		b: PropTypes.string.isRequired,
		c: PropTypes.bool
	};
	// 未标注为“isRequired”的参数（非必传），最好设定默认值
	static defaultProps = {
		c: true
	};
}
```

常见设定：

```
// 参数必须是数值类型
PropTypes.number
// 参数必须是数值类型，且必传
PropTypes.number.isRequired
// 字符串类型
PropTypes.string
// 布尔类型
PropTypes.bool
// 对象类型，字段满足shape定义的形式
PropTypes.shape({
	a: PropTypes.string,
	b: PropTypes.number
})
// 数组类型，数组的每个元素满足arrayOf中定义的类型
PropTypes.arrayOf(PropTypes.number)

// 限制传递给组件的children只有一个元素
PropTypes.element.isRequired
```

也可以自定义验证器，参考官方文档