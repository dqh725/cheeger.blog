---
layout: post
title:  "Android development quick guide"
lang: en
category: develop
tags: android, adb
comments: true
---

- [Adb Usage](#adb-usage)
- [Host access emulator](#local-machine-connect-to-emulator)
- [Quick Fixes](#quick-fixes)

# ADB usage
### Quick command line tool for adb

- `adb devices`: list all connected devices
- `adb connect IP_ADDR`: connect to a device within the same LAN
- `adb disconnect`: disconnect all connected devices
- `adb shell`: goes into android shell
- `adb install app.apk`: install app.apk into connected device, only if the package is not installed yet
- `adb uninstall com.example.box`: the package name can be found in android shell's `/data/app`, you will need `su` to grant the admin access
- `adb pull /system/priv-app/Launcher3`: to download file from android device to local machine
- `adb push DIR_OF_LOCAL DIR_OF_ANDROID`: to upload local file to android device

### Install/Uninstall system app
if connected with cable
```bash
adb root
adb remount
adb shell
rm  -rf /system/priv-app/SuperSU # delete supersu for example
reboot
```

else connected wirelessly
```bash
adb shell
su    # will ask for permission, accept it
mount -o remount,rw /system  # unmount system
rm -rf /system/priv-app/Launcher3/
reboot
```

# Local machine connect to emulator
I have a web server hosted in an android emulator, and I would like to access it from my local machine;

```bash
$ telnet localhost 5554
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
Android Console: Authentication required
Android Console: type 'auth <auth_token>' to authenticate
Android Console: you can find your <auth_token> in
'/Users/Alba/.emulator_console_auth_token'
OK
```

```
auth DCbP4qqM4bsswhhh
```

### Add port forwording rule, from <host-port>:<emulator-port>
```
redir add tcp:8080:8080
```
then you can access the emulator via the host and the port

# 4. How to check android CPU is 32 or 64
```bash
$ cat /proc/cpuinfo
```

the result will looks like this:
```
Processor : AArch64 Processor rev 4 (aarch64)
processor : 0
processor : 1
processor : 2
processor : 3
Features : fp asimd evtstrm aes pmull sha1 sha2 crc32
CPU implementer : 0x41
CPU architecture: AArch64
CPU variant : 0x0
CPU part : 0xd03
CPU revision : 4

Hardware : Amlogic
Serial : adsf
```

# Quick fixes

## Q1
### Cannot resolve all classes

You can do "File" -> "Invalidate Caches...", and select "Invalidate and Restart" option to fix this.

## Q2
### Restart Logcat

Sometimes android Logout will not working properly, showing nothing in the console, the most simple way to resolve this issue is to restart logcat(adb server);

```
adb kill-server && adb start-server
```
