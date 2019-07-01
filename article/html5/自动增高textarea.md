## 背景

输入框是个很web应用中常见的交互元素，很多时候我们会有这种需求，需要固定输入框的宽度，高度随着输入内容的增多而自动增加，到达指定的最大高度后不再增加。

## 说明

自动增高的输入框需要用textarea元素来实现。想要实现textarea的自动增高，有两个关键点
1. 如何增加输入框高度
2. 如何知道输入给定内容后输入框的高度是多少

对于第一个问题，如何实现高度的改变呢？答案是js设置其style.height属性，因为目前我还不了解如何通过css去实现高度自适应。

对于第二个问题，我们希望输入框高度被其中的内容自动撑开，被撑开的高度其实就是textarea的scrollHeight属性值对应的高度。

解决了以上问题，我们就有了思路：监听textarea的onchange或者oninput事件，内容改变后，我们就将textarea的height设置为其scrollHeight。这样，随着内容的增多，textarea会跟随内容自动增高。但是这样做会遇到一个问题：当你删除一些内容，导致内容行数减少，textarea的高度没法自动减少。因此我们需要再设置另外一个辅助的textarea，辅助textarea其实是不可见的，它用于确定给定内容对应的高度。对应辅助textarea，我们称输入内容的textarea为主textarea。

我们的最终方案是：当主textarea的内容变化时，取textarea.value赋值给辅助textarea，然后获取辅助textarea的scrollHeight再赋值给主textarea的height。

## 代码

```
<html>
<head>
    <title>自动增高textarea demo</title>
    <style type="text/css">
        html {
            font-size: 80px;
        }
        #primary {
            font-size: 30px;
            width: 100px;
            height: 60px;
            max-height: 300px;
            border: 1px solid red;
        }
        #assistant {
            font-size: 30px;
            position: absolute;
            top: -999px;
            left: -999px;
            width: 100px;
            border: 1px solid #000;
        }
    </style>
</head>
<body>
    <textarea id="primary" oninput="onprimaryinput()"></textarea>
    <textarea id="assistant" disabled="disabled"></textarea>
    <p>
        实现方式：两个textarea元素，一个负责输入，一个负责计算高度
        步骤：
        1. 取主textarea value 赋值给辅助textarea
        2. 取辅助textarea的scrollHeight，赋值给主textarea的style.height
        注意：scrollHeight比height要高 3 个像素，因此需要减去 3 px
    </p>    
</body>
<script type="text/javascript">
    function onprimaryinput() {
        var value = document.getElementById('primary').value;
        document.getElementById('assistant').value = value;
        document.getElementById('primary').style.height = document.getElementById('assistant').scrollHeight - 3 + 'px';
    }
</script>
</html>
```