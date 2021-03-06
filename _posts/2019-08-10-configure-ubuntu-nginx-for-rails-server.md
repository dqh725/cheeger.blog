---
layout: post
title:  "Configure ubuntu nginx for rails server"
lang: en
category: develop
tags: nginx, rails, unicorn
comments: true
---

# Install Nginx in server
```bash
sudo apt-get install nginx
```

# Deploy rails code to server
The simplest way is to do it via github; git push your local changes and in the server, do
```bash
git pull origin master
```
then install dependency
```bash
bundle install
```
then run migration
```bash
bundle exec rake db:migrate assets:precompile
```

# Add nginx config file
There are two folders under `/etc/nginx/`, `site-availables` and `site-enabled`.

There is a `default` config file inside `/etc/nginx/site-availables/` folder, you can use it as a template but I always create a new configure file call it `web` or whatever you want, here is one example.

```
upstream app {
    # Path to Unicorn SOCK file, as defined previously
    server unix:/PATH_TO_RAILS_ROOT/shared/sockets/unicorn.sock fail_timeout=0;
}

server {
    server_name SERVER_NAME; # change to your own example.com

    root /PATH_TO_RAILS_ROOT/public;

    try_files $uri/index.html $uri @app; # reverse proxy to rails socket

    location @app {
        proxy_pass http://app;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header  Host $host;
        proxy_set_header  X-Forwarded-Proto $scheme;
        proxy_set_header  X-Forwarded-Ssl on; # Optional
        proxy_set_header  X-Forwarded-Port $server_port;
        proxy_set_header  X-Forwarded-Host $host;
        proxy_redirect off;
    }

    error_page 500 502 503 504 /500.html;
    client_max_body_size 4G;
    keepalive_timeout 10;

    # configure for tsl ...
}

```
Now `/etc/nginx/site-avaibales/web` is ready, to enable it, just create a softlink pointing to `/etc/nginx/sites-enabled/web`

```bash
sudo ln -s /etc/nginx/sites-available/web /etc/nginx/sites-enabled
```
then restart nginx services
```bash
sudo service nginx restart
```

# Setup ssl with Let's Encrypt
[Official doc][letsencrypt-url]

[letsencrypt-url]: https://certbot.eff.org/
