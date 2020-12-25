$(function () {
    var layer = layui.layer
    var form = layui.form
    // alert('okkk')
    // 初始化富文本编辑器
    initEditor()

    // 获取分类
    getCate()
    function getCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return
                }
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('select').html(htmlStr)
                // 重新渲染form对象
                form.render()
            }
        })
    }

    // 初始化裁剪区
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击选择封面
    $('#btnChooseImage').click(function () {
        $('#coverFile').click()

        // 监听change事件
        $('#coverFile').change(function () {
            var fileList = $(this)[0].files
            // console.log(fileList)
            if (fileList.length <= 0) {
                return layer.msg('请选择文件!')
            }
            // 获取文件渲染到裁剪区
            // 根据文件，创建对应的 URL 地址
            var newImgURL = URL.createObjectURL(fileList[0])
            // 为裁剪区域重新设置图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
    })

    var state = '已发布'
    $('#btnSave2').click(function () {
        state = '草稿'
    })

    // 发布(FormData 格式)
    $('#form-pub').submit(function (e) {
        e.preventDefault()

        var fd = new FormData($('#form-pub')[0])
        fd.append('state', state)


        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                $.ajax({
                    type: 'POST',
                    url: '/my/article/add',
                    data: fd,

                    contentType: false,
                    processData: false,

                    success: function (res) {
                        // console.log(res)
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        layer.msg(res.message, function () {
                            // 高亮
                            $(window.parent.document.querySelector('#clickme')).addClass('layui-this').siblings().removeClass('layui-this')
                            // 跳转到列表页
                            location.href = '/article/art_list.html'
                        })
                    }
                })
            })

    })

})
