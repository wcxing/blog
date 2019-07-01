---
layout: post
title:      leetcode-15 3sum
date:   2017-11-18 00:00:00 +0800
categories: CS
tag: leetcode
---
## 说明

    题目是，给定一个数组（nums），返回一个数组（假定为result），result的每个元素都是一个数组（假定为ele），ele长度为3，其中的3个元素不重复地取自nums，并且这3个元素之和为0。result中的各数组要保证3元素组合不重复。

    首先最容易想到的方法是暴力遍历，用一个3重循环求取结果，再去重即可。这样复杂度为n^3。

    可以从多个角度进行优化

    第一，先把输入参数nums升序排序，这样可以在遍历的过程中判断两数之和是否大于0，如果大于0可以不用再向后遍历，这就减少了一定的计算量；

    第二，可以给nums去重，保证每个元素最多只有3个重复；

    第三，可以先把nums中每个元素存到一个hash里，key就是这个元素的值，value是这个元素最后出现的下标，遍历的时候，只需要两重遍历即可；

## 代码

```
/** 
 * @param {number[]} nums 
 * @return {number[][]} 
 */  
var threeSum = function(nums) {  
    var resultHash = {};  
    var numsHash = {};  
    var result = [];  
  
    var newNums = [];  
    var newNumsHash = {};  
  
    // nums去重  
    nums.forEach(function (item, index) {  
        if (newNumsHash[item] !== 3) {  
            newNums.push(item);  
            if (newNumsHash[item]) {  
                newNumsHash[item]++;  
            }  
            else {  
                newNumsHash[item] = 1;  
            }  
        }  
    });  
  
    // 排序  
    var list = newNums.sort(function (a, b) {  
        return a - b;  
    });  
  
    // 将nums转成hash  
    for (var i = 0; i < list.length; i++) {  
        numsHash[list[i]] = i + 1;  
    }  
  
    // 两重遍历确定两个数，第三个数在numsHash里找  
    for (var j = 0; j < list.length; j++) {  
        for (var k = j + 1; k < list.length; k++) {  
            var target = -(list[j] + list[k]);  
            // 因为数组是升序排好序的，所以如果两数之和大于0，再加上后面的肯定不为0  
            if (target < 0) {  
                break;  
            }  
              
            if (numsHash[target]  
                && (numsHash[target] - 1) !== j  
                && (numsHash[target] - 1) !== k  
            ) {  
                var arr = [list[j], list[k], target];  
                var resultHashKey = arr.sort().join('_');  
                if (!resultHash[resultHashKey]) {  
                    result.push(arr);  
                    resultHash[resultHashKey] = true;  
                }  
            }  
        }  
    }  
    return result;  
};  
```