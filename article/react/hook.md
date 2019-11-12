## React Hook

#### 1. hook api的动机

- 提供组件之间状态逻辑复用的方案（除高阶组件和render props之外的）
- 状态逻辑和副作用按照关联性组织在一起，而非按照生命周期分割开来
- 增强functional component，避免了class component的一些问题（不容易理解、热重载有问题，影响压缩性能等等）


#### 2. hook规则

- 在React函数组件中调用hook，而不要在普通的JavaScript函数中调用hook，不要在class component中调用hook（遵循此逻辑，确保组件的状态逻辑在代码中清晰可见）
- 在React函数最顶层调用hook，而不要在条件或嵌套语句中调用（因为React是根据hook调用顺序来让组件内部的state和hook本身关联在一起，如果不保证只在React函数最顶层调用hook就无法保证hook的调用顺序，如果我们希望有条件地执行一个副作用，可以将判断放在effect内部）

#### 3. 内置hook

- useState 用于创建一个状态和改变这个状态的函数
- useEffect 执行副作用方法，React每次更新完组件后（dom渲染完成后）都会调用这里定义的方法，第二个参数是个数组，用于进行性能优化，只有数组中的变量更新，才执行相应定义的effect
- userContext 用于接收最近相关Provider祖先节点传过来的value

- useReducer 以redux的形式管理组件状态

【思考】：个人感觉useEffect和mobx中的autorun有点像

#### 4. 自定义hook

自定义hook是一个函数

自定义hook以“use”开头（这个约定让React可以自动检测你的hook是否符合hook规则）

自定义hook内部可以调用其他的hook

自定义hook式对状态逻辑的封装，不同组件可以复用自定义hook，不同的组件使用相同的hook后，之间并不会共享相同的state。

#### 5. 多个hook之间传递信息

hook，包括内置的hook和自定义的hook，就是一个函数，因此可以通过传参来在不同hook之间传递信息。

#### 6. 示例

1. useState

	```
	import React, { useState } from 'react';
	
	function Example() {
	  // 声明一个叫 "count" 的 state 变量
	  const [count, setCount] = useState(0);
	
	  return (
	    <div>
	      <p>You clicked {count} times</p>
	      <button onClick={() => setCount(count + 1)}>
	        Click me
	      </button>
	    </div>
	  );
	}
	```

2. useEffect
	
	```
	// 手动更改 React 组件中的 DOM
	import React, { useState, useEffect } from 'react';
	
	function Example() {
	  const [count, setCount] = useState(0);
	
	  useEffect(() => {
	    document.title = `You clicked ${count} times`;
	  });
	
	  return (
	    <div>
	      <p>You clicked {count} times</p>
	      <button onClick={() => setCount(count + 1)}>
	        Click me
	      </button>
	    </div>
	  );
	}
	
	// 设置订阅
	import React, { useState, useEffect } from 'react';

	function FriendStatus(props) {
	  const [isOnline, setIsOnline] = useState(null);
	
	  useEffect(() => {
	    function handleStatusChange(status) {
	      setIsOnline(status.isOnline);
	    }
	
	    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
	    // Specify how to clean up after this effect:
	    return function cleanup() {
	      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
	    };
	  });
	
	  if (isOnline === null) {
	    return 'Loading...';
	  }
	  return isOnline ? 'Online' : 'Offline';
	}
	
	// 数据获取，第二个参数传一个空数组，这样effect只在第一次渲染完成后调用
	useEffect(()=>{
	    axios.get('/getYearMonth').then(res=> {
	        console.log('getYearMonth',res);
	        setValues(oldValues => ({
	            ...oldValues,
	            fileList:res.data.msg
	        }));
	    })
	},[]);
	
	```

- 多个hook之间传递信息

	```
	import React, { useState, useEffect } from 'react';

	// 定义一个hook，根据传入的friendID来监听其状态（在线/离线）
	function useFriendStatus(friendID) {
	  const [isOnline, setIsOnline] = useState(null);
	
	  useEffect(() => {
	    function handleStatusChange(status) {
	      setIsOnline(status.isOnline);
	    }
	
	    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
	    return () => {
	      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
	    };
	  });
	
	  return isOnline;
	}
	
	// 定义一个组件“ChatRecipientPicker”，使用useState的hook，并将产生的state传入到上面自定义的hook中
	const friendList = [
	  { id: 1, name: 'Phoebe' },
	  { id: 2, name: 'Rachel' },
	  { id: 3, name: 'Ross' },
	];
	
	function ChatRecipientPicker() {
	  const [recipientID, setRecipientID] = useState(1);
	  const isRecipientOnline = useFriendStatus(recipientID);
	
	  return (
	    <>
	      <Circle color={isRecipientOnline ? 'green' : 'red'} />
	      <select
	        value={recipientID}
	        onChange={e => setRecipientID(Number(e.target.value))}
	      >
	        {friendList.map(friend => (
	          <option key={friend.id} value={friend.id}>
	            {friend.name}
	          </option>
	        ))}
	      </select>
	    </>
	  );
	}
	```