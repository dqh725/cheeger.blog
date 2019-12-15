---
layout: post
title: "Ubuntu部署RubyonRails生产环境(二)"
lang: cn
category: develop
tags: aliyun, ecs, rubyonrails
comments: true
---

## 下载rails APP代码
确认目前登陆的是rails用户：

    mkdir /srv/deploy && cd /srv/deploy && git clone git@[your_rails_repo_url]

下载gems

    bundle install

设置ENVs，我的全部环境变量都存在`/etc/environments`, 至少需要设置database的相关变量，e.g. postgreSQL

```
POSTGRESQL_ADDRESS=''
POSTGRESQL_USERNAME=''
POSTGRESQL_PASSWORD=''
POSTGRESQL_PORT=''
POSTGRESQL_DATABASE=''
```
然后创建数据库：

    bundle exec rake db:create db:migrate

## 选择app server
通常情况下在本地运行rails server的时候使用的是webrick作为app server, 它在生成环境有各种缺陷：
- 慢：它本身是ruby写的
- 无法处理长URI，最多2083的字符
- 单线程：并发处理差

相比之下unicorn就是一个比较好的选择；尤其是对于有多核CPU的服务器来说，你可以指定unicorn workers做并发处理，具体公式没有深入研究。
只要在gemfile加入：

    gem 'unicorn'

然后bundle就可以，运行：

    bundle exec unicorn_rails -c config/unicorn.rb -E $RAILS_ENV -D

## 使用SystemD来管理运行unicorn进程

以上的运行无法在系统崩溃的时候自启动，最好是写一个SystemD脚本来运行unicorn进程；强烈推荐一个gem叫foreman；

    gem 'foreman' or gem install foreman

可以通过foreman来自动生成systemD脚本

    sudo foreman export -p5000 --app project_name --user rails systemd /etc/systemd/system/

