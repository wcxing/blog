---
layout: post
title:    leetcode-12 Integer to Roman
date:   2017-09-11 00:00:00 +0800
categories: CS
tag: leetcode
---
## 说明：

    该题目要求是将一个整数转换为一个罗马数字，所以首先要搞清楚罗马数字的规则。

## 罗马数字的规则：

    罗马数字和阿拉伯数字一样，都是十进制的，所以我们只要把每一位的数字拼凑到一起就可以了。但是有一点需要注意的是，罗马数字不同于阿拉伯数字，它的每一位数字表示方法不同，比如，对于阿拉伯数字，五用 ‘5’来表示，而五十只需要把 '5'放在十位就行了：‘50’，因为有0占位，因此不会有任何歧义。但是罗马数字没有占位机制，因此各个位的表示方法不同，如五用罗马数字表示为 ‘V’，五十则为 ‘X’。

    虽然罗马数字每一个位对应的数字符号不同，但是表示的方法都是一样的，都是通过表示‘1’的符号和表示‘5’的符号组合而成。表示方法如下：假设某一位表示‘1’的符号为A，表示‘5’的符号为B，则 0，1，2，3，4，5，6，7，8，9分别为     ‘’（空字符），A, AA, AAA, AB(可以这么理解，A位于B左侧相当于B-A，A位于B右侧相当于B+A), B, BA, BAA, BAAA, AC(C是更高一位的‘1’，相当于10 - 1)。

    根据上面的叙述，我们只需要知道每一位表示 ‘1’和 ‘5’的符号，就可以按照上述规则拼凑起罗马数字了。

    值得注意的是，题目中说明输入整数从1 ~ 3999 ，因此只需要知道个位到千位的表示符号即可。

3.代码：

```
/** 
 * @param {number} num 
 * @return {string} 
 */  
var intToRoman = function(num) {  
    var result = '';  
    var temp;  
    var list = [  
        {  
            one: 'I',  
            five: 'V'  
        },  
        {  
            one: 'X',  
            five: 'L'  
        },  
        {  
            one: 'C',  
            five: 'D'  
        },  
        {  
            one: 'M'  
        }  
    ];  
  
    var map = function (integer, cur, next) {  
        var one = cur.one;  
        var five = cur.five;  
        var ten = next && next.one;  
        switch (integer) {  
            case 0:  
                return '';  
            case 1:  
                return one;  
            case 2:  
                return one + one;  
            case 3:  
                return one + one + one;  
            case 4:  
                return one + five;  
            case 5:   
                return five;  
            case 6:  
                return five + one;  
            case 7:  
                return five + one + one;  
            case 8:  
                return five + one + one + one;  
            case 9:  
                return one + ten;  
        }  
    };  
    while (num) {  
        temp = num % 10;  
        result = map(temp, list[0], list[1]) + result;  
        list.shift();  
        num = Math.floor(num / 10);  
    }  
  
    return result;  
  
};  
```