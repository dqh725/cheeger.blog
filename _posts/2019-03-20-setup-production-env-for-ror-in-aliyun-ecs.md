---
layout: post
title: "在阿里云ECS上部署RubyonRails生产环境"
lang: cn
category: develop
tags: aliyun, ecs, rubyonrails
comments: true
---
关于如何在阿里云ECS（Ubuntu16.04）上部署RubyonRails的一些心得，希望分享给更多的rubyist知道；

本文讨论的是如何在阿里云上部署rails生产环境；

首先ECS创建的时候阿里云会一个root账号和一个管理员密码，ssh root@ip_address(公网) 配以密码不是特别方便，建议在本机电脑上创建一对公钥私钥，并且把公钥上传到阿里云的ESC服务器，可以参考[我的openssh讨论]([https://cheeger.com/linux/2018/05/19/openssl.html])。

在可以实现 `ssh server-name`以后，我们会发现现在登陆的是root用户，root用户拥有的权限太高，不小心的操作就会对linux系统造成不可逆的破坏，所以一般的建议是新建一个新的用户，我个人也强烈建议这么做，除非对linux系统命令非常熟悉知道自己的干什么。

# 创建新的linux用户
在linux（Ubuntu16.04）系统中, 可以通过下面的命令来创建：
    $ adduser rails
在弹出的对话里面只要提供密码和密码验证，后面的问题都直接回车就行；
    $ usermod -aG sudo rails
这个命令是添加新的用户到sudo这个用户组。在linux系统中，不可避免的要使用一些只有系统管理员才能使用的命令，sudo前缀可以让当前用户暂时获取root的资格并且以root的身份去运行一些命令，比如services，但是只有sudo组里的用户才能使用这个sudo命令。
    $ cat /etc/passwd
可以用来查看本机当前所用的用户， 新用户添加以后，`/root/rails/` 就自动创建，就是当前用户的默认路径。
现在我们可以切换到我们新建的用户了
   $ su - rails
 *可以通过相当的方法上传过id_rsa.pub到 /home/rails/.ssh，以后都可以通过ssh rails@ip_address来登陆*

# 安装必要的软件
现在我们的登陆账户是rails了， 现在可以安装git上传下载代码，然后安装rbenv，rbenv，rails，nodejs。
## 安装git
    $ sudo apt-get install git
使用git命令以前要先设置全局用户
    $ git config --global user.name = "YOUR NAME"
    $ git config --global user.email = "YOUR@EMAIL.COM"
或者：
    $ vim ~/.gitconfig
```bash
[color]
        ui = true
[user]
        name = YOUR NAME
        email = YOUR@EMAIL.COM
[push]
        default = current
[pull]
        default = current
```

如果不幸的你和我一样github激活了多重验证，你需要在你的服务器端生成一对公钥私钥，然后把公钥添加到你的github账户[可以参考这个github帮助](https://help.github.com/en/enterprise/2.15/user/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)。

别忘了添加一下这行到你的 ~/.ssh/config文件中；
```bash
Host github.com
  IdentityFile ~/.ssh/github_rsa # 用你自己的私钥
```
这样你访问git clone git@github.com ... 的时候就能自动使用你刚刚生成的私钥作为ssh连接了。

## 安装rbenv作为ruby的版本管理
    $ sudo apt-get update
    $ sudo apt-get install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm3 libgdbm-dev
这么多必要的包谁也记不住，网上的帖子很多，总归是前任总结的经验教训，发帖的目的不就是广为传播这些记不住的冷知识嘛，好了可以正式下载rbenv了， 我们直接从它的github下载源码，github上也有他的安装说明，我就从简说明了
    $ git clone https://github.com/rbenv/rbenv.git ~/.rbenv
    $ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
    $ echo 'eval "$(rbenv init -)"' >> ~/.bashrc
添加路径是为了全局的使用rbenv给我们提供的一些ruby和gem的使用工具, 具体的安装可以参考github。我以前一直使用chruby和ruby-install来作为轻量级的ruby版本管理，事实证明rbenv提供的路径工具能非常方便帮助我们通过systemD脚本来运行railsAPP，所以我建议大家直接使用rbenv，如果有人为为什么不用rvm，都是累啊，太庞大了，相当于雇100人管理只有几人的公司，我们的小机受不了啊，bug多什么的也就是听说，我也就用了一年就换chruby了。

## 安装ruby
rbenv安装好了以后，我们可以通过他的插件ruby-build来安装ruby
    $ git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
这样我们就能直接安装使用rbenv install命令了。
    $ rbenv install 2.5.0
你也可以安装自己需要的版本
    $ rbenv global 2.5.0
设置全局ruby版本，然后就是安装rails和nodejs，安装nodejs是因为rails的assets管理需要用到。
    $ gem install rails --no-ri --no-rdoc
    $ sudo apt-get install nodejs
    $ rails -v
    $ node -v
 检测安装的rails版本和nodejs版本；


# 下载rails APP代码

---
layout: post
title:  "setup-production-env-for-ror-in-aliyun-ecs"
lang: en
category: general
tags: tag1
comments: true
---

# introduction
content

# para1
content

# para2
content

