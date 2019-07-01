## 说明

    题目要求判断一个括号序列是否合法。

    这是一个典型的栈问题。

## 代码

```
/** 
 * @param {string} s 
 * @return {boolean} 
 */  
var isValid = function(s) {  
    var stack = [];  
    var match = {  
        ')': '(',  
        ']': '[',  
        '}': '{',  
    };   
    for (var i = 0; i < s.length; i++) {  
        if (stack.length > 0 && match[s[i]] === stack[stack.length - 1]) {  
            stack.pop();  
        }  
        else {  
            stack.push(s[i]);  
        }  
    }  
    if (stack.length === 0) {  
        return true;      
    }  
    return false  
};  
```