$(function () {
    // alert('okkk')
    var form = layui.form 
    var layer  = layui.layer

    form.verify({
        pwd:[
            /^[\S]{6,12}$/,
            '密码必须为6-12位非空字符'
        ],
        samePwd: function (value) {
            var oldpwd = $('[name=oldPwd]').val().trim()
            if (value === oldpwd) {
                return '新旧密码不能一致'
            }

        },
        rePwd: function (value) {
            var newnew = $('[name=newPwd]').val().trim()
            if (value !== newnew) {
                return '两次密码不一致'
            }
        }

    })
})