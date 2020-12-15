---
layout: post
title:  "Setup your own Baas with node and parse-server"
category: develop
icon: w
lang: en
tags: parse-server parse-dashboard pm2 noSQL
---

# Background
When building mobile app, andriod or IOS, where to save the data is frustrated, building the whole API backend sometime seems overkill for a small application. Parse used to be one of the best Baas, but facebook has brought it and shut it down, shame!

Now since the parse-server has become open source for a while, so in this article, I will discuss how to install parse-server in your own server.

# Install
Install node/npm, in my case, I used node8 in this example.

    npm install -g parse-server mongodb-runner pm2
    mongodb-runner start

This will download the mongodb and start it automatically.

    git clone https://github.com/parse-community/parse-server-example.git
    cd parse-server-example

Use the example code to setup parse-server with express, it's simple to use `pm2` to manage all npm processes.

    pm2 start index.js

Now we will have a parse-server running on our server, good enough to use as backend service.
We can test by `curl` post and get.

# Install Parse Dashboard
Sometimes it will need a dashbaord to view/edit data in a console, `parse-dashboard` is good for that purpose.

    npm install parse-dashboard dotenv -save

My final package.json is like this:

```javascript
{
  "name": "parse-server-example",
  "version": "1.4.0",
  "description": "An example Parse API server using the parse-server module",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/ParsePlatform/parse-server-example"
  },
  "license": "MIT",
  "dependencies": {
    "dotenv": "^5.0.1",
    "express": "~4.11.x",
    "kerberos": "~0.0.x",
    "parse": "~1.8.0",
    "parse-dashboard": "^1.2.0",
    "parse-server": "*"
  },
  "scripts": {
    "start": "node index.js"
  },
  "engines": {
    "node": ">=4.3"
  }
}
```
my `.env` :
```shell
DATABASE_URI=mongodb://localhost:27017/parse
APP_ID=my_app_id
MASTER_KEY=masterkey
PORT=1337
serverURL=https://localhost:1337/parse
```
default port for parse is 1337, you can change to others if you want;

Open the firewall rule for port 1337

# The last step:

    vim index.js

on the top of the file, add:

```javascript
require('dotenv').config();
var ParseDashboard = require('parse-dashboard');
```
on the bottom of the file, add:

```javascript
var dashboard = new ParseDashboard({
  "apps": [{
    "serverURL": process.env.SERVER_URL,
    "appId": "alba",
    "masterKey": process.env.MASTER_KEY || 'masterkey',
    "appName": "My Cool App",
    "supportedPushLocales": ["en"]
  }],
  "users": [{
    "user": "admin",
    "pass": "$2a$10$6A4FbxSfHh2WonKClgBceeDRLcyqfsnegj0HuXG.9M7Qk4izAonG2", // the encripted hash for 'admin'
    "apps": [{"appId": "alba"}]
  }],
  "useEncryptedPasswords": true // or set to false, use plain password
});

app.use('/dashboard', dashboard);
```


# Lets Encript the domin

Now when open SERVER_URL/dashbaord, it will open the dashboard, but you will see a big warning message, you need https to enable the full features. [How to set up lets encript for you domain][setup-letsencript]


[setup-letsencript]: https://certbot.eff.org/

Enjoy you parse-server and parse-dashboard.
