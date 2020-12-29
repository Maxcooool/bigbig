$(function () {
    var layer = layui.layer
    var form = layui.form

    // 初始化图片裁剪区
    var $image = $('#image')
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 获取文章的id
    var id = location.href.split('=')[1]

    // 初始化富文本
    initEditor()

    // 渲染下拉列表
    renderSlideDownList()
    function renderSlideDownList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染
                var options = template('tpl-edit', res)
                $('[name=cate_id]').html(options)
                form.render()

                // 渲染文章内容
                getArticle()
            }
        })
    }

    // 根据id获取文章信息
    function getArticle() {
        $.ajax({
            type: 'get',
            url: '/my/article/' + id,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)

                // 渲染富文本
                tinyMCE.activeEditor.setContent(res.data.content)

                // 渲染获取到的封面
                $('#image').prop('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img)
                // 渲染原始裁剪区
                $image.cropper(options)
            }
        })
    }

    // 点击修改封面按钮
    $('#btnChooseImage').click(function () {
        $('#coverFile').click()
    })


    // 用户上传封面图片
    $('#coverFile').change(function () {
        var fileList = $(this)[0].files
        // console.log(fileList)
        if (fileList.length <= 0) {
            return layer.msg('未上传图片')
        }
        // 获取上传的文件
        var file = fileList[0]
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 提交修改
    $('#form-edit').submit(function (e) {
        e.preventDefault()

        var fd = new FormData(this)
        fd.append('Id', id)

        // 将裁剪区的图片裁剪为二进制blob文件
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 追加裁剪的图片
                fd.append('cover_img', blob)
                fd.forEach(item => console.log(item))
                subArticle(fd)
            })
    })

    // 提交表单, 更新数据
    function subArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/edit',

            contentType: false,
            processData: false,

            data: fd,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message, function () {
                    location.href = '/article/art_list.html'
                })


            }
        })
    }
})