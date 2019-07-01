## centos安装常用软件

### 安装Nginx

1. yum -y update
2. yum -y install gcc gcc-c++ autoconf pcre pcre-devel make automake
3. yum -y install wget telnet httpd-tools vim
4. yum -y install gcc-c++ gcc
5. yum install -y pcre pcre-devel
6. yum install -y zlib zlib-devel
7. yum install -y openssl openssl-devel
8. vim /etc/yum.repos.d/nginx.repo
9. 将代码复制进去
```
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/7/$basearch/
gpgcheck=0
enabled=1
```
10. yum -y install nginx

### 安装git

```yum install git```

### 安装java

```yum -y install java-1.8.0-openjdk-devel```

### 安装jenkins

* 下载yum源

```sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo```

* 导入

```sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key```

* 安装

```yum -y install jenkins```

* 启动

```systemctl start jenkins.service```

* 设置开机启动

```chkconfig jenkins on```

* 查看初始密码

```cat /var/lib/jenkins/secrets/initialAdminPassword```

### 安装node nvm

* 安装nvm
	```wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash```
	
* 使用nvm安装node
	```nvm install 8.11.1```