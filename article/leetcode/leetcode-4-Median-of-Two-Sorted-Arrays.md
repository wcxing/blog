## 说明：

先将两个数组归并，然后找出中间值

## 代码：

```
/** 
 * @param {number[]} nums1 
 * @param {number[]} nums2 
 * @return {number} 
 */  
var findMedianSortedArrays = function(nums1, nums2) {  
    var arr = [];  
    var i = 0;  
    var j = 0;  
    var k = 0;  
    var mid;  
    while (i < nums1.length && j < nums2.length) {  
        if (nums1[i] < nums2[j]) {  
            arr.push(nums1[i++]);  
        }  
        else {  
            arr.push(nums2[j++]);  
        }  
    }  
  
  
    if (i < nums1.length) {  
        for (k = i; k < nums1.length; k++) {  
            arr.push(nums1[k]);  
        }  
    }  
    if (j < nums2.length) {  
        for (k = j; k < nums2.length; k++) {  
            arr.push(nums2[k]);  
        }  
    }  
  
  
    if (arr.length % 2 === 0) {  
        mid = (arr.length / 2) - 1;  
        return (arr[mid] + arr[mid + 1]) / 2;  
    }  
    else {  
        mid = (arr.length + 1) / 2 - 1;  
        return arr[mid];  
    }  
};  
```