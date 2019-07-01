---
layout: post
title:    leetcode-13 Roman to Integer
date:   2017-09-11 00:00:00 +0800
categories: CS
tag: leetcode
---
## 说明：

首先要弄清zigzag模式的概念，在博客http://blog.csdn.net/zhouworld16/article/details/14121477中，有很清晰的介绍。

根据题意，可以知道，若要得到正确的结果，只需要将输入的字符串按照zigzag模式分配给给定数目（numRows）的数组，然后再讲每个字符串拼接起来即可。

## 代码：

```
/** 
 * @param {string} s 
 * @param {number} numRows 
 * @return {string} 
 */  
var convert = function(s, numRows) {  
    var result = '';  
    var arr = [ ];  
    var down = true;  
    var index = 0;  
    var row = 0;  
    var i;  
    // 创建长度为numRows的数组  
    for (i = 0; i < numRows; i++) {  
        arr.push('');  
    }  
    // 为数组分配字符  
    while (index < s.length) {  
        arr[row] += s[index];  
        if (down) {  
            if (row < numRows - 1) {  
                row++;  
                if (row === numRows - 1) {  
                    down = false;  
                }  
            }  
        }  
        else {  
            if (row > 0) {  
                row--;  
                if (row === 0) {  
                    down = true;  
                }  
            }  
        }  
        index ++;  
    }  
    // 将数组中的字符串拼接得到结果  
    for (i = 0; i < arr.length; i++) {  
        result += arr[i];  
    }  
      
    return result;  
};  
```