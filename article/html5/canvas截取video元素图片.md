## 背景

使用canvas的drawImage api可以截取video等元素的图片并生成base64的图片url，利用这个api，我们可以实现video的动态截图功能

## 说明

使用canvas的drawImage截取media元素图片的实现可以参考W3school的示例。我们这里主要考虑的是当videoElement宽高比和canvasElement的宽高比不一致时，如何截取图片。

对于截取图片，我们给出两种方式去处理，一种是平铺。另一种是剪裁。

另外，如果我们还可以对截取的图片进行压缩，这可以通过使用较小的canvas截取，再将图片尺寸放大来实现。

下面实现一个方法```createSnap```，用来根据videoElement返回一个显示截取的图片的img元素。

```

// videoELement 被截取的视频元素
// width 返回的图片宽度
// height 返回的图片高度
// options 截取图片的配置项
// options.mode 截图模式 'fit'/'crop' 平铺/剪裁
// options.quality 截图质量 0~1
function createSnapImage(videoElement, width, height, options)

```

## 代码

```

<!DOCTYPE html>
<html>
<head>
  <title>test copy video</title>
  <script type="text/javascript" src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <meta charset="utf-8">
</head>
<body>
<video id="v" src="./bunny.mp4"></video>
<div id="c"></div>
<div id="i"></div>
<div style="position:absolute;top:10px;left:10px;color:#000;background:#EEE" onclick="play()">播放</div>
<div style="position:absolute;top:50px;left:10px;color:#000;background:#EEE" onclick="cut()">截屏</div>
<script type="text/javascript">
    function play() {
        document.querySelector('#v').play();
    }
    function cut() {
        document.querySelector('#c').appendChild(createSnapImage(document.querySelector('#v'), 100, 150, { mode: 'crop', quality: 0.2 }));
    }
    function createSnapImage(videoElement, width, height, options) {

        var imgQuality = (options && options.quality) || 1;

        var videoWidth = videoElement.offsetWidth;
        var videoHeight = videoElement.offsetHeight;
        var canvasWidth = width * imgQuality;
        var canvasHeight = height * imgQuality;

        if (!videoWidth || !videoHeight) {
            throw new Error('视频元素宽高不能为0');
        }
        if (!canvasWidth || !canvasHeight) {
            throw new Error('canvans宽高不能为0');
        }

        var cutMode = (options && options.mode) || 'fit';

        var canvasElement = document.createElement('canvas');
        var cxt = canvasElement.getContext('2d');
        canvasElement.setAttribute('width', canvasWidth);
        canvasElement.setAttribute('height', canvasHeight);

        switch (cutMode) {
            case 'fit':
                cxt.drawImage(videoElement, 0, 0, videoWidth, videoHeight, 0, 0, canvasWidth, canvasHeight);
                break;
            case 'crop':
                if ((videoWidth / videoHeight) > (canvasWidth / canvasHeight)) {
                    cxt.drawImage(videoElement, 0, 0, videoHeight * canvasWidth / canvasHeight, videoHeight, 0, 0, canvasWidth, canvasHeight);
                }
                else {
                    cxt.drawImage(videoElement, 0, 0, videoWidth, videoWidth * canvasHeight / canvasWidth, 0, 0, canvasWidth, canvasHeight);
                }
                break;
            default:
        }

        var imgElement = document.createElement("img");
        imgElement.style = 'width:' + width + 'px;' + 'height:' + height + 'px;';
        imgElement.src = canvasElement.toDataURL("image/png");

        return imgElement;
    }
</script>
</body>
</html>

```