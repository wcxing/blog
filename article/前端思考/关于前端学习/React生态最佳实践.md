#### 0. 前言

使用React框架开发应用，需要解决的一个问题是，如何设计组件来满足业务需求，即如何把视图、交互和业务逻辑抽象成一个React组件。

最简单的场景就是这个组件只包含视图界面和一些交互，那么只需要根据父组件传递的属性进行视图的渲染即可，使用functional component比较合适。

在另外一些场景中，状态的变化会带来副作用的操作，这就需要我们实现 根据状态变化处理相关的副作用 的逻辑。

下面总结一下 状态变化引发处理副作用 的几个场景

#### 1. 对比新旧props，做副作用操作

对于class component，把旧props缓存在当前组件实例上面（而不是缓存在state上面），在componentDidUpdate钩子中对比props变化，做副作用操作

对于functional component，把旧的props缓存在functional component外。在useEffect hook中对比props变化，做副作用操作。

#### 2. props变化后，不需要React更新dom，只对比新旧props，做副作用操作

比如，封装一个播放器组件，当props变化后，不更新<video>标签dom，只是调用其play、pause等方法。

这个和第一种情况类似，但是因为不能让React更新dom，所以要注意传给子dom元素的属性不能变化。

#### 3. 根据update之前的dom状态，决定update后做一些副作用操作

class component，使用getSnapshotBeforeUpdate钩子记录dom状态，在componentDidUpdate里面根据getSnapshotBeforeUpdate的传值进行副作用操作。

functional component，在function里面计算dom状态，在useEffect钩子里面根据前一步计算的dom状态进行副作用操作。