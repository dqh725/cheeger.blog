---
layout: post
title:  "创建MQTT broker"
lang: cn
category: develop
tags: mqtt, ubuntu
comments: true
---

## 背景
MQTT全称Message Queuing Telemetry Transport，是一种轻量级的物联网信息传输协议，充分考虑了物联网网络环境中的各种因素，比如噪音大，丢包率高。

MQTT使用的是publish/subscribe pattern，在架构中需要在云端设立一个message broker，然后publisher和subscribers都面向broker传输信息从而实现相互之间的交流。由于MQTT是事件触发的，基本上是零延迟，而且QoS可以保证信息传达一次或者多次。

## 安装

    sudo apt-get upgrade
    sudo apt-get install mosquitto mosquitto-clients

## 测试
订阅测试：

    mosquitto_sub -h localhost -t test

发布测试：

    mosquitto_pub -h localhost -t test -m "hello world"

## 配置密码
为了安全考虑，我们可以为每个MQTT client设置密码以及ACL；
- 启动密码验证

      sudo vim /etc/mosquitto/conf.d/default.conf

添加这两行

    allow_anonymous false
    password_file /etc/mosquitto/passwd

重启服务

    sudo systemctl restart mosquitto

- 设置密码

直接在命令行窗口输入

    sudo mosquitto_passwd -c /etc/mosquitto/passwd client

这会要求你输入两次密码, 密码会以加密的方式存在/etc/mosquitto/passwd，同时也可以添加多个账户。

- 配置ACL
在有些时候，需要为不同的用户配置不同的权限，e.g.

```
user backend
topic readwrite #

user client
topic read #
```

再以上的例子中，backend可以读写任何的topic，client只有读取任意topic的全选，但是不能发布。# 通配符表示任意长度的任意字符

[mosquitto更多配置][mosquitto-man]

## 客户端/SDK

### Android
[android sdk][android-skd]
for android studio, add to `build.gradle`

    compile 'org.eclipse.paho:org.eclipse.paho.client.mqttv3:1.1.0'
    compile 'org.eclipse.paho:org.eclipse.paho.android.service:1.1.1'

### Rails Gem
[github sdk][rails-mqtt]

[mosquitto-man]: https://mosquitto.org/man/mosquitto-conf-5.html
[android-skd]: https://github.com/eclipse/paho.mqtt.android
[rails-mqtt]: https://github.com/njh/ruby-mqtt
