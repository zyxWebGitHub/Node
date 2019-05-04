# Node
Node.js+express+mongoose to realize user's adding, deleting, checking and modifying cases## node.js+express+mongodb对用户进行增删查改

### 一、用到的相关技术

1. 使用 Node.js 的 express 框架搭建web服务
2. 使用 express 中间件 body-parse 解析表单 post 请求体
3. 使用 art-template 模板引擎渲染页面
4. 使用第三方包 mongoose 来操作 MongoDB 数据库



### 二、在命令行用 npm 执行相关的命令

1. 初始化项目，在命令行执行 npm init 然后一路回车就行了（或者直接 npm init -y）生成 package.json 文件，它相当于是你项目的说明书

```shell
npm init
```

1. 安装需要用到的各种包

```she
# Express 框架
npm install express

# 模板引擎(express-art-template 是模板引擎与 express 的关联包)
npm install art-template express-art-template

# express 中间件 body-parser
npm install body-parser

# mongoose
npm install mongoose
```



### 三、项目结构说明



### 四、路由设计

| 请求方法 | 请求路径 | get 参数 | post 参数                           | 备注             |
| -------- | -------- | -------- | ----------------------------------- | ---------------- |
| GET      | /user    |          |                                     | 渲染首页         |
| GET      | /add     |          |                                     | 渲染添加用户页面 |
| POST     | /add     |          | name、age、gender、job、hobbies     | 处理添加用户请求 |
| GET      | /edit    | id       |                                     | 渲染编辑页面     |
| POST     | /edit    |          | id、name、age、gender、job、hobbies | 处理编辑请求     |
| GET      | /delete  | id       |                                     | 处理删除请求     |

### 五、编写代码

1. 入口模块： app.js

   ```javascript
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
   
   
   ```

   

2. 路由模块： router.js

   ```javascript
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
       // 通过 id 查找到对应用户进行删除 User.findByIdAndRemove()
       User.findByIdAndRemove(req.query.id.replace(/"/g,''),function(err){
           if(err){
               return res.status(500).send('server error')
           }
   
       })
       res.redirect('/users')
   
   })
   
   // 把路由导出
   module.exports = router
   ```

   

