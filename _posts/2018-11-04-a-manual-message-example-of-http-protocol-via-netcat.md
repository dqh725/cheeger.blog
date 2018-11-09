---
layout: post
title:  "A Manual Message Example of HTTP Protocol via Netcat"
lang: en
category: develop
icon: C
tags: netcat, http1.1
comments: true
---

# Introduction
Everyone web developer knows HTTP protocol more or less, the full name is **Hypertext Transfer Protocol**.

In my words, it's a set of message formats pre-defined for any client talking to any server. While the lastest version is HTTP/2 which is released in 2015, HTTP/1.1 is still the most widely supported one.

In this article, I would like to get my hand dirty to start a client and a server and passing message around by following the HTTP/1.1's rule, so everyone will have a concrete idea of how HTTP protocol may looks like.

# Start a connection:

    server > netcat -lp 1234 # l: listen, p: port
    browser> netcat localhost 1234 # connect to address

shell1 and 2 are connected via TCP, so if you send any message in browser will be received in server, and same the opposite.

This is how the message are sending back and forwards between server and browser.

# Connect to a real web address:

    browser> netcat cheeger.com 80
    GET / HTTP/1.1
    Host: cheeger.com
    Content-Type: */*

You should be able to see the response from server:

    HTTP/1.1 301 Moved Permanently
    Server: nginx/1.10.3 (Ubuntu)
    Date: Fri, 09 Nov 2018 15:52:48 GMT
    Content-Type: text/html
    Content-Length: 194
    Connection: keep-alive
    Location: https://cheeger.com/

    <html>
    <head><title>301 Moved Permanently</title></head>
    <body bgcolor="white">
    <center><h1>301 Moved Permanently</h1></center>
    <hr><center>nginx/1.10.3 (Ubuntu)</center>
    </body>
    </html>

# Open a real browser to connect to a fake server

    server > netcat -lp 1234

Open a browser and go to localhost:1234, you should see a loading page with no content, that's because the server hasn't returned any data
Howeve you should a request data sent from your browser asking for the file of path `/`.

Type these into shell/terminal:

    HTTP/1.1 200 OK
    Server: my server
    Content-Type: */*

    <h1>my server is running</h1>

Now you should see the website load the content, you can keep typing to send more html data as the connection is still open. Also you may notice the browser is still loading, as you haven't told the browser the response is finished.

This is just the very basic example of how to communicate via HTTP protocol, of course there are more concepts, like methods, status codes, header fields and so on, but they are too handy to do it right manually.

FYI, netcat/curl are great tools to play around your ideas.


