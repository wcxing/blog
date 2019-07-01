---
layout: post
title:    快速排序-javascript
date:   2017-07-11 00:00:00 +0800
categories: CS
tag: algorithm
---
## 背景

   快速排序利用分治的思想，递归地将待排序序列分隔成两部分。快速排序的平均时间复杂度是O(n log n)，这个复杂度是基于比较的排序方法的极限。快速排序的具体实现需要注意一些细节。下面介绍一下具体实现

## 说明

   我们假设是升序排序。快速排序使用了双指针的思想，其基本思想是首先选取一个分隔数，然后两个游标从两侧对向移动，左边游标向右游走，直到遇到大于分隔数的元素停止，右边游标则是向左游走，直到遇到小于等于分隔数的元素则停止，然后交换两个游标指向的元素，然后继续游走。这样操作保证了游走结束时，左边的元素都小于等于分隔数，右边的元素都大于分隔数。这样就完成了一次分隔。然后递归地把分隔点左边的序列和右边的序列进行分隔。最终可以得到升序序列。

   实际上两个游标也可以同向出发游走。游走过程中，靠左的游标记为i，靠右的游标记为j，i以左的元素小于等于分隔数，i和j之间的元素大于分隔数，就以右的元素情况未知，等待游走的游标去探索。本文仅介绍对向游走游标的快速排序方法。

   根据分隔数选择的不同，快速排序可以分为选择最左的元素作为分隔数和随机选择分隔数两种。随机可以增加算法的适应性。如果用最左的元素作为分隔数，则快排对正序和倒序序列排序性能较差。

## 代码

   选择最左元素为分隔数的快排：

   快排过程为：首先选择最左元素作为分隔数，然后让游标对向游走，对序列进行分隔，游标碰撞之后，把最左元素和碰撞点元素交换，使得整个序列被分隔为以分隔数为分界点的两个序列，然后递归地分隔这两个序列。

```
/** 
 * 快排1 
 */  
function partition(arr, left, right) {  
    var temp;  
    var i = left, j = right;  
    var pivot = arr[left];  
    var result;  
    while (i < j) {  
        // i <= j而不是i < j这样才可以保证i-1位置上的元素满足arr[i] <= pivot  
        // 且是从左至右最后一个满足这个条件的元素  
        while (arr[i] <= pivot && i <= j) {  
            i++;  
        }  
        while (arr[j] > pivot && j >= i) {  
            j--;  
        }  
        if (i < j) {  
            temp = arr[i];  
            arr[i] = arr[j];  
            arr[j] = temp;  
        }  
    }  
  
    result = i - 1;  
  
    // 将分隔数移到分隔点  
    if (result !== left) {  
        temp = arr[left];  
        arr[left] = arr[result];  
        arr[result] = temp;  
    }  
    return result;  
}  
  
function quickSort(arr, left, right) {  
    if (left >= right) {  
        return;  
    }  
    var flag = partition(arr, left, right);  
    quickSort(arr, left, flag - 1);  
    quickSort(arr, flag + 1, right);  
}  
```

   随机选择分隔数的快排：
   快排过程为：和选择最左元素为分隔数类似，只是需要记录分隔元素的index，以便最后作交换。

```
/** 
 * 快排 
 */  
function getPivotIndex(left, right) {  
    return Math.round(Math.random() * (right - left)) + left;  
}  
  
function partition(arr, left, right) {  
    var temp;  
    var i = left, j = right;  
    var pivotIndex = getPivotIndex(left, right);  
    var pivot = arr[pivotIndex];  
    var result;  
    while (i < j) {  
        // i <= j而不是i < j这样才可以保证i-1位置上的元素满足arr[i] <= pivot  
        while (arr[i] <= pivot && i <= j) {  
            i++;  
        }  
        while (arr[j] > pivot && j >= i) {  
            j--;  
        }  
        if (i < j) {  
            temp = arr[i];  
            arr[i] = arr[j];  
            arr[j] = temp;  
            if (i === pivotIndex) {  
                pivotIndex = j;  
            }  
            if (j === pivotIndex) {  
                pivotIndex = i;  
            }  
        }  
    }  
  
    result = i - 1;  
  
    if (result !== pivotIndex) {  
        temp = arr[result];  
        arr[result] = arr[pivotIndex];  
        arr[pivotIndex] = temp;  
    }  
  
    return result;  
}  
  
function quickSort(arr, left, right) {  
    if (left >= right) {  
        return;  
    }  
    var flag = partition(arr, left, right);  
    quickSort(arr, left, flag - 1);  
    quickSort(arr, flag + 1, right);  
}  
```
