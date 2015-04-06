# imoocMovie
在慕课网看到 Scott 大侠的视频： node + mongodb 100分钟建站攻略（一期），一边看一边动手做练习。
这里是电梯：http://www.imooc.com/view/197
视频中有些代码有问题，看视频做的同学可以参考我这个
其中尤其要注意的是express 4.X不再绑定bodyParser，需要独立引用body-parser，并需要配置参数

# 开发环境与工具

首先，我的开发环境和工具：

操作系统: CentOS6.4 64位 

编辑器: Sublime Text 2 (前后端开发神器)

开发环境: node.js mongoDB npm express mongoose jade 

前端框架: jQuery Bootstrap (通过 Bower 来管理以上两个框架)

# 知识储备:

    Web 前端 ( HTML + CSS + JavaScript + jQuery + Bootstrap )
    简单了解 Node 的基本知识，安装、模块和包的概念、npm包管理工具的使用、express开发框架 、jade 对 Web前端 的模板化等
    Linux 环境下命令行的简单使用

# 详细对步骤我不再赘述，只是记录简单的过程和需要注意的地方

开始

建立项目文件夹 imooc；

然后，在命令行输入下列命令来安装所需要的工具包：

cd imooc
npm install express
npm install jade
npm install mongoose
npm install bower -g

在 imooc 文件夹下：

创建视图文件夹 views

创建程序入口文件 app.js

通过下列命令自动下载前端框架，注意bower好像不能用root执行：

bower install jquery
bower install bootstrap

下载到的前端文件会放置在 bower_components 文件夹下。

用 jade 写模板

第一次接触 jade ，专门看了Scott老师的课程，http://www.imooc.com/view/259
本来觉得很难，看过之后发现它挺强大，可以实现模板继承，适应后应该蛮棒的，但是我现在不会设置jade模板的代码高亮。

于是我们的 views 模板分拆如下：
公共部分

在 views 文件夹下创建 layout.jade , 作为”母模板“(个人的理解，即每个页面的公共骨架)。

打开并编辑它，大致样子如下：

doctype
html
    head
        meta(charset="utf-8")
        title #{title}
        include ./includes/head
    body
        include ./includes/header
        block content

非常简单，恶心的地方就是代码缩进两行，不能使用TAB键，不够方便，不习惯的时候经常会出错

通过 include 可以引入其他的子模块，比如header和footer实现模块的重用。

block content 则可以在不同的页面展示本页面私有的部分。

在 views 文件夹下创建文件夹 includes

在 includes 文件夹下创建 head.jade 和 header.jade

head.jade 就相当于 HTML 里的 head 标签，可以在这里引入前端文件：

link(href="/bootstrap/dist/css/bootstrap.min.css", rel="stylesheet")
script(src="/jquery/dist/jquery.min.js")
script(src="/bootstrap/dist/js/bootstrap.min.js")

header.jade 则相当于 HTML5 里 body 部分里的 header，可以在这里写好每个页面都有的部分，使用一些 Bootstrap 里定义的 CSS 样式，比如：

.container
    .row
        .page-header
            h1= title
            small 重度科幻

四个页面

在 views 文件夹下创建文件夹 pages

在 pages 文件夹下创建 4 个文件：

index.jade
detail.jade
admin.jade
list.jade

写页面模板的思路很简单，用 extends 引入公共骨架 layout.jade ，再写 block content 包含本页面的私有内容。

比如 index.jade 可以这么写：

extends ../layout

block content
    .container
        .row
            each item in movies
                .col-md-2
                    .thumbnail
                        a(href="/movie/#{item._id}")
                            img(src="#{item.poster}", alt="#{item.title}")
                        .caption
                            h3 #{item.title}
                            p: a.btn.btn-primary(href="/movie/#{item._id}", role="button")

这样就实现了前面所展示首页的模板。
其他页面的模板类似

写 Node 程序

到这里，我们就差一步就可以实现前后端的交互，让程序跑起来了。
配置程序

打开文件 app.js

    引入 express , path , body-parser；
    设置 模板引擎 和 模板文件的路径；
    设置 静态文件的路径；
    监听端口。

这些都是 Node 开发 Web 应用的基本设置，照着做就可以：

var express = require('express')
var path = require('path')
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000
var app = express()

app.set('views', './views/pages')
app.set('view engine', 'jade')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'bower_components')))
app.listen(port)

console.log('iMovie started on port ' + port)

设置路由

在 app.js 里接着往下写，以 首页/index 为例：

//index page

app.get('/', function (req, res)  {
    res.render('index', {
        title:'imooc index',
        movies: [{
            title:'',
            _id: ,
            poster:''
        }]
    })
})

可以看出，get是一个监听事件，当监听到地址栏请求 http://localhost:3000 + / 的时候，调用回调函数，将参数title和movies返回给index.jade这个模板，据填充到模板中，最终展现到浏览器中。

其他 3 个页面类似，略过。
填充数据

程序应该从数据库中获得数据，来填充到各个页面模板中。


好了，现在让程序跑起来！

在命令行输入：

cd imovie
node app

打开浏览器(推荐 Chrome 或者 FireFox 浏览器)，在地址栏输入

http://localhost：3000

如果显示没问题的话，成功。

