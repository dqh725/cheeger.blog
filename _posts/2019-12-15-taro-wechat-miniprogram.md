---
layout: post
title:  通过Taro(react-ish)开发微信小程序
lang: cn
category: develop
tags: taro, 微信
comments: true
---

# 介绍
微信小程序有自己的框架, 但是做的不够突出，学习曲线高又不实用。
我比较喜欢React的语法框架，所有我找了很多方法尝试去用React开发微信小程序，比较好用的是anujs以及taro，taro更加符合react习惯，轻量级开发体验基本上和react相同。

# 使用的工具
- [微信开发工具][wechat-devtool-url]
- 强烈推荐iTerm作为bash脚本运行环境

# 官方文档
- [taro官方文档][taro-url]

# 安装
安装Taro, 可以通过npm或者yarn安装

    yarn install -g mirror-config-china # 国内镜像
    yarn install -g @tarojs/cli

初始化项目

    taro init myApp

然后可以选择所需的模版，一半选择默认的，推荐typescript， 但是这个文档里面以默认为例；

    cd myApp & yarn install（init应该安过的，以防万一）

然后运行开发环境

    taro build --type weapp --watch

* 编译的文件会自动生产到`dist`的文件夹中；
* 代码开发在`src`文件夹中；
* 打开微信开发工具，然后导入一个新的项目，路径设置到  `path_to_myApp/dist`


# 配置
熟悉react的人都知道通过相对路径import组件很坑，最后是能够使用路径别名，taro也提供这个功能虽然不是默认的，只需要在根目录下的config/index.js里面添加配置，注意package安定project不能缺少，否则配置会失败。

```
  alias: {
    '@/src': path.resolve(__dirname, '..', 'src'),
    '@/package': path.resolve(__dirname, '..', 'package.json'),
    '@/project': path.resolve(__dirname, '..', 'project.config.json')
  },

```
调用的时候可以这样, 举例说明：

    import HeartbeatStatus from '@/src/components/HeartbeatStatus';
    import request from '@/src/utils/request.js';


我的项目结构如下, 作为参考：
```
src
├── app.jsx
├── app.scss
├── assets
│   └── images
│       ├── cloud.svg
│       ├── device.svg
│       ├── logout.svg
│       └── mobile.svg
├── components
│   ├── HeartbeatStatus
│   │   ├── index.jsx
│   │   └── style.scss
│   └── NavBar
│       ├── index.jsx
│       └── style.scss
├── config.js
├── images.js
├── index.html
├── pages
│   ├── DeviceDetailPage
│   │   ├── index.jsx
│   │   └── style.scss
│   ├── DevicesPage
│   │   ├── index.jsx
│   │   └── style.scss
│   ├── IndexPage
│   │   ├── index.jsx
│   │   └── style.scss
│   ├── LoginPage
│   │   ├── index.jsx
│   │   └── style.scss
│   └── UploadMediaPage
│       ├── index.jsx
│       └── style.scss
└── utils
    ├── authentication.js
    ├── base64.js
    └── request.js
```
- 注意config是taro（微信）特有的，用于定义一些微信小程序页面的属性，比如页面的标题。
- 所有的页面组件都要在src/app.jsx的config里面定义

```
class App extends Component {

  config = {
    pages: [
      'pages/IndexPage/index',
      'pages/DevicesPage/index',
      'pages/DeviceDetailPage/index',
      'pages/LoginPage/index',
      'pages/UploadMediaPage/index'
    ],
...
```

# 项目配置

微信对request的域名有严格的限制，开发环境中我们可以取消对域名验证，可以在project.config.json里面添加
```
  "setting": {
    "urlCheck": false,
    "es6": true,
    "postcss": true,
    "minified": true,
    "newFeature": true
  },

```
这样每次修改或者重启的时候就不需要手动在微信开发工具里面取消http request验证了。

# 开发

Enjoy coding;

---
[wechat-devtool-url]: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
[taro-url]: https://taro-docs.jd.com/taro/docs/GETTING-STARTED.html

