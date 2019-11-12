## Portals

#### 1. 背景

通常组件render返回一个React元素时，它会被挂载到DOM节点中最近的父节点

而有时候，我们希望把一些React元素渲染到指定的元素，而非该组件最近父元素DOM节点中。比如，对话框、悬浮卡、提示框这种需要在视觉上跳出其容器的场景。

这时候，我们需要在render中返回一个portal元素而非一个普通的React元素。

#### 2. React.createPortal

```
render() {
  // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
  // `domNode` 是一个可以在任何位置的有效 DOM 节点。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

#### 3. portal组件的事件

portal组件的事件冒泡是会传递到其父组件上，而非其DOM数的父节点

#### 4. 示例，Modal的实现和info的实现

```
import React from 'react';

// Modal接收参数“visible”，控制其展示或者隐藏
// 展示时候，会在body元素下创建一个div并挂载之
// 隐藏时候，卸载组件并移除这个div元素
// Modal渲染children
class Modal extends React.Component {
    constructor() {
        super();
        this.createWrapper();
    }

    createWrapper() {
        this.destroyWrapper();
        this.wrapper = document.createElement('div);
        document.body.appendChild(this.wrapper);
    }

    destroyWrapper() {
        if (this.wrapper) {
            document.body.removeChild(this.wrapper);
            this.wrapper = null;
        }
    }

    componentWillReceiveProps({visible}) {
        if (visible) {
            this.createWrapper();
        }
    }

    componentDidUpdate() {
        const {visible} = this.props;
        if (!visible) {
            this.destroyWrapper();
        }
    }

    render() {
        const {children} = this.props;
        reuturn (
            React.createPortal(
                children
                this.wrapper
            );
        );
    }
}

```