---
layout: post
title:    leetcode-13 Roman to Integer
date:   2017-09-11 00:00:00 +0800
categories: CS
tag: leetcode
---
## 说明：

    题目要求将罗马数字转为阿拉伯数字。思路是从个位开始，匹配各个位的数字，一直到最高位为止。需要注意两点，第一是要移除已经匹配完的数字，防止在匹配更高位数字时产生歧义。第二是在匹配的时候，为防止歧义，应遵循一定顺序，比如应先匹配4，6，7，8然后再匹配5。

## 代码：

```
/** 
 * @param {string} s 
 * @return {number} 
 */  
var romanToInt = function(s) {  
    var num = 0;  
    var list = [  
        {  
            grade: 1,  
            one: 'I',  
            five: 'V'  
        },  
        {  
            grade: 10,  
            one: 'X',  
            five: 'L'  
        },  
        {  
            grade: 100,  
            one: 'C',  
            five: 'D'  
        },  
        {  
            grade: 1000,  
            one: 'M'  
        }  
    ];  
  
    var map = function (cur, next) {  
        var result = 0;  
        var one = cur.one;  
        var five = cur.five;  
        var ten = next && next.one;  
  
        var nine = ten ? (one + ten) : 'doomliu';  
  
        var fiveIndex = s.indexOf(five);  
        var oneIndex = s.indexOf(one);  
        var nineIndex = s.indexOf(nine);  
        if (nineIndex !== -1) {  
            s = s.slice(0, nineIndex);  
            result = 9;  
        }  
        else if (fiveIndex !== -1) {  
            var preIndex = postIndex = fiveIndex;  
            while (preIndex >= 0 && (s[--preIndex] === one)) { }  
            while (postIndex <= s.length - 1 && (s[++postIndex] === one)) { }  
            s = s.slice(0, preIndex + 1);  
            result = 5 + ((postIndex - 1) + (preIndex + 1) - 2 * fiveIndex);  
        }  
        else if (oneIndex !== -1) {  
            var postIndex = oneIndex;  
            while (postIndex <= s.length - 1 && s[++postIndex] === one) { }  
            s = s.slice(0, oneIndex);  
            result = (postIndex - 1) - oneIndex + 1;  
        }  
  
        result *= cur.grade;  
        return result;  
    };  
  
    while (list.length) {  
        num += map(list[0], list[1]);  
        list.shift();  
    }  
  
    return num;  
  
};  
```