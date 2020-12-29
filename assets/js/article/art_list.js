$(function () {
    // alert('ok')
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 渲染分类下拉列表
    getSlidedownOptions()
    function getSlidedownOptions() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return
                }
                var options = template('tpl-option', res)
                $('[name=cate_id]').html(options)
                form.render()
            }
        })
    }


    // 筛选按钮
    $('#form-search').submit(function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        getArticle()
    })

    var q = {
        pagenum: 1, // 页码
        pagesize: 3,
        cate_id: '',
        state: '',
    }

    // 获取文章
    getArticle()
    function getArticle() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return
                }
                // 分页器配置
                var options = {
                    elem: 'pageBox',  // 容器
                    count: res.total, // 总数目
                    prev: '←',  //自定义按钮文字
                    next: '→',
                    curr: q.pagenum,  //当前页码
                    limit: q.pagesize,  //每页显示条数
                    limits: [2, 3, 4, 5, 6], // 条数选择
                    layout: ['limit', 'prev', 'page', 'next', 'count'],  // 自定义布局
                    jump: function (obj, first) {   // 跳转函数
                        if (!first) {
                            q.pagenum = obj.curr
                            q.pagesize = obj.limit
                            getArticle()
                        }
                    }
                }
                laypage.render(options);

                var htmlStr = template('tpl-list', res)
                // console.log(htmlStr)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 模板过滤器,格式化日期格式
    template.defaults.imports.dateFormat = function (time) {
        var date = new Date(time)

        var y = date.getFullYear()
        m = date.getMonth() + 1
        d = date.getDate()
        hh = date.getHours()
        mm = date.getMinutes()
        ss = date.getSeconds()

        // 补零
        m = m < 10 ? '0' + m : m
        d = d < 10 ? '0' + d : d
        hh = hh < 10 ? '0' + hh : hh
        mm = mm < 10 ? '0' + mm : mm
        ss = ss < 10 ? '0' + ss : ss

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }


    // 删除文章
    $('tbody').on('click', '.btn-del', function () {
        var delCount = $('.btn-del').length
        // 获取id
        var id = $(this).data('id')
        // console.log(id)
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res)
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    if (delCount === 1 && q.pagenum > 1) {
                        q.pagenum--
                    }
                    getArticle()
                }
            })
            layer.close(index);
        });
    })
})