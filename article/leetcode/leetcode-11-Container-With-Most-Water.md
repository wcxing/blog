## 说明：

    题目是：给定n个非负整数 a1, a2..., ai..., an，表示在点(i, ai)处的点。现在根据这个整数序列画出n条线段，每个线段的两个端点分别为(i, 0)和(i, ai)。要求是从这n条线段中找出两条，使得这两条直线与x轴围成的容器所能容纳的水最多。

    题目说是找出两条线段围成的容器中容纳水最多的那个，其实就是找出两条线段，使得（这两条线段之间的水平距离） * （两条线段中较短的那条） 值最大。

    很容易想到的思路就是暴力穷举法，遍历每个点，计算 这个点对应的线段和其他所有线段围成的容器容量 中最大的值，记为maxi，求出最大的maxi，就是题目要求的结果。代码如下：

## 暴力穷举代码：

```
/** 
 * @param {number[]} height 
 * @return {number} 
 */  
var maxArea = function (height) {  
    // 计算两点围成的容器的容量  
    var getArea = function (i, j) {  
        var h = height[i] < height[j] ? height[i] : height[j];  
        return h * (j - i);  
    };  
    var max = 0;  
    // 遍历求解  
    for (var i = 0; i < height.length; i++) {  
        for (var j = i + 1; j < height.length; j ++) {  
            var area = getArea(i, j, height[i], height[j])  
            if (area > max) {  
                max = area;  
            }  
        }  
    }  
    return max;  
};
```

    很明显这个的复杂度是n^2。这个代码不能通过leetcode测试时间性能的测试用例。那么我们需要优化一下。如果我们希望能使一个算法的时间性能提升上去，即减少执行时间，可以从两个方面入手，第一是使用问题中的一些规则，减少算法的操作；第二是我们在算法过程中记录一些信息，在后续的执行过程中直接使用信息而不用再次计算。第二种思路的典型代表就是动态规划的思想。
    我们这里使用第一种思路，规则就是：如果在点j处的线段是从点到点j之间的线段中最长的，那么，点i到点j之间的所有可能的容器中容量最大的就是点i处的线段和点j处的线段所围成的容器（原因是既然j处的线段是从i到j之间最长的，那么i到j之间的线段和i围成的容器的长和宽都不可能比j更大，因此j处的线段和i所围成容器一定是容量最大的）。根据这个规则，我们要记录两个信息：一个是正序 从下标为0到下标为i之间的线段中最长线段的下标，另一个是逆序 从下标为height.length -1 到下标为i之间的线段中最长的线段的下标。用这两个信息，当遍历到i时，如果i处的线段不是从0到i之间最大的，就可以不作任何操作（因为根据上面的规则，这时 i和其后任何线段围成的容器 都不会比 i之前那个比它长的线段和任何线段围成的容器的容量更大）；而从i到其后最大的线段之间的容器容量也不必计算（因为它们和i围成的容器容量不会比i后最大的线段更大）。代码如下：

```
var maxArea = function (height) {  
    // 计算两点围成的容器的容量  
    var getArea = function (i, j) {  
        var h = height[i] < height[j] ? height[i] : height[j];  
        return h * (j - i);  
    };  
    var max;  
    var temp;  
    // 记录从0到i的最大height的下标  
    var preMax = [ ];  
    // 记录从heiht.length-1到i的最大height的下标  
    var postMax = [ ];  
    var i, j;  
    // temp在这里保存从0到i的最大height  
    temp = 0;  
    for (i = 0; i < height.length; i++) {  
        if (height[i] > temp) {  
            temp = height[i];  
            preMax.push(i);  
        }  
        else {  
            preMax.push(preMax[i - 1]);  
        }  
    }  
    // temp在这里保存从heiht.length-1的最大height  
    temp = 0;  
    for (i = height.length - 1; i >= 0; i--) {  
        if (height[i] > temp) {  
            temp = height[i];  
            postMax.unshift(i);  
        }  
        else {  
            postMax.unshift(postMax[0]);  
        }  
    }  
    max = 0;  
    // 遍历height数组，求容量最大值  
    for (i = 0; i < height.length; i++) {  
        if (preMax[i] === i) {  
            var area = getArea(i, postMax[i]);  
            if (max < area) {  
                max = area;  
            }  
            for (j = postMax[i] + 1; j < height.length; j++) {  
                area = getArea(i, j);  
                if (max < area) {  
                    max = area;  
                }  
            }  
        }  
    }  
    return max;  
};  
```
这样就可以accept了。