$(function () {

    var form = layui.form
    var layer = layui.layer
    // alert('ok')
    $('#link_reg').click(function () {
        $('.reg-box').show()
        $('.login-box').hide()
    })

    $('#link_login').click(function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    // 表单验证
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须是6-12位非空'
        ],

        repwd: function (value) {
            var password = $('#form_reg [name=password]').val()
            if (value !== password) {
                return '密码不一致'
            }
        }
    })

    // 注册
    $('#form_reg').submit(function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        // console.log(data)
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message, function () {
                    $('#link_login').click()
                })
            }
        })
    })

    // 登录
    $('#form_login').submit(function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        // console.log(data)
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message, function () {
                    localStorage.setItem('token', res.token)
                    location.href = '/index.html'   
                })
            }
        })
    })
})