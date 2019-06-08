---
layout: post
title:  "设置v2ray服务端和客户端"
lang: cn
category: general
tags: v2ray, linux
comments: true
---

## 介绍
因业务需求要访问海外AWS，但是由于某些特殊的政治原因，无可奈何的的需要使用一些非常手段，闲话少叙，直入主题。

## 背景
合理的科学上网永远是一种猫抓老鼠的游戏，有抓的有躲的，前段时间一度非常流行的shadowsocks据猜测国家已经可以分析出其流量特征并且有针对性的封锁服务器；目前的另一种方法是v2ray，没有测试过安全性怎么样；

## v2ray-服务器端
以ubuntu18 为例：
- ssh 登陆到远程服务区
- 下载，安装，启动

    curl -L -s https://install.direct/go.sh
    bash go.sh

- 配置文件

      vim /etc/v2ray/config.json

```
  {
    //"log": {
    //  "access": "/var/log/v2ray/access.log",
    //  "loglevel": "debug",
    //  "error": "/var/log/v2ray/error.log"
    //},
    "inbounds": [{
      "port": [端口], //不加引号，改成你需要的端口，一般是1024以上
      "protocol": "vmess",
      "listen": "0.0.0.0",
      "settings": {
        "clients": [
          {
            "id": "[uuid]" // 改成你的uuid，任何uuid，客户端和服务器一致就行。
            "security": "auto",
            "level": 1,
            "alterId": 64
          }
        ]
      }
    }],
    "outbounds": [{
      "protocol": "freedom",
      "settings": {}
    },{
      "protocol": "blackhole",
      "settings": {},
      "tag": "blocked"
    }],
    "routing": {
      "rules": [
        {
          "type": "field",
          "ip": ["geoip:private"],
          "outboundTag": "blocked"
        }
      ]
    }
  }
```

  可以参考，log部分用来调试的时候非常有用，完成设置以后可以注释掉默认没有日志。

  启动，关闭，重启，查看状态

     systemctl v2ray start|stop|restart|status

  查看服务器是不是在监听端口：

    lsof -i:【你的端口】

## v2ray-客户端

### IOS

正版的免费的没有，都是收费的，我用的是shadowrocket需要国外的appleID以及$; 免费的没有认证的客户端 可以自行搜索shadowrocket的IOS APP的ipa，然后可以通过PP助手安装到手机，需要一台mac；

电脑(PP有windows版本的，但是windows好像是要下载windows版的iTunes，所以不建议)

- mac下载PP助  https://pro.25pp.com/pp_mac_ios
- 安装PP助手并且用数据线连接你的iphone
- 配置shadowrocket

### Mac
- 下载客户端
    - V2RayX: 官方推荐  https://github.com/Cenmrev/V2RayX/releases/download/v1.5.1/V2RayX.app.zip
    - V2RayU: 兼容v2ray和shadowsocks： https://github.com/yanue/V2rayU/releases/download/1.3.1/V2rayU.dmg

  随便哪个都可以；
* 配置

 问题：现在好像只有全局的可以用，PAC模式使用一直有问题，你也可以结合浏览器的插件，e.g. 谷歌浏览器的SwitchyOmega手动设置规则和开关；

 其他的客户端，windows 有v2rayN
 安卓的没试过；



