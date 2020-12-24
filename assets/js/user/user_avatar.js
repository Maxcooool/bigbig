$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // alert('ok')
    $('#btnChooseImage').click(function () {
        $('#file').click()
        // 点击上传按钮
        $('#file').change(function () {
            var fileList = $('#file')[0].files
            // 判断是否选择了图片
            if (fileList.length <= 0) {
                return layer.msg('未选择图片')
            }
            // 获取文件
            var file = fileList[0]
            console.log(file)

            // 渲染文件
            var newImgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        })
    })


    // 点击确认
    $('#btnUpload').click(function () {
        var fileList = $('#file')[0].files
        if (fileList.length <= 0) {
            return
        }
        // 获取文件
        var file = fileList[0]

        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 发送请求
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message, function () {
                    window.parent.getUserInfo()
                })
            }
        })
    })
})