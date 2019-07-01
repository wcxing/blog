## 说明

最长回文串，考虑到长度为奇数的回文串和长度为偶数的回文串。

## 代码

```
var longestPalindrome = function(s) {  
  
    var max = 0;  
    var mark = {  
        i: 0,  
        j: 0  
    };  
    var result = '';  
  
    var getOddLength = function (s, index) {  
        var i = index;  
        var j = index;  
        while (i >= 0 && j < s.length) {  
            if (s[i] === s[j]) {  
                i--;  
                j++;  
            }  
            else {  
                break;  
            }  
        }  
        return j - i + 1;  
    };  
    var getEvenLength = function (s, index) {  
        if (index >= s.length ) {  
            return 0;  
        }  
        var i = index;  
        var j = index + 1;  
        while (i >= 0 && j < s.length) {  
            if (s[i] === s[j]) {  
                i--;  
                j++;  
            }  
            else {  
                break;  
            }  
        }  
        return j - i + 1;  
    };  
    var getResult = function (mark, s) {  
        var i = mark.i;  
        var j = mark.j;  
        var str = '';  
        while (i >= 0 && j < s.length) {  
            if (s[i] === s[j]) {  
                str = s[i] + str;  
                if (i !== j) {  
                    str = str + s[j];  
                }  
                i--;  
                j++;  
            }  
            else {  
                break;  
            }  
        }  
        return str;  
    };  
    for (var i = 0; i < s.length; i++) {  
        var l1 = getOddLength(s, i);  
        var l2 = getEvenLength(s, i);  
        if (l1 > max) {  
            max = l1;  
            mark.i = i;  
            mark.j = i;  
        }  
        if (l2 > max) {  
            max = l2;  
            mark.i = i;  
            mark.j = i + 1;  
        }  
    }  
    return getResult(mark, s);  
};  
```