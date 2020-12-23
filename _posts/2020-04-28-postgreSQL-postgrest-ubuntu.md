---
layout: post
title:  "PostgreSQL + PostgREST + ubuntu"
lang: zh
category: develop
tags: "RESTful postgREST ubuntu"
comments: true
---

# 介绍
在Ubuntu 18.04 上搭建PostgreSQL + PostgREST，快速开发RESTful API。

# 安装PostgreSQL

### 1. 直接安装
    sudo apt update
    sudo apt install postgresql postgresql-contrib

### 2. 连接PG数据库
    sudo -u postgres psql

### 3. 退出psql: `\q`

默认安装的postgresql自带用户postgres，但是默认密码我不知道，改变密码比较方便

    sudo -u postgres psql
    postgres=# ALTER ROLE postgres WITH PASSWORD 'password';
    postgres=# \q

### 4. 创建数据库
    sudo -u postgres psql
    postgres=# CREATE DATABASE DB;
    postgres=# \q

### 5. 允许远程通过IP地址连接postgresql服务，要做以下两步
- a. 默认只监听localhost，要改成监听公网IP地址

      vim  /etc/postgresql/10/main/postgresql.conf
  然后在文件中取消这一行的注释：

      listen_addresses = '*' # 默认是listen_addresses = 'localhost'
- b. 更改规则远程客户端通过什么验证方式访问

      vim /etc/postgresql/10/main/pg_hba.conf

  在文件最下面添加一条规则

      host    all             all             0.0.0.0/0            md5

  0000/0： 允许任何IP地址访问，可以只允许一个IP， e.g. 1.1.1.1/32

  trust|peer|md5, 推荐md5，也就是通过用户名密码访问。

  最后重启：

      sudo service postgresql restart

#### 5. 远程登陆测试

在本地电脑命令行里面运行：

    psql postgres://postgres:password@[SERVER_IP]

默认端口5432，如果服务器不是这个端口需要制定，e.g.

    psql postgres://postgres:password@45.45.45.45:5432

# 安装PostgREST

PostgREST工具可以快速将PG数据库转变成一个后端RESTful API服务器，非常方便。官网: http://postgrest.org/en/v6.0/

### 1. 下载压缩包

https://github.com/PostgREST/postgrest/releases  找到对应的版本下载连接。

    mkdir postgrest && cd postgrest
    wget https://github.com/PostgREST/postgrest/releases/download/v7.0.0/postgrest-v7.0.0-ubuntu.tar.xz
    tar Jxf postgrest-v7.0.0-ubuntu.tar.xz
    ./postgrest --help # 测试是不是可以运行

### 2. 准备好配置文件
    vim postgrest.conf

在文件中输入基本的配置：

    db-uri = "postgres://postgres:password@localhost/db"
    db-schema = "public"
    db-anon-role = "postgres"

制定一个数据库，这个例子中数据库是db。

指定schema, public是默认的

db-anon-role可以制定别的role，用于指定匿名访问的时候应该使用那个role进行数据库操作，设置成postgres的话，就是匿名访问拥有全部权限，很危险。

### 3. 运行测试
./postgrest postgrest.conf

可以curl localhost:3000查看结果

### 4. 通过SystemD运行
添加一个service文件

    cd  /etc/systemd/system/
    vim postgrest.service

在service文件中输入

    [Unit]
    Description=Postgrest service

    [Service]
    ExecStart=/home/ubuntu/postgrest/postgrest /home/ubuntu/postgrest/postgrest.conf

    [Install]
    WantedBy=multi-user.target

运行：

    sudo systemctl start postgrest


### 5. 通过nginx将postgREST服务挂到80端口

    sudo apt-get install nginx
    vim /etc/nginx/sites-available/default

编辑nginx配置：

    upstream postgrest {
        server localhost:3000;
        keepalive 64;
    }

    server {
            listen 80 default_server;
            listen [::]:80 default_server;

            root /srv/www/html;

            # Add index.php to the list if you are using PHP
            index index.html index.htm index.nginx-debian.html;

            server_name _;

            location /swagger {
                    alias /srv/www/html;
            }

            location /api/ {
                      default_type  application/json;
                      proxy_hide_header Content-Location;
                      add_header Content-Location  /api/$upstream_http_content_location;
                      proxy_set_header  Connection "";
                      proxy_http_version 1.1;
                      proxy_pass http://postgrest/;
            }

            location / {
                    deny all;
            }
    }

简单的解释：

/swagger => /srv/www/html, 下面我们会添加swagger api documentation html

/api/ => proxy_pass http://localhost:3000;

/ => 其他全部返回403, deny

然后重启nginx:

    sudo services nginx reload

### 6. 配置swagger API页面
添加swagger html页面

    vim /srv/www/html/index.html

输入：将[YOUR_SERVER_IP]替换成你自己的IP

    <html>
      <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.17.0/swagger-ui.css">
          <script src="//unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
          <script>
            function render() {
              var ui = SwaggerUIBundle({
                url: "http://[YOUR_SERVER_IP]/api/",
                dom_id: '#swagger-ui',
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIBundle.SwaggerUIStandalonePreset
                ]
              });
            }
          </script>
      </head>

      <body onload="render()">
          <div id="swagger-ui"></div>
      </body>
    </html>

所有工作都准备好了。

哦对了，还差最后一步，用户访问swagger页面的时候可以直接在页面上测试api的访问，但是默认的访问借口是0.0.0.0（这当然是获取不了数据的）
要添加一个额外的配置文件到postgres.conf

    server-proxy-uri = "http://[YOUR_SERVER_IP]/api/"

# 添加表单和数据吧。。。推荐sqitch
