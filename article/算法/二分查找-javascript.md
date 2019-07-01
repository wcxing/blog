
## 二分查找

   二分查找针对有序序列，升序或降序。相比线性查找，二分查找使用分治思想，利用了序列有序的信息，减少了搜索的复杂度。

## 代码

```
/** 
 * 二分查找 
 * 假设数组是升序排序 
 */  
function search(arr, item, left, right) {  
  
    if (left > right) {  
        return -1;  
    }  
    var mid = Math.floor((left + right) / 2);  
    if (arr[mid] === item) {  
        return mid;  
    }  
    else {  
        if (arr[mid] > item) {  
            return search(arr, item, left, mid - 1);  
        }  
        else {  
            return search(arr, item, mid + 1, right);  
        }  
    }  
}  
  
function bSearch(arr, item) {  
    return search(arr, item, 0, arr.length - 1);  
}  
```