3. 创建数据库 model 模块： user.js

   ```javascript
   var mongoose = require('mongoose')
   
   //连接数据库 数据库名(usersdb) 没有会自动创建
   mongoose.connect('mongodb://localhost/usersdb')
   
   //定义数据库表结构 schema
   var Schema = mongoose.Schema
   
   //设计表结构
   var userSchema = new Schema({
       name:{
           type:String,
           require:true
       },
       gender:{
           type:Number,
           enum:[0,1],
           default: 0
       },
       age:{
           type:Number
       },
       job:{
           type:String
       },
       hobbies:{
           type:String
       }
   })
   
   //将文档结构发布为模型并导出
   module.exports = mongoose.model('User',userSchema)
   ```

   1. 视图模块

      4.1 index.html

      ```html
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>index</title>
          <link rel="stylesheet" href="/public/css/css.css">
          <link rel="stylesheet" href="/public/css/index.css">
      </head>
      <body>
          <header>
              <div class="left"> 用户管理系统</div>
              <div class="right"> 欢迎登陆 admin | 退出</div>
          </header>
          <div class="slide">
              <ul>
                  <li>用户信息</li>
              </ul>
          </div>
          <div class="add">
              <a href="/add">添加用户</a>
          </div>
          <div class="content">
              <table cellspacing="0">
                  <thead>
                      <tr>
                          <td>姓名</td>
                          <td>性别</td>
                          <td>年龄</td>
                          <td>爱好</td>
                          <td>职位</td>
                          <td>操作</td>
                      </tr>
                  </thead>
                  <tbody>
                  {{ each users }}
                      <tr>
                          <td>{{ $value.name }}</td>
                          {{if $value.gender==0 }}
                          <td>男</td>
                          {{ else }}
                          <td>女</td>
                          {{ /if }}
                          <td>{{ $value.age }}</td>
                          <td>{{ $value.hobbies }}</td>
                          <td>{{ $value.job }}</td>
                          <td>
                              <!-- 注意这里 id={{  }} 的=(这个等号)前后不能打空格 不能打成 id = {{  }}
                                  因为打了空格就相当于加了字符串空格，获取的id会有误 -->
                              <a href="/edit?id={{ $value._id }}">编辑</a>
                              <a href="/delete?id={{ $value._id }}">删除</a>
                          </td>
                      </tr>
                  {{ /each }}
                  </tbody>
              </table>
          </div>
      </body>
      </html>
      ```

      4.2 add.html

      ```html
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>index</title>
          <link rel="stylesheet" href="/public/css/css.css">
          <link rel="stylesheet" href="/public/css/form.css">
      </head>
      <body>
      <header>
          <div class="left"> 用户管理系统</div>
          <div class="right"> 欢迎登陆 admin | 退出</div>
      </header>
          <div class="slide">
              <ul>
                  <li>用户信息</li>
              </ul>
          </div>
          <div class="content">
              <div class="box">
                  <div class="top">添加信息</div>
              <form action="/add" method="post">
                  <table>
                      <tr>
                          <td>姓名：</td>
                          <td><input type="text" name="name" class="text" placeholder="请输入用户名"></td>
                      </tr>
                      <tr>
                          <td>性别：</td>
                          <td>
                              男：<input type="radio" name="gender" value="0">
                              女：<input type="radio" name="gender" value="1">
                          </td>
                      </tr>
                      <tr>
                          <td>年龄：</td>
                          <td><input type="number" name="age" class="text"></td>
                      </tr>
                      <tr>
                          <td>爱好：</td>
                          <td><input type="text" name="hobbies" class="text"></td>
                      </tr>
                      <tr>
                          <td>职位：</td>
                          <td><input type="text" name="job" class="text"></td>
                      </tr>
                      <tr>
                          <td colspan="2">
                              <input type="submit" value="提交" class="button">
                              <input type="reset" value="重置" class="button">
                          </td>
                      </tr>
                  </table>
              </form>
              </div>
          </div>
      </body>
      </html>
      ```

      4.3 edit.html

      ```html
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>index</title>
          <link rel="stylesheet" href="/public/css/css.css">
          <link rel="stylesheet" href="/public/css/form.css">
      </head>
      <body>
      <header>
          <div class="left"> 用户管理系统</div>
          <div class="right"> 欢迎登陆 admin | 退出</div>
      </header>
      <div class="slide">
          <ul>
              <li>用户信息</li>
          </ul>
      </div>
      <div class="content">
          <div class="box">
              <div class="top">添加信息</div>
              <form action="/edit" method="post">
                  <!--
                  用来放一些不希望被用户看见，但是需要被提交到服务端的数据
                 -->
                  <input type="hidden" name="id" value="{{ user.id }}">
                  <table>
                      <tr>
                          <td>姓名：</td>
                          <td><input type="text" class="text" name="name" value="{{ user.name }}"></td>
                      </tr>
                      <tr>
                          <td>性别：</td>
                          <td>
                              {{ if user.gender == 0 }}
                              男：<input type="radio" name="gender" value="0" checked>
                              女：<input type="radio" name="gender" value="1">
                              {{ else }}
                              男：<input type="radio" name="gender" value="0" >
                              女：<input type="radio" name="gender" value="1" checked>
                              {{ /if }}
                          </td>
                      </tr>
                      <tr>
                          <td>年龄：</td>
                          <td><input type="number" class="text" name="age" value="{{ user.age }}"></td>
                      </tr>
                      <tr>
                          <td>爱好：</td>
                          <td><input type="text" class="text" name="hobbies" value="{{ user.hobbies }}"></td>
                      </tr>
                      <tr>
                          <td>职位：</td>
                          <td><input type="text" class="text" name="job" value="{{ user.job }}"></td>
                      </tr>
                      <tr>
                          <td colspan="2">
                              <input type="submit" value="提交" class="button">
                              <input type="reset" value="重置" class="button">
                          </td>
                      </tr>
                  </table>
              </form>
          </div>
      </div>
      </body>
      </html>
      ```

      

### 六、测试

1. 连接数据库

   ```shell
   mongod
   ```

2. 开启服务

   ```shell
   nodemon app.js
   ```

   

