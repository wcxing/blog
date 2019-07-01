## 说明：

32位有符号整数的范围就是-2^31 ~ 2^31。

该题目有个细节要注意，就是不仅输入的数32位溢出时要返回0。而且翻转后的数32位溢出时也要返回0。

## 代码：

```
/** 
 * @param {number} x 
 * @return {number} 
 */  
var reverse = function(x) {  
    var result = 0;  
    if (Math.abs(x) >= 2147483648) {  
        result = 0;  
    }  
    else {  
        if (x >= 0) {  
            result = +(('' + x).split('').reverse().join(''));  
        }  
        else {  
            result = -(('' + -x).split('').reverse().join(''))  
        }  
    }  
    if (Math.abs(result) >= 2147483648) {  
        result = 0;  
    }  
    return result;  
};  
```