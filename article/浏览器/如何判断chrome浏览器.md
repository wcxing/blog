
## 背景

   有好多浏览器使用了chrome内核，比如opera和很多国产浏览器。因此它们的userAgent中就会出现 ‘chrome’ 的字样。这样根据userAgent判断时就要先判断是否有其他浏览器标志。

## 说明

判断是否是chrome浏览器采用黑名单的方式。即判断ua是否有chrome标识，然后剔除使用chrome内核的非chrome浏览器。那么如何判断一个使用chrome内核的浏览器是不是chrome呢？

   大部分浏览器的ua里都有自己的标志，如：

‘opera’或 ‘OPR’  // opera

'ubrowser', // UC

'taobrowser', // 淘宝

'lbbrowser', // 猎豹

'qqbrowser', // QQ

'maxthon', // 遨游

'bidubrowser' // 百度

   ua中有上述标识的，可以列入黑名单

   但是有两个浏览器（目前发现），最新版本中的ua里，没有加自己的标识，就是360和搜狗。这两个浏览器需要通过navigator.mimeTypes来判断。360的navigator.mimeTypes[0].type为 ‘application/vnd.chromium.remoting-viewer’，搜狗的navigator.mimeTypes[1].type为 ‘application/sogou-native-widget-plugin’。这两个标识都是chrome没有的，因此可以通过这个标识将这两个浏览器与chrome区分。由于不知道是这两个标识一定存在于navigator.mimeTypes的固定位置，因此最好遍历navigator.mimeTypes，如果存在这两个标识，就判定为非chrome。

3.代码

```
<!DOCTYPE html>  
<html>  
<head>  
    <title>test</title>  
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>  
</head>  
<body>  
</body>  
<script type="text/javascript">  
        var markList = [  
        'ubrowser', // UC  
        'taobrowser', // 淘宝  
        'lbbrowser', // 猎豹  
        'qqbrowser', // QQ  
        'maxthon', // 遨游  
        'bidubrowser' // 百度  
    ];  
  
    var mimeTypeList = [  
        'application/vnd.chromium.remoting-viewer', // 360  
        'application/sogou-native-widget-plugin' // 搜狗  
    ]  
  
    function isChrome() {  
        var ua = navigator.userAgent.toLowerCase();  
        var mimeTypes = navigator.mimeTypes;  
        return (ua.indexOf('chrome') !== -1)  
            && !hasOtherMark(ua)  
            && !isInMimeList(mimeTypes);  
    }  
  
    function hasOtherMark(ua) {  
        var flag = false;  
        $.each(  
            markList,  
            function (index, item) {  
                if (ua.indexOf(item) !== -1) {  
                    flag = true;  
                    return false;  
                }  
            }  
        );  
        return flag;  
    }  
  
    function isInMimeList(mimeTypes) {  
        var flag = false;  
        while (mimeTypeList.length) {  
            if (flag) {  
                return flag;  
            }  
            var mimeType = mimeTypeList.pop();  
            $.each(  
                mimeTypes,  
                function (index, item) {  
                    if (item.type.toLowerCase() === mimeType) {  
                        flag = true;  
                        return false;  
                    }  
                }  
            );  
        }  
        return flag;  
    }  
    alert('browser is chrome: ' + isChrome())  
</script>  
</html>  
```