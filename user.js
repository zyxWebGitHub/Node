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