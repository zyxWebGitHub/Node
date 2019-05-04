/**
 * app.js 服务入口模块
 * 1. 创建服务
 * 2. 做服务相关的配置
 *    2.1 模板引擎
 *    2.2 body-parser 解析表单 post 请求体
 *    2.3 提供相关的静态资源服务（开放public目录）
 * 3. 挂载路由
 * 4. 监听端口 开启服务
 * */

var express = require('express')
var router = require('./router.js')
var bodyParser = require('body-parser')

//创建你的服务器应用程序
var app = express()

//指定 .html 后缀的文件使用的解析引擎
app.engine('html',require('express-art-template'))

//开发静态资源
app.use('/public/',express.static('./public/'))
app.use('/node_modules/',express.static('./node_modules/'))

// 配置 body-parser 中间件（插件，专门用来解析表单 POST 请求体）
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//把路由挂载到 app 服务中
app.use(router)


//开启服务
app.listen(3000,function(){
    console.log('server is running ...')
})

