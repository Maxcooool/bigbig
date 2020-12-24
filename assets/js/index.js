$(function () {
    // 渲染用户信息

    var layer = layui.layer
    getUserInfo()
    function getUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            // headers: {
            //     Authorization: localStorage.getItem('token')
            // },
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                
                renderAvatar(res.data)
            }
        })
    }

    function renderAvatar(info) {
        console.log(info)

        var name = info.nickname || info.username
        $('#welcome').html('欢迎你! ' + name)

        if (info.user_pic) {
            $('.layui-nav-img').prop('src', info.user_pic).show()
            $('.text-avatar').hide()
        } else {
            $('.layui-nav-img').hide()
            var first = name.slice(0, 1).toUpperCase()
            $('.text-avatar').html(first).show()
        }
    }


    // 退出功能
    $('#logout').click(function () {
            layer.confirm('您确定要退出吗?', { icon: 3, title: '提示' }, function () {
                localStorage.removeItem('token')
                location.href = '/login.html'
            });
    })


})