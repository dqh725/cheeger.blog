---
layout: post
title:  "Find out which linux version you are using?"
category: 'linux'
tags: linux
---

# Method #1: /etc/*-release file

To find out what version of Linux (distro) you are running, enter the following command at the shell prompt:

    $ cat /etc/*-release

# How Do I Find Out My Kernel Version?

Type the following command:

    $ uname -a

e.g.

    Linux MI-R3G 3.4.113 #11 SMP Wed Nov 29 21:24:53 CST 2017 mips GNU/Linux
    Linux iZt4n08ga49ywbjd9jiwZ 4.4.0-47-generic #68-Ubuntu SMP Wed Oct 26 19:39:52 UTC 2016 x86_64 x86_64 x86_64 GNU/Linux

# Say hello to /proc/version

    $ cat /proc/version

e.g.

    Linux version 3.4.113 (padavan@hms) (gcc version 4.4.7 (GCC) ) #11 SMP Wed Nov 29 21:24:53 CST 2017
    Linux version 4.4.0-47-generic (buildd@lcy01-03) (gcc version 5.4.0 20160609 (Ubuntu 5.4.0-6ubuntu1~16.04.2) ) #68-Ubuntu SMP Wed Oct 26 19:39:52 UTC 2016


