---
layout: post
title:  "Burn iso to USB sticker from mac via dd command"
lang: en
icon: B
category: linux
tags: diskutil
comments: true
---

# How to burn iso file to usb sticker
1. Type command `$ diskutil list` to list both external/internal disks, whole disks and partitions, the result should be something like below:
```
    $ diskutil list
    /dev/disk0 (internal):
       #:                       TYPE NAME                    SIZE       IDENTIFIER
       0:      GUID_partition_scheme                         251.0 GB   disk0
       1:                        EFI EFI                     314.6 MB   disk0s1
       2:                 Apple_APFS Container disk1         250.7 GB   disk0s2

    /dev/disk1 (synthesized):
       #:                       TYPE NAME                    SIZE       IDENTIFIER
       0:      APFS Container Scheme -                      +250.7 GB   disk1
                                     Physical Store disk0s2
       1:                APFS Volume Macintosh HD            193.9 GB   disk1s1
       2:                APFS Volume Preboot                 18.6 MB    disk1s2
       3:                APFS Volume Recovery                506.6 MB   disk1s3
       4:                APFS Volume VM                      3.2 GB     disk1s4

    /dev/disk2 (external, physical):
       #:                       TYPE NAME                    SIZE       IDENTIFIER
       0:      GUID_partition_scheme                        *7.8 GB     disk2
       1:                        EFI EFI                     209.7 MB   disk2s1
       2:                  Apple_HFS alba                    7.4 GB     disk2s2
```
2. Unmonut the target volumn using the following command
`sudo diskutil umount /dev/(IDENTIFIER)` disk2s2 in my case

3. You are now ready to format the usb sticker and burn iso file in to USB volumn:
`sudo dd if=/path/image.iso of=/dev/r(IDENTIFIER) bs=1m`, if the image is compressed, an example will be `unxz -c $compressed.img.xz | dd of=/dev/r(IDENTIFIER)`

Note: have the `r(raw)` before the identifier just speedup the process, totally optional.
There is no percentage of the prograss, but you can type `ctrl + T` to view the status at any point.
