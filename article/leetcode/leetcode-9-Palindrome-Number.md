---
layout: post
title:   leetcode-9 Palindrome Number
date:   2017-06-26 00:00:00 +0800
categories: CS
tag: leetcode
---
## 说明

判断一个数字是否具有回文特性，不允许使用额外存储空间

思路是，先将改数转换为一个字符串，然后一次比较头尾两个字符是否相等，然后掐头去尾。如果一直相等直到只剩下0个字符或者1个字符，那么可以断定改数为回文数



## 代码

```
var isPalindrome = function(x) {  
    x = '' + x;  
    while (x !== '') {  
        if (x[0] === x[x.length - 1] && x.length >= 2) {  
            x = x.slice(1, x.length - 1).slice(0, x.length - 2);  
        }  
        else {  
            break;  
        }  
    }  
      
    if (x.length <= 1) {  
        return true;  
    }  
    return false;  
};  
```