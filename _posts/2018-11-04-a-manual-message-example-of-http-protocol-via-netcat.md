---
layout: post
title:  "Http protocol messaging demo via Netcat"
lang: en
category: develop
icon: C
tags: netcat, http1.1
comments: true
---

# Introduction
**Hypertext Transfer Protocol**(HTTP) is an application protocol for distributed, collaborative, hypermedia iformation systems, http is the foundation of data communication for the WWW.

Development of HTTP was initiated by Tim Berners-Lee at CERN in 1989, and a later version HTTP/2 was standardized in 2015 and is now supported by major web[(wiki)][http-wiki-url].

In my words, **<span style="color: rgb(255, 76, 0);">it is a set of message format standards pre-defined for 2 parties</span>**. The lastest version is HTTP/2 which is released in 2015, but HTTP/1.1 is still the most widely supported one.

In this article, I would start a client and a server by the tool **netcat** and passing message around them by following the HTTP/1.1, and hopefully shows you a rough idea about how HTTP protocol looks like in the real world.

# Start a connection:

    server > netcat -lp 1234 # l: listen, p: port
    browser> netcat localhost 1234 # connect to the address

So these 2 shells are connected via TCP, then, any message you sent from browser(shell) will be received in server(shell), and the same the opposite.

That's because the server is not configured to deal with the message it received, so by defualt it will just echo the message back to the client.

# Connect to a real web address:

    browser> netcat cheeger.com 80
    GET / HTTP/1.1
    Host: cheeger.com
    Content-Type: */*

Here it will connect to a real website server and perform a GET request of "/", so you should be able to see the response:

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

301 as it is redirect to https;

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

[http-wiki-url]:https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol
