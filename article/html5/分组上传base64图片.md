---
layout: post
title: 分组上传base64图片
date:   2018-08-28 00:00:00 +0800
categories: CS
tag: js
---
## 背景

分组上传base64图片是基于“视频打点”的需求：对于某个视频，可以截取在某个时间点的视频图像，并且将所有选取的点对应的图像上传到服务器。

## 说明

对于“视频打点”这个需求，涉及到的技术点有

1. 截取视频图片，这个使用canvas的drawImage api实现
2. 将截取出来的base64格式的图片上传到服务器，这个使用二进制api atob、UintArray 和Blob来实现
3. 分组上传，为避免一次发出过多的请求，前端需要将图片序列分组，上一组上传完成再上传下一组。

前两个技术点在之前的文章中有谈到，这次主要说明一下第3点的实现。

基本思路是：给定一个待上传图片序列，每次选取固定数目的图片上传，等到该组内的所有图片上传结果返回（成功或失败），将本次上传的图片中失败的图片再添加到待上传图片序列末尾，然后进行下一轮上传操作，直到待上传图片序列为空。

当然还要考虑重试次数不能太多。

## 代码

```

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>上传图片</title>
</head>
<body>
<div onclick="clickButton()">上传图片</div>
<script type="text/javascript">
    var IMGSTR1 = '';
    var IMGSTR2 = '';
    var IMGSTR3 = '';
    var IMGSTR4 = '';
    var IMGSTR5 = '';
    var IMGSTR6 = '';
    var IMGSTR7 = '';
    var IMGSTR8 = '';
    var IMGSTR9 = '';
    var IMGSTR10 = '';
    var IMGSTR11 = '';
    var IMGSTR12 = '';
    var IMGLIST = [IMGSTR1, IMGSTR2, IMGSTR3, IMGSTR4, IMGSTR5, IMGSTR6, IMGSTR7, IMGSTR8, IMGSTR9, IMGSTR10, IMGSTR11, IMGSTR12];
    var ACTION = '';
    
    function clickButton() {
        console.log('clickButton')
        submit(IMGLIST, ACTION);
    }

    function uploadBase64Img(base64Img, action, data) {
        return new Promise(function (resolve, reject) {
            var bytes = window.atob(base64Img.split(',')[1]);

            var array = [];
            for(var i = 0; i < bytes.length; i++) {
                array.push(bytes.charCodeAt(i));
            }
            var file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});

            var formData = new FormData();

            for (var key in data) {
                formData.append(key, data[key]);
            }
            formData.append('Filedata', file);

            request(action, formData)
            .then(
                function (res) {
                    resolve(res);
                },
                function (e) {
                    reject(e);
                }
            );
        });
    }

    function isSupport() {
        return window.XMLHttpRequest && window.atob;
    }

    function request(action, formData, timeoutLength) {
        return new Promise(function (resolve, reject) {
            var timeout = false;
            var timer = null;
            function clearTimer() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            }

            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (!timeout) {
                    resolve(JSON.parse(xhr.responseText));
                    clearTimer();
                }
            };
            xhr.onerror = function (e) {
                if (!timeout) {
                    reject(e);
                    clearTimer();
                }
            };
            xhr.open('POST', action, true);
            xhr.send(formData);

            timer = setTimeout(function () {
                reject({timeout: true});
                timeout = true;
            }, timeoutLength || 10000);
        });
    }

    /*
     * 上传图片
     * @method all
     * @params {Array} imgs 上传的图片数组
     * @element {object} img = imgs[ ]
     * @property {Number} img.index 序号
     * @property {String} img.base64 base64编码
     * @return {Array} 处理完的图片列表
     */
    function all(imgs, url, data) {
        console.log('all')
        return new Promise(function (resolve, reject) {
            var length = imgs.length;
            var list = [ ];

            function onComplete() {
                if (list.length == imgs.length) {
                    resolve(list);
                }
            }
            function onSuccess(url, index) {
                list.push({index: index, url: url});
            }
            function onFail(base64, index) {
                list.push({index: index, base64: base64});
            }

            imgs.forEach(function (item, index) {
                uploadBase64Img(item.base64, url, data)
                .then(
                    function (res) {
                        if (res.code == 0) {
                            onSuccess(res.data.url, index);
                        }
                        else {
                            onFail(index, item.base64);
                        }
                        onComplete();
                    },
                    function () {
                        onFail(index, item.base64);
                        onComplete();
                    }
                );
            });
        });
    }

    function submit(imgs, url, data, chunkLength) {
        return new Promise(function (resolve, reject) {
            // 复制一份图片列表
            var imgList = imgs.map(function (img, index) {
                return {base64: img, index: index};
            });
            var length = chunkLength || 5;
            var successList = [ ];

            var maxRequestLoopCount = Math.ceil(imgList.length / length) * 2;
            var requestLoopCount = 0;

            function upload() {
                if (!imgList.length) {
                    resolve(successList);
                }
                else if (requestLoopCount > maxRequestLoopCount) {
                    reject();
                }
                else {
                    requestLoopCount++;
                    var chunk = imgList.splice(0, length);
                    all(chunk, url, data)
                    .then(function (list) {
                        list.forEach(function (item, index) {
                            // 上传成功则放入成功列表，否则重新加入待处理列表
                            if (item.url) {
                                successList.push({index: item.index, url: item.url});
                            }
                            else {
                                imgList.push({index: index, base64: item.base64});
                            }
                        });
                        upload();
                    });
                }
            }
            upload();
        });
    }
</script>
</body>
</html>

```