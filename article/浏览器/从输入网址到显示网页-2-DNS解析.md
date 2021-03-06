
## 背景

   上回书说到，我们在浏览器里输入一个网址后，首先要进行域名解析，这是因为，机器之间的交互是通过IP地址进行路由通信的，因此需要把我们输入的域名解析成物理机器通信所使用的IP地址。这个过程就叫做域名解析。

   为什么需要域名呢？那是因为域名相对于IP地址更容易记忆。而且物理机的地址的管理和用户访问地址的管理本来就应该分开。这样比如网站要迁移（IP地址更换），或者域名更新（。。。）时，可以以更小的代价操作。

   域名也有其规则，它是一个树状的抽象系统。类似模块化开发中，命名空间的结构。顶级域名下对应多个二级域名，二级域名下又对应多个三级域名。顶级域名包括国际顶级域名和国家顶级域名。在国际顶级域名下，二级域名指的是域名注册人的网上名称；在国家顶级域名下，二级域名表示注册企业类别的符号。值得注意的是，‘com’，即是一个国际顶级域名，也是一个国家顶级域名下的二级域名，这常常使人感到疑惑。域名的相关概念在百度百科和之前推荐的文章中有详细介绍，不再赘述，下面说明一下DNS解析的步骤。

## DNS解析步骤

   DNS解析以主机输入域名开始，以主机获取到域名对应的IP地址结束。主机指的是输入域名的浏览器对应的PC，（这里忽略浏览器与主机的交互细节）。其中一个重要的角色是本地域名服务器，在域名解析的过程中，相当于主机将域名解析的任务托管给了本地域名服务器：主机告诉本地域名服务器，给我查询“http://***.*****.***的IP”，然后本地域名服务器进行域名查询，将结果（IP或者查询失败）返回给主机。那么我们关心的就是本地域名服务器如何进行域名解析。这里需要了解的概念是域名解析系统，它包括一系列的域名解析服务器（详情见[DNS原理总结及解析过程详解](http://blog.csdn.net/yipiankongbai/article/details/25031461)）。包括根域名服务器（根域名服务器知道左右顶级域名服务器的IP地址），顶级域名服务器（知道所有权限域名服务器的地址），和权限域名服务器地址（存有注册过的域名与IP映射）。进行域名解析时，本地域名服务器首先向根域名服务器发请求查询 被访问域名解析所在的顶级域名服务器地址，然后根据这个地址访问相应的顶级域名服务器，查询相应的权限域名服务器地址，然后访问这个权限域名服务器，查到域名对应的IP地址。最终本地服务器把获取到的IP地址结果返回给主机，DNS解析完成。

   基于上述讨论，域名解析过程（从主机输入域名到主机获取IP地址）一共有8步：

1).主机告诉本地域名服务器域名

2).本地域名服务器向根域名服务器发出请求

3).根域名服务器告诉本地域名服务器，域名所在的顶级域名服务器IP地址

4).本地域名服务器向顶级域名服务器发起请求

5).顶级域名服务器告诉本地域名服务器，域名所在的权限域名服务器

6).本地域名服务器向权限域名服务器发起请求

7).权限域名服务器告诉本地域名服务器，域名对应的IP

8).本地域名服务器将获取的IP返回给主机

## 域名解析缓存

   域名解析缓存的技术用来减少查询请求次数。

   域名解析缓存包括域名解析服务器缓存（包括本地域名服务器）缓存和主机DNS缓存。域名解析服务器会缓存查询过的域名（当然会设置过期时间），当一个域名解析请求过来时，如果在缓存中，则不必迭代地让请求服务器向下一级域名服务器发起请求，直接告知其结果即可。除了域名解析服务器，主机也会有域名映射缓存的机制。

   值得指出的是，本地域名服务器发起DNS请求之前，会先查询本机的hosts文件，如果文件中已经有相应的域名映射，则不必再去查询DNS解析服务器了。因此本地的hosts文件有很多作用，比如加快域名解析、方便局域网访问、屏蔽恶意网站（参见本地[hosts有哪些作用](https://jingyan.baidu.com/article/f0e83a258928d122e491017a.html)）。


