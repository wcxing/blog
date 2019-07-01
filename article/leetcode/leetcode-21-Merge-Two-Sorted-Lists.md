## 说明

    合并两个列表，这里list使用的是链表结构

## 代码

```
// Definition for singly-linked list.  
function ListNode(val) {  
    this.val = val;  
    this.next = null;  
}  
  
/** 
 * @param {ListNode} l1 
 * @param {ListNode} l2 
 * @return {ListNode} 
 */  
var mergeTwoLists = function(l1, l2) {  
    var i = l1;  
    var j = l2;  
    var h1 = h2 = new ListNode();  
    while (i && j) {  
        if (i.val < j.val) {  
            h2.next = i;  
            h2 = h2.next;  
            i = i.next;  
        }  
        else {  
            h2.next = j;  
            h2 = h2.next;  
            j = j.next;  
        }  
    }  
    if (i) {  
        while (i) {  
            h2.next = i;  
            h2 = h2.next;  
            i = i.next;  
        }  
    }  
    if (j) {  
        while (j) {  
            h2.next = j;  
            h2 = h2.next;  
            j = j.next;  
        }  
    }  
    return h1.next;  
};  

```