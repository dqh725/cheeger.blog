---
layout: post
title:  "find/sed"
category: linux
icon: B
tags: linux
---

# Find out linux kernal version
To find out what version of Linux (distro) you are running, try these 3 commands:

    $ cat /etc/*-release
    $ uname -a
    $ cat /proc/version

# Find file/directory
```
find [directory] -type [f/d] -name [file pattern] // e.g. *.rb; prefix*suffix
```

# Global replace string
```
sed -i '' 's/\(regex\)/\1, extra string/g' app/models/*.rb
```
node: `''` is needed for mac

Find all rb files and replace all `FactoryGirl` to `FactoryBot`
```
$ find ./ -type f -name *.rb -exec sed -i '' 's/FactoryGirl/FactoryBot/g'
```
