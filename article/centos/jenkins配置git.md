## jenkins配置git

### 说明

jenkins可以配置成从git仓库自动拉取代码并执行构建步骤，已完成自动化构建及部署的过程

### git配置

打开一个任务，然后依次选择 “配置” -> “源码管理中的Git”，将git地址添加到Repository URL一栏中。

然后需要配置Credentials，如果没有Credentials，需要点击“Add”添加。

根据HTTP方式还是SSH方式，添加的这个Credentials选项的配置有所不同：如果是HTTP方式，需要填写user_name和user_password；如果是SSH方式，需要填写私钥，并将公钥放到git仓库里。

如果没有git秘钥，需要在服务器上手动生成。

### 构建步骤配置

选择 “增加构建步骤” -> “执行shell”（通常的构建步骤都是执行shell）

然后会出现shell脚本栏，在其中写构建脚本就可以了