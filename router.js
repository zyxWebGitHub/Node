/**
 *
 * router.js 路由模块
 * 根据不同的请求方法 + 请求路径 设置具体的请求处理函数
 *
 * */

var express = require('express')
var User = require('./user.js')

//1. 创建一个路由
var router = express.Router()

//2. 把路由都挂载到 router 路由容器中

// =============渲染用户列表页面=============
router.get('/users',function(req,res){
    User.find(function(err,users){
        if(err){
            return res.status(500).send('Server err')
        }
        res.render('index.html',{users:users})
    })
})

// =============渲染添加用户信息页面===========
router.get('/add',function(req,res){
    res.render('add.html')
})

// ==============处理添加用户==================
router.post('/add',function(req,res){
    //1. 获取表单数据 req.body
    //2. 处理：将数据保存到 db.json 文件中用以持久化
        new User(req.body).save(function(err){
        if(err){
            return res.status(500).send('server err')
        }
        //3. 重定向到首页
        res.redirect('/users')
    })
})

// =================渲染编辑用户信息页面============
router.get('/edit',function(req,res){
    //1. 在客户端的列表中处理链接问题（需要有 id 参数）
    //获取要编辑的学生 通过id
    User.findById(req.query.id.replace(/"/g,''),function(err,user){
        if(err){
            return res.status(500).send('Server error')
        }
        res.render('edit.html',{
            user:user
        })
    })
})

// ==================处理编辑用户信息================
router.post('/edit',function(req,res){
    //1. 获取表单数据 req.body
    //2. 通过 id 更新 User.findByIdAndUpdate()
    //3. 重定向到首页
    User.findByIdAndUpdate(req.body.id.replace(/"/g,''),req.body,function(err){
        if(err){
            return res.status(500).send('server error')
        }
        res.redirect('/users')
    })
})

// ==================删除用户====================
router.get('/delete',function(req,res){
    // 通过 id 查找到对应用户进行删除 User.findByIdAndDelete()
    User.findByIdAndRemove(req.query.id.replace(/"/g,''),function(err){
        if(err){
            return res.status(500).send('server error')
        }

    })
    res.redirect('/users')

})

// 把路由导出
module.exports = router