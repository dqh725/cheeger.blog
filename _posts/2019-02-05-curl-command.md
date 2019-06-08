---
layout: post
title:  "curl"
lang: en
category: linux
icon: B
tags: linux
comments: true
---

# CURL
curl: transfer a url

# curl GET
* Access a url
```
curl www.cheeger.com
```

* Access a https url
```
# -k (--insecure) to fetch with TSL
curl -k https://www.cheeger.com
```
* Additional headers
```
curl -H "content-type: application/json" -H ...
```
* Basic Authentication
```
curl -u user:password www.cheeger.com
```
* with JWT Token
```
curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" https://my.restful.api/path
```
* with referer
```
curl -e localhost localhost/some/other/path
```
* verbose details headers, -v(--verbose)
```
# A line starting with '>' means "header data" sent by curl, '<' means "header data" received
curl -kv https://www.cheeger.com
```
* Display response headers
```
 curl --head -k https://www.cheeger.com
```
* use proxy for connecting
```
curl --proxy yourproxy:port http://www.cheeger.com
```

# curl POST
* POST with single field
```
curl -XPOST www.cheeger.com -d oneKey=simpleValu
```
* POST with json data
```
curl -XPOST www.cheeger.com -d '{"id":"1","name":"my name"}'
```
* POST with json data in a local file
```
curl -X POST -H "Content-Type: application/json" -d @../path/to/data DESTINATION
````
* POST with formdata, -F/--form <name=content>, e.g.
```
curl \
  -F "filename=new image" \
  -F "filetype=image" \
  -F "file=@/home/user1/Desktop/test.jpg" \
  localhost:8000/upload
```
