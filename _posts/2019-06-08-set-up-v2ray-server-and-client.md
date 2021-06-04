---
layout: post
title:  "设置&#9608;&#9608;&#9608;&#9608服务端和客户端"
lang: cn
category: general
tags: v2ray, linux
comments: true
---

## 介绍
因业务需求要访问海外AWS，但是由于某些特殊的政治原因，无可奈何的需要使用一些非常手段，闲话少叙，直入主题。

## 背景
合理的上网永远是一种猫抓老鼠的游戏，有抓的有躲的，前段时间一度非常流行的
&#9608;&#9608;&#9608;&#9608;&#9608;
已经确定可以通过分析出其流量特征并且有针对性的封锁服务器；目前的另一种方法是&#9608;&#9608;&#9608;。

我爱我的国家，我也知道管理这个国家的难度，我也理解网上不是法外之地，目前的管制方法就是全堵。
- 堵住了学习的途径
- 闭门造车不能强国

## &#9608;&#9608;&#9608;-服务器端
- 以ubuntu18 为例, ssh到服务器运行以下脚本下载安装：

      curl -L -s https://install.direct/go.sh
      bash go.sh

- 配置文件

      vim /etc/&#9608;&#9608;&#9608;/config.json

```
    {
      //"log": {
      //  "access": "/var/log/*****/access.log",
      //  "loglevel": "debug",
      //  "error": "/var/log/*****/error.log"
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

log部分可做调试之用，完成以后可注释掉以免日志暴增。

  - 启动，关闭，重启，查看状态

        systemctl start|stop|restart|status

  - 查看服务器是不是在监听端口：

        lsof -i:[你的端口]

## &#9608;&#9608;&#9608;-客户端

### IOS
shadowrocket, 国外ID下载。

### Mac
&#9608;&#9608;&#9608;X: 官方推荐  [client download](https://github.com/Cenmrev/V2RayX/releases/download/v1.5.1/V2RayX.app.zip)

### Windows
windows 有&#9608;&#9608;&#9608;N, 只提供UI界面，但是要把&#9608;&#9608;&#9608;-core和&#9608;&#9608;&#9608;N.exe放在用一个文件夹



