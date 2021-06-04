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
- [FAQ](#faq)

# ADB usage

### Mimic text input to device
- `adb shell input text "insert%syour%stext%shere"`: %s means SPACE

### Mimic event to device
- `adb shell input keyevent 82`: 82 is menu key, [complete code list](http://developer.android.com/reference/android/view/KeyEvent.html)

### Tap X, Y position

To find the exact X,Y position you want to Tap go to:

Settings > Developer Options > Check the option POINTER SLOCATION

- `adb shell input tap 500 1450`:

## Swipe X1 Y1 X2 Y2 [duration(ms)]
- `adb shell input swipe 100 500 100 1450 100`

## Long Press
- `adb shell input swipe 100 500 100 500 250`

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


# FAQ

### 1. Cannot resolve all classes

You can do "File" -> "Invalidate Caches...", and select "Invalidate and Restart" option to fix this.

### 2. Restart Logcat

Sometimes android Logout will not working properly, showing nothing in the console, the most simple way to resolve this issue is to restart logcat(adb server);

```
adb kill-server && adb start-server
```

### 3. could not find DSO to load: libreactnativejni.so

References:
- [Suggested fix](https://blog.csdn.net/lplj717/java/article/details/77370979)
- [对Android中arm64-v8a、armeabi-v7a、armeabi、x86认识](https://blog.csdn.net/liangtianmeng/article/details/82879848)


in app/build.gradle:

    defaultConfig {
      applicationId "com.example.lipiao.myreactnativeapp"
      minSdkVersion 16
      targetSdkVersion 25
      versionCode 1
      versionName "1.0"
      ndk {
        abiFilters "armeabi-v7a","x86"
      }
    }
    packagingOptions {
      exclude "lib/arm64-v8a/librealm-jni.so"
    }

