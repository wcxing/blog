## init.js做了些什么

#### 1. 计算package.json并写入package.json文件

脚本根据 1. 模板项目目录下的template.json文件中的package字段和 2. 初始化的项目（myapp）中的package.json文件，将两者按照一定规则合并，得到最中的myapp中的package.json文件内容

- dependencies
- scripts
- eslintConfig
- browserslist

#### 2. 写README.md

#### 3. 拷贝项目模板文件

将模板项目中的`template`目录拷贝到`myapp`目录中

#### 4. 写.gitignore文件

将`myapp`目录中的`gitignore`文件和`.gitignore`文件合并

#### 5. 初始化git，git init

#### 6. 安装依赖

#### 7. 移除安装的模板

#### 8. git commit

## 如何修改init.js加载自定义模板

如果我们希望定制自己的项目模板，可以通过以下步骤来实现

1. 首先，在我们的`react-scripts`目录中增加自己的项目模板目录`my-template`
2. 其中创建目录和文件`template/`、`package.json`、`template.json`、`README.md`
3. 在`template/`目录中创建文件`gitignore`并在目录中实现自己定制模板的目录结构和必要依赖和一些模板文件，如redux、router等等
4. 修改init.js文件，让template读取地址指向我们自己的react-scripts下的`my-template`目录。