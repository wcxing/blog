## 代码
```
/** 
 * @param {number[]} gas 
 * @param {number[]} cost 
 * @return {number} 
 */  
var canCompleteCircuit = function(gas, cost) {  
    var arr = [];  
    var curSum = 0;  
    var positiveSum = 0;  
    var positiveIndex = 0;  
    var index = gas.length - 1;  
    gas.forEach((item, index) => {  
        arr.push(item - cost[index])  
    });  
    while (index >= 0) {  
        if (arr[index] < 0) {  
            curSum = arr[index--];  
            while (curSum < 0 && index >= 0) {  
                curSum += arr[index--];  
            }  
            if (index < 0) {  
                if (curSum + positiveSum >= 0) {  
                    return positiveIndex  
                }  
                else {  
                    return -1  
                }  
            }  
            else {  
                positiveSum += curSum;  
                positiveIndex = index + 1;  
                curSum = 0;  
            }  
        }  
        else {  
            while (arr[index] >= 0 && index >= 0) {  
                positiveSum += arr[index];  
                positiveIndex = index--;  
            }  
            if (index < 0) {  
                return 0  
            }  
        }  
    }  
    return -1  
};  
```