## CSS语义化

提高css代码的可读性、可维护性和可扩展性有哪些模式和最佳实践？

#### 1. 复用性

首先要考虑的是css代码的复用性。由于之前css没有变量，因此使用一些技术来实现css代码复用

1. 原子css

	以表现为中心，css选择器名称不反映元素的角色，只是反映元素的样式
	
	```
	.btn-primary {
		background: red;
	}
	```
	
	```
	<button class="btn-primary"></button>
	```

2. 预编译语言，less/sass
3. css variables

	兼容性需要考虑

#### 2. 语义化

上述css复用方案中，第一种是一种反模式。这种方案的语义性比较差。
