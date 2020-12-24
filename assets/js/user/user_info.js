var form = layui.form

form.verify({
    // 验证昵称 1-6 个字符
    nickname: function (value) {
        if (value.length > 6) {
            return '用户名长度为1-6个字符!'
        }
    }
})


$(function () {
    var layer = layui.layer
    var form = layui.form
    // alert('ok')
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染用户信息
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 提交修改
    $('.layui-form').submit(function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        console.log(data)
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                layer.msg(res.message, function () {
                    console.log(res)
                    window.parent.getUserInfo()
                })

            }
        })
    })

    // 重置
    $('#btnReset').click(function (e) {
        e.preventDefault()
        initUserInfo()
    })
})