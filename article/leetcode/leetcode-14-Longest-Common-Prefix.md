## 说明：

    题目要求找出一个字符串数组中的所有字符串的最长前缀。

## 代码：

```
/** 
 * @param {string[]} strs 
 * @return {string} 
 */  
var longestCommonPrefix = function (strs) {  
    var result = '';  
    var  breakFlag = false;  
    var curStr = '';  
    var i = j = 0;  
    if (!strs.length) {  
        return result;  
    }  
    while (true) {  
        if (i > strs[0].length - 1) {  
            break;  
        }  
        curStr = strs[0][i];  
        for (j = 0; j < strs.length; j++) {  
            if (strs[j][i] !== curStr || i > strs[j].length - 1) {  
                breakFlag = true;  
                break;  
            }  
            else if (j === strs.length - 1) {  
                result += strs[j][i];  
            }  
        }  
        if (breakFlag) {  
            break;  
        }  
        i++;  
    }  
  
    return result;  
};  
```