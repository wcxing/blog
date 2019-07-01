## 说明

    题目要求删除链表倒数第n个节点。

    这是个典型的双指针问题，先让前指针走n步，然后两个指针一起走，直到前指针走到链表末尾，最后删掉后指针指向的节点即可。

    值得注意的是，这里的头指针不是一个指向第一个节点的节点，它就是第一个节点。

## 代码

```
/** 
 * Definition for singly-linked list. 
 * function ListNode(val) { 
 *     this.val = val; 
 *     this.next = null; 
 * } 
 */  
/** 
 * @param {ListNode} head 
 * @param {number} n 
 * @return {ListNode} 
 */  
var removeNthFromEnd = function(head, n) {  
    var h = new ListNode(0);  
    h.next = head;  
    var i = h, j = h;  
    for (var k = 0; k < n; k++) {  
        j = j.next;  
    }  
    while (j.next) {  
        i = i.next;  
        j = j.next;  
    }  
    i.next = i.next.next;  
    return h.next;  
};  
```