## 背景

有时候我们会有这样的需求：将base64格式的图片文件使用ajax上传，比如，我们使用canvas截图之后，图片的格式就是base64的。这是需要对base64格式的图片做一些处理。

## 说明

图片处理的步骤是：

1. 将base64字符串进行解密，（使用window.atob）
2. 用解密后的字符串作为参数，生成一个 Uint8Array的二进制数组
3. 用这个二进制数组作为参数，生成一个blob对象

这个blob对象就可以上传了

上传时，使用formData对象，```append('key', blob)``` 即可

## 代码

```

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
  <title>上传图片</title>
</head>
<body>
<div onclick="upload()">上传图片</div>
<script type="text/javascript">
    var IMGSTR = '';
    var ACTION = '';
    function upload() {
        uploadBase64Img(IMGSTR, ACTION);
    }

    function uploadBase64Img(base64Img, action) {

        var bytes = window.atob(IMGSTR.split(',')[1]);

        var array = [];
        for(var i = 0; i < bytes.length; i++) {
            array.push(bytes.charCodeAt(i));
        }
        var file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});

        var formData = new FormData();

        formData.append('Filedata', file);

        var xhr = new XMLHttpRequest();
        xhr.onload = function(res) {
            console.log(JSON.parse(xhr.responseText));
        }
        xhr.open("POST", ACTION, true);
        xhr.send(formData);
    }
</script>
</body>
</html>

```