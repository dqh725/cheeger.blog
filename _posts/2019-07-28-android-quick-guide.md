---
layout: post
title:  "Android emulator quick guide"
lang: en
category: develop
tags: android, adb
comments: true
---

# 1. Quick command line tool for adb

- `adb devices`: list all connected devices
- `adb connect IP_ADDR`: connect to a device within the same LAN
- `adb disconnect`: disconnect all connected devices
- `adb shell`: goes into android shell
- `adb install app.apk`: install app.apk into connected device, only if the package is not installed yet
- `adb uninstall com.example.box`: the package name can be found in android shell's `/data/app`, you will need `su` to grant the admin access
- `adb pull /system/priv-app/Launcher3`: to download file from android device to local machine
- `adb push DIR_OF_LOCAL DIR_OF_ANDROID`: to upload local file to android device

## Uninstall system app
```bash
adb shell
su    # will ask for permission, accept it
mount -o remount,rw /system  # unmount system
rm -rf /system/priv-app/Launcher3/
reboot
```

# 2. Local machine connect to emulator

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
then you can access the emulator via host-port

# 3. Restart Logcat

Sometimes android Logout will not working properly, showing nothing in the console, the most simple way to resolve this issue is to restart logcat(adb server);

```
cd $ANDROID_HOME/platform-tools && adb kill-server && adb start-server
```
All set;

