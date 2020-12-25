$(function () {
    var layer = layui.layer

    var form = layui.form
    // alert('ok')

    // 渲染列表
    getCateList()
    function getCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('tbody').html(htmlStr)
            }
        })
    }


    // 点击添加类别 弹出模态框
    var addindex = null
    $('#btnAddCate').click(function () {
        // 弹出模态框
        addindex = layer.open({
            title: '添加类别',
            area: ['500px', '300px'],
            content: $('#dialog-add').html(),
        });

        $('#form-add').submit(function (e) {
            e.preventDefault()
            var data = $(this).serialize()
            // console.log(data)
            $.ajax({
                type: 'POST',
                url: '/my/article/addcates',
                data: data,
                success: function (res) {
                    // console.log(res)
                    if (res.status !== 0) {
                        return
                    }
                    layer.msg('添加成功!')
                    layer.close(addindex)
                    getCateList()
                }
            })
        })

    })

    
    // 点击编辑按钮,弹出模态框
    var editindex = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出模态框
        editindex = layer.open({
            title: '编辑类别',
            area: ['500px', '300px'],
            content: $('#dialog-edit').html(),
        });

        var id = $(this).parent().parent().data('id')
        // console.log(id)
        // 根据id获取文章分类信息并渲染到模态框
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return
                }
                form.val('form-edit', res.data)
            }
        })
    })

    // 编辑
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        // console.log(data)
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: data,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return 
                }
                layer.msg('修改成功!')
                layer.close(editindex)
                getCateList()
            }
        })
    })


    // 删除功能
    $('tbody').on('click','.btn-delete',function () {
        var id = $(this).parent().parent().data('id')
        // console.log(id)
        // 弹出询问框
        layer.confirm('确定要删除吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                type:'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res)
                    if (res.status !== 0) {
                        return 
                    }
                    layer.msg('删除成功!')
                    getCateList()
                }
            })
            layer.close(index);
          });
    })
})