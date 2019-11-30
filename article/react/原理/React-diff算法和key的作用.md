## diff算法和key的作用

#### 0. 背景

我们都知道，使用React开发web应用时候，基本不需要开发者对DOM进行操作。React的虚拟DOM用来实现对应用的组件树的抽象。它还提供了从应用到DOM树的一个映射。如果应用的改动导致了DOM的实际变化，React就会自动更新相应的DOM。

组件的更新是否导致了DOM的更新，哪些DOM需要更新，这需要进行相关的计算。组件树更新后，需要对比新老组件树的更新。这就用到了React的diff算法。

#### 1. diff算法

React的diff算法基于两个假设：

1. 不同元素的类型会产生不同的树
2. 开发者可以通过```key prop```标识一个元素在不同的渲染下可以保持稳定（及相同key的元素不需要更新整个元素，不同的key需要更新整个元素）

基于上述假设，React的diff算法的主要思想可以总结如下：

1. 如果新老节点的类型不同，直接替换以之为根节点的整个子树。如果新老节点类型相同，则判断节点属性有无变化，若有变化，更新其属性，然后递归地协调子节点（可能是单个子节点，也可能是子节点列表）。
2. 如果新老节点key属性值不同，则直接更新整个子树。若相同，更新属性和子节点。
3. 如果子节点有多个，则会根据key值进行判断，看子节点数组是否有顺序变化，如果有顺序变化，则先做节点移动处理。

#### 2. 列表的key

React对于列表的更新，也是尽可能地少做DOM操作。因此对于子节点是数组的情况，会有比较复杂的比较，以保证尽量小的更新。比如对于列表[1,2,3]变成[0,1,2,3]时候，虽然前3个元素完全不同了，但是React并不会把之前的列表完全替换，而是会在之前的列表前面添加“0”。当然实现这个效果需要开发者给列表添加“key prop”，以便React可以进行必要的对比操作，已确定列表的真实改动。

对于有key prop的列表的对比算法细节目前我还没有太详细的研究，可以先通过一个demo看下React的列表渲染逻辑，看列表改变后，实际更新的DOM的情况。

```
import React from 'react';

const a = [
    {id: '1', content: '1'},
    {id: '2', content: '2'},
    {id: '3', content: '3'},
];

const b = [
    {id: '1', content: '1'},
    {id: '2', content: '2'},
    {id: '3', content: '3'},
    {id: '4', content: '4'},
];

export default class TestStore extends React.Component {
    state = {
        list: a
    };

    componentDidMount() {
        observeDOM();
    }

    handleClick = () => {
        this.setState({list: b});
    };

    render() {
        return (
            <div className="demo-container">
                <button
                    onClick={this.handleClick}
                >
                    点击
                </button>
                <ul>
                    {
                        this.state.list.map(({id, content}) => (
                        <li key={id}>{content}</li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

// 监听DOM变化并打印更新情况
function observeDOM() {
    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationsList) => {
        mutationsList.forEach((mutation, index) => {
            console.log(`loop ${index}`);
            const {addedNodes, removedNodes} = mutation;
            addedNodes.forEach(node => {
                console.log('added: ', node.innerHTML);
            });
            removedNodes.forEach(node => {
                console.log('removed: ', node.innerHTML);
            });
            console.log(`--------------------------\n`);
        });
    };
    const observer = new MutationObserver(callback);

    observer.observe(document, config);
};

```

上面demo中展示了当列表变化后，实际的DOM更新情况。下面看下不同的a、b list对应的DOM改动。

1. 后面添加元素

	```
	// 列表
	const a = [
	    {id: '1', content: '1'},
	    {id: '2', content: '2'},
	    {id: '3', content: '3'},
	];
	
	const b = [
	    {id: '1', content: '1'},
	    {id: '2', content: '2'},
	    {id: '3', content: '3'},
	    {id: '4', content: '4'},
	];
	
	// 输出结果
	loop 0
	added:  4
	--------------------------
	```

2. 前面添加元素

	```
	// 列表
	const a = [
	    {id: '1', content: '1'},
	    {id: '2', content: '2'},
	    {id: '3', content: '3'},
	];
	
	const b = [
	    {id: '4', content: '4'},
	    {id: '1', content: '1'},
	    {id: '2', content: '2'},
	    {id: '3', content: '3'},
	];
	
	// 输出结果
	loop 0
	added:  4
	--------------------------
	```

3. 中间添加元素

	```
	// 列表
	const a = [
	    {id: '1', content: '1'},
	    {id: '2', content: '2'},
	    {id: '3', content: '3'},
	];
	
	const b = [
	    {id: '1', content: '1'},
	    {id: '4', content: '4'},
	    {id: '2', content: '2'},
	    {id: '3', content: '3'},
	];
	
	// 输出结果
	loop 0
	added:  4
	--------------------------
	```

4. 改变顺序

	```
	// 列表
	const a = [
	    {id: '1', content: '1'},
	    {id: '2', content: '2'},
	    {id: '3', content: '3'},
	];
	
	const b = [
	    {id: '2', content: '2'},
	    {id: '1', content: '1'},
	    {id: '3', content: '3'},
	];
	
	// 输出结果
	loop 0
	removed:  1
	--------------------------
	
	loop 1
	added:  1
	--------------------------
	```

从上面结果可以看出，当我们在列表的前面、后面、中间添加一个元素时候，React都只会添加相应的元素，而不会重新渲染整个列表。

而当我们改变列表顺序时候，React也只是通过移动元素来使列表更新，并没有更新整个列表。