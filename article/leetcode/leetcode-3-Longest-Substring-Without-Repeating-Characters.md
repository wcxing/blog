## 说明

最基本的思路是，遍历字符串，计算以每个字符开头的无重复子串长度，但是这样做的复杂度会很大，无法通过最后一个用例（这个题目的最后一个用例是用来测试算法的时间复杂度的）。

线性复杂度的算法思想描述如下：

遍历字符串，每次计算以当前字符结尾的最长不重复子串的length，遍历完成时，就得到了整个字符串的最长不重复子串。遍历时，将每个遇到的字符及其index以key：value形式存入一个hash中，我们每遇到一个字符，从hash中取寻找，判断之前是否遇见过，如果遇见过，那以当前字符结尾的最长不重复子串的开头字符的index的最小值就是最近一次遇到的这个字符的index。那么是不是说，最近一次遇到的这个字符的index就是开头了呢？不一定，因为我们要保证两个这两个相同的字符之间没有重复字符。如何保证这一点呢？这需要我们维护一个 名叫  start 的变量，每次发现一个字符之前遇到过，那就将start更新为 之前遇到的字符index。

## 代码
```
/** 
 * @param {string} s 
 * @return {number} 
 */  
var lengthOfLongestSubstring = function(s) {  
    var hash = { };  
    var start = -1;  
    var max = 0;  
    var dis = 0;  
    for (var i = 0; i < s.length; i++) {  
        if (hash[s[i]] === undefined) {  
            dis = i - start;  
        }  
        else {  
            if (hash[s[i]] > start) {  
                dis = i - hash[s[i]];  
                start = hash[s[i]];  
            }  
            else {  
                dis = i - start;  
            }  
        }  
        hash[s[i]] = i;  
        max = (dis > max) ? dis : max;  
    }  
    return max;  
};  
```