## 说明

    当我们使用手机的9键键盘时，每个按键对应多个字母，我们按下几个键后，对应多种可能的字母组合。题目要求根据输入的数字求出所有可能的字母组合。这个题就是简单的递归题目，和字符全排列类似。

## 代码

```
/** 
 * @param {string} digits 
 * @return {string[]} 
 */  
var letterCombinations = function(digits) {  
    const map = {  
        '2': ['a', 'b', 'c'],  
        '3': ['d', 'e', 'f'],  
        '4': ['g', 'h', 'i'],  
        '5': ['j', 'k', 'l'],  
        '6': ['m', 'n', 'o'],  
        '7': ['p', 'q', 'r', 's'],  
        '8': ['t', 'u', 'v'],  
        '9': ['w', 'x', 'y', 'z']  
    };  
    var result = [];  
    const it = (prefix, seq, result) => {  
        if (seq.length === 0) {  
            return;  
        }  
        else if (seq.length === 1) {  
            map[seq[0]].forEach((item, index) => {  
                result.push(prefix + item);  
            });  
            return;  
        }  
        else {  
            map[seq[0]].forEach((item, index) => {  
                it(prefix + item, seq.slice(1), result);  
            });  
        }  
    }  
  
    it('', digits, result);  
  
    return result;  
};  

```