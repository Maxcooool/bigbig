$(function () {
    // alert('ok')
    $.ajaxPrefilter(function (option) {
        // console.log(option)
        option.url = 'http://ajax.frontend.itheima.net' + option.url

        if (option.url.indexOf('/my/') !== -1) {
            option.headers = {
                Authorization: localStorage.getItem('token')
            }
        }

        option.complete = function (res) {
            // console.log(res.responseJSON)
            if (res.responseJSON.status !== 0 && res.responseJSON.message === '身份认证失败！') {
                console.log('ok')
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        }
    })
})