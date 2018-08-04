---
layout: post
title:  "Systemctl brief"
category: linux
icon: u
lang: en
comments: true
tags: ubuntu
---

### File system of linux
[linux/unix file system manual (online)][linux-fs-hier-link]

### Install APP

#### Package Manager
Windows softwares are downloaded from website, but each linux distribution hosts its own software repositories. These repositories contains software packages specifically for each linux distribution. We could think the "repositories" for linux is like "Apple Store" for iPhone.

#### Package
Like exe files for windows, Linux has it own types: DEB on Debian and Ubuntu, RPM on Fedora and Red Hat, etc.They are essentially archives contains a list of files. Therefore the installation process just copy the files into the location where the package specifies.

In ubuntu, you would install package via `apt-get install package-name`, which will lookup package from their own repositories. Ubuntu offers various personal package archives (PPAs) for 3rd application installation as well, but you are responsible for the risk to install them.

### SysV vs Systemd vs Upstart
System services, often called **daemons** in the Linux and UNIX can be implemented in multiple ways for service management.

#### service managed by systemd:
```
$ sudo systemctl start service-name
$ sudo systemctl status service-name
$ sudo systemctl stop service-name
$ sudo systemctl enable service-name // enable auto start when startup
$ sudo systemctl disable service-name
$ sudo systemctl show service-name // show all infomation
```
the script to start service can be located in `/usr/lib/systemd/system` or `/etc/systemd/system`
to find out where the script is located:
```
locate name.service // or the 'show command above'
```

#### Script Details

[Reference Link][sysd-explain-link]

`root@ubuntu1604# systemctl cat sshd.service`
```
# /lib/systemd/system/ssh.service
[Unit]
Description=OpenBSD Secure Shell server
After=network.target auditd.service
ConditionPathExists=!/etc/ssh/sshd_not_to_be_run

[Service]
EnvironmentFile=-/etc/default/ssh
ExecStart=/usr/sbin/sshd -D $SSHD_OPTS
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
Restart=on-failure
RestartPreventExitStatus=255
Type=notify

[Install]
WantedBy=multi-user.target
Alias=sshd.service
```
#### Tag meaning:

After/Before: the order of the service should be, after or before a list of services;

Type: can be `simple/forking/oneshot/dbus/notify/idle`

Restart: can be set in [Service], to indicate how systemd should restart this service,
```
  no: no restart
  on-success: will restart when exit code is 0, normal exit;
  on-failure: exit code is not 0
  on-abnormal: temSignal or timeout, will restart
  on-abort: ¯\_(ツ)_/¯
  on-watchdog: timeout exiting, will restart
  always: always
```
[linux-fs-hier-link]: https://www.freedesktop.org/software/systemd/man/file-hierarchy.html
[sysd-explain-link]: http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html
