## render props

#### 1. 什么是render props

> “render prop”是指一种在React组件之间使用一个值为函数的prop共享代码的技术

使用render prop技术，共享的代码是一个React组件，这个React组件即通用组件，并且这个通用组件接受一个函数prop（我们可以称之为“render prop”），render prop定义了渲染逻辑，通用组件用来渲染视图或者仅渲染局部视图。

#### 2. 为什么要使用render props

render prop提供我们一种共享代码的组织方式。

共享代码都放在一个通用组件中。定制化的逻辑通过render prop来体现。

#### 3. 如何使用render props

首先确定通用组件逻辑，然后把不同的视图渲染抽成一个render prop。

比如，对于一个消息列表，可能不同主题对应的是不同的消息项渲染样式不同，那么消息列表可以作为通用组件，消息项渲染作为render prop

```
class MessageList extends React.Component {

	state = {
		list: []
	};
	
	componentDidMount() {
		fetchHistory()
			.then(
				({list}) => {
					this.setState({list});
				}
			);
	}
	render() {
		const {list} = this.state;
		const {renderMessageItem} = this.props;
		return (
			<div>
				<ul>
					{
						list.map(
							item => (
								<li
									key={item.id}
								>
									{renderMessageItem(item)}
								</li>
							)
						)
					}
				</ul>
			</div>
		);
	}
}

const renderMessageItem = ({content, userName}) => (
	<div>{`${userName}:${content}`}</div>
);

const MessageList2019 = () => {
	<MessageList
		renderMessageItem={renderMessageItem}
	/>
};

```

render prop是指作用是render的prop，而不是名称为“render”的prop。children也可以作为一个render prop，只要它是一个方法。

注意，render prop如果传入一个内联方法，就会使继承了React.PureComponent了的通用组件失去提高性能的效果，因为每次传入的render prop都是不同的。因此最好让render prop传入一个组件的属性方法，来保证每次传入的render prop都是相同的。

```
// good
const MessageList2019 = () => {
	<MessageList
		renderMessageItem={renderMessageItem}
	/>
};

// bad
const MessageList2019 = () => {
	<MessageList
		renderMessageItem={props => renderMessageItem(props))}}
	/>
};
```