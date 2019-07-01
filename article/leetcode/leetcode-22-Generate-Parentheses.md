---
layout: post
title:          leetcode-22 Generate Parentheses
date:   2017-12-23 00:00:00 +0800
categories: CS
tag: leetcode
---
## 说明：

    题目要求找出n个括号所能组成的所有合法括号序列，所谓合法括号序列，指的是从左到右遍历序列，任意位置都满足，左括号的个数大于等于右括号的个数。

## 代码：

```
/** 
 * @param {number} n 
 * @return {string[]} 
 */  
var generateParenthesis = function(n) {  
    var stack = [];  
    var result = [];  
    var curLeft = 0;  
    var curRight = 0;  
    function getEnd(n) {  
        var result = ''  
        for (var i = 0; i < n; i++) {  
            result += '()';  
        }  
        return result;  
    }  
    var end = getEnd(n);  
    function reachEnd() {  
        return stack.join('') == end;  
    }  
    function init() {  
        for (var i = 0; i < n; i++) {  
            stack.push('(')  
        }  
        for (var i = 0; i < n; i++) {  
            stack.push(')')  
        }  
        result.push(stack.join(''));  
    }  
    init();  
    while (!reachEnd()) {  
        // 出栈  
        while (true) {  
            var ele = stack.pop();  
            if (ele == '(') {  
                curLeft++  
                if (curLeft < curRight) {  
                    break;  
                }  
            }  
            else {  
                curRight++  
            }  
        }  
        // 入栈  
        while (curRight) {  
            stack.push(')');  
            curRight--;  
            while (curLeft) {  
                stack.push('(')  
                curLeft--  
            }  
            while (curRight) {  
                stack.push(')')  
                curRight--  
            }  
        }  
        result.push(stack.join(''))  
    }  
    return result  
};  
```