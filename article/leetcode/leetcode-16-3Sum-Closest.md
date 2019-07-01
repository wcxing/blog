## 说明

    题目是，给定一个数组，和一个目标值，找出数组中的3个数，这3个数之和离目标值最近。

    可以直接想出的方法就是三重循环遍历。为了减少计算，需要先对数组进行排序，然后根据遍历中当前3个元素之和与目标值的关系判定是否需要继续向后遍历。

## 代码

```
/** 
 * @param {number[]} nums 
 * @param {number} target 
 * @return {number} 
 */  
var threeSumClosest = function(nums, target) {  
    var list = nums.sort(function (a, b) {  
        return a - b;  
    });  
  
    var distance = Math.abs((list[0] + list[1] + list[2]) - target);  
    var tempSum;  
  
    for (var i = 0; i < list.length; i++) {  
        for (var j = i + 1; j < list.length; j++) {  
            for (var k = j + 1; k < list.length; k++) {  
                if (Math.abs(list[i] + list[j] + list[k] - target) > distance) {  
                    if ((list[i] + list[j] + list[k] - target) > 0) {  
                        break;  
                    }  
                }  
                else {  
                    distance = Math.abs(list[i] + list[j] + list[k] - target);  
                    tempSum = list[i] + list[j] + list[k];  
                }  
            }  
        }  
    }  
    return tempSum;  
};  
```