---
layout: post
title: 记几个有用的css样式
date:   2018-04-03 00:00:00 +0800
categories: CS
tag: css
---
## -webkit-font-smoothing: antialiased;

该属性用于设置字体的抗锯齿或者说光滑度，可以让移动端的字体更纤细好看

## -webkit-overflow-scrolling: touch;

这个属性用于给scroller增加快速滚动和回弹效果

## ::-webkit-scrollbar

该属性用于设置滚动条样式
如

```
::-webkit-scrollbar    
{    
    width: 6px;    
    height: 6px;    
    background-color: #F5F5F5;    
}
```

可以设置滚动条尺寸和颜色

```
::-webkit-scrollbar    
{    
    display: none;   
}
```

隐藏滚动条

## -webkit-tap-highlight-color

该属性用于设置ios点击样式，这个属性只用于iOS (iPhone和iPad)。 

当你点击一个链接或者通过Javascript定义的可点击元素的时候，它就会出现一个半透明的灰色背景。 

要重设这个表现，你可以设置-webkit-tap-highlight-color为任何颜色。 

想要禁用这个高亮，设置颜色的alpha值为0即可。

```

-webkit-tap-highlight-color: rgba(0,0,0,0);

```

【引用：https://blog.csdn.net/qq807081817/article/details/46533547】
