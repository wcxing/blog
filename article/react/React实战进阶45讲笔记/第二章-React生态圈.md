#### 11. Redux(1) 前端为何需要状态管理

什么时候应该使用状态管理

1. 组件间共享状态
2. 状态持久化

redux特性

1. single source of truth （单向数据流）
2. 可预测性 state + action → new state（不可变数据）

	redux相对mobx来说
	
	优点：状态管理更集中，只有触发action才能改变state
	缺点：样板代码多、性能不高，需要reselect支持
3. 纯函数（reducer）更新store

#### 12. Redux（2） : 深入理解Store、Action、Reducer

#### 13. Redux（3） : 在React中使用Redux
#### 14. Redux（4） : 理解异步Action、Redux中间件
#### 15. Redux（5） : 如何组织Action和Reducer
#### 16. Redux（6） : 理解不可变数据（Immutability）

不可变数据，即对于引用类型的数据，若属性改变，则引用改变。

为何需要不可变数据

1. 性能优化

	由于store更新后，视图需要判断数据是否发生了改变。如果store使用不可变数据，那么就不需要进行深层对比，只要判断引用是否改变即可

2. 易于调试和跟踪

	易于记录改变前的状态和改变后的状态，进而方便调试

3. 易于推测

	更容易预测代码的执行结果
	
如何操作不可变数据

1. {...}、Object.assign （只有一层的场景）
2. immutability-helper
3. immer
	
	优点是操作不可变数据的方式和正常操作数据形式一样
	缺点是性能较差

#### 17. React Router（1）：路由不只是页面切换，更是代码组织方式

为什么需要路由

1. 单页应用需要进行页面切换
2. 通过URL可以定位到页面（用户刷新时候直接跳转到相应页面）
3. 更有语义地组织资源

【前后端路由对比】

1. 降低前后端耦合
2. 减少页面跳转的请求，提升体验

3种路由实现方式

1. URL路径
2. hash（兼容性好，支持低版本浏览器）
3. 内存路由（与URL无关）

基于路由配置进行资源组织的好处

1. 实现业务逻辑的松耦合
2. 易于扩展、重构和维护
3. 路由层面实现lazy load

#### 18. React Router（2）：参数定义，嵌套路由的使用场景

页面状态尽量通过URL参数定义，而不是内部状态。这样从其他页面跳到当前页面就可以通过URL传参进行方便的信息传递。

#### 19. UI组件库对比和介绍：Ant.Design、Material UI、Semantic UI

1. ant-design

	企业级组件库【设计思想：开发者只需要关心数据结构和业务逻辑，而不需要关心HTML结构】
	
2. material-ui

	UI更好看，适合C端
3. semantic-ui

组件库的选择

1. 组件是否全
2. 样式风格是否符合业务需求
3. API是否便捷灵活
4. 技术支持是否完善
5. 开发是否活跃

#### 20. 使用Next.js创建React同构应用
#### 21. 使用Jest、Enzyme等工具进行单元测试
#### 22. 常用开发调试工具：ESLint、Prettier、React DevTool、Redux DevTool