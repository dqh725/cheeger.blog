---
layout: post
title:  "Compress/Extract commands"
lang: en
icon: B
category: linux
tags: tar, zip, ux
comments: true
---

# Introduction
A quick guide to compress files/folders by command

# tar
To create `.tar.gz` or `.tgz` archive files, also called `tarballs`.
## to compress an entire folder or a single file
    tar -czvf archive.tar.gz /path/to/directory-or-file

The options:

    - -c: create an archive
    - -z: compress the archive with gzip
    - -v: Display progress during the creating.
    - -f: allow you to specify the filename of output file

compress a folder into a file:

     tar -czvf archive.tar.gz stuff

compress multiple folders at once

    tar -czvf archive.tar.gz /folder1 /folder2 /folder3

compress with exclude f/d

    tar -czvf archive.tar.gz /folder --exclude=*.mp4 -exclude=/folder/sub

compress harder with bzip2 instead of gzip

    tar -cjvf archive.tar.bz2 /folder

extract from a `.tar/.tar.gz`

    tar -xzvf archive.tar.gz

extract to a new location

    tar -xzvf archive.tar.gz -C /path/to/new

extract from a `.tar.bz2`

    tar -xjvf archive.tar.gz

# xz
compress a folder(even harder)

    tar -cJvf etc.tar.xz /folder

extract from a `tar.xz` file

    xz -d file.tar.xz
OR
    unxz file.tar.xz

# zip
Zip format is natively supported on Windows, this one is especially present in cross-platform environments

compress a list of file

    zip archive.zip file1 file2 file3

compress multiple folders

    zip archive.zip -r /folder1 -r /folder2

compress with exclude

    zip archive.zip file -r /folder -x /folder/sub/\* -x /folder/another-sub/file
